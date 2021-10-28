const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      gridTemplateRows: {
        'layout': '2.5rem 1fr 2.5rem'
      }
    }
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ]
};

module.exports = config;
