"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, AlertCircle } from "lucide-react";

/**
 * Vérifie de façon synchrone et sécurisée si le contexte WebGL est supporté.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

interface Scene3DProps {
  className?: string;
  shape?: "icosahedron" | "torus" | "abstract";
  color?: string;
  wireframe?: boolean;
  speed?: number;
  fallbackImage?: string;
}

export function Scene3D({
  className = "w-full h-full",
  shape = "icosahedron",
  color = "#2563EB",
  wireframe = true,
  speed = 1,
  fallbackImage,
}: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // 1. Détection WebGL
    const webglSupported = isWebGLAvailable();
    setHasWebGL(webglSupported);

    if (!webglSupported || !containerRef.current) return;

    // 2. Vérification prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // 3. Initialisation de la scène Three.js pure
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(width, height);
    // Limite stricte du DPR à 1.5 sur desktop et 1 sur mobile
    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5));
    container.appendChild(renderer.domElement);

    // 4. Géométrie selon la prop shape
    let geometry: THREE.BufferGeometry;
    switch (shape) {
      case "torus":
        geometry = new THREE.TorusGeometry(1.2, 0.35, 16, 50);
        break;
      case "abstract":
        geometry = new THREE.TorusKnotGeometry(0.9, 0.28, 64, 16);
        break;
      case "icosahedron":
      default:
        geometry = new THREE.IcosahedronGeometry(1.4, 1);
        break;
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      wireframe,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Éclairages doux
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(new THREE.Color(color), 2.5, 50);
    pointLight.position.set(3, 4, 3);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0xffffff, 1.2, 50);
    backLight.position.set(-3, -2, -3);
    scene.add(backLight);

    // 5. Interaction douce avec la souris
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 0.6;
      targetY = (y / rect.height) * 0.6;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // 6. Boucle d'animation avec contrôle d'arrêt hors champ
    let animationFrameId: number;
    let isVisible = true;

    const animate = () => {
      if (!isVisible || prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      animationFrameId = requestAnimationFrame(animate);

      // Inertie fluide sur la souris
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      mesh.rotation.x += 0.004 * speed + mouseY * 0.02;
      mesh.rotation.y += 0.007 * speed + mouseX * 0.02;

      renderer.render(scene, camera);
    };

    // 7. IntersectionObserver : met en pause le calcul GPU quand l'élément sort de l'écran
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
        setIsPaused(!entry.isIntersecting);

        if (isVisible && !prefersReducedMotion) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    // Premier rendu immédiat
    renderer.render(scene, camera);
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(animate);
    }

    // 8. Gestion propre du redimensionnement
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 300;
      const newHeight = container.clientHeight || 300;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // 9. Démontage et libération des ressources GPU
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [shape, color, wireframe, speed]);

  // État de chargement initial côté client
  if (hasWebGL === null) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-50/40 rounded-2xl`}>
        <div className="w-6 h-6 rounded-full border-2 border-slate-300 border-t-[var(--accent)] animate-spin" />
      </div>
    );
  }

  // Repli propre si WebGL est indisponible
  if (!hasWebGL) {
    return (
      <div className={`${className} relative flex items-center justify-center bg-slate-100 rounded-2xl overflow-hidden p-6 border border-slate-200`}>
        {fallbackImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={fallbackImage}
            alt="Aperçu visuel de remplacement"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center space-y-2 text-slate-500">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-[var(--accent)] shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs font-mono">Dispositif visuel vectoriel</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
      {/* Indicateur de pause discret lors du défilement hors-champ */}
      {isPaused && (
        <span className="sr-only">Rendu 3D en pause hors écran</span>
      )}
    </div>
  );
}
