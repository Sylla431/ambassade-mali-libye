import { NextRequest, NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// DELETE /api/gallery/[id] - Supprimer une image de la galerie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const imageId = params.id

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'ID de l\'image requis' },
        { status: 400 }
      )
    }

    // Récupérer le média depuis la base de données
    const media = await prisma.articleGallery.findUnique({
      where: { id: imageId }
    })

    if (!media) {
      return NextResponse.json(
        { success: false, error: 'Média non trouvé' },
        { status: 404 }
      )
    }

    try {
      // Supprimer le fichier de Vercel Blob Storage
      await del(media.mediaUrl)
    } catch (blobError) {
      console.warn('Impossible de supprimer le fichier de Blob Storage:', blobError)
      // On continue même si la suppression du blob échoue
    }

    // Supprimer l'entrée de la base de données
    await prisma.articleGallery.delete({
      where: { id: imageId }
    })

    return NextResponse.json({
      success: true,
      data: { deletedImageId: imageId },
      message: 'Média supprimé avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la suppression du média:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du média' },
      { status: 500 }
    )
  }
}
