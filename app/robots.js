import { SITE_URL } from "@/lib/seo";

// /robots.txt — let search engines in, point them at the sitemap.
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/credits"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
