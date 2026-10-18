import { Metadata } from "next";
import { getSiteSettings } from "@/lib/profiles";
import { Navbar } from "@/components/Navbar";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — Sylla Youssouf | Développeur Web & Mobile",
  description:
    "Discutons de votre projet d'application web ou mobile, d'une opportunité d'équipe ou d'une collaboration.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col">
      <Navbar settings={settings} />
      <main className="flex-1 pt-24">
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
