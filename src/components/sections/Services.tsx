'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  UserCheck, 
  Globe, 
  Shield, 
  Users, 
  CreditCard,
  Calendar,
  Phone,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    icon: FileText,
    title: 'Sauf-conduit',
    description: 'Document de voyage pour les situations d\'urgence',
    price: '20 dinars',
    href: '/services/sauf-conduit'
  },
  {
    icon: UserCheck,
    title: 'Lettre de témoignage',
    description: 'Attestation de nationalité et d\'identité',
    price: 'Gratuit',
    href: '/services/temoignage'
  },
  {
    icon: Globe,
    title: 'Traduction arabe',
    description: 'Traduction officielle de documents',
    price: 'Sur devis',
    href: '/services/traduction'
  },
  {
    icon: Shield,
    title: 'Légalisation',
    description: 'Authentification de documents officiels',
    price: '20 dinars',
    href: '/services/legalisation'
  },
  {
    icon: Users,
    title: 'Procuration',
    description: 'Acte de représentation légale',
    price: '20 dinars',
    href: '/services/procuration'
  },
  {
    icon: CreditCard,
    title: 'Enrôlement biométrique',
    description: 'Création de carte d\'identité biométrique',
    price: 'Gratuit',
    href: '/services/biometrique'
  },
  {
    icon: Calendar,
    title: 'Attestation parentale',
    description: 'Document attestant la filiation',
    price: 'Gratuit',
    href: '/services/attestation'
  },
  {
    icon: Phone,
    title: 'Autres services',
    description: 'Diverses démarches administratives',
    price: 'Variable',
    href: '/services/autres'
  }
]

export default function Services() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Services de l'Ambassade
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            L'Ambassade du Mali en Libye propose un large éventail de services consulaires 
            à ses ressortissants pour faciliter leurs démarches administratives.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={service.href}>
                <div className="card p-6 h-full hover:shadow-lg transition-shadow duration-300 group">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-mali-green-100 dark:bg-mali-green-900 rounded-full group-hover:bg-mali-green-200 dark:group-hover:bg-mali-green-800 transition-colors">
                      <service.icon className="h-8 w-8 text-mali-green-600 dark:text-mali-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {service.description}
                    </p>
                    <div className="mt-auto">
                      <span className="inline-block bg-mali-gold-100 dark:bg-mali-gold-900 text-mali-gold-800 dark:text-mali-gold-200 px-3 py-1 rounded-full text-sm font-medium">
                        {service.price}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/services"
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <span>Voir tous les services</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
