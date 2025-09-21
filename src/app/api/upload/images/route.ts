import { NextRequest } from 'next/server'
import { saveFile, parseMultipartFormData, getFileInfo, ALLOWED_IMAGE_TYPES } from '@/lib/upload'
import { successResponse, errorResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'

// POST /api/upload/images - Upload d'images (admin seulement)
export const POST = withAuth(async (request) => {
  try {
    const { files, fields } = await parseMultipartFormData(request)

    if (files.length === 0) {
      return errorResponse('Aucun fichier fourni', 400)
    }

    const uploadResults = []
    const uploadDir = 'uploads/images'

    for (const file of files) {
      const result = await saveFile(file, uploadDir, ALLOWED_IMAGE_TYPES)
      
      if (result.success) {
        const fileInfo = getFileInfo(file, result.url!)
        uploadResults.push({
          success: true,
          file: fileInfo
        })
      } else {
        uploadResults.push({
          success: false,
          error: result.error,
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
