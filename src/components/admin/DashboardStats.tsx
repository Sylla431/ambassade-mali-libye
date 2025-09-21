'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Calendar, 
  MessageSquare, 
  FolderOpen, 
  Megaphone,
  TrendingUp,
  Users,
  Eye,
  Clock,
  CheckCircle
} from 'lucide-react'
import api from '@/lib/api'

interface Stats {
  articles: {
    total: number
    published: number
    draft: number
    featured: number
  }
  events: {
    total: number
    upcoming: number
    past: number
  }
  messages: {
    total: number
    unread: number
    thisMonth: number
  }
  documents: {
    total: number
    public: number
    private: number
  }
  announcements: {
    total: number
    active: number
  }
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      // Simuler le chargement des statistiques
      // En réalité, vous devriez créer une API endpoint pour les stats
      const mockStats: Stats = {
        articles: {
          total: 24,
          published: 18,
          draft: 6,
          featured: 3
        },
        events: {
          total: 8,
          upcoming: 3,
          past: 5
        },
        messages: {
          total: 156,
          unread: 12,
          thisMonth: 23
        },
        documents: {
          total: 45,
          public: 32,
          private: 13
        },
        announcements: {
          total: 7,
          active: 4
        }
      }
      
      setStats(mockStats)
    } catch (err) {
      setError('Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Articles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Articles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.articles.total}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            {stats.articles.published} publiés
          </div>
        </div>

        {/* Événements */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Événements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.events.total}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 text-blue-500 mr-1" />
            {stats.events.upcoming} à venir
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.messages.total}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Eye className="h-4 w-4 text-orange-500 mr-1" />
            {stats.messages.unread} non lus
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.documents.total}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 text-green-500 mr-1" />
            {stats.documents.public} publics
          </div>
        </div>
      </div>

      {/* Détails par section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Articles détaillés */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Articles</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total</span>
              <span className="font-medium">{stats.articles.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Publiés</span>
              <span className="font-medium text-green-600">{stats.articles.published}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Brouillons</span>
              <span className="font-medium text-yellow-600">{stats.articles.draft}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">En vedette</span>
              <span className="font-medium text-purple-600">{stats.articles.featured}</span>
            </div>
          </div>
        </div>

        {/* Messages détaillés */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages de Contact</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total</span>
              <span className="font-medium">{stats.messages.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Non lus</span>
              <span className="font-medium text-red-600">{stats.messages.unread}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ce mois</span>
              <span className="font-medium text-blue-600">{stats.messages.thisMonth}</span>
            </div>
          </div>
        </div>

        {/* Événements détaillés */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Événements</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total</span>
              <span className="font-medium">{stats.events.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">À venir</span>
              <span className="font-medium text-blue-600">{stats.events.upcoming}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Passés</span>
              <span className="font-medium text-gray-600">{stats.events.past}</span>
            </div>
          </div>
        </div>

        {/* Annonces détaillées */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Annonces</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total</span>
              <span className="font-medium">{stats.announcements.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Actives</span>
              <span className="font-medium text-green-600">{stats.announcements.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Inactives</span>
              <span className="font-medium text-gray-600">{stats.announcements.total - stats.announcements.active}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium">Nouvel Article</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium">Nouvel Événement</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Megaphone className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium">Nouvelle Annonce</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageSquare className="h-8 w-8 text-yellow-600 mb-2" />
            <span className="text-sm font-medium">Messages</span>
          </button>
        </div>
      </div>
    </div>
  )
}
