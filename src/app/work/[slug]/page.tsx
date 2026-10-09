import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyLayout } from "@/components/work/CaseStudyLayout";
import { getNextProject, getProject, projectList } from "@/lib/content";

/**
 * Spec 5.1. Every project is statically generated, so the route costs nothing
 * at request time and a broken slug 404s immediately.
 */
export function generateStaticParams() {
  return projectList.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.outcome,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.outcome,
      type: "article",
      // One generated card per project, written by scripts/make-icons.py, so a
      // shared link never falls back to a generic image.
      images: [
        {
          url: `/og/${project.slug}.png`,
          width: 1200,
          height: 630,
          alt: `${project.title} case study card`,
        },
      ],
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
  const project = getProject(slug);

  if (!project) notFound();

  return <CaseStudyLayout project={project} next={getNextProject(project.slug)} />;
}
