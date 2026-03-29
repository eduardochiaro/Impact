const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');    
const browserSync = require('browser-sync').create();
var noop = require("gulp-noop");
const argv = require('minimist')(process.argv.slice(2));
const zip = require('gulp-zip').default || require('gulp-zip');
const { Transform } = require('stream');

const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
//const size = require('gulp-filesize');

const config = {
	production: !!argv.production
};

// Prepend text to vinyl file contents
function prepend(text) {
  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      if (file.isBuffer()) {
        file.contents = Buffer.concat([Buffer.from(text), file.contents]);
      }
      cb(null, file);
    }
  });
}

//compile scss into css
gulp.task('css', function() {
  const tailwindcss = require('@tailwindcss/postcss'); 
  return gulp.src('./assets/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(prepend('@import "tailwindcss";\n@config "../../tailwind.config.js";\n'))
		.pipe(config.production ? postcss([
      tailwindcss(),
			cssnano()
		]) : postcss([
      tailwindcss(),
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
					'./**',
					'!./node_modules/**',
					'!./designs/**',
					'!./dist/**',
					'!./yarn-error.log'
			], { follow: false, dot: false })
			.pipe(zip(filename))
			.pipe(gulp.dest('dist/'));
});

gulp.task('build', gulp.series('css', 'js'));

gulp.task('default', gulp.series('build', function() {
  gulp.watch('./assets/scss/**', gulp.series('css'));
  gulp.watch('./assets/js/**/*.js', gulp.series('js'));
	gulp.watch('./**/*.hbs', gulp.series('css'));
}));

exports.design = gulp.task('design', gulp.series('build', 'designCode'));
exports.zip = gulp.task('zip', gulp.series('build', 'zipper'));