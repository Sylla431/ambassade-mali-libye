import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest } from 'next/server'

export interface UploadResult {
  success: boolean
  filename?: string
  url?: string
  error?: string
}

export interface FileInfo {
  originalName: string
  filename: string
  mimeType: string
  size: number
  url: string
}

// Types de fichiers autorisés
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
]

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
  'image/jpeg',
  'image/jpg',
  'image/png'
]

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Générer un nom de fichier unique
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `${timestamp}-${random}.${extension}`
}

// Valider le type de fichier
export function validateFileType(mimeType: string, allowedTypes: string[]): boolean {
  return allowedTypes.includes(mimeType)
}

// Valider la taille du fichier
export function validateFileSize(size: number, maxSize: number = MAX_FILE_SIZE): boolean {
  return size <= maxSize
}

// Sauvegarder un fichier
export async function saveFile(
  file: File,
  uploadDir: string,
  allowedTypes: string[],
  maxSize: number = MAX_FILE_SIZE
): Promise<UploadResult> {
  try {
    // Validation du type
    if (!validateFileType(file.type, allowedTypes)) {
      return {
        success: false,
        error: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`
      }
    }

    // Validation de la taille
    if (!validateFileSize(file.size, maxSize)) {
      return {
        success: false,
        error: `Fichier trop volumineux. Taille maximale: ${maxSize / (1024 * 1024)}MB`
      }
    }

    // Générer le nom de fichier unique
    const filename = generateUniqueFilename(file.name)
    const filepath = join(process.cwd(), 'public', uploadDir, filename)

    // Créer le dossier s'il n'existe pas
    await mkdir(join(process.cwd(), 'public', uploadDir), { recursive: true })

    // Convertir le fichier en buffer et le sauvegarder
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    return {
      success: true,
      filename,
      url: `/${uploadDir}/${filename}`
    }

  } catch (error) {
    console.error('Erreur lors de la sauvegarde du fichier:', error)
    return {
      success: false,
      error: 'Erreur lors de la sauvegarde du fichier'
    }
  }
}

// Parser les données multipart/form-data
export async function parseMultipartFormData(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files: File[] = []
    const fields: Record<string, string> = {}

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files.push(value)
      } else {
        fields[key] = value as string
      }
    }

    return { files, fields }
  } catch (error) {
    console.error('Erreur lors du parsing des données:', error)
    throw new Error('Erreur lors du parsing des données')
  }
}

// Obtenir les informations d'un fichier
export function getFileInfo(file: File, url: string): FileInfo {
  return {
    originalName: file.name,
    filename: url.split('/').pop() || '',
    mimeType: file.type,
    size: file.size,
    url
  }
}
