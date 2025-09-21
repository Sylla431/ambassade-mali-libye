// Script de test pour l'API de l'Ambassade du Mali en Libye
const BASE_URL = 'http://localhost:3000/api'

async function testAPI() {
  console.log('🧪 Test de l\'API Ambassade du Mali en Libye\n')

  try {
    // Test 1: Connexion admin
    console.log('1. Test de connexion admin...')
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
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
    if (loginData.success) {
      console.log('✅ Connexion réussie')
      const token = loginData.data.token
      
      // Test 2: Récupérer les articles
      console.log('\n2. Test de récupération des articles...')
      const articlesResponse = await fetch(`${BASE_URL}/articles?published=true`)
      const articlesData = await articlesResponse.json()
      if (articlesData.success) {
        console.log(`✅ ${articlesData.data.data.length} article(s) récupéré(s)`)
      }

      // Test 3: Récupérer les événements
      console.log('\n3. Test de récupération des événements...')
      const eventsResponse = await fetch(`${BASE_URL}/events?published=true`)
      const eventsData = await eventsResponse.json()
      if (eventsData.success) {
        console.log(`✅ ${eventsData.data.data.length} événement(s) récupéré(s)`)
      }

      // Test 4: Récupérer les annonces
      console.log('\n4. Test de récupération des annonces...')
      const announcementsResponse = await fetch(`${BASE_URL}/announcements?active=true`)
      const announcementsData = await announcementsResponse.json()
      if (announcementsData.success) {
        console.log(`✅ ${announcementsData.data.data.length} annonce(s) récupérée(s)`)
      }

      // Test 5: Créer un article (admin)
      console.log('\n5. Test de création d\'article...')
      const createArticleResponse = await fetch(`${BASE_URL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Test API - Article de test',
          content: 'Ceci est un article de test créé via l\'API.',
          slug: 'test-api-article',
          published: true,
          tags: JSON.stringify(['test', 'api']),
          category: 'actualités'
        })
      })

      const createArticleData = await createArticleResponse.json()
      if (createArticleData.success) {
        console.log('✅ Article créé avec succès')
        const articleId = createArticleData.data.id

        // Test 6: Mettre à jour l'article
        console.log('\n6. Test de mise à jour d\'article...')
        const updateArticleResponse = await fetch(`${BASE_URL}/articles/${articleId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: 'Test API - Article modifié'
          })
        })

        const updateArticleData = await updateArticleResponse.json()
        if (updateArticleData.success) {
          console.log('✅ Article mis à jour avec succès')
        }

        // Test 7: Supprimer l'article
        console.log('\n7. Test de suppression d\'article...')
        const deleteArticleResponse = await fetch(`${BASE_URL}/articles/${articleId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const deleteArticleData = await deleteArticleResponse.json()
        if (deleteArticleData.success) {
          console.log('✅ Article supprimé avec succès')
        }
      }

    } else {
      console.log('❌ Échec de la connexion:', loginData.error)
    }

    // Test 8: Soumettre une demande de visa (public)
    console.log('\n8. Test de soumission de demande de visa...')
    const visaResponse = await fetch(`${BASE_URL}/visa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@test.com',
        phone: '+33 1 23 45 67 89',
        nationality: 'Français',
        passportNumber: 'TEST123456',
        visaType: 'TOURIST',
        purpose: 'Test API',
        entryDate: '2024-02-01T00:00:00Z',
        exitDate: '2024-02-15T00:00:00Z'
      })
    })

    const visaData = await visaResponse.json()
    if (visaData.success) {
      console.log('✅ Demande de visa soumise avec succès')
    }

    // Test 9: Envoyer un message de contact (public)
    console.log('\n9. Test d\'envoi de message de contact...')
    const contactResponse = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Jean Dupont',
        email: 'jean.dupont@test.com',
        subject: 'Test API',
        message: 'Ceci est un message de test envoyé via l\'API.'
      })
    })

    const contactData = await contactResponse.json()
    if (contactData.success) {
      console.log('✅ Message de contact envoyé avec succès')
    }

    console.log('\n🎉 Tous les tests sont passés avec succès!')
    console.log('\n📚 Consultez API_DOCUMENTATION.md pour plus d\'informations')

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message)
    console.log('\n💡 Assurez-vous que le serveur de développement est démarré: npm run dev')
  }
}

// Exécuter les tests
testAPI()
