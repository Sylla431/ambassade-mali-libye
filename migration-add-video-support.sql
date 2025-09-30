-- Migration pour ajouter le support vidéo à la galerie
-- Date: 2024-12-27

-- 1. Ajouter la colonne mediaType à ArticleGallery
ALTER TABLE "article_gallery" 
ADD COLUMN "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE';

-- 2. Renommer imageUrl en mediaUrl
ALTER TABLE "article_gallery" 
RENAME COLUMN "imageUrl" TO "mediaUrl";

-- 3. Ajouter la colonne mediaType à EventGallery
ALTER TABLE "event_gallery" 
ADD COLUMN "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE';

-- 4. Renommer imageUrl en mediaUrl dans EventGallery
ALTER TABLE "event_gallery" 
RENAME COLUMN "imageUrl" TO "mediaUrl";

-- 5. Créer l'enum MediaType
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- Note: Cette migration doit être appliquée dans l'ordre suivant:
-- 1. D'abord créer l'enum MediaType
-- 2. Puis ajouter les colonnes mediaType
-- 3. Enfin renommer les colonnes imageUrl en mediaUrl
