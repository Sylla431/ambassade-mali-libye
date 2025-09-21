'use client'

import { motion } from 'framer-motion'
import { FileText, Calendar, User, ArrowRight, Tag } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

const articles = [
  {
    id: 1,
    title: 'Coopération Mali-Libye : Renforcement des Relations Diplomatiques',
    excerpt: 'Les relations entre le Mali et la Libye continuent de se renforcer avec de nouveaux accords de coopération signés cette année.',
    image: '/images/articles/cooperation-mali-libye.jpg',
    author: 'Service de Communication',
    date: new Date('2025-01-15'),
    category: 'Diplomatie',
    readTime: '5 min',
    featured: true
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
    featured: false
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
    featured: false
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
    featured: false
  }
]

const categories = [
  { name: 'Diplomatie', count: 12, color: 'bg-mali-green-100 text-mali-green-800 dark:bg-mali-green-900 dark:text-mali-green-200' },
  { name: 'Services', count: 8, color: 'bg-mali-gold-100 text-mali-gold-800 dark:bg-mali-gold-900 dark:text-mali-gold-200' },
  { name: 'Culture', count: 15, color: 'bg-mali-red-100 text-mali-red-800 dark:bg-mali-red-900 dark:text-mali-red-200' },
  { name: 'Économie', count: 6, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { name: 'Actualités', count: 20, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { name: 'Événements', count: 10, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' }
]

export default function Articles() {
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
            Articles de l'Ambassade
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez les dernières actualités, analyses et informations importantes 
            concernant les relations Mali-Libye et les services de l'ambassade.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Articles principaux */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-8">
              {articles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${categories.find(c => c.name === article.category)?.color || 'bg-gray-100 text-gray-800'}`}>
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
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                href="/articles"
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Voir tous les articles</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>

          {/* Sidebar avec catégories */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <Tag className="h-5 w-5 text-mali-green-600" />
                <span>Catégories</span>
              </h3>
              
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <Link
                    key={category.name}
                    href={`/articles?category=${category.name.toLowerCase()}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-mali-green-600 dark:group-hover:text-mali-green-400 transition-colors">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Articles populaires */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="card p-6 mt-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Articles Populaires
              </h3>
              
              <div className="space-y-4">
                {articles.slice(0, 3).map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>{format(article.date, 'dd MMM')}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
