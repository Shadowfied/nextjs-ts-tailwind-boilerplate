/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable dot-notation */
/* eslint-disable no-param-reassign */
const tailwindCss = require('tailwindcss');

const path = require('path');

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const withSass = require('@zeit/next-sass');
const withTM = require('next-transpile-modules'); /* ([]) */
const withFonts = require('next-fonts');

// Default to not use a localConf
let localConf = false;

// If config.local.json exists
try {
  localConf = require(require.resolve('./config.local.json'));
} catch (e) {
  /* */
}

module.exports = withSass(
  withFonts(
    withTM({
      enableSvg: true,
      webpack(config, { defaultLoaders, isServer }) {
        // Add postcss-loader and sass-loader
        const rules = [
          {
            test: /\.scss$/,
            use: [
              {
                loader: 'postcss-loader',
                options: {
                  minified: true,
                  ident: 'postcss',
                  plugins: [tailwindCss('./config/tailwind.config.js')],
                },
              },
              { loader: 'sass-loader' },
            ],
          },
        ];

        // Optimize CSS - from a basic slate this saves us about ~3KB (6.61KB vs 9.24KB)
        config.optimization.minimizer = [];
        config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));

        // If we have a localConf with an aliases directive
        if (localConf && localConf.aliases) {
          localConf.aliases.forEach((alias) => {
            const [package, localPath] = Object.entries(alias)[0];
            // Alias package name to local path
            config.resolve.alias[package] = path.resolve(localPath);

            // Add local path to babel include paths, fixes 'you might need an additional loader' error
            config.module.rules.push({
              test: /\.+(js|jsx|ts|tsx)$/,
              use: defaultLoaders.babel,
              include: [localPath],
            });
          });
        }

        // Make sure we only use the React version included in our app
        config.resolve.alias['react'] = path.resolve(
          __dirname,
          '.',
          'node_modules',
          'react'
        );

        // Make sure we only use the React-DOM version included in our app
        config.resolve.alias['react-dom'] = path.resolve(
          __dirname,
          '.',
          'node_modules',
          'react-dom'
        );

        // Fix for 'invalid hook call' error triggered when using local styleguide alias
        if (isServer) {
          config.externals = ['react', 'react-dom', ...config.externals];
        }

        return {
          ...config,
          module: {
            ...config.module,
            rules: [...config.module.rules, ...rules],
          },
        };
      },
    })
  )
);
