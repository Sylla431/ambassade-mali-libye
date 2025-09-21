import { Metadata } from 'next'
import ArticlesListIntegrated from '@/components/pages/ArticlesListIntegrated'

export const metadata: Metadata = {
  title: 'Articles - Ambassade du Mali en Libye',
  description: 'Découvrez tous les articles et actualités de l\'Ambassade du Mali en Libye.',
}

export default function ArticlesPage() {
  return <ArticlesListIntegrated />
}
