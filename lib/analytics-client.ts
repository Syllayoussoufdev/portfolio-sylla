/**
 * Client Analytics & KPI Tracking Module (Google Analytics 4 / GA4)
 * Intègre le suivi d'événements personnalisés et le Consent Mode v2 (RGPD).
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    openCookieSettings?: () => void;
  }
}

export type ConsentStatus = "granted" | "denied";

export const CONSENT_STORAGE_KEY = "sylla_cookie_consent_v1";

/**
 * Met à jour le statut du Google Consent Mode v2
 */
export function updateGtagConsent(status: ConsentStatus) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("consent", "update", {
    analytics_storage: status,
    ad_storage: status,
    ad_user_data: status,
    ad_personalization: status,
  });
}

/**
 * Envoie un événement personnalisé à Google Analytics 4
 */
export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // Envoi via gtag si disponible
  if (window.gtag) {
    window.gtag("event", eventName, params);
  }

  // Journalisation en développement pour audit facile des KPIs
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[GA4 Event] ${eventName}:`, params);
  }
}

// ============================================================================
// KPIS SPÉCIFIQUES DU PORTFOLIO
// ============================================================================

/**
 * KPI 1 : Vue de page avec contexte de template et profil ciblé
 */
export function trackPageView(path: string, template?: string, profileSlug?: string) {
  trackEvent("page_view_custom", {
    page_path: path,
    template_type: template || "creatif",
    profile_target: profileSlug || "default",
  });
}

/**
 * KPI 2 : Consultation / Clic sur un projet (mesure de l'intérêt par catégorie)
 */
export function trackProjectClick(slug: string, titre: string, category?: string) {
  trackEvent("project_click", {
    project_slug: slug,
    project_title: titre,
    project_category: category || "general",
  });
}

/**
 * KPI 3 : Clic sur un appel à l'action clé (CTA)
 */
export function trackCtaClick(label: string, destination: string, location: string) {
  trackEvent("cta_click", {
    cta_label: label,
    cta_destination: destination,
    cta_location: location,
  });
}

/**
 * KPI 4 : Soumission du formulaire de contact (conversion principale)
 */
export function trackContactSubmit(status: "success" | "error" | "rate_limited") {
  trackEvent("contact_form_submit", {
    submission_status: status,
    timestamp: new Date().toISOString(),
  });
}

/**
 * KPI 5 : Filtrage de la grille de réalisations par domaine
 */
export function trackCategoryFilter(category: string, template: string) {
  trackEvent("filter_projects", {
    category_selected: category,
    active_template: template,
  });
}

/**
 * KPI 6 : Interaction multimédia (Showreel 3D, aperçu cinématique)
 */
export function trackMediaInteraction(mediaType: "showreel_3d" | "cinematic_visual", action: string) {
  trackEvent("media_interaction", {
    media_type: mediaType,
    action_type: action,
  });
}
