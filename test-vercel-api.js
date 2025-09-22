#!/usr/bin/env node

// Script pour tester l'API Vercel directement
const https = require('https');

function testVercelAPI() {
  console.log('🔍 Test de l\'API Vercel...');
  
  const options = {
    hostname: 'ambassade-mali-libye.vercel.app',
    port: 443,
    path: '/api/documents?page=1&limit=12&public=true',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Test-Script/1.0'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\n📄 Response Body:');
      try {
        const json = JSON.parse(data);
        console.log(JSON.stringify(json, null, 2));
      } catch (e) {
        console.log('Raw response:', data);
      }
      
      if (res.statusCode === 500) {
        console.log('\n❌ Erreur 500 détectée!');
        console.log('🔍 Causes possibles:');
        console.log('1. Variables d\'environnement manquantes sur Vercel');
        console.log('2. Problème de connexion à Turso');
        console.log('3. Erreur dans le code de l\'API route');
        console.log('4. Problème de runtime Node.js vs Edge');
      } else if (res.statusCode === 200) {
        console.log('\n✅ API fonctionne correctement!');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur de requête:', error);
  });

  req.end();
}

testVercelAPI();
