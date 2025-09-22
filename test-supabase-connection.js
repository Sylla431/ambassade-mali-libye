#!/usr/bin/env node

/**
 * Script de test de connexion Supabase
 * Vérifie que la base de données est accessible et fonctionnelle
 */

const { PrismaClient } = require('@prisma/client');

async function testSupabaseConnection() {
  console.log('🔍 Test de connexion Supabase...');
  
  const prisma = new PrismaClient();
  
  try {
    // Test 1: Connexion de base
    console.log('📡 Test 1: Connexion de base...');
    await prisma.$connect();
    console.log('✅ Connexion réussie!');
    
    // Test 2: Vérifier les tables
    console.log('\n📊 Test 2: Vérification des tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    console.log('📋 Tables trouvées:', tables.map(t => t.table_name).join(', '));
    
    // Test 3: Vérifier les données
    console.log('\n📈 Test 3: Vérification des données...');
    
    // Compter les enregistrements
    const [adminCount, categoryCount, articleCount] = await Promise.all([
      prisma.admin.count(),
      prisma.category.count(),
      prisma.article.count()
    ]);
    
    console.log(`👤 Admins: ${adminCount}`);
    console.log(`📂 Catégories: ${categoryCount}`);
    console.log(`📰 Articles: ${articleCount}`);
    
    // Test 4: Test de requête complexe
    console.log('\n🔍 Test 4: Requête complexe...');
    const articlesWithCategories = await prisma.article.findMany({
      take: 3,
      include: {
        category: true,
        author: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`📰 Derniers articles: ${articlesWithCategories.length}`);
    articlesWithCategories.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title} (${article.category?.name || 'Sans catégorie'})`);
    });
    
    // Test 5: Test d'écriture
    console.log('\n✍️  Test 5: Test d\'écriture...');
    const testCategory = await prisma.category.upsert({
      where: { name: 'Test Supabase' },
      update: {},
      create: {
        name: 'Test Supabase',
        nameAr: 'اختبار سوبابيس',
        description: 'Catégorie de test pour vérifier la connexion',
        descriptionAr: 'فئة اختبار للتحقق من الاتصال',
        color: '#FF6B6B',
        isActive: true
      }
    });
    console.log('✅ Test d\'écriture réussi!');
    
    // Nettoyer le test
    await prisma.category.delete({
      where: { id: testCategory.id }
    });
    console.log('🧹 Données de test nettoyées');
    
    console.log('\n🎉 Tous les tests sont passés avec succès!');
    console.log('✅ Supabase est prêt pour la production');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    
    if (error.code === 'P1001') {
      console.log('💡 Solution: Vérifiez votre DATABASE_URL');
    } else if (error.code === 'P1002') {
      console.log('💡 Solution: Vérifiez que le serveur Supabase est accessible');
    } else if (error.code === 'P1003') {
      console.log('💡 Solution: Vérifiez que la base de données existe');
    } else if (error.code === 'P1017') {
      console.log('💡 Solution: Vérifiez vos identifiants de connexion');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le test
testSupabaseConnection();
