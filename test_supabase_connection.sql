
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
