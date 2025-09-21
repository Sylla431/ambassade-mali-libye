// Script pour créer les tables sur Turso
const { createClient } = require('@libsql/client');

// Configuration
const TURSO_URL = process.env.TURSO_URL || 'libsql://ambassade-mali-libye-[org].turso.io';
const TURSO_TOKEN = process.env.TURSO_TOKEN || 'your-token-here';

async function createTables() {
  console.log('🔧 Création des tables sur Turso...');
  
  // Vérifier les variables d'environnement
  if (TURSO_URL.includes('[org]') || TURSO_TOKEN === 'your-token-here') {
    console.log('❌ Veuillez configurer TURSO_URL et TURSO_TOKEN');
    return;
  }

  try {
    // Connexion à Turso
    const tursoClient = createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN
    });

    console.log('✅ Connexion à Turso établie');

    // Créer les tables une par une
    const tables = [
      {
        name: 'Admin',
        sql: `CREATE TABLE IF NOT EXISTS "Admin" (
          "id" TEXT PRIMARY KEY NOT NULL,
          "email" TEXT NOT NULL UNIQUE,
          "password" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "role" TEXT NOT NULL DEFAULT 'EDITOR',
          "isActive" BOOLEAN NOT NULL DEFAULT 1,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'Category',
        sql: `CREATE TABLE IF NOT EXISTS "Category" (
          "id" TEXT PRIMARY KEY NOT NULL,
          "name" TEXT NOT NULL,
          "nameAr" TEXT,
          "description" TEXT,
          "descriptionAr" TEXT,
          "color" TEXT,
          "isActive" BOOLEAN NOT NULL DEFAULT 1,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'Article',
        sql: `CREATE TABLE IF NOT EXISTS "Article" (
          "id" TEXT PRIMARY KEY NOT NULL,
          "title" TEXT NOT NULL,
          "titleAr" TEXT,
          "content" TEXT NOT NULL,
          "contentAr" TEXT,
          "excerpt" TEXT,
          "excerptAr" TEXT,
          "slug" TEXT NOT NULL UNIQUE,
          "featured" BOOLEAN NOT NULL DEFAULT 0,
          "published" BOOLEAN NOT NULL DEFAULT 0,
          "publishedAt" DATETIME,
          "imageUrl" TEXT,
          "tags" TEXT,
          "categoryId" TEXT,
          "authorId" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'Event',
        sql: `CREATE TABLE IF NOT EXISTS "Event" (
          "id" TEXT PRIMARY KEY NOT NULL,
          "title" TEXT NOT NULL,
          "titleAr" TEXT,
          "description" TEXT,
          "descriptionAr" TEXT,
          "startDate" DATETIME NOT NULL,
          "endDate" DATETIME,
          "location" TEXT,
          "locationAr" TEXT,
          "imageUrl" TEXT,
          "published" BOOLEAN NOT NULL DEFAULT 0,
          "categoryId" TEXT,
          "authorId" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'Document',
        sql: `CREATE TABLE IF NOT EXISTS "Document" (
          "id" TEXT PRIMARY KEY NOT NULL,
          "title" TEXT NOT NULL,
          "titleAr" TEXT,
          "description" TEXT,
          "descriptionAr" TEXT,
          "fileUrl" TEXT NOT NULL,
          "fileName" TEXT NOT NULL,
          "fileSize" INTEGER NOT NULL,
          "mimeType" TEXT NOT NULL,
          "category" TEXT NOT NULL,
          "isPublic" BOOLEAN NOT NULL DEFAULT 1,
          "authorId" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'ArticleGallery',
        sql: `CREATE TABLE IF NOT EXISTS "ArticleGallery" (
          "id" TEXT PRIMARY KEY NOT NULL,
          "articleId" TEXT NOT NULL,
          "imageUrl" TEXT NOT NULL,
          "altText" TEXT,
          "caption" TEXT,
          "captionAr" TEXT,
          "order" INTEGER NOT NULL DEFAULT 0,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'EventGallery',
        sql: `CREATE TABLE IF NOT EXISTS "EventGallery" (
          "id" TEXT PRIMARY KEY NOT NULL,
          "eventId" TEXT NOT NULL,
          "imageUrl" TEXT NOT NULL,
          "altText" TEXT,
          "caption" TEXT,
          "captionAr" TEXT,
          "order" INTEGER NOT NULL DEFAULT 0,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
      }
    ];

    for (const table of tables) {
      try {
        await tursoClient.execute(table.sql);
        console.log(`✅ Table ${table.name} créée`);
      } catch (error) {
        console.log(`⚠️  Table ${table.name}: ${error.message}`);
      }
    }

    console.log('🎉 Toutes les tables ont été créées !');
    console.log('');
    console.log('📋 Prochaines étapes :');
    console.log('1. Exécutez: node migrate-data-to-turso.js');
    console.log('2. Configurez Vercel avec l\'URL Turso');

  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error.message);
  }
}

// Exécuter la création des tables
createTables();
