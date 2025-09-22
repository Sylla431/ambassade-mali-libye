#!/usr/bin/env node

// Script pour corriger les relations articles-images
const { PrismaClient } = require('@prisma/client');

async function fixArticleImages() {
  console.log('🖼️ Correction des relations articles-images...');
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19ELWEwMGw4TzFCT3MtSVRDclFsYXAiLCJhcGlfa2V5IjoiMDFLNVFNN0NTQjJOWVNISFZZUllYM1kyQVciLCJ0ZW5hbnRfaWQiOiIzNGRmY2JiNDAzY2VmYWRjOWI5OTBiZDc0YTg3N2YzYmM4YjFjZWVjMDBjOGE0ZDJkMWZiMjE1YmQyODJkNzM4IiwiaW50ZXJuYWxfc2VjcmV0IjoiODVmNWQ4NDAtNTFmZS00ODg4LWIwNzgtMTEyYWIzZjU1YmU1In0.9nCe1keil-kwoTP7bZAJFnavbf5TCSlVb7B21A3UfJo"
      }
    }
  });
  
  try {
    // 1. Récupérer tous les articles
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true,
        gallery: true
      }
    });
    
    console.log(`📋 ${articles.length} articles trouvés`);
    
    // 2. Récupérer toutes les images disponibles dans public/uploads
    const fs = require('fs');
    const path = require('path');
    
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const imageFiles = [];
    
    // Récupérer toutes les images
    const scanDir = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          scanDir(filePath);
        } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
          const relativePath = path.relative(path.join(process.cwd(), 'public'), filePath);
          imageFiles.push({
            fileName: file,
            fileUrl: `/${relativePath.replace(/\\/g, '/')}`
          });
        }
      });
    };
    
    scanDir(uploadsDir);
    
    console.log(`🖼️ ${imageFiles.length} images trouvées dans public/uploads`);
    
    // 3. Assigner des images aux articles qui n'en ont pas
    for (const article of articles) {
      if (!article.imageUrl && imageFiles.length > 0) {
        // Assigner une image aléatoire comme image principale
        const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
        
        await prisma.article.update({
          where: { id: article.id },
          data: { 
            imageUrl: randomImage.fileUrl
          }
        });
        
        console.log(`✅ Image assignée à "${article.title}": ${randomImage.fileName}`);
      }
    }
    
    // 4. Créer des galeries pour les articles qui n'en ont pas
    for (const article of articles) {
      const articleGallery = await prisma.articleGallery.findMany({
        where: { articleId: article.id }
      });
      
      if (articleGallery.length === 0 && imageFiles.length > 0) {
        // Assigner 2-3 images aléatoires à la galerie
        const numImages = Math.min(3, imageFiles.length);
        const selectedImages = imageFiles
          .sort(() => 0.5 - Math.random())
          .slice(0, numImages);
        
        for (let i = 0; i < selectedImages.length; i++) {
          const image = selectedImages[i];
          await prisma.articleGallery.create({
            data: {
              articleId: article.id,
              imageUrl: image.fileUrl,
              altText: `Image ${i + 1} pour ${article.title}`,
              caption: `Image ${i + 1}`,
              order: i
            }
          });
        }
        
        console.log(`✅ Galerie créée pour "${article.title}": ${numImages} images`);
      }
    }
    
    // 5. Vérifier les résultats
    const updatedArticles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true,
        gallery: true
      }
    });
    
    console.log('\n📊 Résultats:');
    updatedArticles.forEach(article => {
      console.log(`- ${article.title}:`);
      console.log(`  Image principale: ${article.imageUrl ? '✅' : '❌'}`);
      console.log(`  Galerie: ${article.gallery.length} images`);
    });
    
    console.log('\n🎉 Correction terminée!');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixArticleImages().catch(console.error);
