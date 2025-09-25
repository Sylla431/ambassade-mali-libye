#!/usr/bin/env node

// Script pour tester les APIs articles
console.log('🔍 Test des APIs articles :\n');

console.log('📋 URLs à tester :');
console.log('1. https://ambassade-mali-libye.vercel.app/api/articles-simple?page=1&limit=10');
console.log('2. https://ambassade-mali-libye.vercel.app/api/articles?page=1&limit=10\n');

console.log('🔧 Diagnostic :');
console.log('L\'erreur 500 persiste même après simplification');
console.log('Cela indique un problème plus profond\n');

console.log('❌ Causes possibles :');
console.log('1. Problème de connexion à la base de données PostgreSQL');
console.log('2. Variable d\'environnement DATABASE_URL manquante ou incorrecte');
console.log('3. Schéma Prisma non synchronisé avec la base de données');
console.log('4. Problème avec le client Prisma');
console.log('5. Erreur dans la configuration Vercel\n');

console.log('✅ Solutions à appliquer :');
console.log('1. Vérifier les variables d\'environnement sur Vercel');
console.log('2. Tester la connexion à la base de données');
console.log('3. Vérifier le schéma Prisma');
console.log('4. Créer une API de test de base de données\n');

console.log('🚀 Prochaines étapes :');
console.log('1. Créer une API de test de connexion DB');
console.log('2. Vérifier les logs Vercel');
console.log('3. Tester avec une requête simple');
console.log('4. Corriger la configuration si nécessaire');
