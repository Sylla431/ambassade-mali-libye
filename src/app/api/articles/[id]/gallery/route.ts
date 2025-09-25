import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/articles/[id]/gallery - Récupérer la galerie d'un article
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = params.id

    const gallery = await prisma.articleGallery.findMany({
      where: { articleId },
      select: {
        id: true,
        imageUrl: true,
        altText: true,
        caption: true,
        captionAr: true,
        order: true
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: gallery
    })

  } catch (error) {
    console.error('Erreur lors de la récupération de la galerie:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération de la galerie' },
      { status: 500 }
    )
  }
}

// POST /api/articles/[id]/gallery - Ajouter une image à la galerie d'un article
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = params.id
    const body = await request.json()
    const { imageUrl, altText, caption, captionAr, order } = body

    // Vérifier que l'article existe
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    })

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article non trouvé' },
        { status: 404 }
      )
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

    return NextResponse.json({
      success: true,
      data: galleryImage,
      message: 'Image ajoutée à la galerie avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'image à la galerie:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'ajout de l\'image' },
      { status: 500 }
    )
  }
}