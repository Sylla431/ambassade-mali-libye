'use client'

import { motion } from 'framer-motion'
import { MapPin, Star, Calendar, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const culturalSites = [
  {
    id: 1,
    name: 'Tombouctou',
    subtitle: 'La cité des 333 saints',
    description: 'Ancienne cité caravanière et centre intellectuel de l\'Afrique de l\'Ouest, Tombouctou abrite des trésors architecturaux et manuscrits historiques inestimables.',
    image: '/images/culture/tombouctou.jpg',
    unesco: true,
    highlights: [
      'Mosquée Djingareyber (XIVe siècle)',
      'Manuscrits anciens (100 000+ documents)',
      'Architecture soudanaise traditionnelle',
      'Centre d\'études islamiques'
    ],
    bestTime: 'Novembre - Mars',
    duration: '2-3 jours',
    difficulty: 'Facile'
  },
  {
    id: 2,
    name: 'Djenné',
    subtitle: 'La perle du delta',
    description: 'Célèbre pour sa grande mosquée en terre crue, Djenné est un exemple exceptionnel d\'architecture soudanaise et un centre commercial historique.',
    image: '/images/culture/djenne.jpg',
    unesco: true,
    highlights: [
      'Grande Mosquée de Djenné',
      'Marché hebdomadaire traditionnel',
      'Architecture en terre crue',
      'Artisanat local'
    ],
    bestTime: 'Novembre - Avril',
    duration: '1-2 jours',
    difficulty: 'Facile'
  },
  {
    id: 3,
    name: 'Falaises de Bandiagara',
    subtitle: 'Pays Dogon',
    description: 'Territoire des Dogons, ces falaises abritent des villages traditionnels et des sites sacrés qui témoignent d\'une culture unique et préservée.',
    image: '/images/culture/bandiagara.jpg',
    unesco: true,
    highlights: [
      'Villages troglodytes',
      'Architecture dogon traditionnelle',
      'Sites sacrés et cérémonies',
      'Artisanat et masques'
    ],
    bestTime: 'Novembre - Mars',
    duration: '3-5 jours',
    difficulty: 'Modéré'
  },
  {
    id: 4,
    name: 'Tombeau des Askia',
    subtitle: 'Gao historique',
    description: 'Mausolée pyramidal du XVe siècle, témoin de l\'empire Songhaï et de l\'architecture funéraire soudanaise traditionnelle.',
    image: '/images/culture/tombeau-askia.jpg',
    unesco: true,
    highlights: [
      'Architecture pyramidale unique',
      'Histoire de l\'empire Songhaï',
      'Traditions funéraires',
      'Centre historique de Gao'
    ],
    bestTime: 'Novembre - Mars',
    duration: '1 jour',
    difficulty: 'Facile'
  }
]

const festivals = [
  {
    name: 'Festival sur le Niger',
    location: 'Ségou',
    date: 'Février',
    description: 'Célébration de la culture malienne avec musique, danse et artisanat',
    highlights: ['Concerts', 'Expositions', 'Artisanat', 'Cuisine traditionnelle']
  },
  {
    name: 'Festival au Désert',
    location: 'Essakane',
    date: 'Janvier',
    description: 'Festival de musique du monde dans le désert du Sahara',
    highlights: ['Musique touarègue', 'Artistes internationaux', 'Campement traditionnel']
  },
  {
    name: 'Festival des Masques',
    location: 'Pays Dogon',
    date: 'Avril',
    description: 'Cérémonies traditionnelles avec masques et danses sacrées',
    highlights: ['Masques traditionnels', 'Danses sacrées', 'Rituels ancestraux']
  }
]

export default function CulturalSites() {
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
            Sites Culturels & Patrimoine UNESCO
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez les sites exceptionnels du Mali classés au patrimoine mondial de l'UNESCO 
            et plongez dans l'histoire millénaire de ce pays fascinant.
          </p>
        </motion.div>

        {/* Sites UNESCO */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {culturalSites.map((site, index) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-64 bg-gradient-to-br from-gold-100 to-primary-100 dark:from-gold-900 dark:to-primary-900 flex items-center justify-center relative">
                {site.unesco && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>UNESCO</span>
                  </div>
                )}
                <MapPin className="h-20 w-20 text-gold-600 dark:text-gold-400" />
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {site.name}
                  </h3>
                  <p className="text-gold-600 dark:text-gold-400 font-medium mb-3">
                    {site.subtitle}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {site.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Points d'intérêt :
                  </h4>
                  <ul className="space-y-1">
                    {site.highlights.map((highlight, highlightIndex) => (
                      <li key={highlightIndex} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Calendar className="h-4 w-4 text-secondary-600" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Période</span>
                    </div>
                    <p className="text-xs text-secondary-600 dark:text-secondary-400 font-bold">
                      {site.bestTime}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Users className="h-4 w-4 text-primary-600" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Durée</span>
                    </div>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-bold">
                      {site.duration}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Star className="h-4 w-4 text-gold-600" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Niveau</span>
                    </div>
                    <p className="text-xs text-gold-600 dark:text-gold-400 font-bold">
                      {site.difficulty}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/culture/${site.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="btn-primary w-full text-center inline-flex items-center justify-center space-x-2"
                >
                  <span>Découvrir {site.name}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Festivals culturels */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Festivals Culturels
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {festivals.map((festival, index) => (
              <motion.div
                key={festival.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center"
              >
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {festival.name}
                  </h4>
                  <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                    {festival.location} • {festival.date}
                  </p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {festival.description}
                </p>
                <div className="space-y-1">
                  {festival.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="text-xs text-gray-500 dark:text-gray-500">
                      • {highlight}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Informations pratiques */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-8"
        >
          <div className="card p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Conseils de Voyage
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Meilleure période
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Novembre à Mars (saison sèche) pour des conditions optimales de visite.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Transport
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vols internes disponibles, routes en bon état, guides locaux recommandés.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Hébergement
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hôtels, auberges et campements traditionnels disponibles dans toutes les régions.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Informations Utiles
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Visa et documents
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Visa requis pour la plupart des nationalités. Passeport valide 6 mois minimum.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Santé et sécurité
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vaccinations recommandées, assurance voyage obligatoire, respect des consignes locales.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Monnaie
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Franc CFA (XOF). Cartes de crédit acceptées dans les grandes villes.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
