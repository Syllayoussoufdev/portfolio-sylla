"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateLeadStatusAction(
  id: string,
  statut: "NOUVEAU" | "CONTACTE" | "DEVIS_ENVOYE" | "SIGNE" | "PERDU",
  notes?: string
) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Non autorisé" };
  }

  try {
    await prisma.projectLead.update({
      where: { id },
      data: {
        statut,
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("[Admin DevCreative] Erreur mise à jour lead:", error);
    return { success: false, error: "Impossible de mettre à jour ce lead." };
  }
}

export async function deleteLeadAction(id: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Non autorisé" };
  }

  try {
    await prisma.projectLead.delete({
      where: { id },
    });

    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("[Admin DevCreative] Erreur suppression lead:", error);
    return { success: false, error: "Impossible de supprimer ce lead." };
  }
}

export async function updateServiceOfferQuickAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Non autorisé" };
  }

  const id = String(formData.get("id") || "");
  const statut = String(formData.get("statut") || "DISPONIBLE") as
    | "DISPONIBLE"
    | "BIENTOT"
    | "LISTE_ATTENTE";
  const prixLabel = String(formData.get("prixLabel") || "").trim();
  const delai = String(formData.get("delai") || "").trim();
  const visible = formData.get("visible") === "true";

  if (!id) {
    return { success: false, error: "Identifiant d'offre manquant." };
  }

  try {
    await prisma.serviceOffer.update({
      where: { id },
      data: {
        statut,
        prixLabel: prixLabel || null,
        delai: delai || "Sur devis",
        visible,
      },
    });

    revalidatePath("/admin/offres");
    revalidatePath("/");
    revalidatePath("/dev");
    revalidatePath("/services");
    revalidatePath("/demarrer");
    return { success: true };
  } catch (error) {
    console.error("[Admin DevCreative] Erreur mise à jour offre:", error);
    return { success: false, error: "Erreur lors de la mise à jour de l'offre." };
  }
}

export async function updateServicePackQuickAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Non autorisé" };
  }

  const id = String(formData.get("id") || "");
  const statut = String(formData.get("statut") || "DISPONIBLE") as
    | "DISPONIBLE"
    | "BIENTOT"
    | "LISTE_ATTENTE";
  const rawPrix = Number(String(formData.get("prix") || "0").replace(/[^0-9]/g, ""));
  const delai = String(formData.get("delai") || "").trim();
  const visible = formData.get("visible") === "true";

  if (!id) {
    return { success: false, error: "Identifiant de pack manquant." };
  }

  try {
    await prisma.servicePack.update({
      where: { id },
      data: {
        statut,
        prix: rawPrix > 0 ? rawPrix : 250000,
        delai: delai || "10 à 15 jours",
        visible,
      },
    });

    revalidatePath("/admin/offres");
    revalidatePath("/");
    revalidatePath("/dev");
    revalidatePath("/services");
    revalidatePath("/demarrer");
    return { success: true };
  } catch (error) {
    console.error("[Admin DevCreative] Erreur mise à jour pack:", error);
    return { success: false, error: "Erreur lors de la mise à jour du pack." };
  }
}
