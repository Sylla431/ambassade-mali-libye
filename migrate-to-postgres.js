#!/usr/bin/env node

// Script pour migrer les données de Turso vers PostgreSQL
const { createClient } = require('@libsql/client');
const { PrismaClient } = require('@prisma/client');

async function migrateToPostgres() {
  console.log('🔄 Migration de Turso vers PostgreSQL...');
  
  // Client Turso (source)
  const tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL || 'libsql://ambassade-mali-libye-marakadev.aws-us-east-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiJjYTBhMTcwNy05NjkzLTRiNzktODc1OC03ODE0YzE3NjFlZWUiLCJpYXQiOjE3NTg0ODc4MTAsInJpZCI6ImVjNDk4NmIxLTAxYzItNGExNC1iZDMwLTIwZDBjNzY4OGU0YiJ9.Fm85dhiODKrGRwfnHdzNiN8HGSqqzxTIpzk2LLMgTNcOTDQ2Z2P6NV902JqVtqBLtv82neAvpztI2VPBGb_xBA'
  });
  
  // Client Prisma (destination PostgreSQL)
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19ELWEwMGw4TzFCT3MtSVRDclFsYXAiLCJhcGlfa2V5IjoiMDFLNVFNN0NTQjJOWVNISFZZUllYM1kyQVciLCJ0ZW5hbnRfaWQiOiIzNGRmY2JiNDAzY2VmYWRjOWI5OTBiZDc0YTg3N2YzYmM4YjFjZWVjMDBjOGE0ZDJkMWZiMjE1YmQyODJkNzM4IiwiaW50ZXJuYWxfc2VjcmV0IjoiODVmNWQ4NDAtNTFmZS00ODg4LWIwNzgtMTEyYWIzZjU1YmU1In0.9nCe1keil-kwoTP7bZAJFnavbf5TCSlVb7B21A3UfJo"
      }
    }
  });
  
  try {
    // 1. Migrer les Admins
    console.log('📋 Migration des Admins...');
    const admins = await tursoClient.execute('SELECT * FROM Admin');
    for (const admin of admins.rows) {
      await prisma.admin.upsert({
        where: { id: admin.id },
        update: {},
        create: {
          id: admin.id,
          email: admin.email,
          password: admin.password,
          name: admin.name,
          role: admin.role,
          isActive: Boolean(admin.isActive),
          createdAt: new Date(admin.createdAt),
          updatedAt: new Date(admin.updatedAt)
        }
      });
    }
    console.log(`✅ ${admins.rows.length} admins migrés`);
    
    // 2. Migrer les Catégories
    console.log('📋 Migration des Catégories...');
    const categories = await tursoClient.execute('SELECT * FROM Category');
    for (const category of categories.rows) {
      await prisma.category.upsert({
        where: { id: category.id },
        update: {},
        create: {
          id: category.id,
          name: category.name,
          nameAr: category.nameAr,
          description: category.description,
          descriptionAr: category.descriptionAr,
          color: category.color,
          isActive: Boolean(category.isActive),
          createdAt: new Date(category.createdAt),
          updatedAt: new Date(category.updatedAt)
        }
      });
    }
    console.log(`✅ ${categories.rows.length} catégories migrées`);
    
    // 3. Migrer les Articles
    console.log('📋 Migration des Articles...');
    const articles = await tursoClient.execute('SELECT * FROM Article');
    for (const article of articles.rows) {
      await prisma.article.upsert({
        where: { id: article.id },
        update: {},
        create: {
          id: article.id,
          title: article.title,
          titleAr: article.titleAr,
          content: article.content,
          contentAr: article.contentAr,
          excerpt: article.excerpt,
          excerptAr: article.excerptAr,
          slug: article.slug,
          featuredImage: article.featuredImage,
          published: Boolean(article.isPublished),
          publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
          categoryId: article.categoryId,
          authorId: article.authorId,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt)
        }
      });
    }
    console.log(`✅ ${articles.rows.length} articles migrés`);
    
    // 4. Migrer les Documents
    console.log('📋 Migration des Documents...');
    const documents = await tursoClient.execute('SELECT * FROM Document');
    for (const document of documents.rows) {
      await prisma.document.upsert({
        where: { id: document.id },
        update: {},
        create: {
          id: document.id,
          title: document.title,
          titleAr: document.titleAr,
          description: document.description,
          descriptionAr: document.descriptionAr,
          fileUrl: document.fileUrl,
          fileName: document.fileName,
          fileSize: document.fileSize,
          mimeType: document.mimeType,
          category: document.category,
          isPublic: Boolean(document.isPublic),
          authorId: document.authorId,
          createdAt: new Date(document.createdAt),
          updatedAt: new Date(document.updatedAt)
        }
      });
    }
    console.log(`✅ ${documents.rows.length} documents migrés`);
    
    // 5. Migrer les Événements
    console.log('📋 Migration des Événements...');
    const events = await tursoClient.execute('SELECT * FROM Event');
    for (const event of events.rows) {
      await prisma.event.upsert({
        where: { id: event.id },
        update: {},
        create: {
          id: event.id,
          title: event.title,
          titleAr: event.titleAr,
          description: event.description,
          descriptionAr: event.descriptionAr,
          location: event.location,
          locationAr: event.locationAr,
          startDate: new Date(event.startDate),
          endDate: event.endDate ? new Date(event.endDate) : null,
          published: Boolean(event.isPublished),
          authorId: event.authorId,
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt)
        }
      });
    }
    console.log(`✅ ${events.rows.length} événements migrés`);
    
    console.log('\n🎉 Migration terminée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateToPostgres().catch(console.error);
