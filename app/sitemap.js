import { SITE_URL } from "@/lib/seo";

// /sitemap.xml — every page Google should index. Submit it in Search Console.
export default function sitemap() {
  const now = new Date();
  return [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/journeys", priority: 0.9, changeFrequency: "weekly" },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" },
    { path: "/work", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
