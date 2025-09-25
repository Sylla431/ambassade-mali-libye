import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/articles-simple - Version simplifiée pour diagnostiquer
export async function GET(request: NextRequest) {
  try {
    console.log('Début de la requête GET /api/articles-simple')
    
    const { searchParams } = request.nextUrl
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    console.log('Paramètres:', { page, limit })

    // Test de connexion à la base de données
    console.log('Test de connexion à la base de données...')
    const dbTest = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Connexion DB OK:', dbTest)

    // Récupération simple des articles
    console.log('Récupération des articles...')
    const articles = await prisma.article.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('Articles récupérés:', articles.length)

    const total = await prisma.article.count()
    console.log('Total articles:', total)

    const response = {
      success: true,
      data: {
        articles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }

    console.log('Réponse préparée')
    return NextResponse.json(response)

  } catch (error) {
    console.error('Erreur dans /api/articles-simple:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
