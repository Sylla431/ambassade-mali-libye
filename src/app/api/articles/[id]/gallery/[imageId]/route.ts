import { NextRequest, NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// PUT /api/articles/[id]/gallery/[imageId] - Mettre à jour une image de galerie
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const { id: articleId, imageId } = params
    const body = await request.json()
    const { altText, caption, captionAr, order } = body

    // Vérifier que l'image appartient à l'article
    const image = await prisma.articleGallery.findFirst({
      where: {
        id: imageId,
        articleId: articleId
      }
    })

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image non trouvée dans cet article' },
        { status: 404 }
      )
    }

    // Mettre à jour l'image
    const updatedImage = await prisma.articleGallery.update({
      where: { id: imageId },
      data: {
        altText,
        caption,
        captionAr,
        order
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedImage,
      message: 'Image mise à jour avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'image:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour de l\'image' },
      { status: 500 }
    )
  }
}

// DELETE /api/articles/[id]/gallery/[imageId] - Supprimer une image de galerie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const { id: articleId, imageId } = params

    // Vérifier que le média appartient à l'article
    const media = await prisma.articleGallery.findFirst({
      where: {
        id: imageId,
        articleId: articleId
      },
      select: {
        id: true,
        mediaUrl: true,
        mediaType: true
      }
    })

    if (!media) {
      return NextResponse.json(
        { success: false, error: 'Média non trouvé dans cet article' },
        { status: 404 }
      )
    }

    try {
      // Supprimer le fichier de Vercel Blob Storage
      await del(media.mediaUrl)
    } catch (blobError) {
      console.warn('Impossible de supprimer le fichier de Blob Storage:', blobError)
      // On continue même si la suppression du blob échoue
    }

    // Supprimer l'entrée de la base de données
    await prisma.articleGallery.delete({
      where: { id: imageId }
    })

    return NextResponse.json({
      success: true,
      data: { deletedImageId: imageId },
      message: 'Média supprimé avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la suppression du média:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du média' },
      { status: 500 }
    )
  }
}