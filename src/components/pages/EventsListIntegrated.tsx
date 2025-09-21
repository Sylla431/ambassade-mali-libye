'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, User, ArrowRight, Search, Loader2, AlertCircle, Filter } from 'lucide-react'
import Link from 'next/link'
import { format, isAfter, isBefore } from 'date-fns'
import { useState } from 'react'
import { useEvents } from '@/hooks/useEvents'

export default function EventsListIntegrated() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState('Tous')

  const { events, loading, error, pagination, loadEvents } = useEvents({
    page: currentPage,
    limit: 6,
    search: searchTerm || undefined,
    published: true
  })

  const eventStatuses = [
    { name: 'Tous', count: events.length },
    { name: 'À venir', count: events.filter(e => isBefore(new Date(), new Date(e.startDate))).length },
    { name: 'En cours', count: events.filter(e => {
      const now = new Date()
      const start = new Date(e.startDate)
      const end = e.endDate ? new Date(e.endDate) : null
      return !isBefore(now, start) && (!end || !isAfter(now, end))
    }).length },
    { name: 'Terminé', count: events.filter(e => {
      const now = new Date()
      const end = e.endDate ? new Date(e.endDate) : new Date(e.startDate)
      return isAfter(now, end)
    }).length }
  ]

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
    setCurrentPage(1)
  }

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1)
  }

  const getEventStatus = (startDate: string, endDate?: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null

    if (isBefore(now, start)) {
      return { status: 'upcoming', label: 'À venir', color: 'bg-blue-100 text-blue-800' }
    } else if (end && isAfter(now, end)) {
      return { status: 'past', label: 'Terminé', color: 'bg-gray-100 text-gray-800' }
    } else {
      return { status: 'ongoing', label: 'En cours', color: 'bg-green-100 text-green-800' }
    }
  }

  // Filtrer les événements selon le statut sélectionné
  const filteredEvents = events.filter(event => {
    if (selectedStatus === 'Tous') return true
    
    const eventStatus = getEventStatus(event.startDate, event.endDate)
    switch (selectedStatus) {
      case 'À venir':
        return eventStatus.status === 'upcoming'
      case 'En cours':
        return eventStatus.status === 'ongoing'
      case 'Terminé':
        return eventStatus.status === 'past'
      default:
        return true
    }
  })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Erreur de chargement</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => loadEvents()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Événements et Activités
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les événements organisés par l'Ambassade du Mali en Libye et participez à nos activités culturelles et diplomatiques.
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Recherche */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mali-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Filtres par statut */}
            <div className="flex flex-wrap gap-2">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              {eventStatuses.map((status) => (
                <button
                  key={status.name}
                  onClick={() => handleStatusChange(status.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedStatus === status.name
                      ? 'bg-mali-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-mali-green-100 dark:hover:bg-mali-green-900'
                  }`}
                >
                  {status.name} ({status.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des événements */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Événements
            {pagination.total > 0 && (
              <span className="text-lg font-normal text-gray-500 ml-2">
                ({pagination.total} événement{pagination.total > 1 ? 's' : ''})
              </span>
            )}
          </h2>

          {loading && events.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Chargement des événements...</span>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun événement trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedStatus !== 'Tous'
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Aucun événement n\'est disponible pour le moment.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => {
                const eventStatus = getEventStatus(event.startDate, event.endDate)
                return (
                  <motion.article
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img
                        src={event.imageUrl || '/images/events/default.jpg'}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${eventStatus.color}`}>
                          {eventStatus.label}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {event.author.name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(event.startDate), 'dd MMM yyyy')}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {event.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>
                            {format(new Date(event.startDate), 'HH:mm')}
                            {event.endDate && ` - ${format(new Date(event.endDate), 'HH:mm')}`}
                          </span>
                        </div>
                        <Link
                          href={`/evenements/${event.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Détails
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          )}
        </div>

        {/* Bouton "Charger plus" */}
        {pagination.page < pagination.totalPages && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Chargement...
                </>
              ) : (
                'Charger plus d\'événements'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
