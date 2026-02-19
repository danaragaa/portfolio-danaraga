import type { MetadataRoute } from "next";
import { projects } from "@/app/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://danaraga.dev";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
