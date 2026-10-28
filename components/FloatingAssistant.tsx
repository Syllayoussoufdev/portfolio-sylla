"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { X, Send, Loader2, RotateCcw } from "lucide-react";
import { trackEvent, trackWhatsappClick } from "@/lib/analytics-client";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "sylla_chatbot_history_v1";

const SUGGESTIONS = [
  "Quels services proposes-tu ?",
  "Combien coûte un site vitrine ?",
  "Montre-moi des projets web",
  "Comment démarrer un projet ?",
];

/**
 * Glyphe WhatsApp officiel
 */
function WhatsAppGlyph({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.004 3C8.82 3 3 8.82 3 16c0 2.293.6 4.533 1.74 6.507L3 29l6.68-1.707A12.94 12.94 0 0 0 16.004 29C23.18 29 29 23.18 29 16S23.18 3 16.004 3Zm0 23.6c-2.027 0-4.013-.547-5.747-1.58l-.413-.24-3.96 1.013 1.053-3.853-.267-.4A10.55 10.55 0 0 1 5.4 16c0-5.853 4.76-10.6 10.604-10.6 5.84 0 10.596 4.747 10.596 10.6 0 5.853-4.756 10.6-10.596 10.6Zm5.813-7.933c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.347-.493-2.567-1.587-.947-.84-1.587-1.88-1.773-2.2-.187-.32-.02-.493.14-.653.147-.147.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.26-.627-.524-.54-.72-.55l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667 0 1.573 1.147 3.093 1.307 3.307.16.213 2.253 3.44 5.46 4.827.763.33 1.36.527 1.824.673.767.244 1.464.21 2.016.127.615-.092 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373Z" />
    </svg>
  );
}

/**
 * Icône Chatbot originale et standard :
 * Bulle de message contemporaine avec visage de robot assistant bienveillant
 */
function ChatbotGlyph({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Bulle de dialogue */}
      <path
        d="M21 11.5C21 16.1944 16.9706 20 12 20C10.5843 20 9.24508 19.6738 8.06456 19.0945L3.5 20.5L4.85695 16.1678C3.69974 14.8624 3 13.2562 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 21 6.80558 21 11.5Z"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Visière / Tête du bot */}
      <rect
        x="7.5"
        y="8"
        width="9"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Yeux expressifs ronds */}
      <circle cx="10" cy="11.5" r="1.1" fill="currentColor" />
      <circle cx="14" cy="11.5" r="1.1" fill="currentColor" />
      {/* Sourire du bot */}
      <path
        d="M10.8 13.5C11.3 14 12.7 14 13.2 13.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Antenne intelligente */}
      <path
        d="M12 8V6.2M12 6.2A0.6 0.6 0 1 0 12 5A0.6 0.6 0 0 0 12 6.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Rendu Markdown minimal et sûr (gras, liens, listes) sans dangerouslySetInnerHTML */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s)]+)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${i++}`;
    if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else {
      let label = token;
      let href = token;
      const md = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);
      if (md) {
        label = md[1];
        href = md[2];
      }
      const safe = /^(https?:\/\/|\/|#|mailto:|tel:)/.test(href);
      nodes.push(
        safe ? (
          <a
            key={key}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="underline font-medium text-[#F97316] break-words"
          >
            {label}
          </a>
        ) : (
          label
        )
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function MessageContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const bullet = /^\s*([-*•]|\d+\.)\s+(.*)$/.exec(line);
        if (bullet) {
          return (
            <div key={idx} className="flex gap-2">
              <span className="text-[#F97316] shrink-0">•</span>
              <span>{renderInline(bullet[2], `l${idx}`)}</span>
            </div>
          );
        }
        if (!line.trim()) return <div key={idx} className="h-1" />;
        return <p key={idx}>{renderInline(line.replace(/^#+\s*/, ""), `l${idx}`)}</p>;
      })}
    </div>
  );
}

interface FloatingAssistantProps {
  whatsapp?: string | null;
  nom?: string | null;
}

export function FloatingAssistant({ whatsapp, nom }: FloatingAssistantProps) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const displayName = nom || "Sylla Youssouf";
  const firstName = displayName.split(" ").pop() || "Youssouf";
  const rawDigits = (whatsapp || "2250594564993").replace(/\D/g, "");
  const waNumber =
    rawDigits.length === 10 && rawDigits.startsWith("0")
      ? `225${rawDigits}`
      : rawDigits || "2250594564993";
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Bonjour ${firstName}, je viens de votre portfolio et j'aimerais discuter d'un projet.`
  )}`;

  // Restauration de l'historique de la session
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* ignore */
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Masqué dans l'administration
  if (pathname.startsWith("/admin")) return null;

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    setError(null);
    setInput("");

    // On filtre d'éventuels messages d'assistance vides avant d'ajouter le nouveau
    const sanitizedHistory = messages.filter((m) => m.content.trim().length > 0);
    const next: ChatMessage[] = [...sanitizedHistory, { role: "user", content }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setLoading(true);
    trackEvent("chatbot_message", { page: pathname });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, page: pathname }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "L'assistant est momentanément indisponible.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
      if (!acc.trim()) throw new Error("Réponse vide. Réessayez ou écrivez sur WhatsApp.");
    } catch (err) {
      setMessages(next);
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  function reset() {
    setMessages([]);
    setError(null);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9000] flex flex-col items-end gap-3 font-sans">
      {/* Panneau de discussion */}
      {open && (
        <div
          role="dialog"
          aria-label={`Assistant virtuel de ${displayName}`}
          className="w-[calc(100vw-2.5rem)] sm:w-[380px] h-[min(560px,calc(100vh-7rem))] bg-white text-[#0F172A] rounded-2xl shadow-2xl shadow-slate-900/25 border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* En-tête */}
          <div className="px-4 py-3 bg-[#0F172A] text-white flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shrink-0 shadow-sm">
              <ChatbotGlyph className="w-5 h-5 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0F172A]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight flex items-center gap-1.5">
                <span>Assistant de {firstName}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-300 font-normal">
                  IA
                </span>
              </p>
              <p className="text-[11px] text-slate-300 leading-tight">En ligne · Réponses instantanées</p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={reset}
                title="Nouvelle conversation"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-slate-300 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer l'assistant"
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50 text-sm leading-relaxed"
          >
            <div className="flex">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-3.5 py-2.5 shadow-sm">
                Bonjour 👋 Je suis l&apos;assistant virtuel de <strong>{displayName}</strong>. Je peux vous
                présenter ses services, ses tarifs, ses projets ou vous orienter pour votre projet !
              </div>
            </div>

            {messages.map((m, idx) =>
              m.role === "user" ? (
                <div key={idx} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#F97316] text-white px-3.5 py-2.5 whitespace-pre-wrap break-words shadow-sm">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={idx} className="flex">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-3.5 py-2.5 shadow-sm break-words">
                    {m.content ? (
                      <MessageContent content={m.content} />
                    ) : (
                      <span className="inline-flex gap-1 py-1" aria-label="L'assistant écrit">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                      </span>
                    )}
                  </div>
                </div>
              )
            )}

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-[#C2410C] hover:bg-orange-100 transition-colors cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs px-3 py-2.5 space-y-2">
                <p>{error}</p>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#15803D] hover:underline"
                >
                  <WhatsAppGlyph className="w-3.5 h-3.5" /> Écrire directement sur WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Saisie */}
          <form onSubmit={onSubmit} className="border-t border-slate-200 bg-white p-3 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 1500))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Posez votre question…"
              aria-label="Votre message"
              className="flex-1 resize-none max-h-28 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Envoyer"
              className="w-10 h-10 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white flex items-center justify-center shrink-0 transition-colors disabled:opacity-50 cursor-pointer shadow-sm shadow-orange-500/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 bg-white pb-2 -mt-1">
            Assistant IA : vérifiez les informations clés directement avec {firstName}.
          </p>
        </div>
      )}

      {/* Bulles flottantes */}
      <div className="flex items-center gap-3">
        {!open && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsappClick("floating_button", pathname)}
            aria-label="Discuter sur WhatsApp"
            title="Discuter sur WhatsApp"
            className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#1EBE5A] text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105 active:scale-95"
          >
            <WhatsAppGlyph className="w-6 h-6" />
          </a>
        )}
        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            if (!open) trackEvent("chatbot_open", { page: pathname });
          }}
          aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant virtuel"}
          aria-expanded={open}
          title={open ? "Fermer" : `Une question ? Demandez à l'assistant virtuel de ${firstName}`}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#0F172A] hover:from-[#1E293B] hover:to-[#334155] text-white flex items-center justify-center shadow-xl shadow-slate-900/40 border border-slate-700/50 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
        >
          {open ? (
            <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <ChatbotGlyph className="w-7 h-7 text-[#F97316] transition-transform group-hover:scale-110 duration-200" />
          )}
          {!open && messages.length === 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#F97316] border-2 border-white" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
