import { Metadata } from "next";
import { getAllParcoursAdmin } from "@/lib/parcours";
import { ParcoursClient } from "./ParcoursClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Parcours & Évolutions | Admin",
  description: "Gérez vos diplômes, formations, expériences professionnelles et certifications.",
};

export default async function AdminParcoursPage() {
  const items = await getAllParcoursAdmin();

  return <ParcoursClient initialItems={items} />;
}
