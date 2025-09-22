import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Test direct de la galerie
    const article = await prisma.article.findFirst({
      where: {
        title: {
          contains: "Journée Culturelle"
        }
      },
      include: {
        gallery: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })
    
    if (!article) {
      return NextResponse.json({
        success: false,
        error: 'Article non trouvé'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: {
        articleId: article.id,
        title: article.title,
        galleryCount: article.gallery.length,
        gallery: article.gallery
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}
