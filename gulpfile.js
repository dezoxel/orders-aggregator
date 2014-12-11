var gulp = require('gulp');
var mocha = require('gulp-mocha');
var coffee = require('gulp-coffee');
var del = require('del');

gulp.task('clean', function (cb) {
  del(['dist'], cb);
});

gulp.task('test', ['coffee'], function () {
  require('./spec/helpers/config');

  return gulp.src('./dist/spec/**/*.spec.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('coffee', ['clean', 'coffee:lib', 'coffee:spec']);

gulp.task('coffee:lib', ['clean'], function() {
  return gulp.src('./lib/**/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest('./dist/lib/'));
});

gulp.task('coffee:spec', ['clean'], function() {
  return gulp.src('./spec/**/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest('./dist/spec/'));
});