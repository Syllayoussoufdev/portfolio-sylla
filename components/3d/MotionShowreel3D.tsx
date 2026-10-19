"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isWebGLAvailable } from "./Scene3D";

/**
 * Sculpture 3D chromée sombre avec éclairage cinématique rouge vermillon.
 * Respecte le contrat de mouvement immersif (DESIGN.md section 7 & 9) :
 * - Objet 3D unique procédural (0 Ko de téléchargement GLB)
 * - Caméra pilotée par la progression du défilement (ScrollTrigger)
 * - Réaction fluide au pointeur avec inertie contrôlée (amplitude <= 0.05)
 * - Remplacement propre si WebGL indisponible ou prefers-reduced-motion
 */
function EditorialChromeSculpture() {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const isReduced = useRef(false);

  useEffect(() => {
    isReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleMouseMove = (e: MouseEvent) => {
      const isTouch = window.matchMedia("(hover: none)").matches;
      if (isTouch || isReduced.current) return;
      mousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Contrat de mouvement immersif #1 : Caméra 3D pilotée par la progression du défilement
    gsap.registerPlugin(ScrollTrigger);
    const triggerEl = document.getElementById("hero") || document.body;
    const st = ScrollTrigger.create({
      trigger: triggerEl,
      start: "top top",
      end: "bottom top",
      scrub: 1.2,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      st.kill();
    };
  }, []);

  useFrame((state, delta) => {
    if (isReduced.current) {
      if (meshRef.current) {
        meshRef.current.rotation.set(0.2, 0.4, 0);
      }
      return;
    }

    const t = state.clock.elapsedTime;
    const scroll = scrollProgress.current;

    // 1. Caméra 3D pilotée par le défilement (recul et abaissement cinématique)
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      4.2 + scroll * 1.6,
      0.06
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      -scroll * 0.75,
      0.06
    );

    // 2. Objet 3D qui réagit au pointeur (inertie et amplitude limitée)
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.35 + scroll * 0.02;
      meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.25 + scroll * 0.6;

      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        meshRef.current.rotation.y + mousePos.current.x * 0.05,
        0.08
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        meshRef.current.rotation.x + mousePos.current.y * 0.05,
        0.08
      );
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= delta * 0.2 + scroll * 0.05;
      outerRingRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group>
      {/* Éclairage cinématique : Red rim light intense + White key light */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} color="#FFFFFF" />
      <pointLight position={[-3, -2, -2]} intensity={5.5} color="#FF2A14" distance={10} />
      <pointLight position={[2, -3, 3]} intensity={3.5} color="#FF3B30" distance={8} />

      {/* Sculpture principale : TorusKnot chromé sombre avec reflets rouge vermillon */}
      <mesh ref={meshRef} scale={1.15}>
        <torusKnotGeometry args={[1, 0.34, 128, 32, 2, 3]} />
        <meshStandardMaterial
          color="#121214"
          metalness={0.92}
          roughness={0.18}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Anneau orbital ultra-fin rouge vermillon */}
      <mesh ref={outerRingRef} scale={1.7}>
        <torusGeometry args={[1.35, 0.008, 16, 120]} />
        <meshBasicMaterial color="#FF2A14" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export function MotionShowreel3D() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasWebGL(isWebGLAvailable());
  }, []);

  if (!mounted || !hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center opacity-30 pointer-events-none select-none">
        <div className="relative w-48 h-48 rounded-full border-2 border-[#FF2A14]/40 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-white/20 animate-spin" style={{ animationDuration: "20s" }} />
          <span className="absolute text-[10px] font-mono text-[#FF2A14] uppercase tracking-widest">
            3D CINÉMA
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <EditorialChromeSculpture />
        </Suspense>
      </Canvas>
    </div>
  );
}
