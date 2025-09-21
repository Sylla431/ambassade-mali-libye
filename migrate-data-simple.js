// Script de migration des données vers Turso (noms de tables corrects)
const { createClient } = require('@libsql/client');
const Database = require('better-sqlite3');
const path = require('path');

// Configuration
const TURSO_URL = process.env.TURSO_URL || 'libsql://ambassade-mali-libye-[org].turso.io';
const TURSO_TOKEN = process.env.TURSO_TOKEN || 'your-token-here';
const LOCAL_DB_PATH = path.join(__dirname, 'prisma', 'dev.db');

async function migrateData() {
  console.log('📊 Migration des données vers Turso...');
  console.log(`📁 Base locale: ${LOCAL_DB_PATH}`);
  
  // Vérifier les variables d'environnement
  if (TURSO_URL.includes('[org]') || TURSO_TOKEN === 'your-token-here') {
    console.log('❌ Veuillez configurer TURSO_URL et TURSO_TOKEN');
    return;
  }

  try {
    // Connexion à la base locale
    const localDb = new Database(LOCAL_DB_PATH);
    
    // Connexion à Turso
    const tursoClient = createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN
    });

    console.log('✅ Connexions établies');

    // 1. Migrer les Admins (table: admins)
    console.log('👤 Migration des administrateurs...');
    const admins = localDb.prepare('SELECT * FROM admins').all();
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

    // 2. Migrer les Catégories (table: categories)
    console.log('📂 Migration des catégories...');
    const categories = localDb.prepare('SELECT * FROM categories').all();
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

    // 3. Migrer les Articles (table: articles)
    console.log('📰 Migration des articles...');
    const articles = localDb.prepare('SELECT * FROM articles').all();
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

    // 4. Migrer les Événements (table: events)
    console.log('📅 Migration des événements...');
    const events = localDb.prepare('SELECT * FROM events').all();
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

    // 5. Migrer les Documents (table: documents)
    console.log('📄 Migration des documents...');
    const documents = localDb.prepare('SELECT * FROM documents').all();
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

    // 6. Migrer les Galeries d'articles (table: article_gallery)
    console.log('🖼️  Migration des galeries d\'articles...');
    const articleGalleries = localDb.prepare('SELECT * FROM article_gallery').all();
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

    // 7. Migrer les Galeries d'événements (table: event_gallery)
    console.log('🖼️  Migration des galeries d\'événements...');
    const eventGalleries = localDb.prepare('SELECT * FROM event_gallery').all();
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

    console.log('🎉 Migration des données terminée !');
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

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
  }
}

// Exécuter la migration
migrateData();
