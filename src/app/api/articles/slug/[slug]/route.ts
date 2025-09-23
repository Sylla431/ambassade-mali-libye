import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const article = await prisma.article.findFirst({
      where: {
        slug: slug,
        published: true
      },
      include: {
        author: {
          select: {
            name: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            color: true
          }
        },
        gallery: {
          select: {
            id: true,
            imageUrl: true,
            altText: true,
            caption: true,
            captionAr: true,
            order: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: article
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
