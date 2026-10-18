import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSiteSettings } from "@/lib/profiles";
import { SettingsForm } from "./SettingsForm";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="pb-6 border-b border-slate-200/80">
        <h1 className="font-bebas text-3xl sm:text-4xl tracking-wide text-[#0F172A] flex items-center gap-2">
          <Settings className="w-8 h-8 text-[#2563EB]" />
          RÉGLAGES DU SITE
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Identité publique, ligne de métier du header, coordonnées réelles et réseaux sociaux.
        </p>
      </div>

      <SettingsForm
        initialData={{
          nom: settings.nom,
          metier: settings.metier,
          emailPublic: settings.emailPublic,
          whatsapp: settings.whatsapp,
          github: settings.github,
          linkedin: settings.linkedin,
          twitter: settings.twitter,
          instagram: settings.instagram,
        }}
      />
    </div>
  );
}
