'use client'

import { motion } from 'framer-motion'
import { Star, MapPin, Users, Calendar } from 'lucide-react'
import Image from 'next/image'

const culturalHighlights = [
  {
    title: 'Patrimoine UNESCO',
    count: '4 sites',
    description: 'Le Mali compte 4 sites classés au patrimoine mondial de l\'UNESCO',
    sites: ['Tombouctou', 'Djenné', 'Falaises de Bandiagara', 'Tombeau des Askia']
  },
  {
    title: 'Diversité Ethnique',
    count: '12 groupes',
    description: 'Une mosaïque de peuples et de cultures traditionnelles',
    groups: ['Bambara', 'Peul', 'Dogon', 'Touareg', 'Songhaï', 'Malinké']
  },
  {
    title: 'Festivals Culturels',
    count: '20+ événements',
    description: 'Des festivals qui célèbrent la richesse culturelle malienne',
    festivals: ['Festival sur le Niger', 'Festival au désert', 'Festival des masques']
  },
  {
    title: 'Artisanat Traditionnel',
    count: '50+ métiers',
    description: 'Un savoir-faire ancestral transmis de génération en génération',
    crafts: ['Bogolan', 'Sculpture sur bois', 'Bijoux en or', 'Poterie']
  }
]

const culturalRegions = [
  {
    name: 'Région de Tombouctou',
    description: 'Ancienne cité caravanière et centre intellectuel de l\'Afrique de l\'Ouest',
    highlights: ['Manuscrits anciens', 'Architecture soudanaise', 'Traditions touarègues'],
    image: '/images/culture_tourisme/tomboctou.jpg'
  },
  {
    name: 'Pays Dogon',
    description: 'Territoire des falaises de Bandiagara et de la culture dogon unique',
    highlights: ['Falaises de Bandiagara', 'Architecture dogon', 'Mythologie traditionnelle'],
    image: '/images/culture_tourisme/dogon.jpg'
  },
  {
    name: 'Région de Ségou',
    description: 'Centre culturel et artistique du Mali contemporain',
    highlights: ['Festival sur le Niger', 'Art contemporain', 'Traditions bambara'],
    image: '/images/culture_tourisme/segou.avif'
  }
]

export default function CultureOverview() {
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
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Culture & Tourisme du Mali
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Le Mali est un carrefour de civilisations millénaires, berceau de grands empires 
            et gardien d'un patrimoine culturel exceptionnel. Découvrez la richesse de ses 
            traditions, de son artisanat et de ses sites historiques classés au patrimoine mondial.
          </p>
        </motion.div>

        {/* Statistiques culturelles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {culturalHighlights.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <div className="mb-4">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {highlight.count}
                </h3>
                <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
                  {highlight.title}
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {highlight.description}
              </p>
              <div className="space-y-1">
                {highlight.sites?.slice(0, 3).map((item, itemIndex) => (
                  <div key={itemIndex} className="text-xs text-gray-500 dark:text-gray-500">
                    • {item}
                  </div>
                ))}
                {highlight.groups?.slice(0, 3).map((item, itemIndex) => (
                  <div key={itemIndex} className="text-xs text-gray-500 dark:text-gray-500">
                    • {item}
                  </div>
                ))}
                {highlight.festivals?.slice(0, 3).map((item, itemIndex) => (
                  <div key={itemIndex} className="text-xs text-gray-500 dark:text-gray-500">
                    • {item}
                  </div>
                ))}
                {highlight.crafts?.slice(0, 3).map((item, itemIndex) => (
                  <div key={itemIndex} className="text-xs text-gray-500 dark:text-gray-500">
                    • {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Régions culturelles */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Régions Culturelles
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {culturalRegions.map((region, index) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={region.image}
                    alt={region.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 rounded-full p-3">
                      <MapPin className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {region.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {region.description}
                  </p>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Points d'intérêt :
                    </h4>
                    <ul className="space-y-1">
                      {region.highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Patrimoine et traditions */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Un Patrimoine Vivant
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Le Mali préserve un patrimoine culturel exceptionnel qui témoigne de la richesse 
              de ses civilisations passées et présentes. De l'architecture en terre de Djenné 
              aux manuscrits anciens de Tombouctou, chaque région raconte une histoire unique.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Traditions Communautaires
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Des cérémonies et rituels qui perpétuent les valeurs ancestrales
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
                  <Calendar className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Festivals Annuels
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Des célébrations qui rassemblent les communautés et les visiteurs
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gold-50 to-primary-50 dark:from-gold-900 dark:to-primary-900 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Découvrir le Mali
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Sites UNESCO</span>
                <span className="font-bold text-primary-600 dark:text-primary-400">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Groupes ethniques</span>
                <span className="font-bold text-secondary-600 dark:text-secondary-400">12+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Festivals majeurs</span>
                <span className="font-bold text-gold-600 dark:text-gold-400">20+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Langues parlées</span>
                <span className="font-bold text-primary-600 dark:text-primary-400">40+</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
