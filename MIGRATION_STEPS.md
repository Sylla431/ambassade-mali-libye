# 🚀 Migration en 2 Étapes

## 📋 Problème Résolu
L'erreur "no such table: Admin" était due au fait que les tables n'existaient pas encore sur Turso.

## 🔧 Solution : Migration en 2 Étapes

### Étape 1 : Créer les Tables
```bash
node create-tables-turso.js
```
Ce script va créer toutes les tables nécessaires sur Turso.

### Étape 2 : Migrer les Données
```bash
node migrate-data-simple.js
```
Ce script va migrer toutes vos données depuis `dev.db` vers Turso.

## 📊 Données à Migrer
- **2 admins** (table: `admins` → `Admin`)
- **14 articles** (table: `articles` → `Article`)
- **8 catégories** (table: `categories` → `Category`)
- **5 événements** (table: `events` → `Event`)
- **8 documents** (table: `documents` → `Document`)
- **Galeries d'images** (tables: `article_gallery`, `event_gallery`)

## ✅ Résultat Attendu
Après les 2 étapes :
- 🎯 Toutes les tables créées sur Turso
- 📊 Toutes vos données migrées
- 🔑 Vos identifiants admin préservés
- 🚀 URL prête pour Vercel

## 🚀 Configuration Vercel
Une fois la migration terminée, configurez Vercel avec :
```
DATABASE_URL="libsql://ambassade-mali-libye-[org].turso.io?authToken=[token]"
JWT_SECRET="007594abc7e5d8776523f55d8dacc178d193516dc374942adba4064ad63ed8e953839fdcf9972463b8f907f4852ac2d89938bd0332a38dd34de30d32c0284628"
NEXTAUTH_SECRET="ddcaa73456a4e47c96a4431829758f5bcdf0543829e7089420ea8bb37f6c15cfbd680382adc2e0901a57fa8e050aec264c84374ef0df7e3410fee35ed2308f7d"
```

## 🔑 Connexion Admin
Utilisez vos identifiants existants sur :
`https://ambassade-mali-libye.vercel.app/admin/login`
