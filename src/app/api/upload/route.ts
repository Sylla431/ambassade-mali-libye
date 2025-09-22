import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middleware/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST /api/upload - API d'upload générique (admin seulement)
export const POST = withAuth(async (request) => {
  try {
    const contentType = request.headers.get('content-type') || ''
    
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type doit être multipart/form-data' },
        { status: 400 }
      )
    }

    // Rediriger vers l'API d'upload d'images par défaut
    const uploadUrl = new URL('/api/upload/images', request.url)
    
    // Créer une nouvelle requête avec les mêmes données
    const newRequest = new Request(uploadUrl.toString(), {
      method: 'POST',
      headers: request.headers,
      body: request.body
    })

    // Appeler l'API d'upload d'images
    const response = await fetch(newRequest)
    const data = await response.json()

    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
})