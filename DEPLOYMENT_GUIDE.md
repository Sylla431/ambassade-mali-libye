# 🚀 Guide de Déploiement - Ambassade du Mali en Libye

## 📋 Prérequis

- Compte GitHub
- Compte Vercel (gratuit)
- Base de données (optionnel pour la démo)

## 🎯 Option 1 : Déploiement Vercel (Recommandé)

### Étape 1 : Créer un repository GitHub

1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur "New repository"
3. Nom : `ambassade-mali-libye`
4. Description : "Site web officiel de l'Ambassade du Mali en Libye"
5. Public ou Private (selon vos préférences)
6. **Ne pas** cocher "Add README" (déjà créé)
7. Cliquez "Create repository"

### Étape 2 : Pousser le code vers GitHub

```bash
# Ajouter le remote GitHub (remplacez YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ambassade-mali-libye.git

# Pousser le code
git branch -M main
git push -u origin main
```

### Étape 3 : Déployer sur Vercel

1. Allez sur [Vercel.com](https://vercel.com)
2. Cliquez "Sign up" et connectez-vous avec GitHub
3. Cliquez "New Project"
4. Importez votre repository `ambassade-mali-libye`
5. Configuration automatique détectée (Next.js)
6. Cliquez "Deploy"

### Étape 4 : Génération des secrets sécurisés

**⚠️ IMPORTANT : Ne jamais utiliser les mêmes secrets en production !**

1. Générez des secrets uniques :
```bash
node generate-secrets.js
```

2. Copiez les secrets générés (ils seront différents à chaque exécution)

### Étape 5 : Configuration des variables d'environnement

Dans le dashboard Vercel :

1. Allez dans "Settings" > "Environment Variables"
2. Ajoutez ces variables avec **vos propres secrets générés** :

```
DATABASE_URL = "file:./dev.db"
JWT_SECRET = "votre-secret-jwt-genere-uniquement"
NEXTAUTH_URL = "https://votre-projet.vercel.app"
NEXTAUTH_SECRET = "votre-secret-nextauth-genere-uniquement"
```

3. Cliquez "Save"
4. Allez dans "Deployments" et redéployez la dernière version

**🔐 Sécurité :**
- Chaque environnement doit avoir ses propres secrets
- Ne partagez JAMAIS ces secrets
- Régénérez-les si compromis

## 🎯 Option 2 : Déploiement Netlify

### Étape 1 : Préparation

1. Créez un fichier `netlify.toml` :

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Étape 2 : Déploiement

1. Allez sur [Netlify.com](https://netlify.com)
2. Connectez votre compte GitHub
3. "New site from Git" > Choisissez votre repository
4. Build settings :
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Cliquez "Deploy site"

## 🎯 Option 3 : Déploiement avec base de données (Production)

### Base de données recommandées :

1. **PlanetScale** (MySQL, gratuit)
2. **Supabase** (PostgreSQL, gratuit)
3. **Railway** (PostgreSQL, gratuit)

### Configuration avec PlanetScale :

1. Créez un compte sur [PlanetScale.com](https://planetscale.com)
2. Créez une nouvelle base de données
3. Copiez la connection string
4. Mettez à jour `DATABASE_URL` dans Vercel :

```
DATABASE_URL = "mysql://username:password@host:port/database"
```

5. Exécutez les migrations :

```bash
npx prisma db push
```

## 🔧 Configuration post-déploiement

### 1. Créer un utilisateur admin

Après le déploiement, vous devrez créer un utilisateur admin. Créez un script temporaire :

```javascript
// create-admin-production.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.admin.create({
    data: {
      name: 'Administrateur Principal',
      email: 'admin@ambassade-mali-libye.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })
  
  console.log('Admin créé:', admin)
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### 2. Accès à l'administration

- **URL publique** : `https://votre-projet.vercel.app`
- **URL admin** : `https://votre-projet.vercel.app/admin`
- **Identifiants** :
  - Email: `admin@ambassade-mali-libye.com`
  - Mot de passe: `admin123`

## 📱 Test du déploiement

### Checklist de validation :

- [ ] Site public accessible
- [ ] Page d'accueil se charge correctement
- [ ] Articles s'affichent avec pagination
- [ ] Galeries d'images fonctionnent
- [ ] Documents téléchargeables
- [ ] Connexion admin fonctionne
- [ ] Upload d'images fonctionne
- [ ] Création d'articles fonctionne
- [ ] Interface responsive sur mobile

## 🔐 Sécurité

### Bonnes pratiques :

1. **Secrets uniques** : Chaque environnement (dev, staging, prod) doit avoir ses propres secrets
2. **Rotation des secrets** : Changez les secrets régulièrement
3. **Variables d'environnement** : Ne jamais commiter les vrais secrets
4. **HTTPS obligatoire** : Toujours utiliser HTTPS en production
5. **Mots de passe forts** : Changez le mot de passe admin par défaut

### Génération de nouveaux secrets :

```bash
# Générer de nouveaux secrets
node generate-secrets.js

# Ou manuellement avec Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🚨 Dépannage

### Problèmes courants :

1. **Erreur de build** : Vérifiez les variables d'environnement
2. **Base de données** : Assurez-vous que `DATABASE_URL` est correct
3. **Upload d'images** : Vérifiez les permissions de fichiers
4. **Authentification** : Vérifiez `JWT_SECRET` et `NEXTAUTH_SECRET`
5. **Erreur 500** : Vérifiez que tous les secrets sont configurés

### Logs de débogage :

- Vercel : Dashboard > Functions > Logs
- Netlify : Site > Functions > Logs

## 📞 Support

En cas de problème :
1. Vérifiez les logs de déploiement
2. Testez en local avec `npm run dev`
3. Vérifiez la configuration des variables d'environnement

## 🎉 Félicitations !

Votre site est maintenant déployé et accessible au public !

**URL de démonstration** : `https://votre-projet.vercel.app`
