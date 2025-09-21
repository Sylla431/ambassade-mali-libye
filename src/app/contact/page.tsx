import { Metadata } from 'next'
import ContactFormIntegrated from '@/components/forms/ContactFormIntegrated'

export const metadata: Metadata = {
  title: 'Contact - Ambassade du Mali en Libye',
  description: 'Contactez l\'Ambassade du Mali en Libye. Adresse, téléphone, email et formulaire de contact.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600">
            Nous sommes là pour vous aider. N'hésitez pas à nous contacter.
          </p>
        </div>
        <ContactFormIntegrated />
      </div>
    </div>
  )
}
