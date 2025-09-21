import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createVisaApplicationSchema } from '@/utils/validation'
import { successResponse, errorResponse, validationErrorResponse, getPaginationParams, createPaginationResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// GET /api/visa - Récupérer toutes les demandes de visa (admin seulement)
export const GET = withAuth(async (request) => {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit, search, status } = getPaginationParams(searchParams)

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { passportNumber: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [applications, total] = await Promise.all([
      prisma.visaApplication.findMany({
        where,
        include: {
          processor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.visaApplication.count({ where })
    ])

    const response = createPaginationResponse(applications, total, page, limit)
    return successResponse(response)

  } catch (error) {
    console.error('Erreur lors de la récupération des demandes de visa:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})

// POST /api/visa - Créer une nouvelle demande de visa (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation des données
    const validationResult = createVisaApplicationSchema.safeParse(body)
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.errors)
    }

    const applicationData = validationResult.data

    // Vérifier si une demande existe déjà avec ce numéro de passeport
    const existingApplication = await prisma.visaApplication.findFirst({
      where: {
        passportNumber: applicationData.passportNumber,
        status: {
          in: ['PENDING', 'UNDER_REVIEW']
        }
      }
    })

    if (existingApplication) {
      return errorResponse('Une demande de visa est déjà en cours pour ce numéro de passeport', 400)
    }

    // Créer la demande de visa
    const application = await prisma.visaApplication.create({
      data: {
        ...applicationData,
        entryDate: new Date(applicationData.entryDate),
        exitDate: new Date(applicationData.exitDate)
      }
    })

    // TODO: Envoyer un email de confirmation
    // TODO: Envoyer une notification aux administrateurs

    return successResponse(application, 'Demande de visa soumise avec succès')

  } catch (error) {
    console.error('Erreur lors de la création de la demande de visa:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
}
