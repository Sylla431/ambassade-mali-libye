'use client'

import { useState, useEffect } from 'react'

export default function ArticlesListSimple() {
  const [status, setStatus] = useState('Initialisation...')

  useEffect(() => {
    const testApi = async () => {
      try {
        setStatus('Test de l\'API...')
        const response = await fetch('/api/articles?page=1&limit=6&published=true')
        const data = await response.json()
        
        if (data.success) {
          setStatus(`✅ API fonctionne - ${data.data.data.length} articles trouvés`)
        } else {
          setStatus(`❌ Erreur API: ${data.error}`)
        }
      } catch (error) {
        setStatus(`❌ Erreur: ${error.message}`)
      }
    }

    testApi()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test Simple des Articles</h1>
      <p>Status: {status}</p>
    </div>
  )
}
