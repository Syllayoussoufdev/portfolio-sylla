import { prisma } from "@/lib/prisma";
import {
  toggleMessageReadStatusAction,
  deleteMessageAction,
} from "../../actions/messages";
import {
  MessageSquare,
  Mail,
  Trash2,
  Clock,
  User,
} from "lucide-react";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="font-bebas text-4xl sm:text-5xl text-[#0F172A] tracking-wide">
          Messages Reçus
        </h1>
        <p className="text-sm text-[#475569]">
          Demandes de contact transmises depuis le formulaire public de votre portfolio.
        </p>
      </div>

      {/* Liste des messages */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#0F172A]">Aucun message pour le moment</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              Les messages envoyés par les recruteurs ou clients depuis votre formulaire apparaîtront ici.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const toggleRead = toggleMessageReadStatusAction.bind(null, msg.id, msg.lu);
            const deleteMsg = deleteMessageAction.bind(null, msg.id);

            return (
              <div
                key={msg.id}
                className={`p-6 rounded-2xl border transition-all shadow-sm ${
                  msg.lu
                    ? "bg-white border-slate-200/80 text-slate-700"
                    : "bg-purple-50/40 border-purple-200 text-[#0F172A]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-[#0F172A] flex items-center justify-center shrink-0 font-semibold text-sm">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#0F172A]">{msg.nom}</span>
                        {!msg.lu && (
                          <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-[#2563EB] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Mail className="w-3 h-3" />
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(msg.createdAt).toLocaleString("fr-FR")}
                    </span>

                    {/* Bascule Lu / Non lu */}
                    <form action={toggleRead}>
                      <button
                        type="submit"
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-colors ${
                          msg.lu
                            ? "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {msg.lu ? "Marquer non lu" : "Marquer comme lu"}
                      </button>
                    </form>

                    {/* Supprimer */}
                    <form action={deleteMsg}>
                      <button
                        type="submit"
                        title="Supprimer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Corps du message */}
                <div className="mt-4 text-sm text-[#0F172A] whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
