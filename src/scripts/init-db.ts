import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Initialisation de la base de données...')

  // Vérifier si un administrateur existe déjà
  const existingAdmin = await prisma.admin.findFirst()
  if (existingAdmin) {
    console.log('✅ Un administrateur existe déjà dans la base de données')
    return
  }

  // Créer l'administrateur par défaut
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@ambassade-mali-libye.ml',
      password: hashedPassword,
      name: 'Administrateur Principal',
      role: 'SUPER_ADMIN'
    }
  })

  console.log('✅ Administrateur créé avec succès:')
  console.log(`   Email: ${admin.email}`)
  console.log(`   Mot de passe: admin123`)
  console.log(`   Rôle: ${admin.role}`)
  console.log('')
  console.log('⚠️  IMPORTANT: Changez le mot de passe par défaut après la première connexion!')

  // Créer quelques données d'exemple
  console.log('📝 Création des données d\'exemple...')

  // Créer une catégorie d'exemple
  const category = await prisma.category.create({
    data: {
      name: 'Actualités',
      nameAr: 'أخبار',
      description: 'Articles d\'actualité de l\'ambassade',
      descriptionAr: 'مقالات إخبارية من السفارة',
      color: '#3B82F6',
      isActive: true
    }
  })

  // Article d'exemple
  await prisma.article.create({
    data: {
      title: 'Bienvenue sur le site de l\'Ambassade du Mali en Libye',
      titleAr: 'مرحباً بكم في موقع سفارة مالي في ليبيا',
      content: 'Nous sommes ravis de vous accueillir sur le site officiel de l\'Ambassade de la République du Mali en Libye. Ce site vous fournira toutes les informations nécessaires concernant nos services consulaires, les relations bilatérales entre nos deux pays, et les actualités importantes.',
      contentAr: 'يسعدنا أن نرحب بكم في الموقع الرسمي لسفارة جمهورية مالي في ليبيا. يوفر لكم هذا الموقع جميع المعلومات اللازمة حول خدماتنا القنصلية والعلاقات الثنائية بين بلدينا والأخبار المهمة.',
      excerpt: 'Site officiel de l\'Ambassade du Mali en Libye',
      excerptAr: 'الموقع الرسمي لسفارة مالي في ليبيا',
      slug: 'bienvenue-ambassade-mali-libye',
      published: true,
      publishedAt: new Date(),
      imageUrl: '/images/logo/logo-ambassade-mali.png',
      tags: JSON.stringify(['accueil', 'ambassade', 'mali', 'libye']),
      categoryId: category.id,
      authorId: admin.id
    }
  })

  // Événement d'exemple
  await prisma.event.create({
    data: {
      title: 'Journée de la Culture Malienne',
      titleAr: 'يوم الثقافة المالية',
      description: 'Venez découvrir la richesse de la culture malienne à travers des expositions, des spectacles et des dégustations culinaires.',
      descriptionAr: 'تعالوا لاكتشاف ثراء الثقافة المالية من خلال المعارض والعروض وتذوق الأطباق التقليدية.',
      location: 'Ambassade du Mali, Tripoli',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans 7 jours
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 8 heures plus tard
      published: true,
      authorId: admin.id
    }
  })

  // Annonce d'exemple
  await prisma.announcement.create({
    data: {
      title: 'Nouveaux horaires de l\'Ambassade',
      titleAr: 'أوقات عمل جديدة للسفارة',
      content: 'L\'Ambassade sera ouverte du dimanche au jeudi de 8h00 à 16h00. Les services consulaires sont disponibles sur rendez-vous.',
      contentAr: 'ستكون السفارة مفتوحة من الأحد إلى الخميس من الساعة 8:00 إلى 16:00. الخدمات القنصلية متاحة بموعد مسبق.',
      priority: 'HIGH',
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
    }
  })

  console.log('✅ Données d\'exemple créées avec succès')
  console.log('')
  console.log('🎉 Initialisation terminée!')
  console.log('Vous pouvez maintenant démarrer l\'application avec: npm run dev')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de l\'initialisation:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
