import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getDevCreativeCatalog } from "@/lib/devcreative";
import { getSiteSettings } from "@/lib/profiles";
import { ServicesPacksDevCreative } from "@/templates/devcreative/ServicesPacksDevCreative";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services & Packs Freelance (Tarifs FCFA) | Sylla Youssouf",
  description:
    "Découvrez le catalogue transparent des 5 familles d'offres et 4 packs clés en main : Identité visuelle, Stratégie, Sites vitrines, Plateformes web & Applications mobiles.",
};

export default async function ServicesCatalogPage() {
  const [catalog, settings] = await Promise.all([
    getDevCreativeCatalog(),
    getSiteSettings(),
  ]);

  return (
    <div
      data-template="devcreative"
      className="min-h-screen bg-[#FFFBF5] text-[#0D1F1A] flex flex-col justify-between"
    >
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-8 pb-2 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E6DEC8] text-xs font-bold text-[#0D1F1A] hover:border-[#00A86B] transition-all shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#FF4D00]" />
          <span>Retour au portfolio</span>
        </Link>

        <Link
          href="/demarrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#091410] hover:bg-[#00A86B] text-white text-xs font-bold transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF4D00]" />
          <span>Démarrer un brief en 4 étapes</span>
        </Link>
      </header>

      <main className="flex-1">
        <ServicesPacksDevCreative
          offers={catalog.offers}
          packs={catalog.packs}
        />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
