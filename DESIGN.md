# Direction Visuelle & Système de Design — Portfolio Sylla (v2)

Ce document remplace la v1 (thème sombre zinc/émeraude). Il fixe le système de design du **Portfolio Dynamique Multi-casquettes** de Sylla Youssouf : direction « humaine », matière « verre givré », contraste bleu électrique / orange vif sur fond clair.

> **Pour l'agent de code :** ce fichier est la source de vérité visuelle. En cas de conflit avec `PRD.md` sur le périmètre fonctionnel, le PRD gagne. En cas de conflit sur le rendu, ce fichier gagne. Si un point est marqué « ouvert » (section 10), ne pas l'inventer : demander.

---

## 1. Philosophie

- **Positionnement :** « Creative Engineer » avec un visage. Le site doit montrer la rigueur d'un développeur **et** la spontanéité d'un créatif. Un recruteur doit sentir une personne, pas un template.
- **Matière :** verre givré posé sur des taches de couleur floutées, sur fond clair et aéré.
- **Ton :** chaleureux, direct, haut de gamme mais accessible. Phrases courtes, verbes simples, pas de jargon de vendeur.
- **Règle de retenue :** le **Hero** est le seul endroit où l'on dépense toute l'audace (photo détourée, doodles, titre XXL). Le reste du site reste calme et lisible. Si un effet ne sert pas la lecture, il est retiré.

---

## 2. Couleurs (thème clair unique en V0)

Pas de bascule sombre/clair en V0 (hors périmètre PRD).

| Rôle | Valeur | Usage |
|---|---|---|
| Fond principal | `#F9FAFB` | Arrière-plan des pages |
| Surface pleine | `#FFFFFF` | Fallback des cartes sans verre, formulaires |
| Verre | `rgba(255,255,255,0.55)` | Cartes givrées (voir section 4) |
| Bleu électrique | `#2563EB` | Liens, bordures actives, badges tech, titres d'accent |
| Orange vif | `#F97316` | CTA principal, surbrillances, doodles |
| Encre | `#0F172A` | Texte principal, texte posé sur orange |
| Gris texte | `#475569` | Texte secondaire (voir note contraste) |
| Gris trait | `#64748B` | Traits de liaison, icônes décoratives uniquement |
| Orbes | `#3B82F6` + `#FB923C` | Taches floutées en arrière-plan |

**Règles de contraste (obligatoires) :**
- Le texte secondaire sur verre utilise `#475569`, **pas** `#64748B` (qui descend sous 4,5:1 dès que le verre est teinté par un orbe).
- L'orange `#F97316` ne sert **jamais** de couleur de texte sur fond clair (contraste insuffisant). Texte sur bouton orange = encre `#0F172A`.
- Texte blanc autorisé uniquement sur le bleu `#2563EB`.
- Vérifier chaque combinaison à 4,5:1 minimum (3:1 pour le texte ≥ 24 px).

Définir ces valeurs en variables CSS dans `globals.css` (`--bg`, `--glass`, `--blue`, `--orange`, `--ink`, `--muted`) et les exposer à Tailwind. Aucune couleur en dur dans les composants.

---

## 3. Typographie

Quatre familles au maximum, chargées avec `next/font` (pas de `<link>` externe) :

| Rôle | Police | Règles |
|---|---|---|
| Titres XXL (Hero, grands titres de section) | **Bebas Neue** | Une seule graisse, majuscules natives. Jamais en corps de texte, jamais sous 32 px. |
| Interface et corps | **Geist Sans** (ou Inter) | `text-sm` à `text-base`, `leading-relaxed`, lignes de moins de 80 caractères. |
| Technique (slugs, tags, chiffres) | **Geist Mono** | Uniquement pour ce qui est réellement technique. |
| Annotations manuscrites | **Caveat** (ou équivalent) | Notes, étiquettes volantes, légendes de doodles. Jamais pour du contenu important. |

Échelle : Hero `clamp(4rem, 12vw, 11rem)` · H2 `text-3xl` à `text-5xl` (Bebas) · H3 `text-lg` à `text-xl` (Geist, semi-gras) · corps `text-base`.

Éviter : étiquettes en majuscules espacées au-dessus de chaque titre, numérotation décorative (01 / 02 / 03) hors des vraies séquences, un seul mot coloré dans chaque titre.

---

## 4. Matière « verre givré »

Recette de base (classe utilitaire `.glass`) :

```css
.glass {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

/* Fallback : navigateur sans backdrop-filter ou transparence réduite */
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: #fff; }
}
@media (prefers-reduced-transparency: reduce) {
  .glass { background: #fff; backdrop-filter: none; }
}
```

**Où l'utiliser :** cartes projets, cartes bento du Hero, carte de stats, formulaire de contact, en-tête flottant. **Pas ailleurs.** Du verre partout = plus de verre.

**Orbes d'ambiance :** 2 à 3 maximum par écran, en `radial-gradient` (pas de `filter: blur()` sur de grands éléments, trop coûteux sur mobile). Bleu en haut à gauche, orange en bas à droite, légèrement décalés d'une page à l'autre. Statiques par défaut.

**Variation de rayon :** 20 px pour les cartes, 12 px pour les badges et inputs, 999 px pour les boutons. Pas un seul rayon partout.

---

## 5. Composants

### A. Hero — « la scène vivante » (l'unique moment spectaculaire)
- **Visuel central :** vraie photo détourée de Sylla, avec un fin contour blanc façon sticker.
- **Autour :** 2 ou 3 photos « polaroid » légèrement inclinées, 1 ou 2 stickers (pas plus), une fenêtre de code translucide, une pastille d'outil (Figma, Canva, Next.js).
- **Doodles :** 2 ou 3 flèches ou boucles tracées à la main, en SVG, orange ou encre.
- **Titre :** « SYLLA » en Bebas Neue XXL, partiellement chevauché par la photo. Sous-titre : deux badges (`Engineer` bleu, `Design` orange) + « Portfolio ».
- **Chiffres :** uniquement des chiffres **réels** (nombre de projets publiés, nombre de domaines), lus depuis la base. Jamais de chiffres inventés.
- **CTA :** « Voir les réalisations » (orange, défilement doux) et « Me contacter » (verre, WhatsApp direct ou formulaire de contact).

### B. Cartes projets — « écrans givrés »
- Format 16:9, image de couverture (Cloudinary, `next/image`), badges d'outils discrets, liens directs (GitHub, Live demo, Figma, Canva, Drive) sans quitter la grille.
- Survol : micro-zoom de l'image (≤ 1,04), bordure qui s'illumine en bleu ou orange, ombre légèrement plus marquée. C'est tout.
- Chaque carte peut porter une courte note manuscrite (« Note de dev », « Idée créative ») issue d'un champ optionnel du projet.

### C. Sous-portfolios `/[profil]`
- En-tête contextuel (ex. « Sélection : design graphique et identités visuelles »), même niveau de finition que l'accueil, uniquement les projets cochés. Le Hero y est allégé (pas de polaroids multiples).

### D. Compétences (Les 6 domaines PRD)
- 6 cartes représentatives des 6 casquettes du PRD :
  1. *Design Graphique* (Canva, Drive, Figma, affiches, identités)
  2. *Branding & Stratégie Com* (Guidelines, case studies, plans com)
  3. *Cadrage & Montage Vidéo* (Lecteurs vidéo, YouTube/Vimeo, thumbnails)
  4. *Design UI/UX & Motion* (Maquettes interactives Figma, prototypes)
  5. *IA Product Creator* (Prompts, outils et résultats documentés)
  6. *Développement Web* (Sites en prod, repos GitHub, démos live)
- Icônes vectorielles + liste d'outils maîtrisés. **Aucun pourcentage arbitraire.**

### E. Parcours — « fil naturel »
- Timeline horizontale ou verticale avec points bleus et un point orange pour l'étape en cours, et une courte phrase personnelle par étape (« ce que j'y ai appris »).
- **V0 : contenu statique** dans `content/experience.ts` (pas de table Prisma). À passer en base en V1 si besoin.

### F. Galerie détail projet
- Grille d'images avec **lightbox au clic** (accessible au clavier, touche `Échap` pour fermer). Voir décision ouverte en section 10.

### G. Contact et footer
- Formulaire 3 champs sur carte de verre, messages d'erreur explicites (« Entre une adresse e-mail valide »), état de succès clair.
- Footer persistant affiché partout : réseaux sociaux, lien direct WhatsApp, e-mail.

---

## 6. Animations (bibliothèque : Motion)

Utiliser **une seule** bibliothèque d'animation : `motion` (ex-Framer Motion). GSAP et Lenis ne sont pas utilisés en V0. Choix justifié : `layoutId` (réorganisation des filtres) et les ressorts sont natifs à Motion.

- **Entrée du Hero (le seul moment orchestré) :** les éléments arrivent en ressort (`type: "spring"`, `stiffness: 100`, `damping: 15`), échelonnés sur environ 700 ms. Une seule fois.
- **Doodles :** tracé du trait (`pathLength` de 0 à 1) quand ils entrent dans le viewport, une seule fois.
- **Filtres de projets :** réorganisation animée des cartes avec `layout` / `layoutId`.
- **Parallaxe souris :** uniquement sur les calques du Hero, amplitude ≤ 12 px, **désactivée** sur écran tactile.
- **Interactions :** `whileTap={{ scale: 0.98 }}` sur boutons et éléments cliquables, focus clavier visible.
- **Sections suivantes :** pas de fondu-glissement systématique. Apparition simple (opacité, 150 ms) ou aucune animation.
- **`prefers-reduced-motion` respecté partout :** pas de ressort, pas de parallaxe, pas de tracé animé (les doodles s'affichent directement).

---

## 7. Accessibilité et performance (plancher de qualité)

- Contraste conforme (section 2), focus visible sur tout élément interactif, navigation clavier complète.
- `alt` utile sur chaque image ; les doodles et orbes sont décoratifs (`aria-hidden`).
- Mobile d'abord : le verre y est allégé (`blur(10px)`), le Hero passe en une colonne, la parallaxe est coupée.
- Images : `next/image`, formats WebP/AVIF, `priority` uniquement sur l'image du Hero. Cible Lighthouse : Performance ≥ 90, Accessibilité ≥ 95.
- Pas plus de 3 surfaces en `backdrop-filter` visibles simultanément sur mobile.

---

## 8. Assets à fournir par Sylla

- `public/hero/sylla-cutout.webp` : portrait détouré (fond transparent), idéalement 2 poses.
- 2 à 3 photos « candid » pour les polaroids (autorisation de publication des personnes visibles).
- Logos ou captures d'outils pour les pastilles (Figma, Canva, Next.js).
- Texte du parcours (4 à 6 étapes, une phrase d'apprentissage chacune).
- Une couverture par projet (16:9).

Tant qu'ils ne sont pas fournis, l'agent utilise des **placeholders neutres** (rectangles de verre avec légende « à remplacer ») et ne génère aucune fausse photo.

---

## 9. À ne pas faire

La maquette de référence (image générée par IA) sert de **ambiance**, pas de spécification. Ne pas reproduire :
- les textes illisibles ou inventés qu'elle contient (« Developpment », « Nextiat Creative », « 710 Ste. »…) ;
- ses statistiques fictives (710, 500+, 413+) ;
- l'accumulation de stickers (papillon, smiley, « Y2K », appareil photo) : en garder deux au plus ;
- le verre sur toutes les surfaces ;
- des animations de défilement sur chaque section.

---

## 10. Décisions

| Sujet | État | Choix |
|---|---|---|
| Couleur d'accent | **Tranché** | Option D : bleu `#2563EB` + orange `#F97316`, fond clair `#F9FAFB` |
| Visuel du Hero | **Tranché** | Portrait détouré + éléments flottants (photo à fournir) |
| Format des galeries détail | **Ouvert (défaut proposé)** | Grille + lightbox. Le carrousel est réservé à la bande « Projets à la une » de l'accueil |
| Police manuscrite | **Ouvert** | Caveat par défaut, à valider visuellement |
| Bibliothèque d'animation | **Tranché** | Motion uniquement (remplace « GSAP uniquement » du journal précédent) |
| Mode sombre | **Hors périmètre V0** | Thème clair unique en V0 |
