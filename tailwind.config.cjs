const { tailwindExtractor } = require('tailwindcss/lib/lib/purgeUnusedStyles');
const forms = require('@tailwindcss/forms');

module.exports = {
	purge: {
		content: ['./src/**/*.{html,js,ts,svelte}'],
		options: {
			defaultExtractor: (content) => [
				...tailwindExtractor(content),
				...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
					([_match, group, ..._rest]) => group
				)
			],
			keyframes: true
		}
	},
	darkMode: true,
	theme: {
		extend: {
			zIndex: {
				500: '500'
			},
			colors: {
				purdue: {
					gold: '#d7b688',
					gray: '#a0948c',
					metallic: '#b8a05d',
					black: '#383935',
					lightGray: '#c8beb6'
				}
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: [forms]
};
