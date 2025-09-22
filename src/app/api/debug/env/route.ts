import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const env = {
      DATABASE_URL: process.env.DATABASE_URL ? '✅ Définie' : '❌ Manquante',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Définie' : '❌ Manquante',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Définie' : '❌ Manquante',
      NODE_ENV: process.env.NODE_ENV || 'undefined',
      VERCEL: process.env.VERCEL || 'undefined',
      VERCEL_ENV: process.env.VERCEL_ENV || 'undefined'
    }
    
    return NextResponse.json({
      success: true,
      environment: env,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
