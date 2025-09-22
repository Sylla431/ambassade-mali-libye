import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Test de connexion simple
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    // Test de lecture des documents
    const documents = await prisma.document.findMany({
      take: 3,
      select: {
        id: true,
        title: true,
        category: true,
        isPublic: true
      }
    })
    
    return NextResponse.json({
      success: true,
      database: {
        connection: '✅ Connexion réussie',
        testQuery: result,
        documentsCount: documents.length,
        sampleDocuments: documents
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
