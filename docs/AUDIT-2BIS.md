# AUDIT-2BIS — État Réel du Projet & Analyse Préparatoire (Phase 2bis)

**Date :** 18 octobre 2026  
**Branche Git de travail :** `refonte/phase-2bis`  
**Branche Git d'archive :** `archive/refonte-1`  
**Auteur :** Antigravity pour Sylla Youssouf  

---

## 1. Versions Installées & Dépendances

| Dépendance | Version Déclarée | Rôle | Compatibilité |
| :--- | :--- | :--- | :--- |
| **Next.js** | `16.4.2` (Turbopack) | Framework App Router | Moderne, routes Server Actions & proxy |
| **React** | `19.3.0` | Bibliothèque UI | React 19 (règles strictes d'effets) |
| **React-DOM** | `19.3.0` | Moteur de rendu | React 19 |
| **Prisma ORM** | `7.10.1` | ORM serveur | `@prisma/adapter-neon` via WebSocket pooler |
| **Tailwind CSS** | `4.0.0` | Moteur CSS | Tailwind v4 via `@import "tailwindcss";` |
| **GSAP** | `3.15.0` | Animations séquentielles | Déjà installé |
| **Three.js** | `0.186.1` | Moteur 3D WebGL | Déjà installé avec `@types/three` (`0.186.0`) |
| **Motion** | `14.3.0` | Animations layout | Présent, à retirer en étape 5 |
| **Lucide React** | `1.59.0` | Bibliothèque d'icônes | Cohérente sur l'ensemble de l'UI |
| **Zod** | `4.6.7` | Validation de schémas | Présent |
| **Bcryptjs** | `3.0.3` | Hachage mots de passe | Dashboard admin |
| **Jose** | `6.2.12` | Jetons JWT session | Authentification HttpOnly |

---

## 2. Résumé du Schéma Prisma Actuel (`prisma/schema.prisma`)

* **`Project`** :
  - `id` (String CUID, PK)
  - `titre` (String)
  - `slug` (String unique)
  - `description` (Text)
  - `contenu` (Text optionnel, étude de cas)
  - `coverImage` (String optionnel — URL externe libre actuellement)
  - `links` (Json, `{ demo, github, figma, canva, drive, video, gallery }`)
  - `tags` (String[])
  - `ordre` (Int, default 0)
  - `visible` (Boolean, default true)
  - `featured` (Boolean, default false)
  - `createdAt`, `updatedAt`
  - Relations : `subPortfolios` (`SubPortfolioProject[]`), `visits` (`Visit[]`)
* **`SubPortfolio`** :
  - `id`, `slug` (unique), `label`, `description`, `actif` (Boolean), `createdAt`, `updatedAt`
  - Relation : `projects` (`SubPortfolioProject[]`), `visits` (`Visit[]`)
* **`SubPortfolioProject`** :
  - Jointure `subPortfolioId`, `projectId`, `ordre`
* **`Visit`** :
  - `id`, `path`, `projectId`?, `subPortfolioId`?, `ip`?, `userAgent`?, `createdAt`
* **`ContactMessage`** :
  - `id`, `nom`, `email`, `message`, `lu` (Boolean), `createdAt`

> **Note d'évolution Phase 2bis :** Les modèles `Media`, `ProjectMedia` et `Profile` ne sont pas encore créés. Ils seront introduits lors des étapes 1 et 2 sous forme de **migrations strictement additives**.

---

## 3. Carte des Routes & Composants

### 3.1 Routes Publiques
- **`/` (`app/page.tsx`)** : Page d'accueil assemblant Hero, Projets, Compétences, À propos, Contact, Footer.
- **`/projets` (`app/projets/page.tsx`)** : Grille filtrable de toutes les réalisations visibles.
- **`/projets/[slug]` (`app/projets/[slug]/page.tsx`)** : Fiche détaillée d'un projet, étude de cas, liens et Lightbox.
- **`/[profil]` (`app/[profil]/page.tsx`)** : Sous-portfolio dynamique filtré d'après `SubPortfolio` dans Neon.
- **`/contact` (`app/contact/page.tsx`)** : Formulaire dédié de prise de contact.
- **`/_not-found` (`app/not-found.tsx`)** : Page 404 sur-mesure.

### 3.2 Routes du Dashboard Admin (`/admin`)
- Protégées par le middleware de session JWT (`lib/auth.ts`, cookie `admin_session`).
- **`/admin/login`** : Connexion par e-mail et mot de passe haché bcrypt.
- **`/admin`** : Vue d'ensemble et métriques.
- **`/admin/projets`**, `/admin/projets/nouveau`, `/admin/projets/[id]` : Gestion CRUD des projets.
- **`/admin/portfolios`**, `/admin/portfolios/nouveau`, `/admin/portfolios/[id]` : Gestion des sous-portfolios.
- **`/admin/messages`** : Boîte de réception des messages.
- **`/admin/analytics`** : Consultation des visites anonymisées.

### 3.3 Emplacement des Composants UI
- **Hero :** `components/Hero.tsx` et `components/HeroCanvas3D.tsx` (canevas 3D Three.js).
- **Projets :** `components/ProjectsGrid.tsx` et `components/ProjectCard.tsx`.
- **Détail & Galerie :** `components/ProjectLightbox.tsx`.
- **Compétences :** `components/SkillsSection.tsx`.
- **À propos :** `components/AboutSection.tsx`.
- **Contact :** `components/ContactSection.tsx` relié à la Server Action `app/actions/contact.ts`.
- **Header :** `components/Navbar.tsx`.
- **Footer :** `components/Footer.tsx`.
- **Icônes vectorielles :** `components/icons.tsx` (GitHub, Figma, Canva, Drive, YouTube).

---

## 4. Gestion des Images : État des Lieux

- **Stockage actuel :** Le modèle `Project` possède uniquement un champ `coverImage` de type `String?`.
- **Saisie actuelle :** Dans `ProjectForm.tsx`, un simple champ texte `<input name="coverImage" type="url">` demande de coller une URL externe.
- **Galerie actuelle :** Gérée sous forme de chaîne JSON brute dans `links.gallery`.
- **Limites critiques :**
  - Pas de vérification des dimensions ni du poids de l'image.
  - Dépendance à des hébergeurs tiers non garantis (Unsplash, liens directs).
  - Absence de texte alternatif (`alt`) dédié dans le modèle.
  - Risque de décalage de mise en page (CLS) par manque de dimensions intrinsèques.

---

## 5. Commits Git de Référence

- **`5c26188`** : `Phase 1 API OK Debut de phase 2 Front` — Fin de la phase 1 (Back-office validé).
- **`84deb60`** : `chore: etat avant phase 2bis` — Sauvegarde de l'état fonctionnel complet (Front-end avec les 5 sections, routes `/[profil]`, `/projets`, `/contact`, page détail `/projets/[slug]`, Three.js et GSAP).
- **Branches de référence :** `archive/refonte-1` (branche de secours intouchable) et `refonte/phase-2bis` (branche active pour les étapes 1 à 9).

---

## 6. Inventaire du Contenu Non Vérifié / Inventé à Retirer

Conformément à la règle d'honnêteté du PRD v3, les mentions suivantes ont été relevées dans le code actuel et devront être remplacées par des variables pilotées depuis la base de données :

1. **Dans le Hero :**
   - « Disponible pour opportunités & collaborations » $\rightarrow$ doit être un champ optionnel du profil (`Profile.hero`).
   - « Code certifié & déployé » $\rightarrow$ à supprimer.
2. **Dans la section À propos :**
   - « Profil vérifié » $\rightarrow$ à supprimer.
3. **Dans la section Contact & Footer :**
   - Numéro WhatsApp fictif `+33 6 00 00 00 00` $\rightarrow$ à remplacer par une variable du profil ou à omettre s'il n'est pas renseigné.
   - Adresse e-mail en dur `contact@syllayoussouf.com` $\rightarrow$ à lier aux variables du profil ou à l'adresse de contact configurée.

---

## 7. Risques & Points de Vigilance Techniques

1. **React 19 & Compatibilité R3F / Drei :**  
   React 19 exige les versions les plus récentes de React Three Fiber (v9) et Drei (v10). Le composant 3D Three.js pur déjà mis en place dans `components/HeroCanvas3D.tsx` fonctionne parfaitement avec React 19 sans nécessiter de wrapper lourd. L'utilisation de R3F sera testée à l'étape 5 en vérifiant scrupuleusement la compatibilité.
2. **Téléversement direct Cloudinary sans passer par le serveur :**  
   Les Serverless Functions Vercel limitent la charge utile à 4,5 Mo. L'envoi doit se faire directement depuis le navigateur du dashboard vers l'API Cloudinary via signature HMAC SHA-1 générée par le serveur (`/api/admin/media/sign`). Le secret d'API ne doit jamais être exposé côté client.
3. **Migrations Neon additives :**  
   Toutes les modifications du schéma Prisma (`Media`, `Profile`, `ProjectMedia`) doivent être strictement additives pour préserver les projets déjà enregistrés dans la base.
4. **Slugs réservés :**  
   Le routeur dynamique `/[profil]` doit rejeter systématiquement les slugs statiques (`admin`, `projets`, `contact`, `api`, etc.) pour éviter tout conflit de routage.

---

## 8. Conclusion de l'Étape 0

L'audit est complet. Le projet est propre, le code actuel est sauvegardé dans `archive/refonte-1`, la branche de travail `refonte/phase-2bis` est active, et aucun fichier fonctionnel n'a été altéré.

Nous sommes prêts pour l'**Étape 1 : Téléversement direct des images (Cloudinary)** dès validation.
