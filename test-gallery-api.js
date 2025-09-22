#!/usr/bin/env node

// Script pour tester les APIs de galerie
const { PrismaClient } = require('@prisma/client');

async function testGalleryAPI() {
  console.log('🧪 Test des APIs de galerie...');
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19ELWEwMGw4TzFCT3MtSVRDclFsYXAiLCJhcGlfa2V5IjoiMDFLNVFNN0NTQjJOWVNISFZZUllYM1kyQVciLCJ0ZW5hbnRfaWQiOiIzNGRmY2JiNDAzY2VmYWRjOWI5OTBiZDc0YTg3N2YzYmM4YjFjZWVjMDBjOGE0ZDJkMWZiMjE1YmQyODJkNzM4IiwiaW50ZXJuYWxfc2VjcmV0IjoiODVmNWQ4NDAtNTFmZS00ODg4LWIwNzgtMTEyYWIzZjU1YmU1In0.9nCe1keil-kwoTP7bZAJFnavbf5TCSlVb7B21A3UfJo"
      }
    }
  });
  
  try {
    // Vérifier les articles avec des galeries
    const articlesWithGallery = await prisma.article.findMany({
      where: {
        gallery: {
          some: {}
        }
      },
      include: {
        gallery: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      take: 3
    });
    
    console.log(`📸 Articles avec galeries: ${articlesWithGallery.length}`);
    
    articlesWithGallery.forEach(article => {
      console.log(`- "${article.title}" (${article.gallery.length} images)`);
      article.gallery.forEach(image => {
        console.log(`  * ${image.imageUrl} (ordre: ${image.order})`);
      });
    });
    
    // Vérifier toutes les images de galerie
    const allGalleryImages = await prisma.articleGallery.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`\n🖼️ Images de galerie récentes: ${allGalleryImages.length}`);
    allGalleryImages.forEach(image => {
      console.log(`- ${image.imageUrl} (article: ${image.articleId})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testGalleryAPI().catch(console.error);
