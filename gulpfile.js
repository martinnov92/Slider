var gulp = require('gulp');
var minify = require('gulp-minify');
var sass = require('gulp-sass');

/*
gulp.task('default', function() {
  
});
*/

gulp.task('compress', function() {
  gulp.src('./lib/index.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.min.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('lib'))
});
 
gulp.task('sass', function () {
  return gulp.src('./css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./css/*.scss', ['sass']);
});