import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation pour la mise à jour d'une catégorie
const updateCategorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis').optional(),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional()
})

// GET /api/categories/[id] - Récupérer une catégorie par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            articles: { where: { published: true } },
            events: { where: { published: true } }
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Catégorie non trouvée'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Catégorie récupérée avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la récupération de la catégorie',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Mettre à jour une catégorie
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateCategorySchema.parse(body)

    // Vérifier si la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: 'Catégorie non trouvée'
        },
        { status: 404 }
      )
    }

    // Si le nom est modifié, vérifier qu'il n'existe pas déjà
    if (validatedData.name && validatedData.name !== existingCategory.name) {
      const nameExists = await prisma.category.findUnique({
        where: { name: validatedData.name }
      })

      if (nameExists) {
        return NextResponse.json(
          {
            success: false,
            message: 'Une catégorie avec ce nom existe déjà'
          },
          { status: 400 }
        )
      }
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: validatedData
    })

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Catégorie mise à jour avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Données invalides',
          errors: error.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la mise à jour de la catégorie',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Supprimer une catégorie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            articles: true,
            events: true
          }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: 'Catégorie non trouvée'
        },
        { status: 404 }
      )
    }

    // Vérifier s'il y a des articles ou événements associés
    if (existingCategory._count.articles > 0 || existingCategory._count.events > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Impossible de supprimer cette catégorie car elle est utilisée par des articles ou événements'
        },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la suppression de la catégorie',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
