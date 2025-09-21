'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/admin/AuthGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { useToast } from '@/components/ui/Toast'
import ToastContainer from '@/components/ui/ToastContainer'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Image as ImageIcon,
  Calendar,
  User,
  Tag,
  Upload,
  Grid,
  List
} from 'lucide-react'

interface GalleryImage {
  id: string
  imageUrl: string
  fileName: string
  fileSize: number
  altText?: string
  caption?: string
  captionAr?: string
  order: number
  createdAt: string
  article?: {
    id: string
    title: string
  }
  event?: {
    id: string
    title: string
  }
}

export default function AdminGalleries() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'articles' | 'events'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type?: 'danger' | 'warning' | 'info'
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  })
  const { toasts, showSuccess, showError, showWarning, removeToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadImages()
  }, [currentPage, searchTerm, filterType])

  const loadImages = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      if (filterType !== 'all') {
        params.append('type', filterType)
      }

      const response = await fetch(`/api/gallery?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setImages(data.data.data)
          setTotalPages(data.data.pagination.totalPages)
        } else {
          showError('Erreur de chargement', data.error || 'Erreur lors du chargement des images')
        }
      } else {
        const errorData = await response.json()
        showError('Erreur de chargement', errorData.error || 'Erreur lors du chargement')
      }
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error)
      showError('Erreur de connexion', 'Impossible de se connecter au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const formData = new FormData()
      
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          showSuccess('Upload réussi', `${result.data.successfulCount} image(s) uploadée(s) avec succès`)
          loadImages() // Recharger la liste
        } else {
          showError('Erreur d\'upload', result.error || 'Erreur lors de l\'upload des images')
        }
      } else {
        const errorData = await response.json()
        showError('Erreur d\'upload', errorData.error || 'Erreur lors de l\'upload')
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      showError('Erreur de connexion', 'Impossible de se connecter au serveur')
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (imageId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer l\'image',
      message: 'Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.',
      type: 'danger',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
        try {
          const token = localStorage.getItem('admin_token')
          const response = await fetch(`/api/gallery/${imageId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.ok) {
            const result = await response.json()
            if (result.success) {
              showSuccess('Image supprimée', 'L\'image a été supprimée avec succès')
              loadImages()
            } else {
              showError('Erreur de suppression', result.error || 'Erreur lors de la suppression')
            }
          } else {
            const errorData = await response.json()
            showError('Erreur de suppression', errorData.error || 'Erreur lors de la suppression')
          }
        } catch (error) {
          console.error('Erreur lors de la suppression:', error)
          showError('Erreur de suppression', 'Impossible de supprimer l\'image')
        }
      }
    })
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredImages = images.filter(image => {
    if (filterType === 'articles') return image.article
    if (filterType === 'events') return image.event
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des images...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout 
        title="Gestion des galeries" 
        description="Gérez les images des articles et événements"
      >
        <div className="flex justify-end mb-6">
          <label className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Télécharger</span>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher une image..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">Toutes les images</option>
                  <option value="articles">Articles</option>
                  <option value="events">Événements</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des images */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Images ({filteredImages.length})
            </h2>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="p-6">
              {filteredImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredImages.map((image) => (
                    <div key={image.id} className="group relative">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={image.imageUrl}
                          alt={image.altText || ''}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(image.imageUrl, '_blank')}
                            className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                            title="Voir"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/galleries/${image.id}/edit`)}
                            className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-100"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteImage(image.id)}
                            className="p-2 bg-white rounded-full text-red-600 hover:bg-red-100"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {image.caption || 'Sans légende'}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {image.article && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Tag className="w-3 h-3 mr-1" />
                              Article
                            </span>
                          )}
                          {image.event && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Tag className="w-3 h-3 mr-1" />
                              Événement
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune image trouvée
                  </h3>
                  <p className="text-gray-600">
                    Commencez par télécharger des images pour créer vos galeries
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredImages.length > 0 ? (
                filteredImages.map((image) => (
                  <div key={image.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={image.imageUrl}
                          alt={image.altText || ''}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {image.caption || 'Sans légende'}
                          </h3>
                          {image.article && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Tag className="w-3 h-3 mr-1" />
                              Article: {image.article.title}
                            </span>
                          )}
                          {image.event && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Tag className="w-3 h-3 mr-1" />
                              Événement: {image.event.title}
                            </span>
                          )}
                        </div>
                        {image.altText && (
                          <p className="text-sm text-gray-600 mt-1">
                            {image.altText}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(image.createdAt)}
                          </span>
                          <span>{formatFileSize(image.fileSize)}</span>
                          <span>Ordre: {image.order}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(image.imageUrl, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/galleries/${image.id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteImage(image.id)}
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
                  Aucune image trouvée
                </div>
              )}
            </div>
          )}

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
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="text-gray-700">Téléchargement en cours...</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmation */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          type={confirmModal.type}
        />

        {/* Toast notifications */}
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </AdminLayout>
    </AuthGuard>
  )
}
