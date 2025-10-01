import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes pour les gros fichiers

// Stockage temporaire des chunks en mémoire (en production, utiliser Redis ou S3)
const chunkStorage = new Map<string, { chunks: Map<number, Buffer>, metadata: any }>()

// POST /api/gallery/upload-chunk - Upload par chunks pour vidéos volumineuses
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const chunk = formData.get('chunk') as File
    const fileName = formData.get('fileName') as string
    const fileSize = parseInt(formData.get('fileSize') as string)
    const fileType = formData.get('fileType') as string
    const chunkIndex = parseInt(formData.get('chunkIndex') as string)
    const totalChunks = parseInt(formData.get('totalChunks') as string)
    const uploadId = formData.get('uploadId') as string
    const articleId = formData.get('articleId') as string | null
    const altText = formData.get('altText') as string | null
    const caption = formData.get('caption') as string | null
    const captionAr = formData.get('captionAr') as string | null
    
    if (!chunk || !fileName || !fileSize || !fileType || chunkIndex === undefined || totalChunks === undefined || !uploadId) {
      return NextResponse.json(
        { success: false, error: 'Paramètres manquants pour l\'upload par chunks' },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
    ]
    
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { success: false, error: `Type de fichier non autorisé: ${fileType}` },
        { status: 400 }
      )
    }

    // Vérifier la taille totale du fichier (max 500MB)
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (fileSize > maxSize) {
      return NextResponse.json(
        { success: false, error: `Fichier trop volumineux: ${(fileSize / 1024 / 1024).toFixed(1)}MB. Maximum autorisé: 500MB` },
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
          articleId,
          altText,
          caption,
          captionAr
        }
      })
    }

    // Stocker le chunk
    const uploadData = chunkStorage.get(uploadId)!
    uploadData.chunks.set(chunkIndex, chunkBuffer)

    console.log(`Chunk ${chunkIndex + 1}/${totalChunks} reçu pour ${fileName} (${chunkBuffer.length} bytes)`)

    // Si tous les chunks sont reçus, reconstituer et uploader le fichier
    if (uploadData.chunks.size === totalChunks) {
      console.log(`Tous les chunks reçus pour ${fileName}, début de la reconstitution...`)
      
      try {
        // Reconstituer le fichier complet
        const orderedChunks: Buffer[] = []
        for (let i = 0; i < totalChunks; i++) {
          const chunkData = uploadData.chunks.get(i)
          if (!chunkData) {
            throw new Error(`Chunk ${i} manquant`)
          }
          orderedChunks.push(chunkData)
        }
        
        const completeFile = Buffer.concat(orderedChunks)
        console.log(`Fichier reconstitué: ${completeFile.length} bytes (attendu: ${fileSize})`)
        
        // Vérifier la taille
        if (completeFile.length !== fileSize) {
          throw new Error(`Taille du fichier incorrecte: ${completeFile.length} vs ${fileSize}`)
        }

        // Générer un nom de fichier unique
        const timestamp = Date.now()
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
        const isVideo = fileType.startsWith('video/')
        const prefix = isVideo ? 'video' : 'image'
        const uniqueFileName = articleId 
          ? `${prefix}-article-${articleId}-${timestamp}-${sanitizedFileName}`
          : `${prefix}-gallery-${timestamp}-${sanitizedFileName}`

        // Upload vers Vercel Blob Storage
        console.log(`Upload vers Vercel Blob: ${uniqueFileName}`)
        const blob = await put(uniqueFileName, completeFile, {
          access: 'public',
          contentType: fileType
        })

        console.log(`Upload réussi: ${blob.url}`)

        // Déterminer le type de média
        const mediaType = isVideo ? 'VIDEO' : 'IMAGE'

        // Créer l'entrée dans la base de données si un articleId est fourni
        let galleryEntry = null
        if (articleId) {
          galleryEntry = await prisma.articleGallery.create({
            data: {
              articleId,
              mediaUrl: blob.url,
              mediaType: mediaType,
              altText: altText || fileName.replace(/\.[^/.]+$/, ''),
              caption: caption || fileName.replace(/\.[^/.]+$/, ''),
              captionAr: captionAr || '',
              order: 0
            }
          })
        }

        // Nettoyer le stockage
        chunkStorage.delete(uploadId)

        return NextResponse.json({
          success: true,
          data: {
            mediaUrl: blob.url,
            mediaType: mediaType,
            fileName: fileName,
            fileSize: fileSize,
            galleryEntry: galleryEntry
          },
          message: 'Fichier uploadé avec succès'
        })

      } catch (error) {
        console.error('Erreur lors de la reconstitution/upload:', error)
        chunkStorage.delete(uploadId)
        return NextResponse.json(
          { success: false, error: 'Erreur lors de la reconstitution du fichier' },
          { status: 500 }
        )
      }
    }

    // Retourner la progression
    return NextResponse.json({
      success: true,
      progress: {
        chunksReceived: uploadData.chunks.size,
        totalChunks: totalChunks,
        percentage: Math.round((uploadData.chunks.size / totalChunks) * 100)
      },
      message: `Chunk ${chunkIndex + 1}/${totalChunks} reçu`
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload par chunks:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'upload par chunks' },
      { status: 500 }
    )
  }
}

