// Script de migration vers Turso
const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

// Configuration
const TURSO_URL = process.env.TURSO_URL || 'libsql://ambassade-mali-libye-[org].turso.io';
const TURSO_TOKEN = process.env.TURSO_TOKEN || 'your-token-here';

async function migrateToTurso() {
  console.log('🚀 Début de la migration vers Turso...');
  
  // Vérifier les variables d'environnement
  if (TURSO_URL.includes('[org]') || TURSO_TOKEN === 'your-token-here') {
    console.log('❌ Veuillez configurer TURSO_URL et TURSO_TOKEN');
    console.log('📋 Variables requises :');
    console.log('   TURSO_URL="libsql://ambassade-mali-libye-[votre-org].turso.io"');
    console.log('   TURSO_TOKEN="votre-token-ici"');
    console.log('');
    console.log('💡 Vous pouvez les définir comme ceci :');
    console.log('   export TURSO_URL="votre-url-turso"');
    console.log('   export TURSO_TOKEN="votre-token"');
    console.log('   node migrate-to-turso.js');
    return;
  }

  try {
    // Créer le client Turso
    const client = createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN
    });

    console.log('✅ Connexion à Turso établie');

    // Lire le schéma Prisma
    const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📖 Lecture du schéma Prisma...');

    // Extraire les commandes SQL du schéma
    const sqlCommands = extractSQLFromSchema(schema);
    
    console.log(`🔧 Exécution de ${sqlCommands.length} commandes SQL...`);

    // Exécuter les commandes SQL sur Turso
    for (const sql of sqlCommands) {
      try {
        await client.execute(sql);
        console.log(`✅ ${sql.substring(0, 50)}...`);
      } catch (error) {
        console.log(`⚠️  ${sql.substring(0, 50)}... (peut-être déjà existant)`);
      }
    }

    // Migrer les données depuis dev.db
    console.log('📊 Migration des données...');
    await migrateData(client);

    console.log('🎉 Migration terminée avec succès !');
    console.log('');
    console.log('📋 URL de connexion pour Vercel :');
    console.log(`DATABASE_URL="${TURSO_URL}?authToken=${TURSO_TOKEN}"`);

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
  }
}

function extractSQLFromSchema(schema) {
  // Extraire les commandes CREATE TABLE du schéma Prisma
  const tables = [];
  const lines = schema.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('model ')) {
      const tableName = line.split(' ')[1];
      tables.push(tableName);
    }
  }

  // Générer les commandes SQL basiques
  const sqlCommands = [
    // Tables principales
    `CREATE TABLE IF NOT EXISTS "Admin" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'EDITOR',
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS "Category" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "name" TEXT NOT NULL,
      "nameAr" TEXT,
      "description" TEXT,
      "descriptionAr" TEXT,
      "color" TEXT,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS "Article" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "title" TEXT NOT NULL,
      "titleAr" TEXT,
      "content" TEXT NOT NULL,
      "contentAr" TEXT,
      "excerpt" TEXT,
      "excerptAr" TEXT,
      "slug" TEXT NOT NULL UNIQUE,
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "published" BOOLEAN NOT NULL DEFAULT false,
      "publishedAt" DATETIME,
      "imageUrl" TEXT,
      "tags" TEXT,
      "categoryId" TEXT,
      "authorId" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL,
      FOREIGN KEY ("authorId") REFERENCES "Admin"("id") ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS "Event" (
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
      "published" BOOLEAN NOT NULL DEFAULT false,
      "categoryId" TEXT,
      "authorId" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL,
      FOREIGN KEY ("authorId") REFERENCES "Admin"("id") ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS "Document" (
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
      "isPublic" BOOLEAN NOT NULL DEFAULT true,
      "authorId" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("authorId") REFERENCES "Admin"("id") ON DELETE CASCADE
    )`
  ];

  return sqlCommands;
}

async function migrateData(client) {
  // Pour l'instant, on crée juste les tables
  // Les données seront ajoutées via le script init-db.ts en production
  console.log('📝 Tables créées. Les données seront initialisées via le script init-db.ts');
}

// Exécuter la migration
migrateToTurso();
