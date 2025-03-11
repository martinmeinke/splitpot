/** @type {import('@sveltejs/vite-plugin-svelte').SvelteConfig} */
const config = {
  compilerOptions: {
    dev: process.env.NODE_ENV !== 'production',
    runes: true
  }
};

export default config;