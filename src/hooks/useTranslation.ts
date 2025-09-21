import { useRouter } from 'next/router'
import { useMemo } from 'react'
import fr from '@/locales/fr.json'
import ar from '@/locales/ar.json'

const translations = {
  fr,
  ar,
}

export function useTranslation() {
  const router = useRouter()
  
  // Fallback si le router n'est pas disponible
  const locale = router?.locale || 'fr'
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
    if (router) {
      router.push(router.asPath, router.asPath, { locale: newLocale })
    }
  }

  return {
    t,
    locale,
    isRTL,
    changeLanguage
  }
}
