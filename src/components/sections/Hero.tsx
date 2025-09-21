'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Shield, Users, Globe } from 'lucide-react'
import Link from 'next/link'
import MaliPattern from '@/components/ui/MaliPattern'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-mali-green-50 via-mali-gold-50 to-mali-red-50 dark:from-gray-900 dark:to-gray-800">
      {/* Image de l'ambassade en arrière-plan */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-mali-green-900/80 via-mali-gold-900/80 to-mali-red-900/80">
          <div className="w-full h-full bg-[url('/images/ambassade/ambassade-mali-libye.jpg')] bg-cover bg-center bg-no-repeat opacity-20"></div>
        </div>
      </div>
      <MaliPattern variant="geometric" className="text-mali-green-600 z-10" />
      <div className="container-custom relative z-20 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu principal */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Ambassade de la{' '}
                <span className="bg-mali-gradient bg-clip-text text-transparent">République du Mali</span>
              </h1>
              <p className="text-xl text-white-600 dark:text-gray-300 leading-relaxed">
                Représentation officielle auprès de la Libye et de la République de Malte.
                Nous offrons un large éventail de services consulaires à nos ressortissants.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.diplomatiemdc.gouv.ml/vitrine"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center space-x-2 text-lg px-8 py-4"
              >
                <span>Demande de Visa</span>
                <ArrowRight className="h-5 w-5" />
              </a>
              <Link
                href="/services"
                className="btn-secondary inline-flex items-center justify-center space-x-2 text-lg px-8 py-4"
              >
                <span>Nos Services</span>
              </Link>
            </div>
          </motion.div>

          {/* Statistiques */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="card-mali p-6 text-center">
                <Shield className="h-12 w-12 text-mali-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-mali-green-800 dark:text-mali-green-200">15+</h3>
                <p className="text-mali-gold-700 dark:text-mali-gold-300">Services Consulaires</p>
              </div>
              <div className="card-mali p-6 text-center">
                <Users className="h-12 w-12 text-mali-gold-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-mali-green-800 dark:text-mali-green-200">24/7</h3>
                <p className="text-mali-gold-700 dark:text-mali-gold-300">Assistance d'Urgence</p>
              </div>
            </div>

            <div className="card-mali p-6">
              <div className="flex items-center space-x-4">
                <Globe className="h-12 w-12 text-mali-red-600" />
                <div>
                  <h3 className="text-lg font-semibold text-mali-green-800 dark:text-mali-green-200">
                    Représentation Permanente
                  </h3>
                  <p className="text-mali-gold-700 dark:text-mali-gold-300">
                    Communauté des États Sahelo-Sahariens (CEN-SAD)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-mali-green-100 dark:bg-mali-green-900 rounded-full -translate-y-32 translate-x-32 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-mali-gold-100 dark:bg-mali-gold-900 rounded-full translate-y-24 -translate-x-24 opacity-20"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-mali-red-100 dark:bg-mali-red-900 rounded-full opacity-10"></div>
    </section>
  )
}
