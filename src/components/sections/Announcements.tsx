'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, AlertCircle, FileText } from 'lucide-react'
import { format } from 'date-fns'

const announcements = [
  {
    id: 1,
    title: 'Note de service Nº2025-001/AMT',
    date: new Date('2025-01-15'),
    type: 'Important',
    content: 'Informations importantes concernant les nouveaux tarifs des services consulaires et les horaires d\'ouverture.',
    details: {
      'Dimanche': {
        time: '09h00 à 15h30',
        services: [
          'Sauf-conduit - 20 dinars',
          'Lettres de témoignage de nationalité',
          'Traduction arabe',
          'Légalisation - 20 dinars',
          'Lettres de trois (3)',
          'Procuration - 20 dinars'
        ]
      },
      'Lundi': {
        time: '09h00 à 15h30',
        services: [
          'Sauf-conduit - 20 dinars',
          'Légalisation - 20 dinars',
          'Lettre d\'identification (03) mois - 20 dinars'
        ]
      },
      'Mardi': {
        time: '09h00 à 15h30',
        services: [
          'Enrôlement / Carte biométrique',
          'Attestation parental',
          'Lettre d\'authentification (03) mois - 20 dinars',
          'Demande de passport'
        ]
      },
      'Mercredi': {
        time: '09h00 à 15h30',
        services: [
          'Copie de naissance - 20 dinars',
          'Certificat de notoriété',
          'Carte d\'identité consulaire - 22 dinars',
          'Demande de passeport - Gratuit'
        ]
      },
      'Jeudi': {
        time: '09h00 à 15h30',
        services: [
          'Déclaration et célébration de mariage',
          'Attestation de celibat',
          'Certificat individuel et collective de vie',
          'Visa d\'entrée - 400 dinars'
        ]
      }
    }
  }
]

const importantNotice = {
  title: 'Avis Important',
  content: 'Le paiement de toute somme en dehors de ces tarifs officiels est illégal. L\'Ambassade de la République du Mali près l\'Etat de Libye invite la Communauté Malienne à diffuser ces nouvelles dispositions. Elle attache de l\'importance au respect de cette note.',
  note: 'NB : Tous les montants perçus sont des recettes reversées au Budget National.'
}

export default function Announcements() {
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
            Notes de Service
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Consultez les dernières informations officielles concernant les services consulaires, 
            les tarifs et les procédures administratives.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Note de service principale */}
          {announcements.map((announcement) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {announcement.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(announcement.date, 'dd MMMM yyyy')}</span>
                    </div>
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-medium rounded-full">
                      {announcement.type}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {announcement.content}
              </p>

              {/* Horaires et services par jour */}
              <div className="space-y-4">
                {Object.entries(announcement.details).map(([day, info]) => (
                  <div key={day} className="border-l-4 border-primary-200 dark:border-primary-800 pl-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{day}</h4>
                      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{info.time}</span>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {info.services.map((service, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          • {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Avis important */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="card p-8 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-red-900 dark:text-red-100">
                  {importantNotice.title}
                </h3>
              </div>
              <p className="text-red-800 dark:text-red-200 mb-4">
                {importantNotice.content}
              </p>
              <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
                <p className="text-red-900 dark:text-red-100 font-medium">
                  {importantNotice.note}
                </p>
              </div>
            </div>

            {/* Informations complémentaires */}
            <div className="card p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Informations utiles
              </h4>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <p>Les tarifs sont fixés par le gouvernement malien</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <p>Paiement uniquement en dinars libyens</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <p>Documents requis selon le type de service</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <p>Délais de traitement variables selon les services</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
