import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Sparkles,
  Plus,
  Compass,
  CheckCircle2,
  ExternalLink,
  Edit,
  Trash2,
  Power,
  Star,
  Layers,
} from "lucide-react";
import {
  deleteProfileAction,
  toggleProfileActiveAction,
  setDefaultProfileAction,
} from "../../actions/profiles";

export const dynamic = "force-dynamic";

export default async function ProfilesAdminPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const profiles = await prisma.profile.findMany({
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    include: {
      subPortfolio: {
        select: {
          label: true,
          slug: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="font-bebas text-3xl sm:text-4xl tracking-wide text-[#0F172A] flex items-center gap-2">
            <Compass className="w-8 h-8 text-[#2563EB]" />
            PROFILS & TEMPLATES CIBLÉS
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Gérez le profil d&apos;accueil et les portfolios spécialisés ciblés (/[profil]) sans toucher au code.
          </p>
        </div>

        <Link
          href="/admin/profils/nouveau"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un profil</span>
        </Link>
      </div>

      {/* Liste des Profils */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Profil</th>
                <th className="py-3.5 px-4">Template</th>
                <th className="py-3.5 px-4">URL Publique</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {profiles.map((profile) => {
                const isDefault = profile.isDefault;
                const publicUrl = isDefault ? "/" : `/${profile.slug}`;

                return (
                  <tr key={profile.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Nom du profil */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isDefault
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-[#2563EB]"
                          }`}
                        >
                          {profile.label.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                            <span>{profile.label}</span>
                            {isDefault && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                Accueil (/)
                              </span>
                            )}
                          </div>
                          {profile.subPortfolio && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Lié au sous-portfolio : {profile.subPortfolio.label}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Template */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 capitalize font-mono">
                        {profile.template}
                      </span>
                    </td>

                    {/* URL */}
                    <td className="py-4 px-4">
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#2563EB] hover:underline"
                      >
                        <span>{publicUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>

                    {/* Statut */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          profile.actif
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {profile.actif ? "Actif" : "Inactif"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Bouton Aperçu */}
                        <Link
                          href={`/admin/profils/${profile.id}/apercu`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#2563EB] hover:bg-slate-100 transition-colors"
                          title="Aperçu en direct"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Bouton Modifier */}
                        <Link
                          href={`/admin/profils/${profile.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#2563EB] hover:bg-slate-100 transition-colors"
                          title="Modifier le profil"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Bouton Définir par défaut (si pas déjà par défaut) */}
                        {!isDefault && (
                          <form
                            action={async () => {
                              "use server";
                              await setDefaultProfileAction(profile.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                              title="Définir comme profil par défaut sur la page d'accueil (/)"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          </form>
                        )}

                        {/* Bouton Activer / Désactiver (si pas par défaut) */}
                        {!isDefault && (
                          <form
                            action={async () => {
                              "use server";
                              await toggleProfileActiveAction(profile.id, profile.actif);
                            }}
                          >
                            <button
                              type="submit"
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                profile.actif
                                  ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
                                  : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                              }`}
                              title={profile.actif ? "Désactiver" : "Activer"}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                          </form>
                        )}

                        {/* Bouton Supprimer (interdit si profil par défaut) */}
                        {!isDefault && (
                          <form
                            action={async () => {
                              "use server";
                              await deleteProfileAction(profile.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Supprimer définitivement ce profil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
