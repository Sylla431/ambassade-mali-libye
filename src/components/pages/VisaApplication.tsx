'use client'

import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, FileText, User, Calendar, MapPin, CreditCard } from 'lucide-react'

const visaSchema = z.object({
  // Informations personnelles
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  birthDate: z.string().min(1, 'La date de naissance est requise'),
  birthPlace: z.string().min(2, 'Le lieu de naissance est requis'),
  nationality: z.string().min(2, 'La nationalité est requise'),
  passportNumber: z.string().min(5, 'Le numéro de passeport est requis'),
  passportIssueDate: z.string().min(1, 'La date d\'émission est requise'),
  passportExpiryDate: z.string().min(1, 'La date d\'expiration est requise'),
  
  // Informations de voyage
  purposeOfVisit: z.string().min(5, 'Le motif de visite est requis'),
  intendedArrivalDate: z.string().min(1, 'La date d\'arrivée prévue est requise'),
  intendedDepartureDate: z.string().min(1, 'La date de départ prévue est requise'),
  accommodation: z.string().min(5, 'L\'adresse d\'hébergement est requise'),
  
  // Contact
  email: z.string().email('Adresse email invalide'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  address: z.string().min(10, 'L\'adresse complète est requise'),
  
  // Documents
  hasInvitationLetter: z.boolean(),
  hasHotelReservation: z.boolean(),
  hasReturnTicket: z.boolean(),
  hasFinancialProof: z.boolean(),
})

type VisaFormData = z.infer<typeof visaSchema>

const visaTypes = [
  { value: 'tourisme', label: 'Visa Tourisme' },
  { value: 'affaires', label: 'Visa Affaires' },
  { value: 'transit', label: 'Visa Transit' },
  { value: 'diplomatique', label: 'Visa Diplomatique' },
  { value: 'officiel', label: 'Visa Officiel' },
]

const visaDurations = [
  { value: '30', label: '30 jours' },
  { value: '90', label: '90 jours' },
  { value: '180', label: '180 jours' },
  { value: '365', label: '1 an' },
]

export default function VisaApplication() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<VisaFormData>({
    resolver: zodResolver(visaSchema),
    defaultValues: {
      hasInvitationLetter: false,
      hasHotelReservation: false,
      hasReturnTicket: false,
      hasFinancialProof: false,
    }
  })

  const onSubmit = async (data: VisaFormData) => {
    try {
      // Simulation d'envoi de formulaire
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Données du formulaire visa:', data)
      alert('Demande de visa soumise avec succès ! Vous recevrez une confirmation par email.')
      reset()
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
      alert('Erreur lors de l\'envoi de la demande. Veuillez réessayer.')
    }
  }

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
            Demande de Visa
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Remplissez ce formulaire pour demander votre visa d'entrée au Mali. 
            Assurez-vous d'avoir tous les documents requis avant de soumettre votre demande.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Informations personnelles */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Informations personnelles
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prénom *
                    </label>
                    <input
                      {...register('firstName')}
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Votre prénom"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom *
                    </label>
                    <input
                      {...register('lastName')}
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Votre nom"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date de naissance *
                    </label>
                    <input
                      {...register('birthDate')}
                      type="date"
                      id="birthDate"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    {errors.birthDate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.birthDate.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Lieu de naissance *
                    </label>
                    <input
                      {...register('birthPlace')}
                      type="text"
                      id="birthPlace"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ville, Pays"
                    />
                    {errors.birthPlace && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.birthPlace.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nationalité *
                    </label>
                    <input
                      {...register('nationality')}
                      type="text"
                      id="nationality"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Votre nationalité"
                    />
                    {errors.nationality && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.nationality.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations passeport */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
                    <FileText className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Informations passeport
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Numéro de passeport *
                    </label>
                    <input
                      {...register('passportNumber')}
                      type="text"
                      id="passportNumber"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Numéro de passeport"
                    />
                    {errors.passportNumber && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.passportNumber.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="passportIssueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date d'émission *
                    </label>
                    <input
                      {...register('passportIssueDate')}
                      type="date"
                      id="passportIssueDate"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    {errors.passportIssueDate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.passportIssueDate.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="passportExpiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date d'expiration *
                    </label>
                    <input
                      {...register('passportExpiryDate')}
                      type="date"
                      id="passportExpiryDate"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    {errors.passportExpiryDate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.passportExpiryDate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations de voyage */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gold-100 dark:bg-gold-900 rounded-lg">
                    <MapPin className="h-6 w-6 text-gold-600 dark:text-gold-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Informations de voyage
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="purposeOfVisit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Motif de visite *
                    </label>
                    <textarea
                      {...register('purposeOfVisit')}
                      id="purposeOfVisit"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Décrivez le motif de votre visite au Mali"
                    />
                    {errors.purposeOfVisit && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.purposeOfVisit.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="intendedArrivalDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date d'arrivée prévue *
                      </label>
                      <input
                        {...register('intendedArrivalDate')}
                        type="date"
                        id="intendedArrivalDate"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      {errors.intendedArrivalDate && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.intendedArrivalDate.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="intendedDepartureDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date de départ prévue *
                      </label>
                      <input
                        {...register('intendedDepartureDate')}
                        type="date"
                        id="intendedDepartureDate"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      {errors.intendedDepartureDate && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.intendedDepartureDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Adresse d'hébergement *
                    </label>
                    <textarea
                      {...register('accommodation')}
                      id="accommodation"
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Adresse complète de votre hébergement au Mali"
                    />
                    {errors.accommodation && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.accommodation.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations de contact */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Informations de contact
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
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
                  
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Adresse complète *
                    </label>
                    <textarea
                      {...register('address')}
                      id="address"
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Votre adresse complète"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents requis */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
                    <FileText className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Documents requis
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      {...register('hasInvitationLetter')}
                      type="checkbox"
                      id="hasInvitationLetter"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasInvitationLetter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Lettre d'invitation (si applicable)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      {...register('hasHotelReservation')}
                      type="checkbox"
                      id="hasHotelReservation"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasHotelReservation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Réservation d'hôtel
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      {...register('hasReturnTicket')}
                      type="checkbox"
                      id="hasReturnTicket"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasReturnTicket" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Billet de retour
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      {...register('hasFinancialProof')}
                      type="checkbox"
                      id="hasFinancialProof"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasFinancialProof" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Justificatif de ressources financières
                    </label>
                  </div>
                </div>
              </div>

              {/* Soumission */}
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Frais de visa : 400 dinars
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Les frais de visa sont payables uniquement en dinars libyens lors de la soumission 
                  de votre demande à l'ambassade.
                </p>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary inline-flex items-center justify-center space-x-2 text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Soumission en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Soumettre la demande de visa</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
