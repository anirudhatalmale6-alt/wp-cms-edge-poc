const LAYOUT_API_URL =
  "https://gist.githubusercontent.com/zebrain1/0ec5f0ccb78ef8bcb8ae26c1c0437f5f/raw/72bf0bbab7d0cd35ae745b55a85035a235d44d68/layout.json";

interface LayoutResponse {
  status: string;
  generated_at: string;
  header_html: string;
  footer_html: string;
}

let cachedLayout: LayoutResponse | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 60s in-memory TTL

export async function getWordPressLayout(): Promise<LayoutResponse> {
  const now = Date.now();
  if (cachedLayout && now - cacheTimestamp < CACHE_TTL) {
    return cachedLayout;
  }

  const res = await fetch(LAYOUT_API_URL, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`Layout API returned ${res.status}`);
  }

  cachedLayout = await res.json();
  cacheTimestamp = now;
  return cachedLayout!;
}
