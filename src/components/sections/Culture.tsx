'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Star, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Seulement 3 éléments pour la page d'accueil
const culturalSites = [
  {
    id: 1,
    title: 'Tombouctou',
    subtitle: 'La cité des 333 saints',
    description: 'Tombouctou, ancienne cité caravanière et centre intellectuel de l\'Afrique de l\'Ouest, abrite des trésors architecturaux et manuscrits historiques.',
    image: '/images/culture_tourisme/tomboctou.jpg',
    features: ['Patrimoine UNESCO', 'Manuscrits anciens', 'Architecture soudanaise'],
    href: '/culture/tombouctou'
  },
  {
    id: 2,
    title: 'Le Pays Dogon',
    subtitle: 'Falaises mythiques',
    description: 'Explorez les falaises de Bandiagara et découvrez la culture unique du peuple Dogon, ses traditions et son art.',
    image: '/images/culture_tourisme/dogon.jpg',
    features: ['Falaises de Bandiagara', 'Culture Dogon', 'Traditions ancestrales'],
    href: '/culture/pays-dogon'
  },
  {
    id: 3,
    title: 'Région de Ségou',
    subtitle: 'Centre culturel et artistique',
    description: 'Découvrez Ségou, centre culturel et artistique du Mali contemporain, berceau du Festival sur le Niger.',
    image: '/images/culture_tourisme/segou.avif',
    features: ['Festival sur le Niger', 'Art contemporain', 'Traditions bambara'],
    href: '/culture/segou'
  }
]

export default function Culture() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Culture & Tourisme
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Le Mali est un carrefour de civilisations, avec un patrimoine culturel parmi les plus riches d'Afrique. 
            De Tombouctou à Djenné, en passant par le Pays Dogon et le fleuve Niger, le Mali fascine par ses traditions, 
            sa musique, son artisanat et ses sites classés au patrimoine mondial de l'UNESCO.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {culturalSites.map((site, index) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={site.href}>
                <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={site.image}
                      alt={site.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="bg-white bg-opacity-90 rounded-full p-3">
                        <MapPin className="h-8 w-8 text-primary-600" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {site.title}
                    </h3>
                    <p className="text-gold-600 dark:text-gold-400 font-medium mb-3">
                      {site.subtitle}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {site.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {site.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                      <span>En savoir plus</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Section statistiques culturelles */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-gold-50 to-primary-50 dark:from-gold-900 dark:to-primary-900 rounded-lg p-8"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-3">
                <Star className="h-8 w-8 text-gold-600 dark:text-gold-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">4</h3>
              <p className="text-gray-600 dark:text-gray-400">Sites UNESCO</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-3">
                <MapPin className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">50+</h3>
              <p className="text-gray-600 dark:text-gray-400">Sites Touristiques</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">12</h3>
              <p className="text-gray-600 dark:text-gray-400">Groupes Ethniques</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/culture"
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <span>Découvrir la culture malienne</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
