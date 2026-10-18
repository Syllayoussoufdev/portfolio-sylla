import React from "react";
import { Hero } from "./Hero";
import { ProjectsGrid } from "./ProjectsGrid";
import { SkillsSection } from "./SkillsSection";
import { AboutSection } from "./AboutSection";
import { ParcoursSection } from "./ParcoursSection";
import { ContactSection } from "./ContactSection";
import type { HeroData, SectionKey } from "@/lib/validations/profile";
import type { MediaData, SiteSettingsData } from "@/lib/profiles";
import type { ProjectData } from "./ProjectCard";

interface SectionRendererProps {
  sectionKey: SectionKey;
  hero?: HeroData;
  heroMedia?: MediaData | null;
  projects: ProjectData[];
  settings?: SiteSettingsData | null;
  template?: string;
}

export function SectionRenderer({
  sectionKey,
  hero,
  heroMedia,
  projects,
  settings,
  template,
}: SectionRendererProps) {
  switch (sectionKey) {
    case "hero":
      return (
        <Hero
          hero={hero}
          heroMedia={heroMedia}
          projectsCount={projects.length}
          settings={settings}
          template={template}
        />
      );
    case "projets":
      return <ProjectsGrid projects={projects} />;
    case "competences":
      return <SkillsSection />;
    case "apropos":
      return <AboutSection settings={settings} />;
    case "parcours":
      return <ParcoursSection />;
    case "contact":
      return <ContactSection settings={settings} />;
    default:
      return null;
  }
}
