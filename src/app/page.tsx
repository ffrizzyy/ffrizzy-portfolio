import { ContactForm } from "@/components/home/ContactForm";
import { ContentGrowth } from "@/components/home/ContentGrowth";
import { Hero } from "@/components/home/Hero";
import { ReposSection } from "@/components/home/ReposSection";
import { SkillsMap } from "@/components/home/SkillsMap";
import { StatGrid } from "@/components/home/StatGrid";
import { WorkGallery } from "@/components/home/WorkGallery";
import { WorkList } from "@/components/home/WorkList";
import { WritingSection } from "@/components/home/WritingSection";
import { reportMissingAssets } from "@/lib/assets.server";
import { projectList, workRows, writingList } from "@/lib/content";

/**
 * Spec 3 and 4: one long page with the sections in a fixed order.
 * Neighbouring sections never share a layout family, and the carousel is the
 * one pattern reused (sections 5 and 8) with other sections between them.
 *
 * The About section that used to close this page is gone. Its subsections
 * (experience, education, skills, awards, languages) all live on /cv, which the
 * About nav entry opens, so there is one copy of that content rather than two
 * that can drift apart.
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
      <WorkGallery />
      <SkillsMap />
      <ContentGrowth />
      {/* Rows are handed down so the client bundle never imports the catalogue. */}
      <WorkList rows={workRows} />
      <ReposSection />
      <WritingSection />
      <ContactForm />
    </>
  );
}
