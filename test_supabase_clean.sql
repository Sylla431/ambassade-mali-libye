
-- Test de connexion et vérification
SELECT 
    'Connexion Supabase réussie!' as status,
    NOW() as timestamp,
    version() as postgres_version;

-- Vérifier les tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Vérifier les types ENUM
SELECT typname, enumlabel 
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE t.typname IN ('AdminRole', 'DocumentCategory', 'VisaStatus')
ORDER BY t.typname, e.enumsortorder;

-- Vérifier les données
SELECT 
    (SELECT COUNT(*) FROM "Admin") as admins,
    (SELECT COUNT(*) FROM "Category") as categories,
    (SELECT COUNT(*) FROM "Article") as articles;
