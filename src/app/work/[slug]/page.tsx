import { existsSync } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyLayout } from "@/components/work/CaseStudyLayout";
import { getNextWorkProject, getWorkProject, getWorkProjectSlugs } from "@/lib/work.server";

/**
 * Spec 5.1. Every curated project is generated at build time, and a repository
 * that gained a generated case study since the last build still renders on
 * demand because Next allows params outside the static list by default.
 */
export async function generateStaticParams() {
  const slugs = await getWorkProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * A generated repository has no artwork in public/og yet, so its card falls back
 * to the site-wide image rather than a path that would 404.
 */
function ogCardExists(slug: string): boolean {
  return existsSync(path.join(process.cwd(), "public", "og", `${slug}.png`));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getWorkProject(slug);

  if (!project) return { title: "Project not found" };

  const image = ogCardExists(project.slug)
    ? {
        url: `/og/${project.slug}.png`,
        width: 1200,
        height: 630,
        alt: `${project.title} case study card`,
      }
    : {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: `${project.title} case study`,
      };

  return {
    title: project.title,
    description: project.outcome,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.outcome,
      type: "article",
      ...(image ? { images: [image] } : {}),
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getWorkProject(slug);

  if (!project) notFound();

  return <CaseStudyLayout project={project} next={await getNextWorkProject(project.slug)} />;
}
