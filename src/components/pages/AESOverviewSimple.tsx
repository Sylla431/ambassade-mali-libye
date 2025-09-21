'use client'

import { motion } from 'framer-motion'
import { Shield, Users, Globe, Calendar, MapPin, Target, Heart, TrendingUp, Award, FileText, ArrowRight, CheckCircle, Star, Clock, Flag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AESOverviewSimple() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-mali-green-50 via-mali-gold-50 to-mali-red-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Confédération des États du Sahel
              <span className="block text-mali-green-600 dark:text-mali-green-400">(AES)</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Organisation régionale créée le <strong>16 septembre 2023</strong> par le <strong>Mali, le Burkina Faso et le Niger</strong>, 
              à travers la <strong>Charte du Liptako-Gourma</strong>. Elle vise à promouvoir une coopération renforcée en matière de 
              sécurité, de défense, de développement et de souveraineté régionale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* À propos */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              À propos de l'AES
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
              <p className="text-lg leading-relaxed mb-6">
                Née dans un contexte de défis sécuritaires majeurs et de ruptures diplomatiques avec certaines institutions régionales, 
                l'AES incarne la volonté de ses États membres de bâtir un espace stable, autonome et solidaire, fondé sur le respect 
                des trajectoires nationales et l'intégration des peuples sahéliens.
              </p>
              <p className="text-lg leading-relaxed">
                L'AES s'inscrit comme une <strong>alternative souveraine</strong> aux modèles de coopération traditionnels, 
                avec une vision centrée sur l'Afrique, la dignité, et l'efficacité.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chronologie */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Chronologie de l'Alliance des États du Sahel
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Le début marquant d'une coopération
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* 2023 - Création */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-start space-x-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-mali-green-600 rounded-full flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-mali-green-600">2023</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">16 septembre</span>
                    </div>
                    <div className="mb-4">
                      <div className="w-full h-48 bg-gradient-to-br from-mali-green-100 to-mali-gold-100 dark:from-mali-green-900 dark:to-mali-gold-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <Image
                          src="/images/aes/creation-aes-2023.jpg"
                          alt="Signature de la Charte du Liptako-Gourma à Bamako"
                          fill
                          className="object-cover opacity-20"
                        />
                        <div className="text-center relative z-10">
                          <FileText className="h-16 w-16 text-mali-green-600 mx-auto mb-2" />
                          <p className="text-sm text-mali-green-700 dark:text-mali-green-300 font-medium">
                            Signature de la Charte
                          </p>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      Création de l'AES
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Signature à Bamako de la Charte du Liptako-Gourma entre le Mali, le Burkina Faso et le Niger. 
                      <strong> Objectif :</strong> établir une alliance de défense collective et de coopération stratégique.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Octobre - Novembre 2023 */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-start space-x-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-mali-gold-600 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-lg font-bold text-mali-gold-600">Octobre - Novembre 2023</span>
                    </div>
                    <div className="mb-4">
                      <div className="w-full h-48 bg-gradient-to-br from-mali-gold-100 to-mali-red-100 dark:from-mali-gold-900 dark:to-mali-red-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <Image
                          src="/images/aes/cooperation-securitaire-2023.jpg"
                          alt="Coopération sécuritaire entre les forces armées"
                          fill
                          className="object-cover opacity-20"
                        />
                        <div className="text-center relative z-10">
                          <Shield className="h-16 w-16 text-mali-gold-600 mx-auto mb-2" />
                          <p className="text-sm text-mali-gold-700 dark:text-mali-gold-300 font-medium">
                            Coopération Sécuritaire
                          </p>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      Déploiement de la coopération sécuritaire
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Coordination accrue des forces armées nationales contre les groupes armés terroristes. 
                      Début d'opérations militaires conjointes dans les zones frontalières.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 13 janvier 2024 */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-start space-x-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-mali-red-600 rounded-full flex items-center justify-center">
                    <Flag className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-lg font-bold text-mali-red-600">13 janvier 2024</span>
                    </div>
                    <div className="mb-4">
                      <div className="w-full h-48 bg-gradient-to-br from-mali-red-100 to-mali-green-100 dark:from-mali-red-900 dark:to-mali-green-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <Image
                          src="/images/aes/retrait-cedeao-2024.jpg"
                          alt="Annonce du retrait de la CEDEAO"
                          fill
                          className="object-cover opacity-20"
                        />
                        <div className="text-center relative z-10">
                          <Flag className="h-16 w-16 text-mali-red-600 mx-auto mb-2" />
                          <p className="text-sm text-mali-red-700 dark:text-mali-red-300 font-medium">
                            Retrait CEDEAO
                          </p>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      Annonce officielle du retrait de la CEDEAO
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Les trois États membres de l'AES notifient leur décision de quitter la CEDEAO, en dénonçant des sanctions 
                      jugées injustes et un manque de soutien face aux défis sécuritaires. 
                      <strong> Le retrait est qualifié de souverain et irréversible.</strong>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Février – Mai 2024 */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-start space-x-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-mali-green-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-lg font-bold text-mali-green-600">Février – Mai 2024</span>
                    </div>
                    <div className="mb-4">
                      <div className="w-full h-48 bg-gradient-to-br from-mali-green-100 to-mali-gold-100 dark:from-mali-green-900 dark:to-mali-gold-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <Image
                          src="/images/aes/coordination-regionale-2024.jpg"
                          alt="Coordination régionale et comités techniques"
                          fill
                          className="object-cover opacity-20"
                        />
                        <div className="text-center relative z-10">
                          <TrendingUp className="h-16 w-16 text-mali-green-600 mx-auto mb-2" />
                          <p className="text-sm text-mali-green-700 dark:text-mali-green-300 font-medium">
                            Coordination Régionale
                          </p>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      Accélération de la coordination régionale
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Mise en place de comités techniques pour l'harmonisation des politiques de défense, d'infrastructure, 
                      de commerce et d'éducation. Discussions sur l'adoption d'outils économiques communs, comme une zone 
                      de libre-échange ou une monnaie commune à long terme.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles AES */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Dernières Nouvelles sur l'AES
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Découvrez les dernières actualités et publications sur l'Alliance des États du Sahel
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Article 1 */}
            <motion.article
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="card overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-mali-green-100 to-mali-gold-100 dark:from-mali-green-900 dark:to-mali-gold-900 flex items-center justify-center relative">
                <Image
                  src="/images/aes/rencontre-mali-burkina-tripoli.jpg"
                  alt="Rencontre entre les Représentants du Mali et du Burkina Faso à Tripoli"
                  fill
                  className="object-cover opacity-20"
                />
                <div className="text-center relative z-10">
                  <Users className="h-16 w-16 text-mali-green-600 mx-auto mb-2" />
                  <p className="text-sm text-mali-green-700 dark:text-mali-green-300 font-medium">
                    Rencontre Diplomatique
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-mali-green-100 dark:bg-mali-green-900 text-mali-green-800 dark:text-mali-green-200 text-xs font-medium rounded-full">
                    AES
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">13 juin 2025</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  Rencontre entre les Représentants du Mali et du Burkina Faso à Tripoli
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  Échanges fructueux entre les délégations malienne et burkinabé sur les questions de coopération régionale et les défis sécuritaires communs.
                </p>
                <Link
                  href="/articles/rencontre-mali-burkina-tripoli"
                  className="inline-flex items-center space-x-1 text-mali-green-600 dark:text-mali-green-400 font-medium text-sm hover:text-mali-green-700 dark:hover:text-mali-green-300 transition-colors"
                >
                  <span>Lire la suite</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.article>

            {/* Article 2 */}
            <motion.article
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="card overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-mali-gold-100 to-mali-red-100 dark:from-mali-gold-900 dark:to-mali-red-900 flex items-center justify-center relative">
                <Image
                  src="/images/aes/alliance-etats-sahel.jpg"
                  alt="Alliance des États du Sahel"
                  fill
                  className="object-cover opacity-20"
                />
                <div className="text-center relative z-10">
                  <Globe className="h-16 w-16 text-mali-gold-600 mx-auto mb-2" />
                  <p className="text-sm text-mali-gold-700 dark:text-mali-gold-300 font-medium">
                    Alliance Régionale
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-mali-gold-100 dark:bg-mali-gold-900 text-mali-gold-800 dark:text-mali-gold-200 text-xs font-medium rounded-full">
                    AES
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">11 juin 2025</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  Alliance des États du Sahel
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  Analyse approfondie des objectifs et des réalisations de l'Alliance des États du Sahel depuis sa création.
                </p>
                <Link
                  href="/articles/alliance-etats-sahel"
                  className="inline-flex items-center space-x-1 text-mali-green-600 dark:text-mali-green-400 font-medium text-sm hover:text-mali-green-700 dark:hover:text-mali-green-300 transition-colors"
                >
                  <span>Lire la suite</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.article>

            {/* Article 3 */}
            <motion.article
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="card overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-mali-red-100 to-mali-green-100 dark:from-mali-red-900 dark:to-mali-green-900 flex items-center justify-center relative">
                <Image
                  src="/images/aes/cooperation-sahelienne.jpg"
                  alt="Coopération Sahelienne"
                  fill
                  className="object-cover opacity-20"
                />
                <div className="text-center relative z-10">
                  <Heart className="h-16 w-16 text-mali-red-600 mx-auto mb-2" />
                  <p className="text-sm text-mali-red-700 dark:text-mali-red-300 font-medium">
                    Coopération
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-mali-red-100 dark:bg-mali-red-900 text-mali-red-800 dark:text-mali-red-200 text-xs font-medium rounded-full">
                    AES
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">11 juin 2025</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  Renforcement de la Coopération Sahelienne
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  Les nouvelles initiatives de coopération entre les pays membres de l'AES pour faire face aux défis communs.
                </p>
                <Link
                  href="/articles/cooperation-sahelienne"
                  className="inline-flex items-center space-x-1 text-mali-green-600 dark:text-mali-green-400 font-medium text-sm hover:text-mali-green-700 dark:hover:text-mali-green-300 transition-colors"
                >
                  <span>Lire la suite</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.article>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/articles?category=aes"
              className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>Voir tous les articles AES</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pays membres */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Pays Membres Fondateurs
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Les trois États du Sahel unis pour la souveraineté et le développement
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="card p-8 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-6xl mb-4">🇲🇱</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mali</h3>
              <p className="text-mali-green-600 dark:text-mali-green-400 font-semibold mb-3">Membre fondateur</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Capitale: Bamako<br />
                Population: 21,9 millions<br />
                Superficie: 1,24 million km²
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="card p-8 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-6xl mb-4">🇧🇫</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Burkina Faso</h3>
              <p className="text-mali-green-600 dark:text-mali-green-400 font-semibold mb-3">Membre fondateur</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Capitale: Ouagadougou<br />
                Population: 21,5 millions<br />
                Superficie: 274 200 km²
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="card p-8 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-6xl mb-4">🇳🇪</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Niger</h3>
              <p className="text-mali-green-600 dark:text-mali-green-400 font-semibold mb-3">Membre fondateur</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Capitale: Niamey<br />
                Population: 25,1 millions<br />
                Superficie: 1,27 million km²
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-gradient-to-br from-mali-green-50 via-mali-gold-50 to-mali-red-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="text-center"
          >
            <div className="card p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Pour plus d'informations sur l'AES
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Contactez l'Ambassade du Mali en Libye pour toute question concernant l'Alliance des États du Sahel 
                et les opportunités de coopération.
              </p>
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Nous Contacter</span>
                <Heart className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
