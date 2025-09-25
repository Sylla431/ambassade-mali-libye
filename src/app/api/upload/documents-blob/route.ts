import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST /api/upload/documents-blob - Upload de documents vers Vercel Blob Storage
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    const uploadResults = []
    
    for (const file of files) {
      try {
        // Vérifier le type de fichier
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'image/jpeg',
          'image/png'
        ]
        
        if (!allowedTypes.includes(file.type)) {
          uploadResults.push({
            success: false,
            error: `Type de fichier non autorisé: ${file.type}`,
            originalName: file.name
          })
          continue
        }

        // Vérifier la taille (max 4.5MB pour Vercel)
        const maxSize = 4.5 * 1024 * 1024 // 4.5MB
        if (file.size > maxSize) {
          uploadResults.push({
            success: false,
            error: `Fichier trop volumineux: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum autorisé: 4.5MB`,
            originalName: file.name
          })
          continue
        }

        // Upload vers Vercel Blob Storage
        const blob = await put(file.name, file, {
          access: 'public',
        })

        // Trouver un admin existant ou utiliser un ID par défaut
        let authorId = "1"
        try {
          const firstAdmin = await prisma.admin.findFirst({
            select: { id: true }
          })
          if (firstAdmin) {
            authorId = firstAdmin.id
          }
        } catch (adminError) {
          console.log('Utilisation de l\'ID par défaut pour l\'auteur')
        }

        // Créer l'entrée dans la base de données avec l'URL du blob
        const document = await prisma.document.create({
          data: {
            title: file.name.replace(/\.[^/.]+$/, ""), // Nom sans extension
            fileUrl: blob.url,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            category: 'LEGAL_DOCUMENTS',
            isPublic: true,
            authorId: authorId
          }
        })

        uploadResults.push({
          success: true,
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
            url: blob.url
          },
          document: document
        })

      } catch (fileError) {
        console.error('Erreur lors du traitement du fichier:', fileError)
        uploadResults.push({
          success: false,
          error: `Erreur lors du traitement du fichier: ${fileError instanceof Error ? fileError.message : 'Erreur inconnue'}`,
          originalName: file.name
        })
      }
    }

    const successfulUploads = uploadResults.filter(r => r.success)
    const failedUploads = uploadResults.filter(r => !r.success)

    return NextResponse.json({
      success: true,
      data: {
        successful: successfulUploads,
        failed: failedUploads,
        total: files.length,
        successfulCount: successfulUploads.length,
        failedCount: failedUploads.length
      },
      message: `${successfulUploads.length} document(s) uploadé(s) avec succès vers Vercel Blob Storage`
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload de documents vers Blob Storage:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json(
      { 
        success: false, 
        error: `Erreur interne du serveur: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
