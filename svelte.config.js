import preprocess from 'svelte-preprocess';
import WindiCSS from 'vite-plugin-windicss/dist/index.mjs';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    target: '#svelte',

    ssr: false,

    vite: {
      plugins: [WindiCSS()],
      resolve: {
        alias: {
          $workers: resolve('./src/workers'),
          $stores: resolve('./src/stores')
        }
      }
    }
  }
};

export default config;
