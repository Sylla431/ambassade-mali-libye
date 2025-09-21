import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createArticleSchema } from '@/utils/validation'
import { successResponse, errorResponse, validationErrorResponse, getPaginationParams, createPaginationResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// GET /api/articles - Récupérer tous les articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit, search, category } = getPaginationParams(searchParams)
    const published = searchParams.get('published') === 'true'

    const where: any = {}
    
    if (published) {
      where.published = true
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (category) {
      where.categoryId = category
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          category: true,
          gallery: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: [
          { createdAt: 'desc' },
          { id: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.article.count({ where })
    ])

    const response = createPaginationResponse(articles, total, page, limit)
    return successResponse(response)

  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
}

// POST /api/articles - Créer un nouvel article
export const POST = withAuth(async (request) => {
  try {
    const body = await request.json()
    const user = request.user!

    // Validation des données
    const validationResult = createArticleSchema.safeParse(body)
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.errors)
    }

    const articleData = validationResult.data

    // Vérifier si le slug existe déjà
    const existingArticle = await prisma.article.findUnique({
      where: { slug: articleData.slug }
    })

    if (existingArticle) {
      return errorResponse('Un article avec ce slug existe déjà', 400)
    }

    // Créer l'article
    const article = await prisma.article.create({
      data: {
        ...articleData,
        authorId: user.id,
        publishedAt: articleData.published ? new Date() : null,
        categoryId: articleData.categoryId || null
      },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      category: true,
      gallery: {
        orderBy: { order: 'asc' }
      }
    }
    })

    return successResponse(article, 'Article créé avec succès')

  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})
