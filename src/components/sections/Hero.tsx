'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Globe } from 'lucide-react'
import Link from 'next/link'
import MaliPattern from '@/components/ui/MaliPattern'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Image de l'ambassade en arrière-plan - plus visible */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/ambassade/ambassade-mali-libye.jpg')] bg-cover bg-center bg-no-repeat"></div>
        {/* Overlay amélioré pour plus de visibilité des images */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/15 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
      </div>
      
      {/* Pattern décoratif subtil */}
      <MaliPattern variant="geometric" className="text-white/10 z-10" />
      
      <div className="container-custom relative z-20 py-20">
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center gap-8 max-w-6xl"
          >
            {/* Sceau du Mali centré */}
            <div className="flex flex-col items-center space-y-2 flex-shrink-0 w-full lg:w-auto">
              <div className="relative w-32 h-32 lg:w-36 lg:h-36">
                <Image
                  src="/images/seals/Armoiries_Mali-3-01-150x150-1.png"
                  width={300}
                  height={300}
                  alt="Sceau de la République du Mali"
                  // fill
                  className="object-contain"
                />
              </div>
              {/* <p className="text-gray-300 text-sm text-center max-w-36">
                République du Mali
              </p> */}
            </div>

            {/* Contenu principal */}
            <div className="text-center space-y-8 flex-1">
              <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight break-words" 
                  >
                Ambassade de la{' '}
                <span className="bg-mali-gradient bg-clip-text text-transparent drop-shadow-md">
                  République du Mali auprès de l'Etat de Libye 
                  et de la République de Malte
                </span>
              </h2>
              <p className="text-xl text-white leading-relaxed max-w-3xl mx-auto" 
                 style={{ 
                   textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)' 
                 }}>
                Représentation permanente : Communauté des Etats Sahélo-Sahariens (CENSAD)
              </p>
            </div>

            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            </div> */}

            {/* Carte CEN-SAD */}
            
            </div>
          </motion.div>
        </div>
      </div>

      {/* Éléments décoratifs subtils */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
    </section>
  )
}
