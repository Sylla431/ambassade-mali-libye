// Service API centralisé pour l'Ambassade du Mali en Libye

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

class ApiService {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token')
    }
  }

  // Méthode générique pour les appels API
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Méthode générique pour les appels avec méthode personnalisée
  async call<T = any>(endpoint: string, method: string = 'GET', data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method,
      body: data ? JSON.stringify(data) : undefined
    })
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()
      return data
    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion au serveur'
      }
    }
  }

  // Authentification
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
    }
  }

  // Articles
  async getArticles(params: {
    page?: number
    limit?: number
    search?: string
    category?: string
    published?: boolean
  } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })
    
    return this.request<PaginatedResponse<any>>(`/articles?${searchParams}`)
  }

  async getArticle(id: string) {
    return this.request(`/articles/${id}`)
  }

  async createArticle(article: any) {
    return this.request('/articles', {
      method: 'POST',
      body: JSON.stringify(article)
    })
  }

  async updateArticle(id: string, article: any) {
    return this.request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(article)
    })
  }

  async deleteArticle(id: string) {
    return this.request(`/articles/${id}`, {
      method: 'DELETE'
    })
  }

  // Événements
  async getEvents(params: {
    page?: number
    limit?: number
    search?: string
    published?: boolean
  } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })
    
    return this.request<PaginatedResponse<any>>(`/events?${searchParams}`)
  }

  async getEvent(id: string) {
    return this.request(`/events/${id}`)
  }

  async createEvent(event: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(event)
    })
  }

  // Documents
  async getDocuments(params: {
    page?: number
    limit?: number
    search?: string
    category?: string
    public?: boolean
  } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })
    
    return this.request<PaginatedResponse<any>>(`/documents?${searchParams}`)
  }

  // Demandes de visa
  async submitVisaApplication(application: any) {
    return this.request('/visa', {
      method: 'POST',
      body: JSON.stringify(application)
    })
  }

  async getVisaApplications(params: {
    page?: number
    limit?: number
    search?: string
    status?: string
  } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })
    
    return this.request<PaginatedResponse<any>>(`/visa?${searchParams}`)
  }

  async updateVisaApplication(id: string, updates: any) {
    return this.request(`/visa/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    })
  }

  // Messages de contact
  async submitContactMessage(message: any) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(message)
    })
  }

  async getContactMessages(params: {
    page?: number
    limit?: number
    search?: string
  } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })
    
    return this.request<PaginatedResponse<any>>(`/contact?${searchParams}`)
  }

  // Annonces
  async getAnnouncements(params: {
    page?: number
    limit?: number
    search?: string
    active?: boolean
  } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })
    
    return this.request<PaginatedResponse<any>>(`/announcements?${searchParams}`)
  }

  async createAnnouncement(announcement: any) {
    return this.request('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcement)
    })
  }

  // Galeries d'images
  async getArticleGallery(articleId: string) {
    return this.request(`/articles/${articleId}/gallery`)
  }

  async addImageToArticleGallery(articleId: string, image: any) {
    return this.request(`/articles/${articleId}/gallery`, {
      method: 'POST',
      body: JSON.stringify(image)
    })
  }

  async updateArticleGalleryImage(articleId: string, imageId: string, updates: any) {
    return this.request(`/articles/${articleId}/gallery/${imageId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    })
  }

  async deleteArticleGalleryImage(articleId: string, imageId: string) {
    return this.request(`/articles/${articleId}/gallery/${imageId}`, {
      method: 'DELETE'
    })
  }

  async getEventGallery(eventId: string) {
    return this.request(`/events/${eventId}/gallery`)
  }

  async addImageToEventGallery(eventId: string, image: any) {
    return this.request(`/events/${eventId}/gallery`, {
      method: 'POST',
      body: JSON.stringify(image)
    })
  }

  // Upload de fichiers
  async uploadImages(files: File[]) {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    return fetch(`${this.baseUrl}/upload/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    }).then(res => res.json())
  }

  async uploadDocuments(files: File[]) {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    return fetch(`${this.baseUrl}/upload/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    }).then(res => res.json())
  }

  async uploadVisaDocuments(files: File[]) {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    return fetch(`${this.baseUrl}/upload/visa`, {
      method: 'POST',
      body: formData
    }).then(res => res.json())
  }
}

// Instance singleton
export const apiService = new ApiService()
export default apiService
