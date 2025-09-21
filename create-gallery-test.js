#!/usr/bin/env node

/**
 * Script pour créer des images de test dans les galeries
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

// Se connecter en tant qu'admin
async function loginAdmin() {
  logInfo('Connexion en tant qu\'administrateur...')
  
  const response = await makeRequest(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@ambassade-mali-libye.ml',
      password: 'admin123'
    })
  })
  
  if (response.success && response.data?.data?.token) {
    logSuccess('Connexion réussie')
    return response.data.data.token
  } else {
    logError(`Erreur de connexion: ${response.error || response.data?.message || 'Token non reçu'}`)
    return null
  }
}

// Ajouter des images à la galerie d'un article
async function addImagesToArticleGallery(articleId, token) {
  logInfo(`Ajout d'images à la galerie de l'article ${articleId}...`)
  
  const images = [
    {
      imageUrl: '/images/articles/cooperation-mali-libye.jpg',
      altText: 'Coopération Mali-Libye',
      caption: 'Signature d\'accords de coopération entre le Mali et la Libye',
      captionAr: 'توقيع اتفاقيات التعاون بين مالي وليبيا',
      order: 0
    },
    {
      imageUrl: '/images/articles/services-consulaires.jpg',
      altText: 'Services consulaires',
      caption: 'Services consulaires de l\'ambassade',
      captionAr: 'الخدمات القنصلية للسفارة',
      order: 1
    },
    {
      imageUrl: '/images/articles/festival-culture.jpg',
      altText: 'Festival culturel',
      caption: 'Festival de la diversité culturelle malienne',
      captionAr: 'مهرجان التنوع الثقافي المالي',
      order: 2
    }
  ]
  
  for (const image of images) {
    const response = await makeRequest(`${API_BASE}/articles/${articleId}/gallery`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(image)
    })
    
    if (response.success) {
      logSuccess(`Image ajoutée: ${image.caption}`)
    } else {
      logError(`Erreur ajout image: ${response.error || response.data?.message}`)
    }
  }
}

// Ajouter des images à la galerie d'un événement
async function addImagesToEventGallery(eventId, token) {
  logInfo(`Ajout d'images à la galerie de l'événement ${eventId}...`)
  
  const images = [
    {
      imageUrl: '/images/events/ceremonie-officielle.jpg',
      altText: 'Cérémonie officielle',
      caption: 'Cérémonie officielle à l\'ambassade',
      captionAr: 'حفل رسمي في السفارة',
      order: 0
    },
    {
      imageUrl: '/images/events/reception-diplomatique.jpg',
      altText: 'Réception diplomatique',
      caption: 'Réception diplomatique',
      captionAr: 'استقبال دبلوماسي',
      order: 1
    }
  ]
  
  for (const image of images) {
    const response = await makeRequest(`${API_BASE}/events/${eventId}/gallery`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(image)
    })
    
    if (response.success) {
      logSuccess(`Image ajoutée: ${image.caption}`)
    } else {
      logError(`Erreur ajout image: ${response.error || response.data?.message}`)
    }
  }
}

// Créer un événement de test
async function createTestEvent(token) {
  logInfo('Création d\'un événement de test...')
  
  const eventData = {
    title: 'Test Galerie - Événement avec images',
    titleAr: 'اختبار المعرض - حدث مع الصور',
    description: 'Ceci est un événement de test pour vérifier le fonctionnement des galeries d\'images.',
    descriptionAr: 'هذا حدث اختبار للتحقق من عمل معارض الصور.',
    location: 'Ambassade du Mali, Tripoli',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Dans 7 jours
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // Dans 8 jours
    published: true
  }
  
  const response = await makeRequest(`${API_BASE}/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(eventData)
  })
  
  if (response.success) {
    logSuccess(`Événement créé avec l'ID: ${response.data?.data?.id}`)
    return response.data?.data?.id
  } else {
    logError(`Erreur création événement: ${response.error || response.data?.message}`)
    return null
  }
}

// Fonction principale
async function createGalleryTest() {
  log('🖼️  Création de galeries de test', 'bold')
  log('=====================================', 'bold')
  
  try {
    // Se connecter
    const token = await loginAdmin()
    if (!token) {
      logError('Impossible de se connecter')
      return
    }
    
    // Récupérer les articles existants
    const articlesResponse = await makeRequest(`${API_BASE}/articles`)
    if (articlesResponse.success && articlesResponse.data.data.length > 0) {
      const firstArticle = articlesResponse.data.data[0]
      logInfo(`Utilisation de l'article: ${firstArticle.title}`)
      
      // Ajouter des images à la galerie de l'article
      await addImagesToArticleGallery(firstArticle.id, token)
    }
    
    // Créer un événement de test
    const eventId = await createTestEvent(token)
    if (eventId) {
      // Ajouter des images à la galerie de l'événement
      await addImagesToEventGallery(eventId, token)
    }
    
    log('', 'reset')
    log('🎉 Galeries de test créées !', 'bold')
    log('=====================================', 'bold')
    logSuccess('Les galeries d\'images sont maintenant peuplées avec des données de test !')
    
  } catch (error) {
    logError(`Erreur lors de la création: ${error.message}`)
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
  
  await createGalleryTest()
}

// Exécution
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  createGalleryTest,
  addImagesToArticleGallery,
  addImagesToEventGallery
}
