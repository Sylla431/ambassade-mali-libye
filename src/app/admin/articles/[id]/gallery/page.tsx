'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  ArrowLeft,
  Image as ImageIcon,
  Upload
} from 'lucide-react'

interface GalleryImage {
  id: string
  imageUrl: string
  altText?: string
  caption?: string
  captionAr?: string
  order: number
  createdAt: string
}

interface Article {
  id: string
  title: string
  slug: string
}

export default function ArticleGalleryPage() {
  const [article, setArticle] = useState<Article | null>(null)
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
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
  const { toasts, showSuccess, showError, removeToast } = useToast()
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string

  useEffect(() => {
    loadData()
  }, [articleId])

  const loadData = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      // Charger l'article et sa galerie
      const [articleRes, galleryRes] = await Promise.all([
        fetch(`/api/articles/${articleId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/articles/${articleId}/gallery`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (articleRes.ok) {
        const articleData = await articleRes.json()
        setArticle(articleData.data)
      }

      if (galleryRes.ok) {
        const galleryData = await galleryRes.json()
        setGallery(galleryData.data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      showError('Erreur de chargement', 'Impossible de charger les données')
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
      
      const filesArray = Array.from(files)
      for (const file of filesArray) {
        const formData = new FormData()
        formData.append('files', file)

        // Uploader l'image
        const uploadRes = await fetch('/api/upload/images-db', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        })

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          if (uploadData.success && uploadData.data.successful.length > 0) {
            const imageUrl = uploadData.data.successful[0].file.url
            
            // Ajouter à la galerie de l'article
            const galleryRes = await fetch(`/api/articles/${articleId}/gallery`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                imageUrl,
                altText: file.name.replace(/\.[^/.]+$/, ''),
                caption: file.name.replace(/\.[^/.]+$/, ''),
                order: gallery.length
              })
            })

            if (galleryRes.ok) {
              showSuccess('Image ajoutée', 'L\'image a été ajoutée à la galerie')
            } else {
              showError('Erreur', 'Impossible d\'ajouter l\'image à la galerie')
            }
          }
        } else {
          showError('Erreur d\'upload', 'Impossible d\'uploader l\'image')
        }
      }

      loadData() // Recharger la galerie
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
      message: 'Êtes-vous sûr de vouloir supprimer cette image de la galerie ?',
      type: 'danger',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
        try {
          const token = localStorage.getItem('admin_token')
          const response = await fetch(`/api/articles/${articleId}/gallery/${imageId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })

          if (response.ok) {
            showSuccess('Image supprimée', 'L\'image a été supprimée de la galerie')
            loadData()
          } else {
            showError('Erreur de suppression', 'Impossible de supprimer l\'image')
          }
        } catch (error) {
          console.error('Erreur lors de la suppression:', error)
          showError('Erreur de suppression', 'Impossible de supprimer l\'image')
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la galerie...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout 
        title={`Galerie - ${article?.title || 'Article'}`}
        description="Gérez les images de la galerie de cet article"
      >
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/articles')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux articles</span>
          </button>
        </div>

        {/* Upload d'images */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Ajouter des images</h2>
          </div>
          <div className="p-6">
            <label className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer w-fit">
              <Plus className="w-4 h-4" />
              <span>Sélectionner des images</span>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {/* Galerie */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Galerie d'images ({gallery.length})
            </h2>
          </div>
          
          {gallery.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.map((image) => (
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
                      <p className="text-xs text-gray-500">
                        Ordre: {image.order}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune image dans la galerie
              </h3>
              <p className="text-gray-600">
                Ajoutez des images pour créer la galerie de cet article
              </p>
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
