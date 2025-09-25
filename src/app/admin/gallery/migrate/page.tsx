'use client'

import { useState, useEffect } from 'react'
import AuthGuard from '@/components/admin/AuthGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/ui/Toast'
import ToastContainer from '@/components/ui/ToastContainer'
import { 
  Database, 
  Cloud, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  FileImage,
  FileText
} from 'lucide-react'

interface MigrationStats {
  images: {
    local: number
    blob: number
    total: number
  }
  documents: {
    base64: number
    blob: number
    total: number
  }
}

interface MigrationResult {
  migratedCount: number
  errorCount: number
  errors: string[]
  totalErrors: number
}

export default function GalleryMigratePage() {
  const [stats, setStats] = useState<MigrationStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null)
  const { toasts, showSuccess, showError, showWarning, removeToast } = useToast()

  const loadStats = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/gallery/migrate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats(data.data)
        } else {
          showError('Erreur', data.error || 'Impossible de charger les statistiques')
        }
      } else {
        showError('Erreur', 'Impossible de charger les statistiques')
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
      showError('Erreur de connexion', 'Impossible de se connecter au serveur')
    } finally {
      setLoading(false)
    }
  }

  const runMigration = async (migrateType: 'images' | 'documents' | 'all') => {
    setMigrating(true)
    setMigrationResult(null)
    
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/gallery/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ migrateType })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMigrationResult(data.data)
          showSuccess('Migration terminée', data.message)
          loadStats() // Recharger les statistiques
        } else {
          showError('Erreur de migration', data.error || 'Erreur lors de la migration')
        }
      } else {
        const errorData = await response.json()
        showError('Erreur de migration', errorData.error || 'Erreur lors de la migration')
      }
    } catch (error) {
      console.error('Erreur lors de la migration:', error)
      showError('Erreur de connexion', 'Impossible de se connecter au serveur')
    } finally {
      setMigrating(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout 
        title="Migration vers Blob Storage" 
        description="Migrez vos anciennes images et documents vers Vercel Blob Storage"
      >
        <div className="space-y-6">
          {/* Statistiques actuelles */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Images */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileImage className="w-5 h-5 mr-2 text-blue-600" />
                    Images
                  </h3>
                  <div className="text-sm text-gray-500">
                    {stats.images.total} total
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Database className="w-4 h-4 mr-2 text-orange-500" />
                      <span className="text-sm font-medium">Stockage local</span>
                    </div>
                    <span className="text-lg font-bold text-orange-600">
                      {stats.images.local}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Cloud className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm font-medium">Blob Storage</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {stats.images.blob}
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Documents
                  </h3>
                  <div className="text-sm text-gray-500">
                    {stats.documents.total} total
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Database className="w-4 h-4 mr-2 text-orange-500" />
                      <span className="text-sm font-medium">Base64</span>
                    </div>
                    <span className="text-lg font-bold text-orange-600">
                      {stats.documents.base64}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Cloud className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm font-medium">Blob Storage</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {stats.documents.blob}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions de migration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actions de migration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => runMigration('images')}
                disabled={migrating || !stats?.images.local}
                className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Upload className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-blue-900">Migrer les images</div>
                  <div className="text-sm text-blue-600">
                    {stats?.images.local || 0} images locales
                  </div>
                </div>
              </button>

              <button
                onClick={() => runMigration('documents')}
                disabled={migrating || !stats?.documents.base64}
                className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Upload className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium text-purple-900">Migrer les documents</div>
                  <div className="text-sm text-purple-600">
                    {stats?.documents.base64 || 0} documents base64
                  </div>
                </div>
              </button>

              <button
                onClick={() => runMigration('all')}
                disabled={migrating || (!stats?.images.local && !stats?.documents.base64)}
                className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Upload className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-green-900">Tout migrer</div>
                  <div className="text-sm text-green-600">
                    Images + Documents
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={loadStats}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>
          </div>

          {/* Résultats de migration */}
          {migrationResult && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Résultats de la migration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">Fichiers migrés</div>
                    <div className="text-2xl font-bold text-green-600">
                      {migrationResult.migratedCount}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium text-red-900">Erreurs</div>
                    <div className="text-2xl font-bold text-red-600">
                      {migrationResult.errorCount}
                    </div>
                  </div>
                </div>
              </div>

              {migrationResult.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Erreurs rencontrées ({migrationResult.totalErrors} total)
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {migrationResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                      </div>
                    ))}
                    {migrationResult.totalErrors > migrationResult.errors.length && (
                      <div className="text-sm text-gray-500 italic">
                        ... et {migrationResult.totalErrors - migrationResult.errors.length} autres erreurs
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">À propos de la migration</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Cette migration transfère vos anciennes images et documents vers Vercel Blob Storage 
                  pour améliorer les performances et la gestion des fichiers. Les anciens fichiers 
                  restent accessibles pendant la transition.
                </p>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer toasts={toasts} onClose={removeToast} />
      </AdminLayout>
    </AuthGuard>
  )
}
