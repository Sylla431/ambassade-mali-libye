'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit, Eye, Plus, Search, Filter } from 'lucide-react'
import Image from 'next/image'

interface GalleryImage {
  id: string
  imageUrl: string
  altText: string
  caption: string
  captionAr: string
  order: number
  createdAt: string
  article?: {
    id: string
    title: string
    slug: string
  }
}

interface GalleryManagerProps {
  articleId?: string
  onImageSelect?: (image: GalleryImage) => void
  onImageDelete?: (imageId: string) => void
  onImageEdit?: (image: GalleryImage) => void
}

export default function GalleryManager({
  articleId,
  onImageSelect,
  onImageDelete,
  onImageEdit
}: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'articles' | 'general'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const loadImages = async (page = 1, search = '', type = 'all') => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      })

      if (search) params.append('search', search)
      if (type !== 'all') params.append('type', type)

      const response = await fetch(`/api/gallery?${params}`)
      const data = await response.json()

      if (data.success) {
        setImages(data.data)
        setTotalPages(data.pagination.totalPages)
        setCurrentPage(page)
      } else {
        setError(data.error || 'Erreur lors du chargement des images')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const deleteImage = async (imageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      return
    }

    try {
      const response = await fetch(`/api/gallery/${imageId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setImages(prev => prev.filter(img => img.id !== imageId))
        onImageDelete?.(imageId)
      } else {
        setError(data.error || 'Erreur lors de la suppression')
      }
    } catch (err) {
      setError('Erreur de connexion')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadImages(1, searchTerm, filterType)
  }

  const handleFilterChange = (type: 'all' | 'articles' | 'general') => {
    setFilterType(type)
    loadImages(1, searchTerm, type)
  }

  useEffect(() => {
    loadImages()
  }, [])

  return (
    <div className="space-y-6">
      {/* En-tête avec recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher des images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mali-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-mali-green-600 text-white rounded-lg hover:bg-mali-green-700 transition-colors"
            >
              Rechercher
            </button>
          </form>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => handleFilterChange(e.target.value as any)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mali-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Toutes les images</option>
              <option value="articles">Images d'articles</option>
              <option value="general">Images générales</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Grille d'images */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Aucune image trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="aspect-square relative">
                <Image
                  src={image.imageUrl}
                  alt={image.altText}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                
                {/* Overlay avec actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onImageSelect?.(image)}
                      className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                      title="Sélectionner"
                    >
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
                    
                    <button
                      onClick={() => onImageEdit?.(image)}
                      className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4 text-gray-700" />
                    </button>
                    
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="p-2 bg-red-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Informations de l'image */}
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {image.caption || image.altText}
                </p>
                
                {image.article && (
                  <p className="text-xs text-mali-green-600 dark:text-mali-green-400 truncate">
                    {image.article.title}
                  </p>
                )}
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(image.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => loadImages(currentPage - 1, searchTerm, filterType)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          
          <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} sur {totalPages}
          </span>
          
          <button
            onClick={() => loadImages(currentPage + 1, searchTerm, filterType)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}
