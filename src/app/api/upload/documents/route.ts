import { NextRequest } from 'next/server'
import { saveFile, parseMultipartFormData, getFileInfo, ALLOWED_DOCUMENT_TYPES } from '@/lib/upload'
import { successResponse, errorResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'

// POST /api/upload/documents - Upload de documents (admin seulement)
export const POST = withAuth(async (request) => {
  try {
    const { files, fields } = await parseMultipartFormData(request)

    if (files.length === 0) {
      return errorResponse('Aucun fichier fourni', 400)
    }

    const uploadResults = []
    const uploadDir = 'uploads/documents'
    const user = request.user!

    const filesArray = Array.from(files)
    for (const file of filesArray) {
      const result = await saveFile(file, uploadDir, ALLOWED_DOCUMENT_TYPES)
      
      if (result.success) {
        const fileInfo = getFileInfo(file, result.url!)
        
        // Créer une entrée dans la base de données
        try {
          const document = await prisma.document.create({
            data: {
              title: file.name.replace(/\.[^/.]+$/, ""), // Nom sans extension
              fileUrl: result.url!,
              fileName: file.name,
              fileSize: file.size,
              mimeType: file.type,
              category: 'LEGAL_DOCUMENTS', // Catégorie par défaut
              isPublic: true,
              authorId: user.id
            }
          })
          
          uploadResults.push({
            success: true,
            file: fileInfo,
            document: document
          })
        } catch (dbError) {
          console.error('Erreur lors de la création de l\'entrée document:', dbError)
          uploadResults.push({
            success: false,
            error: 'Erreur lors de la sauvegarde en base de données',
            originalName: file.name
          })
        }
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
    }, `${successfulUploads.length} document(s) uploadé(s) avec succès`)

  } catch (error) {
    console.error('Erreur lors de l\'upload de documents:', error)
    return errorResponse('Erreur lors de l\'upload des documents', 500)
  }
})
