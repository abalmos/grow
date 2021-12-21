// Source: https://github.com/doomnoodles/sveltekit-rust-ssr-template
// Temporary fix for https://github.com/vitejs/vite/issues/5169
const { readFileSync, writeFileSync } = require('fs');

const re = /[^\n]*new URL[^\n]*/g;
const fileName = './pkg/geo-utils.js';
writeFileSync(fileName, readFileSync(fileName, 'utf8').replace(re, ''));
