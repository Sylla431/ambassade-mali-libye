import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST /api/documents/upload - Upload de documents vers Vercel Blob Storage
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
    const files = formData.getAll('files') as File[]
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const isPublic = formData.get('isPublic') === 'true'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Vérifier les types de fichiers autorisés
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

    const uploadedDocuments = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validation du type de fichier
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `Type de fichier non autorisé: ${file.type}` },
          { status: 400 }
        )
      }

      // Validation de la taille (max 10MB par fichier)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: `Fichier trop volumineux: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum autorisé: 10MB` },
          { status: 400 }
        )
      }

      try {
        // Générer un nom de fichier unique
        const timestamp = Date.now()
        const fileExtension = file.name.split('.').pop()
        const fileName = `document-${timestamp}-${i}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

        // Upload vers Vercel Blob Storage
        const blob = await put(fileName, file, {
          access: 'public',
          contentType: file.type
        })

        // Utiliser l'ID de l'utilisateur authentifié
        const authorId = decoded.id

        // Créer l'entrée dans la base de données
        const document = await prisma.document.create({
          data: {
            title: title || file.name.replace(/\.[^/.]+$/, ''),
            description: description || '',
            fileUrl: blob.url,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            category: (category as any) || 'NOTE_DE_SERVICE',
            isPublic: isPublic,
            authorId: authorId
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

        uploadedDocuments.push(document)

      } catch (uploadError) {
        console.error(`Erreur lors de l'upload de ${file.name}:`, uploadError)
        return NextResponse.json(
          { success: false, error: `Erreur lors de l'upload de ${file.name}` },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      data: uploadedDocuments,
      message: `${uploadedDocuments.length} document(s) uploadé(s) avec succès`
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload des documents:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'upload des documents' },
      { status: 500 }
    )
  }
}
