"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { isWebGLAvailable } from "./Scene3D";

function TechnicalPolyhedron() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const targetMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const isTouch = window.matchMedia("(hover: none)").matches;
      if (isTouch) return;
      targetMouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 1.5,
        y: (e.clientY / window.innerHeight - 0.5) * 1.5,
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Rotation technologique calme et rigoureuse
    groupRef.current.rotation.y += delta * 0.2;
    groupRef.current.rotation.x += delta * 0.1;

    // Amortissement lerp vers la souris
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      groupRef.current.rotation.y + targetMouse.current.x * 0.08,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      groupRef.current.rotation.x + targetMouse.current.y * 0.08,
      0.05
    );

    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.35;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z -= delta * 0.25;
    }
  });

  return (
    <group ref={groupRef} scale={1.25}>
      {/* 1. Icosaèdre filaire précis */}
      <mesh>
        <icosahedronGeometry args={[1.35, 2]} />
        <meshBasicMaterial color="#2563EB" wireframe transparent opacity={0.35} />
      </mesh>

      {/* 2. Noeuds de données sur les sommets */}
      <points>
        <icosahedronGeometry args={[1.35, 2]} />
        <pointsMaterial color="#0B132B" size={0.045} transparent opacity={0.7} />
      </points>

      {/* 3. Anneaux orbitaux télémétriques */}
      <mesh ref={ringRef1} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.75, 0.015, 16, 80]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.4} />
      </mesh>

      <mesh ref={ringRef2} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[2.0, 0.012, 16, 80]} />
        <meshBasicMaterial color="#94A3B8" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export function TechWireframe3D() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasWebGL(isWebGLAvailable());
  }, []);

  if (!mounted || !hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-56 h-56 rounded-full border border-blue-500/40 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[3, 3, 3]} intensity={1.5} color="#ffffff" />
        <Suspense fallback={null}>
          <TechnicalPolyhedron />
        </Suspense>
      </Canvas>
    </div>
  );
}
