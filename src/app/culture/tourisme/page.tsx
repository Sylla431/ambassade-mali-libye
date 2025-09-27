'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  MapPin, 
  Star, 
  Camera,
  Users,
  Clock,
  ArrowRight,
  Globe,
  Mountain,
  Waves,
  TreePine,
  Building,
  Heart
} from 'lucide-react'

interface SiteTouristique {
  id: string
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  imageUrl: string
  location: string
  region: string
  type: 'historique' | 'naturel' | 'culturel' | 'religieux'
  bestTime: string
  highlights: string[]
  activities: string[]
  rating: number
}

const sitesData: SiteTouristique[] = [
  {
    id: '1',
    title: 'Djenné - Ville Historique',
    titleAr: 'جينيه - المدينة التاريخية',
    description: 'Djenné, classée au patrimoine mondial de l\'UNESCO, est célèbre pour sa Grande Mosquée en terre crue et son architecture soudano-sahélienne unique.',
    descriptionAr: 'جينيه، المصنفة في التراث العالمي لليونسكو، مشهورة بجامعها الكبير من الطين وعمارتها السودانية الساحلية الفريدة.',
    imageUrl: '/images/culture_tourisme/djenne.jpg',
    location: 'Djenné',
    region: 'Région de Mopti',
    type: 'historique',
    bestTime: 'Novembre à Mars',
    highlights: ['Grande Mosquée', 'Architecture en terre', 'Marché traditionnel'],
    activities: ['Visite guidée', 'Photographie', 'Artisanat local'],
    rating: 5
  },
  {
    id: '2',
    title: 'Pays Dogon',
    titleAr: 'بلاد الدوغون',
    description: 'Le Pays Dogon offre un paysage culturel exceptionnel avec ses falaises, villages traditionnels et traditions ancestrales préservées.',
    descriptionAr: 'بلاد الدوغون تقدم منظراً ثقافياً استثنائياً مع منحدراتها وقرىها التقليدية وتقاليدها الأسلافية المحفوظة.',
    imageUrl: '/images/culture_tourisme/dogon.jpg',
    location: 'Falaises de Bandiagara',
    region: 'Région de Mopti',
    type: 'culturel',
    bestTime: 'Novembre à Avril',
    highlights: ['Falaises de Bandiagara', 'Villages dogon', 'Danses de masques'],
    activities: ['Randonnée', 'Visite des villages', 'Rencontres culturelles'],
    rating: 5
  },
  {
    id: '3',
    title: 'Tombouctou - La Mystérieuse',
    titleAr: 'تمبكتو - المدينة الغامضة',
    description: 'Tombouctou, ancienne cité des savants, abrite des manuscrits anciens et une architecture historique remarquable.',
    descriptionAr: 'تمبكتو، المدينة القديمة للعلماء، تضم مخطوطات قديمة وعمارة تاريخية رائعة.',
    imageUrl: '/images/culture_tourisme/tomboctou.jpg',
    location: 'Tombouctou',
    region: 'Région de Tombouctou',
    type: 'historique',
    bestTime: 'Novembre à Mars',
    highlights: ['Manuscrits anciens', 'Mosquées historiques', 'Bibliothèques'],
    activities: ['Visite des bibliothèques', 'Découverte historique', 'Rencontres avec les érudits'],
    rating: 4
  },
//   {
//     id: '4',
//     title: 'Parc National du W',
//     titleAr: 'الحديقة الوطنية دبليو',
//     description: 'Le Parc National du W est un sanctuaire de la faune africaine, abritant éléphants, lions, antilopes et de nombreuses espèces d\'oiseaux.',
//     descriptionAr: 'الحديقة الوطنية دبليو هي ملاذ للحياة البرية الأفريقية، تضم الفيلة والأسود والظباء والعديد من أنواع الطيور.',
//     imageUrl: '/images/culture_tourisme/parc-national-w.jpg',
//     location: 'Région de Ménaka',
//     region: 'Région de Ménaka',
//     type: 'naturel',
//     bestTime: 'Décembre à Mai',
//     highlights: ['Safari photo', 'Observation d\'oiseaux', 'Éléphants'],
//     activities: ['Safari', 'Observation de la faune', 'Photographie animalière'],
//     rating: 4
//   },
  {
    id: '5',
    title: 'Gao - Ancienne Capitale',
    titleAr: 'غاو - العاصمة القديمة',
    description: 'Gao, ancienne capitale de l\'empire Songhaï, abrite le Tombeau des Askia et des vestiges de son glorieux passé.',
    descriptionAr: 'غاو، العاصمة القديمة لإمبراطورية سونغاي، تضم ضريح الأسكيا وآثار ماضيها المجيد.',
    imageUrl: '/images/culture_tourisme/gao.jpg',
    location: 'Gao',
    region: 'Région de Gao',
    type: 'historique',
    bestTime: 'Novembre à Mars',
    highlights: ['Tombeau des Askia', 'Marché aux poissons', 'Culture songhaï'],
    activities: ['Visite historique', 'Découverte culturelle', 'Gastronomie locale'],
    rating: 4
  },
  {
    id: '6',
    title: 'Ségou - Ville des Balanzans',
    titleAr: 'سيغو - مدينة البالانزان',
    description: 'Ségou, sur les rives du Niger, est célèbre pour ses balanzans (fromagers) et son festival culturel annuel.',
    descriptionAr: 'سيغو، على ضفاف النيجر، مشهورة بالبالانزان ومهرجانها الثقافي السنوي.',
    imageUrl: '/images/culture_tourisme/segou.avif',
    location: 'Ségou',
    region: 'Région de Ségou',
    type: 'culturel',
    bestTime: 'Novembre à Mars',
    highlights: ['Festival sur le Niger', 'Balanzans', 'Artisanat local'],
    activities: ['Festival', 'Croisière sur le Niger', 'Artisanat'],
    rating: 4
  },
  {
    id: '7',
    title: 'Bamako - Capitale Moderne',
    titleAr: 'باماكو - العاصمة الحديثة',
    description: 'Bamako, capitale du Mali, allie tradition et modernité avec ses marchés animés, musées et vie culturelle riche.',
    descriptionAr: 'باماكو، عاصمة مالي، تجمع بين التقليد والحداثة مع أسواقها النابضة بالحياة ومتاحفها وحياتها الثقافية الغنية.',
    imageUrl: '/images/culture_tourisme/tower.jpg',
    location: 'Bamako',
    region: 'District de Bamako',
    type: 'culturel',
    bestTime: 'Toute l\'année',
    highlights: ['Marché de Médina', 'Musée National', 'Vie nocturne'],
    activities: ['Shopping', 'Visite des musées', 'Restaurants', 'Spectacles'],
    rating: 4
  },
  {
    id: '8',
    title: 'Lac Débo',
    titleAr: 'بحيرة ديبو',
    description: 'Le Lac Débo, dans le delta intérieur du Niger, est un paradis pour les oiseaux migrateurs et les pêcheurs traditionnels.',
    descriptionAr: 'بحيرة ديبو، في الدلتا الداخلية للنيجر، هي جنة للطيور المهاجرة والصيادين التقليديين.',
    imageUrl: '/images/culture_tourisme/lac.jpg',
    location: 'Delta intérieur du Niger',
    region: 'Région de Mopti',
    type: 'naturel',
    bestTime: 'Décembre à Mai',
    highlights: ['Oiseaux migrateurs', 'Pêche traditionnelle', 'Paysages aquatiques'],
    activities: ['Observation d\'oiseaux', 'Pêche', 'Croisière'],
    rating: 4
  }
]

const types = [
  { id: 'all', name: 'Tous les sites', icon: Globe },
  { id: 'historique', name: 'Historique', icon: Building },
  { id: 'naturel', name: 'Naturel', icon: TreePine },
  { id: 'culturel', name: 'Culturel', icon: Heart },
  { id: 'religieux', name: 'Religieux', icon: Mountain }
]

export default function TourismePage() {
  const [selectedType, setSelectedType] = useState('all')
  const [filteredSites, setFilteredSites] = useState(sitesData)

  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredSites(sitesData)
    } else {
      setFilteredSites(sitesData.filter(site => site.type === selectedType))
    }
  }, [selectedType])

  const getTypeIcon = (type: string) => {
    const typeObj = types.find(t => t.id === type)
    return typeObj ? typeObj.icon : Globe
  }

  const getTypeColor = (type: string) => {
    const colors = {
      historique: 'bg-blue-100 text-blue-800',
      naturel: 'bg-green-100 text-green-800',
      culturel: 'bg-purple-100 text-purple-800',
      religieux: 'bg-orange-100 text-orange-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-mali-green-600 via-mali-gold-600 to-mali-red-600 text-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sites Touristiques du Mali
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Découvrez les trésors cachés et les merveilles du Mali
            </p>
            <p className="text-lg text-gray-200" dir="rtl">
              اكتشف الكنوز المخفية وعجائب مالي
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Un voyage à travers l'histoire et la nature
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Le Mali offre une diversité exceptionnelle de sites touristiques, 
              des villes historiques classées au patrimoine mondial aux parcs naturels 
              abritant une faune riche. Chaque destination raconte une partie de l'histoire 
              glorieuse de ce pays.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed" dir="rtl">
              تقدم مالي تنوعاً استثنائياً من المواقع السياحية، من المدن التاريخية المصنفة في التراث العالمي 
              إلى الحدائق الطبيعية التي تضم حياة برية غنية. كل وجهة تحكي جزءاً من التاريخ المجيد لهذا البلد.
            </p>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-8 bg-gray-100">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {types.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                    selectedType === type.id
                      ? 'bg-mali-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-mali-green-50 hover:text-mali-green-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{type.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Liste des sites */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSites.map((site) => {
              const TypeIcon = getTypeIcon(site.type)
              return (
                <div key={site.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-64">
                    <Image
                      src={site.imageUrl}
                      alt={site.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(site.type)}`}>
                        <TypeIcon className="w-4 h-4 inline mr-1" />
                        {types.find(t => t.id === site.type)?.name}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                        {site.region}
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-center space-x-1">
                        {renderStars(site.rating)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {site.title}
                    </h3>
                    {site.titleAr && (
                      <h4 className="text-lg font-semibold text-gray-700 mb-3" dir="rtl">
                        {site.titleAr}
                      </h4>
                    )}
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {site.description}
                    </p>
                    
                    {site.descriptionAr && (
                      <p className="text-gray-600 mb-4 line-clamp-3" dir="rtl">
                        {site.descriptionAr}
                      </p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {site.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        Meilleure période : {site.bestTime}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Points forts :</h5>
                      <div className="flex flex-wrap gap-1">
                        {site.highlights.map((highlight, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Activités :</h5>
                      <div className="flex flex-wrap gap-1">
                        {site.activities.map((activity, index) => (
                          <span key={index} className="bg-mali-green-50 text-mali-green-700 px-2 py-1 rounded text-xs">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {renderStars(site.rating)}
                        <span className="text-sm text-gray-500 ml-2">
                          ({site.rating}/5)
                        </span>
                      </div>
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
              Planifiez votre voyage au Mali
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              Découvrez ces merveilles avec nos guides experts
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-mali-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Circuits organisés
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-mali-green-600 transition-colors">
                Guide personnalisé
              </button>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  )
}
