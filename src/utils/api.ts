import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types/api'

export function successResponse<T>(data: T, message?: string): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message
  } as ApiResponse<T>)
}

export function errorResponse(error: string, status: number = 400): NextResponse {
  return NextResponse.json({
    success: false,
    error
  } as ApiResponse, { status })
}

export function validationErrorResponse(errors: any[]): NextResponse {
  return NextResponse.json({
    success: false,
    error: 'Erreur de validation',
    details: errors
  } as ApiResponse, { status: 400 })
}

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json({
    success: false,
    error: 'Non autorisé'
  } as ApiResponse, { status: 401 })
}

export function forbiddenResponse(): NextResponse {
  return NextResponse.json({
    success: false,
    error: 'Accès interdit'
  } as ApiResponse, { status: 403 })
}

export function notFoundResponse(): NextResponse {
  return NextResponse.json({
    success: false,
    error: 'Ressource non trouvée'
  } as ApiResponse, { status: 404 })
}

export function serverErrorResponse(): NextResponse {
  return NextResponse.json({
    success: false,
    error: 'Erreur interne du serveur'
  } as ApiResponse, { status: 500 })
}

// Utilitaires pour la pagination
export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
  const search = searchParams.get('search') || undefined
  const category = searchParams.get('category') || undefined
  const status = searchParams.get('status') || undefined

  return { page, limit, search, category, status }
}

export function createPaginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit)
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  }
}

// Utilitaires pour les slugs
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/-+/g, '-') // Supprimer les tirets multiples
    .trim()
}

// Utilitaires pour les fichiers
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function isValidImageType(mimeType: string): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return validTypes.includes(mimeType)
}

export function isValidDocumentType(mimeType: string): boolean {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]
  return validTypes.includes(mimeType)
}
