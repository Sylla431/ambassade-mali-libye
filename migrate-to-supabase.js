#!/usr/bin/env node

/**
 * Script de migration de SQLite vers Supabase PostgreSQL
 * Exporte les données de dev.db et les adapte pour PostgreSQL
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Migration vers Supabase PostgreSQL...');

// 1. Exporter les données de SQLite
console.log('📤 Export des données SQLite...');
try {
  const exportCommand = 'sqlite3 prisma/dev.db ".dump" > data_export.sql';
  execSync(exportCommand, { stdio: 'inherit' });
  console.log('✅ Données exportées vers data_export.sql');
} catch (error) {
  console.error('❌ Erreur lors de l\'export:', error.message);
  process.exit(1);
}

// 2. Lire et adapter le fichier exporté
console.log('🔧 Adaptation pour PostgreSQL...');
let sqlContent = fs.readFileSync('data_export.sql', 'utf8');

// Adaptations SQLite → PostgreSQL
const adaptations = [
  // Supprimer les commandes SQLite spécifiques
  { from: /PRAGMA.*;/g, to: '-- $&' },
  { from: /BEGIN TRANSACTION;/g, to: '-- $&' },
  { from: /COMMIT;/g, to: '-- $&' },
  { from: /sqlite_sequence/g, to: '-- $&' },
  
  // Adapter les types de données
  { from: /INTEGER PRIMARY KEY AUTOINCREMENT/g, to: 'SERIAL PRIMARY KEY' },
  { from: /INTEGER/g, to: 'INTEGER' },
  { from: /TEXT/g, to: 'TEXT' },
  { from: /REAL/g, to: 'REAL' },
  { from: /BLOB/g, to: 'BYTEA' },
  
  // Adapter les contraintes
  { from: /AUTOINCREMENT/g, to: '' },
  
  // Adapter les valeurs par défaut
  { from: /DEFAULT CURRENT_TIMESTAMP/g, to: 'DEFAULT NOW()' },
  
  // Adapter les guillemets
  { from: /`([^`]+)`/g, to: '"$1"' },
  
  // Supprimer les index SQLite spécifiques
  { from: /CREATE INDEX.*sqlite_autoindex.*;/g, to: '-- $&' },
];

// Appliquer les adaptations
adaptations.forEach(({ from, to }) => {
  sqlContent = sqlContent.replace(from, to);
});

// 3. Créer le script PostgreSQL final
const postgresqlScript = `
-- Script de migration vers Supabase PostgreSQL
-- Généré automatiquement depuis SQLite

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Supprimer les tables existantes (si elles existent)
DROP TABLE IF EXISTS "ArticleGallery" CASCADE;
DROP TABLE IF EXISTS "EventGallery" CASCADE;
DROP TABLE IF EXISTS "Article" CASCADE;
DROP TABLE IF EXISTS "Event" CASCADE;
DROP TABLE IF EXISTS "Document" CASCADE;
DROP TABLE IF EXISTS "ContactMessage" CASCADE;
DROP TABLE IF EXISTS "VisaApplication" CASCADE;
DROP TABLE IF EXISTS "Announcement" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "Admin" CASCADE;

-- Créer les types ENUM
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR');
CREATE TYPE "DocumentCategory" AS ENUM ('VISA_FORMS', 'LEGAL_DOCUMENTS', 'NEWS', 'ANNOUNCEMENTS', 'CULTURAL', 'ECONOMIC', 'POLITICAL');
CREATE TYPE "VisaStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING');

${sqlContent}

-- Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS "idx_article_published" ON "Article"("published");
CREATE INDEX IF NOT EXISTS "idx_article_category" ON "Article"("categoryId");
CREATE INDEX IF NOT EXISTS "idx_article_author" ON "Article"("authorId");
CREATE INDEX IF NOT EXISTS "idx_event_date" ON "Event"("eventDate");
CREATE INDEX IF NOT EXISTS "idx_document_public" ON "Document"("isPublic");
CREATE INDEX IF NOT EXISTS "idx_document_category" ON "Document"("category");
CREATE INDEX IF NOT EXISTS "idx_visa_status" ON "VisaApplication"("status");
CREATE INDEX IF NOT EXISTS "idx_contact_created" ON "ContactMessage"("createdAt");

-- Insérer un utilisateur admin par défaut
INSERT INTO "Admin" ("id", "email", "password", "name", "role", "isActive", "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'admin@ambassade-mali-libye.com',
  '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA',
  'Administrateur Principal',
  'SUPER_ADMIN',
  true,
  NOW(),
  NOW()
) ON CONFLICT ("email") DO NOTHING;

-- Insérer une catégorie par défaut
INSERT INTO "Category" ("id", "name", "nameAr", "description", "descriptionAr", "color", "isActive", "createdAt", "updatedAt")
VALUES (
  'cat-001',
  'Actualités',
  'أخبار',
  'Articles d\'actualité de l\'ambassade',
  'مقالات إخبارية من السفارة',
  '#3B82F6',
  true,
  NOW(),
  NOW()
) ON CONFLICT ("id") DO NOTHING;

COMMIT;
`;

// 4. Sauvegarder le script PostgreSQL
fs.writeFileSync('supabase_migration.sql', postgresqlScript);
console.log('✅ Script PostgreSQL créé: supabase_migration.sql');

// 5. Créer un script de test de connexion
const testScript = `
-- Test de connexion Supabase
-- Exécutez ce script dans le SQL Editor de Supabase

SELECT 
  'Connexion réussie!' as status,
  NOW() as timestamp,
  version() as postgres_version;

-- Vérifier les tables créées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
`;

fs.writeFileSync('test_supabase_connection.sql', testScript);
console.log('✅ Script de test créé: test_supabase_connection.sql');

console.log('\n🎉 Migration préparée avec succès!');
console.log('\n📋 Prochaines étapes:');
console.log('1. Créez votre projet Supabase');
console.log('2. Exécutez supabase_migration.sql dans le SQL Editor');
console.log('3. Testez avec test_supabase_connection.sql');
console.log('4. Configurez les variables d\'environnement Vercel');
console.log('5. Redéployez votre application');

// Nettoyer les fichiers temporaires
try {
  fs.unlinkSync('data_export.sql');
  console.log('🧹 Fichiers temporaires nettoyés');
} catch (error) {
  console.log('⚠️  Fichier data_export.sql conservé pour debug');
}
