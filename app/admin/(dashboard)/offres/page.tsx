import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDevCreativeCatalog } from "@/lib/devcreative";
import { prisma } from "@/lib/prisma";
import { Package, Sparkles, CheckCircle2, Save } from "lucide-react";
import {
  updateServiceOfferQuickAction,
  updateServicePackQuickAction,
} from "../../actions/devcreative";

export const dynamic = "force-dynamic";

export default async function OffresAdminPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  // S'assurer que le catalogue est seedé en base
  await getDevCreativeCatalog();

  const [packs, offers] = await Promise.all([
    prisma.servicePack.findMany({ orderBy: { ordre: "asc" } }),
    prisma.serviceOffer.findMany({ orderBy: { ordre: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="font-bebas text-3xl sm:text-4xl tracking-wide text-[#0F172A] flex items-center gap-2">
            <Package className="w-8 h-8 text-[#2563EB]" />
            CATALOGUE OFFRES & PACKS (FCFA)
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Modifiez en direct les tarifs FCFA, délais et statuts (`DISPONIBLE`, `BIENTOT`, `LISTE_ATTENTE`) affichés sur `/services` et le template `DevCreative`.
          </p>
        </div>
      </div>

      {/* Section 1 : Les 4 Packs Clés en Main */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF4D00]" />
            4 Packs Clés en Main (Grille Tarifaire FCFA)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packs.map((pack) => (
            <form
              key={pack.id}
              action={async (formData) => {
                "use server";
                await updateServicePackQuickAction(formData);
              }}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4"
            >
              <input type="hidden" name="id" value={pack.id} />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#0F172A]">
                      {pack.titre}
                    </span>
                    {pack.misEnAvant && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#FF4D00] border border-orange-200 text-[10px] font-bold">
                        Mis en avant
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{pack.sousTitre}</p>
                </div>

                <select
                  name="visible"
                  defaultValue={pack.visible ? "true" : "false"}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold bg-slate-50"
                >
                  <option value="true">Visible</option>
                  <option value="false">Masqué</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Prix en FCFA
                  </label>
                  <input
                    type="number"
                    name="prix"
                    defaultValue={pack.prix}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#091410]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Délai estimé
                  </label>
                  <input
                    type="text"
                    name="delai"
                    defaultValue={pack.delai || ""}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Statut disponibilité
                  </label>
                  <select
                    name="statut"
                    defaultValue={pack.statut}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0F172A] bg-white"
                  >
                    <option value="DISPONIBLE">🟢 Disponible</option>
                    <option value="BIENTOT">🟠 Bientôt (Waitlist)</option>
                    <option value="LISTE_ATTENTE">🟣 Liste d&apos;attente</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">
                  {pack.servicesInclus.length} services inclus •{" "}
                  {pack.economie || "Tarif pack"}
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#091410] hover:bg-[#00A86B] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Enregistrer
                </button>
              </div>
            </form>
          ))}
        </div>
      </div>

      {/* Section 2 : Les 5 Familles d'Offres Individuelles */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
          Offres par Famille ({offers.length} prestations configurées)
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {offers.map((offer) => (
              <form
                key={offer.id}
                action={async (formData) => {
                  "use server";
                  await updateServiceOfferQuickAction(formData);
                }}
                className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <input type="hidden" name="id" value={offer.id} />

                <div className="space-y-1 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] font-bold">
                      {offer.famille}
                    </span>
                    <span className="text-sm font-bold text-[#0F172A]">
                      {offer.titre}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{offer.accroche}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <input
                    type="text"
                    name="prixLabel"
                    defaultValue={offer.prixLabel || ""}
                    placeholder="Prix affiché (ex: dès 200 000 FCFA)"
                    className="w-48 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />

                  <input
                    type="text"
                    name="delai"
                    defaultValue={offer.delai || ""}
                    placeholder="Délai (ex: 7 à 10 jours)"
                    className="w-36 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />

                  <select
                    name="statut"
                    defaultValue={offer.statut}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="DISPONIBLE">🟢 Disponible</option>
                    <option value="BIENTOT">🟠 Bientôt</option>
                    <option value="LISTE_ATTENTE">🟣 Liste d&apos;attente</option>
                  </select>

                  <select
                    name="visible"
                    defaultValue={offer.visible ? "true" : "false"}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Masqué</option>
                  </select>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    OK
                  </button>
                </div>
              </form>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
