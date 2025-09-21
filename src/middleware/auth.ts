import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    name: string
    role: string
  }
}

export function withAuth(handler: (req: AuthenticatedRequest, context?: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context?: any) => {
    try {
      const token = req.headers.get('authorization')?.replace('Bearer ', '')
      
      if (!token) {
        return NextResponse.json(
          { error: 'Token d\'authentification requis' },
          { status: 401 }
        )
      }

      const user = verifyToken(token)
      if (!user) {
        return NextResponse.json(
          { error: 'Token invalide' },
          { status: 401 }
        )
      }

      // Ajouter l'utilisateur à la requête
      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.user = user

      return handler(authenticatedReq, context)
    } catch (error) {
      return NextResponse.json(
        { error: 'Erreur d\'authentification' },
        { status: 401 }
      )
    }
  }
}

export function withRole(requiredRole: string) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return withAuth(async (req: AuthenticatedRequest) => {
      const user = req.user!
      
      // Vérifier les rôles (hiérarchie)
      const roleHierarchy = {
        'SUPER_ADMIN': 3,
        'ADMIN': 2,
        'EDITOR': 1
      }
      
      const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0
      const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0
      
      if (userLevel < requiredLevel) {
        return NextResponse.json(
          { error: 'Permissions insuffisantes' },
          { status: 403 }
        )
      }

      return handler(req)
    })
  }
}
