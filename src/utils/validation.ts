import { z } from 'zod'

// Schémas de validation pour les articles
export const createArticleSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  titleAr: z.string().optional(),
  content: z.string().min(1, 'Le contenu est requis'),
  contentAr: z.string().optional(),
  excerpt: z.string().optional(),
  excerptAr: z.string().optional(),
  slug: z.string().min(1, 'Le slug est requis').regex(/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets'),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  imageUrl: z.string().optional(),
  tags: z.string().optional(), // JSON string
  categoryId: z.string().optional()
})

export const updateArticleSchema = createArticleSchema.partial().extend({
  id: z.string().min(1, 'L\'ID est requis')
})

// Schémas de validation pour les événements
export const createEventSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  titleAr: z.string().optional(),
  description: z.string().min(1, 'La description est requise'),
  descriptionAr: z.string().optional(),
  location: z.string().min(1, 'Le lieu est requis'),
  startDate: z.string().datetime('Date de début invalide'),
  endDate: z.string().datetime('Date de fin invalide').optional(),
  isRecurring: z.boolean().optional(),
  imageUrl: z.string().optional(),
  published: z.boolean().optional(),
  categoryId: z.string().optional()
})

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().min(1, 'L\'ID est requis')
})

// Schémas de validation pour les documents
export const createDocumentSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  titleAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  category: z.enum(['VISA_FORMS', 'LEGAL_DOCUMENTS', 'NEWS', 'ANNOUNCEMENTS', 'CULTURAL', 'ECONOMIC', 'POLITICAL']),
  isPublic: z.boolean().optional()
})

// Schémas de validation pour les demandes de visa
export const createVisaApplicationSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis').max(50, 'Le prénom est trop long'),
  lastName: z.string().min(1, 'Le nom est requis').max(50, 'Le nom est trop long'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  nationality: z.string().min(1, 'La nationalité est requise'),
  passportNumber: z.string().min(1, 'Le numéro de passeport est requis'),
  visaType: z.enum(['TOURIST', 'BUSINESS', 'DIPLOMATIC', 'STUDENT', 'WORK', 'TRANSIT']),
  purpose: z.string().min(1, 'Le but du voyage est requis'),
  entryDate: z.string().datetime('Date d\'entrée invalide'),
  exitDate: z.string().datetime('Date de sortie invalide'),
  documents: z.string().optional(), // JSON string
  notes: z.string().optional()
})

export const updateVisaApplicationSchema = z.object({
  id: z.string().min(1, 'L\'ID est requis'),
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED']),
  notes: z.string().optional()
})

// Schémas de validation pour les messages de contact
export const createContactMessageSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Le sujet est requis').max(200, 'Le sujet est trop long'),
  message: z.string().min(1, 'Le message est requis').max(2000, 'Le message est trop long')
})

// Schémas de validation pour les annonces
export const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  titleAr: z.string().optional(),
  content: z.string().min(1, 'Le contenu est requis'),
  contentAr: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
})

// Schémas de validation pour l'authentification
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})

// Schémas de validation pour les galeries d'images
export const createGalleryImageSchema = z.object({
  mediaUrl: z.string().url('URL d\'image invalide'),
  altText: z.string().optional(),
  caption: z.string().optional(),
  captionAr: z.string().optional(),
  order: z.number().int().min(0).optional()
})

export const updateGalleryImageSchema = z.object({
  id: z.string().min(1, 'L\'ID est requis'),
  altText: z.string().optional(),
  caption: z.string().optional(),
  captionAr: z.string().optional(),
  order: z.number().int().min(0).optional()
})

// Schémas de validation pour la pagination
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional()
})
