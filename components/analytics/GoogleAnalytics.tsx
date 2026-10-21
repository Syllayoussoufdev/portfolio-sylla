"use client";

import Script from "next/script";
import { useEffect } from "react";
import { CONSENT_STORAGE_KEY, updateGtagConsent } from "@/lib/analytics-client";

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    // Si l'utilisateur avait déjà accepté les cookies lors d'une session précédente
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored === "granted") {
        updateGtagConsent("granted");
      }
    }
  }, []);

  if (!gaId) {
    // Fallback : initialiser un dummy gtag pour ne pas planter les appels trackEvent si GA n'est pas encore configuré
    return (
      <script
        id="ga4-dummy-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
          `,
        }}
      />
    );
  }

  return (
    <>
      {/* 1. Google Consent Mode v2 Initialisation par défaut (Deny strict avant consentement explicite) */}
      <Script
        id="ga4-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            // Consent Mode v2 par défaut : Tout est refusé jusqu'à acceptation par l'utilisateur
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />

      {/* 2. Script distant officiel Google Tag Manager / GA4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />

      {/* 3. Configuration GA4 */}
      <Script
        id="ga4-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}
