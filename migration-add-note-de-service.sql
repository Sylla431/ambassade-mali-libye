-- Migration pour ajouter la catégorie NOTE_DE_SERVICE à l'enum DocumentCategory
-- À exécuter sur la base de données de production

-- Ajouter la nouvelle valeur à l'enum DocumentCategory
ALTER TYPE "DocumentCategory" ADD VALUE 'NOTE_DE_SERVICE';

-- Vérifier que la valeur a été ajoutée
SELECT unnest(enum_range(NULL::"DocumentCategory")) as category_values;
