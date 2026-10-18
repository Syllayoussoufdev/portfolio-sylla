"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction, type ActionState } from "../actions/auth";
import { Mail, Lock, ShieldCheck, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    loginAction,
    {}
  );

  return (
    <div className="glass w-full max-w-md p-8 sm:p-10 relative z-10 shadow-2xl transition-all">
      {/* En-tête */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-[#475569] font-medium mb-1">
          Espace Sécurisé
        </span>
        <h1 className="font-bebas text-4xl text-[#0F172A] tracking-wide">
          Administration Sylla
        </h1>
        <p className="text-sm text-[#475569] mt-1">
          Connectez-vous pour piloter vos projets et sous-portfolios.
        </p>
      </div>

      {/* Message d'erreur */}
      {state?.error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Formulaire */}
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="from" value={from} />

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
            Adresse Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#475569]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              name="email"
              required
              defaultValue="contact@syllayoussouf.com"
              placeholder="votre-email@exemple.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#475569]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Connexion en cours...</span>
            </>
          ) : (
            <>
              <span>Accéder au tableau de bord</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer carte */}
      <div className="mt-8 pt-6 border-t border-slate-200/60 text-center">
        <p className="text-xs text-[#64748B]">
          Portfolio Dynamique Multi-casquettes &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#F9FAFB] overflow-hidden select-none">
      {/* Orbes d'ambiance en dégradé radial conformément à DESIGN.md */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-35 blur-3xl"
        style={{
          background: "radial-gradient(circle, #FB923C 0%, transparent 70%)",
        }}
      />

      <Suspense fallback={<div className="glass w-full max-w-md p-10 text-center">Chargement...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
