/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [],
      fallback: [
        {
          source: "/:path*",
          destination: "https://example.com/:path*",
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/ca/:path*",
        headers: [
          { key: "X-Rendered-By", value: "decoupled-cms" },
          { key: "Cache-Control", value: "s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
