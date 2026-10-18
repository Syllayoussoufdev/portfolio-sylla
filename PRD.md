# PRD — Portfolio Dynamique Multi-casquettes

**Auteur :** Sylla Youssouf  
**Version :** V0 — MVP  
**Stack de référence :** Next.js 14+ (App Router, TypeScript) — *Environnement actuel : Next.js 16 / React 19*  
**Date :** Octobre 2026  

---

## 1. Vision & Positionnement

### Positionnement clé
La double compétence **créative (design, vidéo, IA) + technique (développement web)** constitue l'avantage différenciateur majeur de Sylla Youssouf. Le portfolio ne doit pas se limiter à une liste statique de réalisations : il doit incarner et prouver visuellement et techniquement cette maîtrise hybride.

### Domaines de compétences couverts (6 casquettes)
1. **Design Graphique** : Affiches, logos, identités visuelles — liens Canva, Google Drive, Figma ou fichiers directs.
2. **Branding & Stratégie Com** : Études de cas documentées, guidelines de marque, plans de communication (PDF, case studies).
3. **Cadrage & Montage Vidéo** : Lecteurs vidéo embarqués ou liens YouTube/Vimeo, vignettes dynamiques cliquables.
4. **Design UI/UX & Motion** : Maquettes interactives Figma, prototypes, micro-animations, prévisualisations embarquées.
5. **IA Product Creator** : Projets générés ou automatisés par IA, documentation des prompts, outils et résultats concrets.
6. **Développement Web** : Applications et sites clients en production, projets personnels, liens GitHub et démonstrations interactives en direct.

### Utilisateurs cibles
* **Recruteur / DRH** : Parcours ultra-rapide ; accède directement à une sélection de réalisations filtrées selon le poste convoité via un sous-lien dédié.
* **Agence / Client freelance** : Consultation ciblée des projets pertinents pour leur secteur avec prise de contact directe et simplifiée.
* **Sylla Youssouf (Admin)** : Back-office centralisé pour piloter les projets, configurer des sous-portfolios sur-mesure et suivre la fréquentation.

---

## 2. Fonctionnalités V0 (Périmètre MVP)

### A. Front-end public (Portfolio visible)
1. **Accueil impactant (`/`) :**
   * Hero header avec proposition de valeur forte.
   * Résumé du profil assimilable en 5 secondes.
   * Animation fluide et subtile au scroll / survol.
   * Call To Action (CTA) de contact visible dès le premier écran.
2. **Grille de projets filtrable (`/projets`) :**
   * Présentation de tous les projets avec tags de compétences.
   * Filtrage fluide côté client par domaine ou technologie.
   * Carte projet : miniature/cover, titre, catégorie, résumé, liens directs.
3. **Page détail projet (`/projets/[slug]`) :**
   * Fiche détaillée : contexte, problématique, solution apportée, galerie médias, technologies/outils utilisés.
   * Liens externes intégrés (Canva, Figma, Drive, GitHub, Live demo, Vidéo).
4. **Sous-portfolios dynamiques (`/[profil]`) — *Killer Feature* :**
   * Route personnalisée (ex. `/design`, `/dev`, `/video`).
   * Vue filtrée sur une sélection précise de projets configurée depuis l'admin.
   * Permet d'envoyer un lien sur-mesure à un prospect ou recruteur précis.
5. **Section Compétences :**
   * Visualisation claire des 6 domaines avec icônes représentatives et niveau d'expertise (sans barres de pourcentage arbitraires).
6. **Formulaire de contact épuré (`/contact`) :**
   * 3 champs essentiels : Nom, Email, Message.
   * Traitement et envoi par email via l'API Resend.
7. **Footer persistant :**
   * Liens vers les réseaux sociaux, email direct et lien WhatsApp direct.

### B. Dashboard back-office (Accès Admin sécurisé)
1. **Gestion des projets (`/admin/projets`) :**
   * CRUD complet (Créer, Lire, Mettre à jour, Supprimer, Masquer/Afficher).
   * Gestion de l'ordre d'affichage, assignation des tags, saisie des liens JSON et URL d'image de couverture.
2. **Générateur de sous-portfolios (`/admin/portfolios`) :**
   * Création d'un slug dédié (ex. `design`, `dev`, `motion`).
   * Sélection par cases à cocher des projets associés (relation `SubPortfolioProject`).
   * Activation / désactivation du lien en un clic.
3. **Analytics légères & respectueuses (`/admin/analytics`) :**
   * Compteur de visites global et ventilation par sous-portfolio / page.
   * Solution 100% sans cookies tiers, respectueuse de la vie privée.
   * Règle de confidentialité : aucune adresse IP stockée en clair (hachage anonymisé).

---

## 3. Architecture des routes

| Route | Description | Visibilité |
| :--- | :--- | :--- |
| `/` | Portfolio complet — accueil avec tous les domaines | Public |
| `/projets` | Grille complète des projets avec filtres | Public |
| `/projets/[slug]` | Page de détail d'un projet spécifique | Public |
| `/[profil]` | Sous-portfolio filtré dynamique (ex: `/design`, `/dev`) | Public |
| `/contact` | Formulaire de contact | Public |
| `/admin` | Redirection vers le tableau de bord | Authentification requise |
| `/admin/projets` | CRUD et organisation des projets | Authentification requise |
| `/admin/portfolios` | Création et paramétrage des sous-portfolios | Authentification requise |
| `/admin/analytics` | Consultation des statistiques de visite | Authentification requise |

---

## 4. Stack technique & Hébergement

* **Framework :** Next.js (App Router) + TypeScript
* **UI / Styling :** Tailwind CSS + composants shadcn/ui
* **Animations :** Framer Motion
* **Base de données :** PostgreSQL Serverless (Neon.tech)
* **ORM :** Prisma ORM 7 (`@prisma/adapter-neon` via WebSockets / connection pooler)
* **Authentification Dashboard :** NextAuth.js / Auth.js (Credentials sécurisés solo admin)
* **Envoi d'emails :** Resend API (quota gratuit de 3 000 emails/mois)
* **Stockage médias :** Cloudinary Free Tier (25 Go de stockage et bande passante)
* **Hébergement :** Vercel (Hobby plan gratuit)
* **Nom de domaine :** `syllayoussouf.com` (~10 $/an)

---

## 5. Roadmap de construction

* **Phase 0 — Setup & Structure :** Initialisation du repo, intégration Tailwind/shadcn, configuration de Prisma 7 avec Neon (connexions poolée/unpooled), schémas et typages.
* **Phase 1 — Dashboard Admin :** Authentification, CRUD projets, gestion des liaisons de sous-portfolios.
* **Phase 2 — Front-end public :** Hero section, grille filtrable, détail projet, route dynamique `/[profil]`.
* **Phase 3 — Analytics & Contenu réel :** Tracking anonymisé sans cookies, intégration Resend, saisie des projets réels de Sylla.
* **Phase 4 — Évolutions futures (V1) :** Améliorations progressives post-lancement.

---

## 6. Hors périmètre V0 (Exclusions explicites)

* Multi-utilisateurs / gestion de rôles complexes (uniquement Sylla en administrateur unique).
* Paiement en ligne ou boutique e-commerce.
* Sous-domaines DNS personnalisés (ex: `design.syllayoussouf.com` remplacé par les sous-dossiers natifs `/[profil]`).
* Intégration Google Analytics tierce lourde (remplacée par le compteur interne respectueux).
* Blog complet avec CMS éditorial.
* Mode sombre/clair commutable par le visiteur (Dark theme par défaut en V0).
* Notifications push et flux automatisés complexes.

---

## 7. Informations restant à préciser / Clarifications attendues

* **Gestion du compte Admin en BDD :** Le PRD mentionne NextAuth Credentials avec mot de passe hashé, mais le schéma Prisma convenu pour V0 exclut le modèle `User` en attendant la décision d'architecture (variables d'environnement pures vs table dédiée).
* **Format des galeries médias :** Préciser si les galeries de la page projet gèrent des vidéos natives hébergées sur Cloudinary ou uniquement des embeds (YouTube / Vimeo / Figma iframe).
* **Gestion du taux de rafraîchissement des analytics :** Intervalle d'agrégation souhaité (compteur temps réel brut ou rollup journalier).
