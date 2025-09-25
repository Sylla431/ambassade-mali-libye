import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
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
        const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

        // Upload vers Vercel Blob Storage
        const blob = await put(fileName, file, {
          access: 'public',
          contentType: file.type
        })

        // Si c'est pour un article, créer l'entrée dans la galerie
        if (articleId) {
          const galleryImage = await prisma.articleGallery.create({
            data: {
              articleId,
              imageUrl: blob.url,
              altText: altText || file.name.replace(/\.[^/.]+$/, ''),
              caption: caption || file.name.replace(/\.[^/.]+$/, ''),
              captionAr: captionAr || '',
              order: i
            }
          })

          uploadedImages.push({
            id: galleryImage.id,
            imageUrl: blob.url,
            altText: galleryImage.altText,
            caption: galleryImage.caption,
            captionAr: galleryImage.captionAr,
            order: galleryImage.order,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
          })
        } else {
          // Image générale de galerie
          uploadedImages.push({
            id: timestamp.toString(),
            imageUrl: blob.url,
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
