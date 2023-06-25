
import { VitePWA } from "vite-plugin-pwa"
import { env } from '../shared/env'

// https://github.com/antfu/vite-plugin-pwa
export function PWAPlugin() {
  return env.VITE_BUILD_PWA ? VitePWA({
    registerType: "autoUpdate",
    includeAssets: ["favicon.ico"],
    manifest: {
      name: "ViteBoot",
      short_name: "ViteBoot",
      theme_color: "#ffffff",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
  }) : null
}
