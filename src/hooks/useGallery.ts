import { useState, useEffect } from 'react'
import { GalleryImage } from '@/types/api'

interface UseGalleryProps {
  articleId?: string
  eventId?: string
  isAdmin?: boolean
}

export function useGallery({ articleId, eventId, isAdmin = false }: UseGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baseUrl = articleId ? `/api/articles/${articleId}/gallery` : `/api/events/${eventId}/gallery`

  // Charger les images de la galerie
  const loadImages = async () => {
    if (!articleId && !eventId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(baseUrl)
      const data = await response.json()

      if (data.success) {
        setImages(data.data)
      } else {
        setError(data.error || 'Erreur lors du chargement des images')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  // Ajouter une image à la galerie
  const addImage = async (
    mediaUrl: string,
    altText?: string,
    caption?: string,
    captionAr?: string
  ) => {
    if (!isAdmin) {
      throw new Error('Accès non autorisé')
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mediaUrl,
          altText,
          caption,
          captionAr,
          order: images.length
        })
      })

      const data = await response.json()

      if (data.success) {
        setImages(prev => [...prev, data.data])
        return data.data
      } else {
        throw new Error(data.error || 'Erreur lors de l\'ajout de l\'image')
      }
    } catch (error) {
      throw error
    }
  }

  // Mettre à jour une image
  const updateImage = async (
    imageId: string,
    altText?: string,
    caption?: string,
    captionAr?: string,
    order?: number
  ) => {
    if (!isAdmin) {
      throw new Error('Accès non autorisé')
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${baseUrl}/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          altText,
          caption,
          captionAr,
          order
        })
      })

      const data = await response.json()

      if (data.success) {
        setImages(prev => prev.map(img => 
          img.id === imageId ? { ...img, ...data.data } : img
        ))
        return data.data
      } else {
        throw new Error(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      throw error
    }
  }

  // Supprimer une image
  const deleteImage = async (imageId: string) => {
    if (!isAdmin) {
      throw new Error('Accès non autorisé')
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${baseUrl}/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setImages(prev => prev.filter(img => img.id !== imageId))
      } else {
        throw new Error(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      throw error
    }
  }

  // Réorganiser les images
  const reorderImages = async (newOrder: GalleryImage[]) => {
    if (!isAdmin) {
      throw new Error('Accès non autorisé')
    }

    try {
      // Mettre à jour l'ordre localement
      setImages(newOrder)

      // Mettre à jour l'ordre sur le serveur
      const updatePromises = newOrder.map((image, index) => 
        updateImage(image.id, image.altText, image.caption, image.captionAr, index)
      )

      await Promise.all(updatePromises)
    } catch (error) {
      // En cas d'erreur, recharger les images
      loadImages()
      throw error
    }
  }

  // Charger les images au montage
  useEffect(() => {
    loadImages()
  }, [articleId, eventId])

  return {
    images,
    loading,
    error,
    loadImages,
    addImage,
    updateImage,
    deleteImage,
    reorderImages
  }
}
