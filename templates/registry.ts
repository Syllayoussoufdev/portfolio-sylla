import { TEMPLATES } from "@/lib/validations/profile";

export type TemplateId = (typeof TEMPLATES)[number];

export interface TemplateDefinition {
  id: TemplateId;
  label: string;
  description: string;
  defaultAccent: string;
  availableAccents: {
    id: string;
    label: string;
    value: string;
  }[];
}

export const TEMPLATES_REGISTRY: Record<TemplateId, TemplateDefinition> = {
  creatif: {
    id: "creatif",
    label: "Créatif (Verre givré bleu/orange)",
    description: "Identité principale de Sylla. Cartes en verre givré, orbes vibrantes, chaleureux et expressif.",
    defaultAccent: "default",
    availableAccents: [
      { id: "default", label: "Bleu électrique & Orange vif", value: "#2563EB" },
      { id: "cyan-ambre", label: "Cyan & Ambre", value: "#06B6D4" },
    ],
  },
  developpeur: {
    id: "developpeur",
    label: "Développeur (Bleu nuit & Précision)",
    description: "Sobre, technique et rigoureux. Arrière-plan feutré, polyèdre filaire 3D et typographie nette.",
    defaultAccent: "default",
    availableAccents: [
      { id: "default", label: "Bleu nuit & Précision", value: "#2563EB" },
      { id: "emeraude", label: "Émeraude & Ardoise", value: "#10B981" },
    ],
  },
  immersif: {
    id: "immersif",
    label: "Immersif (Sombre & 3D)",
    description: "Contraste profond, ambiance sombre et objet 3D au centre pour profils multimédia & motion.",
    defaultAccent: "default",
    availableAccents: [
      { id: "default", label: "Violet & Magenta", value: "#7C5CFF" },
      { id: "neon", label: "Néon Vert & Indigo", value: "#10B981" },
    ],
  },
};

export function getTemplateDefinition(templateId: string): TemplateDefinition {
  if (templateId in TEMPLATES_REGISTRY) {
    return TEMPLATES_REGISTRY[templateId as TemplateId];
  }
  return TEMPLATES_REGISTRY.creatif;
}
