"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, ArrowRight } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string | React.ReactNode;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Qui est Sylla Youssouf ?",
    answer: (
      <div className="space-y-2 text-sm text-[#475569] leading-relaxed">
        <p>
          <strong className="text-[#0F172A]">Sylla Youssouf</strong> est un <strong>Creative Engineer</strong>,
          Designer UI/UX, Graphiste et Développeur Web Full Stack basé à <strong>Abidjan, Côte d&apos;Ivoire</strong>.
        </p>
        <p>
          Il allie sensibilité artistique et rigueur technique pour concevoir des identités de marque mémorables,
          développer des plateformes web modernes et réactives (Next.js, React, Laravel, Django) et automatiser
          les processus métier avec l&apos;Intelligence Artificielle et n8n.
        </p>
      </div>
    ),
  },
  {
    question: "Quels services propose Sylla Youssouf à Abidjan ?",
    answer: (
      <div className="space-y-2 text-sm text-[#475569] leading-relaxed">
        <p>
          Sylla Youssouf accompagne les entreprises, startups et indépendants sur l&apos;ensemble de leur chaîne de valeur digitale :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Développement Web &amp; Mobile :</strong> Sites vitrines One-Page, plateformes SaaS, boutiques e-commerce avec paiement Mobile Money (Wave, Orange Money) et back-offices sur-mesure.</li>
          <li><strong>Design UI/UX &amp; Graphique :</strong> Maquettage Figma, design systems, logos vectoriels, chartes graphiques, packaging et supports imprimés (affiches, kakémonos).</li>
          <li><strong>Communication Digitale &amp; Acquisition :</strong> Gestion et optimisation de pages Facebook/Instagram, campagnes publicitaires ciblées (Meta Ads) et création de contenu vidéo court.</li>
          <li><strong>Automatisation IA &amp; n8n :</strong> Capture automatique de leads, synchronisation WhatsApp Business, CRM et flux opérationnels.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Combien coûte la création d'un site web ou d'une identité visuelle en Côte d'Ivoire ?",
    answer: (
      <div className="space-y-2 text-sm text-[#475569] leading-relaxed">
        <p>
          Les tarifs sont transparents, calibrés pour le marché ivoirien et adaptés au stade de votre projet :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Prestations à la carte :</strong> Dès <strong>50 000 FCFA</strong> (création de logo vectoriel, campagne Facebook Ads ciblée, scénario n8n unitaire).</li>
          <li><strong>Pack Starter Lancement :</strong> <strong>75 000 FCFA</strong> pour un site One-Page moderne avec logo et liaison WhatsApp directe.</li>
          <li><strong>Packs Métiers (Présence, Acquisition, E-Commerce) :</strong> De <strong>140 000 FCFA</strong> à <strong>260 000 FCFA</strong> selon les fonctionnalités requises.</li>
          <li><strong>Projets complexes (&gt; 300 000 FCFA) :</strong> Sur <strong>devis personnalisé gratuit sous 24h</strong> après cadrage précis de votre cahier des charges.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Comment travailler avec Sylla Youssouf à distance ou à Abidjan ?",
    answer: (
      <div className="space-y-2 text-sm text-[#475569] leading-relaxed">
        <p>
          La collaboration est fluide, transparente et adaptée à votre localisation :
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li><strong>Prise de contact &amp; Brief express :</strong> Échange par WhatsApp (+225 05 94 56 49 93) ou via le formulaire de brief en ligne.</li>
          <li><strong>Proposition &amp; Devis clair :</strong> Réception sous 24h du plan d&apos;action détaillé, des livrables et du calendrier.</li>
          <li><strong>Conception &amp; Suivi en direct :</strong> Validation des maquettes Figma, développement avec lien de prévisualisation interactif.</li>
          <li><strong>Livraison &amp; Prise en main :</strong> Mise en ligne officielle, session de formation et support garanti.</li>
        </ol>
        <p className="pt-1">
          Disponible en présentiel à Abidjan (Cocody, Plateau, etc.) ou 100% à distance pour les clients en région et à l&apos;international.
        </p>
      </div>
    ),
  },
];

export function FaqSection({ className = "" }: { className?: string }) {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section id="faq" className={`py-16 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto w-full ${className}`}>
      {/* En-tête de section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/60 text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Foire Aux Questions • Indexation &amp; Réponses Claires</span>
        </div>
        <h2 className="font-bebas text-4xl sm:text-5xl text-[#0F172A] tracking-wider leading-none mb-3">
          QUESTIONS FRÉQUENTES
        </h2>
        <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
          Tout ce que vous devez savoir sur mes compétences, mes tarifs en Côte d&apos;Ivoire et le déroulement d&apos;un projet.
        </p>
      </div>

      {/* Accordéon FAQ */}
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div
              key={idx}
              className={`rounded-2xl transition-all border ${
                isOpen
                  ? "bg-white/90 border-[#2563EB]/40 shadow-sm"
                  : "bg-white/60 border-slate-200/80 hover:border-slate-300 hover:bg-white/80"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer transition-colors"
              >
                <span className="font-semibold text-sm sm:text-base text-[#0F172A] flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-[#2563EB] text-xs flex items-center justify-center shrink-0 font-mono font-bold">
                    {idx + 1}
                  </span>
                  <span>{item.question}</span>
                </span>
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform shrink-0 ${
                    isOpen ? "rotate-180 bg-blue-50 text-[#2563EB]" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  className="px-5 pb-6 sm:px-6 pt-1 border-t border-slate-100"
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bannière de contact rapide sous la FAQ */}
      <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-blue-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Une question spécifique sur votre projet ?</span>
          </div>
          <h3 className="font-bebas text-2xl tracking-wide">
            ÉCHANGEZ DIRECTEMENT AVEC SYLLA YOUSSOUF
          </h3>
          <p className="text-xs text-slate-300 max-w-md">
            Réponse garantie en moins de 2 heures via WhatsApp ou par email pour discuter de votre besoin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="https://wa.me/2250594564993?text=Bonjour%20Sylla,%20j'ai%20une%20question%20concernant%20un%20projet%20digital."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp (+225 05 94 56 49 93)</span>
          </a>
          <Link
            href="/demarrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all active:scale-95"
          >
            <span>Lancer un brief</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
