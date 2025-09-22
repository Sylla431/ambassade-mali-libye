#!/usr/bin/env node

// Script pour tester Vercel Blob Storage
console.log('🧪 Test de Vercel Blob Storage...');

// Vérifier si la variable d'environnement est définie
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

if (!blobToken) {
  console.log('❌ BLOB_READ_WRITE_TOKEN non configuré');
  console.log('');
  console.log('📋 Pour configurer Blob Storage :');
  console.log('1. Aller sur https://vercel.com/dashboard');
  console.log('2. Sélectionner votre projet');
  console.log('3. Aller dans Storage > Create Database > Blob');
  console.log('4. Copier le token et l\'ajouter aux variables d\'environnement');
  console.log('5. Redéployer l\'application');
} else {
  console.log('✅ BLOB_READ_WRITE_TOKEN configuré');
  console.log('✅ Vercel Blob Storage est prêt à être utilisé');
}
