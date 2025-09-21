import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAnnouncementSchema } from '@/utils/validation'
import { successResponse, errorResponse, validationErrorResponse, getPaginationParams, createPaginationResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'

// GET /api/announcements - Récupérer toutes les annonces
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit, search } = getPaginationParams(searchParams)
    const active = searchParams.get('active') === 'true'

    const where: any = {}
    
    if (active) {
      where.isActive = true
      where.OR = [
        { endDate: null },
        { endDate: { gte: new Date() } }
      ]
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.announcement.count({ where })
    ])

    const response = createPaginationResponse(announcements, total, page, limit)
    return successResponse(response)

  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
}

// POST /api/announcements - Créer une nouvelle annonce
export const POST = withAuth(async (request) => {
  try {
    const body = await request.json()

    // Validation des données
    const validationResult = createAnnouncementSchema.safeParse(body)
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.errors)
    }

    const announcementData = validationResult.data

    // Créer l'annonce
    const announcement = await prisma.announcement.create({
      data: {
        ...announcementData,
        startDate: announcementData.startDate ? new Date(announcementData.startDate) : new Date(),
        endDate: announcementData.endDate ? new Date(announcementData.endDate) : null
      }
    })

    return successResponse(announcement, 'Annonce créée avec succès')

  } catch (error) {
    console.error('Erreur lors de la création de l\'annonce:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})
