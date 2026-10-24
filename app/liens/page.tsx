import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Sparkles, Globe, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Sylla Youssouf — Liens, Sites & Réseaux Officiels",
  description:
    "Votre développeur & chargé de communication digitale. Améliorez votre présence digitale, de la stratégie de communication à une plateforme moderne.",
  openGraph: {
    title: "Sylla Youssouf — Développeur & Chargé de Communication Digitale",
    description:
      "Améliorez votre présence digitale, de la stratégie de communication à une plateforme moderne.",
    images: ["/images/sylla-avatar.jpg"],
  },
};

const PRIMARY_LINKS = [
  {
    id: "portfolio-dev",
    title: "Sylla Youssouf | Portfolio & Offres",
    subtitle: "syllayoussouf.com/dev",
    href: "/dev",
    external: false,
    iconType: "portfolio",
  },
  {
    id: "whatsapp",
    title: "WhatsApp Direct · Démarrer un projet",
    subtitle: "+225 05 94 56 49 93",
    href: "https://wa.me/2250594564993?text=Bonjour%20Sylla%20%F0%9F%91%8B%2C%20je%20viens%20de%20votre%20page%20de%20liens%20et%20je%20souhaite%20discuter%20d%27un%20projet%20digital.",
    external: true,
    iconType: "whatsapp",
  },
  {
    id: "tiktok",
    title: "Sylla | Développeur & Créatif",
    subtitle: "@sylla_dev_creatif",
    href: "https://www.tiktok.com/@sylla_dev_creatif",
    external: true,
    iconType: "tiktok",
  },
  {
    id: "packs-services",
    title: "Catalogue des Services & Packs FCFA",
    subtitle: "Identité visuelle, Sites web & Applications",
    href: "/services",
    external: false,
    iconType: "services",
  },
];

const SOCIAL_LINKS = [
  {
    id: "linkedin",
    title: "Youssouf Sylla",
    subtitle: "LinkedIn",
    href: "https://www.linkedin.com/in/youssouf-sylla-00191128a",
    external: true,
    iconType: "linkedin",
  },
  {
    id: "instagram",
    title: "sylla_dev",
    subtitle: "Instagram",
    href: "https://www.instagram.com/sylla_dev?mdxt=MXIwMDJ3Z3FqZ2x5cg==",
    external: true,
    iconType: "instagram",
  },
  {
    id: "facebook",
    title: "Sylla Youssouf",
    subtitle: "Facebook",
    href: "https://www.facebook.com/share/1CfKyFQBLB/",
    external: true,
    iconType: "facebook",
  },
  {
    id: "github",
    title: "Syllayoussoufdev",
    subtitle: "GitHub · Projets & Architectures",
    href: "https://github.com/Syllayoussoufdev",
    external: true,
    iconType: "github",
  },
];

function BrandIcon({ type }: { type: string }) {
  switch (type) {
    case "portfolio":
      return (
        <div className="w-6 h-6 rounded-md bg-[#0EA5E9] text-white flex items-center justify-center shrink-0">
          <Globe className="w-3.5 h-3.5" />
        </div>
      );
    case "services":
      return (
        <div className="w-6 h-6 rounded-md bg-[#2563EB] text-white flex items-center justify-center shrink-0">
          <Layers className="w-3.5 h-3.5" />
        </div>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
          <rect width="24" height="24" rx="6" fill="#25D366" />
          <path
            d="M16.6 14.2c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.5-.5-.9-1.1-1.2-1.8-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4-.1-.1-.5-1.3-.7-1.8-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.5.5-.8 1.2-.8 2 0 1.1.5 2.2 1.2 3 1.4 1.6 3.2 2.6 5.2 2.9.5.1 1.1.1 1.6 0 .5-.1 1.3-.6 1.5-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.6-.3z"
            fill="#fff"
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
          <rect width="24" height="24" rx="6" fill="#000000" />
          <path
            d="M16.5 8.2c-.9-.6-1.5-1.6-1.6-2.7h-2.5v10.3c0 1.2-1 2.2-2.2 2.2s-2.2-1-2.2-2.2 1-2.2 2.2-2.2c.2 0 .5 0 .7.1v-2.6c-.2 0-.5-.1-.7-.1-2.6 0-4.7 2.1-4.7 4.7s2.1 4.7 4.7 4.7 4.7-2.1 4.7-4.7v-5.7c.9.7 2.1 1.1 3.3 1.1V8.6c-.6 0-1.2-.1-1.7-.4z"
            fill="#fff"
          />
          <path
            d="M16.5 8.2c-.9-.6-1.5-1.6-1.6-2.7h-.8v10.3c0 1.2-1 2.2-2.2 2.2-.6 0-1.2-.3-1.6-.7.4.9 1.3 1.5 2.4 1.5 1.2 0 2.2-1 2.2-2.2v-5.7c.9.7 2.1 1.1 3.3 1.1V8.6c-.6 0-1.2-.1-1.7-.4z"
            fill="#FE2C55"
          />
          <path
            d="M12.4 5.5v9.6c0 1.2-1 2.2-2.2 2.2-.5 0-1-.2-1.4-.5.4.6 1.1 1 2 1 1.2 0 2.2-1 2.2-2.2V5.5h-.6z"
            fill="#25F4EE"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
          <rect width="24" height="24" rx="5" fill="#0A66C2" />
          <path
            d="M7.2 9.8h2.3v7.4H7.2V9.8zm1.1-3.6c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3-1.3-.6-1.3-1.3.6-1.3 1.3-1.3zm3.6 3.6h2.2v1c.3-.6 1.1-1.2 2.2-1.2 2.3 0 2.8 1.5 2.8 3.5v4.1h-2.3v-3.6c0-.9 0-2-1.2-2s-1.4.9-1.4 1.9v3.7h-2.3V9.8z"
            fill="#fff"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FD5949" />
              <stop offset="50%" stopColor="#D6249F" />
              <stop offset="100%" stopColor="#285AEB" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
          <rect
            x="5.5"
            y="5.5"
            width="13"
            height="13"
            rx="3.8"
            stroke="#fff"
            strokeWidth="1.6"
          />
          <circle cx="12" cy="12" r="3.1" stroke="#fff" strokeWidth="1.6" />
          <circle cx="15.8" cy="8.2" r="0.9" fill="#fff" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
          <rect width="24" height="24" rx="6" fill="#1877F2" />
          <path
            d="M15.1 12.8l.4-2.6h-2.5V8.5c0-.7.3-1.4 1.5-1.4h1.1V4.9s-1-.2-2-.2c-2 0-3.4 1.2-3.4 3.5v2H8v2.6h2.2V19h2.8v-6.2h2.1z"
            fill="#fff"
          />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
          <rect width="24" height="24" rx="6" fill="#24292F" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 4.5a7.5 7.5 0 00-2.37 14.62c.37.07.5-.16.5-.36v-1.27c-2.08.45-2.52-1-2.52-1-.34-.86-.83-1.1-.83-1.1-.68-.46.05-.45.05-.45.75.05 1.15.77 1.15.77.67 1.14 1.75.81 2.18.62.07-.48.26-.81.47-1-1.66-.19-3.41-.83-3.41-3.7 0-.82.29-1.48.77-2-.08-.19-.33-.95.07-1.98 0 0 .63-.2 2.06.77a7.18 7.18 0 013.76 0c1.43-.97 2.06-.77 2.06-.77.4 1.03.15 1.79.07 1.98.48.52.77 1.18.77 2 0 2.88-1.75 3.51-3.42 3.7.27.23.51.69.51 1.39v2.06c0 .2.13.43.51.36A7.5 7.5 0 0012 4.5z"
            fill="#fff"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function LiensPage() {
  return (
    <div className="min-h-screen bg-[#18181A] text-white selection:bg-[#0EA5E9] selection:text-white flex flex-col justify-between px-5 py-12 sm:px-10 sm:py-20">
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
        {/* COLONNE GAUCHE : Avatar circulaire, Nom, Positionnement & Bouton d'Action (Style taap.it) */}
        <aside className="md:col-span-5 md:sticky md:top-16 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          {/* Photo de profil circulaire avec anneau gris métallisé */}
          <div className="relative w-38 h-38 sm:w-44 sm:h-44 rounded-full p-1.5 bg-[#8E9196] shadow-2xl">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-[#111113]">
              <Image
                src="/images/sylla-avatar.jpg"
                alt="Sylla Youssouf — Développeur & Chargé de Communication Digitale"
                fill
                priority
                sizes="180px"
                className="object-cover"
              />
            </div>
            {/* Pastille verte disponible */}
            <span
              title="Disponible pour nouveaux projets"
              className="absolute bottom-2.5 right-2.5 w-4 h-4 rounded-full bg-[#25D366] ring-4 ring-[#18181A]"
            />
          </div>

          {/* Nom & Positionnement */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F4F5]">
              Sylla Youssouf
            </h1>

            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#38BDF8]">
              Votre développeur &amp; chargé de communication digitale
            </p>

            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-sm">
              Améliorez votre présence digitale, de la stratégie de communication à une plateforme moderne.
            </p>
          </div>

          {/* Bouton Pilule Clair (Style exact de la référence taap.it) */}
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Link
              href="/demarrer"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#F4F4F6] to-[#D4D4D8] hover:from-white hover:to-[#E4E4E7] text-[#18181A] text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#18181A]" />
              <span>Démarrer un projet</span>
            </Link>

            <Link
              href="/dev"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs sm:text-sm font-semibold text-white/90 transition-all"
            >
              <span>Voir le portfolio</span>
            </Link>
          </div>
        </aside>

        {/* COLONNE DROITE : Liste des cartes de liens (2 blocs espacés comme sur la capture) */}
        <main className="md:col-span-7 space-y-12 w-full max-w-md mx-auto md:mx-0">
          {/* Groupe 1 : Sites, Offres, WhatsApp & TikTok */}
          <div className="space-y-3.5">
            {PRIMARY_LINKS.map((item) => {
              const CardInner = (
                <>
                  <div className="flex items-center gap-3.5 min-w-0">
                    <BrandIcon type={item.iconType} />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-[#F4F4F5] truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#71717A] truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <span className="w-5 h-5 rounded-full border border-white/25 group-hover:border-white/60 text-white/70 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:translate-x-0.5">
                    <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                  </span>
                </>
              );

              return item.external ? (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full rounded-2xl bg-[#1D1D20]/90 hover:bg-[#242428] border border-white/[0.08] hover:border-white/20 px-5 py-4 flex items-center justify-between gap-4 transition-all duration-200 shadow-sm"
                >
                  {CardInner}
                </a>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group w-full rounded-2xl bg-[#1D1D20]/90 hover:bg-[#242428] border border-white/[0.08] hover:border-white/20 px-5 py-4 flex items-center justify-between gap-4 transition-all duration-200 shadow-sm"
                >
                  {CardInner}
                </Link>
              );
            })}
          </div>

          {/* Groupe 2 : Réseaux Sociaux (LinkedIn, Instagram, Facebook, GitHub) */}
          <div className="space-y-3.5">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full rounded-2xl bg-[#1D1D20]/90 hover:bg-[#242428] border border-white/[0.08] hover:border-white/20 px-5 py-4 flex items-center justify-between gap-4 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <BrandIcon type={item.iconType} />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-[#F4F4F5] truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#71717A] truncate mt-0.5">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <span className="w-5 h-5 rounded-full border border-white/25 group-hover:border-white/60 text-white/70 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:translate-x-0.5">
                  <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                </span>
              </a>
            ))}
          </div>
        </main>
      </div>

      {/* Pied de page discret */}
      <footer className="max-w-5xl w-full mx-auto pt-12 mt-12 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#71717A]">
        <span>© {new Date().getFullYear()} Sylla Youssouf · Abidjan &amp; International</span>
        <Link href="/dev" className="text-[#38BDF8] hover:underline font-medium">
          syllayoussouf.com/dev →
        </Link>
      </footer>
    </div>
  );
}
