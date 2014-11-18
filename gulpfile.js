var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function () {
  require('./spec/helpers/config');

  return gulp.src('spec/**/*.spec.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));
});