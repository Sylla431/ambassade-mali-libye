'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/admin/AuthGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Upload, 
  BarChart3,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface DashboardStats {
  articles: number
  events: number
  visaApplications: number
  contactMessages: number
  documents: number
  announcements: number
}

interface RecentActivity {
  id: string
  type: 'article' | 'event' | 'visa' | 'contact' | 'document'
  title: string
  date: string
  status?: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      
      // Charger les statistiques
      const [articlesRes, eventsRes, visaRes, contactRes, documentsRes, announcementsRes] = await Promise.all([
        fetch('/api/articles?limit=1'),
        fetch('/api/events?limit=1'),
        fetch('/api/visa?limit=1'),
        fetch('/api/contact?limit=1'),
        fetch('/api/documents?limit=1'),
        fetch('/api/announcements?limit=1')
      ])

      const [articlesData, eventsData, visaData, contactData, documentsData, announcementsData] = await Promise.all([
        articlesRes.json(),
        eventsRes.json(),
        visaRes.json(),
        contactRes.json(),
        documentsRes.json(),
        announcementsRes.json()
      ])

      setStats({
        articles: articlesData.data?.pagination?.total || 0,
        events: eventsData.data?.pagination?.total || 0,
        visaApplications: visaData.data?.pagination?.total || 0,
        contactMessages: contactData.data?.pagination?.total || 0,
        documents: documentsData.data?.pagination?.total || 0,
        announcements: announcementsData.data?.pagination?.total || 0
      })

      // Charger l'activité récente
      const recentRes = await fetch('/api/articles?limit=5&published=true')
      const recentData = await recentRes.json()
      
      if (recentData.success) {
        setRecentActivity(recentData.data.data.map((article: any) => ({
          id: article.id,
          type: 'article' as const,
          title: article.title,
          date: article.createdAt,
          status: article.published ? 'publié' : 'brouillon'
        })))
      }

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout 
        title="Tableau de bord" 
        description="Vue d'ensemble de l'activité de l'ambassade"
      >
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Articles</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.articles || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Événements</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.events || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Demandes de visa</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.visaApplications || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.contactMessages || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Upload className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.documents || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Annonces</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.announcements || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Actions rapides</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a 
                href="/admin/articles/new"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Nouvel article</span>
              </a>
              <a 
                href="/admin/events/new"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-5 h-5 text-green-600" />
                <span>Nouvel événement</span>
              </a>
              <a 
                href="/admin/documents"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-5 h-5 text-indigo-600" />
                <span>Uploader un document</span>
              </a>
              <a 
                href="/admin/announcements/new"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-red-600" />
                <span>Nouvelle annonce</span>
              </a>
            </div>
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
          </div>
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {activity.type === 'article' && <FileText className="w-4 h-4 text-gray-600" />}
                        {activity.type === 'event' && <Calendar className="w-4 h-4 text-gray-600" />}
                        {activity.type === 'visa' && <Users className="w-4 h-4 text-gray-600" />}
                        {activity.type === 'contact' && <MessageSquare className="w-4 h-4 text-gray-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.date).toLocaleDateString('fr-FR')}
                          {activity.status && ` • ${activity.status}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune activité récente</p>
            )}
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
