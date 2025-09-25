import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/documents/check-blob - Vérifier la configuration Blob Storage
export async function GET(request: NextRequest) {
  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN
    
    return NextResponse.json({
      success: true,
      data: {
        blobTokenConfigured: !!blobToken,
        blobTokenLength: blobToken ? blobToken.length : 0,
        environment: process.env.NODE_ENV,
        message: blobToken 
          ? 'Vercel Blob Storage est configuré' 
          : 'Vercel Blob Storage n\'est pas configuré - BLOB_READ_WRITE_TOKEN manquant'
      }
    })

  } catch (error) {
    console.error('Erreur lors de la vérification Blob Storage:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la vérification',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
