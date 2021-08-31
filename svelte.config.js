import preprocess from 'svelte-preprocess';
import WindiCSS from 'vite-plugin-windicss/dist/index.mjs';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({aliases: {'windicss': ''}, preserve: ['windicss']}),

  kit: {
    target: '#svelte',

    ssr: false,

    vite: {
      plugins: [WindiCSS()]
    }
  }
};

export default config;
