import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Schéma de validation pour la création d'une catégorie
const createCategorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().default(true)
})

// GET /api/categories - Récupérer toutes les catégories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const isActive = searchParams.get('isActive')
    const includeCounts = searchParams.get('includeCounts') === 'true'

    const where = isActive !== null ? { isActive: isActive === 'true' } : {}

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: 'asc' },
      include: includeCounts ? {
        _count: {
          select: {
            articles: { where: { published: true } },
            events: { where: { published: true } }
          }
        }
      } : undefined
    })

    return NextResponse.json({
      success: true,
      data: categories,
      message: 'Catégories récupérées avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la récupération des catégories',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

// POST /api/categories - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createCategorySchema.parse(body)

    // Vérifier si une catégorie avec ce nom existe déjà
    const existingCategory = await prisma.category.findUnique({
      where: { name: validatedData.name }
    })

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: 'Une catégorie avec ce nom existe déjà'
        },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: validatedData
    })

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Catégorie créée avec succès'
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error)
    
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
        message: 'Erreur lors de la création de la catégorie',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
