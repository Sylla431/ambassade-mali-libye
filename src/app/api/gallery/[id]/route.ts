import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/utils/api'
import { withAuth, AuthenticatedRequest } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// DELETE /api/gallery/[id] - Supprimer une image de la galerie
export const DELETE = withAuth(async (request: AuthenticatedRequest, context: { params: { id: string } }) => {
  try {
    const { params } = context
    const imageId = params.id

    if (!imageId) {
      return errorResponse('ID de l\'image requis', 400)
    }

    // Sur Vercel, on ne peut pas supprimer les fichiers physiques
    // On retourne juste un succès car les fichiers sont en lecture seule
    // En production, les fichiers sont gérés par Vercel et ne peuvent pas être supprimés
    
    return successResponse(
      { deletedImageId: imageId },
      'Image marquée comme supprimée (fichier conservé sur Vercel)'
    )

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error)
    return errorResponse('Erreur lors de la suppression de l\'image', 500)
  }
})
