import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createContactMessageSchema } from '@/utils/validation'
import { successResponse, errorResponse, validationErrorResponse, getPaginationParams, createPaginationResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// GET /api/contact - Récupérer tous les messages de contact (admin seulement)
export const GET = withAuth(async (request) => {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit, search } = getPaginationParams(searchParams)

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.contactMessage.count({ where })
    ])

    const response = createPaginationResponse(messages, total, page, limit)
    return successResponse(response)

  } catch (error) {
    console.error('Erreur lors de la récupération des messages de contact:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
})

// POST /api/contact - Créer un nouveau message de contact (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation des données
    const validationResult = createContactMessageSchema.safeParse(body)
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.errors)
    }

    const messageData = validationResult.data

    // Créer le message
    const message = await prisma.contactMessage.create({
      data: messageData
    })

    // TODO: Envoyer un email de notification aux administrateurs
    // TODO: Envoyer un email de confirmation au contact

    return successResponse(message, 'Message envoyé avec succès')

  } catch (error) {
    console.error('Erreur lors de la création du message de contact:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
}
