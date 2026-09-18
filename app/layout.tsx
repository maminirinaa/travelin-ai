import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRAVELIN AI - Plateforme Touristique & Itinéraires",
  description: "Planifiez vos voyages avec l'IA et réservez des activités locales.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
