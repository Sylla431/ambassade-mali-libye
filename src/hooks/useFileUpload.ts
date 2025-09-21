import { useState } from 'react'

interface UploadResult {
  success: boolean
  file?: {
    originalName: string
    filename: string
    mimeType: string
    size: number
    url: string
  }
  error?: string
  originalName?: string
}

interface UploadResponse {
  successful: UploadResult[]
  failed: UploadResult[]
  total: number
  successfulCount: number
  failedCount: number
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState<UploadResponse | null>(null)

  const uploadFiles = async (
    files: File[],
    endpoint: 'images' | 'documents' | 'visa'
  ): Promise<UploadResponse> => {
    setIsUploading(true)
    setUploadResults(null)

    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch(`/api/upload/${endpoint}`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'upload')
      }

      setUploadResults(data.data)
      return data.data

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      throw new Error(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const uploadImages = async (files: File[]): Promise<UploadResponse> => {
    return uploadFiles(files, 'images')
  }

  const uploadDocuments = async (files: File[]): Promise<UploadResponse> => {
    return uploadFiles(files, 'documents')
  }

  const uploadVisaDocuments = async (files: File[]): Promise<UploadResponse> => {
    return uploadFiles(files, 'visa')
  }

  return {
    isUploading,
    uploadResults,
    uploadFiles,
    uploadImages,
    uploadDocuments,
    uploadVisaDocuments
  }
}
