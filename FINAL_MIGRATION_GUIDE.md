# 🚀 Guide Final de Migration vers Turso

## 📊 Données à Migrer
Votre base `dev.db` contient :
- **2 admins**
- **14 articles**
- **8 catégories**
- **5 événements**
- **8 documents**
- **Galeries d'images**

## 🔧 Étapes de Migration

### 1. Configurer Turso
1. Allez sur [turso.tech](https://turso.tech)
2. Créez votre compte
3. Créez une base de données : `ambassade-mali-libye`
4. Obtenez l'URL et le token

### 2. Configurer les Variables d'Environnement
```bash
export TURSO_URL="libsql://ambassade-mali-libye-[votre-org].turso.io"
export TURSO_TOKEN="votre-token-ici"
```

### 3. Exécuter la Migration Complète
```bash
node complete-migration.js
```

Ce script va :
- ✅ Créer toutes les tables sur Turso
- ✅ Migrer tous vos admins
- ✅ Migrer toutes vos catégories
- ✅ Migrer tous vos articles
- ✅ Migrer tous vos événements
- ✅ Migrer tous vos documents
- ✅ Migrer toutes vos galeries d'images

### 4. Configurer Vercel
Ajoutez ces variables d'environnement sur Vercel :
```
DATABASE_URL="libsql://ambassade-mali-libye-[org].turso.io?authToken=[token]"
JWT_SECRET="007594abc7e5d8776523f55d8dacc178d193516dc374942adba4064ad63ed8e953839fdcf9972463b8f907f4852ac2d89938bd0332a38dd34de30d32c0284628"
NEXTAUTH_SECRET="ddcaa73456a4e47c96a4431829758f5bcdf0543829e7089420ea8bb37f6c15cfbd680382adc2e0901a57fa8e050aec264c84374ef0df7e3410fee35ed2308f7d"
```

## ✅ Résultat Attendu
Après la migration, vous aurez :
- 🎯 Toutes vos données sur Turso
- 🚀 Application fonctionnelle sur Vercel
- 🔑 Accès admin avec vos identifiants existants
- 📱 Toutes vos pages et fonctionnalités opérationnelles

## 🔑 Connexion Admin
Utilisez vos identifiants admin existants pour vous connecter sur :
`https://ambassade-mali-libye.vercel.app/admin/login`

## 🆘 Support
Si vous rencontrez des problèmes :
1. Vérifiez que TURSO_URL et TURSO_TOKEN sont corrects
2. Vérifiez que votre base Turso est active
3. Consultez les logs de migration pour identifier les erreurs
