import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sparkles, Users, CheckCircle2, Clock } from "lucide-react";
import LeadsAdminClient from "./LeadsAdminClient";

export const dynamic = "force-dynamic";

export default async function LeadsAdminPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [leads, waitlist] = await Promise.all([
    prisma.projectLead.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.waitlistEntry.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const serializedLeads = leads.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
  }));

  const serializedWaitlist = waitlist.map((w) => ({
    ...w,
    createdAt: w.createdAt.toISOString(),
  }));

  const totalNouveaux = leads.filter((l) => l.statut === "NOUVEAU").length;
  const totalSignes = leads.filter((l) => l.statut === "SIGNE").length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="font-bebas text-3xl sm:text-4xl tracking-wide text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#FF4D00]" />
            LEADS & BRIEFS QUALIFIÉS (CRM)
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Pilotez tous les briefs issus du wizard 4 étapes (`/demarrer`, `/services` & template `DevCreative`) et relancez en 1 clic sur WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-[#FF4D00]">
            {totalNouveaux} Nouveau(x)
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
            {totalSignes} Signé(s)
          </div>
        </div>
      </div>

      <LeadsAdminClient
        initialLeads={serializedLeads}
        waitlistEntries={serializedWaitlist}
      />
    </div>
  );
}
