import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/articles/[id]/gallery - Récupérer la galerie d'un article
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = params.id

    const gallery = await prisma.articleGallery.findMany({
      where: { articleId },
      select: {
        id: true,
        mediaUrl: true,
        mediaType: true,
        altText: true,
        caption: true,
        captionAr: true,
        order: true
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: gallery
    })

  } catch (error) {
    console.error('Erreur lors de la récupération de la galerie:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération de la galerie' },
      { status: 500 }
    )
  }
}

// POST /api/articles/[id]/gallery - Ajouter une image à la galerie d'un article
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = params.id
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const altText = formData.get('altText') as string
    const caption = formData.get('caption') as string
    const captionAr = formData.get('captionAr') as string

    // Vérifier que l'article existe
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    })

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
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
        // Importer put depuis @vercel/blob
        const { put } = await import('@vercel/blob')
        
        // Générer un nom de fichier unique
        const timestamp = Date.now()
        const fileName = `gallery-${articleId}-${timestamp}-${i}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

        // Upload vers Vercel Blob Storage
        const blob = await put(fileName, file, {
          access: 'public',
          contentType: file.type
        })

        // Déterminer le type de média
        const mediaType = isVideo ? 'VIDEO' : 'IMAGE'

        // Créer le média de galerie
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

        uploadedImages.push(galleryMedia)

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
      message: `${uploadedImages.length} média(s) ajouté(s) à la galerie avec succès`
    })

  } catch (error) {
    console.error('Erreur lors de l\'ajout du média à la galerie:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'ajout du média' },
      { status: 500 }
    )
  }
}