import { NextRequest } from 'next/server'
import { saveFile, parseMultipartFormData, getFileInfo, ALLOWED_DOCUMENT_TYPES } from '@/lib/upload'
import { successResponse, errorResponse } from '@/utils/api'

// POST /api/upload/visa - Upload de documents pour visa (public)
export async function POST(request: NextRequest) {
  try {
    const { files, fields } = await parseMultipartFormData(request)

    if (files.length === 0) {
      return errorResponse('Aucun fichier fourni', 400)
    }

    // Limiter à 5 fichiers maximum pour les demandes de visa
    if (files.length > 5) {
      return errorResponse('Maximum 5 fichiers autorisés pour une demande de visa', 400)
    }

    const uploadResults = []
    const uploadDir = 'uploads/visa'

    for (const file of Array.from(files)) {
      const result = await saveFile(file, uploadDir, ALLOWED_DOCUMENT_TYPES)
      
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

    // Si aucun fichier n'a été uploadé avec succès
    if (successfulUploads.length === 0) {
      return errorResponse('Aucun fichier n\'a pu être uploadé', 400)
    }

    return successResponse({
      successful: successfulUploads,
      failed: failedUploads,
      total: files.length,
      successfulCount: successfulUploads.length,
      failedCount: failedUploads.length
    }, `${successfulUploads.length} document(s) uploadé(s) avec succès`)

  } catch (error) {
    console.error('Erreur lors de l\'upload de documents visa:', error)
    return errorResponse('Erreur lors de l\'upload des documents', 500)
  }
}
