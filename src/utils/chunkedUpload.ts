/**
 * Upload un fichier volumineux par chunks pour contourner les limites Vercel
 * @param file - Le fichier à uploader
 * @param options - Options d'upload
 * @param onProgress - Callback pour suivre la progression
 * @returns L'URL du fichier uploadé
 */
export async function uploadFileInChunks(
  file: File,
  options: {
    articleId?: string
    altText?: string
    caption?: string
    captionAr?: string
    chunkSize?: number // Taille des chunks en bytes (défaut: 4MB)
  } = {},
  onProgress?: (progress: number) => void
): Promise<{ mediaUrl: string; mediaType: string; galleryEntry?: any }> {
  
  const chunkSize = options.chunkSize || 4 * 1024 * 1024 // 4MB par défaut
  const totalChunks = Math.ceil(file.size / chunkSize)
  const uploadId = `${Date.now()}-${Math.random().toString(36).substring(7)}`
  
  console.log(`Upload par chunks: ${file.name}, ${totalChunks} chunks de ${(chunkSize / 1024 / 1024).toFixed(1)}MB`)
  
  try {
    // Uploader chaque chunk
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      const chunk = file.slice(start, end)
      
      const formData = new FormData()
      formData.append('chunk', chunk)
      formData.append('fileName', file.name)
      formData.append('fileSize', file.size.toString())
      formData.append('fileType', file.type)
      formData.append('chunkIndex', chunkIndex.toString())
      formData.append('totalChunks', totalChunks.toString())
      formData.append('uploadId', uploadId)
      
      if (options.articleId) formData.append('articleId', options.articleId)
      if (options.altText) formData.append('altText', options.altText)
      if (options.caption) formData.append('caption', options.caption)
      if (options.captionAr) formData.append('captionAr', options.captionAr)
      
      const response = await fetch('/api/gallery/upload-chunk', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de l\'upload du chunk')
      }
      
      const result = await response.json()
      
      // Mettre à jour la progression
      if (onProgress && result.progress) {
        onProgress(result.progress.percentage)
      }
      
      // Si c'est le dernier chunk, retourner le résultat
      if (chunkIndex === totalChunks - 1 && result.data) {
        console.log('Upload terminé:', result.data)
        return result.data
      }
    }
    
    throw new Error('Upload terminé mais aucune donnée retournée')
    
  } catch (error) {
    console.error('Erreur lors de l\'upload par chunks:', error)
    throw error
  }
}

/**
 * Détermine si un fichier doit être uploadé par chunks
 * @param file - Le fichier à vérifier
 * @param threshold - Seuil en MB (défaut: 10MB)
 * @returns true si l'upload par chunks est recommandé
 */
export function shouldUseChunkedUpload(file: File, threshold: number = 10): boolean {
  const thresholdBytes = threshold * 1024 * 1024
  return file.size > thresholdBytes
}

/**
 * Formate la taille d'un fichier en MB
 */
export function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(2)} MB`
}

