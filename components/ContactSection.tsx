"use client";

import React, { useRef, useEffect } from "react";
import { useActionState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sendContactMessage, type ContactActionState } from "@/app/actions/contact";
import { Mail, MessageCircle, Send, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import type { SiteSettingsData } from "@/lib/profiles";

interface ContactSectionProps {
  settings?: SiteSettingsData | null;
}

export function ContactSection({ settings }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  const [state, formAction, isPending] = useActionState<ContactActionState, FormData>(
    sendContactMessage,
    {}
  );

  const email = settings?.emailPublic;
  const whatsapp = settings?.whatsapp;
  const cleanWhatsapp = whatsapp ? whatsapp.replace(/\D/g, "") : null;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Révélation échelonnée de la colonne de contact gauche
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: leftColRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 2. Émergence fluide de la carte formulaire avec élévation
      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { opacity: 0, y: 50, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formCardRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24 relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Colonne Gauche : Discours & Liens Directs Réels */}
        <div ref={leftColRef} className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/80 text-[var(--ink)] text-xs font-medium">
            <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Prise de contact</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
            Discutons de votre projet.
          </h2>

          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            Vous recherchez une collaboration pour concevoir une application, renforcer votre équipe
            ou concrétiser une idée numérique ? Transmettez-moi les détails de votre besoin.
          </p>

          {/* Cartes de contact rapide (affichées uniquement si configurées) */}
          {(email || cleanWhatsapp) && (
            <div className="space-y-3 pt-2">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[var(--subtle)] block">Email direct</span>
                      <span className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                        {email}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[var(--subtle)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              )}

              {cleanWhatsapp && (
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[var(--subtle)] block">WhatsApp</span>
                      <span className="text-sm font-semibold text-[var(--ink)] group-hover:text-emerald-500 transition-colors">
                        Échange direct par messagerie
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[var(--subtle)] group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Colonne Droite : Formulaire épuré 3 champs */}
        <div className="lg:col-span-7">
          <div
            ref={formCardRef}
            className="editorial-card p-6 sm:p-10 bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-xl shadow-black/5"
          >
            {state.success ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[var(--ink)]">Message bien reçu !</h3>
                <p className="text-sm text-[var(--muted)] max-w-md mx-auto leading-relaxed">
                  Merci pour votre message. Je vous répondrai dans les plus brefs délais sur votre adresse email.
                </p>
              </div>
            ) : (
              <form action={formAction} className="space-y-5">
                {state.error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="nom" className="block text-xs font-semibold text-[var(--ink)]">
                      Votre nom ou entreprise <span className="text-[var(--accent)]">*</span>
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      required
                      placeholder="Ex: Alexandre Martin"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-all bg-[var(--bg)] text-[var(--ink)] placeholder:text-[var(--subtle)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-semibold text-[var(--ink)]">
                      Votre adresse email <span className="text-[var(--accent)]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="alexandre@domaine.com"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-all bg-[var(--bg)] text-[var(--ink)] placeholder:text-[var(--subtle)]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-xs font-semibold text-[var(--ink)]">
                    Votre message ou brief <span className="text-[var(--accent)]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Décrivez votre projet, vos objectifs, ou vos délais envisagés..."
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-all bg-[var(--bg)] text-[var(--ink)] placeholder:text-[var(--subtle)] resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--ink)] text-[var(--bg)] hover:opacity-90 active:scale-[0.98] text-sm font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[var(--accent)]" />
                  <span>{isPending ? "Envoi en cours..." : "Envoyer le message"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
