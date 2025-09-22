'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AuthGuard from '@/components/admin/AuthGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import { ArrowLeft, Save, Eye } from 'lucide-react'

export default function EditEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    location: '',
    startDate: '',
    endDate: '',
    published: false,
    featured: false,
    categoryId: '',
    imageUrl: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string

  useEffect(() => {
    loadCategories()
    loadEvent()
  }, [eventId])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error)
    }
  }

  const loadEvent = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const event = data.data
        
        setFormData({
          title: event.title || '',
          titleAr: event.titleAr || '',
          description: event.description || '',
          descriptionAr: event.descriptionAr || '',
          location: event.location || '',
          startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
          endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
          published: event.published || false,
          featured: event.featured || false,
          categoryId: event.categoryId || '',
          imageUrl: event.imageUrl || ''
        })
        
        if (event.imageUrl) {
          setImagePreview(event.imageUrl)
        }
      } else {
        setError('Événement non trouvé')
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'événement:', error)
      setError('Erreur lors du chargement de l\'événement')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('admin_token')
      
      // Upload image if provided
      let imageUrl = formData.imageUrl
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }
      
      const eventData = {
        ...formData,
        imageUrl
      }
      
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/events')
      } else {
        setError(data.error || 'Erreur lors de la mise à jour de l\'événement')
      }
    } catch (error) {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const token = localStorage.getItem('admin_token')
    const response = await fetch('/api/upload/images-db', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    
    const data = await response.json()
    if (data.success && data.data.successful.length > 0) {
      return data.data.successful[0].file.url
    }
    throw new Error(data.error || 'Erreur lors de l\'upload')
  }

  if (loadingData) {
    return (
      <AuthGuard>
        <AdminLayout title="Modifier l'événement">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement de l'événement...</p>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout 
        title="Modifier l'événement" 
        description="Modifiez les informations de l'événement"
      >
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Erreur:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-6">
                {/* Informations générales */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Titre (Français) *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Titre de l'événement"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="titleAr" className="block text-sm font-medium text-gray-700 mb-2">
                        Titre (Arabe)
                      </label>
                      <input
                        type="text"
                        id="titleAr"
                        name="titleAr"
                        value={formData.titleAr}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                        placeholder="عنوان الحدث"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Français) *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={8}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Description complète de l'événement"
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="descriptionAr" className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Arabe)
                      </label>
                      <textarea
                        id="descriptionAr"
                        name="descriptionAr"
                        rows={8}
                        value={formData.descriptionAr}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                        placeholder="الوصف الكامل للحدث"
                        dir="rtl"
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Date de début *
                        </label>
                        <input
                          type="datetime-local"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Date de fin
                        </label>
                        <input
                          type="datetime-local"
                          id="endDate"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        Lieu *
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Lieu de l'événement"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne latérale */}
              <div className="lg:col-span-1 space-y-6">
                {/* Image */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Image de l'événement</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                        Nouvelle image
                      </label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">Formats acceptés: JPG, PNG, GIF (max 5MB)</p>
                    </div>

                    {imagePreview && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Aperçu</label>
                        <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Aperçu"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Ou URL de l'image
                      </label>
                      <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Options</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="published"
                          name="published"
                          checked={formData.published}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                          Publier l'événement
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                          Mettre en vedette
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="space-y-3">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? 'Mise à jour...' : 'Mettre à jour l\'événement'}
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/admin/events')}
                      className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Retour</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open(`/events/${eventId}`, '_blank')}
                      className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Voir l'événement</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
