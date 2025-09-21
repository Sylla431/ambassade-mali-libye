'use client'

import { motion } from 'framer-motion'
import { FileText, Clock, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'

const visaTypes = [
  {
    type: 'Visa Tourisme',
    duration: '30 jours',
    price: '400 dinars',
    description: 'Pour les visites touristiques et familiales',
    requirements: [
      'Passeport valide (minimum 6 mois)',
      'Formulaire de demande rempli',
      'Photo d\'identité récente (2 exemplaires)',
      'Réservation d\'hôtel ou lettre d\'invitation',
      'Billet de retour ou de continuation',
      'Justificatif de ressources financières',
      'Assurance voyage'
    ]
  },
  {
    type: 'Visa Affaires',
    duration: '90 jours',
    price: '400 dinars',
    description: 'Pour les voyages d\'affaires et professionnels',
    requirements: [
      'Passeport valide (minimum 6 mois)',
      'Formulaire de demande rempli',
      'Photo d\'identité récente (2 exemplaires)',
      'Lettre d\'invitation de l\'entreprise malienne',
      'Attestation de travail',
      'Billet de retour',
      'Justificatif de ressources financières'
    ]
  },
  {
    type: 'Visa Transit',
    duration: '7 jours',
    price: '200 dinars',
    description: 'Pour le transit vers un autre pays',
    requirements: [
      'Passeport valide (minimum 6 mois)',
      'Formulaire de demande rempli',
      'Photo d\'identité récente (2 exemplaires)',
      'Billet de continuation vers le pays de destination',
      'Visa du pays de destination (si requis)',
      'Justificatif de ressources financières'
    ]
  }
]

const processingTimes = [
  { type: 'Traitement normal', duration: '5-7 jours ouvrés', price: '400 dinars' },
  { type: 'Traitement express', duration: '2-3 jours ouvrés', price: '600 dinars' },
  { type: 'Traitement urgent', duration: '24 heures', price: '800 dinars' }
]

export default function VisaRequirements() {
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
            Exigences et Types de Visa
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez les différents types de visas disponibles, leurs exigences 
            et les délais de traitement pour votre voyage au Mali.
          </p>
        </motion.div>

        {/* Types de visas */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {visaTypes.map((visa, index) => (
            <motion.div
              key={visa.type}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {visa.type}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {visa.description}
                </p>
                <div className="flex justify-center space-x-4">
                  <div className="text-center">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-secondary-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Durée</span>
                    </div>
                    <p className="text-secondary-600 dark:text-secondary-400 font-bold">
                      {visa.duration}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-gold-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prix</span>
                    </div>
                    <p className="text-gold-600 dark:text-gold-400 font-bold">
                      {visa.price}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-primary-600" />
                  <span>Documents requis</span>
                </h4>
                <ul className="space-y-2">
                  {visa.requirements.map((req, reqIndex) => (
                    <li key={reqIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Délais de traitement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="card p-8 mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Délais de Traitement
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {processingTimes.map((processing, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {processing.type}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="h-4 w-4 text-secondary-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {processing.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gold-600" />
                    <span className="font-bold text-gold-600 dark:text-gold-400">
                      {processing.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Informations importantes */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Avis importants */}
          <div className="card p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
                Avis Importants
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
              <li>• Les délais peuvent varier selon la période</li>
              <li>• Vérifiez la validité de votre passeport</li>
              <li>• Les documents doivent être en français ou arabe</li>
              <li>• Paiement uniquement en dinars libyens</li>
              <li>• Réservation recommandée pour les demandes urgentes</li>
            </ul>
          </div>

          {/* Conseils pratiques */}
          <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                Conseils Pratiques
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>• Préparez tous les documents à l'avance</li>
              <li>• Vérifiez les dates de validité</li>
              <li>• Faites des copies de tous les documents</li>
              <li>• Arrivez tôt pour éviter l'attente</li>
              <li>• Gardez les reçus de paiement</li>
            </ul>
          </div>
        </motion.div>

        {/* Contact pour assistance */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="card p-8 bg-primary-50 dark:bg-primary-900/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Besoin d'aide ?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Notre équipe consulaire est là pour vous accompagner dans vos démarches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:0918883403"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Appeler : 0918883403</span>
              </a>
              <a
                href="/contact"
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <span>Nous contacter</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
