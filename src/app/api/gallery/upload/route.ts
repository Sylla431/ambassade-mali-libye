import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
// Augmenter la limite de taille pour les uploads de vidéos
export const maxDuration = 300 // secondes

// POST /api/gallery/upload - Upload d'images vers Vercel Blob Storage
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const articleId = formData.get('articleId') as string
    const altText = formData.get('altText') as string
    const caption = formData.get('caption') as string
    const captionAr = formData.get('captionAr') as string

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Vérifier que l'article existe si articleId est fourni
    if (articleId) {
      const article = await prisma.article.findUnique({
        where: { id: articleId }
      })

      if (!article) {
        return NextResponse.json(
          { success: false, error: 'Article non trouvé' },
          { status: 404 }
        )
      }
    }

    const uploadedImages = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validation du type de fichier
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
      ]
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `Type de fichier non autorisé: ${file.type}` },
          { status: 400 }
        )
      }

      // Validation de la taille (max 50MB pour les vidéos, 10MB pour les images)
      // Note: Vercel limite les requêtes à 4.5MB (hobby) ou 50MB (pro)
      const isVideo = file.type.startsWith('video/')
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024 // 50MB pour vidéos, 10MB pour images
      if (file.size > maxSize) {
        const maxSizeMB = isVideo ? '50MB' : '10MB'
        return NextResponse.json(
          { success: false, error: `Fichier trop volumineux: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum autorisé: ${maxSizeMB}` },
          { status: 400 }
        )
      }

      try {
        // Générer un nom de fichier unique
        const timestamp = Date.now()
        const fileExtension = file.name.split('.').pop()
        const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

        // Upload vers Vercel Blob Storage
        const blob = await put(fileName, file, {
          access: 'public',
          contentType: file.type
        })

        // Si c'est pour un article, créer l'entrée dans la galerie
        // Déterminer le type de média
        const mediaType = isVideo ? 'VIDEO' : 'IMAGE'

        if (articleId) {
          const galleryMedia = await prisma.articleGallery.create({
            data: {
              articleId,
              mediaUrl: blob.url,
              mediaType: mediaType,
              altText: altText || file.name.replace(/\.[^/.]+$/, ''),
              caption: caption || file.name.replace(/\.[^/.]+$/, ''),
              captionAr: captionAr || '',
              order: i
            }
          })

          uploadedImages.push({
            id: galleryMedia.id,
            mediaUrl: blob.url,
            mediaType: mediaType,
            altText: galleryMedia.altText,
            caption: galleryMedia.caption,
            captionAr: galleryMedia.captionAr,
            order: galleryMedia.order,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
          })
        } else {
          // Média général de galerie
          uploadedImages.push({
            id: timestamp.toString(),
            mediaUrl: blob.url,
            mediaType: mediaType,
            altText: altText || file.name.replace(/\.[^/.]+$/, ''),
            caption: caption || file.name.replace(/\.[^/.]+$/, ''),
            captionAr: captionAr || '',
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadedAt: new Date().toISOString()
          })
        }

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
      data: uploadedImages,
      message: `${uploadedImages.length} image(s) uploadée(s) avec succès`
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload des images:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'upload des images' },
      { status: 500 }
    )
  }
}
