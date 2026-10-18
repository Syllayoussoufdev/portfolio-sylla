# Politique de Sécurité — Portfolio Sylla

Ce document consigne l'ensemble des règles de sécurité obligatoires régissant le développement, le déploiement et l'exploitation de **Portfolio Sylla**.

---

## 1. Gestion des Secrets & Variables d'Environnement

* **Protection locale absolue :**
  * Le fichier `.env` ne doit **JAMAIS** être versionné, commité ou partagé.
  * La règle `.env*` dans `.gitignore` doit rester active et vérifiée régulièrement (`git check-ignore .env`).
  * Tout secret ou clé d'API doit être documenté sous forme générique dans `.env.example`.
* **Principe du moindre privilège pour le préfixe `NEXT_PUBLIC_` :**
  * Seules les variables strictement indispensables au navigateur (ex: domaine public) peuvent être préfixées par `NEXT_PUBLIC_`.
  * `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEXTAUTH_SECRET`, `RESEND_API_KEY`, et `CLOUDINARY_API_SECRET` doivent **impérativement rester privées côté serveur**.
* **Déploiement Vercel :**
  * Injection directe des variables via les paramètres d'environnement chiffrés du projet Vercel, sans aucun stockage en dur dans le code.

---

## 2. Authentification & Gestion des Sessions Admin

* **Accès Administrateur Unique :**
  * Seul Sylla Youssouf dispose des droits d'accès au dashboard `/admin`.
  * Pas d'inscription publique possible (`sign-up` désactivé).
* **Mots de passe & Chiffrement :**
  * Aucun mot de passe en clair. En cas de stockage en base ou de vérification par variable, utiliser systématiquement un algorithme moderne et lent (`bcrypt` avec minimum 12 rounds ou `argon2id`).
* **Cookies de Session :**
  * Balises de sécurité obligatoires : `HttpOnly` (inaccessible au JavaScript client, immunité XSS), `Secure` (transmission exclusive HTTPS), et `SameSite=Lax` ou `Strict` (protection CSRF).
* **Délai d'expiration :**
  * Expiration automatique des sessions inactives.

---

## 3. Autorisations Côté Serveur & Server Actions

* **Ne jamais faire confiance au client :**
  * Ne pas se reposer uniquement sur la protection visuelle ou le middleware côté client.
  * **Chaque Server Action** effectuant une mutation (`createProject`, `updateProject`, `deleteProject`, `createSubPortfolio`, etc.) doit vérifier formellement la validité de la session d'authentification avant d'exécuter la moindre requête Prisma.
* **Middleware Next.js :**
  * Interception globale de toutes les routes `/admin/*` pour rediriger les requêtes non authentifiées vers `/admin/login`.

---

## 4. Validation des Entrées (Input Validation) & Assainissement

* **Schémas de validation Zod stricts :**
  * Toutes les données reçues via les formulaires (Formulaire de contact, formulaires du dashboard) doivent être parsées et validées par un schéma Zod côté serveur avant traitement.
* **Format des Slugs (`Project` et `SubPortfolio`) :**
  * Validation stricte par expression régulière : `^[a-z0-9-]+$` pour éviter toute faille de traversée de chemin (*path traversal*) ou corruption d'URL.
* **Protection contre les Injections SQL :**
  * Toutes les requêtes en base transitent par Prisma ORM, qui utilise des requêtes préparées paramétrées natives éliminant les risques d'injections SQL.
  * Interdiction d'utiliser `$queryRawUnsafe` avec des chaînes de caractères interpolées dynamiquement.
* **Protection XSS :**
  * Les champs textuels (descriptions, messages) sont assainis et échappés par React lors du rendu. Le rendu de HTML brut (`dangerouslySetInnerHTML`) est proscrit sauf pour des composants d'embeds médias contrôlés et nettoyés.

---

## 5. Protection de la Vie Privée & Données Visiteurs (RGPD)

* **Règle absolue sur les adresses IP :**
  * **Aucune adresse IP ne doit être stockée en clair dans la table `Visit`.**
  * Mécanisme obligatoire : hachage cryptographique non réversible avec sel secret :
    ```typescript
    const anonymizedIp = crypto
      .createHash('sha256')
      .update(rawIp + process.env.ANALYTICS_SALT)
      .digest('hex');
    ```
* **Absence de traceurs tiers :**
  * Le portfolio n'embarque aucun script publicitaire, pixel de tracking ou cookie tiers (pas de Google Analytics / Meta Pixel en V0).

---

## 6. Sécurité de la Base de Données (Neon PostgreSQL)

* **Chiffrement du transport :**
  * Toutes les chaînes de connexion requièrent impérativement `sslmode=require`.
* **Isolation des branches Neon :**
  * Les commandes de développement et tests doivent impérativement cibler la branche Neon `dev`.
  * La branche Neon `main` (production) ne doit être mise à jour qu'au moment du déploiement via un pipeline sécurisé.
