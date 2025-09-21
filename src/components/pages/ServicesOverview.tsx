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
  Clock,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    icon: FileText,
    title: 'Sauf-conduit',
    description: 'Document de voyage pour les situations d\'urgence',
    price: '20 dinars',
    duration: '1-2 jours',
    requirements: ['Passeport valide', 'Justificatif d\'urgence', 'Photo d\'identité'],
    href: '/services/sauf-conduit'
  },
  {
    icon: UserCheck,
    title: 'Lettre de témoignage',
    description: 'Attestation de nationalité et d\'identité',
    price: 'Gratuit',
    duration: 'Immédiat',
    requirements: ['Pièce d\'identité', 'Justificatif de domicile'],
    href: '/services/temoignage'
  },
  {
    icon: Globe,
    title: 'Traduction arabe',
    description: 'Traduction officielle de documents',
    price: 'Sur devis',
    duration: '3-5 jours',
    requirements: ['Document original', 'Certificat de traduction'],
    href: '/services/traduction'
  },
  {
    icon: Shield,
    title: 'Légalisation',
    description: 'Authentification de documents officiels',
    price: '20 dinars',
    duration: '1-2 jours',
    requirements: ['Document original', 'Copie certifiée'],
    href: '/services/legalisation'
  },
  {
    icon: Users,
    title: 'Procuration',
    description: 'Acte de représentation légale',
    price: '20 dinars',
    duration: '1 jour',
    requirements: ['Pièce d\'identité', 'Justificatif de mandant'],
    href: '/services/procuration'
  },
  {
    icon: CreditCard,
    title: 'Enrôlement biométrique',
    description: 'Création de carte d\'identité biométrique',
    price: 'Gratuit',
    duration: '30-45 jours',
    requirements: ['Acte de naissance', 'Photo d\'identité', 'Empreintes'],
    href: '/services/biometrique'
  },
  {
    icon: Calendar,
    title: 'Attestation parentale',
    description: 'Document attestant la filiation',
    price: 'Gratuit',
    duration: '1 jour',
    requirements: ['Acte de naissance', 'Pièce d\'identité parent'],
    href: '/services/attestation'
  },
  {
    icon: Phone,
    title: 'Autres services',
    description: 'Diverses démarches administratives',
    price: 'Variable',
    duration: 'Variable',
    requirements: ['Selon le service demandé'],
    href: '/services/autres'
  }
]

export default function ServicesOverview() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Services Consulaires
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            L'Ambassade du Mali en Libye propose un large éventail de services consulaires 
            à ses ressortissants pour faciliter leurs démarches administratives.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <service.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gold-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tarif</span>
                  </div>
                  <span className="font-semibold text-gold-600 dark:text-gold-400">
                    {service.price}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-secondary-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Délai</span>
                  </div>
                  <span className="font-semibold text-secondary-600 dark:text-secondary-400">
                    {service.duration}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Documents requis :
                </h4>
                <ul className="space-y-1">
                  {service.requirements.map((req, reqIndex) => (
                    <li key={reqIndex} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={service.href}
                className="btn-primary w-full text-center inline-block"
              >
                En savoir plus
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Informations importantes */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Informations importantes
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Horaires d'ouverture
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Dimanche - Jeudi : 8h00 - 15h00<br />
                Vendredi - Samedi : Fermé
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Paiement
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Paiement uniquement en dinars libyens<br />
                Tarifs officiels fixés par le gouvernement
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
