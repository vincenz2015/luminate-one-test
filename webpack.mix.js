const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
  .js('plumbing/index.js', 'public')
  .stylus('frontend/index.styl', 'public').sourceMaps();

// enables hot reloading when using npm run watch
mix.browserSync('localhost:8000');

// Cache busting
if (mix.inProduction()) mix.version()
