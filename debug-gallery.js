#!/usr/bin/env node

// Script pour déboguer les galeries d'images
const { PrismaClient } = require('@prisma/client');

async function debugGallery() {
  console.log('🔍 Debug des galeries d\'images...');
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19ELWEwMGw4TzFCT3MtSVRDclFsYXAiLCJhcGlfa2V5IjoiMDFLNVFNN0NTQjJOWVNISFZZUllYM1kyQVciLCJ0ZW5hbnRfaWQiOiIzNGRmY2JiNDAzY2VmYWRjOWI5OTBiZDc0YTg3N2YzYmM4YjFjZWVjMDBjOGE0ZDJkMWZiMjE1YmQyODJkNzM4IiwiaW50ZXJuYWxfc2VjcmV0IjoiODVmNWQ4NDAtNTFmZS00ODg4LWIwNzgtMTEyYWIzZjU1YmU1In0.9nCe1keil-kwoTP7bZAJFnavbf5TCSlVb7B21A3UfJo"
      }
    }
  });
  
  try {
    // 1. Vérifier l'article "Journée Culturelle"
    const article = await prisma.article.findFirst({
      where: {
        title: {
          contains: "Journée Culturelle"
        }
      },
      select: {
        id: true,
        title: true,
        slug: true
      }
    });
    
    if (!article) {
      console.log('❌ Article "Journée Culturelle" non trouvé');
      return;
    }
    
    console.log(`📋 Article trouvé: ${article.title} (ID: ${article.id})`);
    
    // 2. Vérifier les images de galerie pour cet article
    const galleryImages = await prisma.articleGallery.findMany({
      where: {
        articleId: article.id
      },
      select: {
        id: true,
        imageUrl: true,
        caption: true,
        order: true
      },
      orderBy: {
        order: 'asc'
      }
    });
    
    console.log(`🖼️ ${galleryImages.length} images de galerie trouvées pour cet article`);
    
    if (galleryImages.length > 0) {
      console.log('📋 Détails des images:');
      galleryImages.forEach((image, index) => {
        console.log(`  ${index + 1}. ${image.imageUrl} (ordre: ${image.order})`);
      });
    }
    
    // 3. Vérifier toutes les images de galerie
    const allGalleryImages = await prisma.articleGallery.findMany({
      select: {
        id: true,
        articleId: true,
        imageUrl: true,
        order: true
      }
    });
    
    console.log(`\n📊 Total des images de galerie dans la base: ${allGalleryImages.length}`);
    
    // 4. Grouper par article
    const galleryByArticle = {};
    allGalleryImages.forEach(image => {
      if (!galleryByArticle[image.articleId]) {
        galleryByArticle[image.articleId] = [];
      }
      galleryByArticle[image.articleId].push(image);
    });
    
    console.log('\n📋 Images par article:');
    for (const [articleId, images] of Object.entries(galleryByArticle)) {
      const articleInfo = await prisma.article.findUnique({
        where: { id: articleId },
        select: { title: true }
      });
      console.log(`  - ${articleInfo?.title || 'Article inconnu'}: ${images.length} images`);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugGallery().catch(console.error);
