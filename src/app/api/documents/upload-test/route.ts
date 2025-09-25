import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST /api/documents/upload-test - Test simple d'upload vers Vercel Blob Storage
export async function POST(request: NextRequest) {
  try {
    console.log('=== Test API Upload ===')
    
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    console.log('Fichiers reçus:', files.length)
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    const file = files[0]
    console.log('Fichier:', file.name, 'Type:', file.type, 'Taille:', file.size)

    // Test simple d'upload vers Blob Storage
    const fileName = `test-${Date.now()}-${file.name}`
    console.log('Nom de fichier généré:', fileName)

    const blob = await put(fileName, file, {
      access: 'public',
      contentType: file.type
    })

    console.log('Upload réussi, URL:', blob.url)

    return NextResponse.json({
      success: true,
      data: {
        fileName: file.name,
        blobUrl: blob.url,
        size: file.size,
        type: file.type
      },
      message: 'Test d\'upload réussi'
    })

  } catch (error) {
    console.error('Erreur lors du test d\'upload:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors du test d\'upload',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
