// Utilitaires pour la gestion des tokens côté client

export interface DecodedToken {
  id: string
  email: string
  name: string
  role: string
  exp: number
  iat: number
}

/**
 * Décode un token JWT côté client (sans vérification de signature)
 * @param token - Le token JWT à décoder
 * @returns Les données du token ou null si invalide
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    if (!token) return null
    
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    
    // Vérifier si le token est expiré
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null
    }
    
    return payload as DecodedToken
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error)
    return null
  }
}

/**
 * Récupère l'utilisateur connecté depuis le localStorage
 * @returns Les données de l'utilisateur ou null si non connecté/expiré
 */
export const getCurrentUser = (): DecodedToken | null => {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('admin_token')
  if (!token) return null
  
  return decodeToken(token)
}

/**
 * Vérifie si l'utilisateur est connecté et si son token est valide
 * @returns true si l'utilisateur est connecté avec un token valide
 */
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null
}
