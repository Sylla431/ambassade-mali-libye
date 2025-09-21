import { Metadata } from 'next'
import DocumentsListIntegrated from '@/components/pages/DocumentsListIntegrated'

export const metadata: Metadata = {
  title: 'Documents - Ambassade du Mali en Libye',
  description: 'Accédez aux formulaires, guides et documents officiels de l\'Ambassade du Mali en Libye.',
}

export default function DocumentsPage() {
  return <DocumentsListIntegrated />
}