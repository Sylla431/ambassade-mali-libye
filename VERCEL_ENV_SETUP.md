# Configuration des Variables d'Environnement sur Vercel

## 🚨 Problème Actuel
L'API retourne une erreur 500 car les variables d'environnement ne sont pas configurées sur Vercel.

## 📋 Variables Requises

### 1. DATABASE_URL
- **Description**: URL de connexion à la base de données
- **Format**: `postgresql://username:password@host:port/database`
- **Exemple**: `postgresql://user:pass@db.example.com:5432/ambassade_mali`

### 2. JWT_SECRET
- **Description**: Clé secrète pour signer les tokens JWT
- **Génération**: Utilisez le script `generate-secrets.js`
- **Exemple**: `your-super-secret-jwt-key-here`

### 3. NEXTAUTH_SECRET
- **Description**: Clé secrète pour NextAuth.js
- **Génération**: Utilisez le script `generate-secrets.js`
- **Exemple**: `your-nextauth-secret-key-here`

## 🔧 Configuration sur Vercel

### Méthode 1: Interface Web Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous et sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez chaque variable :
   - **Name**: `DATABASE_URL`
   - **Value**: Votre URL de base de données
   - **Environment**: Production, Preview, Development
5. Répétez pour `JWT_SECRET` et `NEXTAUTH_SECRET`

### Méthode 2: CLI Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Configurer les variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NEXTAUTH_SECRET

# Redéployer
vercel --prod
```

## 🔑 Génération des Secrets

Exécutez le script de génération :
```bash
node generate-secrets.js
```

Cela générera des secrets uniques et sécurisés.

## ✅ Vérification

Après configuration, testez l'API :
```bash
curl https://ambassade-mali-libye.vercel.app/api/articles?page=1&limit=6&published=true
```

## 🚀 Redéploiement

Après avoir ajouté les variables d'environnement :
1. Vercel redéploiera automatiquement
2. Ou déclenchez manuellement un redéploiement
3. Testez l'application

## 📞 Support

Si le problème persiste, vérifiez :
- Les logs Vercel dans le dashboard
- La connectivité de la base de données
- La validité des URLs et secrets
