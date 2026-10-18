import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/profiles";
import { ArrowLeft, ExternalLink, Sparkles, Code, Film, Eye } from "lucide-react";
import type { HeroData, SectionItem } from "@/lib/validations/profile";

export const dynamic = "force-dynamic";

export default async function ProfilePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const profile = await prisma.profile.findUnique({
    where: { id },
    include: {
      heroMedia: true,
      subPortfolio: {
        include: {
          projects: {
            include: {
              project: {
                include: { coverMedia: true },
              },
            },
            orderBy: { ordre: "asc" },
          },
        },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  const settings = await getSiteSettings();
  const hero = profile.hero as unknown as HeroData;
  const sections = (profile.sections as unknown as SectionItem[]) || [];
  const projectsList =
    profile.subPortfolio?.projects.map((p) => p.project) || [];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#0F172A] -m-6 sm:-m-8">
      {/* Barre de contrôle du Mode Aperçu */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md text-white border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/profils/${profile.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Éditer ce profil</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{profile.label}</span>
            <span className="text-slate-400 font-mono">({profile.slug === "default" ? "/" : `/${profile.slug}`})</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Template : {profile.template}
          </span>
          <a
            href={profile.slug === "default" ? "/" : `/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white"
          >
            <span>Ouvrir l&apos;URL réelle</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Contenu rendu d'après les données du profil */}
      <div data-template={profile.template} className="min-h-screen">
        {/* En-tête simulé */}
        <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bebas text-xl">
              SY
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-[#0F172A]">
                {settings.nom}
              </div>
              {settings.metier && (
                <div className="text-[11px] text-slate-500">{settings.metier}</div>
              )}
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <span>Accueil</span>
            <span>Projets</span>
            <span>Compétences</span>
            <span>À propos</span>
            <span>Contact</span>
          </nav>

          <a
            href={hero.ctaSecondary?.href || "/contact"}
            className="px-4 py-2 rounded-full bg-[#0F172A] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            {hero.ctaSecondary?.label || "Me contacter"}
          </a>
        </header>

        {/* Hero du profil */}
        <section className="max-w-7xl mx-auto px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            {hero.tagline && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#2563EB] border border-blue-200">
                <Sparkles className="w-3.5 h-3.5" />
                {hero.tagline}
              </span>
            )}

            <h1 className="font-bebas text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#0F172A] leading-none">
              {hero.headline}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              {hero.subline}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={hero.ctaPrimary?.href || "#projets"}
                className="px-6 py-3 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
              >
                {hero.ctaPrimary?.label || "Découvrir mes réalisations"}
              </a>

              <a
                href={hero.ctaSecondary?.href || "/contact"}
                className="px-6 py-3 rounded-full border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold transition-all"
              >
                {hero.ctaSecondary?.label || "Me contacter"}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {profile.heroMedia ? (
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl max-w-sm w-full aspect-square bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.heroMedia.url}
                  alt={hero.media?.alt || profile.heroMedia.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="rounded-3xl border-2 border-dashed border-slate-300 p-12 text-center max-w-sm w-full aspect-square flex flex-col items-center justify-center bg-white/50">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3">
                  <Code className="w-8 h-8" />
                </div>
                <p className="text-xs font-semibold text-[#0F172A]">
                  Visuel abstrait ou placeholder
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  (Configurez un portrait dans l&apos;édition du profil)
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Liste des sections ordonnées configurées */}
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Séquence des sections configurée sur ce profil ({sections.filter((s) => s.visible).length} visibles) :
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {sections.map((sec, idx) => (
              <div
                key={sec.key}
                className={`p-3 rounded-xl border text-center transition-all ${
                  sec.visible
                    ? "bg-white border-slate-200 shadow-sm"
                    : "bg-slate-100/50 border-dashed border-slate-300 opacity-40"
                }`}
              >
                <span className="text-[10px] font-mono text-slate-400 block mb-1">
                  #{idx + 1}
                </span>
                <span className="text-xs font-semibold text-[#0F172A] capitalize block truncate">
                  {sec.key}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  {sec.visible ? "Activée" : "Désactivée"}
                </span>
              </div>
            ))}
          </div>

          {/* Projets rattachés si sous-portfolio */}
          {projectsList.length > 0 && (
            <div className="mt-12 space-y-4">
              <h3 className="font-bebas text-2xl text-[#0F172A] tracking-wide">
                PROJETS ASSOCIÉS AU PROFIL ({projectsList.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {projectsList.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div className="aspect-video bg-slate-900 relative">
                      {project.coverMedia || project.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.coverMedia?.url || project.coverImage || ""}
                          alt={project.titre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          Aucun visuel
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="font-bold text-sm text-[#0F172A]">{project.titre}</div>
                      <p className="text-xs text-slate-600 line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
