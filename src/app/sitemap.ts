import type { MetadataRoute } from "next";
import { SERVICES } from "@/content/services";
import { SITE_URL } from "@/lib/seo";

/** Все публичные страницы, кроме /consent (по ТЗ в sitemap не входит). */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/private", changeFrequency: "monthly", priority: 0.8 },
    { path: "/business", changeFrequency: "monthly", priority: 0.8 },
    ...SERVICES.map((service) => ({
      path: `/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { path: "/portfolio", changeFrequency: "weekly", priority: 0.6 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
