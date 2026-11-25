import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Tag,
  Share2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getSiteSettings } from "@/lib/profiles";
import {
  getBlogPostBySlug,
  getRelatedBlogPosts,
  incrementBlogPostViews,
} from "@/lib/blog";
import { BlogContentRenderer } from "@/components/blog/BlogContentRenderer";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { SyllaBrandLogo } from "@/components/icons/SyllaBrandLogo";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || post.statut !== "PUBLIE") {
    return {
      title: "Article non trouvé | Sylla Youssouf",
      description: "Cet article n'existe pas ou n'est plus disponible.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://syllayoussouf.com";
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const coverUrl = post.coverImage || `${siteUrl}/logo-icon.png`;

  return {
    title: `${post.titre} | Blog — Sylla Youssouf`,
    description: post.description,
    authors: [{ name: "Sylla Youssouf", url: siteUrl }],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.titre,
      description: post.description,
      url: postUrl,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ["Sylla Youssouf"],
      tags: post.tags,
      images: [
        {
          url: coverUrl,
          width: 1200,
          height: 630,
          alt: post.titre,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.titre,
      description: post.description,
      images: [coverUrl],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getBlogPostBySlug(slug),
    getSiteSettings(),
  ]);

  if (!post || post.statut !== "PUBLIE") {
    notFound();
  }

  // Incrémenter le compteur de vues en tâche asynchrone non-bloquante
  incrementBlogPostViews(slug).catch(() => {});

  const relatedPosts = await getRelatedBlogPosts(post.slug, post.categorie, 3);

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(post.publishedAt));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titre,
    description: post.description,
    image: post.coverImage || "https://syllayoussouf.com/logo-icon.png",
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: "Sylla Youssouf",
      url: "https://syllayoussouf.com",
      jobTitle: "Creative Engineer & Développeur Web Full Stack",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Abidjan",
        addressCountry: "CI",
      },
    },
    publisher: {
      "@type": "Person",
      name: "Sylla Youssouf",
      url: "https://syllayoussouf.com",
      logo: {
        "@type": "ImageObject",
        url: "https://syllayoussouf.com/logo-icon.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://syllayoussouf.com/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    articleSection: post.categorie,
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar settings={settings} />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 max-w-4xl mx-auto w-full space-y-10">
        {/* Fil d'Ariane sémantique */}
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center gap-2 text-xs font-mono text-slate-500 overflow-x-auto whitespace-nowrap pb-1"
        >
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Accueil
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link href="/blog" className="hover:text-blue-600 transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-700 font-semibold">{post.categorie}</span>
        </nav>

        {/* Retour rapide vers tous les articles */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#2563EB] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Tous les articles du blog</span>
          </Link>
        </div>

        {/* En-tête de l'article */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-semibold">
              {post.categorie}
            </span>
            {post.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>À la une</span>
              </span>
            )}
          </div>

          <h1 className="font-bebas text-4xl sm:text-6xl text-[#0F172A] tracking-wide leading-[1.08]">
            {post.titre}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal border-l-4 border-blue-600 pl-4 py-1 italic bg-blue-50/30 rounded-r-xl">
            {post.description}
          </p>

          {/* Métadonnées de publication et auteur */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-slate-200/80 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden">
                <SyllaBrandLogo variant="squircle" className="w-full h-full" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#0F172A]">Sylla Youssouf</p>
                <p className="text-slate-500 font-mono text-[11px]">
                  Creative Engineer &amp; Dev Full Stack
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <time dateTime={post.publishedAt.toISOString()}>
                  {formattedDate}
                </time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.tempsLecture} min de lecture</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.vuesCount + 1} vues</span>
              </span>
            </div>
          </div>

          {/* Boutons de partage direct sous le header */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <ShareButtons title={post.titre} slug={post.slug} />
          </div>
        </header>

        {/* Image de couverture principale */}
        {post.coverImage && (
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100">
            <Image
              src={post.coverImage}
              alt={post.titre}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        {/* Corps de l'article formaté */}
        <article className="prose prose-slate max-w-none">
          <BlogContentRenderer content={post.contenu} />
        </article>

        {/* Tags de l'article */}
        {post.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-200/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 inline-flex items-center gap-1 mr-1">
                <Tag className="w-3 h-3" />
                <span>Thématiques :</span>
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Boutons de partage en bas d'article */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>Vous avez trouvé cet article pertinent ? Partagez-le avec votre réseau !</span>
          </div>
          <ShareButtons title={post.titre} slug={post.slug} />
        </div>

        {/* Carte Auteur & Contact Direct */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0B1528] text-white shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 p-2 shrink-0 border border-white/20 shadow-md flex items-center justify-center">
            <SyllaBrandLogo variant="squircle" className="w-full h-full text-white" />
          </div>

          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>À propos de l&apos;auteur</span>
            </div>
            <h3 className="font-bebas text-2xl tracking-wide">SYLLA YOUSSOUF</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Creative Engineer, Designer UI/UX &amp; Développeur Web Full Stack basé à Abidjan, Côte d&apos;Ivoire.
              J&apos;aide les entrepreneurs et entreprises à concevoir des produits digitaux performants avec Next.js, Figma et l&apos;intelligence artificielle.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              href={`https://wa.me/2250594564993?text=${encodeURIComponent(`Bonjour Sylla, j'ai lu votre article "${post.titre}" et j'aimerais échanger avec vous.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20be5b] text-white text-xs font-bold transition-all shadow-md active:scale-95 text-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Discuter sur WhatsApp</span>
            </a>
            <Link
              href="/demarrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all active:scale-95 text-center"
            >
              <span>Lancer un brief</span>
            </Link>
          </div>
        </div>

        {/* Articles connexes */}
        {relatedPosts.length > 0 && (
          <section className="pt-10 border-t border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-purple-600 uppercase tracking-wider font-semibold">
                  Pour aller plus loin
                </p>
                <h2 className="font-bebas text-2xl sm:text-3xl text-[#0F172A] tracking-wide">
                  ARTICLES SIMILAIRES RECOMMANDÉS
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Tout voir &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group flex flex-col rounded-2xl bg-white border border-slate-200/80 overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    {related.coverImage ? (
                      <Image
                        src={related.coverImage}
                        alt={related.titre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 font-mono text-xs">
                        {related.categorie}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold font-mono text-blue-600 uppercase">
                        {related.categorie}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {related.titre}
                      </h4>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{related.tempsLecture} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  );
}
