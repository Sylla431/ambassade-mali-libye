import { Metadata } from 'next'
import EventsListIntegrated from '@/components/pages/EventsListIntegrated'

export const metadata: Metadata = {
  title: 'Événements - Ambassade du Mali en Libye',
  description: 'Découvrez tous les événements et activités de l\'Ambassade du Mali en Libye.',
}

export default function EventsPage() {
  return <EventsListIntegrated />
}
