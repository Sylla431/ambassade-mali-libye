/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'embassy.marakadev.online'],
  },
  i18n: {
    locales: ['fr', 'ar'],
    defaultLocale: 'fr',
  },
  // Configuration pour supporter les uploads de vidéos volumineuses
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Limite pour les Server Actions
    },
  },
  // Augmenter la limite de taille des requêtes API
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}

module.exports = nextConfig
