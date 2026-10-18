# Architecture & Moteur de Mouvement — Portfolio Sylla

Ce document détaille l'infrastructure de mouvement et de 3D mise en place à l'**Étape 5** de la Phase 2bis.  
Elle constitue le socle partagé par les trois templates (`creatif`, `developpeur`, `immersif`).

---

## 1. Principes Fondamentaux & Règles d'Or

1. **Une seule bibliothèque d'animation :** GSAP (v3) + ScrollTrigger, couplé à Lenis pour le défilement fluide.  
   Framer Motion (`motion`) a été complètement désinstallé du projet pour alléger le bundle client et éviter la dispersion technique.
2. **Three.js « Pur » conservé :** Pas d'intégration de wrappers lourds (R3F/Drei) sans justification formelle. Le composant Three.js pur garantit une compatibilité native parfaite avec React 19.3 et Next.js 16 (Turbopack).
3. **Respect absolu de `prefers-reduced-motion` :** Tout visiteur ayant configuré la réduction de mouvement dans son OS bénéficie d'un affichage immédiat, stable, sans défilement cinétique ni boucle d'animation GPU continue.
4. **Zéro décalage de mise en page (CLS < 0,1) :** Les animations manipulent exclusivement `transform` (`x`, `y`, `scale`, `rotation`) et `opacity`. Aucune propriété géométrique (`width`, `height`, `top`, `left`) n'est animée.
5. **Gestion saine de la mémoire :** Tout effet, écouteur, ScrollTrigger ou ressource WebGL (`dispose()`) est nettoyé au démontage du composant.

---

## 2. Fournisseur de Mouvement (`components/motion/MotionProvider.tsx`)

Le `MotionProvider` est monté au niveau du `RootLayout` (`app/layout.tsx`).

### Rôle et Mécanique
- **Enregistrement unique :** Exécute `gsap.registerPlugin(ScrollTrigger, useGSAP)` une seule fois au chargement client.
- **Synchronisation Lenis $\leftrightarrow$ ScrollTrigger :**
  ```ts
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
- **Détection d'accessibilité :** Si `prefers-reduced-motion: reduce` est actif, Lenis est désactivé et le défilement natif standard est préservé.
- **Nettoyage automatique :** À la destruction, Lenis est détruit (`destroy()`), le ticker GSAP est retiré et tous les triggers orphelins sont tués.

### Utilisation dans un composant client
```tsx
import { useMotion } from "@/components/motion/MotionProvider";

export function MonComposant() {
  const { lenis, isReducedMotion } = useMotion();
  // ...
}
```

---

## 3. Utilitaires de Mouvement (`lib/motion/index.ts`)

### 3.1 Détection réactive du mouvement réduit : `useReducedMotion()`
Permet d'adapter dynamiquement un composant ou de court-circuiter une logique interactive :
```tsx
const isReduced = useReducedMotion();
```

### 3.2 Révélation d'un élément simple : `revealElement()`
Anime un élément en fondu-glissement à l'arrivée dans la fenêtre :
```tsx
import { revealElement } from "@/lib/motion";

useEffect(() => {
  revealElement(elementRef.current, {
    y: 25,
    duration: 0.8,
    ease: "power3.out",
    start: "top 85%",
  });
}, []);
```

### 3.3 Révélation échelonnée : `revealList()`
Pour faire apparaître des cartes, vignettes ou puces en cascade ordonnée :
```tsx
import { revealList } from "@/lib/motion";

useEffect(() => {
  revealList(cardsNodeList, {
    stagger: 0.08,
    duration: 0.7,
    y: 20,
  });
}, []);
```

### 3.4 Révélation mot-à-mot (SplitText) : `splitTextWords()`
Découpe proprement le texte d'un conteneur en mots masqués dans des spans d'overflow :
```tsx
import { splitTextWords, revealList } from "@/lib/motion";

useEffect(() => {
  if (titreRef.current) {
    const words = splitTextWords(titreRef.current);
    revealList(words, { stagger: 0.05, duration: 0.7 });
  }
}, []);
```

### 3.5 Micro-interaction magnétique : `useMagnetic()`
Attire subtilement un bouton ou une icône vers le pointeur de la souris (force bornée à $\le 8\text{ px}$) avec retour élastique. Désactivé automatiquement sur écran tactile et en mode mouvement réduit :
```tsx
import { useMagnetic } from "@/lib/motion";

export function BoutonAction() {
  const magneticRef = useMagnetic<HTMLButtonElement>(0.35, 8);

  return (
    <button ref={magneticRef} className="...">
      Me contacter
    </button>
  );
}
```

### 3.6 Suivi de progression de défilement : `createScrollProgressTrigger()`
Lie un callback de progression (0 à 1) à la visibilité d'un conteneur avec GSAP ScrollTrigger :
```tsx
const trigger = createScrollProgressTrigger(containerRef.current, (progress) => {
  console.log(`Progression : ${progress * 100}%`);
});
```

---

## 4. Composant 3D à la Demande (`components/3d/Scene3D.tsx`)

Un composant Three.js purement autonome, sécurisé et performant.

### Spécifications & Optimisations :
1. **Contrôle WebGL préalable (`isWebGLAvailable()`) :** Vérifie que le navigateur et le matériel supportent WebGL avant d'instancier un canvas.
2. **Plafonnement DPR :** Limité à 1.5 sur grand écran et 1.0 sur mobile pour préserver la batterie et le GPU.
3. **Mise en pause hors-écran (IntersectionObserver) :**  
   Dès que le conteneur 3D quitte le champ de vision (seuil 5%), la boucle `requestAnimationFrame` s'interrompt immédiatement. La consommation processeur retombe à zéro.
4. **Repli propre :** Si WebGL est absent, un visuel ou un placeholder vectoriel de secours est rendu sans faire crasher la page.
5. **Formes supportées :** `icosahedron`, `torus`, `abstract` (TorusKnot).

```tsx
import { Scene3D } from "@/components/3d/Scene3D";

<Scene3D
  shape="icosahedron"
  color="#2563EB"
  wireframe={true}
  speed={1}
  fallbackImage="/placeholders/hero-3d.png"
/>
```

---

## 5. Page de Démonstration (`/motion-demo`)

Une page de laboratoire interactive est disponible à l'URL :
**`http://localhost:3000/motion-demo`**

> **Protection de production :**  
> La page contient un contrôle strict :  
> `if (process.env.NODE_ENV === "production") notFound();`  
> Elle est donc automatiquement invisible et inaccessible sur les builds de production Vercel (renvoie une erreur 404).

Elle permet de tester et visualiser en conditions réelles :
- Le défilement fluide Lenis synchronisé.
- La révélation mot par mot (SplitText).
- L'attraction magnétique sur les boutons.
- La scène 3D avec basculement de formes et simulation de panne WebGL.
- Le suivi de progression ScrollTrigger.
