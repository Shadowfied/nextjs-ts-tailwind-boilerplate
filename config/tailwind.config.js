const merge = require('lodash.merge');

const themeconf = {
  // Custom configs
};

const siteconf = {
  purge: {
    enabled: false,
    content: [
      '../pages/**/*.{js,jsx,ts,tsx}',
      '../components/**/*.{js,jsx,ts,tsx}',
    ],
  },
};

module.exports = merge(siteconf, themeconf);
