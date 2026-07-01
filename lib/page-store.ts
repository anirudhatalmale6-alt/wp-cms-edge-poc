interface PageData {
  record_id: number;
  slug: string;
  page_title: string;
  meta_description: string;
  hero_heading: string;
  main_content: string;
  last_modified_by: string;
}

// In production, this would be backed by a database (e.g. Postgres, Redis, KV store).
// For this PoC, we use an in-memory store seeded with the sample payload.
const pages = new Map<string, PageData>();

// Seed with the Quickbase webhook sample data
pages.set("toronto-financial-district-consulting", {
  record_id: 14052,
  slug: "toronto-financial-district-consulting",
  page_title: "Premium Business Consulting in Toronto, CA",
  meta_description:
    "Affordable and scalable corporate consulting services located in the heart of Toronto's financial district.",
  hero_heading: "Scale Your Operations with Local Experts",
  main_content:
    "<p>Welcome to our regional hub. We provide tailor-made solutions for growing enterprises across the province.</p><h3>Why Choose Our Team?</h3><ul><li>24/7 localized support matrix</li><li>Direct integration with Quickbase reporting pipelines</li><li>Guaranteed SLA metrics within 30 days</li></ul>",
  last_modified_by: "System Webhook Engine",
});

export function getPage(slug: string): PageData | undefined {
  return pages.get(slug);
}

export function upsertPage(data: PageData): void {
  pages.set(data.slug, data);
}

export function getAllSlugs(): string[] {
  return Array.from(pages.keys());
}
