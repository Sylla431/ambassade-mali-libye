import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'

interface Category {
  id: string
  name: string
  nameAr?: string
  description?: string
  descriptionAr?: string
  color?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    articles: number
    events: number
  }
}

interface UseCategoriesOptions {
  isActive?: boolean
  includeCounts?: boolean
}

interface UseCategoriesResult {
  categories: Category[]
  loading: boolean
  error: string | null
  fetchCategories: (options?: UseCategoriesOptions) => Promise<void>
  createCategory: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Category | null>
  updateCategory: (id: string, data: Partial<Category>) => Promise<Category | null>
  deleteCategory: (id: string) => Promise<boolean>
}

export const useCategories = (options?: UseCategoriesOptions): UseCategoriesResult => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async (fetchOptions?: UseCategoriesOptions) => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      if (typeof (fetchOptions?.isActive || options?.isActive) === 'boolean') {
        query.append('isActive', String(fetchOptions?.isActive || options?.isActive))
      }
      if (fetchOptions?.includeCounts || options?.includeCounts) {
        query.append('includeCounts', 'true')
      }

      const response = await api.get<any>(`/categories?${query.toString()}`)

      if (response.success && response.data) {
        setCategories(response.data)
      } else {
        setError(response.message || 'Failed to fetch categories')
        setCategories([])
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [options?.isActive, options?.includeCounts])

  const createCategory = useCallback(async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category | null> => {
    try {
      const response = await api.post<Category>('/categories', data)

      if (response.success && response.data) {
        // Rafraîchir la liste des catégories
        await fetchCategories()
        return response.data
      } else {
        setError(response.message || 'Failed to create category')
        return null
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      return null
    }
  }, [fetchCategories])

  const updateCategory = useCallback(async (id: string, data: Partial<Category>): Promise<Category | null> => {
    try {
      const response = await api.put<Category>(`/categories/${id}`, data)

      if (response.success && response.data) {
        // Rafraîchir la liste des catégories
        await fetchCategories()
        return response.data
      } else {
        setError(response.message || 'Failed to update category')
        return null
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      return null
    }
  }, [fetchCategories])

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await api.delete(`/categories/${id}`)

      if (response.success) {
        // Rafraîchir la liste des catégories
        await fetchCategories()
        return true
      } else {
        setError(response.message || 'Failed to delete category')
        return false
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      return false
    }
  }, [fetchCategories])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { 
    categories, 
    loading, 
    error, 
    fetchCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
  }
}
