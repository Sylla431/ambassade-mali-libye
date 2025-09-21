/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'embassy.marakadev.online'],
  },
  i18n: {
    locales: ['fr', 'ar'],
    defaultLocale: 'fr',
  },
}

module.exports = nextConfig
