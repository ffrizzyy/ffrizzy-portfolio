import type { MetadataRoute } from "next";

import { projectList } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";

const baseUrl = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectList.map((project) => ({
      url: `${baseUrl}/work/${project.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
