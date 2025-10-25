import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import EventDetail from '@/components/pages/EventDetail'
import { prisma } from '@/lib/prisma'

interface EventDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      select: {
        title: true,
        titleAr: true,
        description: true,
        startDate: true,
        location: true
      }
    })

    if (!event) {
      return {
        title: 'Événement non trouvé - Ambassade du Mali en Libye'
      }
    }

    return {
      title: `${event.title} - Ambassade du Mali en Libye`,
      description: event.description?.substring(0, 160) || 'Détails de l\'événement de l\'Ambassade du Mali en Libye'
    }
  } catch (error) {
    return {
      title: 'Événement - Ambassade du Mali en Libye'
    }
  }
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true
          }
        },
        gallery: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!event) {
      notFound()
    }

    // Vérifier si l'événement est publié
    if (!event.published) {
      notFound()
    }

    return <EventDetail event={event} />
  } catch (error) {
    console.error('Erreur lors du chargement de l\'événement:', error)
    notFound()
  }
}
