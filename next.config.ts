import type { NextConfig } from "next";

// Content-Security-Policy is nonce-based and applied per-request in src/proxy.ts
// (it needs a fresh nonce every request, which a static next.config header can't do).
// Strict-Transport-Security is set here since it never varies by request and only
// matters once TLS termination exists in front of the app.
const STATIC_SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    qualities: [65, 75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: STATIC_SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
