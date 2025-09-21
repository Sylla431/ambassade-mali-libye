'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Globe, 
  Shield, 
  Users, 
  Building, 
  Download, 
  ArrowRight,
  Award,
  Target,
  Briefcase,
  MapPin,
  Calendar,
  FileText
} from 'lucide-react'
import Link from 'next/link'

const keyStats = [
  {
    icon: Globe,
    value: '1,24 million km²',
    label: 'Superficie',
    description: 'Vaste territoire avec un potentiel inexploité'
  },
  {
    icon: TrendingUp,
    value: '20,78 milliards USD',
    label: 'PIB',
    description: 'Économie en croissance constante'
  },
  {
    icon: Award,
    value: '1er',
    label: 'Producteur de coton',
    description: 'En Afrique'
  },
  {
    icon: Award,
    value: '2e',
    label: 'Cheptel d\'Afrique de l\'Ouest',
    description: 'Races animales robustes'
  },
  {
    icon: Award,
    value: '3e',
    label: 'Producteur d\'or',
    description: 'Sur le continent africain'
  }
]

const sectors = [
  {
    icon: Building,
    title: 'Agriculture',
    description: 'Potentiel agricole immense avec des terres fertiles et un climat favorable',
    opportunities: ['Cultures vivrières', 'Cultures de rente', 'Agro-industrie', 'Irrigation']
  },
  {
    icon: Users,
    title: 'Élevage',
    description: 'Deuxième cheptel d\'Afrique de l\'Ouest avec des races animales robustes',
    opportunities: ['Élevage bovin', 'Élevage ovin/caprin', 'Aviculture', 'Transformation']
  },
  {
    icon: Award,
    title: 'Mines',
    description: 'Troisième producteur d\'or d\'Afrique avec d\'importantes réserves',
    opportunities: ['Or', 'Bauxite', 'Phosphates', 'Lithium', 'Uranium']
  },
  {
    icon: Building,
    title: 'Infrastructures',
    description: 'Besoins importants en infrastructures de transport et d\'énergie',
    opportunities: ['Routes', 'Chemins de fer', 'Ports', 'Aéroports', 'Énergie']
  },
  {
    icon: Shield,
    title: 'Énergie',
    description: 'Potentiel hydroélectrique et solaire important',
    opportunities: ['Hydroélectricité', 'Énergie solaire', 'Énergie éolienne', 'Biomasse']
  },
  {
    icon: Users,
    title: 'Santé & Éducation',
    description: 'Secteurs prioritaires pour le développement humain',
    opportunities: ['Hôpitaux', 'Écoles', 'Formation professionnelle', 'Recherche']
  }
]

const incentives = [
  {
    icon: Shield,
    title: 'Exonérations fiscales et douanières',
    description: 'Avantages fiscaux importants pour les investisseurs'
  },
  {
    icon: TrendingUp,
    title: 'Réduction de l\'impôt sur les sociétés',
    description: 'Jusqu\'à 25% de réduction sur l\'impôt des sociétés'
  },
  {
    icon: Globe,
    title: 'Liberté de transfert des capitaux',
    description: 'Transfert libre des bénéfices et des capitaux'
  },
  {
    icon: Building,
    title: 'Propriété à 100%',
    description: 'Possibilité de propriété totale pour les investisseurs étrangers'
  },
  {
    icon: MapPin,
    title: 'Zones économiques spéciales',
    description: 'Traitements préférentiels avec exonérations jusqu\'à 30 ans'
  },
  {
    icon: Target,
    title: 'Zones défavorisées',
    description: 'Avantages supplémentaires dans les zones identifiées'
  }
]

const documents = [
  {
    title: 'Investir au Mali API PDF',
    description: 'Guide complet des opportunités d\'investissement',
    file: '/documents/investir-au-mali-api.pdf',
    type: 'pdf'
  },
  {
    title: 'OCI OFFICIAL BOOK - English',
    description: 'Official OCI investment guide in English',
    file: '/documents/oci-official-book-english.pdf',
    type: 'pdf'
  },
  {
    title: 'LIVRE OFFICIEL DE L\'OCI - Français',
    description: 'Guide officiel d\'investissement de l\'OCI en français',
    file: '/documents/oci-officiel-francais.pdf',
    type: 'pdf'
  },
  {
    title: 'LIVRE OFFICIEL DE L\'OCI - Arabe',
    description: 'الدليل الرسمي للاستثمار في منظمة التعاون الإسلامي',
    file: '/documents/oci-officiel-arabe.pdf',
    type: 'pdf'
  }
]

const news = [
  {
    title: 'Investir au Mali',
    date: new Date('2025-06-11'),
    category: 'investissement',
    excerpt: 'Découvrez les dernières opportunités d\'investissement au Mali'
  },
  {
    title: 'List of City Weekend Celebrations',
    date: new Date('2020-07-24'),
    category: 'investissement',
    excerpt: 'Célébrations et événements dans les villes maliennes'
  }
]

function InvestmentOverview() {
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
            Une Terre d'<span className="bg-mali-gradient bg-clip-text text-transparent">Opportunités</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
            Avec une superficie de plus de 1,24 million de km² et un PIB de 20,78 milliards USD, 
            le Mali se positionne comme un partenaire fiable et une terre d'avenir pour les investisseurs.
          </p>
        </motion.div>

        {/* Statistiques clés */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-20"
        >
          {keyStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-mali p-6 text-center"
            >
              <stat.icon className="h-12 w-12 text-mali-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-mali-green-800 dark:text-mali-green-200 mb-2">
                {stat.value}
              </h3>
              <p className="text-mali-gold-700 dark:text-mali-gold-300 font-semibold mb-2">
                {stat.label}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Secteurs porteurs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Des Secteurs Porteurs
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Le Mali est un leader régional dans plusieurs domaines avec un potentiel inexploité important.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectors.map((sector, index) => (
              <motion.div
                key={sector.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-mali-green-100 dark:bg-mali-green-900 rounded-lg">
                    <sector.icon className="h-8 w-8 text-mali-green-600 dark:text-mali-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {sector.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {sector.description}
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-mali-gold-600 dark:text-mali-gold-400">
                    Opportunités :
                  </h4>
                  <ul className="space-y-1">
                    {sector.opportunities.map((opportunity, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                        <ArrowRight className="h-3 w-3 text-mali-green-600" />
                        <span>{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Environnement incitatif */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Environnement Incitatif
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Le Mali dispose de régimes incitatifs très compétitifs pour attirer les investisseurs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {incentives.map((incentive, index) => (
              <motion.div
                key={incentive.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-mali p-6"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-mali-gold-100 dark:bg-mali-gold-900 rounded-lg">
                    <incentive.icon className="h-8 w-8 text-mali-gold-600 dark:text-mali-gold-400" />
                  </div>
                  <h3 className="text-lg font-bold text-mali-green-800 dark:text-mali-green-200">
                    {incentive.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {incentive.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Accompagnement institutionnel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Accompagnement Institutionnel Dédié
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              L'Agence pour la Promotion des Investissements (API-Mali) facilite toutes vos démarches.
            </p>
          </div>

          <div className="card-mali p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-mali-green-800 dark:text-mali-green-200 mb-4">
                  API-Mali : Votre Guichet Unique
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  L'Agence pour la Promotion des Investissements (API-Mali) agit comme guichet unique 
                  pour faciliter toutes les démarches administratives : création d'entreprise, obtention 
                  d'autorisations, agrément au Code des investissements, etc.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Briefcase className="h-5 w-5 text-mali-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">Création d'entreprise</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-mali-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">Obtention d'autorisations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-mali-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">Agrément au Code des investissements</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-mali-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">Suivi personnalisé des projets</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-mali-green-100 to-mali-gold-100 dark:from-mali-green-900 dark:to-mali-gold-900 rounded-full flex items-center justify-center mb-6">
                  <Building className="h-24 w-24 text-mali-green-600 dark:text-mali-green-400" />
                </div>
                <p className="text-mali-gold-700 dark:text-mali-gold-300 font-semibold">
                  Suivi personnalisé à chaque étape
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Documents à télécharger */}
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
              Téléchargez les guides officiels d'investissement au Mali.
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
                      <Download className="h-4 w-4" />
                      <span>Télécharger</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dernières nouvelles */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Dernières Nouvelles
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Restez informé des dernières actualités sur les investissements au Mali.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {news.map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-mali-green-100 dark:bg-mali-green-900 text-mali-green-800 dark:text-mali-green-200 text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{article.date.toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {article.excerpt}
                </p>
                <Link
                  href="#"
                  className="inline-flex items-center space-x-1 text-mali-green-600 dark:text-mali-green-400 font-medium text-sm hover:text-mali-green-700 dark:hover:text-mali-green-300 transition-colors"
                >
                  <span>Continuer à lire</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mt-16"
        >
          <div className="card-mali p-8">
            <h2 className="text-3xl font-bold text-mali-green-800 dark:text-mali-green-200 mb-4">
              Prêt à Investir au Mali ?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Le Mali se positionne aujourd'hui comme un partenaire fiable et une terre d'avenir 
              pour les investisseurs africains et internationaux.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Nous Contacter</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/documents"
                className="btn-secondary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Télécharger les Documents</span>
                <Download className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default InvestmentOverview
