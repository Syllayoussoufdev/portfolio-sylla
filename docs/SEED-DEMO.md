# SEED-DEMO — Données de départ du portfolio (à placer dans `docs/`)

Spécification des données à insérer dans la base de **développement** pour tester les trois templates. Elle sépare les données **réelles** (issues du CV et de l'ancien portfolio de Sylla) des données **de démonstration** (fictives, facilement supprimables).

## 0. Règles

1. **Base visée : la branche Neon de développement uniquement.** Jamais la production.
2. **Aucune suppression, aucun `reset`.** Le seed ne fait que créer ou mettre à jour (`upsert` par `slug`). Il est **idempotent** : le relancer ne crée aucun doublon.
3. **Sécurité d'exécution.** Par défaut, le script est en **simulation** (il affiche ce qu'il ferait et les compteurs avant/après, sans écrire). Il n'écrit qu'avec l'option `--apply`. Il affiche l'hôte de la base **sans identifiant ni mot de passe**.
4. **Pas de coordonnées personnelles dans le dépôt** : ni téléphone, ni e-mail, ni liens de réseaux dans le seed. Sylla les saisit dans `/admin/reglages`.
5. **Aucun lien inventé** (Canva, Figma, GitHub, YouTube…) : les liens restent vides. **Aucune image inventée** : pas de couverture, les templates affichent leur composition de remplacement. Sylla téléversera des visuels de test via la médiathèque.
6. **Aucun chiffre, résultat, client ni certification inventé.** Les marques des projets de démonstration sont **fictives et non nommées** (« une marque de café fictive »). Pas de métriques (pas de « +40 % d'engagement »).
7. **Outils :** ne citer que ceux de la liste autorisée : Canva, Figma, Next.js, React, Laravel, PHP, JavaScript, MySQL, PostgreSQL, Prisma, WordPress, Git. Pour la retouche d'image, l'illustration et le montage vidéo, **ne nommer aucun logiciel** tant que Sylla ne les a pas confirmés.
8. **Conventions de nommage du schéma existant** (`titre`, `actif`, `ordre`, `visible`, `featured`…) : lire `schema.prisma`, ne rien supposer.
9. **Repérage des données de démonstration :** tout projet de démonstration a un `slug` qui commence par **`demo-`**. Le script de suppression (section 6) ne cible que ce préfixe.

## 1. Données réelles à importer

### 1.1 Réglages du site (`SiteSettings`)
- Nom affiché : **Sylla Youssouf**
- Ligne de métier (proposition) : **Communication digitale · Design · Développement web**
- E-mail public, WhatsApp, réseaux : **laisser vides**.

### 1.2 Parcours : fichier statique `content/experience.ts`
Un seul fichier, trois types d'entrées : `experience`, `formation`, `certification`. Plus récent en premier.

**Expériences (source : CV actualisé)**
- **Service de Freelance Web — Développeur web full stack (Laravel, React, Next.js)** · depuis janvier 2026 · temps partiel. Conception, réalisation et publication de sites pour des particuliers ; Laravel, React.js, Next.js ; initiation à Docker pour faciliter le développement et le déploiement de ses projets.
- **MUSCOP-CI (Mutuelle du Corps Préfectoral de Côte d'Ivoire) — Assistant technique / déploiement** · mars 2025 à mars 2026 (1 an). Déploiement d'un ERP web d'assurance santé dans les centres médicaux sur le territoire national ; formation des utilisateurs de la plateforme.
- **Stratos-conseil — Développeur full stack junior (stage de validation de diplôme)** · juillet à décembre 2024 (6 mois). Participation à deux applications web en architecture MVC (Symfony, Laravel) ; interfaces responsives (Vue.js, templates) ; suivi de projet, correction de bugs, documentation ; bonnes pratiques Git/GitHub.
  *(L'ancien portfolio indiquait 2023–2024 : le CV actualisé fait foi.)*

**Formations**
- **Formation « Pratique IA Product Creator » — Simplon** · période **à renseigner**. Trois projets majeurs d'entreprise (**à détailler par Sylla**) et développement des compétences du module : branding, design graphique (logo, illustration…), montage vidéo, stratégie de communication, produit IA et son usage, communication digitale, maquettes Figma, développement web.
- **Licence professionnelle — PIGIER CI** · année et spécialité **à renseigner** *(orthographe « PIGIER » à confirmer)*.
- **BTS Informatique, option Développeur d'application (IDA) — ISFMI, Abidjan (Plateau)** · 2021 – 2023.
- **Baccalauréat série D — Lycée municipal 2 de Koumassi** · 2020 – 2021.

**Certifications (source : CV et ancien portfolio, dates à confirmer)**
- Certificat en marketing digital — AJNV (Association des Jeunes pour la Nouvelle Vision), Abidjan. Stratégies de marketing digital, réseaux sociaux, référencement, campagnes en ligne.
- Certificat PHP – Laravel — OpenClassrooms et Orange Digital Center, Abidjan.
- Prompt Engineering Generative AI for Marketing & Advertising — Orange Digital Center, Abidjan.
- Web Development in React.js: Development Basics — Coursera, en partenariat avec Orange Digital Center, Abidjan.
- LangChain: Application Development Essentials.
- Full-stack Development with Django: Managing Migrations.
- Learn Object-Oriented Programming with PHP.
- Formation intensive back-end Python/Django (conception, API, gestion de base de données).

**Langues :** français (natif), anglais (B1).

Toute date non confirmée est notée « à confirmer » dans le fichier et dans le rapport.

### 1.3 Compétences (sans aucun pourcentage)
Vérifier d'abord où la page admin « Compétences & Outils » stocke ses données (base ou fichier), et utiliser cet emplacement.
- **Communication et création :** branding · design graphique (logo, identité visuelle, illustration) · stratégie de communication · communication digitale · montage vidéo · maquettes Figma · création et usage de produits IA.
- **Développement :** Laravel · PHP · React · Next.js · JavaScript · API REST · FastAPI · LangChain.
- **Données :** PostgreSQL · MySQL · SQL Server · modélisation Merise/UML.
- **Outils et déploiement :** Git/GitHub · Docker · Linux · Swagger.

### 1.4 Projets web réels (domaine : « Développement Web »)
Source : ancien portfolio. Aucun lien, aucune image. Stack **à confirmer** par Sylla (les étiquettes de l'ancien portfolio étaient incohérentes).

| slug | titre | statut | description | tags techniques |
|---|---|---|---|---|
| `portfolio-cv-personnel` | Portfolio CV personnel | Publié | Portfolio en ligne présentant mes compétences, mon parcours et mes projets. | React, JavaScript, Git |
| `systeme-gestion-recrutements` | Système de gestion des recrutements | Terminé | Application web pour gérer les processus de recrutement, de la publication des offres au suivi des candidatures. | MySQL |
| `application-gestion-taches` | Application de gestion de tâches | Terminé | Application pour aider les utilisateurs à organiser leurs tâches quotidiennes. | Laravel, React, MySQL |
| `site-freelance-personnel` | Site de freelance personnel | En cours | Site pour présenter mes services de freelance et faciliter les échanges avec les clients. | Laravel, JavaScript, Git |
| `blog-wordpress-headless-nextjs` | Blog WordPress headless et Next.js | En cours | Blog dont WordPress est le back-end et Next.js le front-end, pour de meilleures performances. | WordPress, Next.js, MySQL |
| `site-full-services-point-sarl` | Site web Full Services Point SARL, Abidjan | Terminé | Site web pour une entreprise de services complets basée à Abidjan. | Laravel, React |
| `site-mashar-immobilier` | Site web Mashar Immobilier, Abidjan | Terminé | Site web pour une entreprise d'immobilier basée à Abidjan. | Laravel, JavaScript |

Mettre le statut dans le champ `contenu` si le modèle n'a pas de champ dédié. `featured = true` pour `blog-wordpress-headless-nextjs` et `systeme-gestion-recrutements`.

## 2. Projets de démonstration (fictifs, préfixe `demo-`)

Pour chacun : `titre`, `slug`, domaine(s), `description` d'une phrase (ci-dessous) et un `contenu` rédigé par l'agent : **60 à 90 mots**, structuré en contexte, objectif, démarche, livrables, avec la mention « projet test réalisé dans le cadre de la formation ». Pas de métrique, pas de marque réelle. `visible = true`. `ordre` croissant dans l'ordre du tableau.

Domaines autorisés (tags) : `Design Graphique`, `Branding & Stratégie Com`, `Communication digitale`, `Montage Vidéo`, `Design UI/UX & Motion`, `IA Product Creator`, `Développement Web`.

| slug | titre | domaines | description | à la une |
|---|---|---|---|---|
| `demo-identite-cafe-artisanal` | Logo et identité visuelle, marque de café artisanal (projet test) | Design Graphique, Branding & Stratégie Com | Logo, palette et charte d'usage pour une marque de café fictive. | oui |
| `demo-affiches-festival-musique` | Série d'affiches, festival de musique (projet test) | Design Graphique | Affiches grand format, déclinaisons pour réseaux sociaux et bannières pour un festival fictif. | oui |
| `demo-illustrations-mascotte-icones` | Illustrations vectorielles : mascotte et jeu d'icônes | Design Graphique | Mascotte illustrée et jeu d'icônes cohérent pour une application fictive. | non |
| `demo-flyers-kakemonos-salon` | Flyers et kakémonos, salon professionnel (projet test) | Design Graphique | Supports imprimés pour un stand : flyer, kakémono, carte de visite. | non |
| `demo-packaging-jus-locaux` | Packaging, gamme de jus locaux (projet test) | Design Graphique | Étiquettes et déclinaison de gamme pour une marque de jus fictive. | non |
| `demo-visuels-reseaux-sociaux` | Visuels pour réseaux sociaux, campagne de lancement (projet test) | Design Graphique, Communication digitale | Carrousels, stories et publications pour le lancement d'un produit fictif. | non |
| `demo-charte-marque-startup` | Brand book, startup de livraison (projet test) | Branding & Stratégie Com | Positionnement, ton de voix, charte graphique et règles d'usage d'une startup fictive. | oui |
| `demo-strategie-com-association` | Stratégie de communication digitale, association (projet test) | Branding & Stratégie Com, Communication digitale | Diagnostic, cibles, canaux et plan d'actions sur 90 jours pour une association fictive. | non |
| `demo-calendrier-editorial-boutique` | Calendrier éditorial, boutique en ligne (projet test) | Communication digitale | Plan de contenus mensuel, formats et indicateurs de suivi pour une boutique fictive. | non |
| `demo-teaser-evenement-culturel` | Teaser de 30 secondes, événement culturel (projet test) | Montage Vidéo | Montage dynamique rythmé par le son pour annoncer un événement fictif. | oui |
| `demo-clip-promotionnel-produit` | Clip promotionnel, lancement de produit (projet test) | Montage Vidéo | Clip court présentant un produit fictif, avec habillage et titrage. | non |
| `demo-interview-webinaire` | Interview montée et sous-titrée, webinaire (projet test) | Montage Vidéo | Montage d'un entretien avec sous-titres et habillage pour un webinaire fictif. | non |
| `demo-maquette-app-depenses` | Maquette mobile Figma, application de suivi de dépenses (projet test) | Design UI/UX & Motion | Parcours utilisateur, maquettes et prototype interactif d'une application fictive. | oui |
| `demo-design-system-formation` | Design system et prototype, plateforme de formation (projet test) | Design UI/UX & Motion | Composants, règles d'usage et prototype pour une plateforme fictive. | non |
| `demo-generateur-visuels-ia` | Générateur de visuels publicitaires par IA (projet test) | IA Product Creator, Communication digitale | Pipeline de génération de visuels à partir de prompts calibrés et de scripts. | oui |
| `demo-assistant-redaction-com` | Assistant de rédaction pour la communication (projet test) | IA Product Creator, Communication digitale | Prototype proposant des textes de publications selon le ton d'une marque fictive. | non |

### 2.1 Trois projets d'entreprise (Simplon) : **masqués** tant qu'ils ne sont pas détaillés
Créer 3 projets avec `visible = false`, `slug` : `entreprise-projet-1`, `entreprise-projet-2`, `entreprise-projet-3`, titre « Projet d'entreprise n°N, titre à renseigner », description « Projet réalisé pendant la formation Pratique IA Product Creator (Simplon). Détails à renseigner. », tag `a-renseigner`. Sylla fournira les vrais titres, rôles et livrables ; ils n'apparaîtront qu'après.

## 3. Profils et sous-portfolios

Créer, pour chaque ligne, un `SubPortfolio` (sauf le profil par défaut), les liaisons `SubPortfolioProject` ordonnées, et le `Profile` correspondant. **Slugs vérifiés** contre la liste des slugs réservés.

| Profil (slug) | Libellé | Template | Projets affichés |
|---|---|---|---|
| `default` (page `/`) | Accueil | `creatif` | Tous les projets visibles |
| `dev` | Développeur web | `developpeur` | Les 7 projets web réels |
| `referent-digital` | Référent digital | `creatif` | Design Graphique (6), Branding & Stratégie Com (3 : brand book, stratégie, calendrier), IA Product Creator (2) |
| `video` | Monteur vidéo | `immersif` | Montage Vidéo (3) et Design UI/UX & Motion (2) |

Pour chaque profil : `accent = "default"`, `actif = true`, `sections` : `hero`, `projets`, `competences`, `apropos`, `parcours`, `contact`, toutes visibles, dans cet ordre.

**Textes du Hero : propositions de départ, modifiables dans le dashboard** (à signaler comme telles dans le rapport). Boutons : principal vers `/projets` pour le profil par défaut et vers `#projets` pour les sous-portfolios ; secondaire vers `/contact`. `media.kind = "abstract"`. Aucune mention de disponibilité, d'années d'expérience ni de délai de réponse.

| Profil | Titre | Sous-titre | Bouton principal / secondaire |
|---|---|---|---|
| `default` | Je crée des identités, des contenus et des expériences numériques. | Communication digitale, design graphique et développement web, de l'idée à la mise en ligne. | Voir mes réalisations / Me contacter |
| `dev` | Je conçois et développe des applications web fiables. | Développeur web full stack · Laravel · React · Next.js · PostgreSQL | Voir mes projets / Me contacter |
| `referent-digital` | Votre présence digitale, de la stratégie au visuel. | Référent digital : communication digitale, branding, design graphique et usage de l'IA. | Voir mes projets / Discutons de votre projet |
| `video` | Des images qui bougent, un récit qui tient. | Montage vidéo, motion et direction visuelle. | Voir mes projets / Me contacter |

## 4. Résultat attendu après le seed
Projets : 7 réels + 16 de démonstration + 3 masqués = **26** · SubPortfolios : 3 · Profils : 4 · SiteSettings : 1.
Les compteurs réels sont comparés à ces chiffres dans le rapport.

## 5. Script
- Commande : `npm run seed:demo` (simulation) et `npm run seed:demo -- --apply` (écriture). Réutiliser le seed existant des profils s'il existe, sans le dupliquer.
- Affiche : hôte masqué, état `prisma migrate status`, ce qui sera créé ou mis à jour, compteurs avant et après.
- Refuse de s'exécuter si `NODE_ENV=production`.

## 6. Suppression des données de démonstration (à écrire maintenant, à ne pas exécuter)
`npm run seed:demo:remove` : liste en simulation les projets dont le `slug` commence par `demo-` et leurs liaisons ; ne supprime qu'avec `--apply` **et** après confirmation explicite. Ne touche jamais aux projets réels, aux profils ni aux réglages. Elle sera utilisée à l'étape 11 de la roadmap.

## 7. Rapport attendu
Fichiers créés ou modifiés · compteurs avant et après · liste des données **réelles** importées · liste des données **de démonstration** · éléments marqués « à confirmer » · rien d'exécuté sans `--apply`.

## 8. À confirmer par Sylla (n'empêche pas le seed)
1. Orthographe « PIGIER CI », année et spécialité de la Licence professionnelle.
2. Période de la formation Simplon, et les trois projets d'entreprise (titre, rôle, livrables, ce qui peut être montré).
3. Logiciels réellement utilisés en design graphique, illustration et montage vidéo.
4. Stack exacte des 7 projets web réels.
5. Dates des certifications.
6. Profil supplémentaire `/design` (graphiste) à ajouter ou non.
