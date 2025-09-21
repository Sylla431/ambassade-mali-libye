import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Pour le développement, on laisse AuthGuard gérer l'authentification
  // Le middleware ne bloque plus les routes admin
  // TODO: Réactiver la protection par cookies en production
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
