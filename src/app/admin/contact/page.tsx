'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/admin/AuthGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Search,
  Eye,
  Trash2,
  Reply,
  CheckCircle,
  Clock
} from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  read: boolean
  replied: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminContact() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read' | 'replied'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadMessages()
  }, [currentPage, searchTerm, filterStatus])

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/contact?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.data.data)
        setTotalPages(data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          read: true
        })
      })

      if (response.ok) {
        loadMessages()
        if (selectedMessage?.id === messageId) {
          setSelectedMessage({ ...selectedMessage, read: true })
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const markAsReplied = async (messageId: string) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          replied: true
        })
      })

      if (response.ok) {
        loadMessages()
        if (selectedMessage?.id === messageId) {
          setSelectedMessage({ ...selectedMessage, replied: true })
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        loadMessages()
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null)
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
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

  const filteredMessages = messages.filter(message => {
    if (filterStatus === 'unread') return !message.read
    if (filterStatus === 'read') return message.read && !message.replied
    if (filterStatus === 'replied') return message.replied
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des messages...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout 
        title="Messages de contact" 
        description="Gérez les messages reçus via le formulaire de contact"
      >
        <div className="flex justify-end mb-6">
          <span className="text-sm text-gray-500">
            {messages.filter(m => !m.read).length} non lus
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des messages */}
          <div className="lg:col-span-1">
            {/* Filtres et recherche */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Tous les messages</option>
                    <option value="unread">Non lus</option>
                    <option value="read">Lus</option>
                    <option value="replied">Répondus</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Liste */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-3 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  Messages ({filteredMessages.length})
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                      } ${!message.read ? 'bg-yellow-50' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {message.name}
                            </h4>
                            {!message.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                            {message.replied && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {message.subject}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Aucun message trouvé
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Détail du message */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedMessage.subject}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {!selectedMessage.read && (
                        <button
                          onClick={() => markAsRead(selectedMessage.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Marquer comme lu
                        </button>
                      )}
                      {!selectedMessage.replied && (
                        <button
                          onClick={() => markAsReplied(selectedMessage.id)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Marquer comme répondu
                        </button>
                      )}
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {/* Informations de contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedMessage.name}</p>
                          <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                        </div>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <p className="text-sm text-gray-900">{selectedMessage.phone}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Reçu le {formatDate(selectedMessage.createdAt)}
                      </p>
                    </div>

                    {/* Statut */}
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedMessage.read 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedMessage.read ? 'Lu' : 'Non lu'}
                      </span>
                      {selectedMessage.replied && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Répondu
                        </span>
                      )}
                    </div>

                    {/* Message */}
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Message</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          <Reply className="w-4 h-4" />
                          <span>Répondre</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                          <Mail className="w-4 h-4" />
                          <span>Envoyer un email</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez un message
                </h3>
                <p className="text-gray-600">
                  Choisissez un message dans la liste pour voir les détails
                </p>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
