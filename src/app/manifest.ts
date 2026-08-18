import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sports Wear — Track Suits, Sportswear & Sports Equipment",
    short_name: "Sports Wear",
    description: "Shop track suits, jerseys, footwear, and sports equipment.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#F2622E",
    orientation: "portrait-primary",
    icons: [
      { src: "/manifest-icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/manifest-icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/manifest-icons/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
