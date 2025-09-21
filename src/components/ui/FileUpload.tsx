'use client'

import { useState, useRef } from 'react'
import { Upload, X, File, Image, CheckCircle, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // en MB
  className?: string
  disabled?: boolean
}

interface UploadedFile {
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
  url?: string
}

export default function FileUpload({
  onUpload,
  accept = '*/*',
  multiple = false,
  maxFiles = 5,
  maxSize = 10,
  className = '',
  disabled = false
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Vérifier la taille
    if (file.size > maxSize * 1024 * 1024) {
      return `Le fichier ${file.name} est trop volumineux (max ${maxSize}MB)`
    }

    // Vérifier le type si spécifié
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const fileType = file.type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      
      const isAccepted = acceptedTypes.some(type => 
        type === fileType || 
        type === fileExtension ||
        (type.endsWith('/*') && fileType.startsWith(type.replace('/*', '/')))
      )

      if (!isAccepted) {
        return `Le type de fichier ${file.name} n'est pas autorisé`
      }
    }

    return null
  }

  const handleFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const validFiles: UploadedFile[] = []
    const errors: string[] = []

    // Vérifier le nombre maximum de fichiers
    if (files.length + fileArray.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} fichiers autorisés`)
    }

    fileArray.forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(error)
      } else {
        validFiles.push({
          file,
          status: 'pending'
        })
      }
    })

    if (errors.length > 0) {
      alert(errors.join('\n'))
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (disabled) return
    
    const droppedFiles = e.dataTransfer.files
    handleFiles(droppedFiles)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    if (pendingFiles.length === 0) return

    // Marquer les fichiers comme en cours d'upload
    setFiles(prev => prev.map(f => 
      f.status === 'pending' ? { ...f, status: 'uploading' as const } : f
    ))

    try {
      await onUpload(pendingFiles.map(f => f.file))
      
      // Marquer comme succès
      setFiles(prev => prev.map(f => 
        f.status === 'uploading' ? { ...f, status: 'success' as const } : f
      ))
    } catch (error) {
      // Marquer comme erreur
      setFiles(prev => prev.map(f => 
        f.status === 'uploading' ? { 
          ...f, 
          status: 'error' as const, 
          error: error instanceof Error ? error.message : 'Erreur d\'upload'
        } : f
      ))
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />
    }
    return <File className="w-4 h-4" />
  }

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'uploading':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return null
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone de drop */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-gray-600">
          Glissez-déposez vos fichiers ici ou{' '}
          <span className="text-blue-600 underline">cliquez pour sélectionner</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Maximum {maxFiles} fichiers, {maxSize}MB par fichier
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Fichiers sélectionnés</h4>
          {files.map((fileData, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(fileData.file)}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {fileData.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {fileData.error && (
                    <p className="text-xs text-red-500">{fileData.error}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(fileData.status)}
                {fileData.status === 'pending' && (
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bouton d'upload */}
      {files.some(f => f.status === 'pending') && (
        <button
          onClick={uploadFiles}
          disabled={disabled}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Uploader les fichiers
        </button>
      )}
    </div>
  )
}
