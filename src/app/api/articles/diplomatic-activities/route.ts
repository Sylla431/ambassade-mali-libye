import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/articles/diplomatic-activities - Récupérer les articles d'activités diplomatiques
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '4')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Récupérer les articles de la catégorie "Activités diplomatiques"
    const articles = await prisma.article.findMany({
      where: {
        published: true,
        category: {
          name: 'Activités diplomatiques'
        }
      },
      include: {
        category: true,
        author: {
          select: {
            name: true
          }
        },
        gallery: {
          select: {
            id: true,
            mediaUrl: true,
            caption: true,
            order: true
          },
          orderBy: {
            order: 'asc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    // Compter le total d'articles de cette catégorie
    const total = await prisma.article.count({
      where: {
        published: true,
        category: {
          name: 'Activités diplomatiques'
        }
      }
    })

    // Formater les articles pour l'affichage
    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || article.content?.substring(0, 150) + '...',
      imageUrl: article.imageUrl || article.gallery?.[0]?.mediaUrl || null,
      author: article.author?.name || 'Service de Communication',
      date: article.createdAt,
      category: article.category?.name || 'Non classé',
      readTime: '5 min', // Estimation basée sur la longueur du contenu
      featured: article.featured || false,
      slug: article.slug
    }))

    return NextResponse.json({
      success: true,
      data: {
        articles: formattedArticles,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des articles diplomatiques:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
