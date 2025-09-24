'use client'

import { motion } from 'framer-motion'
import { Crown, Users, Award, Mail, Phone, Star } from 'lucide-react'
import Image from 'next/image'

const leadership = [
  {
    id: 1,
    name: 'Son Excellence Général d\'Armée Assimi Goïta',
    position: 'Président de la Transition',
    image: '/images/leadership/president.jpg',
    description: 'Chef de l\'État de la République du Mali, dirigeant la transition et représentant suprême de la nation malienne.',
    email: '-',
    phone: '-',
    level: 'president'
  },
  {
    id: 2,
    name: 'SEM Abdoulaye Diop',
    position: 'Ministre des Affaires Étrangères',
    image: '/images/leadership/ministre.jpg',
    description: 'Responsable de la politique étrangère du Mali et des relations diplomatiques internationales.',
    email: 'ministre@affaires-etrangeres.ml',
    phone: '+223 XX XX XX XX',
    level: 'minister'
  },
  {
    id: 3,
    name: 'Pr Adama Diawara',
    position: 'Charge d\'Affaires',
    image: '/images/leadership/ambassadeur.jpg',
    description: 'Représentant officiel de la République du Mali auprès de la Libye et de la République de Malte.',
    email: 'charge@ambassade-mali-libye.ml',
    phone: '(+91)800238798',
    level: 'ambassador'
  }
]

const staff = [
  {
    id: 4,
    name: 'Ben',
    position: 'Conseiller, District 2',
    image: '/images/staff/ben.jpg',
    email: 'ben@ambassade-mali-libye.ml',
    phone: '(+91)8002354565'
  },
  {
    id: 5,
    name: 'Modibo Sylla',
    position: 'Conseiller, District 1',
    image: '/images/staff/modibo.jpg',
    email: 'modibo@ambassade-mali-libye.ml',
    phone: '(+91)8002352321'
  },
  {
    id: 6,
    name: 'Cevin Peter',
    position: 'Président du Conseil Municipal',
    image: '/images/staff/cevin.jpg',
    email: 'cevin@ambassade-mali-libye.ml',
    phone: '(+91)8002359595'
  },
  {
    id: 7,
    name: 'Aminata Traoré',
    position: 'Chargée des Affaires Consulaires',
    image: '/images/staff/aminata.jpg',
    email: 'aminata@ambassade-mali-libye.ml',
    phone: '(+91)8002359999'
  }
]

export default function Leadership() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Direction & Équipe
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez les dirigeants et l'équipe qui représentent la République du Mali 
            en Libye et œuvrent pour le service de nos ressortissants.
          </p>
        </motion.div>

        {/* Président - Section spéciale */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <div className="card-mali p-12 text-center">
              <div className="relative mb-8">
                <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-6 border-mali-gold-300 dark:border-mali-gold-700 shadow-2xl">
                  {leadership[0].image ? (
                    <Image
                      src={leadership[0].image}
                      alt={leadership[0].name}
                      width={256}
                      height={256}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-mali-green-100 to-mali-gold-100 dark:from-mali-green-900 dark:to-mali-gold-900 flex items-center justify-center">
                      <Star className="h-24 w-24 text-mali-gold-600 dark:text-mali-gold-400" />
                    </div>
                  )}
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-mali-gold-600 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-mali-green-800 dark:text-mali-green-200 mb-3">
                {leadership[0].name}
              </h3>
              <p className="text-xl text-mali-gold-600 dark:text-mali-gold-400 font-semibold mb-6">
                {leadership[0].position}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                {leadership[0].description}
              </p>
              
              {/* <div className="flex justify-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-mali-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{leadership[0].email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-mali-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{leadership[0].phone}</span>
                </div>
              </div> */}
            </div>
          </div>
        </motion.div>

        {/* Direction principale */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {leadership.slice(1).map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="card-mali p-8 text-center"
            >
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-mali-gold-200 dark:border-mali-gold-800">
                  {leader.image ? (
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      width={192}
                      height={192}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-mali-green-100 to-mali-gold-100 dark:from-mali-green-900 dark:to-mali-gold-900 flex items-center justify-center">
                      {leader.level === 'minister' ? (
                        <Crown className="h-20 w-20 text-mali-gold-600 dark:text-mali-gold-400" />
                      ) : (
                        <Award className="h-20 w-20 text-mali-green-600 dark:text-mali-green-400" />
                      )}
                    </div>
                  )}
                </div>
                {leader.level === 'minister' && (
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-mali-gold-600 rounded-full flex items-center justify-center">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-mali-green-800 dark:text-mali-green-200 mb-2">
                {leader.name}
              </h3>
              <p className="text-mali-gold-600 dark:text-mali-gold-400 font-semibold mb-4">
                {leader.position}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {leader.description}
              </p>
              
              {/* <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4 text-mali-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{leader.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4 text-mali-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{leader.phone}</span>
                </div>
              </div> */}
            </motion.div>
          ))}
        </div>

        {/* Équipe */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Notre Équipe
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {staff.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-mali-green-200 dark:border-mali-green-800">
                  <div className="w-full h-full bg-gradient-to-br from-mali-green-100 to-mali-gold-100 dark:from-mali-green-900 dark:to-mali-gold-900 flex items-center justify-center">
                    <Users className="h-10 w-10 text-mali-green-600 dark:text-mali-green-400" />
                  </div>
                </div>
                
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h4>
                <p className="text-mali-gold-600 dark:text-mali-gold-400 text-sm font-medium mb-3">
                  {member.position}
                </p>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <Mail className="h-3 w-3 text-mali-green-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{member.email}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Phone className="h-3 w-3 text-mali-green-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{member.phone}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
