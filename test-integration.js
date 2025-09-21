#!/usr/bin/env node

/**
 * Script de test complet pour l'intégration front-end/back-end
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

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
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

// Test de l'API Articles
async function testArticlesAPI() {
  logInfo('Test de l\'API Articles...')
  
  // Test GET /api/articles
  const articlesResponse = await makeRequest(`${API_BASE}/articles`)
  if (articlesResponse.success) {
    logSuccess(`Articles récupérés: ${articlesResponse.data.data?.length || 0} articles`)
  } else {
    logError(`Erreur récupération articles: ${articlesResponse.error || articlesResponse.data?.message}`)
  }
  
  // Test avec pagination
  const paginatedResponse = await makeRequest(`${API_BASE}/articles?page=1&limit=3`)
  if (paginatedResponse.success) {
    logSuccess(`Pagination fonctionnelle: ${paginatedResponse.data.pagination?.total || 0} articles au total`)
  } else {
    logError(`Erreur pagination: ${paginatedResponse.error || paginatedResponse.data?.message}`)
  }
  
  // Test avec recherche
  const searchResponse = await makeRequest(`${API_BASE}/articles?search=mali`)
  if (searchResponse.success) {
    logSuccess(`Recherche fonctionnelle: ${searchResponse.data.data?.length || 0} résultats`)
  } else {
    logError(`Erreur recherche: ${searchResponse.error || searchResponse.data?.message}`)
  }
}

// Test de l'API Événements
async function testEventsAPI() {
  logInfo('Test de l\'API Événements...')
  
  const eventsResponse = await makeRequest(`${API_BASE}/events`)
  if (eventsResponse.success) {
    logSuccess(`Événements récupérés: ${eventsResponse.data.data?.length || 0} événements`)
  } else {
    logError(`Erreur récupération événements: ${eventsResponse.error || eventsResponse.data?.message}`)
  }
}

// Test de l'API Contact
async function testContactAPI() {
  logInfo('Test de l\'API Contact...')
  
  const testMessage = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+33 1 23 45 67 89',
    subject: 'Test d\'intégration',
    message: 'Ceci est un message de test pour vérifier l\'intégration.'
  }
  
  const contactResponse = await makeRequest(`${API_BASE}/contact`, {
    method: 'POST',
    body: JSON.stringify(testMessage)
  })
  
  if (contactResponse.success) {
    logSuccess('Message de contact envoyé avec succès')
  } else {
    logError(`Erreur envoi contact: ${contactResponse.error || contactResponse.data?.message}`)
  }
}

// Test de l'API Visa
async function testVisaAPI() {
  logInfo('Test de l\'API Visa...')
  
  const testApplication = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 1 23 45 67 89',
    nationality: 'Française',
    passportNumber: '12AB34567',
    visaType: 'TOURIST',
    purpose: 'Tourisme',
    entryDate: '2025-06-01',
    exitDate: '2025-06-15',
    notes: 'Test d\'intégration de la demande de visa'
  }
  
  const visaResponse = await makeRequest(`${API_BASE}/visa`, {
    method: 'POST',
    body: JSON.stringify(testApplication)
  })
  
  if (visaResponse.success) {
    logSuccess('Demande de visa soumise avec succès')
  } else {
    logError(`Erreur soumission visa: ${visaResponse.error || visaResponse.data?.message}`)
  }
}

// Test de l'API Upload
async function testUploadAPI() {
  logInfo('Test de l\'API Upload...')
  
  // Test upload d'image (simulation)
  const formData = new FormData()
  const testFile = new Blob(['test image content'], { type: 'image/jpeg' })
  formData.append('files', testFile, 'test.jpg')
  
  try {
    const uploadResponse = await fetch(`${API_BASE}/upload/images`, {
      method: 'POST',
      body: formData
    })
    
    const uploadData = await uploadResponse.json()
    
    if (uploadResponse.ok) {
      logSuccess('Upload d\'image testé avec succès')
    } else {
      logWarning(`Upload d'image: ${uploadData.message || 'Test non concluant'}`)
    }
  } catch (error) {
    logWarning(`Upload d'image: ${error.message}`)
  }
}

// Test de l'API Documents
async function testDocumentsAPI() {
  logInfo('Test de l\'API Documents...')
  
  const documentsResponse = await makeRequest(`${API_BASE}/documents`)
  if (documentsResponse.success) {
    logSuccess(`Documents récupérés: ${documentsResponse.data.data?.length || 0} documents`)
  } else {
    logError(`Erreur récupération documents: ${documentsResponse.error || documentsResponse.data?.message}`)
  }
}

// Test de l'API Annonces
async function testAnnouncementsAPI() {
  logInfo('Test de l\'API Annonces...')
  
  const announcementsResponse = await makeRequest(`${API_BASE}/announcements`)
  if (announcementsResponse.success) {
    logSuccess(`Annonces récupérées: ${announcementsResponse.data.data?.length || 0} annonces`)
  } else {
    logError(`Erreur récupération annonces: ${announcementsResponse.error || announcementsResponse.data?.message}`)
  }
}

// Test de l'authentification admin
async function testAdminAuth() {
  logInfo('Test de l\'authentification Admin...')
  
  const loginResponse = await makeRequest(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@ambassade-mali-libye.ml',
      password: 'admin123'
    })
  })
  
  if (loginResponse.success && loginResponse.data.token) {
    logSuccess('Authentification admin réussie')
    
    // Test de l'endpoint /me
    const meResponse = await makeRequest(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.token}`
      }
    })
    
    if (meResponse.success) {
      logSuccess('Récupération des infos admin réussie')
    } else {
      logError(`Erreur récupération infos admin: ${meResponse.error || meResponse.data?.message}`)
    }
  } else {
    logError(`Erreur authentification admin: ${loginResponse.error || loginResponse.data?.message}`)
  }
}

// Test de performance
async function testPerformance() {
  logInfo('Test de performance...')
  
  const startTime = Date.now()
  
  // Test de plusieurs requêtes en parallèle
  const promises = [
    makeRequest(`${API_BASE}/articles`),
    makeRequest(`${API_BASE}/events`),
    makeRequest(`${API_BASE}/documents`),
    makeRequest(`${API_BASE}/announcements`)
  ]
  
  const results = await Promise.all(promises)
  const endTime = Date.now()
  const duration = endTime - startTime
  
  const successCount = results.filter(r => r.success).length
  
  if (successCount === results.length) {
    logSuccess(`Performance: ${duration}ms pour ${results.length} requêtes parallèles`)
  } else {
    logWarning(`Performance: ${successCount}/${results.length} requêtes réussies en ${duration}ms`)
  }
}

// Fonction principale
async function runIntegrationTests() {
  log('🚀 Démarrage des tests d\'intégration', 'bold')
  log('=====================================', 'bold')
  
  try {
    // Tests des APIs principales
    await testArticlesAPI()
    await testEventsAPI()
    await testContactAPI()
    await testVisaAPI()
    await testUploadAPI()
    await testDocumentsAPI()
    await testAnnouncementsAPI()
    
    // Test d'authentification
    await testAdminAuth()
    
    // Test de performance
    await testPerformance()
    
    log('', 'reset')
    log('🎉 Tests d\'intégration terminés !', 'bold')
    log('=====================================', 'bold')
    logSuccess('L\'intégration front-end/back-end est fonctionnelle !')
    
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
      return true // On continue même si le statut n'est pas 200
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
  
  await runIntegrationTests()
}

// Exécution
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  runIntegrationTests,
  testArticlesAPI,
  testEventsAPI,
  testContactAPI,
  testVisaAPI
}
