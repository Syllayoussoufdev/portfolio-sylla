# PRD — Portfolio Dynamique Multi-profils (v3)

**Auteur :** Sylla Youssouf · **Version :** V0 étendue · **Date :** 18 octobre 2026
**Remplace :** PRD v2 (« Portfolio Dynamique Multi-casquettes »).

> **Pour l'agent de code.** Ce document décrit le produit. `DESIGN.md` décrit le rendu. `ROADMAP.md` décrit l'ordre de travail et les règles d'exécution. En cas de conflit : le PRD gagne sur le périmètre fonctionnel, `DESIGN.md` sur le visuel, `ROADMAP.md` sur la méthode.
> **Avant toute modification :** inspecte le code réel (schéma Prisma, routes, composants, `package.json`). Ce PRD indique l'intention ; les noms exacts de modèles et de champs existants sont à vérifier dans le projet, jamais à supposer.

---

## 1. Vision et positionnement

- **Identité principale :** expert en communication digitale et graphiste créatif.
- **Identité complémentaire :** développeur web et mobile, présenté comme *concepteur de solutions numériques* : la personne qui sait imaginer et aussi livrer.
- **Le site est lui-même une preuve :** il doit montrer de la créativité visuelle et de la rigueur technique.
- **Un seul site, plusieurs lectures.** Chaque public (recruteur design, agence, client, recruteur tech) voit un portfolio adapté : message, ordre des sections, projets visibles et habillage visuel.

**Règle d'honnêteté (non négociable).** Aucun chiffre, badge, certification, promesse de délai, nom de client ou résultat n'est inventé. Tout élément affiché vient de la base de données ou d'un champ renseigné par l'administrateur. Un contenu manquant donne un état vide propre, jamais un faux contenu.

## 2. Utilisateurs

| Utilisateur | Besoin | Ce qu'il reçoit |
|---|---|---|
| Recruteur / RH | Comprendre le profil en quelques secondes | Un lien dédié (`/design`, `/dev`…) avec uniquement les projets pertinents |
| Agence / client | Voir des réalisations dans son domaine et contacter | Un portfolio ciblé et un formulaire simple |
| Administrateur (Sylla) | Tout gérer sans toucher au code | Un dashboard : projets, médias, profils, messages, statistiques |

## 3. Concept central : Profil + Template

- **Profil** = un jeu de contenus lié à une URL : textes du Hero, boutons, visuel, sections visibles et leur ordre, projets affichés, variables, SEO. Entièrement modifiable depuis le dashboard.
- **Template** = un habillage : composition, couleurs, typographie, animations, 3D. Le code en fournit trois ; la base ne stocke que leur clé.
- **Un profil utilise un template.** Changer de template ne change aucun contenu.

| Clé | Nom | Rôle |
|---|---|---|
| `creatif` | Créatif (verre givré bleu/orange) | Template par défaut de `/`. Communication digitale et graphisme en premier |
| `developpeur` | Développeur | Version actuelle conservée et enrichie. Pour `/dev` |
| `immersif` | Immersif | Nouveau. Plus sombre, avec la 3D comme élément central |

Exemples : `/` → profil par défaut (`creatif`) · `/dev` → `developpeur` · `/design` → `creatif` avec Hero « design graphique » · `/video` → `immersif` ou `creatif`, au choix.

## 4. Fonctionnalités

### 4.1 Front-end public
- **Header** : navigation Accueil · Projets · Compétences · À propos · Contact, bouton d'action orienté conversion, menu mobile accessible. Réagit au défilement (voir `DESIGN.md`).
- **Hero piloté par le profil** : titre, sous-titre, accroche, deux boutons, visuel. Un appel à l'action visible sans défiler sur desktop.
- **Projets sélectionnés** puis page `/projets` : grille filtrable par domaine, cartes avec grande image de couverture.
- **Page projet** `/projets/[slug]` : étude de cas, liens (Canva, Figma, Drive, GitHub, démo), technologies, galerie avec lightbox, vidéo YouTube/Vimeo intégrée.
- **Compétences** : groupes d'outils et de domaines, sans pourcentage.
- **À propos et méthode de travail** : concis, factuel.
- **Contact** : formulaire 3 champs (nom, e-mail, message), validation, anti-spam, envoi par e-mail et enregistrement en base.
- **Footer persistant** : réseaux, WhatsApp, e-mail, liens légaux.
- **Sous-portfolios** `/[profil]` : même qualité que l'accueil, projets filtrés.
- **Mouvement** : animations au défilement et au survol, effets 3D réactifs, par template (voir `DESIGN.md`).

### 4.2 Back-office (existant, étendu par ajout uniquement)
- Projets : créer, modifier, masquer, supprimer, ordonner ; **téléverser** couverture et galerie.
- **Médiathèque** (nouveau) : voir, réutiliser, supprimer les images téléversées.
- **Profils** (nouveau) : formulaire du Hero, choix du template avec aperçu, sections (visibilité, ordre), projets affichés, variables, SEO, activation.
- Sous-portfolios : liste, URL, statut actif/inactif (existant).
- Messages reçus et statistiques de visites (existant).
- L'authentification et les routes d'administration existantes ne sont pas réécrites.

### 4.3 Variables d'offre (optionnel, fin de phase 2bis)
Un lien peut personnaliser le Hero : `/design?pour=Acme` remplace `{entreprise}` dans les textes du profil. La valeur est nettoyée (lettres, chiffres, espaces, tirets, 40 caractères maximum), affichée comme texte brut, jamais comme HTML.

## 5. Gestion des médias (images téléversées)

**Principe :** les **images se téléversent** depuis le dashboard ; les **liens** servent aux ressources externes (Canva, Figma, Drive, GitHub, YouTube, Vimeo). Un lien Drive ou Canva n'est pas une image affichable : l'image doit être téléversée.

- **Flux :** le navigateur demande une signature à une route admin protégée → l'image part **directement vers Cloudinary** (pas via le serveur Next.js : les fonctions Vercel ont une limite de corps de requête) → le navigateur renvoie à l'application l'identifiant public et les métadonnées → l'application les enregistre.
- **Le secret Cloudinary reste côté serveur.** Aucun preset « unsigned ».
- **Contrôles :** formats acceptés (JPEG, PNG, WebP, AVIF), taille maximale vérifiée côté client et côté serveur, **texte alternatif obligatoire**, dimensions enregistrées pour éviter les décalages de mise en page.
- **Livraison :** `next/image` avec transformations automatiques (`f_auto`, `q_auto`, largeurs adaptées). Aucune URL d'image externe arbitraire.
- **Vidéos :** jamais téléversées ; intégration YouTube (domaine `youtube-nocookie`) ou Vimeo par lien.
- **Compatibilité :** l'ancien champ d'URL d'image continue de s'afficher tant qu'un projet n'a pas de média téléversé. Un script de migration à sec (dry-run) peut ensuite récupérer les anciennes images dans Cloudinary.
- **Quota :** l'offre gratuite Cloudinary fonctionne en crédits mensuels, pas en Go séparés. Les images sont donc optimisées à l'envoi et à l'affichage.

## 6. Routes

| Route | Description | Accès |
|---|---|---|
| `/` | Profil par défaut, rendu avec son template | Public |
| `/projets` | Grille complète filtrable | Public |
| `/projets/[slug]` | Page projet | Public |
| `/contact` | Formulaire de contact | Public |
| `/[profil]` | Sous-portfolio dynamique, rendu avec son template | Public |
| `/mentions-legales`, `/confidentialite` | Pages légales | Public |
| `/admin/...` | Dashboard (projets, médias, profils, portfolios, messages, analytics) | Authentifié |
| `/api/admin/media/*` | Signature et suppression de médias | Authentifié |

**Slugs réservés** (refusés à la création d'un profil, pour éviter les conflits avec `/[profil]`) : `admin`, `api`, `projets`, `contact`, `competences`, `a-propos`, `login`, `connexion`, `mentions-legales`, `confidentialite`, `sitemap.xml`, `robots.txt`, `_next`, `favicon.ico`.
Un profil inconnu ou inactif renvoie une page 404.

## 7. Modèle de données

**Existant (à lire dans `schema.prisma`, ne pas supposer) :** `Project`, `SubPortfolio`, `Visit`, `ContactMessage`, tables d'authentification.

**Ajouts (migrations additives uniquement, testées sur une branche Neon) :**

```prisma
// Indicatif : adapter aux conventions et au Prisma 7 déjà en place.
model Media {
  id        String   @id @default(cuid())
  publicId  String   @unique
  url       String
  width     Int
  height    Int
  format    String
  bytes     Int
  alt       String
  createdAt DateTime @default(now())
}

model ProjectMedia {            // galerie ordonnée
  projectId String
  mediaId   String
  position  Int
  @@id([projectId, mediaId])
}

model Profile {
  id             String   @id @default(cuid())
  slug           String   @unique        // "default" pour la page /
  label          String
  template       String   @default("creatif")   // creatif | developpeur | immersif
  accent         String   @default("default")   // variante prévalidée du template
  hero           Json                           // validé par Zod
  sections       Json                           // [{ key, visible, order }]
  variables      Json?
  seoTitle       String?
  seoDescription String?
  heroMediaId    String?
  isDefault      Boolean  @default(false)
  active         Boolean  @default(true)
  subPortfolioId String?  @unique                // liaison avec le sous-portfolio existant
  updatedAt      DateTime @updatedAt
}
```

Le champ `Project` reçoit en plus un `coverMediaId` optionnel ; l'ancien champ d'image reste en place.

**Forme du JSON `hero` (validée par Zod) :** `headline`, `subline`, `tagline?`, `ctaPrimary { label, href }`, `ctaSecondary { label, href }`, `media { kind: "image" | "abstract", alt }`. Les statistiques éventuelles du Hero sont **calculées** depuis la base (nombre de projets publiés), jamais saisies à la main.

**Couleurs :** jamais de code hexadécimal libre. Le champ `accent` désigne une variante prévalidée (contraste vérifié) du template.

## 8. Stack et règles de versions

- **Conservé :** Next.js (App Router) + TypeScript, Tailwind CSS, Prisma 7 + Neon, NextAuth (credentials), Resend, Cloudinary, Vercel.
- **Animation :** GSAP + ScrollTrigger (+ SplitText, Flip), Lenis pour le défilement fluide. GSAP est désormais gratuit, plugins compris. **Une seule bibliothèque d'animation** : pas de nouvelle utilisation de Framer Motion ; la retirer si elle n'est plus utilisée.
- **3D :** Three.js via React Three Fiber v9 et drei v10, qui requièrent React 19. Si le projet est sur React 18, utiliser R3F v8 et drei v9, ou migrer proprement. L'agent **vérifie les versions installées avant d'ajouter** toute dépendance.
- Aucune dépendance ajoutée « pour décorer ». Chaque ajout est justifié dans le rapport d'étape.

## 9. Services, limites et coûts (vérifiés en octobre 2026)

| Service | Offre gratuite | À retenir |
|---|---|---|
| Neon | 1 Go par projet | Mise en veille après 5 min d'inactivité : première requête plus lente. Utiliser une **branche** pour le développement |
| Cloudinary | 25 crédits par mois | 1 crédit = 1 Go de stockage, ou 1 Go de bande passante, ou 1 000 transformations |
| Resend | 3 000 e-mails par mois, 100 par jour | Sans domaine vérifié : envoi depuis `onboarding@resend.dev` vers l'adresse du compte uniquement |
| Vercel Hobby | Gratuit | **Usage personnel non commercial.** Un portfolio qui sert à obtenir des missions payantes est en zone grise : trancher avant la mise en production (voir `ROADMAP.md`, étape 14) |
| Domaine | ~10 $/an | `syllayoussouf.com` (Namecheap ou Porkbun) |

## 10. Hors périmètre (V0)

Multi-utilisateurs, paiement, blog avec CMS, mode sombre/clair choisi par le visiteur, sous-domaines (`design.syllayoussouf.com`), Google Analytics, notifications push, téléversement de vidéos, éditeur de template visuel (glisser-déposer).

**Backlog V1 :** variables d'offre avancées, mode sombre, sous-domaines, statistiques enrichies, passage de la timeline Parcours en base de données.

## 11. Journal des changements (v2 → v3)

| Sujet | v2 | v3 |
|---|---|---|
| Positionnement | Développeur multi-casquettes | Communication digitale et graphisme d'abord, développeur concepteur de solutions ensuite |
| Contenu du Hero | Fixe dans le code | Piloté par la table `Profile`, modifiable dans le dashboard |
| Habillage | Un seul | Trois templates au choix par profil |
| Images | Liens saisis à la main | Téléversement direct vers Cloudinary, médiathèque, texte alternatif obligatoire |
| Animation | Framer Motion (PRD) puis GSAP | GSAP + Lenis uniquement, 3D en R3F |
| Mode sombre/clair | Hors périmètre | Hors périmètre (un thème par template) |
| Chiffres et badges | Parfois inventés par l'agent | Interdits sauf données réelles |
| Cloudinary | « 25 Go + 25 Go » | 25 crédits par mois |
| Neon | 512 Mo | 1 Go, mise en veille après 5 min |
| Resend | 3 000 par mois | Plafond de 100 par jour, restriction du domaine d'envoi |
| Vercel | « gratuit » | Non commercial : décision à prendre avant la production |
