// Test simple pour vérifier le hook useArticles
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testArticlesAPI() {
  console.log('🧪 Test de l\'API Articles...')

  try {
    // Test direct de l'API
    const response = await fetch('http://localhost:3000/api/articles?page=1&limit=6&published=true')
    const data = await response.json()
    
    console.log('📊 Status:', response.status)
    console.log('📄 Response:', JSON.stringify(data, null, 2))
    
    if (data.success && data.data) {
      console.log('✅ Articles trouvés:', data.data.data.length)
      console.log('📊 Pagination:', data.data.pagination)
    } else {
      console.log('❌ Erreur API:', data.message)
    }
    
  } catch (error) {
    console.error('❌ Erreur de test:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testArticlesAPI()
