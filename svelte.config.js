import preprocess from 'svelte-preprocess';
import { resolve } from 'path';

import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    preprocess({
      postcss: true
    })
  ],

  kit: {
    target: '#svelte',

    adapter: adapter({}),
    prerender: {
      enabled: false
    },
    // TODO: When https://github.com/sveltejs/kit/pull/2529 is merged, changed to "never" and static export *should* work
    ssr: false,

    vite: {
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
