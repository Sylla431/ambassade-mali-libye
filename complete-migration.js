// Script de migration complète : création des tables + migration des données
const { createClient } = require('@libsql/client');
const Database = require('better-sqlite3');
const path = require('path');

// Configuration
const TURSO_URL = process.env.TURSO_URL || 'libsql://ambassade-mali-libye-[org].turso.io';
const TURSO_TOKEN = process.env.TURSO_TOKEN || 'your-token-here';
const LOCAL_DB_PATH = path.join(__dirname, 'prisma', 'dev.db');

async function completeMigration() {
  console.log('🚀 Migration complète vers Turso...');
  console.log(`📁 Base locale: ${LOCAL_DB_PATH}`);
  
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
    console.log('   node complete-migration.js');
    return;
  }

  try {
    // Connexion à Turso
    console.log('☁️  Connexion à Turso...');
    const tursoClient = createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN
    });

    console.log('✅ Connexion à Turso établie');

    // 1. Créer les tables sur Turso
    console.log('🔧 Création des tables sur Turso...');
    
    const createTablesSQL = [
      // Table Admin
      `CREATE TABLE IF NOT EXISTS "Admin" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'EDITOR',
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Table Category
      `CREATE TABLE IF NOT EXISTS "Category" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "name" TEXT NOT NULL,
        "nameAr" TEXT,
        "description" TEXT,
        "descriptionAr" TEXT,
        "color" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      // Table Article
      `CREATE TABLE IF NOT EXISTS "Article" (
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
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL,
        FOREIGN KEY ("authorId") REFERENCES "Admin"("id") ON DELETE CASCADE
      )`,

      // Table Event
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
        "published" BOOLEAN NOT NULL DEFAULT 0,
        "categoryId" TEXT,
        "authorId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL,
        FOREIGN KEY ("authorId") REFERENCES "Admin"("id") ON DELETE CASCADE
      )`,

      // Table Document
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
        "isPublic" BOOLEAN NOT NULL DEFAULT 1,
        "authorId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("authorId") REFERENCES "Admin"("id") ON DELETE CASCADE
      )`,

      // Table ArticleGallery
      `CREATE TABLE IF NOT EXISTS "ArticleGallery" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "articleId" TEXT NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "altText" TEXT,
        "caption" TEXT,
        "captionAr" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE
      )`,

      // Table EventGallery
      `CREATE TABLE IF NOT EXISTS "EventGallery" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "eventId" TEXT NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "altText" TEXT,
        "caption" TEXT,
        "captionAr" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE
      )`
    ];

    for (const sql of createTablesSQL) {
      try {
        await tursoClient.execute(sql);
        console.log(`   ✅ Table créée`);
      } catch (error) {
        console.log(`   ⚠️  Table (peut-être déjà existante): ${error.message}`);
      }
    }

    // 2. Connexion à la base locale et migration des données
    console.log('📖 Connexion à la base locale...');
    const localDb = new Database(LOCAL_DB_PATH);

    // Migrer les Admins
    console.log('👤 Migration des administrateurs...');
    const admins = localDb.prepare('SELECT * FROM Admin').all();
    for (const admin of admins) {
      try {
        await tursoClient.execute(`
          INSERT OR REPLACE INTO Admin (id, email, password, name, role, isActive, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          admin.id,
          admin.email,
          admin.password,
          admin.name,
          admin.role,
          admin.isActive ? 1 : 0,
          admin.createdAt,
          admin.updatedAt
        ]);
        console.log(`   ✅ Admin: ${admin.email}`);
      } catch (error) {
        console.log(`   ⚠️  Admin ${admin.email}: ${error.message}`);
      }
    }

    // Migrer les Catégories
    console.log('📂 Migration des catégories...');
    const categories = localDb.prepare('SELECT * FROM Category').all();
    for (const category of categories) {
      try {
        await tursoClient.execute(`
          INSERT OR REPLACE INTO Category (id, name, nameAr, description, descriptionAr, color, isActive, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          category.id,
          category.name,
          category.nameAr,
          category.description,
          category.descriptionAr,
          category.color,
          category.isActive ? 1 : 0,
          category.createdAt,
          category.updatedAt
        ]);
        console.log(`   ✅ Catégorie: ${category.name}`);
      } catch (error) {
        console.log(`   ⚠️  Catégorie ${category.name}: ${error.message}`);
      }
    }

    // Migrer les Articles
    console.log('📰 Migration des articles...');
    const articles = localDb.prepare('SELECT * FROM Article').all();
    for (const article of articles) {
      try {
        await tursoClient.execute(`
          INSERT OR REPLACE INTO Article (id, title, titleAr, content, contentAr, excerpt, excerptAr, slug, featured, published, publishedAt, imageUrl, tags, categoryId, authorId, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          article.id,
          article.title,
          article.titleAr,
          article.content,
          article.contentAr,
          article.excerpt,
          article.excerptAr,
          article.slug,
          article.featured ? 1 : 0,
          article.published ? 1 : 0,
          article.publishedAt,
          article.imageUrl,
          article.tags,
          article.categoryId,
          article.authorId,
          article.createdAt,
          article.updatedAt
        ]);
        console.log(`   ✅ Article: ${article.title}`);
      } catch (error) {
        console.log(`   ⚠️  Article ${article.title}: ${error.message}`);
      }
    }

    // Migrer les Événements
    console.log('📅 Migration des événements...');
    const events = localDb.prepare('SELECT * FROM Event').all();
    for (const event of events) {
      try {
        await tursoClient.execute(`
          INSERT OR REPLACE INTO Event (id, title, titleAr, description, descriptionAr, startDate, endDate, location, locationAr, imageUrl, published, categoryId, authorId, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          event.id,
          event.title,
          event.titleAr,
          event.description,
          event.descriptionAr,
          event.startDate,
          event.endDate,
          event.location,
          event.locationAr,
          event.imageUrl,
          event.published ? 1 : 0,
          event.categoryId,
          event.authorId,
          event.createdAt,
          event.updatedAt
        ]);
        console.log(`   ✅ Événement: ${event.title}`);
      } catch (error) {
        console.log(`   ⚠️  Événement ${event.title}: ${error.message}`);
      }
    }

    // Migrer les Documents
    console.log('📄 Migration des documents...');
    const documents = localDb.prepare('SELECT * FROM Document').all();
    for (const document of documents) {
      try {
        await tursoClient.execute(`
          INSERT OR REPLACE INTO Document (id, title, titleAr, description, descriptionAr, fileUrl, fileName, fileSize, mimeType, category, isPublic, authorId, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          document.id,
          document.title,
          document.titleAr,
          document.description,
          document.descriptionAr,
          document.fileUrl,
          document.fileName,
          document.fileSize,
          document.mimeType,
          document.category,
          document.isPublic ? 1 : 0,
          document.authorId,
          document.createdAt,
          document.updatedAt
        ]);
        console.log(`   ✅ Document: ${document.title}`);
      } catch (error) {
        console.log(`   ⚠️  Document ${document.title}: ${error.message}`);
      }
    }

    // Migrer les Galeries d'articles
    console.log('🖼️  Migration des galeries d\'articles...');
    const articleGalleries = localDb.prepare('SELECT * FROM ArticleGallery').all();
    for (const gallery of articleGalleries) {
      try {
        await tursoClient.execute(`
          INSERT OR REPLACE INTO ArticleGallery (id, articleId, imageUrl, altText, caption, captionAr, "order", createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          gallery.id,
          gallery.articleId,
          gallery.imageUrl,
          gallery.altText,
          gallery.caption,
          gallery.captionAr,
          gallery.order,
          gallery.createdAt
        ]);
        console.log(`   ✅ Galerie article: ${gallery.id}`);
      } catch (error) {
        console.log(`   ⚠️  Galerie ${gallery.id}: ${error.message}`);
      }
    }

    // Migrer les Galeries d'événements
    console.log('🖼️  Migration des galeries d\'événements...');
    const eventGalleries = localDb.prepare('SELECT * FROM EventGallery').all();
    for (const gallery of eventGalleries) {
      try {
        await tursoClient.execute(`
          INSERT OR REPLACE INTO EventGallery (id, eventId, imageUrl, altText, caption, captionAr, "order", createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          gallery.id,
          gallery.eventId,
          gallery.imageUrl,
          gallery.altText,
          gallery.caption,
          gallery.captionAr,
          gallery.order,
          gallery.createdAt
        ]);
        console.log(`   ✅ Galerie événement: ${gallery.id}`);
      } catch (error) {
        console.log(`   ⚠️  Galerie ${gallery.id}: ${error.message}`);
      }
    }

    // Fermer la connexion locale
    localDb.close();

    console.log('🎉 Migration complète terminée avec succès !');
    console.log('');
    console.log('📊 Résumé de la migration :');
    console.log(`   👤 Admins: ${admins.length}`);
    console.log(`   📂 Catégories: ${categories.length}`);
    console.log(`   📰 Articles: ${articles.length}`);
    console.log(`   📅 Événements: ${events.length}`);
    console.log(`   📄 Documents: ${documents.length}`);
    console.log(`   🖼️  Galeries articles: ${articleGalleries.length}`);
    console.log(`   🖼️  Galeries événements: ${eventGalleries.length}`);
    console.log('');
    console.log('📋 URL de connexion pour Vercel :');
    console.log(`DATABASE_URL="${TURSO_URL}?authToken=${TURSO_TOKEN}"`);
    console.log('');
    console.log('🔑 Identifiants admin (si existants) :');
    for (const admin of admins) {
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   🔑 Mot de passe: (votre mot de passe actuel)`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
  }
}

// Exécuter la migration complète
completeMigration();
