'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Edit, Trash2, Move, Eye } from 'lucide-react'
import { GalleryImage } from '@/types/api'

interface ImageGalleryProps {
  articleId?: string
  eventId?: string
  images: GalleryImage[]
  onImagesChange: (images: GalleryImage[]) => void
  onAddImage: (mediaUrl: string, altText?: string, caption?: string, captionAr?: string) => Promise<void>
  onUpdateImage: (imageId: string, altText?: string, caption?: string, captionAr?: string, order?: number) => Promise<void>
  onDeleteImage: (imageId: string) => Promise<void>
  isAdmin?: boolean
}

export default function ImageGallery({
  articleId,
  eventId,
  images,
  onImagesChange,
  onAddImage,
  onUpdateImage,
  onDeleteImage,
  isAdmin = false
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    altText: '',
    caption: '',
    captionAr: ''
  })

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image)
    setEditForm({
      altText: image.altText || '',
      caption: image.caption || '',
      captionAr: image.captionAr || ''
    })
  }

  const handleSaveEdit = async () => {
    if (!selectedImage) return

    try {
      await onUpdateImage(
        selectedImage.id,
        editForm.altText,
        editForm.caption,
        editForm.captionAr
      )
      setIsEditing(false)
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      return
    }

    try {
      await onDeleteImage(imageId)
      if (selectedImage?.id === imageId) {
        setSelectedImage(null)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const moveImage = (imageId: string, direction: 'up' | 'down') => {
    const sortedImages = [...images].sort((a, b) => a.order - b.order)
    const currentIndex = sortedImages.findIndex(img => img.id === imageId)
    
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= sortedImages.length) return

    // Échanger les ordres
    const newImages = [...sortedImages]
    const temp = newImages[currentIndex].order
    newImages[currentIndex].order = newImages[newIndex].order
    newImages[newIndex].order = temp

    onImagesChange(newImages)
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucune image dans la galerie</p>
        {isAdmin && (
          <p className="text-sm mt-2">Utilisez le bouton "Ajouter des images" pour commencer</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Grille des images */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images
          .sort((a, b) => a.order - b.order)
          .map((image) => (
            <div
              key={image.id}
              className="relative group cursor-pointer"
              onClick={() => handleImageClick(image)}
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image.mediaUrl}
                  alt={image.altText || ''}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
              
              {/* Overlay avec actions (admin seulement) */}
              {isAdmin && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleImageClick(image)
                      }}
                      className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(image.id)
                      }}
                      className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Numéro d'ordre */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {image.order + 1}
              </div>
            </div>
          ))}
      </div>

      {/* Modal de visualisation/édition */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex">
              {/* Image principale */}
              <div className="flex-1 p-6">
                <div className="relative">
                  <img
                    src={selectedImage.mediaUrl}
                    alt={selectedImage.altText || ''}
                    className="w-full h-auto max-h-[60vh] object-contain"
                  />
                  
                  {/* Boutons de navigation */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        onClick={() => moveImage(selectedImage.id, 'up')}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                        title="Monter"
                      >
                        <Move className="w-4 h-4 rotate-180" />
                      </button>
                      <button
                        onClick={() => moveImage(selectedImage.id, 'down')}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                        title="Descendre"
                      >
                        <Move className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Légendes */}
                <div className="mt-4 space-y-2">
                  {selectedImage.caption && (
                    <p className="text-gray-700">{selectedImage.caption}</p>
                  )}
                  {selectedImage.captionAr && (
                    <p className="text-gray-700" dir="rtl">{selectedImage.captionAr}</p>
                  )}
                </div>
              </div>

              {/* Panneau d'édition (admin seulement) */}
              {isAdmin && (
                <div className="w-80 border-l border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Modifier l'image</h3>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Texte alternatif
                        </label>
                        <input
                          type="text"
                          value={editForm.altText}
                          onChange={(e) => setEditForm(prev => ({ ...prev, altText: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Description de l'image"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Légende (français)
                        </label>
                        <textarea
                          value={editForm.caption}
                          onChange={(e) => setEditForm(prev => ({ ...prev, caption: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="Légende en français"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Légende (arabe)
                        </label>
                        <textarea
                          value={editForm.captionAr}
                          onChange={(e) => setEditForm(prev => ({ ...prev, captionAr: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          dir="rtl"
                          placeholder="الشرح بالعربية"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Texte alternatif
                        </label>
                        <p className="text-sm text-gray-600">
                          {selectedImage.altText || 'Aucun texte alternatif'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Légende (français)
                        </label>
                        <p className="text-sm text-gray-600">
                          {selectedImage.caption || 'Aucune légende'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Légende (arabe)
                        </label>
                        <p className="text-sm text-gray-600" dir="rtl">
                          {selectedImage.captionAr || 'لا يوجد شرح'}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(selectedImage.id)}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
