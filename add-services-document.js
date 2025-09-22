#!/usr/bin/env node

// Script pour ajouter le document des services à la base de données
const { PrismaClient } = require('@prisma/client');

async function addServicesDocument() {
  console.log('📋 Ajout du document des services...');
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19ELWEwMGw4TzFCT3MtSVRDclFsYXAiLCJhcGlfa2V5IjoiMDFLNVFNN0NTQjJOWVNISFZZUllYM1kyQVciLCJ0ZW5hbnRfaWQiOiIzNGRmY2JiNDAzY2VmYWRjOWI5OTBiZDc0YTg3N2YzYmM4YjFjZWVjMDBjOGE0ZDJkMWZiMjE1YmQyODJkNzM4IiwiaW50ZXJuYWxfc2VjcmV0IjoiODVmNWQ4NDAtNTFmZS00ODg4LWIwNzgtMTEyYWIzZjU1YmU1In0.9nCe1keil-kwoTP7bZAJFnavbf5TCSlVb7B21A3UfJo"
      }
    }
  });
  
  try {
    // Récupérer l'admin principal
    const admin = await prisma.admin.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });
    
    if (!admin) {
      console.log('❌ Aucun admin trouvé');
      return;
    }
    
    // Ajouter le document des services
    const servicesDocument = await prisma.document.create({
      data: {
        title: 'Services de l\'Ambassade du Mali en Libye',
        titleAr: 'خدمات سفارة مالي في ليبيا',
        description: 'Document officiel présentant tous les services offerts par l\'Ambassade du Mali en Libye',
        descriptionAr: 'وثيقة رسمية تقدم جميع الخدمات التي تقدمها سفارة مالي في ليبيا',
        fileUrl: '/documents/CamScanner 10-07-2025 15.45 (1).pdf',
        fileName: 'CamScanner 10-07-2025 15.45 (1).pdf',
        fileSize: 0, // Taille inconnue
        mimeType: 'application/pdf',
        category: 'LEGAL_DOCUMENTS',
        isPublic: true,
        authorId: admin.id
      }
    });
    
    console.log(`✅ Document des services ajouté: ${servicesDocument.title}`);
    console.log(`📄 URL: ${servicesDocument.fileUrl}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addServicesDocument().catch(console.error);
