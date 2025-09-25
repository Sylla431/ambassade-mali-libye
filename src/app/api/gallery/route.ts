import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/gallery - Récupérer toutes les images de la galerie depuis Blob Storage
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || 'all' // all, articles, events

    // Construire les conditions de recherche
    const where: any = {}
    
    if (search) {
      where.OR = [
        { altText: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
        { captionAr: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (type === 'articles') {
      where.articleId = { not: null }
    } else if (type === 'general') {
      where.articleId = null
    }

    // Récupérer les images avec pagination
    const [images, total] = await Promise.all([
      prisma.articleGallery.findMany({
        where,
        select: {
          id: true,
          imageUrl: true,
          altText: true,
          caption: true,
          captionAr: true,
          order: true,
          createdAt: true,
          article: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.articleGallery.count({ where })
    ])

    // Formater les données
    const formattedImages = images.map(image => ({
      id: image.id,
      imageUrl: image.imageUrl,
      altText: image.altText,
      caption: image.caption,
      captionAr: image.captionAr,
      order: image.order,
      createdAt: image.createdAt,
      article: image.article ? {
        id: image.article.id,
        title: image.article.title,
        slug: image.article.slug
      } : null
    }))

    return NextResponse.json({
      success: true,
      data: formattedImages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des images' },
      { status: 500 }
    )
  }
}
