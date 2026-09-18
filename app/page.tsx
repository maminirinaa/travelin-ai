'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Compass,
  Users,
  Search,
  Star,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Globe,
  ArrowRight,
  Clock,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Filter,
  UserCheck,
  Zap,
  Award,
  Luggage,
  Coffee,
  Car,
  Hotel,
  Camera
} from 'lucide-react';

// Types
interface ServiceItem {
  id: string;
  title: string;
  category: string;
  provider: string;
  location: string;
  rating: number;
  reviewsCount: number;
  price: number;
  unit: string;
  image: string;
  badge: string;
  description: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

interface PopularItinerary {
  id: string;
  destination: string;
  country: string;
  duration: string;
  tags: string[];
  image: string;
  matchScore: number;
  days: ItineraryDay[];
}

// Données fictives
const CATEGORIES = [
  { id: 'all', label: 'Tous les services', icon: Compass },
  { id: 'guides', label: 'Guides Locaux', icon: Users },
  { id: 'activities', label: 'Activités & Excursions', icon: Camera },
  { id: 'transports', label: 'Transports Locaux', icon: Car },
  { id: 'stay', label: 'Hébergements Atypiques', icon: Hotel },
  { id: 'food', label: 'Artisans & Gastronomie', icon: Coffee },
];

const SERVICES: ServiceItem[] = [
  {
    id: '1',
    title: 'Excursion Mystique & Randonnée aux Lacs Cachets',
    category: 'activities',
    provider: 'Elena & Matteo',
    location: 'Dolomites, Italie',
    rating: 4.95,
    reviewsCount: 128,
    price: 85,
    unit: 'personne',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
    badge: 'Guide Local Certifié',
    description: 'Explorez des sentiers sauvages secrets hors des sentiers battus avec un guide naturaliste local.',
  },
  {
    id: '2',
    title: 'Atelier Cuisine Traditionnelle chez l\'habitant',
    category: 'food',
    provider: 'Chef Kenji',
    location: 'Kyoto, Japon',
    rating: 4.98,
    reviewsCount: 210,
    price: 95,
    unit: 'atelier',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=800',
    badge: 'Artisan Vérifié',
    description: 'Apprenez l\'art authentique des RAMEN et BENTO ancestraux dans une maison traditionnelle.',
  },
  {
    id: '3',
    title: 'Nuit sous les Étoiles en Eco-Lodge Bulle',
    category: 'stay',
    provider: 'Domaine des Étoiles',
    location: 'Provence, France',
    rating: 4.88,
    reviewsCount: 94,
    price: 190,
    unit: 'nuit',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=800',
    badge: 'Éco-responsable',
    description: 'Immersions en pleine nature avec tout le confort moderne et petit-déjeuner bio local inclus.',
  },
  {
    id: '4',
    title: 'Circuit en Kombi Vintage Panoramique',
    category: 'transports',
    provider: 'Vintage Rides Co.',
    location: 'Lisbonne, Portugal',
    rating: 4.92,
    reviewsCount: 175,
    price: 60,
    unit: 'jour',
    image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=80&w=800',
    badge: 'Chauffeur Privé',
    description: 'Découvrez les ruelles typiques et la côte escarpée à bord d\'un Combi VW des années 70.',
  },
  {
    id: '5',
    title: 'Traversée des Souks & Secrets d\'Architecture',
    category: 'guides',
    provider: 'Youssef & Équipe',
    location: 'Marrakech, Maroc',
    rating: 4.99,
    reviewsCount: 340,
    price: 45,
    unit: 'demi-journée',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=800',
    badge: 'Expert Historique',
    description: 'Évitez les pièges à touristes et découvrez l\'histoire cachée des palais et riads secret de la Médina.',
  },
  {
    id: '6',
    title: 'Dégustation & Vendanges dans un Vignoble Familial',
    category: 'food',
    provider: 'Famille Rossi',
    location: 'Toscane, Italie',
    rating: 4.96,
    reviewsCount: 156,
    price: 75,
    unit: 'personne',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800',
    badge: 'Producteur Direct',
    description: 'Visite des caves historiques, dégustation de 5 vins bio et déjeuner champêtre en plein air.',
  },
];

const POPULAR_ITINERARIES: PopularItinerary[] = [
  {
    id: '1',
    destination: 'Bali Authentique & Sauvage',
    country: 'Indonésie',
    duration: '10 jours',
    tags: ['Culture', 'Aventure', 'Relaxation'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
    matchScore: 98,
    days: [
      { day: 1, title: 'Arrivée à Ubud & Cérémonie de Bienvenue', activities: ['Transfert avec chauffeur local', 'Dîner traditionnel Balinais', 'Check-in Éco-Lodge'] },
      { day: 2, title: 'Cascades Secrètes & Rizières d\'Jatiluwih', activities: ['Randonnée matinale au lever du soleil', 'Baignade sous la cascade Tukad Cepung', 'Déjeuner chez l\'habitant'] },
      { day: 3, title: 'Immersion Culturelle & Artisanat de Sculpture', activities: ['Cours de poterie avec un maître local', 'Visite des temples préservés d\'Ubud'] }
    ]
  },
  {
    id: '2',
    destination: 'Route des Fjords & Aurores Boréales',
    country: 'Norvège',
    duration: '7 jours',
    tags: ['Nature', 'Aventure', 'Atypique'],
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&q=80&w=800',
    matchScore: 95,
    days: [
      { day: 1, title: 'Tromsø, la porte de l\'Arctique', activities: ['Arrivée et récupération du véhicule 4x4', 'Chasse aux aurores avec un guide astronome'] },
      { day: 2, title: 'Fjords Sauvages de Sommarøy', activities: ['Kayak entre les îlots gelés', 'Sauna traditionnel & bain nordique'] },
      { day: 3, title: 'Rencontre avec le Peuple Sami', activities: ['Nourrir les rennes', 'Contes traditionnels autour du feu dans une tente Lavvo'] }
    ]
  },
  {
    id: '3',
    destination: 'Échappée Gourmande en Andalousie',
    country: 'Espagne',
    duration: '5 jours',
    tags: ['Gastronomie', 'Culture', 'Soleil'],
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&q=80&w=800',
    matchScore: 92,
    days: [
      { day: 1, title: 'Séville & Tapas Authentiques', activities: ['Promenade dans le quartier de Santa Cruz', 'Tour de Tapas dans des tavernes centenaires'] },
      { day: 2, title: 'Cordoue & l\'Héritage Omeyyade', activities: ['Train rapide vers Cordoue', 'Visite guidée privée de la Mezquita'] },
      { day: 3, title: 'Grenade & Spectacle de Flamenco Sacromonte', activities: ['Exploration de l\'Alhambra', 'Soirée spectacle intime dans des caves naturelles'] }
    ]
  }
];

export default function HomePage() {
  // Navigation State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form State
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('moyen');
  const [tripType, setTripType] = useState('Aventure');
  const [travelers, setTravelers] = useState(2);

  // AI Generator Loading State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<null | any>(null);

  // Marketplace State
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Popular Itineraries Accordion State
  const [expandedItinerary, setExpandedItinerary] = useState<string | null>('1');

  const handleGenerateItinerary = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedItinerary(null);

    // Simulation de génération IA
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedItinerary({
        title: `Voyage sur mesure : ${destination || 'Destination de Rêve'}`,
        duration: '7 Jours / 6 Nuits',
        budgetEstimated: budget === 'eco' ? '450€ - 650€ / pers' : budget === 'moyen' ? '850€ - 1200€ / pers' : '1800€+ / pers',
        type: tripType,
        travelersCount: travelers,
        highlights: [
          '3 Activités immersives réservées auprès d\'artisans locaux',
          'Plan d\'action quotidien personnalisé optimisé sans transports excessifs',
          'Sélection de 2 hébergements éco-responsables à proximité',
          'Soutien direct à l\'économie locale (+85% des dépenses reversées aux hôtes)'
        ],
        dayByDay: [
          { day: 1, text: 'Arrivée & première découverte du quartier historique avec un guide local.' },
          { day: 2, text: 'Matinée aventure en nature & Déjeuner traditionnel chez l\'habitant.' },
          { day: 3, text: 'Journée immersion culturelle et ateliers artisanaux sur-mesure.' }
        ]
      });
    }, 2200);
  };

  const filteredServices = selectedCategory === 'all'
    ? SERVICES
    : SERVICES.filter(service => service.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">

      {}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
              AuraTravel<span className="text-indigo-600 font-black">.ai</span>
            </span>
          </div>

          {/* Navigation Links Desktop */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a href="#ia-planner" className="hover:text-indigo-600 transition-colors">Planificateur IA</a>
            <a href="#marketplace" className="hover:text-indigo-600 transition-colors">Marketplace Locale</a>
            <a href="#itineraries" className="hover:text-indigo-600 transition-colors">Itinéraires Populaires</a>
            <a href="#why-us" className="hover:text-indigo-600 transition-colors">Pourquoi Nous ?</a>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Langue / Devise */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all">
              <Globe className="w-3.5 h-3.5" />
              <span>FR | EUR (€)</span>
            </button>

            {/* Connexion */}
            <button className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-all">
              Se connecter
            </button>

            {/* Inscription */}
            <button className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all">
              Rejoindre
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
            <a href="#ia-planner" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Planificateur IA</a>
            <a href="#marketplace" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Marketplace Locale</a>
            <a href="#itineraries" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Itinéraires Populaires</a>
            <a href="#why-us" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Pourquoi Nous ?</a>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button className="w-full py-2.5 text-center text-slate-700 font-semibold border border-slate-200 rounded-xl">Se connecter</button>
              <button className="w-full py-2.5 text-center text-white bg-indigo-600 font-semibold rounded-xl">Rejoindre</button>
            </div>
          </div>
        )}
      </header>

      {}
      <section id="ia-planner" className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50">
        
        {/* Background Decorative Blur Blobs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-pink-200/40 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Header Text */}
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-700 text-xs md:text-sm font-semibold mb-4 animate-fade-in">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Générateur de Voyage Authentique Propulsé par l'IA</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Créez votre voyage sur-mesure & soutenez les <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">acteurs locaux</span>.
            </h1>
            
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Indiquez vos envies, l'IA compose un itinéraire unique et intègre directement les meilleurs guides, logements et activités vérifiés de la région.
            </p>
          </div>

          {/* AI Search Card Form Container */}
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-200/80 border border-slate-100 transition-all">
            <form onSubmit={handleGenerateItinerary} className="space-y-6">
              
              {/* Row 1: Destination & Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Destination Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Destination
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ex: Kyoto, Italie, Islande..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      className="w-full pl-3.5 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Date Départ */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Date Départ
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                  />
                </div>

                {/* Date Retour */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Date Retour
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                  />
                </div>

              </div>

              {/* Row 2: Budget, Style & Voyageurs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                
                {/* Budget selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-600" /> Budget estimé
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                    {[
                      { id: 'eco', label: 'Éco' },
                      { id: 'moyen', label: 'Modéré' },
                      { id: 'luxe', label: 'Luxe' },
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBudget(b.id)}
                        className={`py-2 text-xs font-bold rounded-lg transition-all ${
                          budget === b.id
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type de Voyage */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" /> Ambiance / Style
                  </label>
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                  >
                    <option value="Aventure">Aventure & Nature</option>
                    <option value="Relaxation">Relaxation & Détente</option>
                    <option value="Culture">Culture & Histoire</option>
                    <option value="Gastronomie">Gastronomie & Vins</option>
                    <option value="Famille">Famille & Découverte</option>
                  </select>
                </div>

                {/* Nombre de Voyageurs */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" /> Voyageurs
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 justify-between">
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center transition-all"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-slate-800">{travelers} {travelers > 1 ? 'Personnes' : 'Personne'}</span>
                    <button
                      type="button"
                      onClick={() => setTravelers(travelers + 1)}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

              </div>

              {/* Submit AI Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-3 text-base group disabled:opacity-75 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyse IA des acteurs locaux en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      <span>Générer mon itinéraire IA sur-mesure</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* AI Generated Result Modal/Card */}
            {generatedItinerary && (
              <div className="mt-8 p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl animate-fade-in shadow-2xl relative overflow-hidden border border-indigo-500/30">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Sparkles className="w-48 h-48 text-white" />
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold rounded-full mb-2">
                      Itinéraire Généré par l'IA
                    </span>
                    <h3 className="text-2xl font-bold">{generatedItinerary.title}</h3>
                    <p className="text-slate-300 text-sm mt-1">
                      {generatedItinerary.duration} • Budget: {generatedItinerary.budgetEstimated} • {generatedItinerary.type}
                    </p>
                  </div>
                  <button 
                    onClick={() => setGeneratedItinerary(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 my-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">Points forts du séjour :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {generatedItinerary.highlights.map((h: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700/60">
                  <button className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                    <span>Réserver les prestations suggérées</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all">
                    Ajuster les critères
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {}
      <section id="marketplace" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" /> Marketplace Directe
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Services & Prestations Locales
              </h2>
              <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base">
                Réservez en direct auprès d'acteurs locaux vérifiés. 0 intermédiaire abusif, impact économique 100% positif pour les communautés.
              </p>
            </div>

            <button className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 group">
              <span>Voir tout le catalogue (2,400+)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold text-indigo-700 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{service.badge}</span>
                  </div>
                  <button className="absolute top-3 right-3 w-9 h-9 bg-white/80 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-slate-600 hover:text-rose-500 transition-all shadow-sm">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Location & Rating */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {service.location}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {service.rating} <span className="text-slate-400 font-normal">({service.reviewsCount})</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {service.title}
                    </h3>

                    {/* Provider */}
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Proposé par <span className="text-slate-800 font-semibold">{service.provider}</span>
                    </p>

                    {/* Description */}
                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Price & CTA Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">À partir de</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-slate-900">{service.price}€</span>
                        <span className="text-xs text-slate-500">/ {service.unit}</span>
                      </div>
                    </div>

                    <button className="px-4 py-2 bg-slate-900 group-hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm">
                      Réserver
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {}
      <section id="itineraries" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Inspirations Recommandées</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Itinéraires IA Prêts à Partir
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Explorez les itinéraires les mieux notés générés par notre communauté et optimisés avec les acteurs locaux.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {POPULAR_ITINERARIES.map((item) => {
              const isExpanded = expandedItinerary === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col ${
                    isExpanded ? 'ring-2 ring-indigo-600 border-transparent shadow-xl' : 'border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Itinerary Header Banner */}
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.image} alt={item.destination} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 right-3 bg-emerald-500/90 text-white text-xs font-black px-2.5 py-1 rounded-full backdrop-blur-md">
                      {item.matchScore}% Match Local
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">{item.country} • {item.duration}</span>
                      <h3 className="text-xl font-bold">{item.destination}</h3>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-1.5 flex-wrap">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="text-[11px] font-bold text-slate-600 bg-slate-200/60 px-2.5 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Day by Day Preview Accordion */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
                        Aperçu Jour par Jour :
                      </h4>

                      <div className="space-y-3">
                        {item.days.map((day) => (
                          <div key={day.day} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                J{day.day}
                              </span>
                              <span className="text-xs font-bold text-slate-800">{day.title}</span>
                            </div>
                            <ul className="pl-7 text-[11px] text-slate-600 space-y-0.5 list-disc">
                              {day.activities.map((act, i) => (
                                <li key={i}>{act}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setExpandedItinerary(isExpanded ? null : item.id)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Masquer les détails' : 'Explorer le programme complet'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      <button className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {}
      <section id="why-us" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Impact Social & Éthique</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-1">
              Pourquoi passer directement par nos acteurs locaux ?
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              L'industrie du tourisme traditionnel capture jusqu'à 70% de la valeur. Notre algorithme IA privilégie le circuit court pour un voyage plus juste et authentique.
            </p>
          </div>

          {/* Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            <div className="bg-slate-800/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700/60 hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Vérifiés & Indépendants</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Chaque guide, hébergement et artisan est rencontré et certifié par nos équipes locales sur le terrain.
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700/60 hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Revenu Équitable Direct</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                85% du prix de chaque réservation va directement dans la poche de l'hôte local, sans intermédiaires cachés.
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700/60 hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">IA Anti-Surtourisme</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Notre algorithme équilibre les flux touristiques en vous suggérant des pépites méconnues et préservées.
              </p>
            </div>

          </div>

          {/* Impact Stats Banner */}
          <div className="bg-indigo-600 rounded-3xl p-8 sm:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">2,400+</div>
              <div className="text-xs sm:text-sm font-medium text-indigo-100 mt-1">Acteurs Locaux Vérifiés</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">98.4%</div>
              <div className="text-xs sm:text-sm font-medium text-indigo-100 mt-1">Satisfaction Voyageurs</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">€1.2M+</div>
              <div className="text-xs sm:text-sm font-medium text-indigo-100 mt-1">Reversés aux Communautés</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">45+</div>
              <div className="text-xs sm:text-sm font-medium text-indigo-100 mt-1">Pays Équitablement Couverts</div>
            </div>
          </div>

        </div>
      </section>

      {}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
            
            {/* Col 1 & 2: Brand info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-lg font-extrabold text-white">AuraTravel.ai</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                La première plateforme de voyage alimentée par l'IA qui remet l'humain et les acteurs locaux au cœur de chaque destination.
              </p>
              <div className="flex items-center gap-3 pt-2">
                {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map((social) => (
                  <button key={social} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-white flex items-center justify-center transition-colors">
                    {social[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Col 3: Navigation */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Plateforme</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li><a href="#ia-planner" className="hover:text-white transition-colors">Planificateur IA</a></li>
                <li><a href="#marketplace" className="hover:text-white transition-colors">Marketplace Locale</a></li>
                <li><a href="#itineraries" className="hover:text-white transition-colors">Itinéraires Suivis</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Offres Partenaires</a></li>
              </ul>
            </div>

            {/* Col 4: Prestations */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Prestataires</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Devenir Guide Local</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Proposer un Hébergement</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Charte Éthique & Qualité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Espace Hôtes</a></li>
              </ul>
            </div>

            {/* Col 5: Support */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Garantie Annulation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique de Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contactez-nous</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} AuraTravel.ai, Inc. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:underline">Conditions d'utilisation</a>
              <a href="#" className="hover:underline">Cookies</a>
              <a href="#" className="hover:underline">Mentions Légales</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
