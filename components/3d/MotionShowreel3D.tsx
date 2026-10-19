"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { isWebGLAvailable } from "./Scene3D";

function CinematicParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Mesh>(null);
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

  // Génération de 250 particules dans une sphère creuse
  const [positions, colors] = useMemo(() => {
    const count = 280;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const color1 = new THREE.Color("#A855F7"); // Violet
    const color2 = new THREE.Color("#EC4899"); // Rose Magenta

    for (let i = 0; i < count; i++) {
      const radius = 1.2 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = color1.clone().lerp(color2, Math.random());
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }

    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y += delta * 0.15;
    pointsRef.current.rotation.x += delta * 0.08;

    // Réaction fluide au curseur
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(
      pointsRef.current.rotation.y,
      pointsRef.current.rotation.y + mousePos.current.x * 0.04,
      0.06
    );
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      pointsRef.current.rotation.x + mousePos.current.y * 0.04,
      0.06
    );

    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.2;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
    }
  });

  return (
    <group>
      {/* Nuage de particules cinématiques */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Anneau d'énergie cinématique rose / violet */}
      <mesh ref={ringRef} scale={1.5}>
        <torusGeometry args={[1.6, 0.02, 16, 100]} />
        <meshBasicMaterial color="#EC4899" transparent opacity={0.4} />
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
        <div className="w-64 h-64 rounded-full border border-purple-500/30 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <CinematicParticles />
        </Suspense>
      </Canvas>
    </div>
  );
}
