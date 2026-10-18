import React from "react";
// Template 1 : Créatif (Design vivant bleu/orange, polaroïds, stickers, Bebas Neue)
import { HeroCreatif } from "@/templates/creatif/HeroCreatif";
import { AboutCreatif } from "@/templates/creatif/AboutCreatif";
import { ProjectsCreatif } from "@/templates/creatif/ProjectsCreatif";

// Template 2 : Développeur (Sérénité technologique moderne, sombre, terminal, architecture)
import { HeroDeveloppeur } from "@/templates/developpeur/HeroDeveloppeur";
import { AboutDeveloppeur } from "@/templates/developpeur/AboutDeveloppeur";
import { ProjectsDeveloppeur } from "@/templates/developpeur/ProjectsDeveloppeur";

// Template 3 : Immersif (Showreel vidéo, motion 3D, luxe éditorial Syne, violet/magenta)
import { HeroImmersif } from "@/templates/immersif/HeroImmersif";
import { AboutImmersif } from "@/templates/immersif/AboutImmersif";
import { ProjectsImmersif } from "@/templates/immersif/ProjectsImmersif";

// Sections transversales adaptées aux tokens du template actif
import { SkillsSection } from "./SkillsSection";
import { ParcoursSection } from "./ParcoursSection";
import { ContactSection } from "./ContactSection";
import type { HeroData, SectionKey } from "@/lib/validations/profile";
import type { MediaData, SiteSettingsData } from "@/lib/profiles";
import type { ProjectData } from "./ProjectCard";

import type { SkillCategoryWithSkills } from "@/lib/skills";

interface SectionRendererProps {
  sectionKey: SectionKey;
  hero?: HeroData;
  heroMedia?: MediaData | null;
  projects: ProjectData[];
  settings?: SiteSettingsData | null;
  template?: string;
  variables?: Record<string, unknown> | null;
  skillCategories?: SkillCategoryWithSkills[];
}

export function SectionRenderer({
  sectionKey,
  hero,
  heroMedia,
  projects,
  settings,
  template = "creatif",
  variables,
  skillCategories,
}: SectionRendererProps) {
  switch (sectionKey) {
    case "hero": {
      if (template === "creatif") {
        return (
          <HeroCreatif
            hero={hero}
            heroMedia={heroMedia}
            projectsCount={projects.length}
            settings={settings}
          />
        );
      }
      if (template === "developpeur") {
        return (
          <HeroDeveloppeur
            hero={hero}
            heroMedia={heroMedia}
            projectsCount={projects.length}
            settings={settings}
          />
        );
      }
      if (template === "immersif") {
        return (
          <HeroImmersif
            hero={hero}
            heroMedia={heroMedia}
            projectsCount={projects.length}
            settings={settings}
          />
        );
      }
      return (
        <HeroCreatif
          hero={hero}
          heroMedia={heroMedia}
          projectsCount={projects.length}
          settings={settings}
        />
      );
    }

    case "apropos": {
      if (template === "creatif") {
        return <AboutCreatif settings={settings} />;
      }
      if (template === "developpeur") {
        return <AboutDeveloppeur settings={settings} />;
      }
      if (template === "immersif") {
        return <AboutImmersif settings={settings} />;
      }
      return <AboutCreatif settings={settings} />;
    }

    case "projets": {
      if (template === "creatif") {
        return <ProjectsCreatif projects={projects} />;
      }
      if (template === "developpeur") {
        return <ProjectsDeveloppeur projects={projects} />;
      }
      if (template === "immersif") {
        return <ProjectsImmersif projects={projects} />;
      }
      return <ProjectsCreatif projects={projects} />;
    }

    case "competences": {
      return <SkillsSection categories={skillCategories} />;
    }

    case "parcours":
      return <ParcoursSection />;

    case "contact":
      return <ContactSection settings={settings} />;

    default:
      return null;
  }
}
