import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateArticleSchema } from '@/utils/validation'
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse } from '@/utils/api'
import { withAuth, AuthenticatedRequest } from '@/middleware/auth'

// GET /api/articles/[id] - Récupérer un article par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        gallery: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!article) {
      return notFoundResponse()
    }

    return successResponse(article)

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
}

// PUT /api/articles/[id] - Mettre à jour un article
export const PUT = withAuth(async (
  request: AuthenticatedRequest,
  context: { params: { id: string } }
) => {
  const { params } = context
  try {
    const body = await request.json()
    const user = request.user!

    // Validation des données
    const validationResult = updateArticleSchema.safeParse({
      ...body,
      id: params.id
    })
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.errors)
    }

    const updateData = validationResult.data

    // Vérifier si l'article existe
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id }
    })

    if (!existingArticle) {
      return notFoundResponse()
    }

    // Vérifier si le slug existe déjà (si modifié)
    if (updateData.slug && updateData.slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug: updateData.slug }
      })

      if (slugExists) {
        return errorResponse('Un article avec ce slug existe déjà', 400)
      }
    }

    // Mettre à jour l'article
    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        ...updateData,
        publishedAt: updateData.published && !existingArticle.published ? new Date() : existingArticle.publishedAt
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        gallery: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return successResponse(article, 'Article mis à jour avec succès')

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})

// DELETE /api/articles/[id] - Supprimer un article
export const DELETE = withAuth(async (
  request: AuthenticatedRequest,
  context: { params: { id: string } }
) => {
  const { params } = context
  try {
    // Vérifier si l'article existe
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id }
    })

    if (!existingArticle) {
      return notFoundResponse()
    }

    // Supprimer l'article
    await prisma.article.delete({
      where: { id: params.id }
    })

    return successResponse(null, 'Article supprimé avec succès')

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})
