import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "OrbitalMC | Правила сервера",
  description: "Официальный свод правил игрового сервера OrbitalMC (1.21.11)",
  cleanUrls: true,
  themeConfig: {
    // No default navigation or social links as this is a dedicated rules dashboard
    socialLinks: []
  }
})
