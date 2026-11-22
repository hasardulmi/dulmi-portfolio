// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";

/*
 * Windows fix: when the project path starts with a lowercase drive letter
 * ("c:\…", as VS Code terminals often report it), the production build emits
 * the CSS file but never links it, so the page ships unstyled. Normalising
 * the root to an uppercase drive letter avoids that. No effect on Linux/macOS.
 */
const root = fileURLToPath(new URL(".", import.meta.url)).replace(
  /^[a-z](?=:)/,
  (drive) => drive.toUpperCase(),
);

// https://astro.build/config
export default defineConfig({
  root,
  // TODO: site: "https://<custom-domain>" once the domain is known.
  vite: {
    plugins: [tailwindcss()],
  },
});
