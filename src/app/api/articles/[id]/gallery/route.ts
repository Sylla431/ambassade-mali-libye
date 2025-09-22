import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/articles/[id]/gallery - Récupérer la galerie d'un article
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { params } = context
    const articleId = params.id

    const gallery = await prisma.articleGallery.findMany({
      where: { articleId },
      orderBy: { order: 'asc' }
    })

    return successResponse(gallery)

  } catch (error) {
    console.error('Erreur lors de la récupération de la galerie:', error)
    return errorResponse('Erreur lors de la récupération de la galerie', 500)
  }
}

// POST /api/articles/[id]/gallery - Ajouter une image à la galerie d'un article
export const POST = withAuth(async (
  request: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    const { params } = context
    const articleId = params.id
    const body = await request.json()
    const { imageUrl, altText, caption, captionAr, order } = body

    // Vérifier que l'article existe
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    })

    if (!article) {
      return errorResponse('Article non trouvé', 404)
    }

    // Créer l'image de galerie
    const galleryImage = await prisma.articleGallery.create({
      data: {
        articleId,
        imageUrl,
        altText,
        caption,
        captionAr,
        order: order || 0
      }
    })

    return successResponse(galleryImage, 'Image ajoutée à la galerie avec succès')

  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'image à la galerie:', error)
    return errorResponse('Erreur lors de l\'ajout de l\'image', 500)
  }
})