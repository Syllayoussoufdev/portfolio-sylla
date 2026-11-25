import { Metadata } from "next";
import Link from "next/link";
import { Newspaper, Plus, Sparkles } from "lucide-react";
import { getAllBlogPostsAdmin } from "@/lib/blog";
import { BlogTableClient } from "./BlogTableClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog & Articles | Administration Sylla",
};

export default async function AdminBlogPage() {
  const posts = await getAllBlogPostsAdmin();

  return (
    <div className="space-y-6">
      {/* En-tête de page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-600 mb-1 font-semibold uppercase tracking-wider">
            <Newspaper className="w-4 h-4" />
            <span>Gestion de Contenu Éditorial</span>
          </div>
          <h1 className="font-bebas text-4xl sm:text-5xl text-[#0F172A] tracking-wide leading-none">
            Articles &amp; Publications
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Rédigez et publiez vos retours d&apos;expérience en Design UI/UX, Développement Web et Intelligence Artificielle pour engager votre audience.
          </p>
        </div>

        <Link
          href="/admin/blog/nouveau"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold shadow-xs transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel article</span>
        </Link>
      </div>

      {/* Table & Filtres interactifs */}
      <BlogTableClient initialPosts={posts} />
    </div>
  );
}
