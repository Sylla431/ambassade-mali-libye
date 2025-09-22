import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, Clock, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const footerLinks = {
  services: [
    { name: 'Demande de Visa', href: '/visa' },
    { name: 'Services Consulaires', href: '/services' },
    { name: 'Passeports', href: '/services/passeport' },
    { name: 'Légalisation', href: '/services/legalisation' },
  ],
  culture: [
    { name: 'Culture & Tourisme', href: '/culture' },
    { name: 'Patrimoine Malien', href: '/culture/patrimoine' },
    { name: 'Festivals', href: '/culture/festivals' },
    { name: 'Sites Touristiques', href: '/culture/tourisme' },
  ],
  information: [
    { name: 'Rubriques', href: '/articles' },
    { name: 'Événements', href: '/evenements' },
    { name: 'Investissements', href: '/investissements' },
    { name: 'AES', href: '/aes' },
    { name: 'Documents Officiels', href: '/documents' },
    { name: 'Contact', href: '/contact' },
  ]
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-mali-green-900 via-mali-gold-900 to-mali-red-900 text-white">
      <div className="container-custom py-16">
        <div className="flex items-start justify-between gap-12">
          {/* Sceau du Mali à l'extrême gauche */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <div className="relative w-36 h-36">
              <Image
                src="/images/seals/Armoiries_Mali-3-01-150x150-1.png"
                alt="Sceau de la République du Mali"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-300 text-sm text-center max-w-36">
              République du Mali
            </p>
          </div>

          {/* Contenu central avec les liens */}
          <div className="flex-1 grid lg:grid-cols-4 md:grid-cols-2 gap-10">
            {/* Informations de contact */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Ambassade du Mali</h3>
                <p className="text-gray-300 leading-relaxed">
                  Représentation officielle de la République du Mali auprès de la Libye 
                  et de la République de Malte.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-mali-gold-400" />
                  <span className="text-gray-300">Tripoli, Quartier Saraj</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-mali-gold-400" />
                  <span className="text-gray-300">0918883403 / 0944831213</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-mali-gold-400" />
                  <span className="text-gray-300">contact@ambassade-mali-libye.ml</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-mali-gold-400" />
                  <span className="text-gray-300">Dim - Jeu: 8:00 - 15:00</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-mali-gold-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Culture */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Culture & Tourisme</h3>
              <ul className="space-y-2">
                {footerLinks.culture.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-mali-gold-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Information</h3>
              <ul className="space-y-2">
                {footerLinks.information.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-mali-gold-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Réseaux sociaux */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">Suivez-nous</h4>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className="p-2 bg-gray-800 hover:bg-mali-gold-600 rounded-lg transition-colors"
                      aria-label={social.name}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sceau de l'AES à l'extrême droite */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <div className="relative w-36 h-36">
              <Image
                src="/images/seals/Logo_of_the_Alliance_of_Sahel_States-removebg-preview (1).png"
                alt="Sceau de l'Alliance des États du Sahel"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-300 text-sm text-center max-w-36">
              Confédération des États du Sahel
            </p>
          </div>
        </div>
      </div>


      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Ambassade de la République du Mali au pres de la Libye et de la Malte. 
              Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/mentions-legales" className="text-gray-400 hover:text-mali-gold-400 text-sm transition-colors">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="text-gray-400 hover:text-mali-gold-400 text-sm transition-colors">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
