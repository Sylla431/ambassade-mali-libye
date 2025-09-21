import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'

interface Article {
  id: string
  title: string
  titleAr?: string
  content: string
  contentAr?: string
  excerpt?: string
  excerptAr?: string
  slug: string
  featured: boolean
  published: boolean
  publishedAt?: string
  imageUrl?: string
  tags?: string
  categoryId?: string
  category?: {
    id: string
    name: string
    nameAr?: string
    color?: string
  }
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
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

interface UseArticlesParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  published?: boolean
}

export function useArticles(params: UseArticlesParams = {}) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const loadArticles = useCallback(async (newParams?: UseArticlesParams) => {
    setLoading(true)
    setError(null)
    setArticles([])
    setPagination(prev => ({ ...prev, page: 1 }))

    try {
      const response = await api.getArticles({
        page: 1,
        limit: params.limit || newParams?.limit || 10,
        search: params.search || newParams?.search,
        category: params.category || newParams?.category,
        published: params.published || newParams?.published
      })

      if (response.success && response.data) {
        setArticles(response.data!.data)
        setPagination(response.data!.pagination)
      } else {
        setError(response.error || 'Erreur lors du chargement des articles')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }, [params.limit, params.search, params.category, params.published])

  const loadMore = async () => {
    if (pagination.page < pagination.totalPages && !loadingMore) {
      setLoadingMore(true)
      setError(null)

      try {
        const nextPage = pagination.page + 1
        
        const response = await api.getArticles({
          page: nextPage,
          limit: params.limit || 10,
          search: params.search,
          category: params.category,
          published: params.published
        })

        if (response.success && response.data) {
          setArticles(prev => [...prev, ...response.data!.data])
          setPagination(prev => ({
            ...prev,
            page: response.data!.pagination.page,
            total: response.data!.pagination.total,
            totalPages: response.data!.pagination.totalPages
          }))
        } else {
          setError(response.error || 'Erreur lors du chargement des articles')
        }
      } catch (error) {
        setError('Erreur de connexion')
      } finally {
        setLoadingMore(false)
      }
    }
  }

  const refresh = () => {
    loadArticles()
  }

  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  return {
    articles,
    loading,
    loadingMore,
    error,
    pagination,
    loadArticles,
    loadMore,
    refresh
  }
}

export function useArticle(id: string) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadArticle = async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const response = await api.getArticle(id)

      if (response.success && response.data) {
        setArticle(response.data as Article)
      } else {
        setError(response.error || 'Article non trouvé')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticle()
  }, [id])

  return {
    article,
    loading,
    error,
    refresh: loadArticle
  }
}
