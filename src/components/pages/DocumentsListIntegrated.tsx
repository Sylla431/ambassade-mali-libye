'use client'

import { motion } from 'framer-motion'
import { FileText, Download, Calendar, User, File, FileImage, FileVideo, Loader2, AlertCircle, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useState, useEffect } from 'react'

interface Document {
  id: string
  title: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  category: string
  isPublic: boolean
  createdAt: string
  author: {
    id: string
    name: string
  }
}

export default function DocumentsListIntegrated() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadDocuments()
  }, [currentPage])

  const loadDocuments = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        public: 'true'
      })

      const response = await fetch(`/api/documents?${params}`)
      const data = await response.json()

      if (data.success) {
        setDocuments(data.data.data)
        setTotalPages(data.data.pagination.totalPages)
      } else {
        setError(data.error || 'Erreur lors du chargement des documents')
      }
    } catch (err) {
      console.error('Error fetching documents:', err)
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
    if (mimeType.includes('image')) return <FileImage className="w-8 h-8 text-blue-500" />
    if (mimeType.includes('video')) return <FileVideo className="w-8 h-8 text-purple-500" />
    return <File className="w-8 h-8 text-gray-500" />
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'VISA_FORMS': 'bg-blue-100 text-blue-800',
      'LEGAL_DOCUMENTS': 'bg-green-100 text-green-800',
      'NEWS': 'bg-purple-100 text-purple-800',
      'FORMS': 'bg-yellow-100 text-yellow-800',
      'GUIDES': 'bg-indigo-100 text-indigo-800',
      'AGREEMENTS': 'bg-red-100 text-red-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      'VISA_FORMS': 'Formulaires Visa',
      'LEGAL_DOCUMENTS': 'Documents Légaux',
      'NEWS': 'Actualités',
      'FORMS': 'Formulaires',
      'GUIDES': 'Guides',
      'AGREEMENTS': 'Accords'
    }
    return labels[category as keyof typeof labels] || category
  }


  if (loading && documents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Chargement des documents...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Erreur de chargement</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <button
              onClick={() => loadDocuments()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documents Officiels
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Accédez aux formulaires, guides et documents officiels de l'Ambassade du Mali en Libye
          </p>
        </div>


        {/* Liste des documents */}
        {loading && documents.length > 0 ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Mise à jour...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun document n'est disponible pour le moment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {documents.map((document, index) => (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(document.mimeType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {document.title}
                        </h3>
                        {document.titleAr && (
                          <h4 className="text-sm text-gray-600 mb-2 text-right" dir="rtl">
                            {document.titleAr}
                          </h4>
                        )}
                      </div>
                    </div>

                    {document.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {document.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(document.createdAt), 'dd MMM yyyy', { locale: fr })}
                        </span>
                        <span>{formatFileSize(document.fileSize)}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="w-3 h-3 mr-1" />
                        {document.author.name}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(document.category)}`}>
                        {getCategoryLabel(document.category)}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(document.fileUrl, '_blank')}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={document.fileUrl}
                          download={document.fileName}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Télécharger"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === page
                            ? 'text-white bg-blue-600 border border-blue-600'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
