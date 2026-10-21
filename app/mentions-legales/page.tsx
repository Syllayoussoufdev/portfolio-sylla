import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/profiles";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Shield, Scale, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mentions Légales | Sylla Youssouf",
  description: "Mentions légales, informations sur l'éditeur et l'hébergeur du portfolio de Sylla Youssouf.",
};

export default async function MentionsLegalesPage() {
  const settings = await getSiteSettings();
  const nom = settings?.nom || "Sylla Youssouf";
  const email = settings?.emailPublic || "contact@syllayoussouf.com";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <Navbar settings={settings} />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#475569] hover:text-[#2563EB] mb-8 transition-colors group"
        >
          <span className="p-1.5 rounded-full bg-white border border-slate-200/80 group-hover:border-[#2563EB]/40 group-hover:-translate-x-0.5 transition-all shadow-xs">
            <ArrowLeft className="w-3.5 h-3.5 text-[#0F172A] group-hover:text-[#2563EB]" />
          </span>
          <span>Retour à l&apos;accueil</span>
        </Link>

        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#2563EB] text-xs font-medium mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Cadre juridique</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] mb-4">
            Mentions Légales
          </h1>
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            Conformément aux dispositions de l&apos;article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique.
          </p>
        </header>

        <div className="space-y-10 text-sm leading-relaxed text-[#334155]">
          {/* 1. Éditeur */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2563EB]" />
              1. Éditeur du site
            </h2>
            <p>
              Le présent site, accessible à l&apos;adresse <strong>https://syllayoussouf.com</strong>, est édité par :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li><strong>Nom et prénom :</strong> {nom}</li>
              <li><strong>Activité :</strong> Communication digitale, création visuelle &amp; développement d&apos;applications web et mobiles</li>
              <li><strong>Adresse électronique :</strong> <a href={`mailto:${email}`} className="text-[#2563EB] hover:underline">{email}</a></li>
              <li><strong>Directeur de la publication :</strong> {nom}</li>
            </ul>
          </section>

          {/* 2. Hébergeur */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#2563EB]" />
              2. Hébergement
            </h2>
            <p>Le site est hébergé par :</p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li><strong>Plateforme d&apos;hébergement applicatif :</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (<a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline">vercel.com</a>)</li>
              <li><strong>Base de données relationnelle :</strong> Neon Inc., San Francisco, CA, États-Unis (<a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline">neon.tech</a>)</li>
            </ul>
          </section>

          {/* 3. Propriété intellectuelle */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A]">
              3. Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble des contenus présents sur ce site (textes, visuels, photographies, vidéos, animations 3D, code source, logos) constituent des créations protégées par les lois relatives à la propriété intellectuelle. Toute reproduction, représentation, modification ou diffusion, totale ou partielle, sans l&apos;accord préalable et écrit de l&apos;auteur est strictement interdite.
            </p>
            <p className="text-xs text-slate-500">
              Les marques, logotypes et marques déposées de tiers mentionnés dans les études de cas ou les sections d&apos;outils restent la propriété exclusive de leurs détenteurs respectifs.
            </p>
          </section>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
