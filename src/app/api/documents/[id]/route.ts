import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, notFoundResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'

// GET /api/documents/[id] - Récupérer un document par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!document) {
      return notFoundResponse()
    }

    return successResponse(document)

  } catch (error) {
    console.error('Erreur lors de la récupération du document:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
}

// PUT /api/documents/[id] - Mettre à jour un document (admin seulement)
export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json()

    // Vérifier si le document existe
    const existingDocument = await prisma.document.findUnique({
      where: { id: params.id }
    })

    if (!existingDocument) {
      return notFoundResponse()
    }

    // Mettre à jour le document
    const document = await prisma.document.update({
      where: { id: params.id },
      data: body,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return successResponse(document, 'Document mis à jour avec succès')

  } catch (error) {
    console.error('Erreur lors de la mise à jour du document:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})

// DELETE /api/documents/[id] - Supprimer un document (admin seulement)
export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    // Vérifier si le document existe
    const existingDocument = await prisma.document.findUnique({
      where: { id: params.id }
    })

    if (!existingDocument) {
      return notFoundResponse()
    }

    // Supprimer le document
    await prisma.document.delete({
      where: { id: params.id }
    })

    return successResponse(null, 'Document supprimé avec succès')

  } catch (error) {
    console.error('Erreur lors de la suppression du document:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})
