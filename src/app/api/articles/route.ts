import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/articles - Récupérer tous les articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const search = searchParams.get('search') || undefined
    const category = searchParams.get('category') || undefined
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

    const totalPages = Math.ceil(total / limit)
    
    const response = {
      success: true,
      data: {
        articles,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

// POST /api/articles - Créer un nouvel article (désactivé temporairement)
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Création d\'articles temporairement désactivée pour maintenance' 
    },
    { status: 503 }
  )
}
