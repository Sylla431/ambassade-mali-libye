'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mali-green-50 via-mali-gold-50 to-mali-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-mali-gradient bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl font-bold text-mali-green-800 dark:text-mali-green-200 mb-4">
            Page non trouvée
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Retour à l'accueil</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Page précédente</span>
          </button>
        </div>
      </div>
    </div>
  )
}
