# Direction Visuelle & Système de Design — Portfolio Sylla (v3)

Remplace la v2. Le site propose **trois templates** (`creatif`, `developpeur`, `immersif`) construits sur un socle commun. Ce document fixe le socle, chaque template, le mouvement, les médias, l'accessibilité et la performance.

> **Pour l'agent de code.**
> 1. Ce fichier est la source de vérité visuelle ; le code implémenté doit rester cohérent avec lui. Tout écart est documenté ici.
> 2. Les valeurs marquées **(proposition)** sont à valider avec Sylla avant d'être figées. Ne pas les présenter comme définitives.
> 3. Ne jamais inventer de contenu : chiffres, badges, certifications, clients, délais de réponse. Les textes viennent du profil (base de données). Les valeurs d'exemple de ce document sont des **placeholders**.
> 4. Pour le template `developpeur`, documenter d'abord les tokens réellement présents dans le code actuel, puis appliquer les évolutions ci-dessous.

---

## 1. Intention

- **Créatif d'abord.** Le portfolio d'un expert en communication digitale et graphiste, qui est aussi développeur : le site prouve les deux.
- **Humain et original.** Une personne derrière le site : photo détourée, annotations manuscrites, ton direct.
- **Une audace par page.** Chaque page a **un seul moment spectaculaire** (le Hero). Le reste reste lisible et calme. Si un effet ne sert ni la lecture ni la mémorisation, il est supprimé.
- **Pas de template générique.** Éviter : grille de cartes identiques partout, un seul rayon de bordure, étiquettes en majuscules espacées au-dessus de chaque titre, numérotation décorative hors séquences réelles, un seul mot coloré par titre.

## 2. Architecture du design

- Le template actif est posé sur l'élément racine : `<div data-template="creatif">`.
- Chaque template définit ses **tokens** en variables CSS (`--bg`, `--surface`, `--ink`, `--muted`, `--accent`, `--accent-2`, `--radius-*`, polices), sa **composition** de sections, ses **variantes de Hero**, son **preset de mouvement**.
- Les composants de section (`Hero`, `Projets`, `Competences`, `Apropos`, `Parcours`, `Contact`) reçoivent leurs **données** en props (issues du profil) et choisissent leur **mise en page** selon le template. Un composant ne contient aucun texte métier en dur.
- Aucune couleur en dur dans un composant. Tout passe par les tokens.
- Les variantes `accent` du profil = jeux de tokens prévalidés (contraste vérifié), pas des couleurs libres.

```
src/templates/
  registry.ts          // { creatif, developpeur, immersif }
  creatif/    tokens.css  layout.tsx  hero.tsx  motion.ts
  developpeur/ ...
  immersif/    ...
```

## 3. Socle commun

**Grille et espacement.** Conteneur 1280 px maximum, marges latérales fluides (`clamp(1rem, 4vw, 3rem)`). Échelle d'espacement 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72 · 112 px. Sections séparées par 96 à 160 px sur desktop, 64 à 96 px sur mobile.

**Rayons.** Trois niveaux seulement : 12 px (champs, badges), 20 px (cartes, panneaux), 999 px (boutons). Le template `immersif` peut ajouter 0 px pour des visuels plein cadre.

**Points de rupture.** 640 · 768 · 1024 · 1280 px. Conception mobile d'abord.

**Typographie (principes).** Un titre expressif, un texte très lisible, une police technique pour les slugs et tags uniquement. Lignes de moins de 80 caractères. Chargement par `next/font`. Le Hero utilise `clamp()` pour la taille.

**Sections et clés.** `hero` · `projets` · `competences` · `apropos` · `parcours` (optionnelle) · `contact`. Ordre et visibilité viennent du profil.

## 4. Header, navigation, footer (communs)

- **Libellés :** Accueil · Projets · Compétences · À propos · Contact. Pas de nom ambigu.
- **Disposition :** logo (nom + une ligne de métier, tous deux issus des réglages du site) à gauche, liens répartis avec de **vraies marges** (au moins 32 px entre les liens, pas de bloc serré au centre), bouton d'action à droite (« Me contacter » ou « Discutons de votre projet »).
- **Comportement au défilement :** en haut de page, header transparent et plus haut ; après environ 80 px, il **se compacte** (hauteur réduite, fond givré ou plein selon le template) ; il se masque quand on descend et réapparaît quand on remonte. Le lien actif suit la section visible.
- **Mobile :** menu plein écran, ouvert et fermé au clavier (`Échap`), focus piégé tant qu'il est ouvert, bouton d'action toujours visible.
- **Footer :** réseaux, WhatsApp, e-mail, liens légaux. Aucune mention inventée.

## 5. Template `creatif` — verre givré bleu/orange

Reprend le premier portfolio. Humain, chaleureux, coloré.

**Couleurs.**

| Rôle | Valeur |
|---|---|
| Fond | `#F9FAFB` |
| Surface pleine | `#FFFFFF` |
| Verre | `rgba(255,255,255,0.55)` |
| Bleu électrique | `#2563EB` |
| Orange vif | `#F97316` |
| Encre | `#0F172A` |
| Texte secondaire | `#475569` |
| Orbes | `#3B82F6` et `#FB923C` |

Règles de contraste : texte secondaire sur verre en `#475569` (jamais `#64748B`) ; l'orange n'est **jamais** une couleur de texte sur fond clair ; texte sur bouton orange = encre ; texte blanc uniquement sur le bleu. Contraste minimum 4,5:1 (3:1 au-dessus de 24 px).

**Typographie.** Bebas Neue (grands titres, jamais sous 32 px) · Geist Sans (interface et corps) · Geist Mono (tags et slugs) · Caveat (annotations manuscrites, jamais pour du contenu important).

**Verre givré.**

```css
.glass {
  background: rgba(255,255,255,.55);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid rgba(255,255,255,.7);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(15,23,42,.08), inset 0 1px 0 rgba(255,255,255,.8);
}
@supports not (backdrop-filter: blur(1px)) { .glass { background:#fff; } }
@media (prefers-reduced-transparency: reduce) { .glass { background:#fff; backdrop-filter:none; } }
```

Utilisé pour : cartes projets, cartes du Hero, formulaire, header compacté. Pas ailleurs. Orbes de couleur : 2 à 3 par écran, en `radial-gradient` (pas de `filter: blur()` sur de grands éléments). Mobile : `blur(10px)`, 3 surfaces givrées visibles au maximum.

**Hero (le moment spectaculaire).** Portrait détouré de Sylla (contour blanc type sticker), 2 ou 3 polaroids inclinés, 1 ou 2 stickers au maximum, une fenêtre de code translucide, une pastille d'outil, 2 ou 3 doodles SVG. Titre XXL en Bebas Neue. Textes, boutons et chiffres viennent du profil. **Sans portrait fourni :** placeholders de verre légendés « à remplacer » ; aucune fausse photo.

**Projets.** Cartes 16:9 en verre, grande image, badges d'outils, liens directs (GitHub, démo, Figma), note manuscrite optionnelle. Survol : zoom de l'image ≤ 1,04, bordure lumineuse bleue ou orange.

**Parcours.** Timeline avec points bleus, un point orange pour l'étape en cours, une phrase personnelle par étape. Contenu statique dans `content/experience.ts` en V0.

**Contrat de mouvement (doit être vérifiable à l'œil) :**
1. Entrée du Hero orchestrée en ressort (`back.out` / `elastic`), 1,2 s au maximum, une fois.
2. Les doodles se **tracent** (DrawSVG) quand ils entrent à l'écran.
3. Parallaxe de souris sur les calques du Hero (≤ 12 px, désactivée au tactile), plus parallaxe au **défilement** à vitesses différentes.
4. Cartes projets : apparition échelonnée (stagger 60 à 90 ms) puis léger basculement 3D (tilt) au survol.
5. Filtres de projets : réorganisation animée avec **GSAP Flip**.
6. Bande de texte défilant dont la vitesse suit la vitesse de défilement.
7. Header qui se compacte et se masque au défilement.

## 6. Template `developpeur` — bleu nuit, précision

Base : la version actuelle (à documenter depuis le code), corrigée et animée.

**Tokens (propositions, à confirmer en lisant le code).** Fond `#F6F7FB`, bleu nuit `#0B1B3A` (titres, navigation, panneaux sombres), accent bleu `#2F5BFF` (liens, boutons, états actifs), accent secondaire ambre `#F5B83D` **réservé aux surbrillances ponctuelles**, gris `#475569` pour le texte secondaire.

**Corrections obligatoires.** Retirer « Code certifié & déployé », « Profil vérifié » et toute promesse non renseignée. Cartes projets : varier les formats (une grande carte « à la une » + une grille) au lieu de six cartes identiques ; image de couverture grande ; état vide propre quand il n'y en a pas.

**Contrat de mouvement :**
1. Titre du Hero révélé mot à mot (SplitText), masque qui monte.
2. Le polyèdre 3D filaire autour du portrait réagit à la souris et tourne avec le défilement (React Three Fiber, chargé à la demande).
3. Section Projets : un projet « à la une » **épinglé** (ScrollTrigger pin) pendant que ses détails défilent.
4. Compétences : groupes qui s'activent un par un au défilement, sans barre de pourcentage.
5. Boutons : légère attraction magnétique au survol (≤ 8 px).
6. Header qui se compacte au défilement ; lien actif suivi.

## 7. Template `immersif` — sombre, 3D au centre

Nouveau. Pour les profils qui doivent marquer : vidéo, motion, IA, création numérique.

**Tokens (propositions).** Fond `#07080D`, texte `#EDEFF5`, texte secondaire `#A3A8B8`, accent violet `#7C5CFF`, contraste magenta `#FF4D9D`. Contrastes à vérifier à l'implémentation (4,5:1 minimum). Aplats et lumière diffuse limitée ; pas d'empilement de dégradés.

**Typographie (proposition).** Syne (titres larges) + Geist Sans (corps) + Geist Mono (technique).

**Hero.** Un **objet 3D unique** (forme géométrique, composition abstraite ou objet numérique) qui suit le pointeur et dont la caméra progresse avec le défilement. Poids du modèle ≤ 1,5 Mo, compression Draco ou meshopt. Concept de l'objet : **à valider** avec Sylla.

**Contrat de mouvement :**
1. Caméra 3D pilotée par la progression du défilement (ScrollTrigger).
2. Objet 3D qui réagit au pointeur (inertie, amplitude limitée).
3. Images de projets avec **distorsion shader** au survol (une seule technique, pas de pile d'effets).
4. Titres en défilement horizontal lié à la vitesse de scroll.
5. Transitions de sections par masques et décalages (transform et opacity uniquement).
6. Curseur personnalisé discret, **limité** à ce template, désactivé au tactile et en mouvement réduit.

## 8. Mouvement : règles communes

- **Bibliothèques :** GSAP + ScrollTrigger (+ SplitText, Flip, DrawSVG), Lenis. Aucune autre bibliothèque d'animation.
- **React :** `useGSAP()` pour tout, un seul `registerPlugin` global, `gsap.matchMedia()` pour séparer desktop, mobile et mouvement réduit. Nettoyage complet au démontage. `ScrollTrigger.refresh()` après le chargement des images et des polices.
- **Durées :** micro-interactions 150 à 250 ms · révélations 500 à 900 ms · séquence du Hero 1,2 s au maximum · décalage 60 à 90 ms.
- **Propriétés animées :** `transform` et `opacity` en priorité. Pas d'animation de `width`, `height`, `top`, `left`. **Aucun décalage de mise en page** (CLS < 0,1).
- **Pas de fondu-glissement systématique** sur chaque section : réserver le mouvement aux éléments qui portent le message.
- **`prefers-reduced-motion` respecté partout :** contenu visible immédiatement, pas de parallaxe, pas de tracé, 3D figée ou remplacée par une image.
- **Ne jamais bloquer** le défilement naturel, le clavier ou le tactile.
- **Chaque template vérifie son « contrat de mouvement »** (sections 5 à 7) avant la fin de l'étape ; le rapport d'étape liste ce qui est réellement observé.

## 9. 3D : règles communes

- Un seul `<Canvas>` par page, chargé avec `next/dynamic` (`ssr: false`) seulement quand il est utile (visible ou proche de l'être).
- `dpr` limité à 1,5 (1 sur mobile). `frameloop="demand"` ou pause hors écran. Pas de post-traitement sur mobile.
- **Le Hero ne dépend jamais de la 3D** : le texte et les boutons s'affichent d'abord, la 3D se superpose ensuite.
- Image de remplacement si WebGL est absent, si l'appareil est limité, ou si le mouvement est réduit.
- Modèles `.glb` optimisés, poids total des assets 3D documenté dans le rapport.

## 10. Médias

- **Images téléversées uniquement** (Cloudinary), jamais d'URL d'image externe arbitraire. Les liens servent aux ressources (Canva, Figma, Drive, GitHub, YouTube, Vimeo).
- `next/image` avec largeurs adaptées, `f_auto` et `q_auto`, dimensions connues, `sizes` renseigné. `priority` seulement pour l'image du Hero. Flou d'attente léger (placeholder) sur les grandes couvertures.
- **Texte alternatif obligatoire** à l'envoi. Images purement décoratives : `alt=""` et `aria-hidden`.
- Ratios : couverture de carte 16:9, galerie au ratio d'origine, visuel du Hero selon le template.
- **Sans image :** composition graphique générée à partir des tokens (aplat, motif, initiales du projet), jamais une fausse photo.
- **Vidéo :** YouTube (`youtube-nocookie`) ou Vimeo en iframe, chargée au clic (vignette d'abord).
- **Lightbox :** navigation clavier, `Échap` pour fermer, focus restitué, légende lisible.
- **Icônes :** une seule bibliothèque (Lucide si déjà présente). Pas d'emojis comme icônes permanentes.

## 11. Composants communs

- **Boutons :** principal (couleur d'accent du template), secondaire (contour ou verre), lien. Libellé = ce qui se passe (« Voir mes projets », « Me contacter »). Hauteur tactile ≥ 44 px, focus visible, retour au clic (`scale: 0.98`).
- **Filtres :** puces avec état actif clair, réorganisation animée (Flip), URL mise à jour (`?domaine=`) pour le partage.
- **Formulaire de contact :** trois champs, messages d'erreur explicites (« Entre une adresse e-mail valide »), état d'envoi et de succès, champ anti-spam invisible, aucun libellé promettant un délai de réponse.
- **États vides :** une phrase claire et une action (« Aucun projet publié pour l'instant »).

## 12. Accessibilité et performance

- Contraste conforme, focus visible partout, navigation clavier complète, repères sémantiques (`header`, `nav`, `main`, `footer`), un seul `h1` par page.
- **Cibles Lighthouse (mobile) :** Performance ≥ 90, Accessibilité ≥ 95, SEO ≥ 95. **LCP < 2,5 s**, **CLS < 0,1**.
- JavaScript initial de la page d'accueil **hors 3D** : à mesurer et documenter ; la 3D et GSAP lourd sont chargés à la demande.
- Mobile : verre allégé, parallaxe coupée, 3D remplacée ou allégée, aucune animation permanente.

## 13. Textes

Français, phrases courtes, verbes d'action, aucun jargon de vendeur. Les textes de l'interface décrivent ce qui est ; les textes des profils sont saisis dans le dashboard. Les valeurs de départ du profil par défaut sont des **placeholders** marqués « à remplacer ».

## 14. À confirmer avec Sylla

| Sujet | État |
|---|---|
| Portrait détouré, 2 poses, et photos « candid » | À fournir |
| Concept de l'objet 3D du template `immersif` | Ouvert |
| Polices du template `immersif` (Syne proposée) | Proposition |
| Palettes `developpeur` et `immersif` | Propositions |
| Variantes `accent` par template | À définir après les tokens |
| Textes du Hero par profil | À saisir dans le dashboard |
