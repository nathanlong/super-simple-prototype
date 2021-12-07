const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const include = require('gulp-include');
const uglify = require('gulp-uglify');
const changed = require('gulp-changed');
const rename= require('gulp-rename');
const liveServer = require('live-server');
const svgmin= require('gulp-svgmin');
const svgstore= require('gulp-svgstore');
const path = require('path');

var paths = {
	styles: {
		src: "source/sass/**/*.scss",
		dest: "build/css",
		minifySrc: "build/css/*.css"
	},
	scripts: {
		src: "source/js/**/*.js",
		dest: "build/js",
		minifySrc: "build/js/*.js"
	},
	html: {
		src: "source/html/**/*.html",
		dest: "build"
	},
	static: {
		src: "source/static/**/*",
		dest: "build"
	},
	icons: {
		src: "source/svg-icons/*.svg",
		dest: "build/svg"
	}
};

var params = {
    port: 8181, // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: "build", // Set root directory that's being served. Defaults to cwd.
    open: true, // When false, it won't load your browser by default.
    file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    logLevel: 1, // 0 = errors only, 1 = some, 2 = lots
};

// Runs SASS on main scss file, handles vendor prefixes through autoprefixer
function styles() {
	return src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on("error", sass.logError)
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('../maps'))
		.pipe(dest(paths.styles.dest));
}

// Minify all css
function stylesMinify() {
	return src(paths.styles.minifySrc)
		.pipe(cleanCSS())
		.pipe(dest(paths.styles.dest));
}

// Runs includes on javascript, exports to build
function scripts() {
	return src(paths.scripts.src)
		.pipe(sourcemaps.init())
		.pipe(include())
		.on("error", console.log)
		.pipe(rename('all.js'))
		.pipe(sourcemaps.write('../maps'))
		.pipe(dest(paths.scripts.dest));
}


// Minify all js
function scriptsMinify() {
	return src(paths.scripts.minifySrc)
		.pipe(uglify())
		.pipe(dest(paths.scripts.dest));
}

// Grab svg icons and create a single svg sprite
function svgIcons() {
	return src(paths.icons.src)
		.pipe(svgmin(function(file) {
			let prefix = path.basename(file.relative, path.extname(file.relative));
			return {
				plugins: [
					'removeDoctype',
					'removeXMLProcInst',
					{
						name: 'removeViewBox',
						active: false
					},
					{
						name: 'cleanupIDs',
						params: {
							prefix: prefix + '-', minify: true
						}
					}
				]
			};
		}))
		.pipe(svgstore({ inlineSvg: true }))
		.pipe(dest(paths.icons.dest))
}

// Runs includes on any html files, exports to build
function html() {
	return src(paths.html.src)
		.pipe(include())
		.on("error", console.log)
		.pipe(dest(paths.html.dest));
}

// Move any static files into the build folder to allow sourcing
function static() {
	return src(paths.static.src)
		.pipe(changed("build"))
		.pipe(dest(paths.static.dest));
}

function watchFiles() {
	watch(paths.styles.src, styles),
	watch(paths.scripts.src, scripts),
	watch(paths.html.src, html),
	watch(paths.static.src, static)
	watch(paths.icons.src, svgIcons)
}

function server() {
	liveServer.start(params);
}

// Expose tasks
exports.styles = styles;
exports.stylesMinify = stylesMinify;
exports.scripts = scripts;
exports.scriptsMinify = scriptsMinify;
exports.html = html;
exports.static = static;
exports.svgIcons = svgIcons;
exports.watchFiles = watchFiles;
exports.server = server;

// Default task - builds, then watches assets and recompiles
exports.default = series(
	parallel(
		styles,
		scripts,
		html,
		static,
		svgIcons
	),
	parallel(
		server,
		watchFiles
	)
);

exports.build = series(
	parallel(
		styles,
		scripts,
		html,
		static,
		svgIcons
	),
	parallel(
		stylesMinify,	
		scriptsMinify
	)
);
