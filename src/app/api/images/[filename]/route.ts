import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/images/[filename] - Servir les images depuis public/uploads
export async function GET(
  request: NextRequest,
  context: { params: { filename: string } }
) {
  try {
    const { params } = context
    const filename = params.filename

    if (!filename) {
      return new NextResponse('Nom de fichier requis', { status: 400 })
    }

    // Chemin vers le fichier dans public/uploads/images
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'images', filename)

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Image non trouvée', { status: 404 })
    }

    // Lire le fichier
    const fileBuffer = fs.readFileSync(filePath)
    
    // Déterminer le type MIME
    const ext = path.extname(filename).toLowerCase()
    let contentType = 'image/jpeg'
    
    switch (ext) {
      case '.png':
        contentType = 'image/png'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      case '.webp':
        contentType = 'image/webp'
        break
      case '.svg':
        contentType = 'image/svg+xml'
        break
    }

    // Retourner l'image avec les bons headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image:', error)
    return new NextResponse('Erreur interne du serveur', { status: 500 })
  }
}
