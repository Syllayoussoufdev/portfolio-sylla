"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  Tag,
  BookOpen,
  Calendar,
  Share2,
} from "lucide-react";
import { type BlogPostSummary } from "@/lib/validations/blog";

interface BlogGridClientProps {
  posts: BlogPostSummary[];
  featuredPost?: BlogPostSummary | null;
}

export function BlogGridClient({ posts, featuredPost }: BlogGridClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [search, setSearch] = useState("");

  const categories = [
    "Tous",
    "Intelligence Artificielle",
    "Design UI/UX",
    "Développement Web",
    "Automatisation & n8n",
    "Stratégie Digitale",
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "Tous" || post.categorie === selectedCategory;
    const matchesSearch =
      post.titre.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "Intelligence Artificielle":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200/80",
          dot: "bg-purple-500",
        };
      case "Design UI/UX":
        return {
          bg: "bg-pink-50",
          text: "text-pink-700",
          border: "border-pink-200/80",
          dot: "bg-pink-500",
        };
      case "Développement Web":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200/80",
          dot: "bg-blue-500",
        };
      case "Automatisation & n8n":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200/80",
          dot: "bg-amber-500",
        };
      default:
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200/80",
          dot: "bg-emerald-500",
        };
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Article Phare (Featured Hero) si aucun filtre actif */}
      {featuredPost && selectedCategory === "Tous" && !search && (
        <article className="relative rounded-3xl overflow-hidden glass border border-slate-200/80 shadow-md group hover:shadow-xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Image de couverture du Hero */}
            <div className="lg:col-span-7 relative aspect-video lg:aspect-auto min-h-[280px] lg:min-h-[400px] overflow-hidden bg-slate-900">
              {featuredPost.coverImage ? (
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.titre}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-950 text-white p-8">
                  <BookOpen className="w-16 h-16 opacity-30 text-blue-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/90 text-slate-950 text-xs font-bold shadow-sm backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Article Phare</span>
                </span>
              </div>
            </div>

            {/* Contenu textuel du Hero */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-white/90">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                      getCategoryTheme(featuredPost.categorie).bg
                    } ${getCategoryTheme(featuredPost.categorie).text} ${
                      getCategoryTheme(featuredPost.categorie).border
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        getCategoryTheme(featuredPost.categorie).dot
                      }`}
                    />
                    <span>{featuredPost.categorie}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredPost.tempsLecture} min de lecture</span>
                  </span>
                </div>

                <h2 className="font-bebas text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-wide leading-tight group-hover:text-[#2563EB] transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.titre}
                  </Link>
                </h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3">
                  {featuredPost.description}
                </p>

                {featuredPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {featuredPost.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-mono text-slate-500 bg-slate-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
                <div className="text-xs text-slate-400 font-mono">
                  Publié le{" "}
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(featuredPost.publishedAt))}
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] group-hover:translate-x-1 transition-transform"
                >
                  <span>Lire l&apos;article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* 2. Barre de Navigation par Catégories & Recherche */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Pilles de Catégories */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#0F172A] text-white shadow-sm"
                      : "bg-white/80 hover:bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Recherche */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un sujet, un outil..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white/90 border border-slate-200 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#2563EB] shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* 3. Grille des Articles */}
      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white/60 rounded-3xl border border-slate-200/80">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bebas text-2xl text-[#0F172A]">Aucun article trouvé</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Aucun article ne correspond actuellement à vos critères. Essayez une autre catégorie ou réinitialisez votre recherche.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("Tous");
              setSearch("");
            }}
            className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => {
            const theme = getCategoryTheme(post.categorie);
            return (
              <article
                key={post.id}
                className="group rounded-3xl overflow-hidden glass border border-slate-200/80 bg-white/80 hover:bg-white shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image miniature */}
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden bg-slate-900">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.titre}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400">
                        <BookOpen className="w-10 h-10 opacity-30" />
                      </div>
                    )}
                  </Link>

                  {/* Corps de la carte */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${theme.bg} ${theme.text} ${theme.border}`}
                      >
                        <span className={`w-1 h-1 rounded-full ${theme.dot}`} />
                        <span>{post.categorie}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{post.tempsLecture} min</span>
                      </span>
                    </div>

                    <h3 className="font-bebas text-2xl text-[#0F172A] tracking-wide leading-snug group-hover:text-[#2563EB] transition-colors">
                      <Link href={`/blog/${post.slug}`} className="block">
                        {post.titre}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                </div>

                {/* Bas de carte */}
                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Intl.DateTimeFormat("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(post.publishedAt))}
                  </span>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-[#2563EB] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Lire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
