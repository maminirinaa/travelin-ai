"use client";

import React, { useState, useMemo } from "react";
import {
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Coins,
  Heart,
  Utensils,
  Camera,
  Trees,
  Landmark,
  Wine,
  Loader2,
  Check,
  CheckCircle2,
  Store,
  ShieldCheck,
  Star,
  Clock,
  Filter,
  Search,
  Zap,
  ArrowRight,
  Share2,
  Printer,
  Lightbulb,
  CreditCard,
  X,
  ChevronRight,
  Globe,
  Shield
} from "lucide-react";

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

export type TravelStyle = "culture" | "gastronomie" | "nature" | "aventure" | "detente" | "famille";
export type BudgetLevel = "eco" | "confort" | "luxe";
export type ServiceCategory = "all" | "guides" | "experiences" | "transports" | "workshops" | "lodging";

export interface TravelSearchParams {
  destination: string;
  durationDays: number;
  startDate: string;
  travelStyle: TravelStyle;
  budgetLevel: BudgetLevel;
  travelersCount: number;
  interests: string[];
}

export interface DayActivity {
  time: string;
  title: string;
  description: string;
  location: string;
  costEstimate: string;
  category: "culture" | "food" | "nature" | "leisure";
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  theme: string;
  morning: DayActivity;
  lunch: DayActivity;
  afternoon: DayActivity;
  evening: DayActivity;
  localTip: string;
  dailyEstimatedCost: string;
}

export interface GeneratedItinerary {
  id: string;
  destination: string;
  title: string;
  overview: string;
  durationDays: number;
  travelStyle: TravelStyle;
  budgetLevel: BudgetLevel;
  travelersCount: number;
  estimatedTotalBudget: string;
  currency: string;
  bestTransportTip: string;
  days: ItineraryDay[];
  createdAt: string;
}

export interface MarketplaceService {
  id: string;
  title: string;
  category: "guides" | "experiences" | "transports" | "workshops" | "lodging";
  categoryLabel: string;
  provider: {
    name: string;
    role: string;
    avatar: string;
    verified: boolean;
    rating: number;
    responseTime: string;
  };
  location: string;
  city: string;
  duration: string;
  price: number;
  currency: string;
  priceUnit: string;
  rating: number;
  reviewsCount: number;
  badges: string[];
  image: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  included: string[];
  instantBooking: boolean;
}

// ==========================================
// 2. DONNÉES LOCALES DE LA MARKETPLACE
// ==========================================

const MOCK_SERVICES: MarketplaceService[] = [
  {
    id: "serv-1",
    title: "Visite Secrète & Dégustation avec un Guide Historien Local",
    category: "guides",
    categoryLabel: "Guide Certifié",
    provider: {
      name: "Youssef & Amira",
      role: "Guide Historien & Archéologue",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      verified: true,
      rating: 4.98,
      responseTime: "< 15 min",
    },
    location: "Médina & Quartiers Cachés, Marrakech",
    city: "Marrakech",
    duration: "3h30",
    price: 45,
    currency: "€",
    priceUnit: "par personne",
    rating: 4.97,
    reviewsCount: 142,
    badges: ["Coup de Cœur", "Certifié Local", "Max 6 pers"],
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Plongez dans les ruelles secrètes, rencontrez des artisans doreurs et savourez un thé sur un toit privé.",
    fullDescription: "Une immersion authentique loin du tourisme de masse. Vous découvrirez des trésors architecturaux confidentiels, l’histoire des fondouks centenaires et terminerez par une dégustation privée de douceurs chez l'habitant.",
    highlights: ["Accès exclusif à un riad du XVIe siècle", "Dégustation de 5 spécialités locales", "Groupe limité à 6 voyageurs"],
    included: ["Guide privé francophone", "Thé & collations", "Plan papier annoté fait main"],
    instantBooking: true,
  },
  {
    id: "serv-2",
    title: "Atelier Cuisine Traditionnelle & Marché du Matin avec un Chef",
    category: "experiences",
    categoryLabel: "Expérience Culinaire",
    provider: {
      name: "Kenji & Sakura",
      role: "Chef & Maraîcher bio",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      verified: true,
      rating: 5.0,
      responseTime: "< 5 min",
    },
    location: "Quartier Gion & Marché Nishiki, Kyoto",
    city: "Kyoto",
    duration: "4h00",
    price: 85,
    currency: "€",
    priceUnit: "par personne",
    rating: 4.99,
    reviewsCount: 230,
    badges: ["Top Évalué", "Ingrédients Bio"],
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Achetez vos ingrédients au marché historique puis préparez bento, dashi authentique et mochis artisanaux.",
    fullDescription: "Commencez parmi les étals centenaires pour choisir le meilleur poisson et les légumes de saison. Dans une maison en bois traditionnelle (machiya), apprenez les techniques de découpe et les secrets du bouillon dashi.",
    highlights: ["Sélection des produits avec le chef", "Repas complet 4 plats préparé ensemble", "Livret de recettes dédicacé"],
    included: ["Ingrédients complets & tablier fourni", "Repas 4 plats avec dégustation", "Certificat d'initiation"],
    instantBooking: true,
  },
  {
    id: "serv-3",
    title: "Chauffeur Privé Éco-Responsable & Tour Panoramique Antique",
    category: "transports",
    categoryLabel: "Transport & Chauffeur",
    provider: {
      name: "Matteo V.",
      role: "Chauffeur guide professionnel agréé",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      verified: true,
      rating: 4.94,
      responseTime: "< 30 min",
    },
    location: "Rome & Voie Appienne Antique",
    city: "Rome",
    duration: "Journée (7h)",
    price: 210,
    currency: "€",
    priceUnit: "par véhicule (1-4 pers)",
    rating: 4.92,
    reviewsCount: 88,
    badges: ["100% Électrique", "Prise en charge Hôtel"],
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Déplacez-vous sans stress en berline électrique haut de gamme avec arrêts photo panoramiques et conseils d'un natif.",
    fullDescription: "Évitez les transports bondés et les zones à circulation restreinte. Matteo vient vous chercher à votre hôtel et vous emmène admirer les plus beaux panoramas de la Ville Éternelle.",
    highlights: ["Climatisation & eau fraîche", "Arrêts flexibles à volonté", "Accès prioritaire aux zones ZTL"],
    included: ["Véhicule électrique grand confort", "Carburant et péages inclus", "Sièges enfants disponibles"],
    instantBooking: false,
  },
  {
    id: "serv-4",
    title: "Atelier Céramique & Poterie Ancestrale avec Maître Artisan",
    category: "workshops",
    categoryLabel: "Atelier Artisanal",
    provider: {
      name: "Sofia Mendonça",
      role: "Maître Céramiste Azulejos",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      verified: true,
      rating: 4.96,
      responseTime: "< 1h",
    },
    location: "Quartier de l’Alfama, Lisbonne",
    city: "Lisbonne",
    duration: "2h30",
    price: 55,
    currency: "€",
    priceUnit: "par personne",
    rating: 4.95,
    reviewsCount: 165,
    badges: ["Emportez votre création", "Tous Niveaux"],
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Modelez et peignez votre carreau d’azulejo traditionnel selon les techniques du XVIIIe siècle au cœur de l’Alfama.",
    fullDescription: "Un moment suspendu dans un atelier lumineux aux murs de pierre. Sofia vous enseigne la composition des émaux naturels, le tracé des motifs classiques et l’émaillage au pinceau doux.",
    highlights: ["Création de 2 carreaux émaillés personnalisés", "Envoi soigné à votre domicile après cuisson", "Boisson de bienvenue offerte"],
    included: ["Argile, émaux & cuisson professionnelle", "Emballage protecteur d'expédition", "Collation locale"],
    instantBooking: true,
  },
  {
    id: "serv-5",
    title: "Nuit & Réveil en Écolodge Botanique avec Bain de Forêt",
    category: "lodging",
    categoryLabel: "Éco-Hébergement",
    provider: {
      name: "Wayan & Kadek",
      role: "Hôtes Éco-responsables",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      verified: true,
      rating: 4.99,
      responseTime: "< 10 min",
    },
    location: "Vallée Sacrée d’Ubud, Bali",
    city: "Bali",
    duration: "Par nuit",
    price: 130,
    currency: "€",
    priceUnit: "par nuit (2 pers)",
    rating: 4.98,
    reviewsCount: 312,
    badges: ["Écolabel Platine", "Piscine Naturelle"],
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Bambou villa sur pilotis entourée de rizières avec petit-déjeuner flottant et cours de yoga matinal.",
    fullDescription: "Dormez bercé par la canopée tropicale. Construit en bambou durable avec ventilation naturelle et eau filtrée de source, ce lodge offre une déconnexion totale en harmonie avec la nature balinaise.",
    highlights: ["Vue panoramique sur la jungle", "Séance de yoga matinal offerte", "Navette gratuite vers Ubud"],
    included: ["Petit-déjeuner bio fait maison", "Accès spa & piscine naturelle", "Wifi fibre solaire"],
    instantBooking: true,
  },
  {
    id: "serv-6",
    title: "Balade Nocturne Photographique & Spots Secrets de la Capitale",
    category: "experiences",
    categoryLabel: "Photographie & Balade",
    provider: {
      name: "Alexandre Roche",
      role: "Photographe d'Architecture",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
      verified: true,
      rating: 4.92,
      responseTime: "< 20 min",
    },
    location: "Montmartre & Quais de Seine, Paris",
    city: "Paris",
    duration: "3h00",
    price: 60,
    currency: "€",
    priceUnit: "par personne",
    rating: 4.91,
    reviewsCount: 94,
    badges: ["Conseils Smartphone/Reflex", "15 Photos HD"],
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Capturez la Ville Lumière sous son plus beau jour lors de l'heure bleue et apprenez la composition urbaine.",
    fullDescription: "Que vous utilisiez un smartphone ou un reflex, Alexandre vous guide vers les perspectives insolites, les passages couverts méconnus et les reflets dorés des ponts parisiens.",
    highlights: ["Techniques de pose longue et basse lumière", "15 portraits professionnels retouchés livrés", "Ambiance conviviale petit comité"],
    included: ["Prêt de trépieds & filtres optiques", "Galerie photo HD en ligne", "Pause café viennoiserie"],
    instantBooking: true,
  },
];

// ==========================================
// 3. MOTEUR DE GÉNÉRATION D'ITINÉRAIRE IA
// ==========================================

function generateItinerary(params: TravelSearchParams): GeneratedItinerary {
  const dest = params.destination.trim() || "Kyoto";
  const duration = Math.min(Math.max(params.durationDays || 3, 1), 7);
  const costPerDay = params.budgetLevel === "eco" ? 50 : params.budgetLevel === "luxe" ? 260 : 120;
  const totalCost = costPerDay * duration * params.travelersCount;

  const days: ItineraryDay[] = [];
  for (let i = 1; i <= duration; i++) {
    days.push({
      dayNumber: i,
      title: `Jour ${i} : Immersion locale & découverte de ${dest}`,
      theme: i === 1 ? "Premiers pas & ruelles emblématiques" : i === 2 ? "Artisans d'art & saveurs du terroir" : "Nature, belvédères & échappée belle",
      morning: {
        time: "09:00 - 12:00",
        title: `Exploration matinale du cœur historique de ${dest}`,
        description: `Flânerie paisible dans les ruelles pavées avant l'affluence, découverte de l'architecture traditionnelle et des cours secrètes.`,
        location: `Centre historique, ${dest}`,
        costEstimate: `${Math.round(costPerDay * 0.25)} €`,
        category: "culture",
      },
      lunch: {
        time: "12:30 - 14:00",
        title: `Halte gourmande dans une auberge de quartier`,
        description: `Dégustation d'un menu de saison confectionné avec les récoltes maraîchères locales et accords de vins/infusions régionales.`,
        location: `Marché central ou bistrot d'initiés`,
        costEstimate: `${Math.round(costPerDay * 0.25)} €`,
        category: "food",
      },
      afternoon: {
        time: "14:30 - 18:00",
        title: `Expérience immersive réservée sur la marketplace`,
        description: `Activité sur-mesure ou atelier pratique avec un artisan certifié de la région pour une découverte authentique.`,
        location: `Atelier partenaire à ${dest}`,
        costEstimate: `${Math.round(costPerDay * 0.3)} €`,
        category: "culture",
      },
      evening: {
        time: "19:30 - 22:30",
        title: `Dîner panoramique au crépuscule & ambiance nocturne`,
        description: `Vue dégagée sur les toits illuminés, dégustation de tapas/plats d'auteur et balade sous les lumières dorées.`,
        location: `Belvédère ou terrasse animée`,
        costEstimate: `${Math.round(costPerDay * 0.2)} €`,
        category: "leisure",
      },
      localTip: `Pensez à réserver vos créneaux d'ateliers 48h à l'avance pour profiter de l'accès exclusif sans file d'attente.`,
      dailyEstimatedCost: `${costPerDay * params.travelersCount} €`,
    });
  }

  return {
    id: `itin-${Date.now()}`,
    destination: dest,
    title: `Séjour ${params.travelStyle.toUpperCase()} sur-mesure à ${dest}`,
    overview: `Un voyage de ${duration} jours optimisé par l'IA pour ${params.travelersCount} voyageur(s), alliant visites incontournables, haltes confidentielles et rencontres avec les prestataires de notre marketplace locale.`,
    durationDays: duration,
    travelStyle: params.travelStyle,
    budgetLevel: params.budgetLevel,
    travelersCount: params.travelersCount,
    estimatedTotalBudget: `${totalCost} €`,
    currency: "€",
    bestTransportTip: "Privilégiez la marche et les transports doux pour profiter des cours intérieures invisibles depuis la route.",
    days,
    createdAt: new Date().toLocaleDateString("fr-FR"),
  };
}

// ==========================================
// 4. COMPOSANT PAGE PRINCIPAL NEXT.JS 14
// ==========================================

export default function TravelAppPage() {
  // Search Form State
  const [destination, setDestination] = useState("Kyoto");
  const [durationDays, setDurationDays] = useState(3);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000 * 14).toISOString().split("T")[0]
  );
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("culture");
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("confort");
  const [travelersCount, setTravelersCount] = useState(2);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["artisanat", "gastronomie"]);
  const [isLoading, setIsLoading] = useState(false);

  // Generated Itinerary State
  const [itinerary, setItinerary] = useState<GeneratedItinerary>(() =>
    generateItinerary({
      destination: "Kyoto",
      durationDays: 3,
      startDate: new Date(Date.now() + 86400000 * 14).toISOString().split("T")[0],
      travelStyle: "culture",
      budgetLevel: "confort",
      travelersCount: 2,
      interests: ["artisanat", "gastronomie"],
    })
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Marketplace Filters State
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory>("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedService, setSelectedService] = useState<MarketplaceService | null>(null);
  const [favorites, setFavorites] = useState<string[]>(["serv-1", "serv-2"]);

  // Booking Modal State
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Handlers
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const generated = generateItinerary({
        destination,
        durationDays,
        startDate,
        travelStyle,
        budgetLevel,
        travelersCount,
        interests: selectedInterests,
      });
      setItinerary(generated);
      setSelectedDayIndex(0);
      setIsLoading(false);

      // Smooth scroll to itinerary
      document.getElementById("itinerary-section")?.scrollIntoView({ behavior: "smooth" });
    }, 600);
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered Services Memo
  const filteredServices = useMemo(() => {
    return MOCK_SERVICES.filter((item) => {
      const matchCat = categoryFilter === "all" || item.category === categoryFilter;
      const matchText =
        item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.provider.name.toLowerCase().includes(searchFilter.toLowerCase());
      return matchCat && matchText;
    });
  }, [categoryFilter, searchFilter]);

  const currentDay = itinerary.days[selectedDayIndex] || itinerary.days[0];

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans">
      {/* 1. NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-stone-50/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-stone-900">
                  Terra<span className="text-emerald-600">Locals</span>
                </span>
                <p className="text-xs text-stone-500 hidden sm:block">
                  Itinéraires IA &amp; Marketplace Locale
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
              <a href="#search-form" className="hover:text-emerald-700 transition-colors">
                Générateur IA
              </a>
              <a href="#itinerary-section" className="hover:text-emerald-700 transition-colors">
                Itinéraire Actif
              </a>
              <a href="#marketplace-section" className="hover:text-emerald-700 transition-colors">
                Marketplace des Artisans
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Next.js 14 + Tailwind</span>
              </div>
              <button
                onClick={() => {
                  document.getElementById("search-form")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Créer mon voyage
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* HERO INTRO */}
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-200 text-stone-700">
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>Tourisme Durable &amp; Circuits Courts</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
            Voyagez comme un local grâce à l'IA &amp; aux artisans
          </h1>
          <p className="text-sm sm:text-base text-stone-600">
            Obtenez un itinéraire sur-mesure jour par jour et réservez instantanément des expériences immersives auprès de guides certifiés et producteurs locaux.
          </p>
        </section>

        {/* 2. FORMULAIRE DE RECHERCHE D'ITINÉRAIRE IA */}
        <section id="search-form" className="w-full bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <Sparkles className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                    Générateur d'Itinéraire IA
                  </h2>
                  <p className="text-xs text-stone-500">
                    Personnalisez vos envies pour un programme clé en main
                  </p>
                </div>
              </div>
            </div>

            {/* Destination Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Destination de rêve
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ex: Kyoto, Rome, Marrakech, Bali, Lisbonne..."
                  required
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
                <span className="text-stone-400">Suggestions :</span>
                {["Kyoto", "Rome", "Marrakech", "Bali", "Lisbonne"].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setDestination(city)}
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration, Date & Travelers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 uppercase">
                  Date de départ
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-stone-700 uppercase">
                  <span>Durée ({durationDays} jours)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 mt-3"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>1 jour</span>
                  <span>4 jours</span>
                  <span>7 jours</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 uppercase">
                  Voyageurs
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <select
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value={1}>1 voyageur (Solo)</option>
                    <option value={2}>2 personnes (Couple / Amis)</option>
                    <option value={3}>3 personnes (Famille)</option>
                    <option value={4}>4 personnes</option>
                    <option value={5}>5+ personnes (Groupe)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Travel Style Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Ambiance &amp; Style de voyage
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  { id: "culture", label: "Culture & Histoire", icon: <Landmark className="w-4 h-4" /> },
                  { id: "gastronomie", label: "Gastronomie", icon: <Utensils className="w-4 h-4" /> },
                  { id: "nature", label: "Nature & Randos", icon: <Trees className="w-4 h-4" /> },
                  { id: "detente", label: "Détente & Spa", icon: <Heart className="w-4 h-4" /> },
                  { id: "aventure", label: "Aventure", icon: <Compass className="w-4 h-4" /> },
                  { id: "famille", label: "Famille", icon: <Users className="w-4 h-4" /> },
                ].map((s) => {
                  const active = travelStyle === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setTravelStyle(s.id as TravelStyle)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        active
                          ? "border-emerald-700 bg-emerald-50 text-emerald-950 font-bold"
                          : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={active ? "text-emerald-700" : "text-stone-500"}>
                          {s.icon}
                        </span>
                        {active && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                      </div>
                      <span className="text-xs">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget & Interests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 uppercase">
                  Niveau de budget
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["eco", "confort", "luxe"] as BudgetLevel[]).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudgetLevel(b)}
                      className={`py-2 px-3 text-xs rounded-xl border font-semibold capitalize cursor-pointer transition-all ${
                        budgetLevel === b
                          ? "bg-emerald-700 text-white border-emerald-700"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 uppercase">
                  Envies spécifiques
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "artisanat", label: "Artisanat d'art" },
                    { id: "gastronomie", label: "Saveurs locales" },
                    { id: "photo", label: "Points de vue" },
                    { id: "nature", label: "Plein air" },
                  ].map((t) => {
                    const active = selectedInterests.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleInterest(t.id)}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                          active
                            ? "bg-stone-800 text-white border-stone-800"
                            : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Génération par l'IA en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Générer mon itinéraire ({durationDays} jours à {destination})</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* 3. SECTION ITINÉRAIRE AFFICHÉ */}
        <section id="itinerary-section" className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Itinéraire IA vérifié
                  </span>
                  <span className="text-xs text-stone-400">Pour {itinerary.travelersCount} personne(s)</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold">{itinerary.title}</h3>
                <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                  {itinerary.overview}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 text-right shrink-0">
                <span className="text-xs text-stone-300 block">Budget global estimé</span>
                <span className="text-2xl font-black text-emerald-400">
                  {itinerary.estimatedTotalBudget}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-stone-400 gap-2">
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>{itinerary.bestTransportTip}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Lien de l'itinéraire copié dans le presse-papier !")}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Partager</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Printer className="w-3 h-3" />
                  <span>Imprimer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Days Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {itinerary.days.map((day, idx) => (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  selectedDayIndex === idx
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Jour {day.dayNumber}</span>
                <span className="text-[11px] opacity-80">({day.dailyEstimatedCost})</span>
              </button>
            ))}
          </div>

          {/* Current Day Details Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
              <div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                  Jour {currentDay.dayNumber} : {currentDay.theme}
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-stone-900 mt-1">
                  {currentDay.title}
                </h4>
              </div>
              <a
                href="#marketplace-section"
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Trouver un guide local pour ce jour</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 4 Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Matinée", time: currentDay.morning.time, data: currentDay.morning, icon: <Clock className="w-3.5 h-3.5 text-emerald-700" /> },
                { label: "Halte Gourmande", time: currentDay.lunch.time, data: currentDay.lunch, icon: <Utensils className="w-3.5 h-3.5 text-amber-700" /> },
                { label: "Après-midi Découverte", time: currentDay.afternoon.time, data: currentDay.afternoon, icon: <Landmark className="w-3.5 h-3.5 text-teal-700" /> },
                { label: "Soirée & Ambiance", time: currentDay.evening.time, data: currentDay.evening, icon: <Sparkles className="w-3.5 h-3.5 text-indigo-700" /> },
              ].map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center gap-1.5 text-stone-700">
                      {step.icon}
                      {step.label} ({step.time})
                    </span>
                    <span className="font-semibold text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded">
                      ~ {step.data.costEstimate}
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-stone-900">{step.data.title}</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">{step.data.description}</p>
                  <div className="text-[11px] text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{step.data.location}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Local Insider Tip */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Conseil d'initié de l'IA locale
                </span>
                <p className="text-xs text-amber-800 mt-0.5">{currentDay.localTip}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SECTION SERVICES TOURISTIQUES LOCAUX (MARKETPLACE) */}
        <section id="marketplace-section" className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <Store className="w-5 h-5 text-emerald-700" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                  Marketplace des Services Touristiques Locaux
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Guides francophones certifiés, ateliers d'artisans, chauffeurs privés et éco-hébergements vérifiés.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-600">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-200/70">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                100% Prestataires Vérifiés
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-200/70">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                Réservation Directe
              </span>
            </div>
          </div>

          {/* Categories Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: "all", label: "Tous les services" },
              { id: "guides", label: "Guides Certifiés" },
              { id: "experiences", label: "Expériences & Ateliers" },
              { id: "transports", label: "Transports & Chauffeurs" },
              { id: "workshops", label: "Artisanat" },
              { id: "lodging", label: "Éco-Hébergements" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as ServiceCategory)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  categoryFilter === cat.id
                    ? "bg-stone-900 text-white"
                    : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar inside Marketplace */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrer par titre, artisan, ville..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          {/* Grid of Marketplace Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((item) => {
              const isFav = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-1">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white/95 text-stone-900 shadow-xs">
                        {item.categoryLabel}
                      </span>
                      {item.badges[0] && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-700 text-white shadow-xs">
                          {item.badges[0]}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-stone-600 hover:text-red-500 shadow-xs transition-colors cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span className="flex items-center gap-1 line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-stone-600">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {item.duration}
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2">
                        {item.title}
                      </h4>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {item.shortDescription}
                      </p>
                    </div>

                    {/* Provider Info */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.provider.avatar}
                          alt={item.provider.name}
                          className="w-8 h-8 rounded-full object-cover border border-stone-200"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-semibold text-stone-900 leading-tight">
                              {item.provider.name}
                            </span>
                            {item.provider.verified && (
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            )}
                          </div>
                          <span className="text-[10px] text-stone-500 block leading-tight">
                            {item.provider.role}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-stone-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.rating}</span>
                        <span className="text-[10px] text-stone-400">({item.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-500 block">Tarif</span>
                        <span className="text-lg font-black text-stone-900">
                          {item.price} {item.currency}{" "}
                          <span className="text-[11px] font-normal text-stone-500">
                            / {item.priceUnit}
                          </span>
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedService(item);
                          setBookingConfirmed(false);
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer"
                      >
                        Détails &amp; Réserver
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 5. MODAL DE RÉSERVATION / DÉTAILS SERVICE */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                {selectedService.categoryLabel}
              </span>
              <button
                onClick={() => setSelectedService(null)}
                className="w-7 h-7 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {bookingConfirmed ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-stone-900">Réservation Enregistrée !</h4>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Votre demande pour <strong>{selectedService.title}</strong> auprès de{" "}
                    <strong>{selectedService.provider.name}</strong> a bien été transmise.
                  </p>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="mt-2 px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-800"
                  >
                    Revenir à l'itinéraire
                  </button>
                </div>
              ) : (
                <>
                  <div className="aspect-[16/9] rounded-xl overflow-hidden bg-stone-100">
                    <img
                      src={selectedService.image}
                      alt={selectedService.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-stone-900">{selectedService.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {selectedService.fullDescription}
                  </p>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                    <span className="font-bold text-stone-800 block">Ce qui est inclus :</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-stone-600">
                      {selectedService.included.map((inc, i) => (
                        <li key={i}>{inc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-500 block">Total indicatif :</span>
                      <span className="text-xl font-black text-stone-900">
                        {selectedService.price} {selectedService.currency}
                      </span>
                    </div>
                    <button
                      onClick={() => setBookingConfirmed(true)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-800 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Confirmer la réservation</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. FOOTER */}
      <footer className="w-full border-t border-stone-200 bg-white py-8 text-center text-xs text-stone-500 space-y-2">
        <p className="font-medium text-stone-700">
          TerraLocals • Itinéraire de Voyage IA &amp; Marketplace Locale
        </p>
        <p>
          Développé pour Next.js 14 (App Router) avec Tailwind CSS et Lucide Icons.
        </p>
      </footer>
    </div>
  );
}
