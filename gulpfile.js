const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');    
const browserSync = require('browser-sync').create();
const util = require('gulp-util');
const zip = require('gulp-zip');

const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const size = require('gulp-filesize');

const config = {
	production: !!util.env.production
};

//compile scss into css
function css() {
  return gulp.src('./assets/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(config.production ? postcss([
			autoprefixer(),
			cssnano()
		]) : postcss([autoprefixer()]))
    .pipe(gulp.dest('./assets/built'))
		.pipe(size()) 
    .pipe(browserSync.stream());
}

//compile jss into one file
function js() {
  return gulp.src('./assets/js/*.js')
		.pipe(concat('main.js'))
		.pipe(config.production ? uglify() : util.noop())
    .pipe(gulp.dest('./assets/built'))
		.pipe(size()) 
    .pipe(browserSync.stream());
}

function design() {
	browserSync.init({
		server: {
			baseDir: "./designs",
			routes : {
					'/assets' : './assets'
			},
			index: "/index.html"
		}
	});
	gulp.watch('./designs/*.html').on('change', browserSync.reload);
}

function zipper(done) {
	const filename = require('./package.json').name + '.zip';
	return gulp.src([
					'**',
					'!node_modules', '!node_modules/**',
					'!designs', '!designs/**',
					'!dist', '!dist/**',
					'!yarn-error.log'
			])
			.pipe(zip(filename))
			.pipe(gulp.dest('dist/'));
}

const cssWatcher = () => gulp.watch('./assets/scss/**', css);
const jsWatcher = () => gulp.watch('./assets/js/**/*.js', js);

const watcher = gulp.parallel(cssWatcher, jsWatcher);
const designW = gulp.parallel(cssWatcher, jsWatcher, design);
const build = gulp.series(css, js);

exports.style = css;
exports.default = gulp.series(build, watcher);
exports.design = gulp.series(build, designW);
exports.zip = gulp.series(build, zipper);