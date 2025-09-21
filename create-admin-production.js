const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('🔐 Création de l\'utilisateur admin...')
    
    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.admin.findFirst({
      where: { email: 'admin@ambassade-mali-libye.com' }
    })
    
    if (existingAdmin) {
      console.log('⚠️  Un administrateur existe déjà avec cet email')
      return
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    // Créer l'admin
    const admin = await prisma.admin.create({
      data: {
        name: 'Administrateur Principal',
        email: 'admin@ambassade-mali-libye.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    
    console.log('✅ Administrateur créé avec succès !')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Mot de passe: admin123')
    console.log('🌐 URL admin: /admin')
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter seulement si ce script est appelé directement
if (require.main === module) {
  createAdmin()
}

module.exports = { createAdmin }
