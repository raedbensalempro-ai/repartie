import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Repartie — La réplique parfaite, en 3 secondes",
  description:
    "Tu reçois un message méchant ? Repartie te génère 3 répliques cinglantes, drôles, élégantes ou glaçantes. Colle, choisis, envoie.",
  metadataBase: new URL("https://repartie.app"),
  openGraph: {
    title: "Repartie — La réplique parfaite, en 3 secondes",
    description:
      "Tu reçois un message méchant ? Repartie te génère 3 répliques en 3 secondes.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-[#050505] text-neutral-200">{children}</body>
    </html>
  );
}
