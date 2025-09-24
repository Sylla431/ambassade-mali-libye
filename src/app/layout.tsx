import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ambassade de la République du Mali en Libye',
  description: 'Site officiel de l\'Ambassade de la République du Mali auprès de la Libye et de la République de Malte',
  keywords: 'Mali, Libye, Ambassade, Visa, Services consulaires, Tripoli',
  authors: [{ name: 'Ambassade du Mali en Libye' }],
  openGraph: {
    title: 'Ambassade de la République du Mali en Libye',
    description: 'Site officiel de l\'Ambassade de la République du Mali auprès de la Libye et de la République de Malte',
    type: 'website',
    locale: 'fr_FR',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}