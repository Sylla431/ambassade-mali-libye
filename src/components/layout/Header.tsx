'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, MapPin, Clock, ChevronDown, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslationSimple'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

interface NavigationItem {
  name: string
  href: string
  target?: string
  rel?: string
  submenu?: Array<{ name: string; href: string }>
}

const getNavigation = (t: (key: string) => string): NavigationItem[] => [
  { 
    name: t('navigation.home'), 
    href: '/',
    // submenu: [
    //   { name: t('navigation.documents'), href: '/documents' }
    // ]
  },
  { name: t('navigation.services'), href: '/services' },
  { name: t('navigation.documents'), href: '/documents' },
  { name: t('navigation.visa'), href: 'https://www.diplomatiemdc.gouv.ml/vitrine', target: '_blank', rel: 'noopener noreferrer' },
  { name: t('navigation.investments'), href: '/investissements' },
  { name: t('navigation.aes'), href: '/aes' },
  { name: t('navigation.culture'), href: '/culture' },
  { name: t('navigation.articles'), href: '/articles' },
  // { name: t('navigation.contact'), href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const { t, isRTL } = useTranslation()
  const navigation = getNavigation(t)

  return (
    <header className={`bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Top bar avec infos de contact */}
      <div className="bg-mali-gradient text-white py-2">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">{t('header.phone')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">{t('header.address')}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.diplomatiemdc.gouv.ml/vitrine"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
              >
                <span>Demande de Visa</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">{t('header.hours')}</span>
              </div>
              <LanguageSwitcher />
            </div>
            
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <nav className="container-custom">
        <div className="flex justify-between items-center py-1">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-40 h-14 sm:w-48 sm:h-16 lg:w-60 lg:h-20">
              <Image
                src="/images/logo/logo-ambassade-mali.png"
                alt="Logo Ambassade du Mali en Libye"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 240px"
                onError={(e) => {
                  // Fallback si l'image ne charge pas
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.submenu ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveSubmenu(item.name)}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-mali-green-600 dark:hover:text-mali-green-400 font-medium transition-colors">
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    <AnimatePresence>
                      {activeSubmenu === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                        >
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-mali-green-50 dark:hover:bg-mali-green-900 hover:text-mali-green-600 dark:hover:text-mali-green-400 transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-mali-green-600 dark:hover:text-mali-green-400 font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Bouton mobile menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-700"
            >
              <div className="py-4 space-y-2">
                {/* Top bar mobile - Bouton Visa et Language Switcher seulement */}
                <div className="px-4 py-2 justify-between space-x-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                  <a
                    href="https://www.diplomatiemdc.gouv.ml/vitrine"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-mali-green-600 hover:bg-mali-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Demande de Visa</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <LanguageSwitcher />
                </div>
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.submenu ? (
                      <div>
                        <div className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium">
                          {item.name}
                        </div>
                        <div className="pl-6 space-y-1">
                          <Link
                            href={item.href}
                            className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Page d'accueil
                          </Link>
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
