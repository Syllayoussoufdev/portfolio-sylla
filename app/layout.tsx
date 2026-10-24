import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bebas_Neue, Caveat, Syne, Fraunces, Kaushan_Script } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CookieBanner } from "@/components/analytics/CookieBanner";
import { StructuredData } from "@/components/analytics/StructuredData";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const devSerif = Fraunces({
  variable: "--font-dev-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const devScript = Kaushan_Script({
  variable: "--font-dev-script",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://syllayoussouf.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sylla Youssouf — Portfolio Creative Engineer & Développeur",
    template: "%s | Sylla Youssouf",
  },
  description:
    "Portfolio officiel de Sylla Youssouf : Expert en communication digitale, design graphique, montage vidéo et développement d'applications web & mobiles.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Sylla Youssouf Portfolio",
    title: "Sylla Youssouf — Portfolio & Réalisations",
    description:
      "Découvrez mes réalisations en développement web, design graphique, montage vidéo et direction artistique.",
    images: [
      {
        url: "/images/projects/portfolio-cv-personnel.jpg",
        width: 1200,
        height: 630,
        alt: "Portfolio Sylla Youssouf",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sylla Youssouf — Portfolio Creative Engineer",
    description:
      "Expert en communication digitale, design graphique, montage vidéo et développement web & mobile.",
    images: ["/images/projects/portfolio-cv-personnel.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${caveat.variable} ${syne.variable} ${devSerif.variable} ${devScript.variable} h-full antialiased`}
    >
      <head>
        <StructuredData />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F9FAFB] text-[#0F172A]">
        <GoogleAnalytics />
        <MotionProvider>{children}</MotionProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
