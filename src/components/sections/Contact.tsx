'use client'

import { motion } from 'framer-motion'
import { Phone, MapPin, Clock, Mail, Send, MessageCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  subject: z.string().min(5, 'Le sujet doit contenir au moins 5 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactInfo = [
  {
    icon: Phone,
    title: 'Téléphone',
    details: [
      { text: '0918883403', isWhatsApp: true, phoneNumber: '218918883403' },
      { text: '0944831213', isWhatsApp: true, phoneNumber: '218944831213' }
    ],
    description: 'Appelez-nous ou contactez-nous sur WhatsApp'
  },
  {
    icon: MapPin,
    title: 'Adresse',
    details: ['Tripoli, Quartier Saraj'],
    description: 'Venez nous rendre visite'
  },
  {
    icon: Clock,
    title: 'Heures d\'ouverture',
    details: ['Dimanche - Jeudi', '8:00 - 15:00'],
    description: 'Nous sommes à votre service'
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['contact@ambassade-mali-libye.ml'],
    description: 'Envoyez-nous un message'
  }
]

const staffMembers = [
  {
    name: 'BOUBACAR SAMAKE',
    position: 'Assistant Administratif',
    email: '',
    phone: ''
  },
  {
    name: 'MOHAMED TALEB SAYED ALI',
    position: 'Assistant Administratif',
    email: '',
    phone: '-'
  },
  {
    name: 'MARIAM DIALLO OUMAR',
    position: 'Secrétaire',
    email: '',
    phone: ''
  },
  {
    name: 'SOULEYMANE COULIBALY',
    position: 'Assistant Administratif',
    email: '',
    phone: ''
  },
  {
    name: 'SAYON FOFANA',
    position: 'Traducteur-Interprète',
    email: '',
    phone: ''
  },
  {
    name: 'KANY SANOGO',
    position: 'Assistante Administrative',
    email: '',
    phone: ''
  },
  {
    name: 'BOUBACAR DABO',
    position: 'Huissier',
    email: '',
    phone: ''
  },
  {
    name: 'ABDOULAYE TOURE',
    position: 'Chauffeur',
    email: '',
    phone: ''
  },
  {
    name: 'DRAMANE KENE',
    position: 'Chauffeur',
    email: '',
    phone: ''
  },
  {
    name: 'OUMAR DIARRA',
    position: 'Chauffeur',
    email: '',
    phone: ''
  },
  {
    name: 'DRAMANE DIARRA',
    position: 'Gardien-Chancellerie',
    email: '',
    phone: ''
  },
  {
    name: 'YOUNOUSSA SIDI MAIGA',
    position: 'Planton',
    email: '',
    phone: ''
  },
  {
    name: 'YACOUBA TRAORE',
    position: 'Cuisinier-Résidence',
    email: '',
    phone: ''
  },
  {
    name: 'OUSMANE KELLY',
    position: 'Gardien-Résidence',
    email: '',
    phone: ''
  },
  {
    name: 'FANTA DOUMBIA',
    position: 'Chargée de Ménage Chancellerie',
    email: '',
    phone: ''
  }
]

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulation d'envoi de formulaire
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Données du formulaire:', data)
      alert('Message envoyé avec succès !')
      reset()
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.')
    }
  }

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
            Contactez-nous
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Vous avez des questions ? Appelez-nous ou visitez-nous. Notre équipe est là pour vous aider 
            avec tous vos besoins consulaires.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Informations de contact
              </h3>
              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                      <info.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {info.title}
                      </h4>
                      {info.details.map((detail, detailIndex) => {
                        const isDetailObject = typeof detail === 'object' && detail !== null && 'text' in detail;
                        const detailText = isDetailObject ? detail.text : detail;
                        const isWhatsApp = isDetailObject && detail.isWhatsApp;
                        const phoneNumber = isDetailObject ? detail.phoneNumber : null;

                        if (isWhatsApp && phoneNumber) {
                          return (
                            <a
                              key={detailIndex}
                              href={`https://wa.me/${phoneNumber}?text=Bonjour, je souhaite obtenir des informations sur les services de l'Ambassade du Mali à Tripoli.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-mali-green-600 dark:text-mali-green-400 hover:text-mali-green-700 dark:hover:text-mali-green-300 transition-colors cursor-pointer hover:underline"
                            >
                              <span>{detailText}</span>
                              <MessageCircle className="h-4 w-4 text-green-500" />
                            </a>
                          );
                        }

                        return (
                          <p key={detailIndex} className="text-gray-600 dark:text-gray-400">
                            {detailText}
                          </p>
                        );
                      })}
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

          {/* Formulaire de contact */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Envoyez-nous un message
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom complet *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Votre nom"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="votre@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone *
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Votre numéro de téléphone"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sujet *
                  </label>
                  <input
                    {...register('subject')}
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Sujet de votre message"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    {...register('message')}
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Votre message..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary inline-flex items-center justify-center space-x-2 text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section séparée pour la liste des contractuels */}
      <div className="container-custom mt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            LISTE ACTUALISÉE DES CONTRACTUELS DE L'AMBASSADE DU MALI
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Personnel contractuel de l'Ambassade de la République du Mali en Libye
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {staffMembers.map((member, index) => (
            <div key={index} className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                {member.name}
              </h4>
              <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                {member.position}
              </p>
              {member.email && (
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Email:</strong> {member.email}</p>
                </div>
              )}
              {member.phone && member.phone !== '-' && (
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Téléphone:</strong> {member.phone}</p>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
