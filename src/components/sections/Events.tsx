'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

const events = [
  {
    id: 1,
    title: 'Les Chargés d\'affaires a.i du Mali et du Niger avec Son Excellence Monsieur le Ministre des Affaires Étrangères de l\'État de Libye',
    date: new Date('2025-05-13'),
    location: 'Tripoli, Libye',
    type: 'Diplomatique',
    image: '/images/events/diplomatic-meeting-1.jpg',
    excerpt: 'Rencontre diplomatique importante entre les représentants du Mali, du Niger et de la Libye pour renforcer les relations bilatérales.',
    status: 'past'
  },
  {
    id: 2,
    title: 'Rencontre entre les Représentants du Mali et du Burkina Faso à Tripoli',
    date: new Date('2025-06-13'),
    location: 'Tripoli, Libye',
    type: 'Coopération',
    image: '/images/events/mali-burkina-meeting.jpg',
    excerpt: 'Échanges fructueux entre les délégations malienne et burkinabé sur les questions de coopération régionale.',
    status: 'past'
  },
  {
    id: 3,
    title: 'Renforcement des liens au sein de l\'AES : visites de courtoisie entre diplomates à Tripoli',
    date: new Date('2025-06-15'),
    location: 'Tripoli, Libye',
    type: 'AES',
    image: '/images/events/aes-meeting.jpg',
    excerpt: 'Visites de courtoisie entre les diplomates de l\'Alliance des États du Sahel pour renforcer la solidarité régionale.',
    status: 'past'
  }
]

const upcomingEvents = [
  {
    id: 4,
    title: 'Rencontre diplomatique entre le Mali et le Niger',
    date: new Date('2025-10-26'),
    endDate: new Date('2027-12-26'),
    location: 'Tripoli, Libye',
    type: 'Diplomatique'
  },
  {
    id: 5,
    title: 'Rencontre diplomatique entre le Mali et le Burkina Faso',
    date: new Date('2028-08-15'),
    time: '15:00 - 19:00',
    location: 'Tripoli, Libye',
    type: 'Coopération'
  }
]

export default function Events() {
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
            Derniers Événements de l'Ambassade
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez les activités récentes et les rencontres diplomatiques importantes 
            organisées par l'Ambassade du Mali en Libye.
          </p>
        </motion.div>

        {/* Événements récents */}
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
              <div className="h-48 bg-gradient-to-br from-mali-green-100 to-mali-gold-100 dark:from-mali-green-900 dark:to-mali-gold-900 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[url('/images/events/diplomatic-meeting-1.jpg')] bg-cover bg-center opacity-20"></div>
                <Calendar className="h-16 w-16 text-mali-green-600 dark:text-mali-green-400 relative z-10" />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs font-medium rounded-full">
                    {event.type}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {event.excerpt}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(event.date, 'dd MMM yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Événements à venir */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-900 rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Événements à venir
          </h3>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {event.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(event.date, 'dd MMM yyyy')}
                        {event.endDate && ` - ${format(event.endDate, 'dd MMM yyyy')}`}
                      </span>
                    </div>
                    {event.time && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-secondary-100 dark:bg-secondary-900 text-secondary-800 dark:text-secondary-200 text-xs font-medium rounded-full">
                  {event.type}
                </span>
              </div>
            ))}
          </div>
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
