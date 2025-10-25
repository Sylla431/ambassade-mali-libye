'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, User, ArrowLeft, Share2, Eye } from 'lucide-react'
import Link from 'next/link'
import { format, isAfter, isBefore } from 'date-fns'
import { fr } from 'date-fns/locale'
import Image from 'next/image'

interface EventDetailProps {
  event: {
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
    gallery: Array<{
      id: string
      url: string
      alt?: string | null
      order: number
    }>
  }
}

export default function EventDetail({ event }: EventDetailProps) {
  const getEventStatus = (startDate: string, endDate?: string | null) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null

    if (isBefore(now, start)) {
      return { status: 'upcoming', label: 'À venir', color: 'text-blue-600 bg-blue-100' }
    } else if (end && isAfter(now, end)) {
      return { status: 'past', label: 'Terminé', color: 'text-gray-600 bg-gray-100' }
    } else {
      return { status: 'current', label: 'En cours', color: 'text-green-600 bg-green-100' }
    }
  }

  const eventStatus = getEventStatus(event.startDate, event.endDate)

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr })
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: fr })
  }

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header avec image */}
      <div className="relative h-96 bg-gradient-to-r from-green-600 to-green-800">
        {event.imageUrl && (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover opacity-80"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Navigation */}
        <div className="relative z-10 p-6">
          <Link
            href="/evenements"
            className="inline-flex items-center space-x-2 text-white hover:text-green-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux événements</span>
          </Link>
        </div>

        {/* Contenu du header */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${eventStatus.color}`}>
                {eventStatus.label}
              </span>
              {event.category && (
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  {event.category.name}
                </span>
              )}
            </div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-bold mb-4"
            >
              {event.title}
            </motion.h1>

            {event.titleAr && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl lg:text-3xl font-semibold text-green-200 mb-4"
                dir="rtl"
              >
                {event.titleAr}
              </motion.h2>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center gap-6 text-lg"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(event.startDate)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{formatTime(event.startDate)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{event.location}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                À propos de cet événement
              </h3>
              
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {event.descriptionAr && (
                <div className="mt-8">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    بالعربية
                  </h4>
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p 
                      className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
                      dir="rtl"
                    >
                      {event.descriptionAr}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Galerie d'images */}
            {event.gallery && event.gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Galerie
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.gallery.map((image, index) => (
                    <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.alt || `Image ${index + 1} de l'événement`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6"
            >
              {/* Détails de l'événement */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Détails
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Date de début
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {formatDateTime(event.startDate)}
                      </p>
                    </div>
                  </div>

                  {event.endDate && (
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Date de fin
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          {formatDateTime(event.endDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Lieu
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  {event.category && (
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-green-600 rounded mt-1" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Catégorie
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          {event.category.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations sur l'auteur */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Publié par
                </h3>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {event.author.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {format(new Date(event.createdAt), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Actions
                </h3>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Partager</span>
                  </button>
                  
                  <Link
                    href="/evenements"
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Voir tous les événements</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
