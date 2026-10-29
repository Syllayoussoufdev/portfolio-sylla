import { z } from "zod";

export const OFFER_FAMILIES = [
  { id: "conception", label: "1. Conception & Identité", shortLabel: "Identité & Design" },
  { id: "strategie", label: "2. Publicité Facebook & Stratégie", shortLabel: "Facebook Ads & Stratégie" },
  { id: "presence-en-ligne", label: "3. Sites Web & Pages Sociales", shortLabel: "Sites Web & Pages" },
  { id: "missions-ponctuelles", label: "4. Automatisation n8n & Tech", shortLabel: "n8n & Automatisation" },
  { id: "mobile-business", label: "5. Plateforme Mobile Business", shortLabel: "Mobile Business" },
] as const;

export const OFFER_STATUSES = ["DISPONIBLE", "BIENTOT", "LISTE_ATTENTE"] as const;
export type OfferStatusType = (typeof OFFER_STATUSES)[number];

export const LEAD_STATUSES = ["NOUVEAU", "CONTACTE", "DEVIS_ENVOYE", "SIGNE", "PERDU"] as const;
export type LeadStatusType = (typeof LEAD_STATUSES)[number];

// Schéma d'une Offre de Service
export const ServiceOfferSchema = z.object({
  slug: z
    .string()
    .min(2, "Le slug est requis")
    .regex(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des minuscules, chiffres et tirets"),
  famille: z.string().min(2, "La famille d'offre est requise"),
  titre: z.string().min(3, "Le titre de l'offre est requis"),
  accroche: z.string().min(10, "L'accroche orientée bénéfice client est requise"),
  livrables: z.array(z.string().min(2)).min(1, "Au moins un livrable mesurable est requis (règle Apport Réel)"),
  delai: z.string().min(2, "Le délai indicatif est requis"),
  prixDepuis: z.number().int().nonnegative().nullable().optional(),
  prixLabel: z.string().optional().nullable(),
  unite: z.enum(["unique", "mensuel", "journee"]).default("unique"),
  phase: z.number().int().min(1).max(3).default(1),
  statut: z.enum(OFFER_STATUSES).default("DISPONIBLE"),
  projectId: z.string().optional().nullable(),
  ordre: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export type ServiceOfferInput = z.infer<typeof ServiceOfferSchema>;

// Schéma d'un Pack
export const ServicePackSchema = z.object({
  slug: z
    .string()
    .min(2, "Le slug est requis")
    .regex(/^[a-z0-9-]+$/, "Slug invalide"),
  titre: z.string().min(3, "Le titre du pack est requis"),
  sousTitre: z.string().optional().nullable(),
  prix: z.number().int().positive("Le prix en FCFA doit être supérieur à 0"),
  economie: z.string().optional().nullable(),
  delai: z.string().min(2, "Le délai est requis"),
  servicesInclus: z.array(z.string().min(2)).min(1, "Listez les services inclus dans le pack"),
  resultat: z.string().optional().nullable(),
  phase: z.number().int().min(1).max(3).default(1),
  statut: z.enum(OFFER_STATUSES).default("DISPONIBLE"),
  misEnAvant: z.boolean().default(false),
  ordre: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export type ServicePackInput = z.infer<typeof ServicePackSchema>;

// Schéma du Wizard de Brief (PRD §8)
export const ProjectLeadWizardSchema = z.object({
  projectType: z.string().min(2, "Veuillez choisir un type de projet"),
  goal: z
    .string()
    .min(5, "Décrivez brièvement votre objectif principal (au moins 5 caractères)")
    .max(2000, "L'objectif ne doit pas dépasser 2000 caractères"),
  budgetRange: z.string().min(2, "Veuillez sélectionner une tranche de budget"),
  deadline: z.string().min(2, "Veuillez indiquer un délai souhaité"),
  name: z
    .string()
    .min(2, "Votre nom complet est requis")
    .max(120, "Nom trop long"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  phone: z
    .string()
    .min(8, "Veuillez indiquer un numéro WhatsApp / téléphone valide")
    .max(30, "Numéro trop long"),
  message: z.string().max(3000).optional().nullable(),
  consent: z.literal(true, {
    message: "Vous devez accepter d'être recontacté pour soumettre ce brief.",
  }),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
    })
    .optional(),
  company_website: z.string().optional(), // Honeypot anti-spam
});

export type ProjectLeadWizardInput = z.infer<typeof ProjectLeadWizardSchema>;

// Schéma Liste d'attente pour les offres "Bientôt" (Phases 2 & 3)
export const WaitlistSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  offreVisee: z.string().min(2, "Offre visée requise"),
  consentement: z.literal(true, {
    message: "Le consentement est requis pour rejoindre la liste d'attente.",
  }),
  company_website: z.string().optional(), // Honeypot
});

// Schéma Témoignage (accord écrit obligatoire selon PRD §6-7)
export const TestimonialSchema = z.object({
  auteur: z.string().min(2, "Le nom de l'auteur est requis"),
  role: z.string().min(2, "Le rôle est requis"),
  entreprise: z.string().min(2, "L'entreprise ou structure est requise"),
  citation: z.string().min(15, "La citation doit comporter au moins 15 caractères"),
  photo: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  accordEcrit: z.literal(true, {
    message: "L'accord écrit du client est obligatoire pour publier un témoignage.",
  }),
  visible: z.boolean().default(true),
  ordre: z.number().int().default(0),
});

// Schéma FAQ
export const FaqItemSchema = z.object({
  question: z.string().min(5, "La question est requise"),
  reponse: z.string().min(10, "La réponse détaillée est requise"),
  categorie: z.string().default("Général"),
  ordre: z.number().int().default(0),
  visible: z.boolean().default(true),
});
