import { AboutSection } from "@/components/home/AboutSection";
import { ContactForm } from "@/components/home/ContactForm";
import { ContentGrowth } from "@/components/home/ContentGrowth";
import { Hero } from "@/components/home/Hero";
import { KitoSection } from "@/components/home/KitoSection";
import { SkillsMap } from "@/components/home/SkillsMap";
import { StatGrid } from "@/components/home/StatGrid";
import { WorkBento } from "@/components/home/WorkBento";
import { WorkList } from "@/components/home/WorkList";
import { WritingSection } from "@/components/home/WritingSection";
import { reportMissingAssets } from "@/lib/assets.server";
import { projectList, writingList } from "@/lib/content";

/**
 * Spec 3 and 4: one long page with the ten sections in a fixed order.
 * Neighbouring sections never share a layout family, and the carousel is the
 * one pattern reused (sections 5 and 8) with other sections between them.
 */
export default function Home() {
  if (process.env.NODE_ENV !== "production") {
    // Spec 7.1 invariant 2: report asset gaps in dev rather than render a
    // silently empty box. The placeholder frame covers the visual side.
    reportMissingAssets(
      [
        "/textures/paper.webp",
        "/images/portrait.webp",
        ...projectList.map((project) => project.cover),
        ...writingList.map((item) => item.cover),
      ],
      "Home",
    );
  }

  return (
    <>
      <Hero />
      <StatGrid />
      <WorkBento />
      <SkillsMap />
      <ContentGrowth />
      <KitoSection />
      <WorkList />
      <WritingSection />
      <AboutSection />
      <ContactForm />
    </>
  );
}
