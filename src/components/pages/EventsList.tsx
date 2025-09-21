'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ArrowRight, Filter } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { useState } from 'react'

const allEvents = [
  {
    id: 1,
    title: 'Les Chargés d\'affaires a.i du Mali et du Niger avec Son Excellence Monsieur le Ministre des Affaires Étrangères de l\'État de Libye',
    date: new Date('2025-05-13'),
    location: 'Tripoli, Libye',
    type: 'Diplomatique',
    image: '/images/events/diplomatic-meeting-1.jpg',
    excerpt: 'Rencontre diplomatique importante entre les représentants du Mali, du Niger et de la Libye pour renforcer les relations bilatérales.',
    status: 'past',
    description: 'Description complète de l\'événement...'
  },
  {
    id: 2,
    title: 'Rencontre entre les Représentants du Mali et du Burkina Faso à Tripoli',
    date: new Date('2025-06-13'),
    location: 'Tripoli, Libye',
    type: 'Coopération',
    image: '/images/events/mali-burkina-meeting.jpg',
    excerpt: 'Échanges fructueux entre les délégations malienne et burkinabé sur les questions de coopération régionale.',
    status: 'past',
    description: 'Description complète de l\'événement...'
  },
  {
    id: 3,
    title: 'Renforcement des liens au sein de l\'AES : visites de courtoisie entre diplomates à Tripoli',
    date: new Date('2025-06-15'),
    location: 'Tripoli, Libye',
    type: 'AES',
    image: '/images/events/aes-meeting.jpg',
    excerpt: 'Visites de courtoisie entre les diplomates de l\'Alliance des États du Sahel pour renforcer la solidarité régionale.',
    status: 'past',
    description: 'Description complète de l\'événement...'
  },
  {
    id: 4,
    title: 'Rencontre diplomatique entre le Mali et le Niger',
    date: new Date('2025-10-26'),
    endDate: new Date('2027-12-26'),
    location: 'Tripoli, Libye',
    type: 'Diplomatique',
    image: '/images/events/mali-niger-meeting.jpg',
    excerpt: 'Rencontre diplomatique importante entre le Mali et le Niger pour renforcer la coopération bilatérale.',
    status: 'upcoming',
    description: 'Description complète de l\'événement...'
  },
  {
    id: 5,
    title: 'Rencontre diplomatique entre le Mali et le Burkina Faso',
    date: new Date('2028-08-15'),
    time: '15:00 - 19:00',
    location: 'Tripoli, Libye',
    type: 'Coopération',
    image: '/images/events/mali-burkina-future.jpg',
    excerpt: 'Rencontre diplomatique entre le Mali et le Burkina Faso pour discuter des questions de coopération régionale.',
    status: 'upcoming',
    description: 'Description complète de l\'événement...'
  },
  {
    id: 6,
    title: 'Festival Culturel Malien en Libye',
    date: new Date('2025-03-20'),
    location: 'Tripoli, Centre Culturel',
    type: 'Culture',
    image: '/images/events/festival-culturel.jpg',
    excerpt: 'Festival culturel mettant en valeur la richesse du patrimoine malien avec musique, danse et artisanat.',
    status: 'upcoming',
    description: 'Description complète de l\'événement...'
  }
]

const eventTypes = [
  { name: 'Tous', count: allEvents.length },
  { name: 'Diplomatique', count: allEvents.filter(e => e.type === 'Diplomatique').length },
  { name: 'Coopération', count: allEvents.filter(e => e.type === 'Coopération').length },
  { name: 'AES', count: allEvents.filter(e => e.type === 'AES').length },
  { name: 'Culture', count: allEvents.filter(e => e.type === 'Culture').length }
]

const statusFilters = [
  { name: 'Tous', value: 'all' },
  { name: 'Passés', value: 'past' },
  { name: 'À venir', value: 'upcoming' }
]

export default function EventsList() {
  const [selectedType, setSelectedType] = useState('Tous')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filteredEvents = allEvents.filter(event => {
    const matchesType = selectedType === 'Tous' || event.type === selectedType
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus
    return matchesType && matchesStatus
  })

  const pastEvents = filteredEvents.filter(event => event.status === 'past')
  const upcomingEvents = filteredEvents.filter(event => event.status === 'upcoming')

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Événements & Activités
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez tous les événements, rencontres diplomatiques et activités de l'Ambassade du Mali en Libye.
          </p>
        </motion.div>

        {/* Filtres */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Filtres par type */}
            <div className="flex flex-wrap gap-2">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              {eventTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() => setSelectedType(type.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type.name
                      ? 'bg-mali-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-mali-green-100 dark:hover:bg-mali-green-900'
                  }`}
                >
                  {type.name} ({type.count})
                </button>
              ))}
            </div>

            {/* Filtres par statut */}
            <div className="flex gap-2">
              {statusFilters.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedStatus === status.value
                      ? 'bg-mali-gold-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-mali-gold-100 dark:hover:bg-mali-gold-900'
                  }`}
                >
                  {status.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Événements à venir */}
        {upcomingEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Événements à venir
            </h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 bg-gradient-to-br from-mali-green-100 to-mali-gold-100 dark:from-mali-green-900 dark:to-mali-gold-900 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[url('/images/events/diplomatic-meeting-1.jpg')] bg-cover bg-center opacity-20"></div>
                    <Calendar className="h-16 w-16 text-mali-green-600 dark:text-mali-green-400 relative z-10" />
                    <div className="absolute top-4 right-4 bg-mali-gold-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      À venir
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-2 py-1 bg-mali-green-100 dark:bg-mali-green-900 text-mali-green-800 dark:text-mali-green-200 text-xs font-medium rounded-full">
                        {event.type}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {event.excerpt}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(event.date, 'dd MMM yyyy')}
                          {event.endDate && ` - ${format(event.endDate, 'dd MMM yyyy')}`}
                        </span>
                      </div>
                      {event.time && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/evenements/${event.id}`}
                      className="inline-flex items-center space-x-1 text-mali-green-600 dark:text-mali-green-400 font-medium text-sm hover:text-mali-green-700 dark:hover:text-mali-green-300 transition-colors"
                    >
                      <span>En savoir plus</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {/* Événements passés */}
        {pastEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Événements passés
            </h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {pastEvents.map((event, index) => (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 bg-gradient-to-br from-mali-green-100 to-mali-gold-100 dark:from-mali-green-900 dark:to-mali-gold-900 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[url('/images/events/diplomatic-meeting-1.jpg')] bg-cover bg-center opacity-20"></div>
                    <Calendar className="h-16 w-16 text-mali-green-600 dark:text-mali-green-400 relative z-10" />
                    <div className="absolute top-4 right-4 bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Passé
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-2 py-1 bg-mali-green-100 dark:bg-mali-green-900 text-mali-green-800 dark:text-mali-green-200 text-xs font-medium rounded-full">
                        {event.type}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {event.excerpt}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(event.date, 'dd MMM yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/evenements/${event.id}`}
                      className="inline-flex items-center space-x-1 text-mali-green-600 dark:text-mali-green-400 font-medium text-sm hover:text-mali-green-700 dark:hover:text-mali-green-300 transition-colors"
                    >
                      <span>Voir les détails</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun événement trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Essayez de modifier vos critères de filtrage.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
