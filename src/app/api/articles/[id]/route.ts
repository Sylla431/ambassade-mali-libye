import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/articles/[id] - Récupérer un article par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        gallery: {
          orderBy: { order: 'asc' }
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

// PUT /api/articles/[id] - Mettre à jour un article
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, content, excerpt, imageUrl, published, slug, categoryId } = body

    // Vérifier si l'article existe
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id }
    })

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si le slug existe déjà (si modifié)
    if (slug && slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug: slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Un article avec ce slug existe déjà' },
          { status: 400 }
        )
      }
    }

    // Mettre à jour l'article
    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        title,
        content,
        excerpt,
        imageUrl,
        published,
        slug,
        categoryId,
        publishedAt: published && !existingArticle.published ? new Date() : existingArticle.publishedAt
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        gallery: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: article,
      message: 'Article mis à jour avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/articles/[id] - Supprimer un article
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si l'article existe
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id }
    })

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer l'article
    await prisma.article.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Article supprimé avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
