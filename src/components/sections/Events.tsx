'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { format, isAfter, isBefore } from 'date-fns'
import { useEffect, useState } from 'react'
import { isVideoUrl } from '@/utils/media'

interface Event {
  id: string
  title: string
  titleAr?: string | null
  description: string
  descriptionAr?: string | null
  location: string
  startDate: string
  endDate?: string | null
  isRecurring?: boolean | null
  imageUrl?: string | null
  published: boolean
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
  }
  category?: {
    id: string
    name: string
    nameAr?: string | null
  } | null
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  
  console.log('Composant Events rendu - loading:', loading, 'events:', events.length, 'upcoming:', upcomingEvents.length)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Début du fetch des événements...')
        const response = await fetch('/api/events?published=true&limit=10&page=1')
        console.log('Réponse reçue:', response.status, response.ok)
        const data = await response.json()
        console.log('Données parsées:', data)
        
        if (data.success && data.data) {
          // La structure de la réponse est data.data.data (array)
          const allEvents = data.data.data || []
          console.log('Événements récupérés:', allEvents.length, allEvents)
          
          // Trier les événements par date de création (les plus récents en premier)
          const sortedEvents = allEvents.sort((a: Event, b: Event) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          
          // Afficher les 3 événements les plus récents
          setEvents(sortedEvents.slice(0, 3))
          console.log('Événements à afficher:', sortedEvents.slice(0, 3))
          
          // Pour la section Perspectives, filtrer seulement les événements à venir
          const now = new Date()
          const upcomingOnly = allEvents.filter((event: Event) => 
            new Date(event.startDate) > now
          ).sort((a: Event, b: Event) => 
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )
          
          setUpcomingEvents(upcomingOnly.slice(0, 5)) // Maximum 5 événements à venir
          console.log('Événements pour Perspectives (à venir):', upcomingOnly.slice(0, 5))
        } else {
          console.log('Condition échouée - data.success:', data.success, 'data.data:', data.data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const getEventStatus = (startDate: string, endDate?: string | null) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null

    if (isBefore(now, start)) {
      return 'upcoming'
    } else if (end && isAfter(now, end)) {
      return 'past'
    } else {
      return 'current'
    }
  }
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Events de l'Ambassade
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez les activités récentes et les rencontres diplomatiques importantes 
            organisées par l'Ambassade du Mali en Libye.
          </p>
        </motion.div>

        {/* Événements récents */}
        {loading ? (
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {events.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link href={`/evenements/${event.id}`}>
                  <div className="h-48 bg-gradient-to-br from-mali-green-100 to-mali-gold-100 dark:from-mali-green-900 dark:to-mali-gold-900 flex items-center justify-center relative">
                    {event.imageUrl ? (
                      isVideoUrl(event.imageUrl) ? (
                        <video
                          src={event.imageUrl}
                          className="absolute inset-0 w-full h-full object-cover"
                          controls={false}
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img 
                          src={event.imageUrl} 
                          alt={event.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[url('/images/events/diplomatic-meeting-1.jpg')] bg-cover bg-center opacity-20"></div>
                        <Calendar className="h-16 w-16 text-mali-green-600 dark:text-mali-green-400 relative z-10" />
                      </>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs font-medium rounded-full">
                        {event.category?.name || 'Événement'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        getEventStatus(event.startDate, event.endDate) === 'upcoming' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : getEventStatus(event.startDate, event.endDate) === 'current'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {getEventStatus(event.startDate, event.endDate) === 'upcoming' ? 'À venir' :
                         getEventStatus(event.startDate, event.endDate) === 'current' ? 'En cours' : 'Terminé'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.startDate), 'dd MMM yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {/* Événements à venir - Perspectives */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-900 rounded-lg p-8"
        >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Perspectives
                  </h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Link key={event.id} href={`/evenements/${event.id}`}>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {event.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(event.startDate), 'dd MMM yyyy')}
                            {event.endDate && ` - ${format(new Date(event.endDate), 'dd MMM yyyy')}`}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-secondary-100 dark:bg-secondary-900 text-secondary-800 dark:text-secondary-200 text-xs font-medium rounded-full">
                      {event.category?.name || 'Événement'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Aucun événement à venir pour le moment
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/evenements"
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <span>Voir tous les événements</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
