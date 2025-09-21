import { Metadata } from 'next'
import VisaApplicationForm from '@/components/forms/VisaApplicationForm'
import VisaRequirements from '@/components/pages/VisaRequirements'

export const metadata: Metadata = {
  title: 'Demande de Visa - Ambassade du Mali en Libye',
  description: 'Demandez votre visa pour le Mali en ligne. Informations sur les documents requis, tarifs et procédures.',
}

export default function VisaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Demande de Visa
          </h1>
          <p className="text-xl text-gray-600">
            Remplissez ce formulaire pour soumettre votre demande de visa pour le Mali.
          </p>
        </div>
        <VisaApplicationForm />
        <div className="mt-16">
          <VisaRequirements />
        </div>
      </div>
    </div>
  )
}
