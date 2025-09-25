import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/articles-minimal - Version ultra-simplifiée
export async function GET(request: NextRequest) {
  try {
    console.log('=== API ARTICLES MINIMAL ===')
    
    // Test sans Prisma du tout
    const response = {
      success: true,
      message: 'API minimal fonctionne',
      data: {
        articles: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      }
    }

    console.log('✅ Réponse préparée sans Prisma')
    return NextResponse.json(response)

  } catch (error) {
    console.error('=== ERREUR DANS API MINIMAL ===')
    console.error('Erreur:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur dans API minimal',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
