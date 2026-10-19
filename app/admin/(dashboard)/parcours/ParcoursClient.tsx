"use client";

import React, { useState, useTransition } from "react";
import {
  GraduationCap,
  Briefcase,
  Award,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Search,
  Sparkles,
  Calendar,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import {
  createParcoursAction,
  updateParcoursAction,
  deleteParcoursAction,
  toggleParcoursVisibilityAction,
  reorderParcoursAction,
} from "@/app/admin/actions/parcours";
import type { ParcoursItemData } from "@/lib/parcours";

interface ParcoursClientProps {
  initialItems: ParcoursItemData[];
}

export function ParcoursClient({ initialItems }: ParcoursClientProps) {
  const [items, setItems] = useState<ParcoursItemData[]>(initialItems);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filtres
  const [activeTab, setActiveTab] = useState<"all" | "formation" | "experience" | "certification">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal création / édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ParcoursItemData | null>(null);

  // Synchronisation avec les props
  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Filtrage
  const filteredItems = items.filter((item) => {
    if (activeTab !== "all" && item.type !== activeTab) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.titre.toLowerCase().includes(q);
      const matchOrg = item.organisme.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchOrg && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  const totalFormations = items.filter((i) => i.type === "formation").length;
  const totalExperiences = items.filter((i) => i.type === "experience").length;
  const totalCertifications = items.filter((i) => i.type === "certification").length;

  const handleToggleVisibility = (item: ParcoursItemData) => {
    const newVis = !item.visible;
    // Optimistic
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, visible: newVis } : i))
    );
    startTransition(async () => {
      setErrorMsg(null);
      const res = await toggleParcoursVisibilityAction(item.id, newVis);
      if (res.error) {
        setErrorMsg(res.error);
        // Rollback
        setItems(initialItems);
      }
    });
  };

  const handleReorder = (item: ParcoursItemData, direction: "up" | "down") => {
    startTransition(async () => {
      setErrorMsg(null);
      const res = await reorderParcoursAction(item.id, direction);
      if (res.error) setErrorMsg(res.error);
    });
  };

  const handleDelete = (item: ParcoursItemData) => {
    if (!confirm(`Supprimer définitivement "${item.titre}" ?`)) return;
    startTransition(async () => {
      setErrorMsg(null);
      const res = await deleteParcoursAction(item.id);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        setSuccessMsg(`"${item.titre}" supprimé.`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    });
  };

  const handleOpenCreate = (defaultType: "formation" | "experience" | "certification" = "formation") => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ParcoursItemData) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      setErrorMsg(null);
      let res;
      if (editingItem) {
        res = await updateParcoursAction(editingItem.id, undefined, formData);
      } else {
        res = await createParcoursAction(undefined, formData);
      }

      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setIsModalOpen(false);
        setEditingItem(null);
        setSuccessMsg(editingItem ? "Jalon modifié avec succès." : "Nouveau jalon créé avec succès.");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h1 className="font-bebas text-3xl tracking-wide text-[#0F172A]">
              Parcours &amp; Évolutions
            </h1>
          </div>
          <p className="text-sm text-[#475569] mt-1">
            Gérez vos diplômes, formations, expériences professionnelles et certifications réelles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenCreate(activeTab === "all" ? "formation" : activeTab)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white font-medium text-sm hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un jalon</span>
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#475569]">
              Formations &amp; Diplômes
            </span>
            <div className="text-2xl font-bold text-[#0F172A] mt-1">{totalFormations}</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#475569]">
              Expériences Pro
            </span>
            <div className="text-2xl font-bold text-[#0F172A] mt-1">{totalExperiences}</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-[#2563EB]">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#475569]">
              Certifications &amp; Événements
            </span>
            <div className="text-2xl font-bold text-[#0F172A] mt-1">{totalCertifications}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Barre d'outils et de filtres */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Onglets */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200/60">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-[#0F172A] shadow-sm"
                : "text-[#475569] hover:text-[#0F172A]"
            }`}
          >
            Tous ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("formation")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "formation"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-[#475569] hover:text-purple-700"
            }`}
          >
            Formations ({totalFormations})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("experience")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "experience"
                ? "bg-white text-[#2563EB] shadow-sm"
                : "text-[#475569] hover:text-[#2563EB]"
            }`}
          >
            Expériences ({totalExperiences})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("certification")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "certification"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-[#475569] hover:text-emerald-700"
            }`}
          >
            Certifications ({totalCertifications})
          </button>
        </div>

        {/* Recherche */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher un jalon, un mot-clé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>
      </div>

      {/* Liste des jalons */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
            Aucun jalon trouvé pour ce filtre.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExp = item.type === "experience";
            const isFormation = item.type === "formation";
            const isCert = item.type === "certification";

            const Icon = isExp ? Briefcase : isFormation ? GraduationCap : Award;
            const badgeColor = isExp
              ? "bg-blue-50 text-[#2563EB] border-blue-200"
              : isFormation
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200";

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-white border transition-all duration-200 ${
                  item.visible
                    ? "border-slate-200/80 shadow-xs hover:border-slate-300"
                    : "border-slate-200/40 bg-slate-50/60 opacity-60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isExp
                          ? "bg-blue-50 text-[#2563EB]"
                          : isFormation
                          ? "bg-purple-50 text-purple-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[#0F172A] text-base leading-snug">
                          {item.titre}
                        </h3>

                        {item.badge && (
                          <span
                            className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {item.enCours && (
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-[#F97316] border border-orange-200">
                            En cours
                          </span>
                        )}

                        {!item.visible && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                            Masqué
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#475569]">
                        <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {item.organisme}
                        </span>

                        <span className="flex items-center gap-1 font-mono text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {item.moisDebut ? `${item.moisDebut}/` : ""}
                          {item.anneeDebut}
                          {item.enCours
                            ? " – Aujourd'hui"
                            : item.anneeFin
                            ? ` – ${item.moisFin ? `${item.moisFin}/` : ""}${item.anneeFin}`
                            : ""}
                        </span>

                        {item.lieu && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3.5 h-3.5" />
                            {item.lieu}
                          </span>
                        )}

                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#2563EB] hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Vérification officielle</span>
                          </a>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-xs text-[#475569] pt-1 max-w-3xl leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {/* Tags */}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Profils assignés */}
                      <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <span>Affiché sur :</span>
                        {item.profilSlugs.length === 0 ? (
                          <span className="font-semibold text-emerald-600">Tous les portfolios (/)</span>
                        ) : (
                          <span className="font-semibold text-slate-700">
                            {item.profilSlugs.map((s) => `/${s === "default" ? "" : s}`).join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Réordonnancement accessible */}
                  <div className="flex items-center gap-1 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      title="Monter (Ordre prioritaire)"
                      aria-label={`Déplacer ${item.titre} vers le haut`}
                      disabled={isPending}
                      onClick={() => handleReorder(item, "up")}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer disabled:opacity-40"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      title="Descendre"
                      aria-label={`Déplacer ${item.titre} vers le bas`}
                      disabled={isPending}
                      onClick={() => handleReorder(item, "down")}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer disabled:opacity-40"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      title={item.visible ? "Masquer du site public" : "Rendre visible sur le site public"}
                      aria-label={item.visible ? "Masquer" : "Rendre visible"}
                      disabled={isPending}
                      onClick={() => handleToggleVisibility(item)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        item.visible
                          ? "text-slate-500 hover:bg-slate-100"
                          : "text-amber-600 bg-amber-50"
                      }`}
                    >
                      {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      title="Modifier ce jalon"
                      aria-label={`Modifier ${item.titre}`}
                      disabled={isPending}
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      title="Supprimer définitivement"
                      aria-label={`Supprimer ${item.titre}`}
                      disabled={isPending}
                      onClick={() => handleDelete(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL CRÉATION / ÉDITION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB]">
                  {editingItem ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="font-bebas text-2xl tracking-wide text-[#0F172A]">
                    {editingItem ? "Modifier le jalon" : "Nouveau jalon de parcours"}
                  </h2>
                  <p className="text-xs text-[#475569]">
                    Renseignez les informations vérifiées de votre formation, expérience ou certificat.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Catégorie *
                  </label>
                  <select
                    name="type"
                    defaultValue={editingItem?.type || "formation"}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    <option value="formation">Formation &amp; Diplôme</option>
                    <option value="experience">Expérience Professionnelle</option>
                    <option value="certification">Certification &amp; Événement</option>
                  </select>
                </div>

                {/* Badge optionnel */}
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Badge / Mention (optionnel)
                  </label>
                  <input
                    type="text"
                    name="badge"
                    defaultValue={editingItem?.badge || ""}
                    placeholder="Ex: Diplôme supérieur (Bac+3), Cisco Verified..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              {/* Titre */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Intitulé du diplôme / Rôle / Certificat *
                </label>
                <input
                  type="text"
                  name="titre"
                  defaultValue={editingItem?.titre || ""}
                  required
                  placeholder="Ex: Licence professionnelle Développeur Web, Prompt Engineering..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              {/* Organisme & Lieu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Organisme / Entreprise / Plateforme *
                  </label>
                  <input
                    type="text"
                    name="organisme"
                    defaultValue={editingItem?.organisme || ""}
                    required
                    placeholder="Ex: PIGIER CI, Simplon CI, Coursera..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Lieu (optionnel)
                  </label>
                  <input
                    type="text"
                    name="lieu"
                    defaultValue={editingItem?.lieu || ""}
                    placeholder="Ex: Abidjan, Côte d'Ivoire / En ligne"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              {/* Période */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-semibold text-[#0F172A] block">
                  Période &amp; Dates
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Année Début *</label>
                    <input
                      type="number"
                      name="anneeDebut"
                      defaultValue={editingItem?.anneeDebut || 2026}
                      required
                      min={2000}
                      max={2100}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Mois Début (1-12)</label>
                    <input
                      type="number"
                      name="moisDebut"
                      defaultValue={editingItem?.moisDebut || ""}
                      min={1}
                      max={12}
                      placeholder="Ex: 6 pour Juin"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Année Fin</label>
                    <input
                      type="number"
                      name="anneeFin"
                      defaultValue={editingItem?.anneeFin || ""}
                      min={2000}
                      max={2100}
                      placeholder="Ex: 2026"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Mois Fin (1-12)</label>
                    <input
                      type="number"
                      name="moisFin"
                      defaultValue={editingItem?.moisFin || ""}
                      min={1}
                      max={12}
                      placeholder="Ex: 12"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="enCours"
                    name="enCours"
                    defaultChecked={editingItem?.enCours ?? false}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <label htmlFor="enCours" className="text-xs font-medium text-[#0F172A] cursor-pointer">
                    Actuellement en cours (affiche &quot;Aujourd&apos;hui&quot; pour la date de fin)
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Description / Modules / Réalisations
                </label>
                <textarea
                  name="description"
                  defaultValue={editingItem?.description || ""}
                  rows={3}
                  maxLength={600}
                  placeholder="Décrivez les compétences acquises ou les missions accomplies (max 600 caractères)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Tags &amp; Compétences (séparés par des virgules)
                </label>
                <input
                  type="text"
                  name="tags"
                  defaultValue={editingItem?.tags.join(", ") || ""}
                  placeholder="Ex: Next.js, Architecture API, Prompt Engineering, UI/UX"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              {/* URL officielle */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Lien de vérification officiel (Coursera, Cisco, Google...)
                </label>
                <input
                  type="url"
                  name="url"
                  defaultValue={editingItem?.url || ""}
                  placeholder="https://coursera.org/verify/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              {/* Portfolios assignés */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Portfolios ciblés (séparés par des virgules, laisser vide pour TOUS)
                </label>
                <input
                  type="text"
                  name="profilSlugs"
                  defaultValue={editingItem?.profilSlugs.join(", ") || ""}
                  placeholder="Ex: default, dev, design (vide = affiché sur tous)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Valeurs possibles : <code>default</code> (communication /), <code>dev</code> (/dev), <code>design</code> (/design), <code>video</code> (/video).
                </span>
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] text-white hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? "Enregistrement..." : editingItem ? "Sauvegarder" : "Créer le jalon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
