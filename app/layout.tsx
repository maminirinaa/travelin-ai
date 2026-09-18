import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Calendar,
  User,
  Heart,
  Globe,
  Search,
} from 'lucide-react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'TravelAI - Planificateur de Voyage & Marketplace Locale',
    template: '%s | TravelAI',
  },
  description:
    'Générez des itinéraires de voyage personnalisés par IA et réservez des services touristiques auprès de guides et d expéditions locaux.',
  keywords: [
    'Voyage',
    'Itinéraire IA',
    'Tourisme',
    'Marketplace locale',
    'Guides touristiques',
    'Activités',
  ],
  authors: [{ name: 'TravelAI Team' }],
  openGraph: {
    title: 'TravelAI - Votre compagnon de voyage intelligent',
    description:
      'Générez des itinéraires sur-mesure et réservez vos activités locales en toute simplicité.',
    url: 'https://travelai.com',
    siteName: 'TravelAI',
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased`}
      >
        {/* Navigation / Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:bg-indigo-700 transition-colors">
                  <Compass className="w-6 h-6 animate-spin-slow" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  TravelAI
                </span>
              </Link>

              {/* Navigation Links - Desktop */}
              <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
                <Link
                  href="/"
                  className="hover:text-indigo-600 transition-colors flex items-center space-x-1"
                >
                  <Search className="w-4 h-4" />
                  <span>Itinéraires IA</span>
                </Link>
                <Link
                  href="#marketplace"
                  className="hover:text-indigo-600 transition-colors flex items-center space-x-1"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Services Locaux</span>
                </Link>
                <Link
                  href="#destinations"
                  className="hover:text-indigo-600 transition-colors flex items-center space-x-1"
                >
                  <Globe className="w-4 h-4" />
                  <span>Destinations</span>
                </Link>
              </nav>

              {/* Actions utilisateur */}
              <div className="flex items-center space-x-4">
                <button
                  aria-label="Favoris"
                  className="p-2 text-slate-600 hover:text-red-500 hover:bg-slate-100 rounded-full transition-colors hidden sm:flex"
                >
                  <Heart className="w-5 h-5" />
                </button>
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Se connecter</span>
                </Link>
                <Link
                  href="/#planner"
                  className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Créer un voyage
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal de la page */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Branding */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-600 text-white p-2 rounded-xl">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold text-white">TravelAI</span>
                </div>
                <p className="text-sm text-slate-400">
                  Planifiez vos voyages sur mesure grâce à l intelligence
                  artificielle et découvrez les meilleures expériences locales.
                </p>
              </div>

              {/* Liens : Navigation */}
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Plateforme
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/" className="hover:text-white transition">
                      Générateur d itinéraire
                    </Link>
                  </li>
                  <li>
                    <Link href="#marketplace" className="hover:text-white transition">
                      Marketplace locale
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="hover:text-white transition">
                      Proposer un service
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Liens : Support */}
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Aide & Support
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/faq" className="hover:text-white transition">
                      Foire Aux Questions
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-white transition">
                      Conditions d utilisation
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-white transition">
                      Politique de confidentialité
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Newsletter
                </h4>
                <p className="text-sm mb-3">
                  Inscrivez-vous pour recevoir des idées de voyage et offres.
                </p>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex space-x-2"
                >
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="w-full px-3 py-2 text-sm bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-700"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                  >
                    OK
                  </button>
                </form>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} TravelAI. Tous droits réservés.</p>
              <p className="mt-2 sm:mt-0">
                Développé avec Next.js 14 & Tailwind CSS
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
