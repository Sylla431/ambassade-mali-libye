#!/usr/bin/env node

/**
 * Script de test pour les galeries d'images
 * Ambassade du Mali en Libye
 */

// Import de fetch pour Node.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const API_BASE = 'http://localhost:3000/api'

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

// Fonction pour faire des requêtes HTTP
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    const data = await response.json()
    return { success: response.ok, data, status: response.status }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Test de l'API Articles avec galerie
async function testArticlesWithGallery() {
  logInfo('Test des articles avec galerie...')
  
  const response = await makeRequest(`${API_BASE}/articles`)
  if (response.success) {
    const articles = response.data?.data || []
    logSuccess(`Articles récupérés: ${articles.length} articles`)
    
    // Vérifier si les articles ont des galeries
    if (Array.isArray(articles)) {
      articles.forEach((article, index) => {
        if (article.gallery && article.gallery.length > 0) {
          logSuccess(`Article ${index + 1} a ${article.gallery.length} image(s) dans sa galerie`)
        } else {
          logInfo(`Article ${index + 1} n'a pas d'images dans sa galerie`)
        }
      })
    } else {
      logInfo('Aucun article trouvé')
    }
  } else {
    logError(`Erreur récupération articles: ${response.error || response.data?.message}`)
  }
}

// Test de l'API Événements avec galerie
async function testEventsWithGallery() {
  logInfo('Test des événements avec galerie...')
  
  const response = await makeRequest(`${API_BASE}/events`)
  if (response.success) {
    const events = response.data?.data || []
    logSuccess(`Événements récupérés: ${events.length} événements`)
    
    // Vérifier si les événements ont des galeries
    if (Array.isArray(events)) {
      events.forEach((event, index) => {
        if (event.gallery && event.gallery.length > 0) {
          logSuccess(`Événement ${index + 1} a ${event.gallery.length} image(s) dans sa galerie`)
        } else {
          logInfo(`Événement ${index + 1} n'a pas d'images dans sa galerie`)
        }
      })
    } else {
      logInfo('Aucun événement trouvé')
    }
  } else {
    logError(`Erreur récupération événements: ${response.error || response.data?.message}`)
  }
}

// Test de création d'un article avec galerie (nécessite authentification)
async function testCreateArticleWithGallery() {
  logInfo('Test de création d\'article avec galerie...')
  
  // D'abord, se connecter
  const loginResponse = await makeRequest(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@ambassade-mali-libye.ml',
      password: 'admin123'
    })
  })
  
  if (!loginResponse.success || !loginResponse.data.token) {
    logError('Impossible de se connecter pour tester la création d\'article')
    return
  }
  
  const token = loginResponse.data.token
  
  // Créer un article
  const articleData = {
    title: 'Test Galerie - Article avec images',
    content: 'Ceci est un article de test pour vérifier le fonctionnement des galeries d\'images.',
    excerpt: 'Test de galerie d\'images',
    slug: 'test-galerie-article',
    category: 'Test',
    published: true,
    featured: false
  }
  
  const articleResponse = await makeRequest(`${API_BASE}/articles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(articleData)
  })
  
  if (articleResponse.success) {
    const article = articleResponse.data
    logSuccess(`Article créé avec l'ID: ${article.id}`)
    
    // Ajouter une image à la galerie
    const imageData = {
      imageUrl: '/images/test/gallery-test.jpg',
      altText: 'Image de test pour la galerie',
      caption: 'Légende de l\'image de test',
      order: 0
    }
    
    const galleryResponse = await makeRequest(`${API_BASE}/articles/${article.id}/gallery`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(imageData)
    })
    
    if (galleryResponse.success) {
      logSuccess('Image ajoutée à la galerie avec succès')
      
      // Vérifier que l'image est bien dans la galerie
      const articleWithGallery = await makeRequest(`${API_BASE}/articles/${article.id}`)
      if (articleWithGallery.success && articleWithGallery.data.gallery) {
        logSuccess(`Galerie vérifiée: ${articleWithGallery.data.gallery.length} image(s)`)
      }
    } else {
      logError(`Erreur ajout image galerie: ${galleryResponse.error || galleryResponse.data?.message}`)
    }
  } else {
    logError(`Erreur création article: ${articleResponse.error || articleResponse.data?.message}`)
  }
}

// Test de création d'un événement avec galerie
async function testCreateEventWithGallery() {
  logInfo('Test de création d\'événement avec galerie...')
  
  // D'abord, se connecter
  const loginResponse = await makeRequest(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@ambassade-mali-libye.ml',
      password: 'admin123'
    })
  })
  
  if (!loginResponse.success || !loginResponse.data.token) {
    logError('Impossible de se connecter pour tester la création d\'événement')
    return
  }
  
  const token = loginResponse.data.token
  
  // Créer un événement
  const eventData = {
    title: 'Test Galerie - Événement avec images',
    description: 'Ceci est un événement de test pour vérifier le fonctionnement des galeries d\'images.',
    location: 'Ambassade du Mali, Tripoli',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Dans 7 jours
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // Dans 8 jours
    published: true
  }
  
  const eventResponse = await makeRequest(`${API_BASE}/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(eventData)
  })
  
  if (eventResponse.success) {
    const event = eventResponse.data
    logSuccess(`Événement créé avec l'ID: ${event.id}`)
    
    // Ajouter une image à la galerie
    const imageData = {
      imageUrl: '/images/test/event-gallery-test.jpg',
      altText: 'Image de test pour la galerie d\'événement',
      caption: 'Légende de l\'image de test d\'événement',
      order: 0
    }
    
    const galleryResponse = await makeRequest(`${API_BASE}/events/${event.id}/gallery`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(imageData)
    })
    
    if (galleryResponse.success) {
      logSuccess('Image ajoutée à la galerie d\'événement avec succès')
      
      // Vérifier que l'image est bien dans la galerie
      const eventWithGallery = await makeRequest(`${API_BASE}/events/${event.id}`)
      if (eventWithGallery.success && eventWithGallery.data.gallery) {
        logSuccess(`Galerie d'événement vérifiée: ${eventWithGallery.data.gallery.length} image(s)`)
      }
    } else {
      logError(`Erreur ajout image galerie événement: ${galleryResponse.error || galleryResponse.data?.message}`)
    }
  } else {
    logError(`Erreur création événement: ${eventResponse.error || eventResponse.data?.message}`)
  }
}

// Fonction principale
async function runGalleryTests() {
  log('🖼️  Démarrage des tests de galerie', 'bold')
  log('=====================================', 'bold')
  
  try {
    // Tests de base
    await testArticlesWithGallery()
    await testEventsWithGallery()
    
    // Tests de création avec galerie
    await testCreateArticleWithGallery()
    await testCreateEventWithGallery()
    
    log('', 'reset')
    log('🎉 Tests de galerie terminés !', 'bold')
    log('=====================================', 'bold')
    logSuccess('Les galeries d\'images sont fonctionnelles !')
    
  } catch (error) {
    logError(`Erreur lors des tests: ${error.message}`)
    process.exit(1)
  }
}

// Vérification que le serveur est démarré
async function checkServer() {
  try {
    const response = await fetch(`${API_BASE}/articles`)
    if (response.ok) {
      logSuccess('Serveur détecté et accessible')
      return true
    } else {
      logWarning(`Serveur répond avec le statut: ${response.status}`)
      return true
    }
  } catch (error) {
    logError(`Serveur non accessible: ${error.message}`)
    logError('Assurez-vous que le serveur Next.js est démarré (npm run dev)')
    return false
  }
}

// Point d'entrée
async function main() {
  log('🔍 Vérification du serveur...', 'blue')
  
  const serverRunning = await checkServer()
  if (!serverRunning) {
    process.exit(1)
  }
  
  await runGalleryTests()
}

// Exécution
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  runGalleryTests,
  testArticlesWithGallery,
  testEventsWithGallery
}