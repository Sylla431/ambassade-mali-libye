'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, MapPin, Clock, ArrowLeft, Share2, User } from 'lucide-react'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  location: string
  startDate: string
  endDate?: string
  published: boolean
  featured: boolean
  imageUrl?: string
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

export default function EventPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useParams()
  const eventId = params.id as string

  useEffect(() => {
    loadEvent()
  }, [eventId])

  const loadEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setEvent(data.data)
        } else {
          setError('Événement non trouvé')
        }
      } else {
        setError('Événement non trouvé')
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'événement:', error)
      setError('Erreur lors du chargement de l\'événement')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'événement...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Événement non trouvé</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/evenements"
            className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux événements</span>
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
              href="/evenements"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour aux événements</span>
            </Link>
            <button
              onClick={shareEvent}
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
          {/* Image de l'événement */}
          {event.imageUrl && (
            <div className="aspect-video w-full">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* En-tête de l'événement */}
            <header className="mb-8">
              {/* Catégorie */}
              {event.category && (
                <div className="mb-4">
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: event.category.color || '#10B981' }}
                  >
                    {event.category.name}
                  </span>
                </div>
              )}

              {/* Titre */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>
              
              {event.titleAr && (
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-right" dir="rtl">
                  {event.titleAr}
                </h2>
              )}

              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-t border-b border-gray-200 py-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(event.startDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Par {event.author.name}</span>
                </div>
                {event.featured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    En vedette
                  </span>
                )}
              </div>

              {/* Date de fin si différente */}
              {event.endDate && new Date(event.endDate).toDateString() !== new Date(event.startDate).toDateString() && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Fin de l'événement:</span>
                    <span>{formatDate(event.endDate)}</span>
                  </div>
                </div>
              )}
            </header>

            {/* Description de l'événement */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {event.description}
              </div>
              
              {event.descriptionAr && (
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-right mt-8" dir="rtl">
                  {event.descriptionAr}
                </div>
              )}
            </div>

            {/* Informations pratiques */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations pratiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Date et heure</p>
                    <p className="text-gray-600">{formatDate(event.startDate)}</p>
                    {event.endDate && (
                      <p className="text-gray-600">Fin: {formatDate(event.endDate)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Lieu</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Navigation vers d'autres événements */}
        <div className="mt-8 text-center">
          <Link 
            href="/evenements"
            className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voir tous les événements</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
