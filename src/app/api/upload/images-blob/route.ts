import { NextRequest } from 'next/server'
import { put } from '@vercel/blob'
import { successResponse, errorResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST /api/upload/images-blob - Upload d'images avec Vercel Blob Storage
export const POST = withAuth(async (request) => {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (files.length === 0) {
      return errorResponse('Aucun fichier fourni', 400)
    }

    const uploadResults = []

    for (const file of files) {
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

        // Générer un nom de fichier unique
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const extension = file.name.split('.').pop()
        const fileName = `${timestamp}-${randomString}.${extension}`

        // Uploader vers Vercel Blob Storage
        const blob = await put(fileName, file, {
          access: 'public',
          contentType: file.type
        })

        uploadResults.push({
          success: true,
          file: {
            url: blob.url,
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
      total: files.length,
      successfulCount: successfulUploads.length,
      failedCount: failedUploads.length
    }, `${successfulUploads.length} fichier(s) uploadé(s) avec succès`)

  } catch (error) {
    console.error('Erreur lors de l\'upload d\'images:', error)
    return errorResponse('Erreur lors de l\'upload des fichiers', 500)
  }
})
