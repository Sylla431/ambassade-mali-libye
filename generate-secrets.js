const crypto = require('crypto')

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex')
}

function generateSecrets() {
  console.log('🔐 Génération de secrets sécurisés...\n')
  
  const jwtSecret = generateSecret(64)
  const nextAuthSecret = generateSecret(64)
  
  console.log('📋 Variables d\'environnement pour la production :')
  console.log('=' .repeat(60))
  console.log(`DATABASE_URL="file:./dev.db"`)
  console.log(`JWT_SECRET="${jwtSecret}"`)
  console.log(`NEXTAUTH_URL="https://votre-projet.vercel.app"`)
  console.log(`NEXTAUTH_SECRET="${nextAuthSecret}"`)
  console.log('=' .repeat(60))
  
  console.log('\n📝 Instructions :')
  console.log('1. Copiez ces variables dans votre dashboard Vercel')
  console.log('2. Remplacez "votre-projet.vercel.app" par votre vraie URL')
  console.log('3. Gardez ces secrets en sécurité !')
  
  console.log('\n⚠️  IMPORTANT :')
  console.log('- Ne partagez JAMAIS ces secrets')
  console.log('- Ne les commitez PAS dans Git')
  console.log('- Utilisez des secrets différents pour chaque environnement')
  
  return {
    jwtSecret,
    nextAuthSecret
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  generateSecrets()
}

module.exports = { generateSecrets }
