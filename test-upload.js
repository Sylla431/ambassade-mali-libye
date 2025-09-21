// Script de test pour l'upload de fichiers
const fs = require('fs')
const path = require('path')

async function testFileUpload() {
  console.log('🧪 Test de l\'upload de fichiers\n')

  try {
    // Créer un fichier de test
    const testContent = 'Ceci est un fichier de test pour l\'upload'
    const testFilePath = path.join(__dirname, 'test-file.txt')
    fs.writeFileSync(testFilePath, testContent)

    // Créer un fichier image de test (1x1 pixel PNG)
    const testImageContent = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
      0x42, 0x60, 0x82
    ])
    const testImagePath = path.join(__dirname, 'test-image.png')
    fs.writeFileSync(testImagePath, testImageContent)

    // Test 1: Connexion admin
    console.log('1. Connexion admin...')
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

    // Test 2: Upload d'image (admin)
    console.log('\n2. Test d\'upload d\'image...')
    const imageFormData = new FormData()
    const imageBlob = new Blob([testImageContent], { type: 'image/png' })
    imageFormData.append('files', imageBlob, 'test-image.png')

    const imageUploadResponse = await fetch('http://localhost:3001/api/upload/images', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: imageFormData
    })

    const imageUploadData = await imageUploadResponse.json()
    if (imageUploadData.success) {
      console.log(`✅ Image uploadée avec succès: ${imageUploadData.data.successful[0].file.url}`)
    } else {
      console.log('❌ Échec de l\'upload d\'image:', imageUploadData.error)
    }

    // Test 3: Upload de document (admin)
    console.log('\n3. Test d\'upload de document...')
    const docFormData = new FormData()
    const docBlob = new Blob([testContent], { type: 'text/plain' })
    docFormData.append('files', docBlob, 'test-document.txt')

    const docUploadResponse = await fetch('http://localhost:3001/api/upload/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: docFormData
    })

    const docUploadData = await docUploadResponse.json()
    if (docUploadData.success && docUploadData.data.successful.length > 0) {
      console.log(`✅ Document uploadé avec succès: ${docUploadData.data.successful[0].file.url}`)
    } else {
      console.log('❌ Échec de l\'upload de document:', docUploadData.error || 'Aucun fichier uploadé')
    }

    // Test 4: Upload de documents visa (public)
    console.log('\n4. Test d\'upload de documents visa (public)...')
    const visaFormData = new FormData()
    const visaBlob = new Blob([testContent], { type: 'text/plain' })
    visaFormData.append('files', visaBlob, 'visa-document.txt')

    const visaUploadResponse = await fetch('http://localhost:3001/api/upload/visa', {
      method: 'POST',
      body: visaFormData
    })

    const visaUploadData = await visaUploadResponse.json()
    if (visaUploadData.success && visaUploadData.data.successful.length > 0) {
      console.log(`✅ Document visa uploadé avec succès: ${visaUploadData.data.successful[0].file.url}`)
    } else {
      console.log('❌ Échec de l\'upload de document visa:', visaUploadData.error || 'Aucun fichier uploadé')
    }

    // Test 5: Créer un document dans la base de données
    console.log('\n5. Test de création de document en base...')
    const documentResponse = await fetch('http://localhost:3001/api/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Document de test',
        titleAr: 'وثيقة اختبار',
        description: 'Ceci est un document de test créé via l\'API',
        descriptionAr: 'هذه وثيقة اختبار تم إنشاؤها عبر API',
        fileUrl: imageUploadData.data.successful[0]?.file.url || '/uploads/images/test.png',
        fileName: 'test-document.txt',
        fileSize: testContent.length,
        mimeType: 'text/plain',
        category: 'NEWS',
        isPublic: true
      })
    })

    const documentData = await documentResponse.json()
    if (documentData.success) {
      console.log('✅ Document créé en base avec succès')
    } else {
      console.log('❌ Échec de la création du document:', documentData.error)
    }

    // Nettoyer les fichiers de test
    fs.unlinkSync(testFilePath)
    fs.unlinkSync(testImagePath)

    console.log('\n🎉 Tous les tests d\'upload sont passés avec succès!')

  } catch (error) {
    console.error('❌ Erreur lors des tests d\'upload:', error.message)
    console.log('\n💡 Assurez-vous que le serveur de développement est démarré sur le port 3001')
  }
}

// Exécuter les tests
testFileUpload()
