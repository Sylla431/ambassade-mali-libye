'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'

export default function ArticlesListTest() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log('🔄 Fetching articles...')
        const response = await api.get('/articles?page=1&limit=6&published=true')
        console.log('📄 Response:', response)
        
        if (response.success) {
          setArticles(response.data.data)
          console.log('✅ Articles set:', response.data.data.length)
        } else {
          setError(response.message)
        }
      } catch (err) {
        console.error('❌ Error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (loading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error}</div>

  return (
    <div>
      <h1>Test Articles ({articles.length})</h1>
      {articles.map(article => (
        <div key={article.id}>
          <h3>{article.title}</h3>
          <p>Catégorie: {article.category?.name || 'Aucune'}</p>
        </div>
      ))}
    </div>
  )
}
