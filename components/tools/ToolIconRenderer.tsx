"use client";

import React from "react";
import { Wrench } from "lucide-react";
import type { HeroAllowedTool } from "@/lib/validations/profile";

interface ToolIconProps {
  name: string;
  className?: string;
}

export function ToolIconRenderer({ name, className = "w-9 h-9" }: ToolIconProps) {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");

  switch (normalized) {
    case "canva":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <defs>
    <linearGradient id="canva-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#00C4CC"/>
      <stop offset="100%" stopColor="#7D2AE8"/>
    </linearGradient>
  </defs>
  <circle cx="24" cy="24" r="22" fill="url(#canva-grad)"/>
  <path d="M25.5 31.2c-4.2 0-7.2-3.1-7.2-7.4 0-4.5 3.3-7.6 7.8-7.6 3.1 0 5.2 1.5 5.8 3.8l-3.2.7c-.4-1.3-1.4-2.1-2.6-2.1-2.4 0-4.1 2.1-4.1 5.2 0 2.9 1.7 4.9 4.1 4.9 1.4 0 2.5-.9 2.8-2.2l3.2.6c-.8 2.5-3 4.1-6.6 4.1z" fill="#FFFFFF"/>
</svg>
      );
    case "django":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#092E20"/>
  <path d="M26.5 16h6v20.5c-1.5.3-3.2.5-4.8.5-6.2 0-10.2-3.3-10.2-9.7 0-6.2 4.1-10.2 10-10.2 1.9 0 3.5.4 4.5.9V16zm0 16.5v-7.8c-.7-.3-1.6-.4-2.5-.4-3.1 0-4.9 1.8-4.9 4.8 0 3.2 1.6 4.9 4.7 4.9.9 0 1.8-.2 2.7-.5zm9.5-6.8h6v17.5c0 4.1-1 7-2.9 8.7-1.8 1.7-4.6 2.4-8.2 2.4-1.9 0-3.9-.2-5.4-.7l1.1-4.8c1.2.4 2.6.6 4 .6 3.6 0 5.4-1.9 5.4-6.2V25.7zm0-9.7h6v5.4h-6V16z" fill="#FFFFFF"/>
</svg>
      );
    case "docker":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <path d="M60.5 28.5c-1.3-.9-3.9-1.2-5.7-.3-.5-3.3-2.7-5.2-2.7-5.2s-2.1 2.4-2.4 5.3c-2.4 1.5-6.5 1.6-9.1.5l-1.6 2.7c3.4 1.6 8.5 1.6 11.6-.2 1.4 1.4 3.7 3.5 7.1 2.8 2.2-.4 3.6-2.4 4.1-3.6-.3-.7-.7-1.4-1.3-2z" fill="#2496ED"/>
  <path d="M29.5 16h5v5h-5zm-6 0h5v5h-5zm12 0h5v5h-5zm-18 6h5v5h-5zm6 0h5v5h-5zm6 0h5v5h-5zm6 0h5v5h-5zm-24 6h5v5h-5zm6 0h5v5h-5zm6 0h5v5h-5zm6 0h5v5h-5zm6 0h5v5h-5z" fill="#2496ED"/>
  <path d="M49 32.5c-1.2-.3-7.5-1.5-14.5-.5-6 1-11.8 4.7-15 5.5-4.8 1.2-11.5.3-13.5 3.5-.8 1.2-.5 3.2.2 4.5 3.5 6.5 13.8 9.5 23.3 9.5 15.5 0 27.5-7.5 29.5-17.5.3-1.8-.7-4.1-2-4.7l-8-.3z" fill="#2496ED"/>
</svg>
      );
    case "fastapi":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="28" fill="#05998B"/>
  <path d="M35 14L19 34h12l-4 16 18-22H32l3-14z" fill="#FFFFFF"/>
</svg>
      );
    case "figma":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 57">
  <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE"/>
  <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83"/>
  <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262"/>
  <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E"/>
  <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF"/>
</svg>
      );
    case "git":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M61.3 28.5L35.5 2.7a4.5 4.5 0 0 0-6.4 0L20.8 11l8.1 8.1a5.4 5.4 0 0 1 6.8 6.9l7.8 7.8a5.4 5.4 0 1 1-3.2 3.1l-7.3-7.3v17.2a5.4 5.4 0 1 1-4.5 0V29.5a5.4 5.4 0 0 1-2.9-7.1L17.7 14.3 2.7 29.3a4.5 4.5 0 0 0 0 6.4l25.8 25.8a4.5 4.5 0 0 0 6.4 0l26.4-26.6a4.5 4.5 0 0 0 0-6.4z" fill="#F05032"/>
</svg>
      );
    case "github":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#181717"/>
  <path fillRule="evenodd" clipRule="evenodd" d="M32 14c-9.9 0-18 8.1-18 18 0 7.9 5.1 14.7 12.3 17.1.9.2 1.2-.4 1.2-.9v-3.1c-5 1.1-6.1-2.4-6.1-2.4-.8-2.1-2-2.6-2-2.6-1.6-1.1.1-1.1.1-1.1 1.8.1 2.8 1.9 2.8 1.9 1.6 2.8 4.2 2 5.2 1.5.2-1.2.6-2 1.2-2.5-4-.5-8.2-2-8.2-8.9 0-2 .7-3.6 1.9-4.8-.2-.5-.8-2.3.2-4.8 0 0 1.5-.5 5 1.9 1.4-.4 3-.6 4.5-.6s3.1.2 4.5.6c3.5-2.4 5-1.9 5-1.9 1 2.5.4 4.3.2 4.8 1.2 1.3 1.9 2.9 1.9 4.8 0 7-4.2 8.4-8.3 8.9.7.6 1.3 1.7 1.3 3.5v5.1c0 .5.3 1.1 1.3.9 7.1-2.4 12.2-9.1 12.2-17 0-9.9-8.1-18-18-18z" fill="#FFFFFF"/>
</svg>
      );
    case "javascript":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="8" fill="#F7DF1E"/>
  <path d="M19.5 50.5l4.5-2.7c1.2 2.1 2.5 3.8 5.3 3.8 2.7 0 4.4-1.3 4.4-4.5V26.2h6v20.9c0 6.6-3.8 9.5-9.8 9.5-5.3 0-8.5-2.8-10.4-6.1zm24.8-1c2.1 1.2 4.8 2.2 7.7 2.2 4.4 0 6.8-2.2 6.8-5.3 0-3.3-2.6-4.5-6.9-6.3-5.6-2.4-9.1-5.4-9.1-10.8 0-5.8 4.6-10 11.8-10 3.8 0 6.6 1.1 8.5 2.2l-2.4 5.3c-1.5-.9-3.6-1.7-6.2-1.7-3.5 0-5.4 1.8-5.4 4.1 0 2.8 2.2 3.9 6.7 5.8 6.1 2.6 9.4 5.4 9.4 11.2 0 6.3-4.9 10.7-13.2 10.7-4.1 0-7.7-1.3-9.9-2.6l2.2-5.1z" fill="#000000"/>
</svg>
      );
    case "langchain":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#1C3C3C"/>
  <path d="M22 20a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v4h-6v-4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4h-6v-4z" fill="#2A9D8F"/>
  <path d="M18 28h28v8H18v-8zm4 12h20v4a6 6 0 0 1-6 6h-8a6 6 0 0 1-6-6v-4z" fill="#E76F51"/>
  <circle cx="28" cy="32" r="2" fill="#FFFFFF"/>
  <circle cx="36" cy="32" r="2" fill="#FFFFFF"/>
</svg>
      );
    case "laravel":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <path d="M30.7 4.4a3 3 0 0 1 2.6 0l21 11.2a3 3 0 0 1 1.6 2.6v23.6a3 3 0 0 1-1.6 2.6l-21 11.2a3 3 0 0 1-2.6 0l-21-11.2A3 3 0 0 1 8.1 41.8V18.2a3 3 0 0 1 1.6-2.6l21-11.2Z" fill="#FF2D20"/>
  <path d="M32 6.5l19.5 10.4-19.5 10.4-19.5-10.4L32 6.5Z" fill="#FF5247"/>
  <path d="M12.5 19.5L32 30v21.5L12.5 41V19.5Z" fill="#E02216"/>
  <path d="M32 30l19.5-10.5V41L32 51.5V30Z" fill="#BA150B"/>
</svg>
      );
    case "linux":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M32 4c-7.7 0-14 7.2-14 16 0 3.3.9 6.4 2.5 9-3.5 4.3-5.5 9.7-5.5 15.5 0 7.2 4.5 13 10.5 14.5 2.1 1.8 4.9 3 8 3s5.9-1.2 8-3c6-1.5 10.5-7.3 10.5-14.5 0-5.8-2-11.2-5.5-15.5 1.6-2.6 2.5-5.7 2.5-9 0-8.8-6.3-16-14-16z" fill="#000000"/>
  <ellipse cx="32" cy="38" rx="10" ry="14" fill="#FFFFFF"/>
  <ellipse cx="28" cy="18" rx="2" ry="3" fill="#FFFFFF"/>
  <ellipse cx="36" cy="18" rx="2" ry="3" fill="#FFFFFF"/>
  <circle cx="28" cy="19" r="1.2" fill="#000000"/>
  <circle cx="36" cy="19" r="1.2" fill="#000000"/>
  <path d="M29 23c0-1.7 1.3-3 3-3s3 1.3 3 3l-1.5 3h-3L29 23z" fill="#FFA500"/>
  <path d="M19 54c-3 0-6 1.8-6 4s3 2 6 2 6-.8 6-2-3-4-6-4zm26 0c-3 0-6 1.8-6 4s3 2 6 2 6-.8 6-2-3-4-6-4z" fill="#FFA500"/>
</svg>
      );
    case "mysql":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <path d="M32 6C17.6 6 6 17.6 6 32s11.6 26 26 26 26-11.6 26-26S46.4 6 32 6z" fill="#00758F"/>
  <path d="M47 34c-2.3 0-4.5-.8-6.3-2.2-1.9-1.5-3.2-3.6-3.8-6-1.5 2.1-3.6 3.7-6.1 4.6-2.5.9-5.2 1-7.8.3 1.9-2.3 4.4-4 7.3-4.8 2.8-.8 5.8-.6 8.5.6.8-3.4 2.8-6.3 5.6-8.2 2.8-1.9 6.2-2.7 9.6-2.3-2 3.8-2.8 8.1-2.4 12.4.4 2 1.4 3.8 2.9 5.2-2.5.3-5 .4-7.5.4z" fill="#F29111"/>
  <path d="M22 44h4v-7h-4v7zm8 0h4V33h-4v11zm8 0h4v-9h-4v9z" fill="#FFFFFF"/>
</svg>
      );
    case "nextjs":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" fill="none">
  <mask id="next-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180" style={{ maskType: "alpha" } as React.CSSProperties}>
    <circle cx="90" cy="90" r="90" fill="black"/>
  </mask>
  <g mask="url(#next-mask)">
    <circle cx="90" cy="90" r="90" fill="black"/>
    <path d="M149.5 163.5L68.5 60V120H55V48H69.5L138.5 136.5C142.3 145.4 146.1 154.6 149.5 163.5Z" fill="url(#next-grad-1)"/>
    <rect x="125" y="48" width="14" height="72" fill="url(#next-grad-2)"/>
  </g>
  <defs>
    <linearGradient id="next-grad-1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
      <stop stopColor="white"/>
      <stop offset="1" stopColor="white" stopOpacity="0"/>
    </linearGradient>
    <linearGradient id="next-grad-2" x1="132" y1="48" x2="132" y2="108" gradientUnits="userSpaceOnUse">
      <stop stopColor="white"/>
      <stop offset="1" stopColor="white" stopOpacity="0.2"/>
    </linearGradient>
  </defs>
</svg>
      );
    case "php":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <path d="M64 14C36.389 14 14 36.389 14 64s22.389 50 50 50 50-22.389 50-50-22.389-50-50-50zm0 92C40.804 106 22 87.196 22 64S40.804 22 64 22s42 18.804 42 42-18.804 42-42 42z" fill="#777BB4" opacity=".2"/>
  <ellipse cx="64" cy="64" rx="54" ry="32" fill="#777BB4"/>
  <path d="M33.6 74.8h-7.2l5.6-21.6h12.8c5.4 0 8.6 2.4 7.6 6.5-.9 3.9-4.8 6.5-10.2 6.5h-5.6l-3 8.6zm3.9-11.2h3.9c3.1 0 5-1.1 5.5-3.1.5-1.9-.7-3.1-3.8-3.1h-3.9l-1.7 6.2zm21.7 11.2l5.6-21.6h7.2l-2.4 9.1h7.8l2.4-9.1h7.2l-5.6 21.6h-7.2l2.4-9.5h-7.8l-2.4 9.5h-7.2zm30 0h-7.2l5.6-21.6h12.8c5.4 0 8.6 2.4 7.6 6.5-.9 3.9-4.8 6.5-10.2 6.5h-5.6l-3 8.6zm3.9-11.2h3.9c3.1 0 5-1.1 5.5-3.1.5-1.9-.7-3.1-3.8-3.1h-3.9l-1.7 6.2z" fill="#FFFFFF"/>
</svg>
      );
    case "postgresql":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M32.8 6.5c-7.9 0-14.8 4.2-18.7 10.7-2.6 4.4-3.6 9.6-3 14.8.7 6.4 3.9 12.3 8.8 16.4 1.7 1.4 3.7 2.6 5.8 3.5 1.5.6 3 .9 4.6 1.1 1.2-1.2 2.3-2.5 3.3-3.8-2.6-.4-5.1-1.3-7.3-2.7-3.7-2.4-6.3-6-7.3-10.3-.9-3.9-.6-7.9.9-11.5 2.8-6.7 8.7-11.7 15.9-13.4 3.4-.8 6.9-.8 10.3 0 6.7 1.6 12.4 6.2 15.4 12.4 1.8 3.7 2.3 7.8 1.6 11.9-.9 4.9-3.9 9.1-8.1 11.8-2.2 1.4-4.7 2.3-7.3 2.7 1 1.4 2.1 2.6 3.3 3.8 1.6-.2 3.1-.5 4.6-1.1 2.1-.9 4.1-2.1 5.8-3.5 4.9-4.1 8.1-10 8.8-16.4.6-5.2-.4-10.4-3-14.8-3.9-6.5-10.8-10.7-18.7-10.7z" fill="#336791"/>
  <path d="M32 20c-5.5 0-10 4.5-10 10 0 3.5 1.8 6.6 4.5 8.4V46l5.5-2.5 5.5 2.5v-7.6c2.7-1.8 4.5-4.9 4.5-8.4 0-5.5-4.5-10-10-10z" fill="#336791"/>
  <circle cx="28" cy="28" r="2" fill="#FFFFFF"/>
  <circle cx="36" cy="28" r="2" fill="#FFFFFF"/>
</svg>
      );
    case "prisma":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <path d="M33.6 6.8a3 3 0 0 0-4.7 0L8.4 34.6a3 3 0 0 0 .5 4.1l20.4 17.5a3 3 0 0 0 4.1-.3l22.2-22.7a3 3 0 0 0 .1-4.1L33.6 6.8Z" fill="#2D3748"/>
  <path d="M31.2 7.8L9.8 35.6 30 52.8l2-45Z" fill="#5A67D8"/>
  <path d="M31.2 7.8L32 52.8l21.2-21.7L31.2 7.8Z" fill="#0C344B" fillOpacity="0.4"/>
</svg>
      );
    case "python":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M31.7 4c-8.2 0-14.7 1.2-14.7 7.2v5.3h15v2.1H13.6C6.7 18.6 4 23 4 30.1c0 6.6 4.3 11 11.4 11.3h3.6v-5.2c0-4.3 3.8-7.9 8.3-7.9h14.5c3.8 0 6.8-3.1 6.8-7V11.2C48.6 5.2 42.1 4 31.7 4zm-4.2 3.8a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6z" fill="#3776AB"/>
  <path d="M32.3 60c8.2 0 14.7-1.2 14.7-7.2v-5.3h-15v-2.1h18.4c6.9 0 9.6-4.4 9.6-11.5 0-6.6-4.3-11-11.4-11.3h-3.6v5.2c0 4.3-3.8 7.9-8.3 7.9H22.2c-3.8 0-6.8 3.1-6.8 7v10.1C15.4 58.8 21.9 60 32.3 60zm4.2-3.8a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6z" fill="#FFD43B"/>
</svg>
      );
    case "react":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348">
  <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
  <g stroke="#61DAFB" strokeWidth="1" fill="none">
    <ellipse rx="11" ry="4.2"/>
    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
  </g>
</svg>
      );
    case "sqlserver":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#CC292B"/>
  <ellipse cx="32" cy="18" rx="18" ry="6" fill="#FFFFFF" fillOpacity="0.9"/>
  <path d="M14 18v10c0 3.3 8.1 6 18 6s18-2.7 18-6V18" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
  <path d="M14 28v10c0 3.3 8.1 6 18 6s18-2.7 18-6V28" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
  <path d="M14 38v10c0 3.3 8.1 6 18 6s18-2.7 18-6V38" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
</svg>
      );
    case "swagger":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="28" fill="#85EA2D"/>
  <path d="M23 20c-4 0-7 3-7 7v10c0 4 3 7 7 7h4v-5h-4c-1.5 0-2.5-1-2.5-2.5v-3.5h7v-4h-7V27c0-1.5 1-2.5 2.5-2.5h4V20h-4zm18 0h-4v4.5h4c1.5 0 2.5 1 2.5 2.5v2h-7v4h7v3.5c0 1.5-1 2.5-2.5 2.5h-4v5h4c4 0 7-3 7-7V27c0-4-3-7-7-7z" fill="#000000"/>
</svg>
      );
    case "symfony":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="28" fill="#000000"/>
  <path d="M37.5 16.5c-4.2 0-7.8 1.8-9.8 4.7l3.8 3.5c1.3-1.8 3.4-2.8 5.8-2.8 4.1 0 6.7 2.4 6.7 5.9 0 2.8-1.7 4.8-4.9 6.2l-4.5 1.9c-5.5 2.4-8.1 5.9-8.1 10.9 0 6.9 5.5 11.2 13.5 11.2 4.8 0 9-1.9 11.4-5.2l-3.9-3.6c-1.6 2.2-4.3 3.4-7.3 3.4-5 0-8-2.7-8-6.1 0-3.1 1.9-5.1 5.4-6.6l4.4-1.9c5.8-2.5 8.3-6.2 8.3-11.2 0-7-5.3-11.4-12.8-11.4z" fill="#FFFFFF"/>
</svg>
      );
    case "tailwindcss":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M24 10.5C18.6 10.5 15.2 13.2 13.9 18.6C16.1 15.9 18.8 14.8 22 15.3C24.3 15.7 26 17.4 27.8 19.3C30.8 22.3 34.3 26 42 26C47.4 26 50.8 23.3 52.1 17.9C49.9 20.6 47.2 21.7 44 21.2C41.7 20.8 40 19.1 38.2 17.2C35.2 14.2 31.7 10.5 24 10.5ZM10 22.5C4.6 22.5 1.2 25.2 -0.1 30.6C2.1 27.9 4.8 26.8 8 27.3C10.3 27.7 12 29.4 13.8 31.3C16.8 34.3 20.3 38 28 38C33.4 38 36.8 35.3 38.1 29.9C35.9 32.6 33.2 33.7 30 33.2C27.7 32.8 26 31.1 24.2 29.2C21.2 26.2 17.7 22.5 10 22.5Z" fill="#06B6D4" transform="scale(0.85) translate(4, 2)"/>
</svg>
      );
    case "vuejs":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M39.2 8L32 20.5 24.8 8H8.5l23.5 40.7L55.5 8H39.2z" fill="#42B883"/>
  <path d="M39.2 8L32 20.5 24.8 8H17l15 26 15-26h-7.8z" fill="#35495E"/>
</svg>
      );
    case "wordpress":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="30" fill="#21759B"/>
  <path d="M8.2 32c0 10.3 6.6 19.1 15.9 22.3L11.5 20.9C9.4 24.2 8.2 28 8.2 32zm39.1-1.3c0-3.3-1.2-5.6-2.2-7.4-1.4-2.2-2.6-4.1-2.6-6.3 0-2.4 1.8-4.7 4.5-4.7.1 0 .3 0 .4.1-4.2-3.9-9.9-6.3-16.1-6.3-8.2 0-15.5 4.2-19.8 10.5 1 .1 2 .1 2.9.1 4.7 0 11.9-.6 11.9-.6 2.4-.1 2.7 3.5.3 3.8 0 0-2.5.3-5.2.4l16.6 49.3 10-29.9-7.1-19.4c-2.4-.1-4.7-.4-4.7-.4-2.4-.1-2.2-3.9.3-3.8 0 0 7.4.6 11.7.6 4.7 0 11.9-.6 11.9-.6 2.4-.1 2.7 3.5.3 3.8 0 0-2.5.3-5.2.4l14.1 42c6.1-5.1 10-12.8 10-21.4zM32.5 35.8l-12.8 37.2c3.9 1.1 8 1.8 12.3 1.8 3.5 0 6.9-.5 10.1-1.4L32.5 35.8zm21.3-13.7c.4 1.7.6 3.6.6 5.8 0 5.7-1.1 12.1-4.3 20.3L61.6 23.4c-2.2-.8-4.8-1.3-7.8-1.3z" fill="#FFFFFF"/>
</svg>
      );
    case "typescript":
    case "ts":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="12" fill="#3178C6"/>
          <path d="M34 38.5c1.8 1.2 4.1 2 6.7 2 4 0 6.3-1.9 6.3-4.8 0-3-2.3-4.2-6.2-5.8-5.2-2.1-8.5-4.9-8.5-9.8 0-5.3 4.2-9.1 10.7-9.1 3.5 0 6.1 1 7.8 2l-2.2 4.8c-1.4-.8-3.3-1.5-5.7-1.5-3.2 0-5 1.6-5 3.8 0 2.5 2 3.6 5.8 5.2 5.5 2.3 8.9 4.9 8.9 10.2 0 5.8-4.5 9.7-12.1 9.7-3.8 0-7.2-1.2-9.2-2.4l2.5-4.4zM24 16h6v30h-6V22h-8v-6h14v6h-6v24z" fill="#FFFFFF"/>
        </svg>
      );
    case "nodejs":
    case "node":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <path d="M32 4l24 14v28L32 60 8 46V18L32 4z" fill="#339933"/>
          <path d="M32 18l12 7v14l-12 7-12-7V25l12-7z" fill="#FFFFFF" fillOpacity="0.25"/>
          <path d="M26 26v12h4v-7l6 7h4V26h-4v7l-6-7h-4z" fill="#FFFFFF"/>
        </svg>
      );
    case "reactnative":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="5" fill="#61DAFB"/>
          <ellipse cx="32" cy="32" rx="22" ry="8" stroke="#61DAFB" strokeWidth="2.5"/>
          <ellipse cx="32" cy="32" rx="22" ry="8" stroke="#61DAFB" strokeWidth="2.5" transform="rotate(60 32 32)"/>
          <ellipse cx="32" cy="32" rx="22" ry="8" stroke="#61DAFB" strokeWidth="2.5" transform="rotate(120 32 32)"/>
        </svg>
      );
    case "flutter":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
          <path d="M37.5 4L13 28.5l7.5 7.5L45 11.5 37.5 4z" fill="#42A5F5"/>
          <path d="M37.5 33.5L25 46l7.5 7.5 18-18-7.5-7.5-5.5 5.5z" fill="#02569B"/>
          <path d="M25 46l7.5-7.5 7.5 7.5-7.5 7.5L25 46z" fill="#01579B"/>
        </svg>
      );
    case "html5":
    case "html5css3":
    case "htmlcss":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
          <path d="M12 8l4 40 16 4.5 16-4.5 4-40H12z" fill="#E34F26"/>
          <path d="M32 12v37.5l13-3.6 3.4-33.9H32z" fill="#EF652A"/>
          <path d="M32 20h-9.5l.7 7.5H32V20zm0 13h-4.8l-.4-4.5h-4.8l.8 9.5H32v-5z" fill="#EBEBEB"/>
          <path d="M32 20v7.5h8.8l-.8 8.8-8 2.2v5.3l13.2-3.7 1.5-15.1H32z" fill="#FFFFFF"/>
        </svg>
      );
    case "adobephotoshop":
    case "photoshop":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="14" fill="#001E36"/>
          <path d="M21 20h9c5.2 0 8.5 2.8 8.5 7s-3.3 7-8.5 7h-4v10h-5V20zm5 9.5h3.8c2.4 0 3.8-1 3.8-2.6s-1.4-2.5-3.8-2.5H26v5.1z" fill="#31A8FF"/>
          <path d="M39.5 37.5c1.4.9 3.2 1.5 5.1 1.5 2.4 0 3.6-.9 3.6-2.2 0-3.3-8.5-2-8.5-7.8 0-3.6 3.1-5.7 7.6-5.7 2.2 0 4 .5 5.2 1.3l-1.3 3.3c-1.1-.6-2.5-1-4-1-2.1 0-3.2.9-3.2 2 0 3.2 8.5 1.9 8.5 7.8 0 3.8-3.2 5.9-8.1 5.9-2.5 0-4.8-.7-6.2-1.7l1.3-3.4z" fill="#31A8FF"/>
        </svg>
      );
    case "adobeillustrator":
    case "illustrator":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="14" fill="#330000"/>
          <path d="M24 44l-2.2-6.5h-8.5L11.1 44H6L15.3 18h4.8L29 44h-5zm-3.5-10.5l-3-9.5-3 9.5h6z" fill="#FF9A00"/>
          <circle cx="37" cy="21" r="2.5" fill="#FF9A00"/>
          <rect x="34.5" y="26" width="5" height="18" fill="#FF9A00"/>
        </svg>
      );
    case "adobepremierepro":
    case "premierepro":
    case "premiere":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="14" fill="#00005B"/>
          <path d="M21 20h9c5.2 0 8.5 2.8 8.5 7s-3.3 7-8.5 7h-4v10h-5V20zm5 9.5h3.8c2.4 0 3.8-1 3.8-2.6s-1.4-2.5-3.8-2.5H26v5.1z" fill="#EA77FF"/>
          <path d="M39 28h4.5v3.2c1.2-2.3 3.4-3.5 6-3.2v5c-3.2 0-5.5 1.5-5.5 5.5V44H39V28z" fill="#EA77FF"/>
        </svg>
      );
    case "adobeaftereffects":
    case "aftereffects":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="14" fill="#00005B"/>
          <path d="M24 44l-2.2-6.5h-8.5L11.1 44H6L15.3 18h4.8L29 44h-5zm-3.5-10.5l-3-9.5-3 9.5h6z" fill="#9999FF"/>
          <path d="M45.5 37.5c-2.4 0-4.2-1.5-4.5-4h12c0-5-3.5-8.2-8.2-8.2-5.2 0-8.8 3.8-8.8 9.3 0 5.6 3.6 9.4 9.2 9.4 3.5 0 6.4-1.5 7.8-3.8l-3.2-1.8c-.9 1.4-2.6 2.1-4.3 2.1zm-.5-8.5c2.1 0 3.6 1.3 3.8 3.2h-7.6c.3-2 1.8-3.2 3.8-3.2z" fill="#9999FF"/>
        </svg>
      );
    case "davinciresolve":
    case "davinci":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="30" fill="#1E232A"/>
          <path d="M32 12l10 16-10 4-10-4z" fill="#E84855"/>
          <path d="M48 38l-14-2 3-9 15 5z" fill="#F9A03F"/>
          <path d="M16 38l-4-6 15-5 3 9z" fill="#3185FC"/>
        </svg>
      );
    case "blender3d":
    case "blender":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="36" r="14" fill="#EA7600"/>
          <circle cx="32" cy="36" r="6" fill="#2563EB"/>
          <path d="M32 10v14M16 20l10 10M48 20L38 30" stroke="#EA7600" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      );
    case "capcutpro":
    case "capcut":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="14" fill="#000000"/>
          <path d="M14 22l14 10-14 10V22zm36 0L36 32l14 10V22z" fill="#FFFFFF"/>
          <path d="M28 32l-14 10h36L36 32h-8z" fill="#00F0FF" fillOpacity="0.8"/>
        </svg>
      );
    case "canvapro":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <defs>
            <linearGradient id="canva-grad-pro" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00C4CC"/>
              <stop offset="100%" stopColor="#7D2AE8"/>
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="22" fill="url(#canva-grad-pro)"/>
          <path d="M25.5 31.2c-4.2 0-7.2-3.1-7.2-7.4 0-4.5 3.3-7.6 7.8-7.6 3.1 0 5.2 1.5 5.8 3.8l-3.2.7c-.4-1.3-1.4-2.1-2.6-2.1-2.4 0-4.1 2.1-4.1 5.2 0 2.9 1.7 4.9 4.1 4.9 1.4 0 2.5-.9 2.8-2.2l3.2.6c-.8 2.5-3 4.1-6.6 4.1z" fill="#FFFFFF"/>
        </svg>
      );
    default:
      return (
        <div className="flex flex-col items-center justify-center text-slate-700">
          <Wrench className="w-5 h-5 text-slate-500 mb-0.5" />
          <span className="text-[9px] font-mono font-bold leading-tight">{name}</span>
        </div>
      );
  }
}
