const {series, watch, src, dest, parallel} = require('gulp');
const pump = require('pump');

// gulp plugins and utils
const livereload = require('gulp-livereload');
const postcss = require('gulp-postcss');
const zip = require('gulp-zip');
const concat = require('gulp-concat');
const fs = require('fs');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const beeper = require('beeper');
const uglify = require('gulp-uglify');

// postcss plugins
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

function serve(done) {
	livereload.listen();
	done();
}

const handleError = (done) => {
	return function (err) {
			if (err) {
					beeper();
			}
			return done(err);
	};
};

function hbs(done) {
	pump([
			src(['*.hbs', 'partials/**/*.hbs']),
			livereload()
	], handleError(done));
}

function css(done) {
	pump([
			src('assets/scss/*.scss', {sourcemaps: true}),
			sass().on('error', sass.logError),
			concat('style.css'),
			postcss([
					//easyimport,
					//colorFunction(),
					autoprefixer(),
					cssnano()
			]),
			dest('assets/built/', {sourcemaps: '.'}),
			livereload()
	], handleError(done));
}

function js(done) {
	pump([
			src([
					// pull in lib files first so our own code can depend on it
					'assets/js/lib/*.js',
					'assets/js/*.js'
			], {sourcemaps: true}),
			concat('theme.js'),
			uglify(),
			dest('assets/built/', {sourcemaps: '.'}),
			livereload()
	], handleError(done));
}

const cssWatcher = () => watch('assets/scss/**', css);
const hbsWatcher = () => watch(['*.hbs', 'partials/**/*.hbs'], hbs);
const watcher = parallel(cssWatcher, hbsWatcher);
const build = series(css, js);

exports.default = series(build, serve, watcher);