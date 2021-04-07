const mode = process.env.NODE_ENV;
const dev = mode === 'development';

module.exports = {
	plugins: [
		require('@tailwindcss/jit'),
		require('postcss-preset-env')({ stage: 1 }),
		!dev && require('cssnano')({ preset: 'default' })
	]
};
