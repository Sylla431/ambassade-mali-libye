#!/usr/bin/env node

// Script pour restaurer les relations originales articles-images
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@libsql/client');

async function restoreOriginalImages() {
  console.log('🔄 Restauration des relations originales articles-images...');
  
  // Client Turso (source originale)
  const tursoClient = createClient({
    url: 'libsql://ambassade-mali-libye-marakadev.aws-us-east-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiJjYTBhMTcwNy05NjkzLTRiNzktODc1OC03ODE0YzE3NjFlZWUiLCJpYXQiOjE3NTg0ODc4MTAsInJpZCI6ImVjNDk4NmIxLTAxYzItNGExNC1iZDMwLTIwZDBjNzY4OGU0YiJ9.Fm85dhiODKrGRwfnHdzNiN8HGSqqzxTIpzk2LLMgTNcOTDQ2Z2P6NV902JqVtqBLtv82neAvpztI2VPBGb_xBA'
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
    // 1. Récupérer les articles originaux de Turso
    console.log('📋 Récupération des articles originaux de Turso...');
    const originalArticles = await tursoClient.execute('SELECT id, title, imageUrl FROM Article');
    
    console.log(`📋 ${originalArticles.rows.length} articles originaux trouvés`);
    
    // 2. Récupérer les galeries originales de Turso
    console.log('🖼️ Récupération des galeries originales de Turso...');
    const originalGalleries = await tursoClient.execute('SELECT * FROM ArticleGallery');
    
    console.log(`🖼️ ${originalGalleries.rows.length} images de galerie originales trouvées`);
    
    // 3. Nettoyer les relations actuelles dans PostgreSQL
    console.log('🧹 Nettoyage des relations actuelles...');
    await prisma.articleGallery.deleteMany({});
    
    // 4. Restaurer les images principales des articles
    console.log('🔄 Restauration des images principales...');
    for (const article of originalArticles.rows) {
      if (article.imageUrl) {
        await prisma.article.update({
          where: { id: article.id },
          data: { imageUrl: article.imageUrl }
        });
        console.log(`✅ Image restaurée pour "${article.title}": ${article.imageUrl}`);
      }
    }
    
    // 5. Restaurer les galeries
    console.log('🔄 Restauration des galeries...');
    for (const gallery of originalGalleries.rows) {
      await prisma.articleGallery.create({
        data: {
          id: gallery.id,
          articleId: gallery.articleId,
          imageUrl: gallery.imageUrl,
          altText: gallery.altText,
          caption: gallery.caption,
          captionAr: gallery.captionAr,
          order: gallery.order || 0,
          createdAt: new Date(gallery.createdAt)
        }
      });
      console.log(`✅ Image de galerie restaurée: ${gallery.imageUrl}`);
    }
    
    // 6. Vérifier les résultats
    const restoredArticles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true,
        gallery: true
      }
    });
    
    console.log('\n📊 Résultats de la restauration:');
    restoredArticles.forEach(article => {
      console.log(`- ${article.title}:`);
      console.log(`  Image principale: ${article.imageUrl ? '✅' : '❌'}`);
      console.log(`  Galerie: ${article.gallery.length} images`);
    });
    
    console.log('\n🎉 Restauration terminée!');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

restoreOriginalImages().catch(console.error);
