"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

// Enregistrement unique et global des plugins GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface MotionContextType {
  lenis: Lenis | null;
  isReducedMotion: boolean;
}

const MotionContext = createContext<MotionContextType>({
  lenis: null,
  isReducedMotion: false,
});

export function useMotion() {
  return useContext(MotionContext);
}

interface MotionProviderProps {
  children: React.ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Détection de prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => {
      setIsReducedMotion(mediaQuery.matches);
    };

    updateReducedMotion();
    mediaQuery.addEventListener("change", updateReducedMotion);

    // Si mouvement réduit demandé, ne pas activer le défilement cinétique Lenis
    if (mediaQuery.matches) {
      return () => {
        mediaQuery.removeEventListener("change", updateReducedMotion);
      };
    }

    // 2. Initialisation de Lenis pour un défilement fluide et naturel
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // 3. Synchronisation bidirectionnelle Lenis <-> GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Rafraîchir ScrollTrigger après chargement des polices et images
    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    // 4. Nettoyage complet au démontage
    return () => {
      mediaQuery.removeEventListener("change", updateReducedMotion);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <MotionContext.Provider value={{ lenis: lenisInstance, isReducedMotion }}>
      {children}
    </MotionContext.Provider>
  );
}
