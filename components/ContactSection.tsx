"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactActionState } from "@/app/actions/contact";
import { Mail, MessageCircle, Send, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";

export function ContactSection() {
  const [state, formAction, isPending] = useActionState<ContactActionState, FormData>(
    sendContactMessage,
    {}
  );

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Colonne Gauche : Discours & Liens Directs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[#0B132B] text-xs font-medium">
            <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Prise de contact</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B132B]">
            Discutons de votre prochain projet.
          </h2>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            Vous recherchez un développeur pour concevoir une application, renforcer votre équipe
            technique ou moderniser votre produit ? Je réponds généralement sous 24 heures.
          </p>

          {/* Cartes de contact rapide */}
          <div className="space-y-3 pt-2">
            <a
              href="mailto:contact@syllayoussouf.com"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#2563EB]/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#64748B] block">Email direct</span>
                  <span className="text-sm font-semibold text-[#0B132B] group-hover:text-[#2563EB] transition-colors">
                    contact@syllayoussouf.com
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            <a
              href="https://wa.me/33600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#64748B] block">WhatsApp</span>
                  <span className="text-sm font-semibold text-[#0B132B] group-hover:text-emerald-600 transition-colors">
                    Échange direct par messagerie
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>
        </div>

        {/* Colonne Droite : Formulaire épuré 3 champs */}
        <div className="lg:col-span-7">
          <div className="editorial-card p-6 sm:p-10 bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-900/5">
            {state.success ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#0B132B]">Message bien reçu !</h3>
                <p className="text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
                  Merci pour votre message. Je vous répondrai dans les plus brefs délais sur votre adresse email.
                </p>
              </div>
            ) : (
              <form action={formAction} className="space-y-5">
                {state.error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200/80 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="nom" className="block text-xs font-semibold text-[#0B132B]">
                      Votre nom ou entreprise <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      required
                      placeholder="Ex: Alexandre Martin"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-hidden text-sm transition-all bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-semibold text-[#0B132B]">
                      Votre adresse email <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="alexandre@entreprise.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-hidden text-sm transition-all bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-xs font-semibold text-[#0B132B]">
                    Votre message ou brief de projet <span className="text-blue-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Présentez brièvement vos besoins, délais ou questions..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-hidden text-sm transition-all bg-slate-50/50 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0B132B] hover:bg-[#1E293B] active:scale-[0.99] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isPending ? (
                    <span>Envoi en cours...</span>
                  ) : (
                    <>
                      <span>Envoyer mon message</span>
                      <Send className="w-4 h-4 text-blue-400" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
