// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Types pour les articles
export interface CreateArticleRequest {
  title: string
  titleAr?: string
  content: string
  contentAr?: string
  excerpt?: string
  excerptAr?: string
  slug: string
  featured?: boolean
  published?: boolean
  imageUrl?: string
  tags?: string[]
  category?: string
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  id: string
}

// Types pour les événements
export interface CreateEventRequest {
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  location: string
  startDate: string
  endDate?: string
  isRecurring?: boolean
  imageUrl?: string
  published?: boolean
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string
}

// Types pour les documents
export interface CreateDocumentRequest {
  title: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  category: string
  isPublic?: boolean
}

// Types pour les demandes de visa
export interface CreateVisaApplicationRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  nationality: string
  passportNumber: string
  visaType: string
  purpose: string
  entryDate: string
  exitDate: string
  documents?: string[]
  notes?: string
}

export interface UpdateVisaApplicationRequest {
  id: string
  status: string
  notes?: string
}

// Types pour les messages de contact
export interface CreateContactMessageRequest {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

// Types pour les annonces
export interface CreateAnnouncementRequest {
  title: string
  titleAr?: string
  content: string
  contentAr?: string
  priority?: string
  isActive?: boolean
  startDate?: string
  endDate?: string
}

// Types pour l'authentification
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  token: string
}

// Types pour les galeries d'images
export interface GalleryImage {
  id: string
  imageUrl: string
  altText?: string
  caption?: string
  captionAr?: string
  order: number
  createdAt: string
}

export interface CreateGalleryImageRequest {
  imageUrl: string
  altText?: string
  caption?: string
  captionAr?: string
  order?: number
}

export interface UpdateGalleryImageRequest {
  id: string
  altText?: string
  caption?: string
  captionAr?: string
  order?: number
}

// Types pour la pagination
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
