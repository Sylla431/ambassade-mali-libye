import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/articles - Récupérer tous les articles
export async function GET(request: NextRequest) {
  try {
    console.log('=== DÉBUT API ARTICLES ===')
    
    const { searchParams } = request.nextUrl
    console.log('Search params:', Object.fromEntries(searchParams.entries()))
    
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const search = searchParams.get('search') || undefined
    const category = searchParams.get('category') || undefined
    const published = searchParams.get('published') === 'true'

    console.log('Paramètres parsés:', { page, limit, search, category, published })

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

    console.log('Where clause:', where)

    console.log('Début de la requête Prisma...')
    
    // Test de connexion d'abord
    const dbTest = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Test connexion DB OK:', dbTest)

    // Récupération simple d'abord
    console.log('Récupération simple des articles...')
    const simpleArticles = await prisma.article.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' }
    })
    console.log('✅ Articles simples récupérés:', simpleArticles.length)

    // Test avec includes
    console.log('Test avec includes...')
    const articles = await prisma.article.findMany({
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
    })
    console.log('✅ Articles avec includes récupérés:', articles.length)

    console.log('Comptage total...')
    const total = await prisma.article.count({ where })
    console.log('✅ Total articles:', total)

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

    console.log('✅ Réponse préparée avec succès')
    console.log('=== FIN API ARTICLES ===')
    return NextResponse.json(response)

  } catch (error) {
    console.error('=== ERREUR DANS API ARTICLES ===')
    console.error('Erreur:', error)
    console.error('Type:', typeof error)
    console.error('Message:', error instanceof Error ? error.message : 'Erreur inconnue')
    console.error('Stack:', error instanceof Error ? error.stack : 'Pas de stack trace')
    console.error('=== FIN DE L\'ERREUR ===')
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur',
        details: {
          message: error instanceof Error ? error.message : 'Erreur inconnue',
          type: typeof error,
          stack: error instanceof Error ? error.stack : undefined
        }
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
