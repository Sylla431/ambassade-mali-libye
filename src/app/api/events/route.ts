import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createEventSchema } from '@/utils/validation'
import { successResponse, errorResponse, validationErrorResponse, getPaginationParams, createPaginationResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'

// GET /api/events - Récupérer tous les événements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit, search } = getPaginationParams(searchParams)
    const published = searchParams.get('published') === 'true'

    const where: any = {}
    
    if (published) {
      where.published = true
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
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
        },
        orderBy: { startDate: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.event.count({ where })
    ])

    const response = createPaginationResponse(events, total, page, limit)
    return successResponse(response)

  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
}

// POST /api/events - Créer un nouvel événement
export const POST = withAuth(async (request) => {
  try {
    const body = await request.json()
    const user = request.user!

    // Validation des données
    const validationResult = createEventSchema.safeParse(body)
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.errors)
    }

    const eventData = validationResult.data

    // Créer l'événement
    const event = await prisma.event.create({
      data: {
        ...eventData,
        startDate: new Date(eventData.startDate),
        endDate: eventData.endDate ? new Date(eventData.endDate) : null,
        authorId: user.id,
        categoryId: eventData.categoryId || null
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

    return successResponse(event, 'Événement créé avec succès')

  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})
