'use client'

import { useState, useEffect } from 'react'

export default function TestArticles() {
  const [status, setStatus] = useState('Initialisation...')
  const [articles, setArticles] = useState<any[]>([])

  useEffect(() => {
    const testApi = async () => {
      try {
        setStatus('Test de l\'API...')
        
        // Test sans authentification
        const response = await fetch('/api/articles?page=1&limit=5')
        const data = await response.json()
        
        console.log('Réponse complète:', data)
        
        if (data.success) {
          setStatus(`✅ API fonctionne - ${data.data.articles.length} articles trouvés`)
          setArticles(data.data.articles)
        } else {
          setStatus(`❌ Erreur API: ${data.error}`)
        }
      } catch (error) {
        setStatus(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
        console.error('Erreur détaillée:', error)
      }
    }

    testApi()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test des Articles</h1>
      <p>Status: {status}</p>
      
      {articles.length > 0 && (
        <div>
          <h2>Articles trouvés:</h2>
          <ul>
            {articles.map((article, index) => (
              <li key={index}>
                <strong>{article.title}</strong> - {article.published ? 'Publié' : 'Brouillon'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
