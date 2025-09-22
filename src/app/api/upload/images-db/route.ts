import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST /api/upload/images-db - Upload d'images en stockant en base de données
export const POST = withAuth(async (request) => {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const singleFile = formData.get('file') as File
    
    // Gérer les deux cas : 'files' (multiple) et 'file' (single)
    const filesToProcess = files.length > 0 ? files : (singleFile ? [singleFile] : [])

    if (filesToProcess.length === 0) {
      return errorResponse('Aucun fichier fourni', 400)
    }

    const uploadResults = []

    for (const file of filesToProcess) {
      try {
        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
          uploadResults.push({
            success: false,
            error: 'Type de fichier non autorisé',
            originalName: file.name
          })
          continue
        }

        // Lire le contenu du fichier
        const arrayBuffer = await file.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        const dataUrl = `data:${file.type};base64,${base64}`

        // Générer un nom de fichier unique
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const extension = file.name.split('.').pop()
        const fileName = `${timestamp}-${randomString}.${extension}`

        // Utiliser directement la data URL pour l'affichage immédiat
        uploadResults.push({
          success: true,
          file: {
            url: dataUrl, // Utiliser la data URL directement
            fileName: fileName,
            originalName: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
          }
        })

      } catch (error) {
        console.error('Erreur lors de l\'upload de', file.name, ':', error)
        uploadResults.push({
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
          originalName: file.name
        })
      }
    }

    const successfulUploads = uploadResults.filter(r => r.success)
    const failedUploads = uploadResults.filter(r => !r.success)

    return successResponse({
      successful: successfulUploads,
      failed: failedUploads,
      total: filesToProcess.length,
      successfulCount: successfulUploads.length,
      failedCount: failedUploads.length
    }, `${successfulUploads.length} fichier(s) uploadé(s) avec succès`)

  } catch (error) {
    console.error('Erreur lors de l\'upload d\'images:', error)
    return errorResponse('Erreur lors de l\'upload des fichiers', 500)
  }
})
