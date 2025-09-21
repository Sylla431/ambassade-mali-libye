# Ambassade du Mali en Libye - Site Web

Site web officiel de l'Ambassade du Mali en Libye, développé avec Next.js 14.

## 🚀 Fonctionnalités

### Public
- **Articles et actualités** avec pagination
- **Galerie d'images** pour chaque article
- **Documents officiels** téléchargeables
- **Événements** de l'ambassade
- **Informations de contact**
- **Interface bilingue** (Français/Arabe)

### Administration
- **Gestion des articles** (CRUD complet)
- **Upload et gestion des galeries** d'images
- **Gestion des documents** officiels
- **Gestion des événements**
- **Gestion des catégories**
- **Système d'authentification** sécurisé

## 🛠️ Technologies

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: SQLite avec Prisma ORM
- **Authentification**: JWT
- **Upload**: Gestion des fichiers multipart
- **UI**: Composants personnalisés avec Lucide React

## 📦 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd libye

# Installer les dépendances
npm install

# Configurer la base de données
npx prisma generate
npx prisma db push

# Créer un utilisateur admin
node create-admin.js

# Démarrer le serveur de développement
npm run dev
```

## 🌐 Déploiement

### Vercel (Recommandé)
1. Connecter le repository GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Variables d'environnement requises
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret"
```

## 📱 Accès

- **Site public**: `https://your-domain.com`
- **Administration**: `https://your-domain.com/admin`
- **Identifiants par défaut**: 
  - Email: `admin@ambassade-mali-libye.com`
  - Mot de passe: `admin123`

## 🔧 Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linter
```

## 📁 Structure du projet

```
src/
├── app/                 # Pages Next.js 14 (App Router)
│   ├── admin/          # Interface d'administration
│   ├── api/            # API Routes
│   └── (public)/       # Pages publiques
├── components/         # Composants React
│   ├── admin/         # Composants admin
│   ├── layout/        # Layouts
│   ├── pages/         # Composants de pages
│   └── ui/            # Composants UI réutilisables
├── hooks/             # Hooks React personnalisés
├── lib/               # Utilitaires et configuration
├── middleware/        # Middleware Next.js
└── utils/             # Fonctions utilitaires
```

## 🎯 Fonctionnalités clés

- ✅ **Pagination** des articles avec "Charger plus"
- ✅ **Galerie d'images** pour chaque article
- ✅ **Upload de documents** avec gestion des types
- ✅ **Interface responsive** mobile-first
- ✅ **Système de notifications** (Toast)
- ✅ **Modales de confirmation** pour les actions critiques
- ✅ **Gestion des erreurs** robuste
- ✅ **Performance optimisée** avec Next.js 14

## 📞 Support

Pour toute question ou support technique, contactez l'équipe de développement.