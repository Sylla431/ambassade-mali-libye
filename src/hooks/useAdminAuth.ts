'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface UseAdminAuthReturn {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  checkAuth: () => Promise<void>
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_token')
      
      if (!token) {
        setIsAuthenticated(false)
        setUser(null)
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        if (userData.success && userData.data) {
          setUser(userData.data)
          setIsAuthenticated(true)
        } else {
          // Token invalide
          localStorage.removeItem('admin_token')
          setIsAuthenticated(false)
          setUser(null)
        }
      } else {
        // Token expiré ou invalide
        localStorage.removeItem('admin_token')
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error)
      localStorage.removeItem('admin_token')
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success && data.data?.token) {
        localStorage.setItem('admin_token', data.data.token)
        setUser(data.data.user)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: data.error || 'Erreur de connexion' 
        }
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      return { 
        success: false, 
        error: 'Erreur de connexion au serveur' 
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token')
    setUser(null)
    setIsAuthenticated(false)
    router.push('/admin/login')
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  }
}
