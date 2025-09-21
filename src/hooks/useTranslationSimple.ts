'use client'

import { useState, useMemo } from 'react'
import fr from '@/locales/fr.json'
import ar from '@/locales/ar.json'

const translations = {
  fr,
  ar,
}

export function useTranslation() {
  const [locale, setLocale] = useState('fr')
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
    setLocale(newLocale)
    // Sauvegarder dans localStorage pour persister
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale)
    }
  }

  // Charger la locale depuis localStorage au montage
  useState(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('preferred-locale')
      if (savedLocale && (savedLocale === 'fr' || savedLocale === 'ar')) {
        setLocale(savedLocale)
      }
    }
  })

  return {
    t,
    locale,
    isRTL,
    changeLanguage
  }
}
