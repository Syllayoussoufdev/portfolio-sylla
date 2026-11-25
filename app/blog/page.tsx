import { Metadata } from "next";
import Link from "next/link";
import { Newspaper, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getSiteSettings } from "@/lib/profiles";
import { getPublishedBlogPosts, getFeaturedBlogPost } from "@/lib/blog";
import { BlogGridClient } from "@/components/blog/BlogGridClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog & Perspectives | Design, Web Full Stack & IA — Sylla Youssouf",
  description:
    "Analyses approfondies, retours d'expérience et guides pratiques sur le Design UI/UX, le Développement Web moderne (Next.js, Laravel) et l'Intelligence Artificielle en Côte d'Ivoire.",
  openGraph: {
    title: "Blog & Perspectives — Sylla Youssouf",
    description:
      "Guides pratiques, stratégies de conversion et analyses techniques sur le Design, le Web et l'IA par Sylla Youssouf à Abidjan.",
    url: "https://syllayoussouf.com/blog",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const [posts, featuredPost, settings] = await Promise.all([
    getPublishedBlogPosts(),
    getFeaturedBlogPost(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <Navbar settings={settings} />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 max-w-6xl mx-auto w-full space-y-12">
        {/* En-tête du Blog */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 text-xs font-semibold uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Veille Technologique &amp; Retours d&apos;Expérience</span>
          </div>

          <h1 className="font-bebas text-5xl sm:text-7xl text-[#0F172A] tracking-wider leading-none">
            LE BLOG &amp; PERSPECTIVES
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Conseils stratégiques, décryptages techniques et méthodes concrètes pour concevoir des produits digitaux performants, de l&apos;ergonomie Figma jusqu&apos;à l&apos;automatisation par l&apos;IA.
          </p>
        </header>

        {/* Grille des Articles avec Filtrage */}
        <BlogGridClient posts={posts} featuredPost={featuredPost} />

        {/* Bannière d'appel à l'action WhatsApp / Brief */}
        <section className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-950 via-[#0B1528] to-[#1E293B] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Un projet ou une question sur ces technologies ?</span>
            </div>
            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wide">
              DISCUTONS DE VOTRE PROJET EN DIRECT
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              Vous souhaitez implémenter une architecture Next.js, créer une identité de marque percutante ou automatiser vos flux avec l&apos;IA ? Échangeons dès aujourd&apos;hui.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/2250594564993?text=Bonjour%20Sylla,%20j'ai%20lu%20votre%20blog%20et%20je%20souhaite%20échanger%20sur%20un%20projet."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20be5b] text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Discuter sur WhatsApp</span>
            </a>
            <Link
              href="/demarrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all active:scale-95"
            >
              <span>Lancer un brief</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
