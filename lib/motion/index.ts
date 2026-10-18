"use client";

import { useEffect, useState, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Hook réactif détectant si l'utilisateur a activé l'accessibilité
 * prefers-reduced-motion dans son système d'exploitation.
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return reducedMotion;
}

export interface RevealOptions {
  duration?: number;
  delay?: number;
  y?: number;
  opacity?: number;
  ease?: string;
  trigger?: Element | string | null;
  start?: string;
}

/**
 * Utilitaire d'apparition soignée pour un élément simple.
 * Respecte instantanément prefers-reduced-motion en affichant l'élément sans transition.
 */
export function revealElement(
  element: HTMLElement | null,
  options: RevealOptions = {}
): gsap.core.Tween | null {
  if (!element) return null;

  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isReduced) {
    gsap.set(element, { opacity: 1, y: 0 });
    return null;
  }

  const {
    duration = 0.8,
    delay = 0,
    y = 25,
    opacity = 0,
    ease = "power3.out",
    trigger = element,
    start = "top 88%",
  } = options;

  gsap.set(element, { opacity, y });

  return gsap.to(element, {
    opacity: 1,
    y: 0,
    duration,
    delay,
    ease,
    scrollTrigger: trigger
      ? {
          trigger,
          start,
          toggleActions: "play none none none",
        }
      : undefined,
  });
}

/**
 * Utilitaire d'apparition échelonnée (stagger) pour une liste d'éléments (cartes, puces).
 */
export function revealList(
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  options: RevealOptions & { stagger?: number } = {}
): gsap.core.Tween | null {
  if (!elements || elements.length === 0) return null;

  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isReduced) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return null;
  }

  const {
    duration = 0.7,
    delay = 0,
    stagger = 0.08,
    y = 20,
    opacity = 0,
    ease = "power3.out",
    trigger = elements[0],
    start = "top 85%",
  } = options;

  gsap.set(elements, { opacity, y });

  return gsap.to(elements, {
    opacity: 1,
    y: 0,
    duration,
    delay,
    stagger,
    ease,
    scrollTrigger: trigger
      ? {
          trigger,
          start,
          toggleActions: "play none none none",
        }
      : undefined,
  });
}

/**
 * Découpe un texte DOM en mots enveloppés dans un conteneur masqué (overflow-hidden)
 * pour réaliser une révélation mot-par-mot (SplitText) sans dépendre d'un plugin externe propriétaire.
 */
export function splitTextWords(container: HTMLElement): HTMLElement[] {
  const text = container.textContent || "";
  const words = text.trim().split(/\s+/);

  container.innerHTML = "";
  const wordSpans: HTMLElement[] = [];

  words.forEach((word, index) => {
    const maskWrapper = document.createElement("span");
    maskWrapper.className = "inline-block overflow-hidden align-top mr-[0.28em]";

    const wordSpan = document.createElement("span");
    wordSpan.className = "inline-block transform-gpu";
    wordSpan.textContent = word;

    maskWrapper.appendChild(wordSpan);
    container.appendChild(maskWrapper);
    wordSpans.push(wordSpan);

    // Ajouter un espace après chaque mot sauf le dernier
    if (index < words.length - 1) {
      container.appendChild(document.createTextNode(" "));
    }
  });

  return wordSpans;
}

/**
 * Hook d'attraction magnétique discrète vers le curseur de souris (≤ 8px).
 * Désactivé automatiquement sur écran tactile et en mode mouvement réduit.
 */
export function useMagnetic<T extends HTMLElement>(
  strength = 0.35,
  maxOffset = 8
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Vérifier si l'appareil a un pointeur fin (souris / trackpad) et non tactile
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasFinePointer || isReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      // Clamping strict à maxOffset px
      const clampedX = Math.max(-maxOffset, Math.min(maxOffset, deltaX));
      const clampedY = Math.max(-maxOffset, Math.min(maxOffset, deltaY));

      gsap.to(element, {
        x: clampedX,
        y: clampedY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1.1, 0.4)",
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      gsap.set(element, { x: 0, y: 0 });
    };
  }, [strength, maxOffset]);

  return ref;
}

/**
 * Créateur de trigger de suivi de progression de défilement.
 */
export function createScrollProgressTrigger(
  target: HTMLElement | string,
  onProgress: (progress: number) => void
): ScrollTrigger | null {
  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isReduced) {
    onProgress(1);
    return null;
  }

  return ScrollTrigger.create({
    trigger: target,
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      onProgress(self.progress);
    },
  });
}
