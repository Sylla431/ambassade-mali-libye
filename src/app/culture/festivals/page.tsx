'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Music,
  Star,
  ArrowRight,
  Clock,
  Globe,
  Camera,
  Heart
} from 'lucide-react'

interface Festival {
  id: string
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  imageUrl: string
  location: string
  date: string
  duration: string
  category: 'musique' | 'culturel' | 'religieux' | 'traditionnel'
  significance: string
  highlights: string[]
}

const festivalsData: Festival[] = [
  {
    id: '1',
    title: 'Festival au Désert',
    titleAr: 'مهرجان الصحراء',
    description: 'Le Festival au Désert est l\'un des plus grands festivals de musique du monde, célébrant la culture touarègue et la musique du désert.',
    descriptionAr: 'مهرجان الصحراء هو واحد من أكبر مهرجانات الموسيقى في العالم، يحتفل بالثقافة الطوارقية وموسيقى الصحراء.',
    imageUrl: '/images/culture_tourisme/dessert.avif',
    location: 'Essakane, près de Tombouctou',
    date: 'Janvier',
    duration: '3 jours',
    category: 'musique',
    significance: 'Festival International',
    highlights: ['Musique touarègue', 'Artistes internationaux', 'Campement dans le désert']
  },
  {
    id: '2',
    title: 'Festival sur le Niger',
    titleAr: 'مهرجان النيجر',
    description: 'Ce festival célèbre la culture du fleuve Niger avec des spectacles de musique, danse et artisanat traditionnel.',
    descriptionAr: 'هذا المهرجان يحتفل بثقافة نهر النيجر مع عروض موسيقية ورقص وحرف تقليدية.',
    imageUrl: '/images/culture_tourisme/niger.jpg',
    location: 'Ségou',
    date: 'Février',
    duration: '4 jours',
    category: 'culturel',
    significance: 'Festival National',
    highlights: ['Spectacles sur le fleuve', 'Artisanat local', 'Cuisine traditionnelle']
  },
  {
    id: '3',
    title: 'Festival des Masques',
    titleAr: 'مهرجان الأقنعة',
    description: 'Célébration des traditions dogon avec des danses de masques et des rituels ancestraux.',
    descriptionAr: 'احتفال بتقاليد الدوغون مع رقصات الأقنعة والطقوس الأسلافية.',
    imageUrl: '/images/culture_tourisme/masques.jpg',
    location: 'Pays Dogon',
    date: 'Avril-Mai',
    duration: '1 semaine',
    category: 'traditionnel',
    significance: 'Patrimoine Culturel',
    highlights: ['Danses de masques', 'Rituels dogon', 'Architecture traditionnelle']
  },
//   {
//     id: '4',
//     title: 'Tabaski (Aïd al-Adha)',
//     titleAr: 'عيد الأضحى',
//     description: 'La plus importante fête religieuse musulmane, célébrée dans tout le Mali avec des prières et des festivités familiales.',
//     descriptionAr: 'أهم عيد ديني إسلامي، يُحتفل به في جميع أنحاء مالي مع الصلوات والاحتفالات العائلية.',
//     imageUrl: '/images/culture_tourisme/tabaski-celebration.jpg',
//     location: 'Tout le Mali',
//     date: 'Variable (calendrier lunaire)',
//     duration: '3 jours',
//     category: 'religieux',
//     significance: 'Fête Religieuse',
//     highlights: ['Prières communautaires', 'Partage de viande', 'Vêtements traditionnels']
//   },
  {
    id: '5',
    title: 'Festival de la Paix',
    titleAr: 'مهرجان السلام',
    description: 'Célébration de la paix et de la réconciliation à travers la musique, la danse et les arts.',
    descriptionAr: 'احتفال بالسلام والمصالحة من خلال الموسيقى والرقص والفنون.',
    imageUrl: '/images/culture_tourisme/paix.jpeg',
    location: 'Bamako',
    date: 'Décembre',
    duration: '2 jours',
    category: 'culturel',
    significance: 'Message de Paix',
    highlights: ['Artistes de toutes les régions', 'Messages de paix', 'Solidarité nationale']
  },
  {
    id: '6',
    title: 'Festival du Dromadaire',
    titleAr: 'مهرجان الجمل',
    description: 'Compétitions de dromadaires, courses et démonstrations de l\'art de vivre nomade.',
    descriptionAr: 'مسابقات الجمال والسباقات وعروض فن العيش البدوي.',
    imageUrl: '/images/culture_tourisme/drom.jpg',
    location: 'Tombouctou',
    date: 'Mars',
    duration: '2 jours',
    category: 'traditionnel',
    significance: 'Culture Nomade',
    highlights: ['Courses de dromadaires', 'Artisanat nomade', 'Poésie touarègue']
  }
]

const categories = [
  { id: 'all', name: 'Tous les festivals', icon: Globe },
  { id: 'musique', name: 'Musique', icon: Music },
  { id: 'culturel', name: 'Culturel', icon: Camera },
  { id: 'religieux', name: 'Religieux', icon: Heart },
  { id: 'traditionnel', name: 'Traditionnel', icon: Users }
]

export default function FestivalsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredFestivals, setFilteredFestivals] = useState(festivalsData)

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredFestivals(festivalsData)
    } else {
      setFilteredFestivals(festivalsData.filter(festival => festival.category === selectedCategory))
    }
  }, [selectedCategory])

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.icon : Globe
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      musique: 'bg-blue-100 text-blue-800',
      culturel: 'bg-green-100 text-green-800',
      religieux: 'bg-purple-100 text-purple-800',
      traditionnel: 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getMonthColor = (month: string) => {
    const colors = {
      'Janvier': 'bg-blue-500',
      'Février': 'bg-green-500',
      'Mars': 'bg-yellow-500',
      'Avril-Mai': 'bg-purple-500',
      'Décembre': 'bg-red-500',
      'Variable': 'bg-gray-500'
    }
    return colors[month as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-mali-green-600 via-mali-gold-600 to-mali-red-600 text-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Festivals du Mali
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Célébrez la richesse culturelle et musicale du Mali
            </p>
            <p className="text-lg text-gray-200" dir="rtl">
              احتفل بالثراء الثقافي والموسيقي لمالي
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Une année de célébrations
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Le Mali vibre au rythme de ses festivals tout au long de l'année. 
              De la musique du désert aux traditions ancestrales, chaque festival 
              est une occasion de découvrir la diversité culturelle malienne.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed" dir="rtl">
              مالي تنبض بإيقاع مهرجاناتها طوال العام. من موسيقى الصحراء إلى التقاليد الأسلافية، 
              كل مهرجان فرصة لاكتشاف التنوع الثقافي المالي.
            </p>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-8 bg-gray-100">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-mali-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-mali-green-50 hover:text-mali-green-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Liste des festivals */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFestivals.map((festival) => {
              const CategoryIcon = getCategoryIcon(festival.category)
              return (
                <div key={festival.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-64">
                    <Image
                      src={festival.imageUrl}
                      alt={festival.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(festival.category)}`}>
                        <CategoryIcon className="w-4 h-4 inline mr-1" />
                        {categories.find(c => c.id === festival.category)?.name}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className={`${getMonthColor(festival.date)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                        {festival.date}
                      </div>
                    </div>
                    {festival.significance.includes('International') && (
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          <Star className="w-3 h-3 inline mr-1" />
                          International
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {festival.title}
                    </h3>
                    {festival.titleAr && (
                      <h4 className="text-lg font-semibold text-gray-700 mb-3" dir="rtl">
                        {festival.titleAr}
                      </h4>
                    )}
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {festival.description}
                    </p>
                    
                    {festival.descriptionAr && (
                      <p className="text-gray-600 mb-4 line-clamp-3" dir="rtl">
                        {festival.descriptionAr}
                      </p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {festival.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {festival.duration}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Points forts :</h5>
                      <div className="flex flex-wrap gap-1">
                        {festival.highlights.map((highlight, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-mali-green-600">
                        {festival.significance}
                      </span>
                      <button className="flex items-center text-mali-green-600 hover:text-mali-green-700 font-medium">
                        En savoir plus
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Calendrier des festivals */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Calendrier des Festivals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Janvier', 'Février', 'Mars', 'Avril-Mai', 'Décembre'].map((month) => {
                const monthFestivals = festivalsData.filter(f => f.date === month || (month === 'Avril-Mai' && f.date.includes('Avril')))
                return (
                  <div key={month} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                      {month}
                    </h3>
                    <div className="space-y-3">
                      {monthFestivals.map((festival) => (
                        <div key={festival.id} className="bg-white rounded-lg p-3 shadow-sm">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {festival.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {festival.location}
                          </p>
                        </div>
                      ))}
                      {monthFestivals.length === 0 && (
                        <p className="text-gray-500 text-sm text-center">
                          Aucun festival programmé
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-mali-green-600 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Participez aux festivals
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              Vivez l'expérience unique des festivals maliens
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-mali-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Programme détaillé
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-mali-green-600 transition-colors">
                Réservation
              </button>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  )
}
