# Configuration Turso - Étapes Manuelles

## 🌐 Configuration via le Dashboard Turso

Puisque l'installation CLI a des problèmes, nous allons utiliser le dashboard web :

### 1. Créer un compte Turso
1. Allez sur [turso.tech](https://turso.tech)
2. Cliquez sur "Sign Up" 
3. Créez votre compte

### 2. Créer une base de données
1. Dans le dashboard, cliquez sur "Create Database"
2. Nom : `ambassade-mali-libye`
3. Région : Choisissez la plus proche (Europe)
4. Cliquez sur "Create"

### 3. Obtenir l'URL de connexion
1. Cliquez sur votre base de données
2. Allez dans l'onglet "Connect"
3. Copiez l'URL qui ressemble à :
   ```
   libsql://ambassade-mali-libye-[org].turso.io
   ```

### 4. Créer un token d'authentification
1. Dans l'onglet "Tokens"
2. Cliquez sur "Create Token"
3. Nom : `vercel-production`
4. Copiez le token généré

### 5. URL finale pour Vercel
Votre `DATABASE_URL` sera :
```
libsql://ambassade-mali-libye-[org].turso.io?authToken=[votre-token]
```

## 📋 Variables d'environnement pour Vercel

```
DATABASE_URL="libsql://ambassade-mali-libye-[org].turso.io?authToken=[votre-token]"
JWT_SECRET="007594abc7e5d8776523f55d8dacc178d193516dc374942adba4064ad63ed8e953839fdcf9972463b8f907f4852ac2d89938bd0332a38dd34de30d32c0284628"
NEXTAUTH_SECRET="ddcaa73456a4e47c96a4431829758f5bcdf0543829e7089420ea8bb37f6c15cfbd680382adc2e0901a57fa8e050aec264c84374ef0df7e3410fee35ed2308f7d"
```

## 🔄 Migration des données

Une fois Turso configuré, nous migrerons vos données depuis `dev.db` vers Turso.

## ✅ Prochaines étapes

1. Créez votre compte Turso
2. Créez la base de données
3. Obtenez l'URL et le token
4. Configurez les variables sur Vercel
5. Migrez les données
