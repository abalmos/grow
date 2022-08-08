import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true
	}),

	kit: {
		adapter: adapter({ fallback: '404.html' }),
		alias: {
			$workers: resolve('./src/workers'),
			$stores: resolve('./src/stores')
		}
	}
};

export default config;
