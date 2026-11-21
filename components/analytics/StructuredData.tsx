import React from "react";

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Profil Professionnel (Person)
      {
        "@type": "Person",
        "@id": "https://syllayoussouf.com/#person",
        name: "Sylla Youssouf - Communication Digitale & Web",
        alternateName: "Sylla Youssouf",
        url: "https://syllayoussouf.com",
        image: "https://syllayoussouf.com/sylla.jpg",
        jobTitle: "Creative Engineer, Designer UI/UX & Développeur Web Full Stack",
        description:
          "Expert en communication digitale, design UI/UX, développement web (Next.js, React, Laravel, Django) et automatisation IA basé à Abidjan, Côte d'Ivoire.",
        telephone: "+225 05 94 56 49 93",
        email: "contact@syllayoussouf.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Abidjan",
          addressRegion: "Lagunes",
          addressCountry: "CI",
        },
        sameAs: [
          "https://github.com/Syllayoussoufdev",
          "https://linkedin.com/in/syllayoussouf",
          "https://behance.net/syllayoussouf",
          "https://dribbble.com/syllayoussouf",
          "https://maps.google.com/?q=Sylla+Youssouf+Abidjan",
        ],
        knowsAbout: [
          "Développement Web Full Stack",
          "Next.js",
          "React",
          "Laravel",
          "Django",
          "TypeScript",
          "PostgreSQL",
          "Design UI/UX",
          "Direction Artistique",
          "Figma",
          "Branding & Identité Visuelle",
          "Montage Vidéo",
          "Automatisation IA",
          "Workflows n8n",
          "Publicité Facebook Ads",
          "SEO Technique & GEO",
        ],
      },

      // 2. Entreprise / Service Professionnel Local (ProfessionalService)
      {
        "@type": "ProfessionalService",
        "@id": "https://syllayoussouf.com/#service",
        name: "Sylla Youssouf - Communication Digitale & Web",
        image: "https://syllayoussouf.com/sylla.jpg",
        url: "https://syllayoussouf.com",
        telephone: "+225 05 94 56 49 93",
        priceRange: "50 000 FCFA - 550 000 FCFA",
        currenciesAccepted: "XOF",
        paymentAccepted: "Mobile Money (Wave, Orange Money, MTN MoMo), Virement bancaire, Espèces",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Abidjan",
          addressRegion: "Lagunes",
          addressCountry: "CI",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 5.3484,
          longitude: -4.0135,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "08:30",
            closes: "19:00",
          },
        ],
        areaServed: [
          {
            "@type": "City",
            name: "Abidjan",
          },
          {
            "@type": "Country",
            name: "Côte d'Ivoire",
          },
          {
            "@type": "AdministrativeArea",
            name: "Afrique de l'Ouest",
          },
          {
            "@type": "AdministrativeArea",
            name: "International (Télétravail)",
          },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services & Solutions Numériques",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Développement Web Full Stack & SaaS",
                description: "Conception de sites vitrines, applications web sur-mesure et plateformes SaaS en Next.js, React et Laravel.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Design UI/UX & Graphique",
                description: "Création d'identités visuelles complètes, maquettes haute fidélité Figma, logos vectoriels et supports print.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Stratégie de Communication Digitale & Facebook Ads",
                description: "Campagnes sponsorisées ciblées, configuration Pixel Meta et plans d'acquisition WhatsApp.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatisation IA & Workflows n8n",
                description: "Automatisation de la capture de leads, alertes WhatsApp instantanées et synchronisations CRM.",
              },
            },
          ],
        },
      },

      // 3. Site Web (WebSite)
      {
        "@type": "WebSite",
        "@id": "https://syllayoussouf.com/#website",
        url: "https://syllayoussouf.com",
        name: "Sylla Youssouf - Communication Digitale & Web",
        description:
          "Portfolio officiel et plateforme de services de Sylla Youssouf : expert en communication digitale, design UI/UX et développement web & mobile à Abidjan.",
        publisher: {
          "@id": "https://syllayoussouf.com/#person",
        },
        inLanguage: "fr-FR",
      },

      // 4. Données structurées FAQ (FAQPage pour Google & Moteurs IA)
      {
        "@type": "FAQPage",
        "@id": "https://syllayoussouf.com/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Qui est Sylla Youssouf ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sylla Youssouf est un Creative Engineer, Designer UI/UX et Développeur Web Full Stack basé à Abidjan, Côte d'Ivoire. Il accompagne les entreprises, startups et professionnels dans la création d'identités visuelles percutantes, le développement de sites web & plateformes performantes (Next.js, Laravel, React) et l'automatisation de processus métier avec l'IA et n8n.",
            },
          },
          {
            "@type": "Question",
            name: "Quels services propose Sylla Youssouf à Abidjan ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "À Abidjan et à l'international, Sylla propose des solutions digitales de bout en bout : création d'identités de marque et chartes graphiques, conception de sites vitrines et e-commerce optimisés mobile, développement d'applications web métier (SaaS, back-office), campagnes publicitaires ciblées (Facebook Ads, Meta Pixel) et automatisation de flux de travail (n8n, CRM, alertes WhatsApp).",
            },
          },
          {
            "@type": "Question",
            name: "Combien coûte la création d'un site web ou d'une identité visuelle en Côte d'Ivoire ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Les tarifs débutent à partir de 50 000 FCFA pour des prestations à la carte (création de logo, campagne Facebook Ads, workflow n8n) et à partir de 75 000 FCFA pour les packs clés en main (Pack Starter Lancement). Les formules complètes vont de 140 000 FCFA (Présence Pro) à 260 000 FCFA (E-Commerce). Pour les projets d'envergure ou supérieurs à 300 000 FCFA, un devis précis sur-mesure est établi gratuitement sous 24h après étude du cahier des charges.",
            },
          },
          {
            "@type": "Question",
            name: "Comment travailler avec Sylla Youssouf à distance ou à Abidjan ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "La collaboration s'effectue en toute fluidité soit en présentiel à Abidjan, soit à distance pour des clients en Côte d'Ivoire ou à l'international. Les échanges s'organisent via WhatsApp (+225 05 94 56 49 93), visio (Google Meet) ou par le formulaire de contact du site. Chaque projet suit un planning rigoureux : brief stratégique sous 24h, maquette interactive Figma pour validation visuelle, développement avec lien de suivi en direct et livraison clé en main avec formation.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
