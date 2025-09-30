-- Migration pour ajouter le support vidéo à la galerie
-- Date: 2024-12-27
-- Version corrigée

-- 1. Créer l'enum MediaType d'abord
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- 2. Ajouter la colonne mediaType à ArticleGallery
ALTER TABLE "article_gallery" 
ADD COLUMN "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE';

-- 3. Renommer imageUrl en mediaUrl dans ArticleGallery
ALTER TABLE "article_gallery" 
RENAME COLUMN "imageUrl" TO "mediaUrl";

-- 4. Ajouter la colonne mediaType à EventGallery
ALTER TABLE "event_gallery" 
ADD COLUMN "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE';

-- 5. Renommer imageUrl en mediaUrl dans EventGallery
ALTER TABLE "event_gallery" 
RENAME COLUMN "imageUrl" TO "mediaUrl";
