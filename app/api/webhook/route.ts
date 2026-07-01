import { NextRequest, NextResponse } from "next/server";
import { upsertPage } from "@/lib/page-store";

// Quickbase sends a shared secret in the header for verification
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "poc-secret-key";

interface QuickbasePayload {
  event_type: string;
  table_id: string;
  data: {
    record_id: number;
    slug: string;
    page_title: string;
    meta_description: string;
    hero_heading: string;
    main_content: string;
    last_modified_by: string;
  };
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  if (secret && secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: QuickbasePayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.data?.slug) {
    return NextResponse.json({ error: "Missing slug in payload" }, { status: 422 });
  }

  upsertPage(payload.data);

  // In production: trigger on-demand ISR revalidation for the affected page
  try {
    const revalidateUrl = new URL(`/api/revalidate?slug=${payload.data.slug}`, req.url);
    await fetch(revalidateUrl.toString());
  } catch {
    // Non-critical — ISR will pick it up on next revalidation cycle
  }

  return NextResponse.json({
    status: "ok",
    slug: payload.data.slug,
    page_url: `/ca/${payload.data.slug}`,
    message: `Page "${payload.data.page_title}" upserted successfully`,
  });
}
