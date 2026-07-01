import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWordPressLayout } from "@/lib/layout-api";
import { getPage, getAllSlugs } from "@/lib/page-store";

interface Props {
  params: { slug: string };
}

// Pre-render known slugs at build time; new slugs render on-demand via ISR
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getPage(params.slug);
  if (!page) return {};
  return {
    title: page.page_title,
    description: page.meta_description,
  };
}

export const revalidate = 60;

export default async function CaPage({ params }: Props) {
  const page = getPage(params.slug);
  if (!page) notFound();

  // Server-side fetch of WordPress global layout — never hits the client
  const layout = await getWordPressLayout();

  return (
    <>
      {/* WordPress header injected server-side */}
      <div dangerouslySetInnerHTML={{ __html: layout.header_html }} />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>{page.hero_heading}</h1>
        <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: 30 }}>
          Record #{page.record_id} &middot; Last modified by: {page.last_modified_by}
        </p>
        <div dangerouslySetInnerHTML={{ __html: page.main_content }} />
      </main>

      {/* WordPress footer injected server-side */}
      <div dangerouslySetInnerHTML={{ __html: layout.footer_html }} />
    </>
  );
}
