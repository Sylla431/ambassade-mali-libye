import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateGalleryImageSchema } from '@/utils/validation'
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'

// GET /api/events/[id]/gallery/[imageId] - Récupérer une image de la galerie
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const galleryImage = await prisma.eventGallery.findFirst({
      where: {
        id: params.imageId,
        eventId: params.id
      }
    })

    if (!galleryImage) {
      return notFoundResponse()
    }

    return successResponse(galleryImage)

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
}

// PUT /api/events/[id]/gallery/[imageId] - Mettre à jour une image de la galerie (admin seulement)
export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) => {
  try {
    const body = await request.json()

    // Vérifier si l'image existe
    const existingImage = await prisma.eventGallery.findFirst({
      where: {
        id: params.imageId,
        eventId: params.id
      }
    })

    if (!existingImage) {
      return notFoundResponse()
    }

    // Validation des données
    const validationResult = updateGalleryImageSchema.safeParse({
      ...body,
      id: params.imageId
    })
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.errors)
    }

    const updateData = validationResult.data

    // Mettre à jour l'image
    const galleryImage = await prisma.eventGallery.update({
      where: { id: params.imageId },
      data: {
        altText: updateData.altText,
        caption: updateData.caption,
        captionAr: updateData.captionAr,
        order: updateData.order
      }
    })

    return successResponse(galleryImage, 'Image mise à jour avec succès')

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'image:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})

// DELETE /api/events/[id]/gallery/[imageId] - Supprimer une image de la galerie (admin seulement)
export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) => {
  try {
    // Vérifier si l'image existe
    const existingImage = await prisma.eventGallery.findFirst({
      where: {
        id: params.imageId,
        eventId: params.id
      }
    })

    if (!existingImage) {
      return notFoundResponse()
    }

    // Supprimer l'image
    await prisma.eventGallery.delete({
      where: { id: params.imageId }
    })

    return successResponse(null, 'Image supprimée de la galerie avec succès')

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})
