import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST /api/gallery/migrate - Migrer les anciennes images vers Blob Storage
export async function POST(request: NextRequest) {
  try {
    const { migrateType } = await request.json()
    
    let migratedCount = 0
    let errorCount = 0
    const errors = []

    if (migrateType === 'articles' || migrateType === 'all') {
      // Migrer les images d'articles stockées localement
      const articlesWithLocalImages = await prisma.articleGallery.findMany({
        where: {
          imageUrl: {
            startsWith: '/uploads/'
          }
        }
      })

      console.log(`Trouvé ${articlesWithLocalImages.length} images d'articles à migrer`)

      for (const galleryImage of articlesWithLocalImages) {
        try {
          const imagePath = path.join(process.cwd(), 'public', galleryImage.imageUrl)
          
          if (fs.existsSync(imagePath)) {
            // Lire le fichier
            const fileBuffer = fs.readFileSync(imagePath)
            
            // Générer un nom de fichier unique
            const timestamp = Date.now()
            const fileName = `migrated-${timestamp}-${path.basename(galleryImage.imageUrl)}`

            // Upload vers Blob Storage
            const blob = await put(fileName, fileBuffer, {
              access: 'public',
              contentType: 'image/jpeg' // Par défaut, on peut améliorer la détection
            })

            // Mettre à jour l'URL dans la base de données
            await prisma.articleGallery.update({
              where: { id: galleryImage.id },
              data: { imageUrl: blob.url }
            })

            migratedCount++
            console.log(`Migré: ${galleryImage.imageUrl} -> ${blob.url}`)
          } else {
            console.warn(`Fichier non trouvé: ${imagePath}`)
            errorCount++
            errors.push(`Fichier non trouvé: ${galleryImage.imageUrl}`)
          }
        } catch (error) {
          console.error(`Erreur lors de la migration de ${galleryImage.imageUrl}:`, error)
          errorCount++
          errors.push(`Erreur: ${galleryImage.imageUrl} - ${error.message}`)
        }
      }
    }

    if (migrateType === 'documents' || migrateType === 'all') {
      // Migrer les documents stockés en base64
      const documentsWithBase64 = await prisma.document.findMany({
        where: {
          content: {
            startsWith: 'data:'
          }
        }
      })

      console.log(`Trouvé ${documentsWithBase64.length} documents en base64 à migrer`)

      for (const document of documentsWithBase64) {
        try {
          // Extraire les données base64
          const base64Data = document.content.split(',')[1]
          const fileBuffer = Buffer.from(base64Data, 'base64')
          
          // Générer un nom de fichier unique
          const timestamp = Date.now()
          const extension = document.fileName.split('.').pop() || 'pdf'
          const fileName = `migrated-doc-${timestamp}-${document.fileName}`

          // Upload vers Blob Storage
          const blob = await put(fileName, fileBuffer, {
            access: 'public',
            contentType: document.fileType || 'application/pdf'
          })

          // Mettre à jour l'URL dans la base de données
          await prisma.document.update({
            where: { id: document.id },
            data: { 
              content: blob.url,
              fileUrl: blob.url
            }
          })

          migratedCount++
          console.log(`Migré document: ${document.fileName} -> ${blob.url}`)
        } catch (error) {
          console.error(`Erreur lors de la migration du document ${document.fileName}:`, error)
          errorCount++
          errors.push(`Erreur document: ${document.fileName} - ${error.message}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        migratedCount,
        errorCount,
        errors: errors.slice(0, 10), // Limiter à 10 erreurs pour la réponse
        totalErrors: errors.length
      },
      message: `Migration terminée: ${migratedCount} fichiers migrés, ${errorCount} erreurs`
    })

  } catch (error) {
    console.error('Erreur lors de la migration:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la migration' },
      { status: 500 }
    )
  }
}

// GET /api/gallery/migrate - Vérifier l'état de la migration
export async function GET(request: NextRequest) {
  try {
    // Compter les images locales
    const localImages = await prisma.articleGallery.count({
      where: {
        imageUrl: {
          startsWith: '/uploads/'
        }
      }
    })

    // Compter les images Blob Storage
    const blobImages = await prisma.articleGallery.count({
      where: {
        imageUrl: {
          startsWith: 'https://'
        }
      }
    })

    // Compter les documents base64
    const base64Documents = await prisma.document.count({
      where: {
        content: {
          startsWith: 'data:'
        }
      }
    })

    // Compter les documents Blob Storage
    const blobDocuments = await prisma.document.count({
      where: {
        content: {
          startsWith: 'https://'
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        images: {
          local: localImages,
          blob: blobImages,
          total: localImages + blobImages
        },
        documents: {
          base64: base64Documents,
          blob: blobDocuments,
          total: base64Documents + blobDocuments
        }
      }
    })

  } catch (error) {
    console.error('Erreur lors de la vérification:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la vérification' },
      { status: 500 }
    )
  }
}
