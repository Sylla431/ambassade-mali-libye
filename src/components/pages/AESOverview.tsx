'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Users, 
  Globe, 
  Calendar, 
  MapPin, 
  Target,
  Hand,
  TrendingUp,
  Award,
  FileText,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

const memberCountries = [
  {
    name: 'Mali',
    flag: '🇲🇱',
    capital: 'Bamako',
    population: '21,9 millions',
    area: '1,24 million km²',
    joined: '2023',
    role: 'Membre fondateur'
  },
  {
    name: 'Burkina Faso',
    flag: '🇧🇫',
    capital: 'Ouagadougou',
    population: '22,1 millions',
    area: '274 200 km²',
    joined: '2023',
    role: 'Membre fondateur'
  },
  {
    name: 'Niger',
    flag: '🇳🇪',
    capital: 'Niamey',
    population: '25,1 millions',
    area: '1,27 million km²',
    joined: '2023',
    role: 'Membre fondateur'
  }
]

const timeline = [
  {
    date: new Date('2023-09-16'),
    title: 'Création de l\'AES',
    description: 'Signature de la Charte constitutive de l\'Alliance des États du Sahel par le Mali, le Burkina Faso et le Niger',
    type: 'foundation',
    details: [
      'Signature de la Charte constitutive',
      'Définition des objectifs communs',
      'Mise en place des structures de gouvernance'
    ]
  },
  {
    date: new Date('2023-10-15'),
    title: 'Premier Sommet de l\'AES',
    description: 'Premier sommet des chefs d\'État de l\'Alliance des États du Sahel à Bamako',
    type: 'summit',
    details: [
      'Adoption des statuts de l\'AES',
      'Nomination du Secrétaire général',
      'Définition des priorités stratégiques'
    ]
  },
  {
    date: new Date('2023-11-20'),
    title: 'Accord de Défense Mutuelle',
    description: 'Signature de l\'accord de défense mutuelle entre les trois pays membres',
    type: 'defense',
    details: [
      'Pacte de défense collective',
      'Coopération militaire renforcée',
      'Partage de renseignements'
    ]
  },
  {
    date: new Date('2024-01-15'),
    title: 'Accord Économique et Monétaire',
    description: 'Signature de l\'accord pour la création d\'une monnaie commune',
    type: 'economic',
    details: [
      'Projet de monnaie commune',
      'Harmonisation des politiques économiques',
      'Libre circulation des biens et services'
    ]
  },
  {
    date: new Date('2024-03-10'),
    title: 'Coopération Énergétique',
    description: 'Accord de coopération dans le domaine de l\'énergie et des infrastructures',
    type: 'energy',
    details: [
      'Interconnexion des réseaux électriques',
      'Développement des énergies renouvelables',
      'Infrastructures de transport communes'
    ]
  },
  {
    date: new Date('2024-06-15'),
    title: 'Sommet de Niamey',
    description: 'Sommet extraordinaire sur la sécurité et le développement',
    type: 'summit',
    details: [
      'Renforcement de la coopération sécuritaire',
      'Stratégies de développement commun',
      'Partenariats internationaux'
    ]
  },
  {
    date: new Date('2024-09-20'),
    title: 'Accord de Libre Circulation',
    description: 'Mise en place de la libre circulation des personnes entre les pays membres',
    type: 'mobility',
    details: [
      'Suppression des visas entre pays membres',
      'Harmonisation des documents d\'identité',
      'Facilitation des échanges commerciaux'
    ]
  },
  {
    date: new Date('2024-12-10'),
    title: 'Sommet de Ouagadougou',
    description: 'Sommet sur l\'intégration économique et la monnaie commune',
    type: 'summit',
    details: [
      'Feuille de route pour la monnaie commune',
      'Harmonisation des politiques fiscales',
      'Création d\'une banque centrale commune'
    ]
  }
]

const objectives = [
  {
    icon: Shield,
    title: 'Sécurité Collective',
    description: 'Renforcer la sécurité et la stabilité dans la région du Sahel',
    details: [
      'Coopération militaire renforcée',
      'Partage de renseignements',
      'Opérations conjointes contre le terrorisme',
      'Formation des forces de sécurité'
    ]
  },
  {
    icon: TrendingUp,
    title: 'Développement Économique',
    description: 'Promouvoir le développement économique et l\'intégration régionale',
    details: [
      'Libre circulation des biens et services',
      'Harmonisation des politiques économiques',
      'Développement des infrastructures communes',
      'Promotion des investissements'
    ]
  },
  {
    icon: Users,
    title: 'Intégration Sociale',
    description: 'Favoriser l\'intégration sociale et culturelle entre les peuples',
    details: [
      'Libre circulation des personnes',
      'Échanges culturels et éducatifs',
      'Harmonisation des systèmes éducatifs',
      'Coopération dans le domaine de la santé'
    ]
  },
  {
    icon: Globe,
    title: 'Souveraineté Collective',
    description: 'Affirmer la souveraineté collective face aux défis internationaux',
    details: [
      'Position commune sur les questions internationales',
      'Coopération diplomatique renforcée',
      'Défense des intérêts communs',
      'Partenariats stratégiques'
    ]
  }
]

const achievements = [
  {
    icon: CheckCircle,
    title: 'Sécurité Renforcée',
    description: 'Réduction significative des attaques terroristes grâce à la coopération militaire',
    percentage: '60%'
  },
  {
    icon: TrendingUp,
    title: 'Échanges Commerciaux',
    description: 'Augmentation des échanges commerciaux entre les pays membres',
    percentage: '45%'
  },
  {
    icon: Users,
    title: 'Mobilité des Personnes',
    description: 'Facilitation de la circulation des personnes entre les pays',
    percentage: '80%'
  },
  {
    icon: Award,
    title: 'Reconnaissance Internationale',
    description: 'Reconnaissance de l\'AES comme acteur régional important',
    percentage: '100%'
  }
]

const documents = [
  {
    title: 'Charte Constitutive de l\'AES',
    description: 'Document fondateur de l\'Alliance des États du Sahel',
    file: '/documents/aes-charte-constitutive.pdf',
    type: 'pdf'
  },
  {
    title: 'Accord de Défense Mutuelle',
    description: 'Pacte de défense collective entre les pays membres',
    file: '/documents/aes-accord-defense.pdf',
    type: 'pdf'
  },
  {
    title: 'Accord Économique et Monétaire',
    description: 'Accord pour la création d\'une monnaie commune',
    file: '/documents/aes-accord-economique.pdf',
    type: 'pdf'
  },
  {
    title: 'Statuts de l\'AES',
    description: 'Statuts et règlements de l\'Alliance des États du Sahel',
    file: '/documents/aes-statuts.pdf',
    type: 'pdf'
  }
]

function AESOverview() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container-custom">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Alliance des États du <span className="bg-mali-gradient bg-clip-text text-transparent">Sahel</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
            L'Alliance des États du Sahel (AES) est une organisation régionale créée en 2023 
            par le Mali, le Burkina Faso et le Niger pour renforcer leur coopération dans 
            les domaines de la sécurité, du développement et de l'intégration régionale.
          </p>
        </motion.div>

        {/* Pays membres */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pays Membres
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Trois pays unis par une vision commune de développement et de sécurité.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {memberCountries.map((country, index) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-mali p-6 text-center"
              >
                <div className="text-6xl mb-4">{country.flag}</div>
                <h3 className="text-2xl font-bold text-mali-green-800 dark:text-mali-green-200 mb-2">
                  {country.name}
                </h3>
                <p className="text-mali-gold-600 dark:text-mali-gold-400 font-semibold mb-4">
                  {country.role}
                </p>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Capitale : {country.capital}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Population : {country.population}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>Superficie : {country.area}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Membre depuis : {country.joined}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Objectifs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Objectifs de l'AES
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Quatre piliers fondamentaux pour le développement et la sécurité de la région.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {objectives.map((objective, index) => (
              <motion.div
                key={objective.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-mali-green-100 dark:bg-mali-green-900 rounded-lg">
                    <objective.icon className="h-8 w-8 text-mali-green-600 dark:text-mali-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {objective.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {objective.description}
                </p>
                <ul className="space-y-2">
                  {objective.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-mali-green-600" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Chronologie */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Chronologie de l'AES
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Les étapes importantes de la création et du développement de l'Alliance des États du Sahel.
            </p>
          </div>

          <div className="relative">
            {/* Ligne de temps */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-mali-green-200 dark:bg-mali-green-800"></div>
            
            <div className="space-y-12">
              {timeline.map((event, index) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex items-start space-x-8"
                >
                  {/* Point sur la ligne de temps */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      event.type === 'foundation' ? 'bg-mali-gold-600' :
                      event.type === 'summit' ? 'bg-mali-green-600' :
                      event.type === 'defense' ? 'bg-mali-red-600' :
                      event.type === 'economic' ? 'bg-blue-600' :
                      event.type === 'energy' ? 'bg-yellow-600' :
                      'bg-purple-600'
                    }`}>
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Contenu de l'événement */}
                  <div className="flex-1 card p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.type === 'foundation' ? 'bg-mali-gold-100 text-mali-gold-800 dark:bg-mali-gold-900 dark:text-mali-gold-200' :
                        event.type === 'summit' ? 'bg-mali-green-100 text-mali-green-800 dark:bg-mali-green-900 dark:text-mali-green-200' :
                        event.type === 'defense' ? 'bg-mali-red-100 text-mali-red-800 dark:bg-mali-red-900 dark:text-mali-red-200' :
                        event.type === 'economic' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        event.type === 'energy' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {format(event.date, 'dd MMMM yyyy')}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {event.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {event.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <ArrowRight className="h-3 w-3 text-mali-green-600" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Réalisations */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Réalisations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Les premiers résultats concrets de la coopération au sein de l'AES.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-mali p-6 text-center"
              >
                <div className="relative mb-4">
                  <achievement.icon className="h-12 w-12 text-mali-green-600 mx-auto mb-2" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-mali-gold-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{achievement.percentage}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-mali-green-800 dark:text-mali-green-200 mb-2">
                  {achievement.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Documents officiels */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Documents Officiels
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Téléchargez les documents officiels de l'Alliance des États du Sahel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-mali-red-100 dark:bg-mali-red-900 rounded-lg">
                    <FileText className="h-8 w-8 text-mali-red-600 dark:text-mali-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {doc.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {doc.description}
                    </p>
                    <button className="btn-primary inline-flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Télécharger</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <div className="card-mali p-8">
            <h2 className="text-3xl font-bold text-mali-green-800 dark:text-mali-green-200 mb-4">
              L'AES : Une Alliance d'Avenir
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              L'Alliance des États du Sahel représente un nouveau modèle de coopération régionale, 
              fondé sur la solidarité, la souveraineté et le développement partagé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/evenements"
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Voir les Événements AES</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="btn-secondary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Nous Contacter</span>
                <Hand className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AESOverview
