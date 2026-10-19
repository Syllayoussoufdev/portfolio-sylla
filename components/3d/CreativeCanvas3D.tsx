"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { isWebGLAvailable } from "./Scene3D";

function FloatingCreativeObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const isTouch = window.matchMedia("(hover: none)").matches;
      if (isTouch) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 1.2;
      const y = (e.clientY / window.innerHeight - 0.5) * 1.2;
      targetRotation.current = { x: y * 0.8, y: x * 0.8 };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Rotation continue douce
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.4;

    // Réaction lissée (lerp) au pointeur de souris
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      meshRef.current.rotation.x + targetRotation.current.x * 0.05,
      0.08
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      meshRef.current.rotation.y + targetRotation.current.y * 0.05,
      0.08
    );

    // Flottement sinusoïdal doux
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.12;

    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.25;
      ringRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + 1) * 0.08;
    }
  });

  return (
    <group>
      {/* Objet créatif central : Torus Knot aux reflets ambre / bleu */}
      <mesh ref={meshRef} scale={1.2}>
        <torusKnotGeometry args={[0.9, 0.28, 64, 16]} />
        <meshStandardMaterial
          color="#2563EB"
          roughness={0.25}
          metalness={0.8}
          wireframe={false}
          emissive="#1E3A8A"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Anneau orbital flottant orange vif */}
      <mesh ref={ringRef} scale={1.4} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 64]} />
        <meshBasicMaterial color="#F97316" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

export function CreativeCanvas3D() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasWebGL(isWebGLAvailable());
  }, []);

  if (!mounted || !hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-48 h-48 rounded-full border border-blue-400/30 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-4, -3, -2]} intensity={2} color="#F97316" />
        <Suspense fallback={null}>
          <FloatingCreativeObject />
        </Suspense>
      </Canvas>
    </div>
  );
}
