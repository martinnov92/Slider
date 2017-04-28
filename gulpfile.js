var gulp = require('gulp');
var minify = require('gulp-minify');

gulp.task('default', function() {
  
});

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