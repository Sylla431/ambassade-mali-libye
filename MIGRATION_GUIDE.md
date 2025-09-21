# Guide de Migration vers Turso

## 🎯 Objectif
Migrer votre base de données SQLite locale (`dev.db`) vers Turso pour le déploiement sur Vercel.

## 📋 Prérequis
1. Compte Turso créé sur [turso.tech](https://turso.tech)
2. Base de données Turso créée : `ambassade-mali-libye`
3. Token d'authentification Turso

## 🔧 Configuration

### 1. Obtenir vos identifiants Turso
Depuis le dashboard Turso :
- **URL** : `libsql://ambassade-mali-libye-[org].turso.io`
- **Token** : Votre token d'authentification

### 2. Configurer les variables d'environnement
```bash
export TURSO_URL="libsql://ambassade-mali-libye-[votre-org].turso.io"
export TURSO_TOKEN="votre-token-ici"
```

### 3. Exécuter la migration
```bash
# Créer les tables sur Turso
node migrate-to-turso.js

# Initialiser les données
node init-turso-db.js
```

## 📊 Résultat
Après la migration, vous obtiendrez :
- ✅ Tables créées sur Turso
- ✅ Utilisateur admin créé
- ✅ Données d'exemple ajoutées
- ✅ URL de connexion pour Vercel

## 🚀 Configuration Vercel

### Variables d'environnement à ajouter sur Vercel :
```
DATABASE_URL="libsql://ambassade-mali-libye-[org].turso.io?authToken=[token]"
JWT_SECRET="007594abc7e5d8776523f55d8dacc178d193516dc374942adba4064ad63ed8e953839fdcf9972463b8f907f4852ac2d89938bd0332a38dd34de30d32c0284628"
NEXTAUTH_SECRET="ddcaa73456a4e47c96a4431829758f5bcdf0543829e7089420ea8bb37f6c15cfbd680382adc2e0901a57fa8e050aec264c84374ef0df7e3410fee35ed2308f7d"
```

## ✅ Vérification
1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Settings → Environment Variables
4. Ajoutez les 3 variables ci-dessus
5. Redéployez l'application

## 🔑 Connexion Admin
- **URL** : `https://ambassade-mali-libye.vercel.app/admin/login`
- **Email** : `admin@ambassade-mali-libye.com`
- **Mot de passe** : `admin123`

⚠️ **IMPORTANT** : Changez le mot de passe après la première connexion !
