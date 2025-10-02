'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Globe } from 'lucide-react'
import Link from 'next/link'
import MaliPattern from '@/components/ui/MaliPattern'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Image de l'ambassade en arrière-plan - plus visible */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/ambassade/ambassade-mali-libye.jpg')] bg-cover bg-center bg-no-repeat"></div>
        {/* Overlay subtil pour améliorer la lisibilité sans masquer l'image */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50"></div>
      </div>
      
      {/* Pattern décoratif subtil */}
      <MaliPattern variant="geometric" className="text-white/10 z-10" />
      
      <div className="container-custom relative z-20 py-20">
        <div className="flex items-center justify-center">
          {/* Contenu principal centré */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 max-w-4xl"
          >
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight break-words" 
                  >
                Ambassade de la{' '}
                <span className="bg-mali-gradient bg-clip-text text-transparent drop-shadow-md">
                  République du Mali auprès de la Libye 
                  et de la République de Malte
                </span>
              </h2>
              <p className="text-xl text-white leading-relaxed max-w-3xl mx-auto" 
                 style={{ 
                   textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)' 
                 }}>
                Représentation officielle auprès de la Libye et de la République de Malte.
                Nous offrons un large éventail de services consulaires à nos ressortissants.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.diplomatiemdc.gouv.ml/vitrine"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center space-x-2 text-lg px-8 py-4 shadow-2xl hover:shadow-3xl transition-all duration-300"
                style={{ 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.2)' 
                }}
              >
                <span>Demande de Visa</span>
                <ArrowRight className="h-5 w-5" />
              </a>
              <Link
                href="/services"
                className="btn-secondary inline-flex items-center justify-center space-x-2 text-lg px-8 py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white"
                style={{ 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.2)' 
                }}
              >
                <span>Nos Services</span>
              </Link>
            </div>

            {/* Carte CEN-SAD */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12"
            >
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-white/20 max-w-md mx-auto">
                <div className="flex items-center space-x-4">
                  <Globe className="h-12 w-12 text-mali-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-mali-green-800">
                      Représentation Permanente
                    </h3>
                    <p className="text-mali-gold-700">
                      Communauté des États Sahelo-Sahariens (CEN-SAD)
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Éléments décoratifs subtils */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
    </section>
  )
}
