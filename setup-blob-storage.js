#!/usr/bin/env node

// Script pour configurer Vercel Blob Storage
console.log('🔧 Configuration de Vercel Blob Storage...');

console.log(`
📋 Étapes à suivre :

1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet "ambassade-mali-libye"
3. Aller dans l'onglet "Storage"
4. Cliquer sur "Create Database"
5. Choisir "Blob" comme type de stockage
6. Nommer votre base de données (ex: "ambassade-blob")
7. Copier la variable d'environnement BLOB_READ_WRITE_TOKEN

8. Ajouter cette variable sur Vercel :
   - Aller dans Settings > Environment Variables
   - Ajouter : BLOB_READ_WRITE_TOKEN = [votre_token]

9. Redéployer l'application

Une fois configuré, les images seront stockées sur Vercel Blob Storage
au lieu du système de fichiers local.
`);

console.log('✅ Instructions affichées. Suivez ces étapes pour activer Blob Storage.');
