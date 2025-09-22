#!/usr/bin/env node

// Script pour publier tous les articles
const { PrismaClient } = require('@prisma/client');

async function publishArticles() {
  console.log('📝 Publication de tous les articles...');
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19ELWEwMGw4TzFCT3MtSVRDclFsYXAiLCJhcGlfa2V5IjoiMDFLNVFNN0NTQjJOWVNISFZZUllYM1kyQVciLCJ0ZW5hbnRfaWQiOiIzNGRmY2JiNDAzY2VmYWRjOWI5OTBiZDc0YTg3N2YzYmM4YjFjZWVjMDBjOGE0ZDJkMWZiMjE1YmQyODJkNzM4IiwiaW50ZXJuYWxfc2VjcmV0IjoiODVmNWQ4NDAtNTFmZS00ODg4LWIwNzgtMTEyYWIzZjU1YmU1In0.9nCe1keil-kwoTP7bZAJFnavbf5TCSlVb7B21A3UfJo"
      }
    }
  });
  
  try {
    // Publier tous les articles
    const result = await prisma.article.updateMany({
      where: {
        published: false
      },
      data: {
        published: true,
        publishedAt: new Date()
      }
    });
    
    console.log(`✅ ${result.count} articles publiés`);
    
    // Vérifier les articles publiés
    const publishedArticles = await prisma.article.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        published: true,
        publishedAt: true
      }
    });
    
    console.log(`📋 Articles publiés (${publishedArticles.length}):`);
    publishedArticles.forEach(article => {
      console.log(`- ${article.title} (${article.publishedAt})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

publishArticles().catch(console.error);
