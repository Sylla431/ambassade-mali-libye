import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'

// DELETE /api/articles/[id]/gallery/[imageId] - Supprimer une image de la galerie
export const DELETE = withAuth(async (
  request: NextRequest,
  context: { params: { id: string; imageId: string } }
) => {
  try {
    const { params } = context
    const { id: articleId, imageId } = params

    // Vérifier que l'image appartient à l'article
    const galleryImage = await prisma.articleGallery.findFirst({
      where: {
        id: imageId,
        articleId: articleId
      }
    })

    if (!galleryImage) {
      return errorResponse('Image non trouvée', 404)
    }

    // Supprimer l'image
    await prisma.articleGallery.delete({
      where: { id: imageId }
    })

    return successResponse(null, 'Image supprimée de la galerie avec succès')

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error)
    return errorResponse('Erreur lors de la suppression de l\'image', 500)
  }
})

// PUT /api/articles/[id]/gallery/[imageId] - Mettre à jour une image de la galerie
export const PUT = withAuth(async (
  request: NextRequest,
  context: { params: { id: string; imageId: string } }
) => {
  try {
    const { params } = context
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
      return errorResponse('Image non trouvée', 404)
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

    return successResponse(updatedImage, 'Image mise à jour avec succès')

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'image:', error)
    return errorResponse('Erreur lors de la mise à jour de l\'image', 500)
  }
})