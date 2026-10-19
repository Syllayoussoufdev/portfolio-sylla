# POSITIONNEMENTS — Les quatre portfolios (à placer dans `docs/`)

Cette spécification fixe **qui est visé, quel objectif, quel message, quels contenus** pour chaque portfolio, ainsi que les **formats de sections** (pour éviter les vues répétitives) et le **Parcours & Évolutions** géré en base. Elle fait foi pour les contenus et les objectifs ; `DESIGN.md` fait foi pour le visuel ; `PRD.md` pour le produit.

## 0. Règles

1. **Tous les textes ci-dessous sont des propositions de départ**, modifiables dans le dashboard. Les signaler comme telles dans le rapport.
2. **Rien d'inventé :** aucun chiffre, résultat, client, délai de réponse, année d'expérience ni disponibilité. Aucun logiciel nommé tant que Sylla ne l'a pas confirmé.
3. **Honnêteté du niveau :** Sylla est développeur junior ; en montage vidéo il est **débutant**. Le ton ne doit jamais surjouer l'expertise.
4. **Un portfolio = un public = un objectif.** Les boutons, l'ordre des sections et la sélection de projets servent cet objectif.

## 1. Vue d'ensemble

| URL | Positionnement | Public | Objectif de conversion | Template | CTA principal / secondaire |
|---|---|---|---|---|---|
| `/` | **Chargé de communication digitale polyvalent**, avec la preuve qu'il sait aussi construire la plateforme (web), et des bases en vidéo et en produits IA | Recruteurs (CDI, intégrer une équipe) et clients freelance | Obtenir un contact pour une mission freelance **ou** un poste en équipe | `creatif` | Voir mes réalisations / Me contacter |
| `/dev` | **Développeur web et mobile**, dont les rendus sont améliorés par sa formation en design et en produits IA | Clients et partenaires potentiels | **Collaborer sur des projets concrets** (peu de logique de candidature) | `developpeur` | Discutons de votre projet / Voir mes projets |
| `/design` | **Designer graphique** : affiches, flyers, identités, chartes graphiques, maquettes de site, visuels renforcés par l'IA | Recruteurs | **Postuler** : prouver qu'il réalise des rendus professionnels | `creatif` (variantes différentes de `/`) | Voir mes créations / Me contacter (+ Télécharger mon CV si renseigné) |
| `/video` | **Monteur vidéo débutant**, avec des projets dynamiques | Recruteurs et collaborateurs | Obtenir des **collaborations ou des stages** | `immersif` | Voir mes montages / Proposer une collaboration |

L'ancien profil `referent-digital` est **remplacé** : le rôle de communication digitale devient le positionnement principal (`/`). Le profil `/design` est ajouté.

## 2. Fiche par portfolio

### 2.1 `/` — Communication digitale polyvalente
- **Message :** communication digitale, création visuelle et développement web au même endroit ; de la stratégie à la plateforme qui la porte.
- **Ordre des sections :** `hero`, `projets`, `competences`, `apropos`, `parcours`, `contact` (toutes visibles).
- **Projets (à la une, 6 au plus) :** `demo-strategie-com-association`, `demo-visuels-reseaux-sociaux`, `demo-charte-marque-startup`, `demo-plateforme-communication`, `blog-wordpress-headless-nextjs`, `demo-teaser-evenement-culturel`. Le reste est visible via `/projets`.
- **Hero (proposition) :** titre « Communication digitale, création visuelle et développement web, au même endroit. » · sous-titre « Chargé de communication digitale polyvalent : stratégie, contenus, visuels, et la plateforme web pour les porter. »
- **À propos :** qui je suis (polyvalence) + bloc « Ce que je peux faire pour vous » en 3 points : piloter et produire vos contenus · concevoir vos visuels et votre identité · construire votre site ou plateforme.
- **Contact (titre et introduction) :** « Parlons de votre projet ou de votre équipe. » / « Mission freelance, poste en équipe ou simple question : écrivez-moi. »
- **Variantes :** hero `centre`, projets `grille`, parcours `onglets`.

### 2.2 `/dev` — Développeur web et mobile
- **Message :** applications web et mobiles fiables ; la formation en design et en produits IA affine chaque interface et accélère la production de visuels.
- **Ordre des sections :** `hero`, `projets`, `competences`, `apropos`, `parcours`, `contact`.
- **Projets :** les 7 projets web réels et `demo-plateforme-communication`. Projet à la une : le premier de la liste.
- **Hero (proposition) :** titre « Je développe des applications web et mobiles, avec un vrai soin du design. » · sous-titre « Développeur web et mobile · Laravel · React · Next.js · PostgreSQL. Ma formation en design et en produits IA affine chaque interface. »
- **À propos :** méthode en 4 étapes (comprendre, concevoir, développer, livrer) + bloc « L'apport du design et de l'IA » en 3 points : interfaces plus soignées · cohérence visuelle · visuels et contenus produits plus vite avec l'IA. **Aucun chiffre.**
- **Contact :** « Décrivez votre projet. » / « Application, site ou plateforme : discutons de ce que je peux construire pour vous. »
- **À ne pas faire :** pas de bouton CV, pas de ton de candidature.
- **Compétences :** ne pas citer de technologie mobile (Flutter, React Native…) non confirmée.

### 2.3 `/design` — Designer graphique
- **Message :** je réalise des identités visuelles, des affiches, des chartes graphiques, des maquettes de site et des visuels renforcés par l'IA.
- **Ordre des sections :** `hero`, `projets`, `apropos`, `parcours`, `contact` (`competences` masquée : le travail parle).
- **Projets (ordre) :** `demo-identite-cafe-artisanal`, `demo-affiches-festival-musique`, `demo-charte-marque-startup`, `demo-papeterie-carte-visite`, `demo-flyers-kakemonos-salon`, `demo-packaging-jus-locaux`, `demo-illustrations-mascotte-icones`, `demo-visuels-reseaux-sociaux`, `demo-visuels-boostes-ia`, `demo-maquette-site-vitrine`, `demo-maquette-app-depenses`, `demo-generateur-visuels-ia`.
- **Hero (proposition) :** titre « Je conçois des identités visuelles, des affiches et des supports qui se remarquent. » · sous-titre « Designer graphique : chartes graphiques, flyers, maquettes de site et visuels renforcés par l'IA. »
- **À propos (court) :** démarche en 4 étapes (brief, recherche, création, livraison) et types de supports réalisés.
- **Contact :** « Un poste, une mission, une question ? » / « Écrivez-moi. »
- **Bouton « Télécharger mon CV » :** affiché seulement si `SiteSettings.cvUrl` est renseigné.
- **Variantes :** hero `split`, projets `mur`, parcours `frise`.

### 2.4 `/video` — Monteur vidéo débutant
- **Message honnête :** je monte des vidéos dynamiques, je progresse, et je cherche à collaborer ou à faire un stage. Pas de promesse d'expertise.
- **Ordre des sections :** `hero`, `projets`, `apropos`, `contact` (`competences` et `parcours` masquées : trop peu d'éléments pour mériter une section).
- **Projets :** `demo-teaser-evenement-culturel`, `demo-clip-promotionnel-produit`, `demo-interview-webinaire`, `demo-maquette-app-depenses` (motion) si une animation est disponible, sinon les trois premiers seulement. **Peu de projets : la mise en page doit rester impeccable avec 3 éléments.**
- **Hero (proposition) :** titre « Je monte des vidéos dynamiques, et je cherche à collaborer. » · sous-titre « Monteur vidéo débutant : teasers, clips et interviews. Ouvert aux collaborations et aux stages. »
- **À propos :** où j'en suis, ce que j'ai appris (module montage vidéo et motion), ce que je recherche.
- **Contact :** « Une collaboration ou un stage ? » / « Je cherche à progresser sur de vrais projets vidéo. »
- **Variantes :** hero `objet3d`, projets `plein-cadre`.

## 3. Variantes par template

Ajout au modèle `Profile` : une colonne optionnelle `variants` (JSON), validée par Zod selon le template.

| Template | Section | Valeurs possibles | Défaut |
|---|---|---|---|
| `creatif` | hero | `centre` (symétrique, polaroids, icônes flottantes) · `split` (texte à gauche, collage de visuels à droite) | `centre` |
| `creatif` | projets | `grille` (cartes de verre 16:9) · `mur` (mur de visuels en maçonnerie, grandes images, titre au survol) | `grille` |
| `creatif` | parcours | `onglets` (onglets + frise verticale) · `frise` (frise horizontale compacte, sans onglets) | `onglets` |
| `developpeur` | toutes | format unique | n/a |
| `immersif` | hero | `objet3d` · `texte` | `objet3d` |
| `immersif` | projets | `rail` (rail horizontal épinglé) · `plein-cadre` (chaque projet en grand bloc empilé) | `rail` |

Un profil peut aussi personnaliser le **titre et l'introduction** de chaque section : chaque élément de `sections` accepte `titre?` et `intro?` (pas de migration, simple extension du JSON validé).
Le profil reçoit un champ `about` (JSON) : `{ titre, paragraphes[], points[{ titre, texte }] }`.

## 4. Formats de sections par template (aucune vue répétée)

| Section | `creatif` | `developpeur` | `immersif` |
|---|---|---|---|
| Hero | Centré ou split, verre, icônes flottantes | Asymétrique, portrait au cadre fin, sans carte flottante | Plein écran, objet 3D ou texte découpé |
| Projets | Grille de verre ou mur de visuels | Index en liste numérotée + vignette au survol, projet à la une | Rail épinglé ou blocs plein cadre |
| Compétences | Bento de verre en 3 blocs (Communication, Création, Développement) | Colonnes à filets (Langages, Frameworks, Données, Outils) | Bande de mots défilante + tuiles |
| À propos | Carte de verre + portrait + « Ce que je peux faire pour vous » | Deux colonnes + méthode en 4 étapes + « L'apport du design et de l'IA » | Panneau pleine largeur, grand texte, compteurs réels |
| Parcours | Onglets + frise verticale, ou frise horizontale | **Fiche CV éditoriale** : dates à gauche, détails à droite, filets, sans onglets | Rail horizontal d'étapes (si la section est affichée) |
| Contact | Carte de verre | Grande phrase d'invitation + formulaire | Plein écran sombre |

Aucun composant de présentation n'est partagé entre templates (voir `DESIGN.md`, section 4bis).

## 5. Parcours & Évolutions : en base, avec CRUD

### 5.1 Modèle `ParcoursItem` (migration additive, à décrire puis à faire valider)
Noms de champs selon les conventions du schéma (français).
- `type` : `formation` · `experience` · `certification`
- `titre`, `organisme`, `lieu` (optionnel)
- Période : début (année, mois optionnel), fin (année, mois optionnel), `enCours` (booléen). Représentation qui **trie correctement** et accepte l'année seule. « En cours » s'affiche « 2025 – Aujourd'hui ».
- `description` (texte, 600 caractères au plus)
- `tags` (liste de textes : modules, compétences)
- `badge` (texte optionnel, par exemple « Diplôme supérieur (Bac+3) »)
- `visible` (booléen), `ordre` (entier), `profilSlugs` (liste ; **vide = affiché sur tous les profils**)
- `createdAt`, `updatedAt`

### 5.2 CRUD dans le dashboard : `/admin/parcours`
- Liste groupée par type, avec recherche et filtre.
- Création et modification : tous les champs ci-dessus, cases à cocher pour les profils concernés (ou « tous »), validation Zod côté serveur, messages d'erreur clairs.
- **Réordonner avec des boutons haut/bas accessibles au clavier.**
- Masquer sans supprimer ; suppression avec confirmation.
- Entrée ajoutée au menu du back-office ; revalidation des pages publiques à chaque enregistrement.
- Fonction d'accès `getParcours(profilSlug)` : éléments visibles, filtrés par profil, triés.
- Le fichier statique `content/experience.ts` n'est plus utilisé (le retirer après validation).

### 5.3 Données de départ (réelles, d'après le CV et la capture du site)
**Descriptions : proposées par l'agent, à relire par Sylla** (le texte « programme d'excellence » vu sur la capture est à retirer : c'est une formule promotionnelle non vérifiable).

| Réf. | Type | Titre | Organisme | Période | `/` | `/dev` | `/design` | `/video` |
|---|---|---|---|---|---|---|---|---|
| F1 | formation | Formation « Pratique IA Product Creator » (3 projets d'entreprise ; modules : branding et identité visuelle, design graphique et illustration, montage vidéo et motion, stratégie de communication, produits IA et prompts avancés, maquettes Figma UI/UX, développement web moderne) | Simplon CI | 2025 – en cours | ✓ | ✓ | ✓ | ✓ |
| F2 | formation | Licence professionnelle Développeur Web (badge « Diplôme supérieur (Bac+3) ») | PIGIER CI | 2024 – 2025 | ✓ | ✓ | | |
| F3 | formation | BTS Informatique, option Développeur d'application (IDA) | ISFMI, Abidjan | 2021 – 2023 | ✓ | ✓ | | |
| F4 | formation | Baccalauréat série D | Lycée municipal 2 de Koumassi | 2020 – 2021 | ✓ | | | |
| E1 | expérience | Développeur web full stack (Laravel, React, Next.js), temps partiel | Service de freelance web | depuis janvier 2026 | ✓ | ✓ | | |
| E2 | expérience | Assistant technique / déploiement (ERP web d'assurance santé, formation des utilisateurs) | MUSCOP-CI | mars 2025 – mars 2026 | ✓ | ✓ | | |
| E3 | expérience | Développeur full stack junior, stage de validation de diplôme | Stratos-conseil | juillet – décembre 2024 | ✓ | ✓ | | |
| C1 | certification | Certificat en marketing digital | AJNV, Abidjan | à confirmer | ✓ | | ✓ | |
| C2 | certification | Prompt Engineering Generative AI for Marketing & Advertising | Orange Digital Center | à confirmer | ✓ | | ✓ | |
| C3 | certification | Certificat PHP – Laravel | OpenClassrooms, Orange Digital Center | à confirmer | ✓ | ✓ | | |
| C4 | certification | Web Development in React.js: Development Basics | Coursera, Orange Digital Center | à confirmer | ✓ | ✓ | | |
| C5 | certification | LangChain: Application Development Essentials | à confirmer | à confirmer | ✓ | ✓ | | |
| C6 | certification | Full-stack Development with Django: Managing Migrations | à confirmer | à confirmer | ✓ | ✓ | | |
| C7 | certification | Learn Object-Oriented Programming with PHP | à confirmer | à confirmer | ✓ | ✓ | | |
| C8 | certification | Formation intensive back-end Python/Django (conception, API, base de données) | à confirmer | à confirmer | ✓ | ✓ | | |

Les chevauchements de dates (Licence, Simplon, MUSCOP-CI, freelance) sont normaux si les activités étaient menées en parallèle : ne pas les « corriger ».

## 6. Changements de données (tous additifs, sur la branche de développement)

1. `ParcoursItem` (nouveau modèle) : étape R1.
2. `Profile.variants` (JSON, optionnel) et `Profile.about` (JSON, optionnel) ; `SiteSettings.cvUrl` (texte, optionnel, lien externe) : étape R2.
3. Extension du JSON `sections` (`titre?`, `intro?`) : sans migration, via Zod.

## 7. À confirmer par Sylla
1. Années de la Licence (2024–2025) et de Simplon (2025 – en cours) : affichées sur le site actuel, exactes ?
2. Dates et organismes des certifications C1 à C8.
3. Les trois projets d'entreprise de Simplon : titres, rôle, livrables, ce qui peut être montré.
4. Un lien vers ton CV (PDF hébergé) pour le bouton de `/design`.
5. Les logiciels réellement utilisés en graphisme et en vidéo.
