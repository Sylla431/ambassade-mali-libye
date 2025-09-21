import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface Event {
  id: string
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  location: string
  startDate: string
  endDate?: string
  isRecurring: boolean
  imageUrl?: string
  published: boolean
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

interface UseEventsParams {
  page?: number
  limit?: number
  search?: string
  published?: boolean
}

export function useEvents(params: UseEventsParams = {}) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const loadEvents = async (newParams?: UseEventsParams) => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      if (params.page || newParams?.page) queryParams.append('page', String(params.page || newParams?.page || 1))
      if (params.limit || newParams?.limit) queryParams.append('limit', String(params.limit || newParams?.limit || 10))
      if (params.search || newParams?.search) queryParams.append('search', params.search || newParams?.search || '')
      if (typeof (params.published || newParams?.published) === 'boolean') queryParams.append('published', String(params.published || newParams?.published))

      const response = await api.getEvents({
        page: params.page || newParams?.page || 1,
        limit: params.limit || newParams?.limit || 10,
        search: params.search || newParams?.search,
        published: params.published || newParams?.published
      })

      if (response.success) {
        setEvents(response.data.data)
        setPagination(response.data.pagination)
      } else {
        setError(response.error || 'Erreur lors du chargement des événements')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    if (pagination.page < pagination.totalPages) {
      await loadEvents({ page: pagination.page + 1 })
    }
  }

  const refresh = () => {
    loadEvents()
  }

  useEffect(() => {
    loadEvents()
  }, [params.page, params.limit, params.search, params.published])

  return {
    events,
    loading,
    error,
    pagination,
    loadEvents,
    loadMore,
    refresh
  }
}

export function useEvent(id: string) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadEvent = async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const response = await api.getEvent(id)

      if (response.success) {
        setEvent(response.data)
      } else {
        setError(response.error || 'Événement non trouvé')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvent()
  }, [id])

  return {
    event,
    loading,
    error,
    refresh: loadEvent
  }
}
