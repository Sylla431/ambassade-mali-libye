'use client'

import { motion } from 'framer-motion'
import { Clock, DollarSign, FileText, CheckCircle } from 'lucide-react'

const serviceDetails = [
  {
    title: 'Sauf-conduit',
    description: 'Document de voyage d\'urgence pour les situations exceptionnelles',
    price: '20 dinars',
    duration: '1-2 jours',
    requirements: [
      'Passeport valide (minimum 6 mois)',
      'Justificatif de l\'urgence (médical, familial, professionnel)',
      'Photo d\'identité récente (2 exemplaires)',
      'Formulaire de demande rempli',
      'Preuve de résidence en Libye'
    ],
    process: [
      'Remplir le formulaire de demande',
      'Fournir tous les documents requis',
      'Paiement des frais',
      'Traitement de la demande',
      'Retrait du document'
    ]
  },
  {
    title: 'Légalisation de documents',
    description: 'Authentification officielle de documents pour usage international',
    price: '20 dinars',
    duration: '1-2 jours',
    requirements: [
      'Document original à légaliser',
      'Copie certifiée conforme',
      'Traduction officielle (si nécessaire)',
      'Pièce d\'identité du demandeur',
      'Justificatif de domicile'
    ],
    process: [
      'Vérification de l\'authenticité du document',
      'Contrôle de la traduction (si applicable)',
      'Apposition du sceau officiel',
      'Enregistrement dans le registre',
      'Remise du document légalisé'
    ]
  },
  {
    title: 'Enrôlement biométrique',
    description: 'Création de carte d\'identité nationale biométrique',
    price: 'Gratuit',
    duration: '30-45 jours',
    requirements: [
      'Acte de naissance original',
      'Photo d\'identité récente (2 exemplaires)',
      'Empreintes digitales',
      'Justificatif de domicile',
      'Pièce d\'identité des parents (si mineur)'
    ],
    process: [
      'Prise de rendez-vous',
      'Prise des empreintes digitales',
      'Prise de photo d\'identité',
      'Vérification des documents',
      'Envoi des données au Mali',
      'Fabrication de la carte',
      'Retrait de la carte'
    ]
  }
]

export default function ServiceDetails() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Détails des Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Informations détaillées sur les services consulaires les plus demandés, 
            leurs procédures et les documents requis.
          </p>
        </motion.div>

        <div className="space-y-12">
          {serviceDetails.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Informations générales */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {service.description}
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-gold-600" />
                      <span className="font-semibold text-gray-900 dark:text-white">Tarif :</span>
                      <span className="text-gold-600 dark:text-gold-400 font-bold">
                        {service.price}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-secondary-600" />
                      <span className="font-semibold text-gray-900 dark:text-white">Délai :</span>
                      <span className="text-secondary-600 dark:text-secondary-400 font-bold">
                        {service.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Documents requis */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary-600" />
                    <span>Documents requis</span>
                  </h4>
                  <ul className="space-y-2">
                    {service.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Procédure */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Procédure à suivre
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {service.process.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {stepIndex + 1}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Informations importantes */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Informations importantes
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Horaires de service
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Dimanche - Jeudi : 8h00 - 15h00</li>
                <li>• Vendredi - Samedi : Fermé</li>
                <li>• Pause déjeuner : 12h00 - 13h00</li>
                <li>• Dernière admission : 14h30</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Conditions générales
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Paiement uniquement en dinars libyens</li>
                <li>• Documents en français ou arabe</li>
                <li>• Photos récentes (moins de 6 mois)</li>
                <li>• Réservation recommandée pour certains services</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
