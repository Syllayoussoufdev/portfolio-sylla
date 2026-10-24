import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowUpRight, Rocket, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sylla Youssouf — Solutions Technologiques & Stratégie Digitale",
  description:
    "Établissement de stratégies de communication et conception de plateformes & solutions technologiques sur mesure pour booster votre business.",
  openGraph: {
    title: "Sylla Youssouf — Solutions Technologiques & Stratégie Digitale",
    description:
      "Conception des solutions technologiques et stratégies de communication dont vous avez besoin pour booster votre business.",
    images: ["/images/sylla-avatar.jpg"],
  },
};

const PRIMARY_LINKS = [
  {
    id: "portfolio-dev",
    title: "Conception de sites web & solutions sur mesure",
    subtitle: "syllayoussouf.com/dev · Découvrir mes réalisations",
    href: "/dev",
    external: false,
    iconType: "portfolio",
    badge: "Portfolio",
  },
  {
    id: "whatsapp",
    title: "Discuter de votre projet sur WhatsApp",
    subtitle: "Réponse rapide · +225 05 94 56 49 93",
    href: "https://wa.me/2250594564993?text=Bonjour%20Sylla%20%F0%9F%91%8B%2C%20je%20souhaite%20discuter%20d%27une%20solution%20digitale%20pour%20booster%20mon%20activit%C3%A9.",
    external: true,
    iconType: "whatsapp",
    badge: "Direct",
  },
  {
    id: "packs-services",
    title: "Nos Packs & Solutions clés en main (Tarifs FCFA)",
    subtitle: "Sites vitrines, E-commerce, Identité visuelle & Stratégie",
    href: "/services",
    external: false,
    iconType: "services",
  },
  {
    id: "tiktok",
    title: "Sylla | Conseils Tech, Digital & Coulisses",
    subtitle: "@sylla_dev_creatif · TikTok",
    href: "https://www.tiktok.com/@sylla_dev_creatif",
    external: true,
    iconType: "tiktok",
  },
];

const SOCIAL_LINKS = [
  {
    id: "linkedin",
    title: "Youssouf Sylla",
    subtitle: "LinkedIn · Réseau professionnel & Stratégie",
    href: "https://www.linkedin.com/in/youssouf-sylla-00191128a",
    external: true,
    iconType: "linkedin",
  },
  {
    id: "instagram",
    title: "@sylla_dev",
    subtitle: "Instagram · Créations visuelles & Projets",
    href: "https://www.instagram.com/sylla_dev?mdxt=MXIwMDJ3Z3FqZ2x5cg==",
    external: true,
    iconType: "instagram",
  },
  {
    id: "facebook",
    title: "Sylla Youssouf",
    subtitle: "Facebook · Actualités & Communauté",
    href: "https://www.facebook.com/share/1CfKyFQBLB/",
    external: true,
    iconType: "facebook",
  },
  {
    id: "github",
    title: "Syllayoussoufdev",
    subtitle: "GitHub · Code source & Architectures logicielles",
    href: "https://github.com/Syllayoussoufdev",
    external: true,
    iconType: "github",
  },
];

function BrandIcon({ type }: { type: string }) {
  switch (type) {
    case "portfolio":
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#2563EB] flex items-center justify-center shrink-0 shadow-md shadow-[#0EA5E9]/20">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
      );
    case "services":
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#1E40AF] flex items-center justify-center shrink-0 shadow-md shadow-[#2563EB]/20">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      );
    case "whatsapp":
      return (
        <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0 shadow-md shadow-[#25D366]/25">
          {/* Logo officiel complet WhatsApp : Bulle de discussion + combiné */}
          <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.004 3.2c-7.06 0-12.784 5.72-12.784 12.776 0 2.252.588 4.45 1.705 6.388L3.11 28.8l6.605-1.732a12.78 12.78 0 006.285 1.656h.005c7.056 0 12.784-5.722 12.784-12.778 0-3.414-1.33-6.625-3.745-9.038A12.694 12.694 0 0016.004 3.2zm0 23.368h-.004a10.6 10.6 0 01-5.404-1.48l-.388-.23-4.02 1.054 1.073-3.918-.252-.402a10.575 10.575 0 01-1.63-5.64c0-5.852 4.764-10.612 10.625-10.612 2.837 0 5.504 1.105 7.51 3.11a10.545 10.545 0 013.11 7.504c0 5.854-4.764 10.614-10.62 10.614zm5.826-7.948c-.318-.16-1.888-.932-2.18-1.038-.293-.107-.506-.16-.718.16-.213.32-.824 1.038-1.01 1.25-.186.214-.372.24-.69.08-.32-.16-1.347-.496-2.565-1.582-.948-.846-1.588-1.89-1.775-2.21-.186-.32-.02-.492.14-.65.143-.143.32-.373.478-.56.16-.185.213-.318.32-.53.106-.214.053-.4-.027-.56-.08-.16-.718-1.73-.984-2.368-.258-.622-.522-.538-.718-.548l-.612-.01c-.212 0-.558.08-.85.4-.293.318-1.117 1.09-1.117 2.66 0 1.57 1.143 3.086 1.303 3.3.16.212 2.25 3.435 5.45 4.817.762.329 1.356.525 1.82.672.764.243 1.46.208 2.01.126.613-.091 1.888-.771 2.154-1.516.266-.745.266-1.383.186-1.516-.08-.133-.292-.213-.611-.373z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      );
    case "tiktok":
      return (
        <div className="w-10 h-10 rounded-xl bg-[#0B0B0E] border border-white/15 flex items-center justify-center shrink-0 shadow-md">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <path
              d="M16.6 5.82A4.28 4.28 0 0115.54 3h-3.09v12.4a2.59 2.59 0 01-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 004.3 1.38V7.3s-1.88.09-3.24-1.48z"
              fill="#25F4EE"
              transform="translate(-0.6, -0.4)"
            />
            <path
              d="M16.6 5.82A4.28 4.28 0 0115.54 3h-3.09v12.4a2.59 2.59 0 01-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 004.3 1.38V7.3s-1.88.09-3.24-1.48z"
              fill="#FE2C55"
              transform="translate(0.6, 0.4)"
            />
            <path
              d="M16.6 5.82A4.28 4.28 0 0115.54 3h-3.09v12.4a2.59 2.59 0 01-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 004.3 1.38V7.3s-1.88.09-3.24-1.48z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      );
    case "linkedin":
      return (
        <div className="w-10 h-10 rounded-xl bg-[#0A66C2] flex items-center justify-center shrink-0 shadow-md shadow-[#0A66C2]/25">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#FFFFFF">
            <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
          </svg>
        </div>
      );
    case "instagram":
      return (
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md"
          style={{
            background:
              "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="5"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle cx="12" cy="12" r="4" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="#FFFFFF" />
          </svg>
        </div>
      );
    case "facebook":
      return (
        <div className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center shrink-0 shadow-md shadow-[#1877F2]/25">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#FFFFFF">
            <path d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.62H6.61v3.56h3.07V22h3.68v-9.12h3.06l.46-3.56h-3.52V6.65c0-1.05.29-1.73 1.76-1.73z" />
          </svg>
        </div>
      );
    case "github":
      return (
        <div className="w-10 h-10 rounded-xl bg-[#24292F] border border-white/15 flex items-center justify-center shrink-0 shadow-md">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#FFFFFF">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

export default function LiensPage() {
  return (
    <div className="min-h-screen bg-[#141417] text-white selection:bg-[#0EA5E9] selection:text-white flex flex-col justify-between px-5 py-12 sm:px-10 sm:py-20">
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
        {/* COLONNE GAUCHE : Avatar circulaire, Proposition de Valeur Orientée Bénéfices & Call-to-Action */}
        <aside className="md:col-span-5 md:sticky md:top-16 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          {/* Photo de profil circulaire avec anneau métallisé */}
          <div className="relative w-38 h-38 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-b from-[#A1A1AA] to-[#52525B] shadow-2xl">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-[#111113]">
              <Image
                src="/images/sylla-avatar.jpg"
                alt="Sylla Youssouf — Solutions Technologiques & Stratégie de Communication"
                fill
                priority
                sizes="180px"
                className="object-cover"
              />
            </div>
            {/* Badge de disponibilité actif */}
            <span
              title="Disponible pour accompagner votre entreprise"
              className="absolute bottom-2.5 right-2.5 w-4 h-4 rounded-full bg-[#25D366] ring-4 ring-[#141417]"
            />
          </div>

          {/* Nom & Proposition de Valeur Orientée Résultats Business */}
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/25 text-[#38BDF8] text-[11px] font-semibold tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Développeur &amp; Stratège Digital</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Sylla Youssouf
            </h1>

            <p className="text-sm sm:text-[15px] text-[#E4E4E7] font-medium leading-relaxed max-w-md">
              Établissement de <strong className="text-white font-semibold">stratégies de communication</strong> et de{" "}
              <strong className="text-white font-semibold">plateformes performantes</strong> pour booster votre business.
            </p>

            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-md">
              Conception des solutions technologiques sur mesure dont vous avez besoin pour attirer plus de clients, crédibiliser votre marque et accélérer vos ventes.
            </p>
          </div>

          {/* Call-To-Action Orienté Bénéfice Réel */}
          <div className="pt-1 w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-3">
            <Link
              href="/demarrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-b from-[#FFFFFF] to-[#E4E4E7] hover:from-white hover:to-white text-[#141417] text-xs sm:text-sm font-extrabold shadow-xl shadow-black/40 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <Rocket className="w-4 h-4 text-[#0EA5E9] shrink-0" />
              <span>Booster mon business</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5] shrink-0" />
            </Link>

            <Link
              href="/dev"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs sm:text-sm font-semibold text-white transition-all"
            >
              <span>Voir mes réalisations</span>
            </Link>
          </div>
        </aside>

        {/* COLONNE DROITE : Liste des cartes de liens (Plateformes & Tous mes réseaux) */}
        <main className="md:col-span-7 space-y-10 w-full max-w-lg mx-auto md:mx-0">
          {/* Groupe 1 : Solutions, Portfolio & Contact Direct */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1AA]">
                Solutions &amp; Contact Direct
              </span>
              <span className="text-[11px] text-[#38BDF8] font-medium">
                Réponse sous 24h
              </span>
            </div>

            {PRIMARY_LINKS.map((item) => {
              const CardInner = (
                <>
                  <div className="flex items-center gap-4 min-w-0">
                    <BrandIcon type={item.iconType} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-[#F4F4F5] truncate group-hover:text-white transition-colors">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/90">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] sm:text-xs text-[#8E9196] truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <span className="w-7 h-7 rounded-full border border-white/20 group-hover:border-white/60 bg-white/[0.03] group-hover:bg-white/10 text-white/80 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:translate-x-0.5">
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </>
              );

              return item.external ? (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full rounded-2xl bg-[#1D1D22] hover:bg-[#25252C] border border-white/[0.08] hover:border-white/25 px-4 sm:px-5 py-4 flex items-center justify-between gap-4 transition-all duration-200 shadow-md"
                >
                  {CardInner}
                </a>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group w-full rounded-2xl bg-[#1D1D22] hover:bg-[#25252C] border border-white/[0.08] hover:border-white/25 px-4 sm:px-5 py-4 flex items-center justify-between gap-4 transition-all duration-200 shadow-md"
                >
                  {CardInner}
                </Link>
              );
            })}
          </div>

          {/* Groupe 2 : Tous mes réseaux */}
          <div className="space-y-3">
            <div className="px-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1AA]">
                Tous mes réseaux officiels
              </span>
            </div>

            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full rounded-2xl bg-[#1D1D22] hover:bg-[#25252C] border border-white/[0.08] hover:border-white/25 px-4 sm:px-5 py-4 flex items-center justify-between gap-4 transition-all duration-200 shadow-md"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <BrandIcon type={item.iconType} />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-[#F4F4F5] truncate group-hover:text-white transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] sm:text-xs text-[#8E9196] truncate mt-0.5">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <span className="w-7 h-7 rounded-full border border-white/20 group-hover:border-white/60 bg-white/[0.03] group-hover:bg-white/10 text-white/80 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:translate-x-0.5">
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </a>
            ))}
          </div>
        </main>
      </div>

      {/* Pied de page discret */}
      <footer className="max-w-5xl w-full mx-auto pt-12 mt-12 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#71717A]">
        <span>© {new Date().getFullYear()} Sylla Youssouf · Stratégie &amp; Solutions Technologiques</span>
        <Link href="/dev" className="text-[#38BDF8] hover:underline font-medium">
          syllayoussouf.com/dev →
        </Link>
      </footer>
    </div>
  );
}
