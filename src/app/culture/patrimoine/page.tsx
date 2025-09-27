'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  ArrowRight,
  Globe,
  BookOpen,
  Camera
} from 'lucide-react'

interface PatrimoineItem {
  id: string
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  imageUrl: string
  location: string
  period: string
  significance: string
  category: 'monument' | 'site' | 'art' | 'tradition'
}

const patrimoineData: PatrimoineItem[] = [
  {
    id: '1',
    title: 'Mosquée de Djenné',
    titleAr: 'مسجد جينيه',
    description: 'La Grande Mosquée de Djenné est le plus grand édifice en terre crue du monde et un chef-d\'œuvre de l\'architecture soudano-sahélienne.',
    descriptionAr: 'الجامع الكبير في جينيه هو أكبر مبنى من الطين في العالم وتحفة من العمارة السودانية الساحلية.',
    imageUrl: '/images/culture_tourisme/djenne.jpg',
    location: 'Djenné, Région de Mopti',
    period: 'XIIIe siècle',
    significance: 'Patrimoine Mondial UNESCO',
    category: 'monument'
  },
  {
    id: '2',
    title: 'Tombeau des Askia',
    titleAr: 'ضريح الأسكيا',
    description: 'Le Tombeau des Askia à Gao est un exemple remarquable de l\'architecture funéraire islamique en terre crue.',
    descriptionAr: 'ضريح الأسكيا في غاو هو مثال رائع للعمارة الجنائزية الإسلامية من الطين.',
    imageUrl: '/images/culture_tourisme/tombeau.avif',
    location: 'Gao, Région de Gao',
    period: 'XVe siècle',
    significance: 'Patrimoine Mondial UNESCO',
    category: 'monument'
  },
  {
    id: '3',
    title: 'Falaises de Bandiagara',
    titleAr: 'منحدرات باندياغارا',
    description: 'Les Falaises de Bandiagara abritent les villages des Dogons et constituent un paysage culturel exceptionnel.',
    descriptionAr: 'منحدرات باندياغارا تضم قرى الدوغون وتشكل منظراً ثقافياً استثنائياً.',
    imageUrl: '/images/culture_tourisme/falaise.png',
    location: 'Pays Dogon, Région de Mopti',
    period: 'Depuis le XIVe siècle',
    significance: 'Patrimoine Mondial UNESCO',
    category: 'site'
  },
  {
    id: '4',
    title: 'Art Rupestre du Tassili',
    titleAr: 'الفن الصخري في تاسيلي',
    description: 'Les gravures et peintures rupestres du Tassili témoignent de la richesse culturelle préhistorique du Mali.',
    descriptionAr: 'النقوش والرسوم الصخرية في تاسيلي تشهد على الثراء الثقافي ما قبل التاريخ في مالي.',
    imageUrl: '/images/culture_tourisme/tassili.jpg',
    location: 'Région de Kidal',
    period: 'Préhistorique',
    significance: 'Patrimoine National',
    category: 'art'
  },
  {
    id: '5',
    title: 'Traditions Oratoires',
    titleAr: 'التقاليد الشفوية',
    description: 'L\'art des griots, gardiens de la tradition orale, est inscrit au patrimoine culturel immatériel de l\'UNESCO.',
    descriptionAr: 'فن الجريوت، حراس التقاليد الشفوية، مسجل في التراث الثقافي غير المادي لليونسكو.',
    imageUrl: '/images/culture_tourisme/griot.jpg',
    location: 'Tout le Mali',
    period: 'Depuis des siècles',
    significance: 'Patrimoine Immatériel UNESCO',
    category: 'tradition'
  }
]

const categories = [
  { id: 'all', name: 'Tout le patrimoine', icon: Globe },
  { id: 'monument', name: 'Monuments', icon: BookOpen },
  { id: 'site', name: 'Sites', icon: MapPin },
  { id: 'art', name: 'Art', icon: Camera },
  { id: 'tradition', name: 'Traditions', icon: Users }
]

export default function PatrimoinePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredPatrimoine, setFilteredPatrimoine] = useState(patrimoineData)

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPatrimoine(patrimoineData)
    } else {
      setFilteredPatrimoine(patrimoineData.filter(item => item.category === selectedCategory))
    }
  }, [selectedCategory])

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.icon : Globe
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      monument: 'bg-blue-100 text-blue-800',
      site: 'bg-green-100 text-green-800',
      art: 'bg-purple-100 text-purple-800',
      tradition: 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-mali-green-600 via-mali-gold-600 to-mali-red-600 text-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Patrimoine Malien
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Découvrez la richesse culturelle et historique du Mali
            </p>
            <p className="text-lg text-gray-200" dir="rtl">
              اكتشف الثراء الثقافي والتاريخي لمالي
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Un héritage millénaire
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Le Mali possède un patrimoine culturel exceptionnel, témoin de son histoire glorieuse 
              et de sa diversité culturelle. De l'empire du Mali aux royaumes du Sahel, 
              chaque site raconte une partie de notre histoire commune.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed" dir="rtl">
              تمتلك مالي تراثاً ثقافياً استثنائياً، شاهداً على تاريخها المجيد وتنوعها الثقافي. 
              من إمبراطورية مالي إلى ممالك الساحل، كل موقع يحكي جزءاً من تاريخنا المشترك.
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

      {/* Liste du patrimoine */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPatrimoine.map((item) => {
              const CategoryIcon = getCategoryIcon(item.category)
              return (
                <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-64">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(item.category)}`}>
                        <CategoryIcon className="w-4 h-4 inline mr-1" />
                        {categories.find(c => c.id === item.category)?.name}
                      </span>
                    </div>
                    {item.significance.includes('UNESCO') && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          <Star className="w-3 h-3 inline mr-1" />
                          UNESCO
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    {item.titleAr && (
                      <h4 className="text-lg font-semibold text-gray-700 mb-3" dir="rtl">
                        {item.titleAr}
                      </h4>
                    )}
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {item.description}
                    </p>
                    
                    {item.descriptionAr && (
                      <p className="text-gray-600 mb-4 line-clamp-3" dir="rtl">
                        {item.descriptionAr}
                      </p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {item.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {item.period}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-mali-green-600">
                        {item.significance}
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

      {/* CTA Section */}
      <section className="py-16 bg-mali-green-600 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Planifiez votre visite
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              Découvrez ces trésors du patrimoine malien lors de votre prochain voyage
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-mali-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Guide de voyage
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-mali-green-600 transition-colors">
                Contactez-nous
              </button>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  )
}
