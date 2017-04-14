let gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps');

let webroot = __dirname+'/webroot/';
let styleroot = webroot+'styles/';

gulp.task('sass:build', () => {
  return gulp.src(styleroot+'*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(webroot+'/styles'));
});

gulp.task('sass:watch', () => {
  gulp.watch(styleroot+'*.scss', ['sass:build']);
});