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
      bodySizeLimit: '50mb', // Limite Vercel: 4.5MB (hobby), 50MB (pro)
    },
  },
}

module.exports = nextConfig
