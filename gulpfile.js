const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');    
const browserSync = require('browser-sync').create();
var noop = require("gulp-noop");
const argv = require('minimist')(process.argv.slice(2));
const zip = require('gulp-zip');

const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
//const size = require('gulp-filesize');

const config = {
	production: !!argv.production
};

//compile scss into css
gulp.task('css', function() {
  const tailwindcss = require('tailwindcss'); 
  return gulp.src('./assets/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(config.production ? postcss([
      tailwindcss("./tailwind.config.js"),
			autoprefixer(),
			cssnano()
		]) : postcss([
      tailwindcss("./tailwind.config.js"),
			autoprefixer()
		]))
    .pipe(gulp.dest('./assets/built'))
		//.pipe(size()) 
    .pipe(browserSync.stream());
});

//compile jss into one file
gulp.task('js', function() {
  return gulp.src('./assets/js/*.js')
		.pipe(concat('main.js'))
		.pipe(config.production ? uglify() : noop())
    .pipe(gulp.dest('./assets/built'))
		//.pipe(size()) 
    .pipe(browserSync.stream());
});

gulp.task('designCode', function() {
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
});

gulp.task('zipper', function() {
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
});

gulp.task('build', ['css', 'js']);

gulp.task('default', ['build'], function() {
  gulp.watch('./assets/scss/**', ['css']);
  gulp.watch('./assets/js/**/*.js', ['js']);
	gulp.watch('./**/*.hbs', ['css']);
});

exports.design = gulp.task('design', ['build', 'designCode']);
exports.zip = gulp.task('zip', ['build', 'zipper']);