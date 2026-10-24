import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { BriefWizardModal } from "@/components/devcreative/BriefWizardModal";

export const metadata: Metadata = {
  title: "Démarrer un projet — Brief rapide & Devis | Sylla Youssouf",
  description:
    "Décrivez votre besoin en 4 étapes simples (Site vitrine, Plateforme SaaS, Application Mobile, Identité de marque) et recevez votre proposition sous 24 h.",
};

export default function DemarrerProjetPage() {
  return (
    <div
      data-template="devcreative"
      className="min-h-screen bg-[#F0F7FF] text-[#0A1D37] py-10 sm:py-16 px-4 sm:px-6 flex flex-col justify-between"
    >
      <div className="max-w-4xl w-full mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#CBE2FF] text-xs font-bold text-[#0A1D37] hover:border-[#2563EB] transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>Retour à l&apos;accueil</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E0F2FE]/60 text-[#0A1D37] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9]" />
            Réponse garantie sous 24 h
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0A1D37] font-[family-name:var(--font-dm-sans)]">
            Transformons votre idée en{" "}
            <span className="italic font-normal text-[#0EA5E9] font-[family-name:var(--font-instrument-serif)] text-[1.12em]">
              opportunité concrète.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#334E68]">
            Répondez à ces 4 questions rapides pour cadrer votre projet et recevoir votre estimation sur WhatsApp ou par e-mail.
          </p>
        </div>

        <BriefWizardModal inline />
      </div>

      <footer className="max-w-4xl w-full mx-auto pt-12 text-center text-xs text-[#526D82]">
        © {new Date().getFullYear()} Sylla Youssouf · Abidjan &amp; International · Tous droits réservés.
      </footer>
    </div>
  );
}
