import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createGalleryImageSchema } from '@/utils/validation'
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'

// GET /api/events/[id]/gallery - Récupérer la galerie d'un événement
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si l'événement existe
    const event = await prisma.event.findUnique({
      where: { id: params.id }
    })

    if (!event) {
      return notFoundResponse()
    }

    // Récupérer les images de la galerie
    const gallery = await prisma.eventGallery.findMany({
      where: { eventId: params.id },
      orderBy: { order: 'asc' }
    })

    return successResponse(gallery)

  } catch (error) {
    console.error('Erreur lors de la récupération de la galerie:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
}

// POST /api/events/[id]/gallery - Ajouter une image à la galerie (admin seulement)
export const POST = withAuth(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json()

    // Vérifier si l'événement existe
    const event = await prisma.event.findUnique({
      where: { id: params.id }
    })

    if (!event) {
      return notFoundResponse()
    }

    // Validation des données
    const validationResult = createGalleryImageSchema.safeParse(body)
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.errors)
    }

    const imageData = validationResult.data

    // Créer l'image dans la galerie
    const galleryImage = await prisma.eventGallery.create({
      data: {
        ...imageData,
        eventId: params.id,
        order: imageData.order || 0
      }
    })

    return successResponse(galleryImage, 'Image ajoutée à la galerie avec succès')

  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'image à la galerie:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})
