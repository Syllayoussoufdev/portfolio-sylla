import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/profiles";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ShieldCheck, Cookie, Lock, Eye, RefreshCw } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Politique de Confidentialité & Cookies | Sylla Youssouf",
  description: "Engagement relatif à la protection des données personnelles, à la gestion des cookies et à l'exercice de vos droits (RGPD).",
};

export default async function ConfidentialitePage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-medium mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Protection des données personnelles (RGPD)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] mb-4">
            Politique de Confidentialité &amp; Cookies
          </h1>
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            Transparence totale sur la collecte, l&apos;utilisation de vos données personnelles et la gestion de vos préférences de navigation.
          </p>
        </header>

        <div className="space-y-10 text-sm leading-relaxed text-[#334155]">
          {/* 1. Responsable */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#2563EB]" />
              1. Responsable du traitement
            </h2>
            <p>
              Le responsable du traitement des données personnelles collectées sur le site <strong>syllayoussouf.com</strong> est :
            </p>
            <p className="text-xs sm:text-sm font-medium">
              {nom} — Contact : <a href={`mailto:${email}`} className="text-[#2563EB] hover:underline">{email}</a>
            </p>
          </section>

          {/* 2. Données collectées */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#2563EB]" />
              2. Données collectées et finalités
            </h2>
            <div className="space-y-3 text-xs sm:text-sm">
              <p>
                <strong>A. Formulaire de contact :</strong> Lorsque vous envoyez un message via le formulaire, nous collectons votre nom, votre adresse email et le contenu de votre message. Ces informations sont utilisées exclusivement pour traiter et répondre à votre demande. Elles ne sont ni cédées, ni vendues, ni utilisées à des fins de prospection commerciale automatisée.
              </p>
              <p>
                <strong>B. Durée de conservation :</strong> Les messages de contact sont conservés en base sécurisée pour une durée maximale de 24 mois à compter de leur réception.
              </p>
            </div>
          </section>

          {/* 3. Cookies et Google Analytics 4 */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Cookie className="w-5 h-5 text-[#2563EB]" />
              3. Cookies et Mesure d&apos;audience (Google Analytics 4)
            </h2>
            <p className="text-xs sm:text-sm">
              Ce site intègre la solution de mesure d&apos;audience <strong>Google Analytics 4 (GA4)</strong>. Elle permet d&apos;analyser le volume de visites, les pages les plus consultées et les parcours de navigation afin d&apos;optimiser l&apos;ergonomie du site.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <p className="font-semibold text-[#0F172A]">Garanties de respect de la vie privée :</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Google Consent Mode v2 :</strong> Par défaut, tous les cookies analytiques sont strictement bloqués tant que vous n&apos;avez pas cliqué sur « Accepter ».</li>
                <li><strong>Anonymisation de l&apos;adresse IP :</strong> Votre adresse IP n&apos;est jamais stockée en clair sur nos serveurs.</li>
                <li><strong>Absence de publicité :</strong> Aucun cookie de reciblage publicitaire ni tracker tiers commercial n&apos;est activé.</li>
              </ul>
            </div>
            <p className="text-xs sm:text-sm">
              Vous pouvez à tout moment modifier ou révoquer votre choix de consentement en cliquant sur le lien <strong>« Gestion des cookies »</strong> situé dans le pied de page du site.
            </p>
          </section>

          {/* 4. Vos droits */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#2563EB]" />
              4. Vos droits (RGPD)
            </h2>
            <p className="text-xs sm:text-sm">
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement et de portabilité de vos données personnelles, ainsi que d&apos;un droit d&apos;opposition au traitement.
            </p>
            <p className="text-xs sm:text-sm">
              Pour exercer ces droits, vous pouvez contacter directement : <a href={`mailto:${email}`} className="text-[#2563EB] hover:underline font-medium">{email}</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
