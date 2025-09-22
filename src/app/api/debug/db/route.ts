import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@libsql/client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Test de connexion directe à Turso
    const client = createClient({
      url: process.env.DATABASE_URL!,
    })
    
    // Test de connexion simple
    const result = await client.execute('SELECT 1 as test')
    
    // Test de lecture des documents
    const documentsResult = await client.execute(`
      SELECT id, title, category, "isPublic" 
      FROM Document 
      WHERE "isPublic" = true 
      LIMIT 3
    `)
    
    return NextResponse.json({
      success: true,
      database: {
        connection: '✅ Connexion Turso réussie',
        testQuery: result.rows,
        documentsCount: documentsResult.rows.length,
        sampleDocuments: documentsResult.rows
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
