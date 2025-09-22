#!/usr/bin/env node

// Script pour migrer les fichiers PDF vers Vercel Blob Storage
const { PrismaClient } = require('@prisma/client');
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

async function migrateFilesToBlob() {
  console.log('📁 Migration des fichiers vers Vercel Blob Storage...');
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19ELWEwMGw4TzFCT3MtSVRDclFsYXAiLCJhcGlfa2V5IjoiMDFLNVFNN0NTQjJOWVNISFZZUllYM1kyQVciLCJ0ZW5hbnRfaWQiOiIzNGRmY2JiNDAzY2VmYWRjOWI5OTBiZDc0YTg3N2YzYmM4YjFjZWVjMDBjOGE0ZDJkMWZiMjE1YmQyODJkNzM4IiwiaW50ZXJuYWxfc2VjcmV0IjoiODVmNWQ4NDAtNTFmZS00ODg4LWIwNzgtMTEyYWIzZjU1YmU1In0.9nCe1keil-kwoTP7bZAJFnavbf5TCSlVb7B21A3UfJo"
      }
    }
  });
  
  try {
    // Récupérer tous les documents
    const documents = await prisma.document.findMany({
      select: {
        id: true,
        title: true,
        fileUrl: true,
        fileName: true
      }
    });
    
    console.log(`📋 ${documents.length} documents trouvés`);
    
    for (const doc of documents) {
      try {
        // Chemin local du fichier
        const localPath = path.join(process.cwd(), 'public', doc.fileUrl);
        
        if (fs.existsSync(localPath)) {
          console.log(`📤 Upload de ${doc.fileName}...`);
          
          // Lire le fichier
          const fileBuffer = fs.readFileSync(localPath);
          
          // Upload vers Vercel Blob
          const blob = await put(doc.fileName, fileBuffer, {
            access: 'public',
            contentType: 'application/pdf'
          });
          
          // Mettre à jour l'URL dans la base de données
          await prisma.document.update({
            where: { id: doc.id },
            data: { fileUrl: blob.url }
          });
          
          console.log(`✅ ${doc.fileName} → ${blob.url}`);
        } else {
          console.log(`❌ Fichier non trouvé: ${localPath}`);
        }
      } catch (error) {
        console.error(`❌ Erreur pour ${doc.fileName}:`, error.message);
      }
    }
    
    console.log('\n🎉 Migration terminée!');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

migrateFilesToBlob().catch(console.error);
