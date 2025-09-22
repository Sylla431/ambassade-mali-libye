# 🚀 Configuration Supabase pour l'Ambassade du Mali en Libye

## 📋 Étapes de Configuration

### 1. Créer un Compte Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec GitHub
4. Cliquez sur **"New Project"**

### 2. Configuration du Projet
- **Name** : `ambassade-mali-libye`
- **Database Password** : Générez un mot de passe fort (gardez-le !)
- **Region** : Choisissez la région la plus proche (Europe)
- Cliquez sur **"Create new project"**

### 3. Récupérer les Informations de Connexion
Une fois le projet créé, allez dans **Settings** → **Database** :

#### URL de Connexion
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

#### Variables d'Environnement
- **SUPABASE_URL** : `https://[PROJECT-REF].supabase.co`
- **SUPABASE_ANON_KEY** : Clé publique (dans Settings → API)
- **DATABASE_URL** : URL de connexion PostgreSQL complète

## 🔧 Configuration Locale

### 1. Installer le Client Supabase
```bash
npm install @supabase/supabase-js
```

### 2. Créer le Fichier de Configuration
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 📊 Avantages de Supabase

### ✅ Compatibilité Vercel
- **Runtime Edge** : Compatible avec Vercel Edge Functions
- **PostgreSQL** : Base de données robuste et scalable
- **API REST** : API automatique générée
- **Auth intégré** : Système d'authentification prêt

### ✅ Fonctionnalités
- **Dashboard** : Interface web pour gérer les données
- **SQL Editor** : Exécuter des requêtes SQL directement
- **Real-time** : Mises à jour en temps réel
- **Storage** : Stockage de fichiers
- **Edge Functions** : Fonctions serverless

## 🔄 Migration des Données

### 1. Exporter depuis SQLite
```bash
# Exporter les données actuelles
sqlite3 prisma/dev.db .dump > data_export.sql
```

### 2. Adapter pour PostgreSQL
- Remplacer `INTEGER PRIMARY KEY AUTOINCREMENT` par `SERIAL PRIMARY KEY`
- Adapter les types de données SQLite → PostgreSQL
- Convertir les dates et timestamps

### 3. Importer dans Supabase
- Utiliser le **SQL Editor** de Supabase
- Exécuter les scripts de création de tables
- Importer les données

## 🚀 Déploiement Vercel

### Variables d'Environnement Vercel
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
JWT_SECRET=[GENERATED_SECRET]
NEXTAUTH_SECRET=[GENERATED_SECRET]
```

## 📈 Prochaines Étapes

1. ✅ Créer le projet Supabase
2. ✅ Configurer les variables d'environnement
3. ✅ Mettre à jour le schéma Prisma
4. ✅ Migrer les données
5. ✅ Tester le déploiement

## 🆘 Support

- **Documentation** : [supabase.com/docs](https://supabase.com/docs)
- **Community** : [github.com/supabase/supabase](https://github.com/supabase/supabase)
- **Discord** : [discord.supabase.com](https://discord.supabase.com)
