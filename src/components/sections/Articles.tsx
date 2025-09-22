'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Calendar, User, ArrowRight, Tag } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import Image from 'next/image'

interface Article {
  id: number
  title: string
  excerpt: string
  imageUrl?: string
  author: string
  date: string
  category: string
  readTime: string
  featured: boolean
  slug: string
}

interface ArticlesData {
  articles: Article[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

const categories = [
  { name: 'Diplomatie', count: 12, color: 'bg-mali-green-100 text-mali-green-800 dark:bg-mali-green-900 dark:text-mali-green-200' },
  { name: 'Services', count: 8, color: 'bg-mali-gold-100 text-mali-gold-800 dark:bg-mali-gold-900 dark:text-mali-gold-200' },
  { name: 'Culture', count: 15, color: 'bg-mali-red-100 text-mali-red-800 dark:bg-mali-red-900 dark:text-mali-red-200' },
  { name: 'Économie', count: 6, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { name: 'Actualités', count: 20, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { name: 'Événements', count: 10, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' }
]

export default function Articles() {
  const [data, setData] = useState<ArticlesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/articles/diplomatic-activities?limit=4')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setData(result.data)
        } else {
          setError('Erreur lors du chargement des articles')
        }
      } else {
        setError('Erreur lors du chargement des articles')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des articles...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error || !data) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Articles de l'Ambassade
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={loadArticles}
              className="btn-primary"
            >
              Réessayer
            </button>
          </div>
        </div>
      </section>
    )
  }

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
            Activités Diplomatiques
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez les dernières activités diplomatiques, rencontres officielles et 
            développements dans les relations Mali-Libye.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Articles principaux */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-8">
              {data.articles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 relative overflow-hidden">
                    {article.imageUrl ? (
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-mali-green-100 to-mali-gold-100 dark:from-mali-green-900 dark:to-mali-gold-900 flex items-center justify-center">
                        <FileText className="h-16 w-16 text-mali-green-600 dark:text-mali-green-400" />
                      </div>
                    )}
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
                        <span>{format(new Date(article.date), 'dd MMM yyyy')}</span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/articles/slug/${article.slug}`}
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
                {data.articles.slice(0, 3).map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/articles/slug/${article.slug}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(article.date), 'dd MMM')}</span>
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
