"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroCanvas3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Vérifier prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Vérifier support WebGL
    let gl: WebGLRenderingContext | null = null;
    try {
      const testCanvas = document.createElement("canvas");
      gl = (testCanvas.getContext("webgl") ||
        testCanvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
      if (!gl) return;
    } catch {
      return;
    }

    let animationFrameId: number;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // Scène, Caméra, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Géométrie abstraite : Icosaèdre avec structure double (wireframe bleu nuit + points d'accent cobalt)
    const geometry = new THREE.IcosahedronGeometry(1.4, 2);

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(wireframeMesh);

    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x0b132b,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const pointsMesh = new THREE.Points(geometry, pointsMaterial);
    scene.add(pointsMesh);

    // Anneau d'orbite subtil
    const ringGeometry = new THREE.TorusGeometry(1.85, 0.015, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // Écouteur de mouvement souris doux
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (event.clientX / innerWidth - 0.5) * 0.8;
      mouseY = (event.clientY / innerHeight - 0.5) * 0.8;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Redimensionnement
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Boucle d'animation avec inertie (lerp)
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      wireframeMesh.rotation.y += 0.003;
      wireframeMesh.rotation.x += 0.002;
      wireframeMesh.rotation.x += targetY * 0.02;
      wireframeMesh.rotation.y += targetX * 0.02;

      pointsMesh.rotation.y = wireframeMesh.rotation.y;
      pointsMesh.rotation.x = wireframeMesh.rotation.x;

      ringMesh.rotation.z += 0.004;

      renderer.render(scene, camera);
    };

    animate();

    // Nettoyage rigoureux
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      ringGeometry.dispose();
      wireframeMaterial.dispose();
      pointsMaterial.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full pointer-events-none select-none flex items-center justify-center"
      aria-hidden="true"
    />
  );
}
