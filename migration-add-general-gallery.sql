-- Migration pour ajouter une table de galerie générale
-- Pour stocker les médias qui ne sont pas liés à un article ou événement spécifique

-- Créer la table general_gallery
CREATE TABLE IF NOT EXISTS general_gallery (
  id TEXT PRIMARY KEY,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'IMAGE',
  alt_text TEXT,
  caption TEXT,
  caption_ar TEXT,
  file_name TEXT,
  file_size INTEGER,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_general_gallery_created_at ON general_gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_general_gallery_media_type ON general_gallery(media_type);

