"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock,
  MessageCircle,
  Loader2,
  AlertCircle,
  Layers,
  Globe,
  Smartphone,
  Palette,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { submitProjectLeadAction, submitWaitlistAction } from "@/app/actions/devcreative-leads";
import {
  trackWizardStart,
  trackWizardStep,
  trackLeadSubmit,
  trackWhatsappClick,
} from "@/lib/analytics-client";

const STORAGE_KEY = "sylla_devcreative_brief_v1";

export const PROJECT_TYPES = [
  {
    id: "presence-en-ligne",
    label: "Site Vitrine & Présence Web",
    desc: "Site rapide et moderne pour convertir vos visiteurs en clients",
    priceHint: "dès 200 000 FCFA",
    icon: Globe,
  },
  {
    id: "saas-plateforme",
    label: "Plateforme Web / SaaS / E-commerce",
    desc: "Application dynamique sur-mesure avec back-office de gestion",
    priceHint: "dès 600 000 FCFA",
    icon: Layers,
  },
  {
    id: "mobile-business",
    label: "Application Mobile Business",
    desc: "iOS & Android (commande, suivi, fidélisation, paiement)",
    priceHint: "Sur devis",
    icon: Smartphone,
  },
  {
    id: "conception-identite",
    label: "Identité Visuelle & Design",
    desc: "Logo, charte graphique, maquettes UI/UX et supports de marque",
    priceHint: "dès 100 000 FCFA",
    icon: Palette,
  },
  {
    id: "pack-lancement",
    label: "Pack Lancement (Identité + Site)",
    desc: "Formule clé en main : Identité express + Site vitrine essentiel",
    priceHint: "270 000 FCFA",
    icon: Sparkles,
  },
  {
    id: "missions-ponctuelles",
    label: "Mission Ponctuelle / Audit / IA",
    desc: "Revue de code, dépannage, automatisation ou renfort technique",
    priceHint: "Forfait / Journée",
    icon: Wrench,
  },
] as const;

export const BUDGET_RANGES = [
  { id: "100k-250k FCFA", label: "100 000 – 250 000 FCFA", sub: "Identité express ou site vitrine simple" },
  { id: "250k-500k FCFA", label: "250 000 – 500 000 FCFA", sub: "Pack Lancement ou site standard complet" },
  { id: "500k-1M FCFA", label: "500 000 – 1 000 000 FCFA", sub: "Plateforme dynamique, Pack Croissance ou Mobile" },
  { id: "+1M FCFA / Sur devis", label: "+ 1 000 000 FCFA / Sur devis", sub: "Écosystème complet ou application sur-mesure" },
] as const;

export const DEADLINE_OPTIONS = [
  { id: "Urgent (1 à 2 semaines)", label: "Urgent (1 à 2 semaines)" },
  { id: "2 à 4 semaines", label: "2 à 4 semaines (Idéal)" },
  { id: "1 à 2 mois", label: "1 à 2 mois" },
  { id: "Flexible / En cadrage", label: "Flexible / En phase de cadrage" },
] as const;

export const QUICK_GOALS = [
  "Lancer ma marque et attirer mes premiers clients en ligne",
  "Moderniser mon site actuel pour générer plus de demandes de devis",
  "Digitaliser mes commandes / réservations avec un back-office",
  "Créer une application mobile ou un SaaS métier sur-mesure",
];

interface BriefWizardProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialProjectType?: string;
  inline?: boolean;
}

export function BriefWizardModal({
  isOpen = true,
  onClose,
  initialProjectType,
  inline = false,
}: BriefWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [projectType, setProjectType] = useState<string>(
    initialProjectType || "presence-en-ligne"
  );
  const [goal, setGoal] = useState<string>("");
  const [budgetRange, setBudgetRange] = useState<string>("250k-500k FCFA");
  const [deadline, setDeadline] = useState<string>("2 à 4 semaines");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(true);
  const [honeypot, setHoneypot] = useState<string>("");
  const [utm, setUtm] = useState<{ source?: string; medium?: string; campaign?: string }>({});

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  // Restauration localStorage (reprise en cas d'abandon) + capture UTM
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const params = new URLSearchParams(window.location.search);
      const source = params.get("utm_source") || undefined;
      const medium = params.get("utm_medium") || undefined;
      const campaign = params.get("utm_campaign") || undefined;
      if (source || medium || campaign) {
        setUtm({ source, medium, campaign });
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.projectType && !initialProjectType) setProjectType(parsed.projectType);
        if (parsed.goal) setGoal(parsed.goal);
        if (parsed.budgetRange) setBudgetRange(parsed.budgetRange);
        if (parsed.deadline) setDeadline(parsed.deadline);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.message) setMessage(parsed.message);
      }
    } catch {
      // Ignorer erreurs de stockage privé
    }
  }, [initialProjectType]);

  // Synchroniser si initialProjectType change à l'ouverture
  useEffect(() => {
    if (initialProjectType) {
      setProjectType(initialProjectType);
      setStep(1);
      trackWizardStart(initialProjectType, "selector");
    }
  }, [initialProjectType]);

  // Sauvegarde automatique dans localStorage à chaque saisie
  useEffect(() => {
    if (typeof window === "undefined" || step === 5) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          projectType,
          goal,
          budgetRange,
          deadline,
          name,
          email,
          phone,
          message,
        })
      );
    } catch {
      // Ignorer
    }
  }, [projectType, goal, budgetRange, deadline, name, email, phone, message, step]);

  if (!inline && !isOpen) return null;

  const goNextStep = (next: 1 | 2 | 3 | 4) => {
    setError(null);
    if (next === 3 && goal.trim().length < 5) {
      setError("Veuillez décrire ou choisir votre objectif principal (au moins quelques mots).");
      return;
    }
    setStep(next);
    trackWizardStep(next, `step_${next}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError("Veuillez cocher la case de consentement pour envoyer votre brief.");
      return;
    }

    setSubmitting(true);
    try {
      const selectedTypeLabel =
        PROJECT_TYPES.find((t) => t.id === projectType)?.label || projectType;

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectType: selectedTypeLabel,
          goal: goal.trim().length >= 5 ? goal.trim() : "Lancer et développer mon projet digital",
          budgetRange: budgetRange || "250k-500k FCFA",
          deadline: deadline || "2 à 4 semaines",
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          consent: true,
          utm,
          company_website: honeypot,
        }),
      });
      const resData = await response.json().catch(() => ({}));
      const res = {
        success: response.ok,
        error: resData.error,
        whatsappUrl: resData.whatsappUrl,
      };

      if (!res.success) {
        setError(res.error || "Impossible d'envoyer le brief.");
        trackLeadSubmit(projectType, budgetRange, "error");
        setSubmitting(false);
        return;
      }

      trackLeadSubmit(projectType, budgetRange, "success");
      setWhatsappUrl(res.whatsappUrl || null);
      setStep(5);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignorer
      }
    } catch {
      const fallbackWaLines = [
        `Bonjour Sylla 👋, je viens de remplir un brief sur votre site :`,
        ``,
        `• *Projet :* ${PROJECT_TYPES.find((t) => t.id === projectType)?.label || projectType}`,
        `• *Objectif :* ${goal || "Développer ma présence digitale"}`,
        `• *Budget estimé :* ${budgetRange}`,
        `• *Délai souhaité :* ${deadline}`,
        `• *Contact :* ${name} (${phone} / ${email})`,
      ];
      if (message) fallbackWaLines.push(`• *Précisions :* ${message}`);
      const fallbackUrl = `https://wa.me/2250594564993?text=${encodeURIComponent(fallbackWaLines.join("\n"))}`;
      setWhatsappUrl(fallbackUrl);
      setStep(5);
    } finally {
      setSubmitting(false);
    }
  };

  const wizardCard = (
    <div
      className={`bg-white text-[#0A1D37] rounded-[24px] border border-[#CBE2FF] shadow-2xl overflow-hidden w-full ${
        inline ? "max-w-3xl mx-auto" : "max-w-2xl max-h-[92vh] flex flex-col"
      }`}
    >
      {/* En-tête du Wizard avec progression */}
      <div className="bg-[#061326] text-white px-6 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#0EA5E9] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {step < 5 ? `Brief Rapide · Étape ${step} sur 4` : "Brief Validé & Enregistré"}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold mt-0.5 font-[family-name:var(--font-dm-sans)]">
            {step === 1 && "Quel type de projet souhaitez-vous lancer ?"}
            {step === 2 && "Quel est votre objectif principal ?"}
            {step === 3 && "Quel budget et quel délai envisagez-vous ?"}
            {step === 4 && "Où puis-je vous envoyer votre proposition ?"}
            {step === 5 && "Votre brief est prêt à être discuté !"}
          </h3>
        </div>

        {!inline && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le wizard de brief"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Barre de progression 4 étapes */}
      {step < 5 && (
        <div className="grid grid-cols-4 gap-1 bg-[#F0F7FF] px-6 py-2.5 border-b border-[#CBE2FF]">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center gap-2">
              <div
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  step >= num ? "bg-[#0EA5E9]" : "bg-[#CBE2FF]"
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Corps du Wizard */}
      <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* ÉTAPE 1 : TYPE DE PROJET */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECT_TYPES.map((item) => {
                const Icon = item.icon;
                const selected = projectType === item.id || projectType === item.label;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProjectType(item.id)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      selected
                        ? "border-[#2563EB] bg-[#F0F7FF] shadow-sm"
                        : "border-[#CBE2FF] hover:border-[#2563EB]/50 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          selected
                            ? "bg-[#2563EB] text-white"
                            : "bg-[#F0F7FF] text-[#0A1D37]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#E0F2FE]/60 text-[#0A1D37]">
                        {item.priceHint}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#0A1D37]">{item.label}</div>
                      <div className="text-xs text-[#334E68] mt-0.5 leading-snug">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => goNextStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A1D37] hover:bg-[#2563EB] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                <span>Continuer vers l&apos;objectif</span>
                <ArrowRight className="w-4 h-4 text-[#0EA5E9]" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : OBJECTIF DU PROJET */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#334E68] mb-2">
                Suggestions rapides (cliquez pour pré-remplir)
              </label>
              <div className="flex flex-wrap gap-2">
                {QUICK_GOALS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setGoal(q)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      goal === q
                        ? "bg-[#2563EB] text-white border-[#2563EB]"
                        : "bg-[#F0F7FF] text-[#0A1D37] border-[#CBE2FF] hover:border-[#2563EB]"
                    }`}
                  >
                    + {q}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="wizard-goal"
                className="block text-xs font-bold uppercase tracking-wider text-[#0A1D37] mb-2"
              >
                Décrivez votre besoin et le résultat attendu *
              </label>
              <textarea
                id="wizard-goal"
                rows={4}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Ex : J'ai une marque de cosmétiques à Abidjan et je souhaite un site vitrine rapide avec prise de commande directe sur WhatsApp..."
                className="w-full p-4 rounded-2xl border border-[#CBE2FF] bg-[#F0F7FF]/50 text-sm text-[#0A1D37] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#CBE2FF] text-xs font-semibold text-[#334E68] hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour</span>
              </button>

              <button
                type="button"
                onClick={() => goNextStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A1D37] hover:bg-[#2563EB] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                <span>Continuer vers budget &amp; délai</span>
                <ArrowRight className="w-4 h-4 text-[#0EA5E9]" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : BUDGET (FCFA) & DÉLAI */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1D37] mb-2.5">
                Enveloppe budgétaire envisagée (FCFA) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BUDGET_RANGES.map((b) => {
                  const selected = budgetRange === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBudgetRange(b.id)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        selected
                          ? "border-[#0EA5E9] bg-[#E0F2FE]/25"
                          : "border-[#CBE2FF] hover:border-[#0EA5E9]/50 bg-white"
                      }`}
                    >
                      <div className="font-bold text-sm text-[#0A1D37]">{b.label}</div>
                      <div className="text-[11px] text-[#334E68] mt-0.5">{b.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1D37] mb-2.5">
                Délai de mise en ligne souhaité *
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {DEADLINE_OPTIONS.map((d) => {
                  const selected = deadline === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDeadline(d.id)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        selected
                          ? "border-[#2563EB] bg-[#2563EB] text-white"
                          : "border-[#CBE2FF] bg-[#F0F7FF]/60 text-[#0A1D37] hover:border-[#2563EB]"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#CBE2FF] text-xs font-semibold text-[#334E68] hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour</span>
              </button>

              <button
                type="button"
                onClick={() => goNextStep(4)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A1D37] hover:bg-[#2563EB] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                <span>Dernière étape : Coordonnées</span>
                <ArrowRight className="w-4 h-4 text-[#0EA5E9]" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : COORDONNÉES & CONSENTEMENT */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ Honeypot invisible anti-robots */}
            <input
              type="text"
              name="company_website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1D37] mb-1.5">
                  Votre nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : Awa Koné"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBE2FF] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1D37] mb-1.5">
                  Numéro WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex : +225 07 00 00 00 00"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBE2FF] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1D37] mb-1.5">
                Adresse e-mail professionnelle *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex : contact@entreprise.ci"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBE2FF] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#334E68] mb-1.5">
                Lien existant ou précision utile (optionnel)
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex : Lien vers votre page Instagram, site actuel ou référence appréciée"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBE2FF] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            {/* Consentement explicite RGPD / ARTCI */}
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer text-xs text-[#334E68]">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB]"
              />
              <span>
                J&apos;accepte que mes informations soient utilisées uniquement par Sylla Youssouf pour étudier mon brief et me recontacter.
              </span>
            </label>

            {/* Bandeau de réassurance PRD §11 */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#F0F7FF] border border-[#CBE2FF] text-[11px] font-medium text-[#0A1D37]">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0EA5E9]" />
                Réponse sous 24 h garantie
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                Devis gratuit · Aucun engagement
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#CBE2FF] text-xs font-semibold text-[#334E68] hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0EA5E9] hover:bg-[#0284C7] text-[#061326] text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validation du brief...</span>
                  </>
                ) : (
                  <>
                    <span>Valider &amp; Générer mon brief WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ÉTAPE 5 : CONFIRMATION & REDIRECTION WHATSAPP PRÉ-REMPLIE */}
        {step === 5 && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h4 className="text-2xl font-bold text-[#0A1D37] font-[family-name:var(--font-dm-sans)]">
                Merci {name} ! Votre brief est bien enregistré.
              </h4>
              <p className="text-sm text-[#334E68] leading-relaxed">
                J&apos;ai reçu votre demande par e-mail et vous réponds sous <strong>24 heures</strong>. Pour gagner encore plus de temps, cliquez ci-dessous pour m&apos;envoyer directement le récapitulatif sur WhatsApp :
              </p>
            </div>

            {/* Récapitulatif compact */}
            <div className="text-left p-4 rounded-2xl bg-[#F0F7FF] border border-[#CBE2FF] max-w-md mx-auto text-xs space-y-1.5 text-[#0A1D37]">
              <div>
                <span className="text-[#526D82]">Projet :</span>{" "}
                <strong>{PROJECT_TYPES.find((t) => t.id === projectType)?.label || projectType}</strong>
              </div>
              <div>
                <span className="text-[#526D82]">Budget :</span>{" "}
                <strong className="text-[#0EA5E9]">{budgetRange}</strong> · <span className="text-[#526D82]">Délai :</span>{" "}
                <strong>{deadline}</strong>
              </div>
              <div className="line-clamp-2">
                <span className="text-[#526D82]">Objectif :</span> {goal}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsappClick("wizard_confirmation", projectType)}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all cursor-pointer w-full sm:w-auto"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Ouvrir WhatsApp avec mon brief pré-rempli</span>
                </a>
              )}

              {!inline && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3.5 rounded-full border border-[#CBE2FF] text-xs font-semibold text-[#334E68] hover:bg-slate-50 cursor-pointer"
                >
                  Revenir au site
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (inline) {
    return wizardCard;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Démarrer un projet avec Sylla Youssouf"
      className="fixed inset-0 z-50 bg-[#061326]/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      {wizardCard}
    </div>
  );
}

// ============================================================================
// MODAL LISTE D'ATTENTE POUR LES OFFRES "BIENTÔT" (PHASES 2 & 3)
// ============================================================================

export function WaitlistModal({
  isOpen,
  onClose,
  offerTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  offerTitle: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const res = await submitWaitlistAction({
      email,
      offreVisee: offerTitle,
      consentement: true,
    });
    setLoading(false);
    if (!res.success) {
      setErr(res.error || "Erreur lors de l'inscription");
    } else {
      setDone(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#061326]/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-[24px] border border-[#CBE2FF] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 text-[#0A1D37]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0A1D37]">
              Ouverture Prochaine · Liste Prioritaire
            </span>
            <h3 className="text-xl font-bold mt-2 font-[family-name:var(--font-dm-sans)]">
              {offerTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="space-y-4 py-2 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-sm text-[#334E68]">
              Vous êtes inscrit sur la liste d&apos;attente pour <strong>{offerTitle}</strong>. Vous serez prévenu en priorité dès l&apos;ouverture des prochains créneaux.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-full bg-[#0A1D37] text-white text-xs font-bold cursor-pointer"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleWaitlist} className="space-y-4">
            <p className="text-xs text-[#334E68] leading-relaxed">
              Cette prestation ouvre en phase suivante afin de garantir une qualité maximale sur les projets en cours. Laissez votre e-mail pour réserver votre place en priorité :
            </p>
            {err && <p className="text-xs text-red-600 font-medium">{err}</p>}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-4 py-3 rounded-xl border border-[#CBE2FF] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-[#3b4ec4] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              {loading ? "Inscription..." : "Me prévenir en priorité"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}