# Guide de Résolution du Problème d'Upload d'Images

## 🚨 Problème Actuel
Les images ne s'uploadent plus car Vercel ne permet pas l'écriture dans le système de fichiers en production.

## 🔧 Solutions Disponibles

### Option 1: Vercel Blob Storage (Recommandée)
**Avantages :** Stockage cloud natif, performant, intégré à Vercel
**Inconvénients :** Nécessite une configuration supplémentaire

#### Étapes de configuration :
1. Aller sur https://vercel.com/dashboard
2. Sélectionner le projet "ambassade-mali-libye"
3. Aller dans l'onglet "Storage"
4. Cliquer sur "Create Database"
5. Choisir "Blob" comme type de stockage
6. Nommer la base de données (ex: "ambassade-blob")
7. Copier la variable d'environnement `BLOB_READ_WRITE_TOKEN`
8. Ajouter cette variable dans Settings > Environment Variables
9. Redéployer l'application

#### Code prêt :
- ✅ `src/app/api/upload/images-blob/route.ts` - API d'upload avec Blob Storage
- ✅ Package `@vercel/blob` installé

### Option 2: Stockage en Base de Données (Temporaire)
**Avantages :** Fonctionne immédiatement
**Inconvénients :** Limite de taille, performance réduite

#### Code prêt :
- ✅ `src/app/api/upload/images-db/route.ts` - API d'upload avec stockage en base

### Option 3: Utiliser les Images Existantes
**Avantages :** Aucune configuration nécessaire
**Inconvénients :** Pas d'ajout de nouvelles images

## 🚀 Recommandation
1. **Immédiat :** Configurer Vercel Blob Storage (Option 1)
2. **En attendant :** Utiliser les images existantes dans `public/uploads`
3. **Alternative :** Modifier temporairement les pages admin pour utiliser l'API de stockage en base

## 📝 Actions à Effectuer
1. Configurer Blob Storage sur Vercel
2. Modifier les pages admin pour utiliser la nouvelle API
3. Tester l'upload d'images
4. Nettoyer les fichiers temporaires

## 🔍 Fichiers à Modifier
- `src/app/admin/articles/new/page.tsx` - Changer l'URL d'upload
- `src/app/admin/articles/[id]/edit/page.tsx` - Changer l'URL d'upload
- `src/app/admin/events/new/page.tsx` - Changer l'URL d'upload
- `src/app/admin/events/[id]/edit/page.tsx` - Changer l'URL d'upload
- `src/app/admin/articles/[id]/gallery/page.tsx` - Changer l'URL d'upload
