import type { MetadataRoute } from "next";
import { NEWS_ARTICLES } from "@/lib/news";
import { ALL_CONSULTING_DETAIL_SLUGS } from "@/lib/consulting-pages";
import { trainingLessons } from "@/lib/training";
import { PUBLIC_WORKSHOPS } from "@/lib/workshops";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aiwithmichal.com";
const base = appUrl.replace(/\/$/, "");

const STATIC_PATHS: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/workshops", priority: 0.9, changeFrequency: "weekly" },
  { path: "/news", priority: 0.8, changeFrequency: "weekly" },
  { path: "/resources", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/consulting", priority: 0.85, changeFrequency: "monthly" },
  { path: "/ai-implementation", priority: 0.85, changeFrequency: "monthly" },
  { path: "/ai-workshops-for-teams", priority: 0.85, changeFrequency: "monthly" },
  { path: "/for-teams", priority: 0.85, changeFrequency: "monthly" },
  { path: "/ai-mentoring", priority: 0.85, changeFrequency: "monthly" },
  { path: "/group-ai-mentoring", priority: 0.8, changeFrequency: "monthly" },
  { path: "/individual-ai-mentoring", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ai-adoption-ladder", priority: 0.65, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  for (const w of PUBLIC_WORKSHOPS) {
    entries.push({
      url: `${base}/workshops/${w.slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    });
    entries.push({
      url: `${base}/workshops/${w.slug}/tickets`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  for (const article of NEWS_ARTICLES) {
    entries.push({
      url: `${base}/news/${article.slug}`,
      lastModified: article.date,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  for (const lesson of trainingLessons) {
    entries.push({
      url: `${base}${lesson.path}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  for (const slug of ALL_CONSULTING_DETAIL_SLUGS) {
    entries.push({
      url: `${base}/consulting/${slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
