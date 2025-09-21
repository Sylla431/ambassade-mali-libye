// Script pour créer un article de test
async function createTestArticle() {
  try {
    // Connexion admin
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@ambassade-mali-libye.ml',
        password: 'admin123'
      })
    })

    const loginData = await loginResponse.json()
    if (!loginData.success) {
      throw new Error('Échec de la connexion admin')
    }
    console.log('✅ Connexion admin réussie')
    const token = loginData.data.token

    // Créer un article de test
    const articleResponse = await fetch('http://localhost:3001/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Article de test pour les galeries',
        titleAr: 'مقال اختبار للمعارض',
        content: 'Ceci est un article de test pour tester les galeries d\'images.',
        contentAr: 'هذا مقال اختبار لاختبار معارض الصور.',
        excerpt: 'Article de test',
        excerptAr: 'مقال اختبار',
        slug: 'article-test-galeries',
        published: true,
        tags: JSON.stringify(['test', 'galerie']),
        category: 'actualités'
      })
    })

    const articleData = await articleResponse.json()
    if (articleData.success) {
      console.log('✅ Article de test créé avec succès')
      console.log('ID:', articleData.data.id)
    } else {
      console.log('❌ Erreur:', articleData.error)
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

createTestArticle()
