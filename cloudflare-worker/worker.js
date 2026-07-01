/**
 * Cloudflare Worker — Edge Router
 *
 * Routes:
 *   /ca/*       → Decoupled CMS (Next.js on Vercel)
 *   /api/*      → Decoupled CMS API (webhook endpoint)
 *   Everything  → WordPress origin
 */

const CMS_ORIGIN = "https://your-app.vercel.app"; // Replace with actual Vercel deployment URL
const WP_ORIGIN = "https://example.com";           // Replace with actual WordPress domain

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Route /ca/* and /api/* to the decoupled CMS
    if (path.startsWith("/ca/") || path.startsWith("/ca") || path.startsWith("/api/webhook")) {
      const cmsUrl = new URL(path + url.search, CMS_ORIGIN);
      const cmsReq = new Request(cmsUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.method !== "GET" ? request.body : undefined,
      });

      const response = await fetch(cmsReq);

      // Clone headers and add routing metadata
      const headers = new Headers(response.headers);
      headers.set("X-Routed-Via", "cloudflare-worker");
      headers.set("X-Origin", "decoupled-cms");

      return new Response(response.body, {
        status: response.status,
        headers,
      });
    }

    // Default: proxy to WordPress
    const wpUrl = new URL(path + url.search, WP_ORIGIN);
    const wpReq = new Request(wpUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== "GET" ? request.body : undefined,
    });

    const wpResponse = await fetch(wpReq);

    const headers = new Headers(wpResponse.headers);
    headers.set("X-Routed-Via", "cloudflare-worker");
    headers.set("X-Origin", "wordpress");

    return new Response(wpResponse.body, {
      status: wpResponse.status,
      headers,
    });
  },
};
