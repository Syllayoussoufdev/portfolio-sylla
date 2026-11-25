"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Plus,
  ExternalLink,
  Edit3,
  Trash2,
  Eye,
  Clock,
  Sparkles,
  CheckCircle2,
  FileText,
  TrendingUp,
  AlertCircle,
  Filter,
} from "lucide-react";
import { type BlogPostSummary } from "@/lib/validations/blog";
import { deleteBlogPostAction, toggleBlogPostStatusAction } from "../../actions/blog";

interface BlogTableClientProps {
  initialPosts: BlogPostSummary[];
}

export function BlogTableClient({ initialPosts }: BlogTableClientProps) {
  const [posts, setPosts] = useState<BlogPostSummary[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedStatus, setSelectedStatus] = useState("Tous");
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  // Filtrage combiné (recherche texte + catégorie + statut)
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.titre.toLowerCase().includes(search.toLowerCase()) ||
      post.slug.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === "Tous" || post.categorie === selectedCategory;

    const matchesStatus =
      selectedStatus === "Tous" || post.statut === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Métriques d'en-tête
  const totalCount = posts.length;
  const publishedCount = posts.filter((p) => p.statut === "PUBLIE").length;
  const draftCount = posts.filter((p) => p.statut === "BROUILLON").length;
  const totalViews = posts.reduce((acc, p) => acc + (p.vuesCount || 0), 0);

  // Catégories uniques présentes
  const categories = ["Tous", ...Array.from(new Set(posts.map((p) => p.categorie)))];

  const handleToggleStatus = (id: string) => {
    setActionError(null);
    startTransition(async () => {
      const res = await toggleBlogPostStatusAction(id);
      if (res.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, statut: p.statut === "PUBLIE" ? "BROUILLON" : "PUBLIE" }
              : p
          )
        );
      } else if (res.error) {
        setActionError(res.error);
      }
    });
  };

  const handleDelete = (id: string, titre: string) => {
    if (!confirm(`Confirmez-vous la suppression définitive de l'article "${titre}" ?`)) {
      return;
    }
    setActionError(null);
    startTransition(async () => {
      const res = await deleteBlogPostAction(id);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else if (res.error) {
        setActionError(res.error);
      }
    });
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case "Intelligence Artificielle":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      case "Design UI/UX":
        return "bg-pink-50 text-pink-700 border-pink-200/80";
      case "Développement Web":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "Automatisation & n8n":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Métriques rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
            <span>Total Articles</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="font-bebas text-3xl text-[#0F172A]">{totalCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-600 mb-1">
            <span>En Ligne (Publiés)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-bebas text-3xl text-emerald-600">{publishedCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-amber-600 mb-1">
            <span>Brouillons</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-bebas text-3xl text-amber-600">{draftCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-blue-600 mb-1">
            <span>Lectures Totales</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="font-bebas text-3xl text-blue-600">{totalViews}</div>
        </div>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{actionError}</span>
        </div>
      )}

      {/* 2. Barre d'outils : Recherche, Filtres & Nouveau Bouton */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
          {/* Recherche */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par titre, mot-clé, tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#2563EB] shadow-xs"
            />
          </div>

          {/* Filtre Catégorie */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] shadow-xs cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "Tous" ? "Toutes les catégories" : c}
              </option>
            ))}
          </select>

          {/* Filtre Statut */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] shadow-xs cursor-pointer"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="PUBLIE">Publié</option>
            <option value="BROUILLON">Brouillon</option>
          </select>
        </div>

        {/* Bouton Création */}
        <Link
          href="/admin/blog/nouveau"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Rédiger un article</span>
        </Link>
      </div>

      {/* 3. Table des articles */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#0F172A]">Aucun article trouvé</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search || selectedCategory !== "Tous" || selectedStatus !== "Tous"
                ? "Aucun article ne correspond à vos filtres de recherche."
                : "Vous n'avez pas encore publié d'article. Cliquez sur « Rédiger un article » pour lancer votre premier contenu."}
            </p>
            <Link
              href="/admin/blog/nouveau"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition-colors mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Créer mon premier article</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Catégorie &amp; Tags</th>
                  <th className="py-3 px-4">Lecture / Vues</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Colonne Article */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 max-w-md">
                        {post.coverImage ? (
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                            <Image
                              src={post.coverImage}
                              alt={post.titre}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-sm text-[#0F172A] truncate block max-w-xs">
                              {post.titre}
                            </span>
                            {post.featured && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                À la une
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 block truncate">
                            /{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Catégorie & Tags */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryBadgeClass(
                            post.categorie
                          )}`}
                        >
                          {post.categorie}
                        </span>
                        {post.tags.length > 0 && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {post.tags.slice(0, 3).join(", ")}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Lecture & Vues */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{post.tempsLecture} min</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Eye className="w-3 h-3" />
                          <span>{post.vuesCount || 0} vues</span>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px] font-mono">
                      {new Intl.DateTimeFormat("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(post.publishedAt))}
                    </td>

                    {/* Statut Toggle */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleToggleStatus(post.id)}
                        title="Cliquer pour basculer le statut"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                          post.statut === "PUBLIE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            post.statut === "PUBLIE" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          }`}
                        />
                        <span>{post.statut === "PUBLIE" ? "Publié" : "Brouillon"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {post.statut === "PUBLIE" && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            title="Voir l'article sur le site public"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/blog/${post.id}`}
                          title="Modifier l'article"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleDelete(post.id, post.titre)}
                          title="Supprimer l'article"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
