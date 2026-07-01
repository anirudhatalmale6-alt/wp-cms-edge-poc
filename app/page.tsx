// Root page — in production, Cloudflare Worker proxies /* to WordPress.
// This placeholder only renders if someone hits the Next.js origin directly.
export default function Home() {
  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Decoupled CMS PoC</h1>
      <p>
        In production, the root domain is proxied to WordPress via Cloudflare Workers.
      </p>
      <p>
        Visit <a href="/ca/toronto-financial-district-consulting">/ca/toronto-financial-district-consulting</a> to
        see the dynamic CMS page with server-side WordPress layout stitching.
      </p>
    </div>
  );
}
