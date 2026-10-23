"use client";

import React, { useState, useTransition } from "react";
import {
  MessageCircle,
  Mail,
  Trash2,
  Download,
  Clock,
  Sparkles,
  Filter,
  StickyNote,
} from "lucide-react";
import {
  updateLeadStatusAction,
  deleteLeadAction,
} from "../../actions/devcreative";

interface LeadItem {
  id: string;
  typeProjet: string;
  objectif: string;
  budgetTranche: string;
  delai: string;
  nom: string;
  email: string;
  telephone: string;
  message?: string | null;
  statut: "NOUVEAU" | "CONTACTE" | "DEVIS_ENVOYE" | "SIGNE" | "PERDU";
  notes?: string | null;
  createdAt: string;
}

interface WaitlistItem {
  id: string;
  email: string;
  offreVisee: string;
  createdAt: string;
}

const STATUS_BADGES: Record<
  LeadItem["statut"],
  { label: string; classes: string }
> = {
  NOUVEAU: {
    label: "Nouveau brief",
    classes: "bg-orange-50 text-[#FF4D00] border-orange-200",
  },
  CONTACTE: {
    label: "Contacté",
    classes: "bg-blue-50 text-[#2563EB] border-blue-200",
  },
  DEVIS_ENVOYE: {
    label: "Devis envoyé",
    classes: "bg-purple-50 text-purple-700 border-purple-200",
  },
  SIGNE: {
    label: "Signé (Gagné)",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  PERDU: {
    label: "Perdu / Sans suite",
    classes: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export default function LeadsAdminClient({
  initialLeads,
  waitlistEntries,
}: {
  initialLeads: LeadItem[];
  waitlistEntries: WaitlistItem[];
}) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"leads" | "waitlist">("leads");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const filteredLeads =
    statusFilter === "ALL"
      ? leads
      : leads.filter((l) => l.statut === statusFilter);

  const handleStatusChange = (
    id: string,
    newStatus: LeadItem["statut"],
    notes?: string
  ) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              statut: newStatus,
              ...(notes !== undefined ? { notes } : {}),
            }
          : l
      )
    );
    startTransition(async () => {
      await updateLeadStatusAction(id, newStatus, notes);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer définitivement ce brief ?")) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    startTransition(async () => {
      await deleteLeadAction(id);
    });
  };

  const exportCsv = () => {
    const headers = [
      "Date",
      "Nom",
      "Email",
      "WhatsApp",
      "Type Projet",
      "Budget",
      "Délai",
      "Statut",
      "Objectif",
      "Message",
    ];
    const rows = filteredLeads.map((l) => [
      new Date(l.createdAt).toLocaleDateString("fr-FR"),
      l.nom,
      l.email,
      l.telephone,
      l.typeProjet,
      l.budgetTranche,
      l.delai,
      l.statut,
      l.objectif.replace(/\r?\n/g, " "),
      (l.message || "").replace(/\r?\n/g, " "),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `leads-devcreative-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Barre d'onglets & Filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "leads"
                ? "bg-[#091410] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Briefs Qualifiés ({leads.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("waitlist")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "waitlist"
                ? "bg-[#091410] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Liste d&apos;attente Offres ({waitlistEntries.length})
          </button>
        </div>

        {activeTab === "leads" && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0F172A]"
              >
                <option value="ALL">Tous les statuts ({leads.length})</option>
                <option value="NOUVEAU">Nouveaux</option>
                <option value="CONTACTE">Contactés</option>
                <option value="DEVIS_ENVOYE">Devis envoyés</option>
                <option value="SIGNE">Signés (Gagnés)</option>
                <option value="PERDU">Perdus</option>
              </select>
            </div>

            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#0F172A] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Exporter CSV
            </button>
          </div>
        )}
      </div>

      {activeTab === "leads" ? (
        filteredLeads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-[#FF4D00] mx-auto" />
            <h3 className="text-base font-bold text-[#0F172A]">
              Aucun brief qualifié dans cette vue
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Les prospects qui remplissent le wizard 4 étapes sur `/demarrer`, `/services` ou le template `DevCreative` apparaîtront automatiquement ici.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => {
              const cleanPhone = lead.telephone.replace(/[^0-9]/g, "");
              const waReplyText = encodeURIComponent(
                `Bonjour ${lead.nom}, c'est Sylla Youssouf ! J'ai bien reçu votre brief concernant votre projet (${lead.typeProjet}). Quand êtes-vous disponible pour un point rapide de 15 min ?`
              );
              const badge = STATUS_BADGES[lead.statut] || STATUS_BADGES.NOUVEAU;

              return (
                <div
                  key={lead.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-base font-bold text-[#0F172A]">
                          {lead.nom}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          {lead.telephone}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.classes}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(lead.createdAt).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-[#091410]">
                          Budget : {lead.budgetTranche}
                        </span>
                        <span>•</span>
                        <span>Délai : {lead.delai}</span>
                      </div>
                    </div>

                    {/* Actions rapides */}
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={lead.statut}
                        disabled={isPending}
                        onChange={(e) =>
                          handleStatusChange(
                            lead.id,
                            e.target.value as LeadItem["statut"]
                          )
                        }
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                      >
                        <option value="NOUVEAU">Statut : Nouveau</option>
                        <option value="CONTACTE">Statut : Contacté</option>
                        <option value="DEVIS_ENVOYE">Statut : Devis envoyé</option>
                        <option value="SIGNE">Statut : Signé ✅</option>
                        <option value="PERDU">Statut : Perdu</option>
                      </select>

                      <a
                        href={`https://wa.me/${cleanPhone}?text=${waReplyText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-bold shadow-sm transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp 1-clic
                      </a>

                      <a
                        href={`mailto:${lead.email}?subject=${encodeURIComponent(
                          "Votre projet digital — Sylla Youssouf"
                        )}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDelete(lead.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Supprimer ce lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tag besoin */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#091410]/5 text-[#091410] text-xs font-semibold">
                      Projet : {lead.typeProjet}
                    </span>
                  </div>

                  {/* Objectif & Message */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/80 rounded-xl p-4 text-xs">
                    <div className="md:col-span-2 space-y-1.5">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                        Objectif & Besoin exprimé
                      </span>
                      <p className="text-slate-700 font-semibold leading-relaxed whitespace-pre-line">
                        {lead.objectif}
                      </p>
                      {lead.message && (
                        <p className="text-slate-600 pt-1 whitespace-pre-line">
                          {lead.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200/70 pt-3 md:pt-0 md:pl-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                          <StickyNote className="w-3 h-3" /> Notes internes CRM
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNoteId(lead.id);
                            setNoteDraft(lead.notes || "");
                          }}
                          className="text-[11px] font-semibold text-[#2563EB] hover:underline cursor-pointer"
                        >
                          {lead.notes ? "Modifier" : "+ Ajouter note"}
                        </button>
                      </div>

                      {editingNoteId === lead.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="Ex: Rappel prévu jeudi 14h, acompte 40% discuté..."
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                handleStatusChange(
                                  lead.id,
                                  lead.statut,
                                  noteDraft
                                );
                                setEditingNoteId(null);
                              }}
                              className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[11px] font-semibold cursor-pointer"
                            >
                              Enregistrer
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingNoteId(null)}
                              className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-[11px] cursor-pointer"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-600 italic">
                          {lead.notes || "Aucune note interne."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Onglet Waitlist */
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          {waitlistEntries.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">
              Aucune inscription sur liste d&apos;attente pour le moment.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase">
                  <th className="py-3.5 px-5">Offre souhaitée</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-5">Date d&apos;inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {waitlistEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-5 font-bold text-[#091410]">
                      {entry.offreVisee}
                    </td>
                    <td className="py-3.5 px-4 text-[#2563EB] font-medium">
                      {entry.email}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      {new Date(entry.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
