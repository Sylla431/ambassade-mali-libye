import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Stockage temporaire des chunks en mémoire (en production, utiliser Redis)
const chunkStorage = new Map<string, { chunks: Map<number, Buffer>, metadata: any }>()

// POST /api/upload/documents-chunk-v2 - Upload par chunks amélioré
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Token d\'authentification invalide' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const chunk = formData.get('chunk') as File
    const fileName = formData.get('fileName') as string
    const fileSize = parseInt(formData.get('fileSize') as string)
    const fileType = formData.get('fileType') as string
    const chunkIndex = parseInt(formData.get('chunkIndex') as string)
    const totalChunks = parseInt(formData.get('totalChunks') as string)
    const uploadId = formData.get('uploadId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    
    if (!chunk || !fileName || !fileSize || !fileType || chunkIndex === undefined || totalChunks === undefined || !uploadId) {
      return NextResponse.json(
        { success: false, error: 'Paramètres manquants pour l\'upload par chunks' },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ]
    
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { success: false, error: `Type de fichier non autorisé: ${fileType}` },
        { status: 400 }
      )
    }

    // Vérifier la taille totale du fichier (max 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (fileSize > maxSize) {
      return NextResponse.json(
        { success: false, error: `Fichier trop volumineux: ${(fileSize / 1024 / 1024).toFixed(1)}MB. Maximum autorisé: 100MB` },
        { status: 400 }
      )
    }

    // Convertir le chunk en Buffer
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer())
    
    // Initialiser le stockage pour cet upload si nécessaire
    if (!chunkStorage.has(uploadId)) {
      chunkStorage.set(uploadId, {
        chunks: new Map(),
        metadata: {
          fileName,
          fileSize,
          fileType,
          totalChunks,
          title,
          description,
          category,
          authorId: decoded.id
        }
      })
    }

    // Stocker le chunk
    const uploadData = chunkStorage.get(uploadId)!
    uploadData.chunks.set(chunkIndex, chunkBuffer)

    console.log(`Chunk ${chunkIndex + 1}/${totalChunks} reçu pour ${fileName} (${chunkBuffer.length} bytes)`)

    // Si c'est le dernier chunk, reconstituer le fichier
    if (chunkIndex === totalChunks - 1) {
      try {
        console.log(`Reconstitution du fichier ${fileName}...`)
        
        // Vérifier qu'on a tous les chunks
        if (uploadData.chunks.size !== totalChunks) {
          return NextResponse.json(
            { success: false, error: `Chunks manquants: ${uploadData.chunks.size}/${totalChunks}` },
            { status: 400 }
          )
        }

        // Reconstituer le fichier complet
        const chunks = []
        for (let i = 0; i < totalChunks; i++) {
          const chunk = uploadData.chunks.get(i)
          if (!chunk) {
            return NextResponse.json(
              { success: false, error: `Chunk ${i} manquant` },
              { status: 400 }
            )
          }
          chunks.push(chunk)
        }

        const fullFileBuffer = Buffer.concat(chunks)
        console.log(`Fichier reconstitué: ${fullFileBuffer.length} bytes`)

        // Créer un objet File à partir du buffer
        const fullFile = new File([fullFileBuffer], fileName, { type: fileType })

        // Upload vers Vercel Blob Storage
        const timestamp = Date.now()
        const blobFileName = `document-${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        
        const blob = await put(blobFileName, fullFile, {
          access: 'public',
          contentType: fileType
        })

        console.log(`Fichier uploadé vers Blob Storage: ${blob.url}`)

        // Créer l'entrée dans la base de données
        const document = await prisma.document.create({
          data: {
            title: title || fileName.replace(/\.[^/.]+$/, ''),
            description: description || '',
            fileUrl: blob.url,
            fileName: fileName,
            fileSize: fileSize,
            mimeType: fileType,
            category: (category as any) || 'LEGAL_DOCUMENTS',
            isPublic: true,
            authorId: decoded.id
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        })

        // Nettoyer le stockage temporaire
        chunkStorage.delete(uploadId)

        return NextResponse.json({
          success: true,
          completed: true,
          data: document,
          message: 'Fichier uploadé avec succès vers Vercel Blob Storage'
        })

      } catch (error) {
        console.error('Erreur lors de la reconstitution du fichier:', error)
        
        // Nettoyer le stockage temporaire en cas d'erreur
        chunkStorage.delete(uploadId)
        
        return NextResponse.json(
          { 
            success: false, 
            error: 'Erreur lors de la reconstitution du fichier',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
          },
          { status: 500 }
        )
      }
    }

    // Chunk reçu avec succès
    return NextResponse.json({
      success: true,
      completed: false,
      chunkIndex: chunkIndex,
      totalChunks: totalChunks,
      progress: Math.round(((chunkIndex + 1) / totalChunks) * 100),
      message: `Chunk ${chunkIndex + 1}/${totalChunks} reçu`
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload par chunks:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json(
      { 
        success: false, 
        error: `Erreur interne du serveur: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
