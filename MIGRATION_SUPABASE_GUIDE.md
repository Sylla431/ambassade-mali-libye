# 🚀 Guide Complet de Migration vers Supabase

## 📋 Étapes de Migration

### 1. Créer le Projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec GitHub
4. Cliquez sur **"New Project"**
5. Configurez :
   - **Name** : `ambassade-mali-libye`
   - **Database Password** : Générez un mot de passe fort
   - **Region** : Europe (plus proche)
6. Cliquez sur **"Create new project"**

### 2. Récupérer les Informations de Connexion
Une fois le projet créé :

#### Dans Settings → Database :
- **Connection string** : `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

#### Dans Settings → API :
- **Project URL** : `https://[PROJECT-REF].supabase.co`
- **anon public key** : `[ANON-KEY]`

### 3. Exécuter la Migration
```bash
# 1. Exporter et adapter les données
node migrate-to-supabase.js

# 2. Aller dans Supabase → SQL Editor
# 3. Exécuter le contenu de supabase_migration.sql
# 4. Tester avec test_supabase_connection.sql
```

### 4. Configurer les Variables d'Environnement

#### Fichier .env.local (pour test local)
```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON-KEY]
JWT_SECRET=007594abc7e5d8776523f55d8dacc178d193516dc374942adba4064ad63ed8e953839fdcf9972463b8f907f4852ac2d89938bd0332a38dd34de30d32c0284628
NEXTAUTH_SECRET=ddcaa73456a4e47c96a4431829758f5bcdf0543829e7089420ea8bb37f6c15cfbd680382adc2e0901a57fa8e050aec264c84374ef0df7e3410fee35ed2308f7d
```

#### Variables Vercel (Production)
Configurez les mêmes variables dans Vercel Dashboard → Settings → Environment Variables

### 5. Tester la Migration
```bash
# Test local
node test-supabase-connection.js

# Test de l'API
curl "http://localhost:3000/api/articles?page=1&limit=6&published=true"
```

### 6. Déployer sur Vercel
```bash
# Commit et push
git add .
git commit -m "Migration vers Supabase PostgreSQL"
git push origin main

# Vercel redéploiera automatiquement
```

## 🔧 Scripts Disponibles

### migrate-to-supabase.js
- Exporte les données SQLite
- Adapte le script pour PostgreSQL
- Crée `supabase_migration.sql`

### test-supabase-connection.js
- Teste la connexion Supabase
- Vérifie les tables et données
- Teste les opérations CRUD

### supabase_migration.sql
- Script SQL complet pour Supabase
- Crée toutes les tables
- Insère les données
- Configure les index

## ✅ Vérifications Post-Migration

### 1. Vérifier les Tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### 2. Vérifier les Données
```sql
SELECT 
  (SELECT COUNT(*) FROM "Admin") as admins,
  (SELECT COUNT(*) FROM "Category") as categories,
  (SELECT COUNT(*) FROM "Article") as articles,
  (SELECT COUNT(*) FROM "Event") as events,
  (SELECT COUNT(*) FROM "Document") as documents;
```

### 3. Tester l'API
```bash
curl "https://ambassade-mali-libye.vercel.app/api/articles?page=1&limit=6&published=true"
```

## 🆘 Dépannage

### Erreur de Connexion
- Vérifiez la syntaxe de DATABASE_URL
- Vérifiez que le mot de passe est correct
- Vérifiez que le projet Supabase est actif

### Erreur de Migration
- Vérifiez que le script SQL est valide
- Vérifiez que les extensions sont activées
- Vérifiez que les types ENUM sont créés

### Erreur 500 sur Vercel
- Vérifiez que toutes les variables d'environnement sont configurées
- Vérifiez que le runtime est bien Node.js
- Vérifiez les logs Vercel pour plus de détails

## 📈 Avantages de Supabase

### ✅ Performance
- **PostgreSQL** : Base de données robuste et rapide
- **Index optimisés** : Requêtes performantes
- **Connection pooling** : Gestion automatique des connexions

### ✅ Compatibilité Vercel
- **Runtime Edge** : Compatible avec Vercel Edge Functions
- **API REST** : API automatique générée
- **Real-time** : Mises à jour en temps réel

### ✅ Fonctionnalités
- **Dashboard** : Interface web pour gérer les données
- **SQL Editor** : Exécuter des requêtes directement
- **Auth intégré** : Système d'authentification prêt
- **Storage** : Stockage de fichiers

## 🎯 Prochaines Étapes

1. ✅ Créer le projet Supabase
2. ✅ Exécuter la migration
3. ✅ Configurer les variables d'environnement
4. ✅ Tester localement
5. ✅ Déployer sur Vercel
6. ✅ Vérifier le fonctionnement en production
