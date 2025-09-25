import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// DELETE /api/articles/[id]/gallery/[imageId] - Supprimer une image de la galerie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const { id: articleId, imageId } = params

    // Vérifier que l'image appartient à l'article
    const galleryImage = await prisma.articleGallery.findFirst({
      where: {
        id: imageId,
        articleId: articleId
      }
    })

    if (!galleryImage) {
      return NextResponse.json(
        { success: false, error: 'Image non trouvée' },
        { status: 404 }
      )
    }

    // Supprimer l'image
    await prisma.articleGallery.delete({
      where: { id: imageId }
    })

    return NextResponse.json({
      success: true,
      message: 'Image supprimée de la galerie avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression de l\'image' },
      { status: 500 }
    )
  }
}

// PUT /api/articles/[id]/gallery/[imageId] - Mettre à jour une image de la galerie
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const { id: articleId, imageId } = params
    const body = await request.json()
    const { altText, caption, captionAr, order } = body

    // Vérifier que l'image appartient à l'article
    const galleryImage = await prisma.articleGallery.findFirst({
      where: {
        id: imageId,
        articleId: articleId
      }
    })

    if (!galleryImage) {
      return NextResponse.json(
        { success: false, error: 'Image non trouvée' },
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