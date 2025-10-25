import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateEventSchema } from '@/utils/validation'
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/events/[id] - Récupérer un événement par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true
          }
        },
        gallery: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!event) {
      return notFoundResponse()
    }

    return successResponse(event)

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
}

// PUT /api/events/[id] - Mettre à jour un événement
export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json()

    // Vérifier si l'événement existe
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id }
    })

    if (!existingEvent) {
      return notFoundResponse()
    }

    // Validation des données
    const validationResult = updateEventSchema.safeParse({
      ...body,
      id: params.id
    })
    
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.errors)
    }

    const eventData = validationResult.data

    // Mettre à jour l'événement
    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        title: eventData.title,
        titleAr: eventData.titleAr,
        description: eventData.description,
        descriptionAr: eventData.descriptionAr,
        location: eventData.location,
        startDate: eventData.startDate ? new Date(eventData.startDate) : undefined,
        endDate: eventData.endDate ? new Date(eventData.endDate) : undefined,
        isRecurring: eventData.isRecurring,
        imageUrl: eventData.imageUrl,
        published: eventData.published,
        categoryId: eventData.categoryId || null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true
          }
        },
        gallery: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return successResponse(event, 'Événement mis à jour avec succès')

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})

// DELETE /api/events/[id] - Supprimer un événement
export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    // Vérifier si l'événement existe
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id }
    })

    if (!existingEvent) {
      return notFoundResponse()
    }

    // Supprimer l'événement (les images de galerie seront supprimées automatiquement via onDelete: Cascade)
    await prisma.event.delete({
      where: { id: params.id }
    })

    return successResponse(null, 'Événement supprimé avec succès')

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})
