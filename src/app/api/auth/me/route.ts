import { NextRequest } from 'next/server'
import { withAuth } from '@/middleware/auth'
import { successResponse } from '@/utils/api'

export const runtime = 'nodejs'

export const GET = withAuth(async (request) => {
  const user = request.user!
  
  return successResponse({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  })
})
