'use strict';

/**
 -----------------------------
 Optimse SVG for distribution
 The folder structure in './dist' copies
 the stucture within './src', SVG files are
 optimised then updated or created
 -----------------------------
 */
const chalk = require('chalk');
const cyan = chalk.bold.cyan;
const red = chalk.bold.red;
const log = console.log;

const fs = require('fs');
const rm = require('fs/promises').rm;
const {optimize} = require('svgo');
const chokidar = require('chokidar');
const Spritesmith = require("spritesmith");
const fg = require("fast-glob");

log(cyan(`>>> SVG optimise`));


// By default this will build the Dark and Light CSS.
// However, if the eyedraw icons are updated their CSS needs building
const mode = process.argv[2] == "rebuild-all" ? "rebuild-all" : "specific";

if (mode == "specific") {
    log('Note: This will watch and update specific SVG files, to rebuild all SVG files from src run: "npm run svg:all"');
}

// don't use './src'
const paths = {
    src: 'src/svg/**/*.svg',
    dist: 'dist/svg/',
};

/**
 * Recommend SVGO plugin configs
 * Not completely sure what they all do..
 */
const config = {
    plugins: [
        'cleanupAttrs',
        'removeDoctype',
        'removeXMLProcInst',
        'removeComments',
        'removeMetadata',
        'removeTitle',
        'removeDesc',
        'removeUselessDefs',
        'removeEditorsNSData',
        'removeEmptyAttrs',
        'removeHiddenElems',
        'removeEmptyText',
        'removeEmptyContainers',
        // 'removeViewBox',
        'cleanupEnableBackground',
        'convertStyleToAttrs',
        'convertColors',
        'convertPathData',
        'convertTransform',
        'removeUnknownsAndDefaults',
        'removeNonInheritableGroupAttrs',
        'removeUselessStrokeAndFill',
        'removeUnusedNS',
        'cleanupIDs',
        'cleanupNumericValues',
        'moveElemsAttrsToGroup',
        'moveGroupAttrsToElems',
        'collapseGroups',
        // 'removeRasterImages',
        'mergePaths',
        //'convertShapeToPath',
        'sortAttrs',
        'removeDimensions',
        {name: 'removeAttrs', params: {attrs: '(stroke|fill)'}},
    ],
};

/**
 * Processing SVG files.
 * If the folder doesn't exist yet first create it
 * SVGO reads in the src SVG file then write out the result
 * @param {String} svgPath - src file path
 */
const processSVG = (svgPath, idgCopy = true) => {
    // split the file from the directory path
    const pathParts = svgPath.split('/');
    const svgFile = pathParts.pop();
    pathParts.shift(); // [0] = 'src'
    const dist = 'dist/' + pathParts.join('/');

    if (!fs.existsSync(dist)) {
        console.log("... creating directory: " + dist);
        fs.mkdirSync(dist, {recursive: true}, err => {
            if (err) log(red('mkdir error: ') + err);
        });
    }

    // read in the src SVG file
    // output after optimising in the dist/
    fs.readFile(svgPath, 'utf8', (err, data) => {
        if (err) {
            log(red('file read error: ') + err);
            process.exit(1); // no point continuing
        }

        // SVGO
        const result = optimize(data, {path: `${paths.src}*.svg`, ...config});

        // write out the optimised SVG file
        const output = `${dist}/${svgFile}`;
        fs.writeFile(output, result.data, err => {
            if (err) log(red('file write error: ') + err);
            log(cyan(`SVG: `) + output); // success!

			/**
			 * iDG Copy
			 * if rebuilding the SVG structure then the whole SVG folder will need
			 * to copied over manually, this is pretty rare.
			 */
			if( idgCopy ){
				const idgBuild = '../idg/src/build/newblue';
				fs.copyFile(`./${output}`, `${idgBuild}/${output}`, (err) => {
					if (err) throw err;
					log(cyan(`iDG copy: `) + `${svgFile}`);
				});
			}

        });
    });

};

/**
 * Run depending on mode...
 * "specific" - default mode. Only updates when a new SVG is added or one is edited (watches)
 * "all" - runs once, wipes all the "dist" SVGs and rebuilds from "src"
 */
if (mode == "specific") {
    log(cyan(`... watching, updated or newly added specific SVG src files ... `));

    // initialize FS watcher. Simple watcher
    chokidar.watch(paths.src, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
    }).on('change', path => {
        log(cyan('modified file: ') + path);
        processSVG(path, true);
    });
} else {
    log(red(`Deleting all SVGs... ${paths.dist}`));

    // clean "dist" folder and rebuild all from src (runs once)
    rm(paths.dist, {
        force: true,
        recursive: true,
    }).then(() => {
        log(cyan(`Rebuild all SVGs from SRC... ${paths.src}`));

        // make the SVG folder again
        fs.mkdirSync(paths.dist, err => {
            if (err) log(red('mkdir error: ') + err);
        });

        // now rebuild all the SVGs to match the SRC stucture
        const svgPaths = fg.sync(paths.src);
        svgPaths.forEach(path => processSVG(path, false));

		setTimeout(()=>{
			log( red('iDG note: Manually copy over the svg folder to iDG'));
		},1500);

    }).catch((e) => {
        log(red(`No SVG directory? : ${paths.dist}`));
        log(e);
    });
}




