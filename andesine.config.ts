import { defineConfig } from "@andesine/pages";

export default defineConfig({
  name: "Andesine Docs",
  description: "Documentation for Andesine, the versatile content workspace.",
  site: "https://andesine.app",
  base: "/docs/",
  logo: { src: "./src/assets/andesine.svg", format: "full", alt: "Andesine", title: false },
  favicon: "./src/assets/favicon.svg",
  brand: { primary: "#ff3617", secondary: "#f88f52", tertiary: "#fc6335" },
  links: [
    {
      label: "Changelog",
      href: "https://github.com/vriteio/andesine/releases",
      icon: "i-lucide:scroll-text"
    },
    {
      label: "Community",
      href: "https://github.com/vriteio/andesine/discussions",
      icon: "i-lucide:messages-square"
    }
  ],
  cta: { label: "Open Andesine", href: "https://andesine.app", icon: "i-lucide:arrow-up-right" },
  socialLinks: [
    { label: "GitHub", href: "https://github.com/vriteio/andesine", icon: "i-simple-icons:github" },
    { label: "X", href: "https://x.com/andesineapp", icon: "i-simple-icons:x" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/andesineapp",
      icon: "i-simple-icons:linkedin"
    }
  ],
  sections: [
    {
      id: "documentation",
      label: "Documentation",
      icon: "i-lucide:book-open",
      sources: ["docs"]
    },
    { id: "reference", label: "API reference", icon: "i-lucide:braces", sources: ["api"] }
  ],
  sources: [
    {
      id: "docs",
      type: "andesine",
      collection: "coll_5lYvYOrQq6tCJ6ZeMSExV1",
      publicKey: "adn_pk_Q2YgNFMXFfyoRhLqMh41UaKx51tbO9Gx1EZOZ9LF8Jb"
    },
    { id: "api", type: "openapi", spec: "https://api.andesine.app/openapi.json", mount: "/api/" }
  ]
});
