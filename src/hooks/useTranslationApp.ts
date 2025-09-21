'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import fr from '@/locales/fr.json'
import ar from '@/locales/ar.json'

const translations = {
  fr,
  ar,
}

export function useTranslation() {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  
  // Récupérer la locale depuis les paramètres ou utiliser 'fr' par défaut
  const locale = (params?.locale as string) || 'fr'
  const isRTL = locale === 'ar'

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>) => {
      const keys = key.split('.')
      let value: any = translations[locale as keyof typeof translations]
      
      for (const k of keys) {
        value = value?.[k]
      }
      
      if (typeof value !== 'string') {
        console.warn(`Translation missing for key: ${key}`)
        return key
      }
      
      // Replace parameters if provided
      if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
          return params[param]?.toString() || match
        })
      }
      
      return value
    }
  }, [locale])

  const changeLanguage = (newLocale: string) => {
    // Pour App Router, on reconstruit le path avec la nouvelle locale
    const segments = pathname.split('/')
    if (segments[1] === 'fr' || segments[1] === 'ar') {
      segments[1] = newLocale
    } else {
      segments.unshift('', newLocale)
    }
    const newPath = segments.join('/')
    router.push(newPath)
  }

  return {
    t,
    locale,
    isRTL,
    changeLanguage
  }
}
