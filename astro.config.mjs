import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.bugdesigner.cn',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/archives/') })],
  vite: { plugins: [tailwindcss()] },
  markdown: { syntaxHighlight: false },
  devToolbar: { enabled: false },
});
