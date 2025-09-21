import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/utils/api'
import { withAuth } from '@/middleware/auth'
import fs from 'fs'
import path from 'path'

// GET /api/gallery - Récupérer toutes les images de la galerie
export const GET = withAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || 'all' // all, articles, events

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    const imagesDir = path.join(uploadsDir, 'images')
    
    // Vérifier si le dossier existe
    if (!fs.existsSync(imagesDir)) {
      return successResponse({
        data: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 0
        }
      })
    }

    // Lire tous les fichiers du dossier images
    const files = fs.readdirSync(imagesDir)
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)
    })

    // Filtrer par recherche si fournie
    let filteredFiles = imageFiles
    if (search) {
      filteredFiles = imageFiles.filter(file => 
        file.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedFiles = filteredFiles.slice(startIndex, endIndex)

    // Créer les objets d'images
    const images = paginatedFiles.map((file, index) => {
      const filePath = path.join(imagesDir, file)
      const stats = fs.statSync(filePath)
      
      // Extraire l'ID et le nom original du nom de fichier
      const [timestamp, originalName] = file.split('-', 2)
      
      return {
        id: timestamp,
        imageUrl: `/uploads/images/${file}`,
        fileName: originalName || file,
        fileSize: stats.size,
        createdAt: new Date(parseInt(timestamp)).toISOString(),
        order: startIndex + index + 1,
        altText: originalName ? originalName.replace(/\.[^/.]+$/, '') : file.replace(/\.[^/.]+$/, ''),
        caption: originalName ? originalName.replace(/\.[^/.]+$/, '') : file.replace(/\.[^/.]+$/, '')
      }
    })

    return successResponse({
      data: images,
      pagination: {
        page,
        limit,
        total: filteredFiles.length,
        totalPages: Math.ceil(filteredFiles.length / limit)
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error)
    return errorResponse('Erreur lors de la récupération des images', 500)
  }
})
