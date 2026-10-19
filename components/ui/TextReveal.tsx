"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  stagger?: number;
}

export function TextReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  as: Tag = "h1",
  stagger = 0.05,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  const words = children.split(" ");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced || !containerRef.current) return;

    const spans = containerRef.current.querySelectorAll(".reveal-word");

    gsap.fromTo(
      spans,
      { y: "110%", opacity: 0, rotateZ: 2 },
      {
        y: "0%",
        opacity: 1,
        rotateZ: 0,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [children, delay, duration, stagger]);

  return (
    <Tag ref={containerRef as any} className={`overflow-hidden inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-1">
          <span className="reveal-word inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
