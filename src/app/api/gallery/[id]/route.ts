import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/utils/api'
import { withAuth, AuthenticatedRequest } from '@/middleware/auth'
import fs from 'fs'
import path from 'path'

// DELETE /api/gallery/[id] - Supprimer une image de la galerie
export const DELETE = withAuth(async (request: AuthenticatedRequest, context: { params: { id: string } }) => {
  try {
    const { params } = context
    const imageId = params.id

    if (!imageId) {
      return errorResponse('ID de l\'image requis', 400)
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    const imagesDir = path.join(uploadsDir, 'images')
    
    // Vérifier si le dossier existe
    if (!fs.existsSync(imagesDir)) {
      return errorResponse('Dossier des images introuvable', 404)
    }

    // Chercher le fichier correspondant à l'ID
    const files = fs.readdirSync(imagesDir)
    const imageFile = files.find(file => file.startsWith(imageId + '-'))
    
    if (!imageFile) {
      return errorResponse('Image introuvable', 404)
    }

    const filePath = path.join(imagesDir, imageFile)
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      return errorResponse('Fichier image introuvable', 404)
    }

    // Supprimer le fichier
    fs.unlinkSync(filePath)

    return successResponse(
      { deletedFile: imageFile },
      'Image supprimée avec succès'
    )

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error)
    return errorResponse('Erreur lors de la suppression de l\'image', 500)
  }
})
