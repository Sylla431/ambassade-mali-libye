import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/documents/[id]/download - Télécharger un document
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id

    if (!documentId) {
      return NextResponse.json(
        { success: false, error: 'ID du document manquant' },
        { status: 400 }
      )
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId }
    })

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si le document est public
    if (!document.isPublic) {
      return NextResponse.json(
        { success: false, error: 'Document non accessible' },
        { status: 403 }
      )
    }

    // Si c'est une data URL, extraire les données
    if (document.fileUrl.startsWith('data:')) {
      const [header, base64Data] = document.fileUrl.split(',')
      const mimeType = header.match(/data:([^;]+)/)?.[1] || 'application/octet-stream'
      
      const buffer = Buffer.from(base64Data, 'base64')
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${document.fileName}"`,
          'Content-Length': buffer.length.toString()
        }
      })
    }

    // Si c'est une URL normale, rediriger
    return NextResponse.redirect(document.fileUrl)

  } catch (error) {
    console.error('Erreur lors du téléchargement du document:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
