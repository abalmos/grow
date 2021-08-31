import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  extract: {
    include: ['src/**/*.{html,js,ts,svelte}']
  },
  attributify: {
    prefix: 'w:'
  },
  theme: {
    fontFamily: {
      display: ['Montserrat'],
      body: ['Raleway']
    },
    extend: {
      zIndex: {
        500: '500'
      },
      colors: {
        'purdue-gold': '#d7b688',
        'purdue-gray': '#a0948c',
        'purdue-metallic': '#b8a05d',
        'purdue-black': '#383935',
        'purdue-lightGray': '#c8beb6'
      }
    }
  },
  plugins: [
    require('windicss/plugin/typography'),
    require('windicss/plugin/forms')
  ]
});
