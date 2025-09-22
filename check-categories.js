#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function checkCategories() {
  console.log('🔍 Vérification des catégories...');
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19ELWEwMGw4TzFCT3MtSVRDclFsYXAiLCJhcGlfa2V5IjoiMDFLNVFNN0NTQjJOWVNISFZZUllYM1kyQVciLCJ0ZW5hbnRfaWQiOiIzNGRmY2JiNDAzY2VmYWRjOWI5OTBiZDc0YTg3N2YzYmM4YjFjZWVjMDBjOGE0ZDJkMWZiMjE1YmQyODJkNzM4IiwiaW50ZXJuYWxfc2VjcmV0IjoiODVmNWQ4NDAtNTFmZS00ODg4LWIwNzgtMTEyYWIzZjU1YmU1In0.9nCe1keil-kwoTP7bZAJFnavbf5TCSlVb7B21A3UfJo"
      }
    }
  });
  
  try {
    // Vérifier toutes les catégories
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            articles: {
              where: {
                published: true
              }
            }
          }
        }
      }
    });
    
    console.log(`📂 Catégories trouvées: ${categories.length}`);
    categories.forEach(cat => {
      console.log(`- "${cat.name}" (${cat._count.articles} articles publiés)`);
    });
    
    // Chercher spécifiquement les catégories diplomatiques
    const diplomaticCategories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: 'diplomatique', mode: 'insensitive' } },
          { name: { contains: 'diplomatie', mode: 'insensitive' } },
          { name: { contains: 'activité', mode: 'insensitive' } }
        ]
      }
    });
    
    console.log(`\n🎯 Catégories diplomatiques trouvées: ${diplomaticCategories.length}`);
    diplomaticCategories.forEach(cat => {
      console.log(`- "${cat.name}"`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories().catch(console.error);
