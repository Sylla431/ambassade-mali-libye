import { NextRequest } from 'next/server'
import { authenticateUser, generateToken } from '@/lib/auth'
import { loginSchema } from '@/utils/validation'
import { successResponse, errorResponse, validationErrorResponse } from '@/utils/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.errors)
    }

    const { email, password } = validationResult.data

    // Authentification
    const user = await authenticateUser(email, password)
    if (!user) {
      return errorResponse('Email ou mot de passe incorrect', 401)
    }

    // Génération du token
    const token = generateToken(user)

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    }, 'Connexion réussie')

  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
}
