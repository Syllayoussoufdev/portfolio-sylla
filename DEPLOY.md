# Guide de Déploiement & Configuration des Services Externes

Ce guide récapitule l'ensemble des configurations à réaliser sur les plateformes externes (Vercel, Resend, Google, Cloudinary, Registrar DNS) pour le portfolio **syllayoussouf.com**.

---

## 1. Vercel (Hébergement & Runtime)

Rendez-vous dans votre console **Vercel > Projet portfolio-sylla > Settings > Environment Variables** et renseignez les variables suivantes pour l'environnement **Production** (et **Preview** si souhaité) :

| Variable | Description | Exemple / Valeur |
|---|---|---|
| `DATABASE_URL` | URL de connexion Neon poolée (`-pooler`) | `postgresql://user:pass@ep-...-pooler.aws.neon.tech/neondb?sslmode=require` |
| `DATABASE_URL_UNPOOLED` | URL de connexion Neon directe (sans `-pooler`) | `postgresql://user:pass@ep-...aws.neon.tech/neondb?sslmode=require` |
| `AUTH_SECRET` | Secret de chiffrement JWT de session (32+ caractères) | Chaîne aléatoire sécurisée |
| `ADMIN_EMAIL` | Adresse e-mail de connexion à l'administration | `contact@syllayoussouf.com` |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt du mot de passe admin fort | Voir section 6 ci-dessous |
| `CLOUDINARY_CLOUD_NAME` | Nom de votre cloud Cloudinary | `sylla-portfolio` |
| `CLOUDINARY_API_KEY` | Clé d'API Cloudinary | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Clé secrète Cloudinary (strictement serveur) | Clé secrète Cloudinary |
| `RESEND_API_KEY` | Clé API Resend | `re_123456789...` |
| `CONTACT_EMAIL` | Adresse où recevoir les messages du formulaire | `contact@syllayoussouf.com` |
| `CONTACT_FROM_EMAIL` | Adresse d'expédition des notifications | `onboarding@resend.dev` (ou `contact@syllayoussouf.com`) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Identifiant de flux Google Analytics 4 | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_SITE_URL` | URL racine canonique du site | `https://syllayoussouf.com` |

---

## 2. Resend (Envoi des E-mails du formulaire de contact)

1. **Création de compte :** Rendez-vous sur [resend.com](https://resend.com) et créez votre compte.
2. **Clé d'API :** Allez dans **API Keys > Create API Key**, copiez la clé (`re_...`) et collez-la dans la variable `RESEND_API_KEY` sur Vercel.
3. **Configuration du domaine personnalisé (Recommandé) :**
   - Dans Resend, allez dans **Domains > Add Domain** et entrez `syllayoussouf.com`.
   - Resend vous fournit 3 enregistrements DNS :
     - `TXT` (SPF)
     - `TXT` (DKIM)
     - `MX` (Feedback)
   - Copiez ces enregistrements dans la zone DNS de votre registrar (OVH, Hostinger, Namecheap...).
   - Cliquez sur **Verify DNS Records**.
   - Une fois validé, modifiez sur Vercel :
     ```env
     CONTACT_FROM_EMAIL="contact@syllayoussouf.com"
     ```

---

## 3. Google Analytics 4 (GA4)

1. Rendez-vous sur [analytics.google.com](https://analytics.google.com).
2. Créez un compte et une propriété : **Portfolio Sylla**.
3. Créez un **Flux de données Web** avec l'URL : `https://syllayoussouf.com`.
4. Récupérez votre **ID de mesure** (commençant par `G-`).
5. Ajoutez la variable dans Vercel :
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
   ```
6. Redéployez. Le bandeau de consentement aux cookies activera automatiquement GA4 et remontera vos KPIs personnalisés dès qu'un visiteur accepte.

---

## 4. Google Search Console (Indexation & SEO)

1. Rendez-vous sur [search.google.com/search-console](https://search.google.com/search-console).
2. Ajoutez la propriété de type Domaine : `syllayoussouf.com`.
3. Validez la propriété via l'enregistrement DNS `TXT` demandé chez votre registrar.
4. Une fois validé, allez dans le menu **Sitemaps** et soumettez :
   ```
   https://syllayoussouf.com/sitemap.xml
   ```
   Google va explorer automatiquement toutes vos pages, profils et réalisations.

---

## 5. Cloudinary (Gestion de la Médiathèque)

1. Rendez-vous sur [cloudinary.com](https://cloudinary.com).
2. Dans la **Media Library**, créez les deux dossiers de rangement :
   - `portfolio/projets`
   - `portfolio/profils`
3. Allez dans **Settings > Access Keys** pour récupérer le `Cloud Name`, la `API Key` et l'`API Secret` à reporter dans Vercel.

---

## 6. Génération du Mot de Passe Administrateur

Pour sécuriser l'accès au back-office `/admin`, ne stockez jamais de mot de passe en clair. Générez un hash bcrypt avec la commande locale suivante dans le terminal :

```bash
npx tsx -e "import bcrypt from 'bcryptjs'; console.log(bcrypt.hashSync('VOTRE_MOT_DE_PASSE_FORT_ICI', 10));"
```

Copiez le résultat (commençant par `$2a$10$...` ou `$2b$10$...`) et collez-le dans la variable `ADMIN_PASSWORD_HASH` sur Vercel.
