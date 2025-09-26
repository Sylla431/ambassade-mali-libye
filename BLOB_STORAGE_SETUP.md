# Configuration de Vercel Blob Storage

## 🚨 Problème
L'upload de documents de 100MB+ nécessite Vercel Blob Storage pour fonctionner correctement.

## 🔧 Configuration Requise

### 1. Créer une base de données Blob sur Vercel

1. Aller sur [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionner le projet "ambassade-mali-libye"
3. Aller dans l'onglet **"Storage"**
4. Cliquer sur **"Create Database"**
5. Choisir **"Blob"** comme type de stockage
6. Nommer la base de données (ex: "ambassade-blob")
7. Cliquer sur **"Create"**

### 2. Récupérer le token d'accès

1. Une fois la base créée, aller dans l'onglet **"Storage"**
2. Cliquer sur votre base de données Blob
3. Aller dans l'onglet **"Settings"**
4. Copier la variable d'environnement **`BLOB_READ_WRITE_TOKEN`**

### 3. Configurer la variable d'environnement

1. Aller dans **Settings > Environment Variables**
2. Ajouter une nouvelle variable :
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: [votre_token_copié]
   - **Environment**: Production (et Preview si nécessaire)
3. Cliquer sur **"Save"**

### 4. Redéployer l'application

1. Aller dans l'onglet **"Deployments"**
2. Cliquer sur **"Redeploy"** sur le dernier déploiement
3. Ou faire un nouveau commit pour déclencher un déploiement automatique

## ✅ Vérification

Une fois configuré, l'API `/api/documents/check-blob` devrait retourner :
```json
{
  "success": true,
  "data": {
    "blobTokenConfigured": true,
    "blobTokenLength": 64,
    "environment": "production",
    "message": "Vercel Blob Storage est configuré"
  }
}
```

## 🚀 Fonctionnalités Disponibles

Avec Blob Storage configuré :
- ✅ Upload de documents jusqu'à 100MB
- ✅ Upload par chunks (2MB par chunk)
- ✅ Stockage sécurisé sur Vercel Blob Storage
- ✅ URLs publiques pour les documents
- ✅ Barre de progression en temps réel
- ✅ Support de tous les types de documents (PDF, Word, Excel, etc.)

## 🔍 Test

Pour tester l'upload :
1. Aller sur `/admin/documents`
2. Cliquer sur "Télécharger"
3. Sélectionner un fichier de plus de 4MB
4. L'upload devrait fonctionner avec la barre de progression

## 📝 Notes

- Le système de chunked upload fonctionne même sans Blob Storage (fallback en base64)
- Mais pour les gros fichiers (100MB+), Blob Storage est essentiel
- Les documents sont stockés avec des URLs publiques sécurisées
- Le nettoyage automatique des chunks temporaires est géré
