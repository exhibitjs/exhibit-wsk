/**
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

import gulp from 'gulp';
import exhibit from 'exhibit';
import {output as pagespeed} from 'psi';
import pkg from './package.json';

// Main build sequence
const app = exhibit()
  // Compile and automatically prefix stylesheets
  .use('sass', {precision: 10})
  .use('autoprefixer', [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ]);
  // Uncomment the next line to transform ES2015 code to ES5.
  // .use('babel');

// Extra steps for production build
const optimize = exhibit()
  // Optimize images
  .use('imagemin', {
    progressive: true,
    interlaced: true
  })
  // Concatenate and minify scripts and stylesheets
  .use('concat')
  .use('uglify', {preserveComments: 'some'})
  .use('clean-css', {sourceMap: true})
  // Minify HTML
  .use('minify-html');

// Watch files for changes & reload
gulp.task('serve', () =>
  exhibit()
    .use('jshint')
    .use(app)
    .build('app', '.tmp', {
      watch: true,
      serve: true,
      browserSync: true,
      open: true
    })
);

// Build and serve the output from the dist build
gulp.task('serve:dist', () =>
  exhibit()
    .use('jshint')
    .use(app)
    .use(optimize)
    .build('app', 'dist', {
      watch: true,
      serve: true,
      browserSync: true,
      open: true
    })
);

// Lint and build production files, the default task
gulp.task('default', () =>
  exhibit()
    .use('jshint')
    .use(app)
    .use(optimize)
    // See http://www.html5rocks.com/en/tutorials/service-worker/introduction/ for
    // an in-depth explanation of what service workers are and why you should care.
    // Generate a service worker file that will provide offline functionality for
    // local resources. This should only be done for the 'dist' directory, to allow
    // live reload to work as expected when serving from the 'app' directory.
    .use('sw-precache', {
      // Used to avoid cache conflicts when serving on localhost.
      cacheId: pkg.name || 'web-starter-kit'
    })
    // .use('server-config', 'apache') // plugin not yet created
    // Build from ./app to ./dist
    .build('app', 'dist')
);

// Run PageSpeed Insights
gulp.task('pagespeed', cb =>
  // Update the below URL to the public URL of your site
  pagespeed('example.com', {
    strategy: 'mobile'
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb)
);

// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
