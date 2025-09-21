import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateVisaApplicationSchema } from '@/utils/validation'
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse } from '@/utils/api'
import { withAuth, AuthenticatedRequest } from '@/middleware/auth'

// GET /api/visa/[id] - Récupérer une demande de visa par ID
export const GET = withAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const application = await prisma.visaApplication.findUnique({
      where: { id: params.id },
      include: {
        processor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!application) {
      return notFoundResponse()
    }

    return successResponse(application)

  } catch (error) {
    console.error('Erreur lors de la récupération de la demande de visa:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})

// PUT /api/visa/[id] - Mettre à jour une demande de visa (admin seulement)
export const PUT = withAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json()
    const user = request.user!

    // Validation des données
    const validationResult = updateVisaApplicationSchema.safeParse({
      ...body,
      id: params.id
    })
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.errors)
    }

    const updateData = validationResult.data

    // Vérifier si la demande existe
    const existingApplication = await prisma.visaApplication.findUnique({
      where: { id: params.id }
    })

    if (!existingApplication) {
      return notFoundResponse()
    }

    // Mettre à jour la demande
    const application = await prisma.visaApplication.update({
      where: { id: params.id },
      data: {
        status: updateData.status,
        notes: updateData.notes,
        processedBy: user.id,
        processedAt: new Date()
      },
      include: {
        processor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // TODO: Envoyer un email de notification au demandeur

    return successResponse(application, 'Demande de visa mise à jour avec succès')

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la demande de visa:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})

// DELETE /api/visa/[id] - Supprimer une demande de visa (admin seulement)
export const DELETE = withAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    // Vérifier si la demande existe
    const existingApplication = await prisma.visaApplication.findUnique({
      where: { id: params.id }
    })

    if (!existingApplication) {
      return notFoundResponse()
    }

    // Supprimer la demande
    await prisma.visaApplication.delete({
      where: { id: params.id }
    })

    return successResponse(null, 'Demande de visa supprimée avec succès')

  } catch (error) {
    console.error('Erreur lors de la suppression de la demande de visa:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})
