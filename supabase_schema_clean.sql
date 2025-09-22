
-- Schéma Supabase PostgreSQL pour l'Ambassade du Mali en Libye
-- Version simplifiée et compatible

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Supprimer les types ENUM existants
DROP TYPE IF EXISTS "AdminRole" CASCADE;
DROP TYPE IF EXISTS "DocumentCategory" CASCADE;
DROP TYPE IF EXISTS "VisaStatus" CASCADE;

-- Créer les types ENUM
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR');
CREATE TYPE "DocumentCategory" AS ENUM ('VISA_FORMS', 'LEGAL_DOCUMENTS', 'NEWS', 'ANNOUNCEMENTS', 'CULTURAL', 'ECONOMIC', 'POLITICAL');
CREATE TYPE "VisaStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING');

-- Supprimer les tables existantes
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

-- Créer la table Admin
CREATE TABLE "Admin" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'EDITOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Créer la table Category
CREATE TABLE "Category" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "description" TEXT,
    "descriptionAr" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Créer la table Article
CREATE TABLE "Article" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "content" TEXT NOT NULL,
    "contentAr" TEXT,
    "excerpt" TEXT,
    "excerptAr" TEXT,
    "slug" TEXT UNIQUE NOT NULL,
    "imageUrl" TEXT,
    "tags" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL,
    FOREIGN KEY ("authorId") REFERENCES "Admin"("id") ON DELETE CASCADE
);

-- Créer la table Event
CREATE TABLE "Event" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "description" TEXT,
    "descriptionAr" TEXT,
    "eventDate" TIMESTAMP NOT NULL,
    "location" TEXT,
    "locationAr" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Créer la table Document
CREATE TABLE "Document" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "description" TEXT,
    "descriptionAr" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("authorId") REFERENCES "Admin"("id") ON DELETE CASCADE
);

-- Créer la table ContactMessage
CREATE TABLE "ContactMessage" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Créer la table VisaApplication
CREATE TABLE "VisaApplication" (
    "id" TEXT PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" "VisaStatus" NOT NULL DEFAULT 'PENDING',
    "documents" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Créer la table Announcement
CREATE TABLE "Announcement" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "content" TEXT NOT NULL,
    "contentAr" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Créer la table ArticleGallery
CREATE TABLE "ArticleGallery" (
    "id" TEXT PRIMARY KEY,
    "articleId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE
);

-- Créer la table EventGallery
CREATE TABLE "EventGallery" (
    "id" TEXT PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE
);

-- Créer les index pour améliorer les performances
CREATE INDEX "idx_article_published" ON "Article"("published");
CREATE INDEX "idx_article_category" ON "Article"("categoryId");
CREATE INDEX "idx_article_author" ON "Article"("authorId");
CREATE INDEX "idx_article_slug" ON "Article"("slug");
CREATE INDEX "idx_event_date" ON "Event"("eventDate");
CREATE INDEX "idx_document_public" ON "Document"("isPublic");
CREATE INDEX "idx_document_category" ON "Document"("category");
CREATE INDEX "idx_visa_status" ON "VisaApplication"("status");
CREATE INDEX "idx_contact_created" ON "ContactMessage"("createdAt");
CREATE INDEX "idx_announcement_active" ON "Announcement"("isActive");

-- Insérer des données de test
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

INSERT INTO "Category" ("id", "name", "nameAr", "description", "descriptionAr", "color", "isActive", "createdAt", "updatedAt")
VALUES 
    ('cat-001', 'Actualités', 'أخبار', 'Articles d''actualité de l''ambassade', 'مقالات إخبارية من السفارة', '#3B82F6', true, NOW(), NOW()),
    ('cat-002', 'Événements', 'أحداث', 'Événements et manifestations', 'الأحداث والفعاليات', '#10B981', true, NOW(), NOW()),
    ('cat-003', 'Services', 'خدمات', 'Services consulaires', 'الخدمات القنصلية', '#F59E0B', true, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Article" ("id", "title", "titleAr", "content", "contentAr", "excerpt", "excerptAr", "slug", "imageUrl", "tags", "published", "featured", "categoryId", "authorId", "createdAt", "updatedAt")
VALUES (
    'art-001',
    'Bienvenue sur le site de l''Ambassade du Mali en Libye',
    'مرحباً بكم في موقع سفارة مالي في ليبيا',
    'L''Ambassade du Mali en Libye est heureuse de vous accueillir sur son site officiel. Nous sommes là pour vous accompagner dans vos démarches consulaires et vous informer sur les relations entre nos deux pays.',
    'سفارة مالي في ليبيا سعيدة لاستقبالكم على موقعها الرسمي. نحن هنا لمساعدتكم في إجراءاتكم القنصلية وإعلامكم بالعلاقات بين بلدينا.',
    'Site officiel de l''Ambassade du Mali en Libye',
    'الموقع الرسمي لسفارة مالي في ليبيا',
    'bienvenue-ambassade-mali-libye',
    '/images/logo/logo-ambassade-mali.png',
    '["accueil", "ambassade", "mali", "libye"]',
    true,
    true,
    'cat-001',
    'admin-001',
    NOW(),
    NOW()
) ON CONFLICT ("id") DO NOTHING;

-- Vérifier la création
SELECT 
    'Schéma créé avec succès!' as status,
    COUNT(*) as tables_created
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('Admin', 'Category', 'Article', 'Event', 'Document', 'ContactMessage', 'VisaApplication', 'Announcement', 'ArticleGallery', 'EventGallery');
