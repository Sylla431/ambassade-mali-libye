'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AuthGuard from '@/components/admin/AuthGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import { ArrowLeft, Save, Eye } from 'lucide-react'

export default function EditArticlePage() {
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    content: '',
    contentAr: '',
    excerpt: '',
    excerptAr: '',
    published: false,
    featured: false,
    categoryId: '',
    tags: '',
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
  const articleId = params.id as string

  useEffect(() => {
    loadCategories()
    loadArticle()
  }, [articleId])

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

  const loadArticle = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/articles/${articleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const article = data.data
        
        setFormData({
          title: article.title || '',
          titleAr: article.titleAr || '',
          content: article.content || '',
          contentAr: article.contentAr || '',
          excerpt: article.excerpt || '',
          excerptAr: article.excerptAr || '',
          published: article.published || false,
          featured: article.featured || false,
          categoryId: article.categoryId || '',
          tags: article.tags || '',
          imageUrl: article.imageUrl || ''
        })
        
        if (article.imageUrl) {
          setImagePreview(article.imageUrl)
        }
      } else {
        setError('Article non trouvé')
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error)
      setError('Erreur lors du chargement de l\'article')
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
      
      // Générer le slug automatiquement à partir du titre
      const slug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
        .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
        .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
        .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
        .trim()

      const articleData = {
        ...formData,
        slug,
        imageUrl
      }
      
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(articleData)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/articles')
      } else {
        setError(data.error || 'Erreur lors de la mise à jour de l\'article')
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
        <AdminLayout title="Modifier l'article">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement de l'article...</p>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <AdminLayout 
        title="Modifier l'article" 
        description="Modifiez les informations de l'article"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Titre de l'article"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        placeholder="عنوان المقال"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                        Extrait (Français)
                      </label>
                      <textarea
                        id="excerpt"
                        name="excerpt"
                        rows={3}
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Un court résumé de l'article"
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="excerptAr" className="block text-sm font-medium text-gray-700 mb-2">
                        Extrait (Arabe)
                      </label>
                      <textarea
                        id="excerptAr"
                        name="excerptAr"
                        rows={3}
                        value={formData.excerptAr}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        placeholder="ملخص قصير للمقال"
                        dir="rtl"
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Contenu (Français) *
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        rows={10}
                        value={formData.content}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contenu complet de l'article"
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="contentAr" className="block text-sm font-medium text-gray-700 mb-2">
                        Contenu (Arabe)
                      </label>
                      <textarea
                        id="contentAr"
                        name="contentAr"
                        rows={10}
                        value={formData.contentAr}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        placeholder="المحتوى الكامل للمقال"
                        dir="rtl"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne latérale */}
              <div className="lg:col-span-1 space-y-6">
                {/* Image */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Image de l'article</h2>
                  
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="tag1, tag2, tag3"
                      />
                      <p className="text-sm text-gray-500 mt-1">Séparez les tags par des virgules</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="published"
                          name="published"
                          checked={formData.published}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                          Publier l'article
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? 'Mise à jour...' : 'Mettre à jour l\'article'}
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/admin/articles')}
                      className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Retour</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open(`/articles/${articleId}`, '_blank')}
                      className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Voir l'article</span>
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
