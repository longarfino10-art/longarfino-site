// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Sem www. Decidido em 02/09. O www. recebe 301 para cá.
  // Isso define o canonical de cada página e as URLs do sitemap.
  site: 'https://longarfinoskateparks.com.br',
  integrations: [sitemap()],
  build: { format: 'directory' },
});