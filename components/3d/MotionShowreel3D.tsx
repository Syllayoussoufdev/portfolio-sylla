"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { isWebGLAvailable } from "./Scene3D";

function EditorialChromeSculpture() {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const isTouch = window.matchMedia("(hover: none)").matches;
      if (isTouch) return;
      mousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.35;
      meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.25;

      // Réaction fluide au pointeur
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
      outerRingRef.current.rotation.z -= delta * 0.2;
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
      <div className="w-full h-full flex items-center justify-center opacity-25 pointer-events-none">
        <div className="w-48 h-48 rounded-full border border-red-500/30 animate-pulse" />
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
