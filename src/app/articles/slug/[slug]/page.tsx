'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, User, Tag, ArrowLeft, Share2, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  titleAr?: string
  content: string
  contentAr?: string
  excerpt: string
  excerptAr?: string
  slug: string
  published: boolean
  featured: boolean
  imageUrl?: string
  tags?: string
  createdAt: string
  updatedAt: string
  author: {
    name: string
  }
  category?: {
    id: string
    name: string
    nameAr?: string
    color?: string
  }
  gallery?: Array<{
    id: string
    imageUrl: string
    altText?: string
    caption?: string
    captionAr?: string
    order: number
  }>
}

export default function ArticleBySlugPage() {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const params = useParams()
  const slug = params.slug as string

  useEffect(() => {
    loadArticle()
  }, [slug])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImageIndex !== null && article?.gallery) {
        switch (event.key) {
          case 'Escape':
            closeImageModal()
            break
          case 'ArrowLeft':
            prevImage()
            break
          case 'ArrowRight':
            nextImage()
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIndex, article?.gallery])

  const loadArticle = async () => {
    try {
      // Ajouter un paramètre de cache-busting pour forcer le rechargement
      const cacheBuster = Date.now()
      const response = await fetch(`/api/articles/slug/${slug}?t=${cacheBuster}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setArticle(data.data)
        } else {
          setError('Article non trouvé')
        }
      } else {
        setError('Article non trouvé')
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error)
      setError('Erreur lors du chargement de l\'article')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href
      })
    } else {
      // Fallback: copier l'URL dans le presse-papiers
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papiers')
    }
  }

  const refreshArticle = () => {
    setLoading(true)
    setError('')
    loadArticle()
  }

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index)
  }

  const closeImageModal = () => {
    setSelectedImageIndex(null)
  }

  const nextImage = () => {
    if (article?.gallery && selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % article.gallery.length)
    }
  }

  const prevImage = () => {
    if (article?.gallery && selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? article.gallery.length - 1 : selectedImageIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/articles"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux articles</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link 
              href="/articles"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour aux articles</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshArticle}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                title="Actualiser l'article"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Actualiser</span>
              </button>
              <button
                onClick={shareArticle}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Share2 className="w-4 h-4" />
                <span>Partager</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image de l'article */}
          {article.imageUrl && (
            <div className="aspect-video w-full">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* En-tête de l'article */}
            <header className="mb-8">
              {/* Catégorie */}
              {article.category && (
                <div className="mb-4">
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: article.category.color || '#3B82F6' }}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {article.category.name}
                  </span>
                </div>
              )}

              {/* Titre */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
              
              {article.titleAr && (
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-right" dir="rtl">
                  {article.titleAr}
                </h2>
              )}

              {/* Extrait */}
              {article.excerpt && (
                <p className="text-lg text-gray-600 mb-4">
                  {article.excerpt}
                </p>
              )}
              
              {article.excerptAr && (
                <p className="text-lg text-gray-600 mb-4 text-right" dir="rtl">
                  {article.excerptAr}
                </p>
              )}

              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-t border-b border-gray-200 py-4">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Par {article.author.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                {article.featured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    En vedette
                  </span>
                )}
              </div>
            </header>

            {/* Contenu de l'article */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {article.content}
              </div>
              
              {article.contentAr && (
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-right mt-8" dir="rtl">
                  {article.contentAr}
                </div>
              )}
            </div>

            {/* Galerie d'images */}
            {article.gallery && article.gallery.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Galerie d'images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {article.gallery.map((image, index) => (
                    <div 
                      key={image.id} 
                      className="group relative cursor-pointer"
                      onClick={() => openImageModal(index)}
                    >
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={image.imageUrl}
                          alt={image.altText || image.caption || article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      {/* Overlay au survol */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-white bg-opacity-90 rounded-full p-2">
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {article.tags && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Navigation vers d'autres articles */}
        <div className="mt-8 text-center">
          <Link 
            href="/articles"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voir tous les articles</span>
          </Link>
        </div>
      </main>

      {/* Modal de visualisation d'image */}
      {selectedImageIndex !== null && article?.gallery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full p-4">
            {/* Bouton fermer */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Bouton précédent */}
            {article.gallery.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Bouton suivant */}
            {article.gallery.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Image */}
            <img
              src={article.gallery[selectedImageIndex].imageUrl}
              alt={article.gallery[selectedImageIndex].altText || article.gallery[selectedImageIndex].caption || article.title}
              className="max-w-full max-h-full object-contain"
            />

            {/* Caption */}
            {article.gallery[selectedImageIndex].caption && (
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded">
                <p className="text-center">
                  {article.gallery[selectedImageIndex].caption}
                </p>
                {article.gallery[selectedImageIndex].captionAr && (
                  <p className="text-center mt-1" dir="rtl">
                    {article.gallery[selectedImageIndex].captionAr}
                  </p>
                )}
              </div>
            )}

            {/* Indicateur de position */}
            {article.gallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {article.gallery.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
