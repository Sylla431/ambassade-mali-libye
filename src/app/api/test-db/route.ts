import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/test-db - Test de connexion à la base de données
export async function GET(request: NextRequest) {
  try {
    console.log('=== TEST DE CONNEXION BASE DE DONNÉES ===')
    
    // Test 1: Connexion basique
    console.log('1. Test de connexion basique...')
    const dbTest = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Connexion basique OK:', dbTest)

    // Test 2: Vérification des tables
    console.log('2. Vérification des tables...')
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('✅ Tables disponibles:', tables)

    // Test 3: Test de la table Article
    console.log('3. Test de la table Article...')
    const articleCount = await prisma.article.count()
    console.log('✅ Nombre d\'articles:', articleCount)

    // Test 4: Récupération d'un article
    console.log('4. Récupération d\'un article...')
    const firstArticle = await prisma.article.findFirst({
      select: {
        id: true,
        title: true,
        createdAt: true
      }
    })
    console.log('✅ Premier article:', firstArticle)

    // Test 5: Test avec includes
    console.log('5. Test avec includes...')
    const articleWithIncludes = await prisma.article.findFirst({
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        category: true
      }
    })
    console.log('✅ Article avec includes:', articleWithIncludes ? 'OK' : 'Aucun article')

    const response = {
      success: true,
      message: 'Tous les tests de base de données ont réussi',
      data: {
        connection: 'OK',
        tables: tables,
        articleCount: articleCount,
        firstArticle: firstArticle,
        articleWithIncludes: articleWithIncludes ? 'OK' : 'Aucun article'
      }
    }

    console.log('=== FIN DES TESTS ===')
    return NextResponse.json(response)

  } catch (error) {
    console.error('=== ERREUR DANS LE TEST DE BASE DE DONNÉES ===')
    console.error('Erreur:', error)
    console.error('Type:', typeof error)
    console.error('Message:', error instanceof Error ? error.message : 'Erreur inconnue')
    console.error('Stack:', error instanceof Error ? error.stack : 'Pas de stack trace')
    console.error('=== FIN DE L\'ERREUR ===')

    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur de base de données',
        details: {
          message: error instanceof Error ? error.message : 'Erreur inconnue',
          type: typeof error,
          stack: error instanceof Error ? error.stack : undefined
        }
      },
      { status: 500 }
    )
  }
}
