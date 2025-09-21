// Script d'initialisation de la base de données Turso
const { createClient } = require('@libsql/client');

// Configuration
const TURSO_URL = process.env.TURSO_URL || 'libsql://ambassade-mali-libye-[org].turso.io';
const TURSO_TOKEN = process.env.TURSO_TOKEN || 'your-token-here';

async function initTursoDatabase() {
  console.log('🚀 Initialisation de la base de données Turso...');
  
  // Vérifier les variables d'environnement
  if (TURSO_URL.includes('[org]') || TURSO_TOKEN === 'your-token-here') {
    console.log('❌ Veuillez configurer TURSO_URL et TURSO_TOKEN');
    console.log('📋 Variables requises :');
    console.log('   TURSO_URL="libsql://ambassade-mali-libye-[votre-org].turso.io"');
    console.log('   TURSO_TOKEN="votre-token-ici"');
    return;
  }

  try {
    // Créer le client Turso
    const client = createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN
    });

    console.log('✅ Connexion à Turso établie');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await client.execute('SELECT * FROM Admin WHERE email = ?', ['admin@ambassade-mali-libye.com']);
    
    if (existingAdmin.rows.length > 0) {
      console.log('👤 Utilisateur admin existe déjà');
      console.log('📧 Email: admin@ambassade-mali-libye.com');
      console.log('🔑 Mot de passe: admin123');
      return;
    }

    // Créer l'utilisateur admin
    console.log('👤 Création de l\'utilisateur admin...');
    
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminId = 'admin-' + Date.now();
    
    await client.execute(`
      INSERT INTO Admin (id, email, password, name, role, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      adminId,
      'admin@ambassade-mali-libye.com',
      hashedPassword,
      'Administrateur',
      'ADMIN',
      true,
      new Date().toISOString(),
      new Date().toISOString()
    ]);

    // Créer une catégorie d'exemple
    console.log('📂 Création des catégories...');
    
    const categoryId = 'cat-' + Date.now();
    
    await client.execute(`
      INSERT INTO Category (id, name, nameAr, description, descriptionAr, color, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      categoryId,
      'Actualités',
      'أخبار',
      'Articles d\'actualité de l\'ambassade',
      'مقالات إخبارية من السفارة',
      '#3B82F6',
      true,
      new Date().toISOString(),
      new Date().toISOString()
    ]);

    // Créer un article d'exemple
    console.log('📰 Création d\'un article d\'exemple...');
    
    const articleId = 'art-' + Date.now();
    
    await client.execute(`
      INSERT INTO Article (id, title, titleAr, content, contentAr, excerpt, excerptAr, slug, published, publishedAt, imageUrl, tags, categoryId, authorId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      articleId,
      'Bienvenue sur le site de l\'Ambassade du Mali en Libye',
      'مرحباً بكم في موقع سفارة مالي في ليبيا',
      'Nous sommes ravis de vous accueillir sur le site officiel de l\'Ambassade de la République du Mali en Libye. Ce site vous fournira toutes les informations nécessaires concernant nos services consulaires, les relations bilatérales entre nos deux pays, et les actualités importantes.',
      'يسعدنا أن نرحب بكم في الموقع الرسمي لسفارة جمهورية مالي في ليبيا. يوفر لكم هذا الموقع جميع المعلومات اللازمة حول خدماتنا القنصلية والعلاقات الثنائية بين بلدينا والأخبار المهمة.',
      'Site officiel de l\'Ambassade du Mali en Libye',
      'الموقع الرسمي لسفارة مالي في ليبيا',
      'bienvenue-ambassade-mali-libye',
      true,
      new Date().toISOString(),
      '/images/logo/logo-ambassade-mali.png',
      JSON.stringify(['accueil', 'ambassade', 'mali', 'libye']),
      categoryId,
      adminId,
      new Date().toISOString(),
      new Date().toISOString()
    ]);

    console.log('🎉 Base de données initialisée avec succès !');
    console.log('');
    console.log('👤 Utilisateur admin créé :');
    console.log('   📧 Email: admin@ambassade-mali-libye.com');
    console.log('   🔑 Mot de passe: admin123');
    console.log('   ⚠️  IMPORTANT: Changez le mot de passe après la première connexion !');
    console.log('');
    console.log('📋 URL de connexion pour Vercel :');
    console.log(`DATABASE_URL="${TURSO_URL}?authToken=${TURSO_TOKEN}"`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message);
  }
}

// Exécuter l'initialisation
initTursoDatabase();
