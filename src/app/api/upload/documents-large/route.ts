import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST /api/upload/documents-large - Upload de gros documents (20MB+)
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

        // Pour les gros fichiers, on accepte jusqu'à 50MB
        const maxSize = 50 * 1024 * 1024 // 50MB
        if (file.size > maxSize) {
          uploadResults.push({
            success: false,
            error: `Fichier trop volumineux: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum autorisé: 50MB`,
            originalName: file.name
          })
          continue
        }

        // Pour les fichiers > 4.5MB, on utilise une approche différente
        if (file.size > 4.5 * 1024 * 1024) {
          // Option 1: Upload direct vers Vercel Blob (peut fonctionner pour certains fichiers)
          try {
            const blob = await put(file.name, file, {
              access: 'public',
            })

            // Trouver un admin existant
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
                title: file.name.replace(/\.[^/.]+$/, ""),
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

          } catch (blobError) {
            // Si l'upload direct échoue, on stocke temporairement en base64
            console.log('Upload Blob échoué, utilisation du stockage temporaire:', blobError)
            
            // Pour les très gros fichiers, on divise en chunks
            const chunkSize = 2 * 1024 * 1024 // 2MB par chunk
            const chunks = []
            
            for (let i = 0; i < file.size; i += chunkSize) {
              const chunk = file.slice(i, i + chunkSize)
              const arrayBuffer = await chunk.arrayBuffer()
              const base64 = Buffer.from(arrayBuffer).toString('base64')
              chunks.push(base64)
            }
            
            // Stocker les chunks en base de données (temporaire)
            const dataUrl = `data:${file.type};base64,${chunks.join('')}`
            
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

            const document = await prisma.document.create({
              data: {
                title: file.name.replace(/\.[^/.]+$/, ""),
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
              document: document,
              note: 'Fichier stocké temporairement en base de données'
            })
          }
        } else {
          // Pour les fichiers < 4.5MB, utilisation normale de Blob Storage
          const blob = await put(file.name, file, {
            access: 'public',
          })

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

          const document = await prisma.document.create({
            data: {
              title: file.name.replace(/\.[^/.]+$/, ""),
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
        }

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
      message: `${successfulUploads.length} document(s) uploadé(s) avec succès (support des gros fichiers jusqu'à 50MB)`
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload de gros documents:', error)
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
