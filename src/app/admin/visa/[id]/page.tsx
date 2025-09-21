'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AuthGuard from '@/components/admin/AuthGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  FileText,
  Eye
} from 'lucide-react'

interface VisaApplication {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  passportNumber: string
  nationality: string
  visaType: string
  purpose: string
  entryDate: string
  exitDate: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING'
  documents: string[]
  createdAt: string
  updatedAt: string
}

export default function VisaApplicationDetailPage() {
  const [application, setApplication] = useState<VisaApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string

  useEffect(() => {
    loadApplication()
  }, [applicationId])

  const loadApplication = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/visa/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setApplication(data.data)
        } else {
          setError('Demande de visa non trouvée')
        }
      } else {
        setError('Demande de visa non trouvée')
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la demande:', error)
      setError('Erreur lors du chargement de la demande')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    setUpdating(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/visa/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setApplication(prev => prev ? { ...prev, status: newStatus as any } : null)
      } else {
        setError('Erreur lors de la mise à jour du statut')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      setError('Erreur lors de la mise à jour du statut')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />
      case 'PROCESSING':
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente'
      case 'APPROVED':
        return 'Approuvée'
      case 'REJECTED':
        return 'Rejetée'
      case 'PROCESSING':
        return 'En cours'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <AuthGuard>
        <AdminLayout title="Détail de la demande de visa">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement de la demande...</p>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  if (error || !application) {
    return (
      <AuthGuard>
        <AdminLayout title="Demande de visa non trouvée">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Demande non trouvée</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/admin/visa')}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour aux demandes</span>
            </button>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout 
        title="Détail de la demande de visa" 
        description={`Demande de ${application.firstName} ${application.lastName}`}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* En-tête avec statut et actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {application.firstName} {application.lastName}
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-1">{getStatusText(application.status)}</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    Demande du {formatDate(application.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {application.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => updateStatus('APPROVED')}
                      disabled={updating}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approuver</span>
                    </button>
                    <button
                      onClick={() => updateStatus('REJECTED')}
                      disabled={updating}
                      className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Rejeter</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => router.push('/admin/visa')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom complet</p>
                    <p className="text-gray-900">{application.firstName} {application.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{application.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Téléphone</p>
                    <p className="text-gray-900">{application.phone}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Numéro de passeport</p>
                    <p className="text-gray-900">{application.passportNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nationalité</p>
                    <p className="text-gray-900">{application.nationality}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations sur le visa */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations sur le visa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Type de visa</p>
                  <p className="text-gray-900">{application.visaType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Motif du voyage</p>
                  <p className="text-gray-900">{application.purpose}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date d'entrée</p>
                    <p className="text-gray-900">{formatDate(application.entryDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date de sortie</p>
                    <p className="text-gray-900">{formatDate(application.exitDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          {application.documents && application.documents.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents fournis</h2>
              <div className="space-y-3">
                {application.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">Document {index + 1}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(doc, '_blank')}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Voir</span>
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = doc
                          link.download = `document-${index + 1}.pdf`
                          link.click()
                        }}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                      >
                        <Download className="w-4 h-4" />
                        <span>Télécharger</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
