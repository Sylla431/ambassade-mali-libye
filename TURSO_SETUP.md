# Configuration Turso pour SQLite sur Vercel

## 🚀 Installation de Turso

```bash
# Installer Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Ou avec npm
npm install -g @libsql/client
```

## 🔑 Configuration

```bash
# Se connecter à Turso
turso auth login

# Créer une base de données
turso db create ambassade-mali-libye

# Obtenir l'URL de la base de données
turso db show ambassade-mali-libye --url

# Créer un token d'authentification
turso db tokens create ambassade-mali-libye
```

## 📋 Variables d'Environnement pour Vercel

```
DATABASE_URL="libsql://ambassade-mali-libye-[votre-org].turso.io?authToken=[votre-token]"
JWT_SECRET="007594abc7e5d8776523f55d8dacc178d193516dc374942adba4064ad63ed8e953839fdcf9972463b8f907f4852ac2d89938bd0332a38dd34de30d32c0284628"
NEXTAUTH_SECRET="ddcaa73456a4e47c96a4431829758f5bcdf0543829e7089420ea8bb37f6c15cfbd680382adc2e0901a57fa8e050aec264c84374ef0df7e3410fee35ed2308f7d"
```

## 🔄 Migration des données

```bash
# Exporter vos données locales
turso db dump dev.db --output backup.sql

# Importer dans Turso
turso db shell ambassade-mali-libye < backup.sql
```

## ✅ Avantages de Turso

- ✅ Compatible SQLite
- ✅ Gratuit jusqu'à 500MB
- ✅ Rapide et fiable
- ✅ Compatible avec Prisma
- ✅ Fonctionne sur Vercel
