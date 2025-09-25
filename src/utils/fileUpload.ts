// Utilitaire pour l'upload de fichiers par chunks
export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
  chunkIndex: number
  totalChunks: number
}

export interface UploadResult {
  success: boolean
  document?: any
  file?: {
    name: string
    size: number
    type: string
    url: string
  }
  message?: string
  error?: string
}

export class ChunkedFileUploader {
  private chunkSize: number = 2 * 1024 * 1024 // 2MB par chunk
  private uploadId: string

  constructor(chunkSize: number = 2 * 1024 * 1024) {
    this.chunkSize = chunkSize
    this.uploadId = this.generateUploadId()
  }

  private generateUploadId(): string {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      const totalChunks = Math.ceil(file.size / this.chunkSize)
      let uploadedBytes = 0

      console.log(`Début de l'upload de ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB) en ${totalChunks} chunks`)

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * this.chunkSize
        const end = Math.min(start + this.chunkSize, file.size)
        const chunk = file.slice(start, end)

        const formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('fileName', file.name)
        formData.append('fileSize', file.size.toString())
        formData.append('fileType', file.type)
        formData.append('chunkIndex', chunkIndex.toString())
        formData.append('totalChunks', totalChunks.toString())
        formData.append('uploadId', this.uploadId)

        console.log(`Upload du chunk ${chunkIndex + 1}/${totalChunks} (${(chunk.size / 1024).toFixed(1)}KB)`)

        const response = await fetch('/api/upload/documents-chunk-v2', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
          },
          body: formData
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Erreur lors de l'upload du chunk ${chunkIndex + 1}:`, errorText)
          return {
            success: false,
            error: `Erreur lors de l'upload du chunk ${chunkIndex + 1}: ${errorText}`
          }
        }

        const result = await response.json()
        
        if (!result.success) {
          return {
            success: false,
            error: result.error || 'Erreur inconnue lors de l\'upload'
          }
        }

        uploadedBytes += chunk.size

        // Mettre à jour le progrès
        if (onProgress) {
          onProgress({
            loaded: uploadedBytes,
            total: file.size,
            percentage: Math.round((uploadedBytes / file.size) * 100),
            chunkIndex: chunkIndex + 1,
            totalChunks: totalChunks
          })
        }

        // Si c'est le dernier chunk et que l'upload est terminé
        if (result.completed) {
          console.log('Upload terminé avec succès:', result)
          return {
            success: true,
            document: result.document,
            file: result.file,
            message: result.message
          }
        }

        // Petite pause entre les chunks pour éviter de surcharger le serveur
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      return {
        success: false,
        error: 'Upload terminé mais aucun résultat final reçu'
      }

    } catch (error) {
      console.error('Erreur lors de l\'upload par chunks:', error)
      return {
        success: false,
        error: `Erreur lors de l'upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      }
    }
  }

  async uploadMultipleFiles(
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      console.log(`Upload du fichier ${i + 1}/${files.length}: ${file.name}`)
      
      const result = await this.uploadFile(file, (progress) => {
        if (onProgress) {
          onProgress(i, progress)
        }
      })

      results.push(result)

      // Si un fichier échoue, on continue avec les autres
      if (!result.success) {
        console.error(`Échec de l'upload du fichier ${file.name}:`, result.error)
      }
    }

    return results
  }
}

// Fonction utilitaire pour créer un uploader
export function createFileUploader(chunkSize?: number): ChunkedFileUploader {
  return new ChunkedFileUploader(chunkSize)
}
