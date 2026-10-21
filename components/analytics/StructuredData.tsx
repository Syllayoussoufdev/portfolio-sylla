import React from "react";

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://syllayoussouf.com/#person",
        name: "Sylla Youssouf",
        url: "https://syllayoussouf.com",
        jobTitle: "Chargé de communication digitale, Designer graphique & Développeur Full-Stack",
        description:
          "Expert en communication digitale, direction artistique, motion design et développement d'applications web & mobiles.",
        image: "https://syllayoussouf.com/sylla.jpg",
        sameAs: [
          "https://github.com/Syllayoussoufdev",
          "https://linkedin.com",
        ],
        knowsAbout: [
          "Développement Web",
          "Next.js",
          "React",
          "Laravel",
          "TypeScript",
          "Design Graphique",
          "Direction Artistique",
          "Figma",
          "Motion Design",
          "Montage Vidéo",
          "IA Product Creation",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://syllayoussouf.com/#website",
        url: "https://syllayoussouf.com",
        name: "Sylla Youssouf — Portfolio & Réalisations",
        description:
          "Portfolio officiel de Sylla Youssouf : projets en développement web, design graphique, montage vidéo et communication digitale.",
        publisher: {
          "@id": "https://syllayoussouf.com/#person",
        },
        inLanguage: "fr-FR",
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
