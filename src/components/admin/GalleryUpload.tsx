'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'

interface GalleryUploadProps {
  articleId?: string
  onUploadSuccess?: (images: any[]) => void
  onUploadError?: (error: string) => void
  maxFiles?: number
  maxSize?: number // en MB
}

interface UploadProgress {
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
}

export default function GalleryUpload({
  articleId,
  onUploadSuccess,
  onUploadError,
  maxFiles = 10,
  maxSize = 10
}: GalleryUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files)
    
    // Validation du nombre de fichiers
    if (fileArray.length > maxFiles) {
      onUploadError?.(`Maximum ${maxFiles} fichiers autorisés`)
      return
    }

    // Validation de la taille des fichiers
    const oversizedFiles = fileArray.filter(file => file.size > maxSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)}MB)`).join(', ')
      onUploadError?.(`Fichiers trop volumineux: ${fileNames}\n\nTaille maximale autorisée: ${maxSize}MB`)
      return
    }

    // Validation des types de fichiers
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
    ]
    const invalidFiles = fileArray.filter(file => !allowedTypes.includes(file.type))
    if (invalidFiles.length > 0) {
      const fileNames = invalidFiles.map(f => f.name).join(', ')
      onUploadError?.(`Types de fichiers non autorisés: ${fileNames}\n\nTypes autorisés: JPG, PNG, GIF, WebP, MP4, WebM, OGG, MOV`)
      return
    }

    setUploading(true)
    setUploadProgress(fileArray.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    })))

    try {
      const formData = new FormData()
      fileArray.forEach(file => {
        formData.append('files', file)
      })

      if (articleId) {
        formData.append('articleId', articleId)
      }

      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setUploadProgress(prev => prev.map(item => ({
          ...item,
          progress: 100,
          status: 'success' as const
        })))
        
        onUploadSuccess?.(data.data)
        
        // Réinitialiser après 2 secondes
        setTimeout(() => {
          setUploadProgress([])
          setUploading(false)
        }, 2000)
      } else {
        setUploadProgress(prev => prev.map(item => ({
          ...item,
          status: 'error' as const,
          error: data.error
        })))
        onUploadError?.(data.error)
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      setUploadProgress(prev => prev.map(item => ({
        ...item,
        status: 'error' as const,
        error: 'Erreur de connexion'
      })))
      onUploadError?.('Erreur de connexion lors de l\'upload')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const removeUploadProgress = (index: number) => {
    setUploadProgress(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Zone de drop */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-mali-green-500 bg-mali-green-50 dark:bg-mali-green-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-mali-green-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
            accept="image/*,video/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-mali-green-100 dark:bg-mali-green-900 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-mali-green-600 dark:text-mali-green-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Glissez-déposez vos images ici
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ou cliquez pour sélectionner des fichiers
            </p>
          </div>
          
          <div className="text-xs text-gray-400 dark:text-gray-500">
            <p>Types autorisés: JPG, PNG, GIF, WebP, MP4, WebM, OGG, MOV</p>
            <p>Taille maximale: Images {maxSize}MB | Vidéos 100MB</p>
            <p>Maximum: {maxFiles} fichiers</p>
          </div>
        </div>
      </div>

      {/* Progression des uploads */}
      {uploadProgress.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload en cours...
          </h4>
          
          {uploadProgress.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <ImageIcon className="w-5 h-5 text-mali-green-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({(item.file.size / 1024 / 1024).toFixed(1)}MB)
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.status === 'success' && (
                    <span className="text-green-600 text-sm">✓ Terminé</span>
                  )}
                  {item.status === 'error' && (
                    <span className="text-red-600 text-sm">✗ Erreur</span>
                  )}
                  {item.status === 'uploading' && (
                    <span className="text-blue-600 text-sm">{item.progress}%</span>
                  )}
                  
                  <button
                    onClick={() => removeUploadProgress(index)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {item.status === 'uploading' && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-mali-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              )}
              
              {item.status === 'error' && item.error && (
                <div className="flex items-center space-x-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{item.error}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
