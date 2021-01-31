/* eslint-disable global-require */
// postcss.config.js

const purgecss =
  process.env.NODE_ENV !== 'development'
    ? require('@fullhuman/postcss-purgecss')({
        // Specify the paths to all of the template files in your project
        content: [
          './pages/**/*.tsx',
          './components/**/*.tsx',
          './pages/**/*.ts',
          './pages/**/*.jsx',
        ],

        // make sure css reset isnt removed on html and body
        safelist: ['html', 'body'],

        // Include any special characters you're using in this regular expression
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      })
    : null;

module.exports = {
  plugins: [require('tailwindcss')('./config/tailwind.config.js'), purgecss],
};
