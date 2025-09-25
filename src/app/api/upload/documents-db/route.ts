import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST /api/upload/documents-db - Upload de documents avec stockage en base de données
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

        // Vérifier la taille (max 10MB)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
          uploadResults.push({
            success: false,
            error: `Fichier trop volumineux: ${file.name}`,
            originalName: file.name
          })
          continue
        }

        // Convertir le fichier en base64 pour le stockage
        const arrayBuffer = await file.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        const dataUrl = `data:${file.type};base64,${base64}`

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

        // Créer l'entrée dans la base de données
        const document = await prisma.document.create({
          data: {
            title: file.name.replace(/\.[^/.]+$/, ""), // Nom sans extension
            fileUrl: dataUrl,
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
            url: dataUrl
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
      message: `${successfulUploads.length} document(s) uploadé(s) avec succès`
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload de documents:', error)
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
