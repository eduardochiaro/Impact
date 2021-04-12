const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');    
const browserSync = require('browser-sync').create();
const util = require('gulp-util');

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

function watcher() {
	browserSync.init({
		server: {
			baseDir: "./designs",
			routes : {
					'/assets' : './assets'
			},
			index: "/index.html"
		}
	});
	gulp.watch('./assets/scss/**/*.scss', css)
	gulp.watch('./assets/js/**/*.js', js);
	gulp.watch('./designs/*.html').on('change', browserSync.reload);
}

exports.style = css;
exports.watch = gulp.series(css, js, watcher);