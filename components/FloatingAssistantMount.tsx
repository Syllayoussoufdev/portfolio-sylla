import { getSiteSettings } from "@/lib/profiles";
import { FloatingAssistant } from "./FloatingAssistant";

/**
 * Wrapper serveur : récupère le numéro WhatsApp et le nom depuis les Réglages
 * puis monte les bulles flottantes (WhatsApp + Assistant IA) sur les pages publiques.
 */
export async function FloatingAssistantMount() {
  const settings = await getSiteSettings();
  return <FloatingAssistant whatsapp={settings?.whatsapp} nom={settings?.nom} />;
}
