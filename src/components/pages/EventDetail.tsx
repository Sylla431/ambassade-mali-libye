'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, User, ArrowLeft, Share2, Eye } from 'lucide-react'
import Link from 'next/link'
import { format, isAfter, isBefore } from 'date-fns'
import { fr } from 'date-fns/locale'
import Image from 'next/image'
import { isVideoUrl } from '@/utils/media'

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
      altText?: string | null
    }>
  }
}

export default function EventDetail({ event }: EventDetailProps) {
  const formattedStartDate = event.startDate ? format(new Date(event.startDate), 'dd MMMM yyyy', { locale: fr }) : 'N/A'
  const formattedEndDate = event.endDate ? format(new Date(event.endDate), 'dd MMMM yyyy', { locale: fr }) : null
  const startTime = event.startDate ? format(new Date(event.startDate), 'HH:mm', { locale: fr }) : 'N/A'
  const endTime = event.endDate ? format(new Date(event.endDate), 'HH:mm', { locale: fr }) : null

  const getEventStatus = (startDate: string, endDate?: string | null) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null

    if (isBefore(now, start)) {
      return 'À venir'
    } else if (end && isAfter(now, end)) {
      return 'Terminé'
    } else {
      return 'En cours'
    }
  }

  const status = getEventStatus(event.startDate, event.endDate)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      {/* Hero Image */}
      <div className="relative h-96 w-full overflow-hidden">
        {event.imageUrl ? (
          isVideoUrl(event.imageUrl) ? (
            <video
              src={event.imageUrl}
              className="w-full h-full object-cover object-center"
              controls={false}
              muted
              loop
              playsInline
              autoPlay
            />
          ) : (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover object-center"
              priority
            />
          )
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-mali-green-600 to-mali-gold-600 flex items-center justify-center">
            <Calendar className="h-24 w-24 text-white opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-8">
          <div className="container-custom">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg"
            >
              {event.title}
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 mb-8"
            >
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-mali-green-600" />
                  <span>{formattedStartDate} {formattedEndDate && `- ${formattedEndDate}`}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-mali-gold-600" />
                  <span>{startTime} {endTime && `- ${endTime}`}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-mali-red-600" />
                  <span>{event.location}</span>
                </span>
                {event.category && (
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs font-medium rounded-full">
                    {event.category.name}
                  </span>
                )}
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  status === 'À venir' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  status === 'En cours' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {status}
                </span>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-4">{event.description}</p>
                {event.descriptionAr && (
                  <p className="text-lg leading-relaxed mb-4 text-right" dir="rtl">
                    {event.descriptionAr}
                  </p>
                )}
              </div>
            </motion.div>

            {event.gallery && event.gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Galerie d'images</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {event.gallery.map((image) => (
                    <div key={image.id} className="relative h-48 w-full overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={image.url}
                        alt={image.altText || event.title}
                        fill
                        className="object-cover object-center"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Informations</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-mali-green-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Auteur</p>
                    <p className="font-medium">{event.author.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-mali-gold-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Publié le</p>
                    <p className="font-medium">{format(new Date(event.createdAt), 'dd MMMM yyyy', { locale: fr })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-mali-red-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Statut</p>
                    <p className="font-medium">{event.published ? 'Publié' : 'Brouillon'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col space-y-4"
            >
              <Link
                href="/evenements"
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Retour aux événements</span>
              </Link>
              <button
                onClick={() => navigator.share && navigator.share({
                  title: event.title,
                  text: event.description,
                  url: window.location.href,
                })}
                className="btn-outline flex items-center justify-center space-x-2"
              >
                <Share2 className="h-5 w-5" />
                <span>Partager l'événement</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}