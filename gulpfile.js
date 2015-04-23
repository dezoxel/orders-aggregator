var gulp = require('gulp');
var mocha = require('gulp-mocha');
var coffee = require('gulp-coffee');
var del = require('del');
var coffeelint = require('gulp-coffeelint');

gulp.task('clean', function (cb) {
  del(['dist'], cb);
});

gulp.task('test', ['compile_coffee'], function () {
  require('./spec/helpers/config');

  return gulp.src('./dist/spec/**/*.spec.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('compile_coffee', ['clean', 'compile_coffee:lib', 'compile_coffee:spec']);

gulp.task('compile_coffee:lib', ['clean'], function() {
  return gulp.src('./lib/**/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest('./dist/lib/'));
});

gulp.task('compile_coffee:spec', ['clean'], function() {
  return gulp.src('./spec/**/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest('./dist/spec/'));
});

gulp.task('lint', function () {
  gulp.src(['./lib/**/*.coffee', './lib/spec/**/*.coffee'])
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
});