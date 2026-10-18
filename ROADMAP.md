# ROADMAP — Portfolio Sylla (v3)

Suite du projet à partir de l'état actuel. À lire avec `PRD.md` (produit) et `DESIGN.md` (rendu).
**Version 3.1 : ajustée après l'audit de l'étape 0** (Next.js 16, React 19.3, authentification maison, réglages du site, adresses IP, galerie JSON).

## 0. Vue d'ensemble

| Phase | Contenu | État |
|---|---|---|
| 0 | Setup et structure | Fait |
| 1 | Back-office (authentification, projets, sous-portfolios) | Fait, commit dédié |
| 2 | Front public : Hero, grille, page projet (étapes 1 à 3) | Fait, direction artistique à refaire |
| **2bis** | **Médias, profils, templates, mouvement et 3D** | **À faire (étapes 0 à 9)** |
| 3 | E-mails, contenu réel, SEO et légal | À faire (étapes 10 à 12) |
| 4 | Audit, déploiement, post-lancement | À faire (étapes 13 à 15) |

Ordre et dépendances : 0 → 1 → 2 → 3 → 4 → 5 → (6, 7, 8) → 9. L'étape 10 (e-mails) et la saisie des projets réels (étape 11) peuvent avancer en parallèle de la 2bis, à partir de l'étape 1 pour les images.

**Conseil de méthode.** Pour les étapes 2, 4 et 5 (données, architecture, moteur de mouvement), choisis le modèle le plus puissant disponible dans Antigravity. Les étapes de mise en page peuvent se faire avec un modèle plus léger.

---

## 1. Règles permanentes pour l'agent

Ces règles s'appliquent à **chaque** étape. Elles remplacent toute instruction contraire.

1. **Inspecter avant d'agir.** Lire le code réel (schéma Prisma, routes, composants, `package.json`, configuration). Ne rien supposer. Ne jamais déclarer un fichier absent sans l'avoir cherché.
2. **Une étape à la fois.** Exécuter uniquement l'étape demandée, produire le rapport, **s'arrêter et attendre la validation**.
3. **Ne rien inventer.** Aucun chiffre, badge, certification, nom de client, délai de réponse ou témoignage. Contenu manquant = état vide propre ou placeholder marqué « à remplacer ».
4. **Protéger les données.** Développer uniquement sur la **branche Neon de développement**. Ne jamais toucher à la base de production. Aucun `reset`, aucun `db push --force-reset`, aucune suppression de données sans validation écrite.
5. **Migrations additives.** Nouvelle table ou nouveau champ optionnel uniquement. Décrire la migration avant de l'appliquer et attendre la validation.
6. **Secrets.** Ne jamais afficher, copier ni committer un secret. Mettre à jour `.env.example` (noms de variables seulement). Aucune clé secrète dans le code client (`NEXT_PUBLIC_` = public).
7. **Dépendances.** Vérifier les versions installées et leur compatibilité (React, Next.js) avant d'ajouter un paquet. Justifier chaque ajout dans le rapport. Pas de paquet décoratif.
8. **Back-office.** Ajouter, ne pas réécrire. L'authentification, les modèles et les routes existantes restent intacts sauf nécessité documentée.
9. **Qualité.** Avant le rapport : lint, vérification TypeScript, build de production. Corriger les régressions. Ne jamais prétendre qu'une animation, une route ou un test fonctionne sans l'avoir vérifié ; écrire « non vérifié » sinon.
10. **Accessibilité et mouvement.** Clavier, focus visible, contrastes, `prefers-reduced-motion`, aucune animation qui bloque le défilement.
11. **Git.** Travailler sur la branche `refonte/phase-2bis`. Un commit par étape, message clair. Aucun push forcé.
12. **Ambiguïté.** En cas de doute sur le produit ou le contenu, poser **une** question avant de coder.

**Gabarit du rapport de fin d'étape :** fichiers modifiés · dépendances ajoutées (nom, version, raison) · migrations (appliquées sur quelle base) · commandes exécutées et résultats · vérifications manuelles **réalisées** et **non réalisées** · contenu ou assets manquants · points à valider · risques.

---

## 2. Actions manuelles de Sylla (hors agent)

À faire **avant l'étape 0**, une fois.

1. **Mettre le travail à l'abri dans Git.** Dans le dossier du projet :
   ```bash
   git status
   git add -A && git commit -m "chore: etat avant phase 2bis"
   git log --oneline -n 30          # note les hash de la fin de Phase 1 et de l'étape 3
   git branch archive/refonte-1     # sauvegarde de l'état actuel
   git switch -c refonte/phase-2bis
   ```
2. **Créer une branche Neon de développement** : console Neon → Branches → Create branch, nom `dev-2bis`, depuis `main`. Récupère ses deux URL (poolée et directe) et remplace-les dans `.env.local`. **Garde les URL de production dans un gestionnaire de mots de passe**, pas dans le dépôt.
3. **Vérifier que `.env.local` est bien ignoré** : `git check-ignore .env.local` doit répondre le nom du fichier.
4. **Cloudinary** : dans la médiathèque, créer les dossiers `portfolio/projets` et `portfolio/profils`.
5. **Préparer les assets** (peut se faire pendant la 2bis) : portrait détouré (fond transparent, 2 poses si possible), 2 ou 3 photos « candid » dont tu as les droits, une couverture 16:9 par projet (au moins 1 600 px de large), les textes de Hero de chaque profil.

---

## 3. Phase 2bis — Médias, profils, templates, mouvement

### Étape 0 — Audit (aucun changement fonctionnel)

**Objectif :** comprendre l'état réel avant d'agir.
**Livrable :** `docs/AUDIT-2BIS.md` contenant : versions (Next.js, React, Prisma, Tailwind, bibliothèques d'animation), résumé du schéma Prisma, carte des routes, emplacement du Hero, des projets, de la page projet et du formulaire de contact, **la façon dont les images sont stockées et saisies aujourd'hui**, les commits correspondant au « premier portfolio » (verre givré) et à l'étape 3, la liste du contenu inventé à retirer, les risques.
**Critère :** aucun fichier fonctionnel modifié.

```
Lis PRD.md, DESIGN.md et ROADMAP.md (section « Règles permanentes »).
Exécute UNIQUEMENT l'étape 0 (audit). Ne modifie aucun fichier fonctionnel.
Produis docs/AUDIT-2BIS.md avec : versions installées, schéma Prisma résumé, carte des routes,
emplacement des composants Hero / Projets / Page projet / Contact, la manière dont les images
(couverture et galerie) sont stockées et saisies aujourd'hui, les commits git du « premier portfolio »
(verre givré) et de l'étape 3, le contenu inventé à retirer (badges, promesses, chiffres), les risques.
Termine par le rapport d'étape et attends ma validation.
```

### Étape 1 — Téléversement direct des images (Cloudinary)

**Objectif :** ne plus saisir d'URL d'image, téléverser depuis le dashboard.
**Livrables :**
- Modèle `Media` (et lien optionnel `coverMediaId` sur `Project`, galerie ordonnée) — migration additive sur la branche de dev.
- Route admin protégée de **signature** et route de **suppression** ; envoi **direct** du navigateur vers Cloudinary (le secret reste côté serveur, pas de preset « unsigned »).
- Composant d'envoi : glisser-déposer, aperçu, progression, erreurs lisibles, formats et taille contrôlés, **texte alternatif obligatoire**.
- Intégration au formulaire de projet (couverture et galerie : ordre, choix de la couverture) et page `/admin/medias` (liste, réutilisation, suppression refusée si le média est utilisé).
- Configuration `next/image`, CSP mise à jour (`img-src`, `connect-src` pour Cloudinary), `.env.example`.
- Compatibilité : les projets qui ont encore une URL d'image (`coverImage`) ou une galerie dans `links.gallery` continuent de s'afficher.
- Les routes de signature et de suppression vérifient la session **elles-mêmes** (cookie), sans compter uniquement sur le proxy.
- Script de migration des anciennes images, **en mode simulation uniquement** (dry-run), non exécuté.

**Critères :** une image téléversée apparaît en couverture et survit au rechargement · un fichier non image ou trop lourd est refusé · sans connexion admin, la route de signature répond 401 · le secret n'apparaît dans aucun fichier du bundle client · un projet ancien s'affiche encore · build propre.

```
Lis PRD.md (section 5 « Gestion des médias »), DESIGN.md (section 10) et ROADMAP.md.
Exécute UNIQUEMENT l'étape 1. Base de données : branche Neon de développement uniquement.
Implémente le téléversement direct vers Cloudinary avec signature serveur (route admin protégée),
le modèle Media (migration additive : décris-la et attends ma validation AVANT de l'appliquer),
le composant d'envoi (texte alternatif obligatoire), l'intégration au formulaire de projet
(couverture + galerie ordonnée), la page /admin/medias, la config next/image et la CSP.
Les projets existants avec une URL d'image (coverImage) ou une galerie dans links.gallery doivent continuer de s'afficher.
Les routes de signature et de suppression vérifient la session admin elles-mêmes (cookie), pas seulement via le proxy.
Écris le script de migration des anciennes images en dry-run, sans l'exécuter.
Termine par le rapport d'étape (gabarit du ROADMAP) et attends ma validation.
```

### Étape 2 — Données des profils

**Objectif :** stocker en base le contenu des Hero et la configuration des templates.
**Livrables :** modèle `Profile` (voir PRD, section 7) et migration additive · schémas Zod (`hero`, `sections`, `variables`) · module partagé des **slugs réservés** · modèle **`SiteSettings`** (une seule ligne : nom affiché, ligne de métier, e-mail public, WhatsApp, réseaux ; tous optionnels sauf le nom) · script de **seed idempotent** : un profil par défaut (placeholders « à remplacer ») et un profil pour chaque sous-portfolio existant · fonctions d'accès (`getDefaultProfile`, `getProfileBySlug`) avec repli propre si aucun profil n'existe · tests unitaires des schémas et de la validation de slug.
**Critères :** migration appliquée sur la branche de dev uniquement · seed rejouable sans doublon · les routes actuelles fonctionnent toujours.

```
Lis PRD.md (sections 3, 6, 7), DESIGN.md (section 2) et ROADMAP.md. Exécute UNIQUEMENT l'étape 2.
Lis d'abord le schéma Prisma réel et les conventions du projet (Prisma 7).
Ajoute les modèles Profile et SiteSettings (migration additive : décris-la, attends ma validation avant de l'appliquer), en suivant les conventions de nommage du schéma existant (titre, actif, ordre…),
les schémas Zod, la liste partagée des slugs réservés, le seed idempotent et les fonctions d'accès.
Ne modifie aucune page publique dans cette étape. Ajoute des tests unitaires.
Termine par le rapport d'étape et attends ma validation.
```

### Étape 3 — Dashboard : page « Profils »

**Objectif :** modifier le Hero, le template et les sections sans toucher au code.
**Livrables :** pages `/admin/profils` (liste), création, édition · page `/admin/reglages` (réglages du site : nom, ligne de métier, e-mail public, WhatsApp, réseaux) · formulaire : titre, sous-titre, accroche, deux boutons (libellé et lien), visuel choisi dans la médiathèque, template (avec aperçu), variante d'accent, sections (visibilité et ordre avec boutons **accessibles au clavier**, pas seulement le glisser-déposer), projets affichés (réutiliser la logique des sous-portfolios), variables, SEO, activation · validation Zod côté serveur · refus des slugs réservés ou en doublon · revalidation des pages publiques à l'enregistrement · **aperçu** `/admin/profils/[id]/apercu` qui rend le vrai composant public avec les données en cours d'édition.
**Critères :** tout est protégé par l'authentification · une valeur invalide affiche une erreur claire · un profil créé apparaît en base · le back-office existant n'est pas régressé.

```
Lis PRD.md, DESIGN.md et ROADMAP.md. Exécute UNIQUEMENT l'étape 3. Le back-office existant est
fonctionnel : AJOUTE la section Profils sans réécrire l'existant, avec le même style que le dashboard.
Implémente liste, création, édition, aperçu et la page Réglages du site (voir ROADMAP étape 3), validation Zod côté serveur,
slugs réservés refusés, revalidation des pages publiques. Réordonnancement des sections accessible au clavier.
Termine par le rapport d'étape et attends ma validation.
```

### Étape 4 — Socle des templates et routage public

**Objectif :** que `/` et `/[profil]` s'affichent d'après un profil et son template.
**Livrables :** registre de templates et attribut `data-template` · tokens CSS par template (provisoires acceptés, le template `developpeur` reprend l'aspect actuel) · composants de section **pilotés par les données** (aucun texte métier en dur) · nouveau header et footer communs (comportement au défilement, menu mobile accessible, libellés du PRD), alimentés par `SiteSettings` (champ vide = rien d'affiché, aucune valeur factice) · `/` charge le profil par défaut, `/[profil]` charge le profil correspondant, 404 si inconnu ou inactif, aucun conflit avec les routes fixes · `generateMetadata` par profil · retrait du contenu inventé relevé à l'audit.
**Critères :** modifier le titre du Hero dans le dashboard change la page publique · changer le template change les tokens appliqués · `/projets`, `/projets/[slug]`, `/contact` répondent toujours · build propre.

```
Lis PRD.md, DESIGN.md (sections 2, 3, 4) et ROADMAP.md. Exécute UNIQUEMENT l'étape 4.
Mets en place le registre de templates, data-template, les composants de section pilotés par le profil,
le nouveau header/footer communs alimentés par SiteSettings (champ vide = rien d'affiché), le routage / et /[profil] depuis la base, les métadonnées par profil.
Retire le contenu inventé listé dans docs/AUDIT-2BIS.md. Conserve les routes /projets, /projets/[slug], /contact.
Le template « developpeur » doit reproduire l'aspect actuel. Aucune animation lourde dans cette étape.
Termine par le rapport d'étape et attends ma validation.
```

### Étape 5 — Moteur de mouvement et 3D

**Objectif :** une infrastructure unique, réutilisée par les trois templates.
**Livrables :** dépendances : GSAP et Three.js sont **déjà installés** ; ajouter `@gsap/react` et Lenis ; React Three Fiber et drei **seulement si le besoin est justifié** et si leur compatibilité avec React 19.3 est vérifiée, sinon garder le Three.js « pur » existant · fournisseur de mouvement (un seul enregistrement des plugins, Lenis synchronisé avec ScrollTrigger) · utilitaires : révélation, titre découpé, effet magnétique, progression de défilement, gestion de `prefers-reduced-motion` et `matchMedia` · composant de scène 3D chargé à la demande avec détection WebGL, pause hors écran et image de remplacement · retrait de Framer Motion si elle n'est plus utilisée · `docs/MOTION.md` (comment utiliser chaque brique) · page de démonstration **réservée au développement** (absente en production).
**Critères :** aucune erreur en console · la navigation entre pages ne duplique pas les déclencheurs de défilement · avec mouvement réduit, le contenu est visible et immobile · le défilement natif et le clavier ne sont jamais bloqués.

```
Lis PRD.md (section 8), DESIGN.md (sections 8 et 9) et ROADMAP.md. Exécute UNIQUEMENT l'étape 5.
Les versions installées sont dans docs/AUDIT-2BIS.md (GSAP et Three.js sont déjà présents). Ajoute seulement @gsap/react et Lenis.
N'ajoute React Three Fiber / drei que si tu justifies le besoin ET vérifies leur compatibilité avec React 19.3 ; sinon conserve le Three.js pur. Justifie chaque ajout.
Construis le fournisseur de mouvement, les utilitaires, le composant de scène 3D (chargement à la demande,
pause hors écran, repli sans WebGL) et docs/MOTION.md. Page de démonstration réservée au développement.
N'applique rien encore aux templates. Termine par le rapport d'étape et attends ma validation.
```

### Étape 6 — Template `creatif` (verre givré bleu/orange)

**Objectif :** l'identité principale de Sylla.
**Livrables :** tokens, verre givré et orbes selon `DESIGN.md` section 5 · Hero avec portrait détouré, polaroids, doodles (**placeholders** légendés si les assets manquent) · cartes projets et grille filtrable (Flip) · sections Compétences, À propos, Parcours (`content/experience.ts`), Contact · **les 7 points du contrat de mouvement** · mobile : verre allégé, parallaxe coupée.
**Critères :** chaque point du contrat est observé et coché dans le rapport · contrastes conformes · Hero sans 3D obligatoire · aucune fausse photo.

```
Lis PRD.md, DESIGN.md (sections 5, 8, 10, 11, 12) et ROADMAP.md. Exécute UNIQUEMENT l'étape 6.
Implémente le template « creatif » en réutilisant ce qui est récupérable du premier portfolio (commits
identifiés dans docs/AUDIT-2BIS.md, s'ils existent ; sinon pars de DESIGN.md et de la maquette fournie), mais en le rendant piloté par les données du profil.
Assets manquants : placeholders de verre légendés « à remplacer », jamais de fausse photo.
Implémente les 7 points du « contrat de mouvement » et indique dans le rapport, un par un,
ce que tu as réellement vérifié (desktop, mobile, mouvement réduit).
Termine par le rapport d'étape et attends ma validation.
```

### Étape 7 — Template `developpeur`

**Livrables :** documenter les tokens réels · appliquer `DESIGN.md` section 6 : cartes variées (projet à la une épinglé), Hero avec révélation du titre et polyèdre 3D réactif, compétences activées au défilement, effet magnétique · **les 6 points du contrat de mouvement**.
**Critères :** plus aucune mention inventée · 3D chargée à la demande avec repli · contrat vérifié point par point.

```
Lis PRD.md, DESIGN.md (sections 6, 8, 9, 10, 12) et ROADMAP.md. Exécute UNIQUEMENT l'étape 7.
Documente d'abord dans DESIGN.md les tokens réellement présents dans le template actuel, puis applique
les évolutions de la section 6 et les 6 points du contrat de mouvement. Aucune mention inventée.
Dans le rapport, indique pour chaque point du contrat ce qui a été réellement vérifié.
Termine par le rapport d'étape et attends ma validation.
```

### Étape 8 — Template `immersif`

**Livrables :** tokens sombres (propositions à valider), Hero avec objet 3D unique piloté par la souris et le défilement, images de projets avec distorsion shader au survol (une seule technique), titres horizontaux liés à la vitesse de défilement, curseur discret limité à ce template · **les 6 points du contrat de mouvement** · poids des assets 3D documenté.
**Prérequis :** concept de l'objet 3D validé par Sylla.

```
Lis PRD.md, DESIGN.md (sections 7, 8, 9, 10, 12) et ROADMAP.md. Exécute UNIQUEMENT l'étape 8.
Avant de coder, propose 2 concepts d'objet 3D (forme, matière, interaction) et attends mon choix.
Puis implémente le template « immersif » : un seul objet 3D, modèle ≤ 1,5 Mo, repli image,
Hero lisible sans 3D, les 6 points du contrat de mouvement. Documente le poids des assets.
Dans le rapport, indique pour chaque point du contrat ce qui a été réellement vérifié.
```

### Étape 9 — Contrôle qualité de la phase 2bis

**Livrables :** matrice de tests : 3 templates × (mobile, tablette, desktop) · routes (`/`, `/projets`, `/projets/[slug]`, `/contact`, `/[profil]`, 404) · parcours admin (téléverser, créer un profil, changer de template, aperçu, publier) · clavier et lecteur d'écran sur les pages principales · **revue de l'authentification maison** (cookie HttpOnly / Secure / SameSite, durée de session, secret JWT fort sans valeur par défaut, limitation des tentatives de connexion, protection de `/api/admin/*`) · mouvement réduit · Lighthouse mobile par template (**chiffres réels**) · taille des paquets JavaScript · correctifs. Le fichier `docs/QA-2BIS.md` liste ce qui est réussi, échoué, non testé.

```
Lis ROADMAP.md. Exécute UNIQUEMENT l'étape 9 : contrôle qualité de la phase 2bis, sans nouvelle fonctionnalité.
Teste la matrice décrite à l'étape 9, fais une revue de l'authentification maison (attributs du cookie, secret JWT, limitation des tentatives de connexion, protection de /api/admin/*), corrige les régressions, et produis docs/QA-2BIS.md avec les résultats réels
(réussi / échoué / non testé, scores Lighthouse mesurés). N'invente aucun résultat.
Termine par le rapport d'étape et attends ma validation.
```

**Option 9b — Variables d'offre** (`/design?pour=Acme`) : voir PRD section 4.3. À lancer seulement si tu veux cette fonction pour la V0.

---

## 4. Phase 3 — E-mails, contenu réel, SEO et légal

### Étape 10 — Contact et Resend

**Livrables :** (en partant de la Server Action existante `app/actions/contact.ts`) envoi par Resend depuis `onboarding@resend.dev` vers l'adresse du compte Resend (domaine non vérifié) · validation Zod · champ anti-spam invisible · **limitation de débit** compatible Vercel (la mémoire du serveur n'est pas persistante : proposer la solution la plus simple, demander validation si elle exige un nouveau service) · **le message est enregistré en base avant l'envoi** ; un échec d'e-mail ne casse pas l'expérience du visiteur et est journalisé · contenu de l'e-mail échappé, `Reply-To` = e-mail du visiteur · états d'envoi et de succès · aucune promesse de délai de réponse.

```
Lis PRD.md, DESIGN.md (section 11) et ROADMAP.md. Exécute UNIQUEMENT l'étape 10.
Implémente l'envoi du formulaire de contact avec Resend (expéditeur onboarding@resend.dev, destinataire
CONTACT_EMAIL), validation Zod, anti-spam invisible, limitation de débit adaptée à Vercel (propose, puis demande
ma validation si un nouveau service est nécessaire), enregistrement en base AVANT l'envoi, échec d'e-mail journalisé
sans casser l'expérience, contenu échappé. Termine par le rapport d'étape et attends ma validation.
```

### Étape 11 — Contenu réel

**Côté agent :** lister les données de démonstration et proposer un **script de suppression sûr** (aucune suppression sans ma confirmation écrite) ; vérifier que chaque projet réel s'affiche bien (couverture, galerie, liens, vidéo).
**Côté Sylla, par projet :** titre · slug · domaines (tags) · objectif en 1 ou 2 phrases · ton rôle · outils · liens (Canva, Figma, Drive, GitHub, démo, YouTube/Vimeo) · **couverture 16:9, 1 600 px de large au moins, téléversée** · galerie de 3 à 8 images **téléversées**, chacune avec un texte alternatif · vidéo éventuelle en lien.
**Côté Sylla, par profil :** titre, sous-titre, accroche, libellés des boutons, projets cochés, template. Remplir aussi `content/experience.ts` et les compétences.

```
Lis ROADMAP.md. Exécute UNIQUEMENT l'étape 11 côté agent : liste les données de démonstration (projets, sous-portfolios,
profils, médias, messages de test) et propose un script de suppression avec simulation et confirmation explicite.
Ne supprime rien. Ne modifie pas la production. Puis vérifie l'affichage d'un projet réel complet que j'aurai saisi
dans le dashboard (couverture, galerie, liens, vidéo) et signale tout défaut. Termine par le rapport d'étape.
```

### Étape 12 — SEO et pages légales

**Livrables :** métadonnées par page et par profil, images de partage (Open Graph), `sitemap.xml`, `robots.txt` (administration exclue), balises canoniques, données structurées « Person » · pages `/mentions-legales` et `/confidentialite` (le formulaire collecte des données personnelles) · liens dans le footer · **statistiques de visites** : cesser d'enregistrer l'adresse IP brute (ne plus l'écrire ; mettre les valeurs existantes à NULL après ma validation), filtrer les robots, exclure mes propres visites, décrire ce traitement dans la politique de confidentialité. **Les textes légaux sont des modèles à faire relire** ; l'agent n'est pas juriste et ne doit pas inventer d'informations sur ton statut.

```
Lis PRD.md et ROADMAP.md. Exécute UNIQUEMENT l'étape 12 (inclut l'arrêt de l'enregistrement des adresses IP brutes dans Visit, le filtrage des robots et l'exclusion des visites admin) : métadonnées, images Open Graph, sitemap, robots
(admin exclue), canoniques, données structurées Person, pages /mentions-legales et /confidentialite sous forme
de modèles avec champs « à compléter » (n'invente aucune information sur mon statut ni mon adresse).
Termine par le rapport d'étape et attends ma validation.
```

---

## 5. Phase 4 — Audit, déploiement, post-lancement

### Étape 13 — Audit de performance et d'accessibilité

Sur une version de production locale (`build` puis `start`). **Objectifs :** Performance ≥ 90, Accessibilité ≥ 95, SEO ≥ 95 (mobile), LCP < 2,5 s, CLS < 0,1, sur les trois templates. Audit des images (formats, tailles, `sizes`), des polices, du JavaScript initial, de la 3D. Correctifs, puis `docs/AUDIT-FINAL.md` avec **les scores mesurés**.

```
Lis DESIGN.md (section 12) et ROADMAP.md. Exécute UNIQUEMENT l'étape 13 sur un build de production local.
Mesure Lighthouse mobile et accessibilité (clavier, contrastes, mouvement réduit) pour les trois templates,
corrige, puis écris docs/AUDIT-FINAL.md avec les scores réellement mesurés (aucun chiffre estimé).
Termine par le rapport d'étape et attends ma validation.
```

### Étape 14 — Déploiement Vercel et domaine

**Décision à prendre avant :** le plan Hobby est réservé à un usage non commercial. Options : demander l'avis du support Vercel, passer à Pro (20 $/mois), ou héberger ailleurs après vérification de la compatibilité Next.js.

**Agent :** préparer `DEPLOY.md` (variables d'environnement Production et Preview, région des fonctions Frankfurt `fra1`, commande de migration `prisma migrate deploy` exécutée de façon contrôlée, vérification de la CSP, plan de retour arrière), `.env.example` à jour, build propre.
**Sylla :** importer le dépôt dans Vercel, saisir les variables (production = branche Neon `main`), relier `syllayoussouf.com`, mettre à jour les variables d'URL et de session de l'authentification maison sur l'adresse définitive, vérifier le domaine d'envoi dans Resend (enregistrements DNS) puis passer l'expéditeur sur ton domaine.
**Test de fumée en production :** pages publiques, connexion admin, téléversement d'une image, envoi d'un message de contact, 404, `/[profil]`, e-mail reçu.

```
Lis ROADMAP.md. Exécute UNIQUEMENT l'étape 14 côté agent : prépare DEPLOY.md (variables Production et Preview,
région fra1, procédure de migration contrôlée avec prisma migrate deploy, vérification de la CSP, retour arrière),
mets .env.example à jour et vérifie que le build de production passe. Tu n'as pas accès à Vercel : liste précisément
les actions que je dois faire dans les consoles Vercel, Neon, Resend et chez mon registrar.
```

### Étape 15 — Après le lancement

Test du formulaire en production · Lighthouse sur l'URL réelle · Google Search Console (propriété et sitemap) · rotation des secrets utilisés pendant le développement · mot de passe administrateur fort et unique · filtrage des robots et exclusion de tes propres visites dans les statistiques · vérification des quotas (Cloudinary, Neon, Resend) · sauvegarde : vérifier la fenêtre de restauration Neon.

---

## 6. Backlog V1

Variables d'offre avancées · mode sombre choisi par le visiteur · sous-domaines · statistiques enrichies · timeline du Parcours en base · éditeur de template visuel.
