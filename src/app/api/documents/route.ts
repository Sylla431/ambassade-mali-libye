import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, getPaginationParams, createPaginationResponse } from '@/utils/api'

// GET /api/documents - Récupérer tous les documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, search, category } = getPaginationParams(searchParams)
    const publicOnly = searchParams.get('public') === 'true'

    const where: any = {}
    
    if (publicOnly) {
      where.isPublic = true
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { fileName: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (category) {
      where.category = category
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          author: {
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
      prisma.document.count({ where })
    ])

    const response = createPaginationResponse(documents, total, page, limit)
    return successResponse(response)

  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
}

// Note: Pour créer des documents, utilisez /api/upload/documents
