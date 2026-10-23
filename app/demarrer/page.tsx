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
      className="min-h-screen bg-[#F6F4FF] text-[#1E2347] py-10 sm:py-16 px-4 sm:px-6 flex flex-col justify-between"
    >
      <div className="max-w-4xl w-full mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2DFF5] text-xs font-bold text-[#1E2347] hover:border-[#4C5FD7] transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F4825A]" />
            <span>Retour à l&apos;accueil</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F7D5C5]/60 text-[#1E2347] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#F4825A]" />
            Réponse garantie sous 24 h
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1E2347] font-[family-name:var(--font-dm-sans)]">
            Transformons votre idée en{" "}
            <span className="italic font-normal text-[#F4825A] font-[family-name:var(--font-instrument-serif)]">
              opportunité concrète.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#434975]">
            Répondez à ces 4 questions rapides pour cadrer votre projet et recevoir votre estimation sur WhatsApp ou par e-mail.
          </p>
        </div>

        <BriefWizardModal inline />
      </div>

      <footer className="max-w-4xl w-full mx-auto pt-12 text-center text-xs text-[#5C6394]">
        © {new Date().getFullYear()} Sylla Youssouf · Abidjan &amp; International · Tous droits réservés.
      </footer>
    </div>
  );
}
