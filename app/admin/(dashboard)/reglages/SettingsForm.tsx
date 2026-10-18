"use client";

import { useActionState } from "react";
import {
  Save,
  Loader2,
  Check,
  AlertCircle,
  Settings,
  User,
  Briefcase,
  Mail,
  Phone,
  Globe,
  Share2,
  AtSign,
} from "lucide-react";
import {
  updateSiteSettingsAction,
  type SettingsActionState,
} from "../../actions/settings";

interface SettingsFormProps {
  initialData: {
    nom: string;
    metier: string | null;
    emailPublic: string | null;
    whatsapp: string | null;
    github: string | null;
    linkedin: string | null;
    twitter: string | null;
    instagram: string | null;
  };
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState<
    SettingsActionState,
    FormData
  >(updateSiteSettingsAction, {});

  return (
    <form action={formAction} className="space-y-6 max-w-4xl">
      {/* Alerte Erreur */}
      {state?.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <div>
            <div className="font-semibold mb-0.5">Erreur de validation</div>
            <div>{state.error}</div>
          </div>
        </div>
      )}

      {/* Alerte Succès */}
      {state?.success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 text-xs">
          <Check className="w-5 h-5 shrink-0 text-emerald-600" />
          <div className="font-semibold">
            Réglages globaux mis à jour avec succès !
          </div>
        </div>
      )}

      {/* Bannière éthique / Audit */}
      <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
        <Settings className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">
            Transparence des coordonnées publiques (Audit PRD v3)
          </p>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Tout champ laissé vide ne sera pas affiché sur le site public
            (header, footer, page contact). Ne renseignez un e-mail ou un numéro
            WhatsApp que lorsqu&apos;ils sont réellement actifs.
          </p>
        </div>
      </div>

      {/* Section 1 : Identité & Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-base font-semibold text-[#0F172A] border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-[#2563EB]" />
          Identité & En-tête du site
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Nom complet */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Nom affiché *
            </label>
            <input
              type="text"
              name="nom"
              required
              defaultValue={initialData.nom}
              placeholder="Ex : Sylla Youssouf"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Métier / Slogan d'en-tête */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Ligne de métier (sous le logo)
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="metier"
                defaultValue={initialData.metier || ""}
                placeholder="Ex : Expert Communication & Développeur"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 : Contact direct */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-base font-semibold text-[#0F172A] border-b border-slate-100 pb-3 flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#2563EB]" />
          Canaux de contact directs (Optionnels)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* E-mail public */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              E-mail de contact public
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="emailPublic"
                defaultValue={initialData.emailPublic || ""}
                placeholder="contact@votredomaine.com (laisser vide si non actif)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Affiché dans le footer et le formulaire de contact si renseigné.
            </p>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Numéro WhatsApp Professionnel
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="whatsapp"
                defaultValue={initialData.whatsapp || ""}
                placeholder="+33 6 12 34 56 78 (laisser vide si non actif)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Permet aux visiteurs de vous contacter directement sur WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3 : Liens Réseaux Sociaux */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-base font-semibold text-[#0F172A] border-b border-slate-100 pb-3 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#2563EB]" />
          Réseaux Sociaux & Présence en ligne
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* GitHub */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Profil GitHub
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="github"
                defaultValue={initialData.github || ""}
                placeholder="https://github.com/votre-compte"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Profil LinkedIn
            </label>
            <div className="relative">
              <Share2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="linkedin"
                defaultValue={initialData.linkedin || ""}
                placeholder="https://linkedin.com/in/votre-compte"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Twitter / X */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Twitter / X
            </label>
            <div className="relative">
              <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="twitter"
                defaultValue={initialData.twitter || ""}
                placeholder="https://x.com/votre-compte"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Instagram
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="instagram"
                defaultValue={initialData.instagram || ""}
                placeholder="https://instagram.com/votre-compte"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Enregistrer les réglages</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
