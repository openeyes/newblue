'use strict';

/**
This will pull in all the individual icons for either
Events or Eyedraw doodles and build the appropriate assets
-----------------------------
* Event icon
ALL Event icons must be 76px x 76px
They are used by CSS at 50% and at 25% e.g. 38px & 19px
- outputs:
- PNG: 	dist/img/event-icons-76x76.png
- SCSS: src/sass/spritesheet/_icons-events-sprites.scss
-----------------------------
* Eyedraw doodles
The doodle icons are ancient, and they are used by CSS at 100%
- outputs:
- PNG: 	dist/img/eyedraw-doodle-icons-32x32.png
- SCSS: src/sass/spritesheet/_eyedraw-doodle-sprites.scss
*/

// make some nice stdout with chalk! ;)
const chalk = require('chalk');
const cyan = chalk.bold.cyan;
const red = chalk.bold.red;
const log = console.log;

// modules
const fs = require('fs');
const rm = require('fs/promises').rm;
const fg = require('fast-glob');
const Spritesmith = require('spritesmith');
const Jimp = require('jimp');

// check CLI argument for which icon set to build
const iconset  = process.argv[2] == "eyedraw" ? "eyedraw" : "events";
log( cyan(`>>> newblue build iconset: ${iconset.toUpperCase()}`));

/**
* Setup config for either EVENTS or EYEDRAW 
* 1) Remove the current PNG spritesheet
* 2) Spritesmith will build an image and associated coordinate mapping
* 3a) Jimp uses the image buffer to create the PNG spritesheet
* 3b) Write out the updated SCSS file
*/

let config;

if( iconset == "events" ){
	// Events 
	config = {
		iconPath: './src/icons-events/76x76/', 
		glob: '*.png',
		png: './dist/img/event-icons-76x76.png', 
		scss: './src/sass/spritesheet/_icons-events-sprites.scss',
		sassTemplate( sprite, sheetSize ){
			const name = sprite[0].slice( config.iconPath.length, -4 );
			const {x, y} = sprite[1];
			// this needs to Sass, not CSS!
			return [
				`.i-${name} {`,
				`background-size: ${sheetSize.quarter.w}px ${sheetSize.quarter.h}px;`,
				`background-position: ${0-x/4}px ${0-y/4}px;`,
				`&.large {`,
				`background-size: ${sheetSize.half.w}px ${sheetSize.half.h}px;`,
				`background-position: ${0-x/2}px ${0-y/2}px;`,
				`}}`,
				``,
			].join('\n');
		} 
	}
} else {
	// Eyedraw doodles
	config = {
		iconPath: './src/icons-eyedraw/32x32/', 
		glob: '**/*.png', // two folders: "new" and "old" folders
		png: './dist/img/eyedraw-doodle-icons-32x32.png' ,
		scss: './src/sass/spritesheet/_eyedraw-doodle-sprites.scss',
		sassTemplate( sprite, sheetSize ){
			// Allow for 2 subfolders: "new" and "old", fortunately these are both 3 characters!!
			const name = sprite[0].slice( config.iconPath.length + 4, -4 );
			const {x, y} = sprite[1];
			// this needs to Sass, not CSS!
			return [
				`.icon-ed-${name} {`,
				`background-position: ${0-x}px ${0-y}px;`,
				`&.small {`,
				`background-size: ${sheetSize.half.w}px ${sheetSize.half.w}px;`,
				`background-position: ${0-x/2}px ${0-y/2}px;`,
				`}}`,
				``,
			].join('\n');
		} 
	}
}
/**
* Use Jimp to optimise PNG and write it out, imagemin had dependency issues.
* @param {image Buffer} buffer 
*/
const spritePNG = ( buffer ) => {
	// create new PNG
	// https://www.npmjs.com/package/jimp
	Jimp.read( buffer )
		.then(image => {
			// Do stuff with the image...these settings seem to generate smallest file size
			image
				.filterType(Jimp.PNG_FILTER_NONE) // set the filter type for the saved PNG
				.deflateLevel(8) // set the deflate level for the saved PNG
				.deflateStrategy(0) // set the deflate for the saved PNG (0-3)
				.write(`${config.png}`); // write out 
			
			log( cyan('>>> png created: ') + config.png );
		})
		.catch( err => log( red('Jimp error: ') +  err ));
};

/**
* Build the SCSS sprite position
* The icons are 76px x 76px, but used by CSS at 50% and at 25% e.g. 38px & 19px
* @param {Object} : Object mapping filename to {x, y, width, height} of image
* @param {Object} : Object with metadata about spritesheet {width, height} 
*/
const buildSCSS = ( coordinates, properties ) => {
	const comments = [
		'// --- Automatically generated SCSS file by SpriteSmith',
		'// --- Do NOT edit this file directly: see node_scripts/build-iconset.js ',
		'',
	].join('\n');
	
	// background sizing for the sprite sheet
	const sheetSize = {
		quarter: {
			w: properties.width / 4,
			h: properties.height / 4
		}, 
		half: {
			w: properties.width / 2,
			h: properties.height / 2
		}
	};
	
	// build all the Sass classes
	let sassContents = [];
	Object.entries( coordinates ).forEach( sprite => {
		// build file contents, using appropriate template
		sassContents.push( config.sassTemplate( sprite, sheetSize ));
	});
	
	// write out the file
	fs.writeFile(`${config.scss}`, `${comments} ${sassContents.join('')}`, err => {
	  if (err) {
		log( red('scss error: ') +  err );
		return;
	  }
	  log( cyan('>>> scss created: ') + config.scss);
	  log( cyan('>>> Notes'));
	  
	  if( iconset == "events" ){
		  log('Newblue CSS will now need rebuilding ... (then a quick check on iDG that they look OK!)');
		  log('Run: npm run css');
	  } else {
		  log('Eyedraw CSS will now need rebuilding ... (then a quick check on iDG that they look OK!)');
		  log('Run: npm run css:eyedraw');
	  }
	  
	})
};

/**
* OK lets go...
* Remove PNG and initiate Spritesmith
*/
rm( config.png, { force: true })
	.then(() => {
		log('Current .png trashed...');
		// https://github.com/twolfson/spritesmith
		Spritesmith.run({
			src: fg.sync(`${config.iconPath}${config.glob}`) // use fast-glob here to generate an Array
		}, function handleResult (err, result) {
			if (err) {
				log( red('Spritesmith error: ') +  err );
				return;
			}
			log(`Spritesmith pulling from... "${config.iconPath}"`);
			// build the PNG
			spritePNG( result.image ); // Buffer representation of image
			buildSCSS( result.coordinates, result.properties );  	
		});
	});