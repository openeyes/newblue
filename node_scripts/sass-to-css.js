'use strict';

/**
 * Build CSS files for OpenEyes
 * Production:
 * dist/css/style_oe_dark.3.css // Dark theme (compressed)
 * dist/css/style_oe_light.3.css // Light theme (compressed)
 * dist/css/style_oe_print.3.css // Print only, PDFs (compressed)
 *
 * iDG copies are prefixed with VERSION_TAG numbers, to allow testing
 * of different TAGs within iDG
 */

require('dotenv').config()
const tag = process.env.VERSION_TAG;

const chalk = require('chalk');
const cyan = chalk.bold.cyan;
const red = chalk.bold.red;
const log = console.log;

const fs = require('fs');
const sass = require('sass');
const chokidar = require('chokidar');

// By default this will build the Dark and Light CSS.
// However, if the eyedraw icons are updated their CSS needs building
const mode = process.argv[2] == "eyedraw" ? "eyedraw" : "styles";

log(cyan(`>>> newblue synchronous build: CSS ${mode}`));
log(sass.info);
log( chalk.bgYellow(`--- git tag version = ${tag} ---`));

const config = {
	src: './src/sass/3/',
	dist: './dist/css/',
	idg: '../idg/src/build/newblue/dist/css/'
};

// build a dateStamp for the CSS, useful for debugging deployments
const dateStamp = '/* ' + new Date(Date.now()) + ' */ \n';

// Legals required on the CSS files.
const headerLegals = [
	'/**',
	'*  (C) OpenEyes Foundation, 2018 ',
	'*  This file is part of OpenEyes. ',
	'*',
	'* OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.',
	'* OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.',
	'* You should have received a copy of the GNU Affero General Public License along with OpenEyes in a file titled COPYING. If not, see www.gnu.org/licenses.',
	'*',
	'* @link www.openeyes.org.uk',
	'*',
	'* @author OpenEyes info@openeyes.org.uk',
	'* @copyright Copyright (C) 2018, OpenEyes Foundation',
	'* @license www.gnu.org/licenses/agpl-3.0.html The GNU Affero General Public License V3.0',
	'*',
	'*/',
	'', '' ].join('\n');

/**
 * Process the scss files with Dart Sass
 * "Dart Sass is the primary implementation of Sass"
 * https://sass-lang.com/dart-sass
 */
const dartSass = ( style ) => {
	log(cyan(`Build: ${style}`));
	const cssOutput = `${config.dist}${style}.css`;
	const cssIDG = `${config.idg}${tag}_${style}.css`;

	try {
		/**
		 * Dart-Sass recommends using RenderSync as it is faster.
		 * Create compressed version for Production and a TAG prefixed
		 * version for iDG to use
		 */
		const result = sass.renderSync({
			file: `${config.src}${style}.scss`,
			outputStyle: 'compressed', // "expanded" or "compressed"
			charset: true,
			precision: 5, // numeric precision	
		});

		log(cyan(`CSS: `) + `${cssOutput}`);
		const distStream = fs.createWriteStream(`${cssOutput}`);
		distStream.write(headerLegals);
		distStream.write(dateStamp);
		distStream.end(result.css);

		/**
		 * TAG prefixed file version for iDG
		 */
		log(cyan(`iDG copy: `) + `${tag}_${style}`);
		const idgStream = fs.createWriteStream(`${cssIDG}`);
		idgStream.write(headerLegals);
		idgStream.write(dateStamp);
		idgStream.end(result.css);

	} catch (e) {
		log(red('sass error: ') + e.name + ': ' + e.message);
		log(red('location: ') + e.file + ': ' + e.line); // custom SASS errors
	}
};

/**
 * Default action is to build the dark and light CSS files
 */
const buildCSS = () => {
	dartSass('style_oe_dark.3');
	dartSass('style_oe_light.3');
	dartSass('style_oe_print.3');
	// then initialize FS watcher.
	log(cyan(`... watching Sass files for updates ... `));
}

/**
 * Check build mode
 */
if ( mode == "eyedraw" ){
	// only need to run this once
	dartSass('style_eyedraw_doodles');
} else {
	// run default build CSS 
	buildCSS();
}

chokidar.watch(`${config.src}**/*.scss`, {
	ignored: /(^|[\/\\])\../, // ignore dotfiles
	persistent: true
}).on('change', path => {
	log(`updated: ${path}`);
	buildCSS();
});










