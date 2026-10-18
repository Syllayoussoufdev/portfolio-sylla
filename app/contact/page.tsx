import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact — Sylla Youssouf | Développeur Web & Mobile",
  description:
    "Discutons de votre projet d'application web ou mobile, d'une opportunité d'équipe ou d'une collaboration.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B132B] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
