'use client'

import { motion } from 'framer-motion'
import { FileText, Calendar, User, ArrowRight, Tag, Search, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import { useArticles } from '@/hooks/useArticles'

const allArticles = [
  {
    id: 1,
    title: 'Coopération Mali-Libye : Renforcement des Relations Diplomatiques',
    excerpt: 'Les relations entre le Mali et la Libye continuent de se renforcer avec de nouveaux accords de coopération signés cette année. Cette collaboration couvre plusieurs domaines stratégiques.',
    image: '/images/articles/cooperation-mali-libye.jpg',
    author: 'Service de Communication',
    date: new Date('2025-01-15'),
    category: 'Diplomatie',
    readTime: '5 min',
    featured: true,
    content: 'Contenu complet de l\'article...'
  },
  {
    id: 2,
    title: 'Services Consulaires : Nouvelles Procédures Simplifiées',
    excerpt: 'L\'ambassade annonce la simplification des procédures pour les services consulaires afin de mieux servir nos ressortissants.',
    image: '/images/articles/services-consulaires.jpg',
    author: 'Service Consulaire',
    date: new Date('2025-01-10'),
    category: 'Services',
    readTime: '3 min',
    featured: false,
    content: 'Contenu complet de l\'article...'
  },
  {
    id: 3,
    title: 'Culture Malienne en Libye : Festival de la Diversité',
    excerpt: 'Le festival de la diversité culturelle malienne a été un succès, mettant en valeur notre riche patrimoine culturel.',
    image: '/images/articles/festival-culture.jpg',
    author: 'Service Culturel',
    date: new Date('2025-01-05'),
    category: 'Culture',
    readTime: '4 min',
    featured: false,
    content: 'Contenu complet de l\'article...'
  },
  {
    id: 4,
    title: 'Économie : Opportunités d\'Investissement au Mali',
    excerpt: 'Découvrez les secteurs porteurs d\'investissement au Mali et les opportunités pour les entreprises libyennes.',
    image: '/images/articles/investissement-mali.jpg',
    author: 'Service Économique',
    date: new Date('2024-12-28'),
    category: 'Économie',
    readTime: '6 min',
    featured: false,
    content: 'Contenu complet de l\'article...'
  },
  {
    id: 5,
    title: 'Sécurité : Renforcement de la Coopération Régionale',
    excerpt: 'Le Mali et la Libye renforcent leur coopération en matière de sécurité et de lutte contre le terrorisme.',
    image: '/images/articles/securite-regionale.jpg',
    author: 'Service de Sécurité',
    date: new Date('2024-12-20'),
    category: 'Sécurité',
    readTime: '7 min',
    featured: false,
    content: 'Contenu complet de l\'article...'
  },
  {
    id: 6,
    title: 'Éducation : Échanges Universitaires Mali-Libye',
    excerpt: 'Nouveaux programmes d\'échanges universitaires entre le Mali et la Libye pour renforcer la coopération éducative.',
    image: '/images/articles/education-echanges.jpg',
    author: 'Service Éducatif',
    date: new Date('2024-12-15'),
    category: 'Éducation',
    readTime: '4 min',
    featured: false,
    content: 'Contenu complet de l\'article...'
  }
]

const categories = [
  { name: 'Tous', count: allArticles.length },
  { name: 'Diplomatie', count: allArticles.filter(a => a.category === 'Diplomatie').length },
  { name: 'Services', count: allArticles.filter(a => a.category === 'Services').length },
  { name: 'Culture', count: allArticles.filter(a => a.category === 'Culture').length },
  { name: 'Économie', count: allArticles.filter(a => a.category === 'Économie').length },
  { name: 'Sécurité', count: allArticles.filter(a => a.category === 'Sécurité').length },
  { name: 'Éducation', count: allArticles.filter(a => a.category === 'Éducation').length }
]

export default function ArticlesList() {
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredArticles = allArticles.filter(article => {
    const matchesCategory = selectedCategory === 'Tous' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
            Articles & Actualités
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez tous les articles, analyses et actualités de l'Ambassade du Mali en Libye.
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
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mali-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Filtres par catégorie */}
            <div className="flex flex-wrap gap-2">
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

        {/* Articles */}
        <div className="grid lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-mali-green-100 to-mali-gold-100 dark:from-mali-green-900 dark:to-mali-gold-900 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[url('/images/articles/cooperation-mali-libye.jpg')] bg-cover bg-center opacity-20"></div>
                <FileText className="h-16 w-16 text-mali-green-600 dark:text-mali-green-400 relative z-10" />
                {article.featured && (
                  <div className="absolute top-4 left-4 bg-mali-gold-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    À la une
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-mali-green-100 dark:bg-mali-green-900 text-mali-green-800 dark:text-mali-green-200 text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {article.readTime}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(article.date, 'dd MMM yyyy')}</span>
                  </div>
                </div>
                
                <Link
                  href={`/articles/${article.id}`}
                  className="inline-flex items-center space-x-1 text-mali-green-600 dark:text-mali-green-400 font-medium text-sm hover:text-mali-green-700 dark:hover:text-mali-green-300 transition-colors"
                >
                  <span>Lire la suite</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun article trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Essayez de modifier vos critères de recherche.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
