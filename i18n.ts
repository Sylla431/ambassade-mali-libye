import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// Langues supportées
export const locales = ['fr', 'ar'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  // Valider que la locale entrante est supportée
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
