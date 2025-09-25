'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/admin/AuthGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import { createFileUploader, UploadProgress } from '@/utils/fileUpload'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Search,
  Filter,
  FileText,
  File,
  Calendar,
  User,
  Globe,
  Lock
} from 'lucide-react'

interface Document {
  id: string
  title: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  category: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  author: {
    name: string
  }
}

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadDocuments()
  }, [currentPage, searchTerm, filterCategory, filterVisibility])

  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      if (filterCategory) {
        params.append('category', filterCategory)
      }

      if (filterVisibility !== 'all') {
        params.append('public', filterVisibility === 'public' ? 'true' : 'false')
      }

      const response = await fetch(`/api/documents?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDocuments(data.data.data)
        setTotalPages(data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Vérifier la taille des fichiers côté client (limite chunked upload: 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    const oversizedFiles = Array.from(files).filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)}MB)`).join(', ')
      alert(`❌ Fichiers trop volumineux: ${fileNames}\n\nTaille maximale autorisée: 100MB`)
      return
    }

    setUploading(true)
    setUploadProgress(null)

    try {
      const uploader = createFileUploader(2 * 1024 * 1024) // 2MB par chunk
      const results = await uploader.uploadMultipleFiles(
        Array.from(files),
        (fileIndex, progress) => {
          setUploadProgress(progress)
        }
      )

      const successfulUploads = results.filter(r => r.success)
      const failedUploads = results.filter(r => !r.success)

      if (successfulUploads.length > 0) {
        alert(`✅ ${successfulUploads.length} document(s) uploadé(s) avec succès`)
        loadDocuments() // Recharger la liste
      }

      if (failedUploads.length > 0) {
        const errorMessages = failedUploads.map(r => r.error).join('\n')
        alert(`❌ ${failedUploads.length} document(s) ont échoué:\n${errorMessages}`)
      }

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      alert('❌ Erreur de connexion lors de l\'upload')
    } finally {
      setUploading(false)
      setUploadProgress(null)
    }
  }

  const toggleVisibility = async (documentId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isPublic: !currentStatus
        })
      })

      if (response.ok) {
        loadDocuments()
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const deleteDocument = async (documentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        loadDocuments()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getCategoryLabel = (category: string) => {
    const categoryLabels: { [key: string]: string } = {
      'VISA_FORMS': 'Formulaires de visa',
      'LEGAL_DOCUMENTS': 'Documents légaux',
      'NOTE_DE_SERVICE': 'Notes de service',
      'NEWS': 'Actualités',
      'ANNOUNCEMENTS': 'Annonces',
      'CULTURAL': 'Culturel',
      'ECONOMIC': 'Économique',
      'POLITICAL': 'Politique'
    }
    return categoryLabels[category] || category
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-600" />
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return <FileText className="w-5 h-5 text-blue-600" />
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return <FileText className="w-5 h-5 text-green-600" />
    } else {
      return <File className="w-5 h-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des documents...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout 
        title="Gestion des documents" 
        description="Téléchargez et gérez les documents officiels"
      >
        <div className="flex justify-end mb-6">
          <label className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Télécharger</span>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                     title="Taille maximale: 100MB"
            />
          </label>
        </div>

        {/* Indicateur d'upload */}
        {uploading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-mali-green-600"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload en cours...
              </span>
            </div>
            
            {uploadProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Chunk {uploadProgress.chunkIndex}/{uploadProgress.totalChunks}</span>
                  <span>{uploadProgress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-mali-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(uploadProgress.loaded / 1024 / 1024 * 10) / 10}MB / {Math.round(uploadProgress.total / 1024 / 1024 * 10) / 10}MB
                </div>
              </div>
            )}
          </div>
        )}
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un document..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Toutes les catégories</option>
                  <option value="VISA_FORMS">Formulaires de visa</option>
                  <option value="LEGAL_DOCUMENTS">Documents légaux</option>
                  <option value="NOTE_DE_SERVICE">Notes de service</option>
                  <option value="NEWS">Actualités</option>
                  <option value="ANNOUNCEMENTS">Annonces</option>
                  <option value="CULTURAL">Culturel</option>
                  <option value="ECONOMIC">Économique</option>
                  <option value="POLITICAL">Politique</option>
                </select>
                <select
                  value={filterVisibility}
                  onChange={(e) => setFilterVisibility(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">Tous</option>
                  <option value="public">Publics</option>
                  <option value="private">Privés</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des documents */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Documents ({documents.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {documents.length > 0 ? (
              documents.map((document) => (
                <div key={document.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getFileIcon(document.mimeType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {document.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            document.isPublic 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {document.isPublic ? (
                              <>
                                <Globe className="w-3 h-3 mr-1" />
                                Public
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 mr-1" />
                                Privé
                              </>
                            )}
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {getCategoryLabel(document.category)}
                          </span>
                        </div>
                        {document.titleAr && (
                          <p className="text-sm text-gray-600 mt-1" dir="rtl">
                            {document.titleAr}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {document.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(document.createdAt)}
                          </span>
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {document.author.name}
                          </span>
                          <span>{formatFileSize(document.fileSize)}</span>
                          <span className="text-xs text-gray-400">
                            {document.fileName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={document.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Voir"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <a
                        href={document.fileUrl}
                        download
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => toggleVisibility(document.id, document.isPublic)}
                        className={`p-2 rounded-lg ${
                          document.isPublic 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={document.isPublic ? 'Rendre privé' : 'Rendre public'}
                      >
                        {document.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => router.push(`/admin/documents/${document.id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteDocument(document.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                Aucun document trouvé
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Zone de téléchargement */}
        {uploading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-700">Téléchargement en cours...</span>
              </div>
            </div>
          </div>
        )}
   
    
      </AdminLayout>
    
    </AuthGuard>
  )
}
