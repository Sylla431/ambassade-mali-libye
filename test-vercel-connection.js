#!/usr/bin/env node

// Script de test pour diagnostiquer la connexion Vercel + Turso
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔍 Test de connexion à la base de données...');
  
  // Vérifier les variables d'environnement
  console.log('📋 Variables d\'environnement:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Définie' : '❌ Manquante');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Définie' : '❌ Manquante');
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Définie' : '❌ Manquante');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL manquante!');
    process.exit(1);
  }
  
  console.log('\n🔗 Format DATABASE_URL:', process.env.DATABASE_URL.startsWith('libsql://') ? '✅ Correct' : '❌ Incorrect');
  
  try {
    const prisma = new PrismaClient();
    
    console.log('\n📊 Test de connexion Prisma...');
    
    // Test simple de connexion
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Connexion Prisma réussie:', result);
    
    // Test de lecture des documents
    console.log('\n📄 Test de lecture des documents...');
    const documents = await prisma.document.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        isPublic: true
      }
    });
    console.log('✅ Documents trouvés:', documents.length);
    console.log('📋 Exemples:', documents);
    
    await prisma.$disconnect();
    console.log('\n🎉 Tous les tests sont passés!');
    
  } catch (error) {
    console.error('\n❌ Erreur de connexion:');
    console.error('Type:', error.constructor.name);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testConnection().catch(console.error);
