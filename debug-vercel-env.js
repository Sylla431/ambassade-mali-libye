#!/usr/bin/env node

// Script pour déboguer les variables d'environnement Vercel
const https = require('https');

function testEnvironmentVariables() {
  console.log('🔍 Test des variables d\'environnement Vercel...');
  
  // Test de l'endpoint de debug (si il existe)
  const options = {
    hostname: 'ambassade-mali-libye.vercel.app',
    port: 443,
    path: '/api/debug/env',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Debug-Script/1.0'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 404) {
        console.log('❌ Endpoint /api/debug/env non trouvé');
        console.log('💡 Créons un endpoint de debug...');
        createDebugEndpoint();
      } else {
        console.log('📄 Response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur:', error);
  });

  req.end();
}

function createDebugEndpoint() {
  console.log('\n🔧 Création d\'un endpoint de debug...');
  
  const debugCode = `
// src/app/api/debug/env/route.ts
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
`;

  console.log('📝 Code à ajouter:');
  console.log(debugCode);
  console.log('\n💡 Ajoutez ce fichier et redéployez pour diagnostiquer le problème!');
}

testEnvironmentVariables();
