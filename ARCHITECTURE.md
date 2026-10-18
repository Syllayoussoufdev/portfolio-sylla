# Architecture Technique — Portfolio Sylla

Ce document détaille l'organisation architecturale du projet **Portfolio Sylla**, basée sur les exigences du PRD et l'état d'avancement technique réel du dépôt.

---

## 1. Vue d'Ensemble & Principes Directeurs

* **Fullstack Next.js App Router :** Utilisation des Server Components par défaut pour les performances, le SEO et la sécurité, combinés à des Client Components pour l'interactivité (filtres, animations Framer Motion).
* **Base de données Serverless :** PostgreSQL hébergé sur Neon.tech, piloté via Prisma ORM 7 avec séparation stricte des flux de requêtes :
  * Connexion **poolée** (`DATABASE_URL`) pour l'exécution applicative (Server Actions / API).
  * Connexion **directe** (`DATABASE_URL_UNPOOLED`) pour les opérations de schéma et migrations CLI.
* **Séparation étanche Admin / Public :** Les routes `/admin/*` sont protégées en amont par middleware et vérifications côté serveur.

---

## 2. Structure Réelle du Dépôt

```text
portfolio-sylla/
├── app/
│   ├── (public)/                 [À implémenter - Routes publiques]
│   │   ├── page.tsx              [Existant - Page d'accueil racine]
│   │   ├── projets/              [À implémenter - Grille complète]
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx   [À implémenter - Page détail]
│   │   ├── [profil]/             [À implémenter - Sous-portfolios filtrés]
│   │   │   └── page.tsx
│   │   └── contact/              [À implémenter - Formulaire contact]
│   ├── admin/                    [À implémenter - Back-office privé]
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── projets/
│   │   ├── portfolios/
│   │   └── analytics/
│   ├── api/                      [À implémenter si nécessaire pour webhooks/auth]
│   ├── generated/
│   │   └── prisma/               [Existant - Client Prisma 7 généré localement]
│   ├── favicon.ico               [Existant]
│   ├── globals.css               [Existant - Tailwind CSS v4]
│   └── layout.tsx                [Existant - Root layout Next.js]
├── lib/
│   └── prisma.ts                 [Existant - Singleton PrismaClient avec PrismaNeon]
├── prisma/
│   └── schema.prisma             [Existant - Schéma des 5 modèles validé et synchronisé]
├── .env                          [Existant - Secrets locaux protégés par .gitignore]
├── .env.example                  [Existant - Modèle public de configuration]
├── .gitignore                    [Existant - Règle .env* et exclusions de build]
├── next.config.ts                [Existant - Configuration Next.js]
├── package.json                  [Existant - Dépendances Next.js 16, React 19, Prisma 7]
├── prisma.config.ts              [Existant - Configuration Prisma CLI v7]
├── tsconfig.json                 [Existant - Alias @/* pointant vers ./*]
├── PRD.md                        [Existant - Cahier des charges de référence]
├── ARCHITECTURE.md               [Ce document]
├── SECURITY.md                   [Existant - Règles de sécurité]
└── DESIGN.md                     [Existant - Charte visuelle et UI]
```

---

## 3. Matrice d'État des Composants

### A. Composants Techniques Existants & Fonctionnels ✅

| Composant | Fichier / Emplacement | Description & Rôle |
| :--- | :--- | :--- |
| **Config CLI Prisma 7** | `prisma.config.ts` | Charge `dotenv/config` et mappe `DATABASE_URL_UNPOOLED` pour la CLI. |
| **Schéma de données** | `prisma/schema.prisma` | Modèles `Project`, `SubPortfolio`, `SubPortfolioProject`, `Visit`, `ContactMessage`. Sans attribut `url` conformément à Prisma 7. |
| **Client Prisma** | `lib/prisma.ts` | Client singleton avec adaptateur WebSocket serverless `@prisma/adapter-neon` (`PrismaNeon`). |
| **Synchronisation BDD** | Console Neon PostgreSQL | Base synchronisée (`prisma db push` validé). |
| **Types générés** | `app/generated/prisma/` | Types et modèles TypeScript générés et vérifiés (`tsc --noEmit` validé sans erreur). |
| **Design System & Polices** | `app/globals.css`, `app/layout.tsx` | Variables CSS (DESIGN.md v2), utilitaire `.glass`, polices Bebas Neue, Geist, Caveat. |
| **Sécurité & Session Admin** | `lib/auth.ts`, `middleware.ts` | Session JWT HttpOnly `jose`, protection `/admin/*`, redirection `/admin/login`. |
| **Dashboard Back-office** | `app/admin/(dashboard)/` | Shell avec sidebar, statut Neon BDD, métriques réelles (`count()` Prisma). |
| **CRUD Projets** | `app/admin/actions/projects.ts`, `app/admin/(dashboard)/projets/` | Création, édition, suppression, bascule visibilité, tags, links JSON. |
| **Générateur Sous-portfolios** | `app/admin/actions/subportfolios.ts`, `app/admin/(dashboard)/portfolios/` | Killer feature : création de slugs `/[profil]`, sélection multi-projets, activation. |
| **Analytics & Messages Admin** | `app/admin/(dashboard)/analytics/`, `app/admin/(dashboard)/messages/` | Vue des visites sans cookies et consultation/gestion des messages reçus. |

### B. Composants Reste à Implémenter ⏳

#### 1. Couche Présentation Publique (Phase 2)
* **Hero Section & Présentation :** Accroche 5 secondes en Bebas Neue, photo détourée sticker, polaroids, badges `Engineer` / `Design`, CTA direct.
* **Moteur de filtrage côté client :** Grille de projets avec tags instantanés sans rechargement.
* **Route dynamique `/[profil]` :** Récupération serveur des projets liés au slug de sous-portfolio avec fallback 404 si inactif.
* **Page Projet (`/projets/[slug]`) :** Rendu markdown/HTML du contenu détaillé, galerie responsive et liens externes (Figma, GitHub, Démo, Vidéo).
* **Formulaire de contact public :** Formulaire sur carte de verre `.glass` avec retour visuel.

#### 2. Services Tiers & Données (Phase 3)
* **Envoi de mail (`actions/contact.ts`) :** Client Resend pour router les messages reçus vers la boîte de réception de Sylla tout en consignant l'entrée dans la table `ContactMessage`.
* **Logger de visite anonyme (`lib/analytics.ts`) :** Enregistrement des visites avec hachage non réversible de l'adresse IP (`SHA-256(ip + SECRET_SALT)`) pour respecter le RGPD sans cookies.
* **Intégration Cloudinary :** Upload d'images direct depuis l'admin (actuellement géré par URL directe).

---

## 4. Flux de Données

```text
[ Visiteur / Recruteur ] 
       │
       ▼ (Requête HTTP)
[ Route /[profil] ] ── Server Component ──► [ lib/prisma.ts ] ── (Pooler Neon) ──► [ Neon Postgres ]
       │                                            │
       ▼                                            ▼
[ Rendu HTML optimisé ] ◄───────────────── [ Projets filtrés ]
       │
       └── Log de visite asynchrone ──────► [ Table Visit ] (IP anonymisée par hash)
```

---

## 5. Décisions d'Architecture Validées

1. **Prisma 7 sans `url` dans schema.prisma :** La CLI lit `prisma.config.ts` qui pointe vers `DATABASE_URL_UNPOOLED` ; l'application au runtime instancie `PrismaNeon` avec `DATABASE_URL`.
2. **Pas de microservices :** Monolithe modulaire Next.js App Router complet déployable en un clic sur Vercel à coût zéro.
3. **Table de jointure explicite (`SubPortfolioProject`) :** Permet d'ordonner spécifiquement les projets au sein d'un sous-portfolio via la colonne `ordre`, plutôt qu'une simple relation implicite.
