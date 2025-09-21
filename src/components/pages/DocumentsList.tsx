'use client'

import { motion } from 'framer-motion'
import { FileText, Download, Calendar, User, Filter, Search, File, FileImage, FileVideo } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'

const documents = [
  {
    id: 1,
    title: 'Formulaire de Demande de Passeport',
    description: 'Formulaire officiel pour la demande de passeport malien. Veuillez remplir tous les champs obligatoires.',
    file: '/documents/formulaire-passeport.pdf',
    type: 'pdf',
    size: '2.3 MB',
    category: 'Formulaires',
    date: new Date('2025-01-15'),
    author: 'Service Consulaire',
    downloads: 1250,
    featured: true
  },
  {
    id: 2,
    title: 'Guide des Services Consulaires',
    description: 'Guide complet des services consulaires disponibles à l\'ambassade avec toutes les procédures et tarifs.',
    file: '/documents/guide-services-consulaires.pdf',
    type: 'pdf',
    size: '5.7 MB',
    category: 'Guides',
    date: new Date('2025-01-10'),
    author: 'Service Consulaire',
    downloads: 890,
    featured: false
  },
  {
    id: 3,
    title: 'Convention de Coopération Mali-Libye',
    description: 'Texte intégral de la convention de coopération entre la République du Mali et l\'État de Libye.',
    file: '/documents/convention-cooperation-mali-libye.pdf',
    type: 'pdf',
    size: '1.8 MB',
    category: 'Accords',
    date: new Date('2024-12-20'),
    author: 'Service Diplomatique',
    downloads: 456,
    featured: false
  },
  {
    id: 4,
    title: 'Formulaire de Demande de Visa',
    description: 'Formulaire pour la demande de visa d\'entrée au Mali pour les ressortissants libyens.',
    file: '/documents/formulaire-visa.pdf',
    type: 'pdf',
    size: '1.5 MB',
    category: 'Formulaires',
    date: new Date('2024-12-15'),
    author: 'Service Consulaire',
    downloads: 2100,
    featured: true
  },
  {
    id: 5,
    title: 'Rapport Annuel 2024',
    description: 'Rapport annuel des activités de l\'ambassade du Mali en Libye pour l\'année 2024.',
    file: '/documents/rapport-annuel-2024.pdf',
    type: 'pdf',
    size: '8.2 MB',
    category: 'Rapports',
    date: new Date('2024-12-31'),
    author: 'Ambassade',
    downloads: 234,
    featured: false
  },
  {
    id: 6,
    title: 'Liste des Documents Requis - Services Consulaires',
    description: 'Liste détaillée des documents requis pour chaque service consulaire.',
    file: '/documents/liste-documents-requis.pdf',
    type: 'pdf',
    size: '1.2 MB',
    category: 'Guides',
    date: new Date('2024-11-30'),
    author: 'Service Consulaire',
    downloads: 1780,
    featured: false
  },
  {
    id: 7,
    title: 'Accord de Coopération Économique',
    description: 'Accord de coopération économique entre le Mali et la Libye signé en 2024.',
    file: '/documents/accord-cooperation-economique.pdf',
    type: 'pdf',
    size: '3.1 MB',
    category: 'Accords',
    date: new Date('2024-11-15'),
    author: 'Service Économique',
    downloads: 567,
    featured: false
  },
  {
    id: 8,
    title: 'Tarifs des Services Consulaires 2025',
    description: 'Grille tarifaire mise à jour des services consulaires pour l\'année 2025.',
    file: '/documents/tarifs-services-2025.pdf',
    type: 'pdf',
    size: '0.8 MB',
    category: 'Tarifs',
    date: new Date('2025-01-01'),
    author: 'Service Consulaire',
    downloads: 1450,
    featured: true
  }
]

const categories = [
  { name: 'Tous', count: documents.length },
  { name: 'Formulaires', count: documents.filter(d => d.category === 'Formulaires').length },
  { name: 'Guides', count: documents.filter(d => d.category === 'Guides').length },
  { name: 'Accords', count: documents.filter(d => d.category === 'Accords').length },
  { name: 'Rapports', count: documents.filter(d => d.category === 'Rapports').length },
  { name: 'Tarifs', count: documents.filter(d => d.category === 'Tarifs').length }
]

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-8 w-8 text-red-600" />
    case 'doc':
    case 'docx':
      return <File className="h-8 w-8 text-blue-600" />
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <FileImage className="h-8 w-8 text-green-600" />
    case 'mp4':
    case 'avi':
      return <FileVideo className="h-8 w-8 text-purple-600" />
    default:
      return <File className="h-8 w-8 text-gray-600" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Formulaires':
      return 'bg-mali-green-100 text-mali-green-800 dark:bg-mali-green-900 dark:text-mali-green-200'
    case 'Guides':
      return 'bg-mali-gold-100 text-mali-gold-800 dark:bg-mali-gold-900 dark:text-mali-gold-200'
    case 'Accords':
      return 'bg-mali-red-100 text-mali-red-800 dark:bg-mali-red-900 dark:text-mali-red-200'
    case 'Rapports':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Tarifs':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export default function DocumentsList() {
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'Tous' || doc.category === selectedCategory
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDownload = (document: any) => {
    // Simulation du téléchargement
    const link = document.createElement('a')
    link.href = document.file
    link.download = document.title
    link.click()
  }

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
            Documents Officiels
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Téléchargez les documents officiels, formulaires, guides et publications de l'Ambassade du Mali en Libye.
          </p>
        </motion.div>

        {/* Barre de recherche et filtres */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Recherche */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mali-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Filtres par catégorie */}
            <div className="flex flex-wrap gap-2">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-mali-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-mali-green-100 dark:hover:bg-mali-green-900'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredDocuments.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                {/* Icône du fichier */}
                <div className="flex-shrink-0">
                  {getFileIcon(document.type)}
                </div>

                {/* Contenu du document */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                      {document.title}
                    </h3>
                    {document.featured && (
                      <span className="ml-2 bg-mali-gold-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        Important
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {document.description}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(document.date, 'dd MMM yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{document.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>{document.downloads} téléchargements</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(document.category)}`}>
                        {document.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {document.size}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDownload(document)}
                      className="btn-primary inline-flex items-center space-x-2 px-4 py-2 text-sm"
                    >
                      <Download className="h-4 w-4" />
                      <span>Télécharger</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun document trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Essayez de modifier vos critères de recherche.
            </p>
          </motion.div>
        )}

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid md:grid-cols-3 gap-8"
        >
          <div className="card-mali p-6 text-center">
            <FileText className="h-12 w-12 text-mali-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-mali-green-800 dark:text-mali-green-200">
              {documents.length}
            </h3>
            <p className="text-mali-gold-700 dark:text-mali-gold-300">Documents Disponibles</p>
          </div>
          <div className="card-mali p-6 text-center">
            <Download className="h-12 w-12 text-mali-gold-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-mali-green-800 dark:text-mali-green-200">
              {documents.reduce((sum, doc) => sum + doc.downloads, 0).toLocaleString()}
            </h3>
            <p className="text-mali-gold-700 dark:text-mali-gold-300">Téléchargements Totaux</p>
          </div>
          <div className="card-mali p-6 text-center">
            <Calendar className="h-12 w-12 text-mali-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-mali-green-800 dark:text-mali-green-200">
              {categories.length - 1}
            </h3>
            <p className="text-mali-gold-700 dark:text-mali-gold-300">Catégories</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
