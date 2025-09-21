'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/admin/AuthGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  BarChart3,
  Calendar
} from 'lucide-react'

interface Announcement {
  id: string
  title: string
  titleAr?: string
  content: string
  contentAr?: string
  type: 'INFO' | 'WARNING' | 'URGENT'
  published: boolean
  featured: boolean
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
  author: {
    name: string
  }
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'draft'>('all')
  const [filterType, setFilterType] = useState<'all' | 'INFO' | 'WARNING' | 'URGENT'>('all')
  const router = useRouter()

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch('/api/announcements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.data?.data || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = async (announcementId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          published: !currentStatus
        })
      })

      if (response.ok) {
        loadAnnouncements()
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const deleteAnnouncement = async (announcementId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        loadAnnouncements()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'URGENT':
        return 'bg-red-100 text-red-800'
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800'
      case 'INFO':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'URGENT':
        return 'Urgent'
      case 'WARNING':
        return 'Attention'
      case 'INFO':
        return 'Information'
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (announcement.titleAr && announcement.titleAr.includes(searchTerm))
    
    const matchesPublished = 
      filterPublished === 'all' || 
      (filterPublished === 'published' && announcement.published) ||
      (filterPublished === 'draft' && !announcement.published)
    
    const matchesType = filterType === 'all' || announcement.type === filterType
    
    return matchesSearch && matchesPublished && matchesType
  })

  if (loading) {
    return (
      <AuthGuard>
        <AdminLayout title="Gestion des annonces">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des annonces...</p>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout 
        title="Gestion des annonces" 
        description="Créez et gérez les annonces importantes"
      >
        <div className="space-y-6">
          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={() => router.push('/admin/announcements/new')}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle annonce</span>
            </button>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher une annonce..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={filterPublished}
                  onChange={(e) => setFilterPublished(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">Toutes les annonces</option>
                  <option value="published">Publiées</option>
                  <option value="draft">Brouillons</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">Tous les types</option>
                  <option value="INFO">Information</option>
                  <option value="WARNING">Attention</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Liste des annonces */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Annonces ({filteredAnnouncements.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {announcement.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(announcement.type)}`}>
                            {getTypeText(announcement.type)}
                          </span>
                          {announcement.featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              En vedette
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            announcement.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {announcement.published ? 'Publiée' : 'Brouillon'}
                          </span>
                        </div>
                        {announcement.titleAr && (
                          <p className="text-sm text-gray-600 mt-1" dir="rtl">
                            {announcement.titleAr}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {announcement.content}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(announcement.createdAt)}
                          </span>
                          <span>Par {announcement.author.name}</span>
                          {announcement.startDate && (
                            <span>Du {formatDate(announcement.startDate)}</span>
                          )}
                          {announcement.endDate && (
                            <span>Au {formatDate(announcement.endDate)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => togglePublished(announcement.id, announcement.published)}
                          className={`p-2 rounded-lg ${
                            announcement.published 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={announcement.published ? 'Dépublier' : 'Publier'}
                        >
                          {announcement.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => router.push(`/admin/announcements/${announcement.id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Aucune annonce trouvée
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}