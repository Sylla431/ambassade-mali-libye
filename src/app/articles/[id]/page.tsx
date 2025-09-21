'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react'
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
}

export default function ArticlePage() {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useParams()
  const articleId = params.id as string

  useEffect(() => {
    loadArticle()
  }, [articleId])

  const loadArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${articleId}`)
      
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
            <button
              onClick={shareArticle}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Share2 className="w-4 h-4" />
              <span>Partager</span>
            </button>
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
    </div>
  )
}
