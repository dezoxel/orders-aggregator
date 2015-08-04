'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var karma = require('karma');
var $ = require('gulp-load-plugins')();

function runTests (singleRun, done) {
  karma.server.start({
    configFile: path.join(__dirname, '/../unit.karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun
  }, function() {
    done();
  });
}

gulp.task('test', ['scripts'], function(done) {
  runTests(true, done);
});

gulp.task('test:auto', ['watch'], function(done) {
  runTests(false, done);
});

gulp.task('codeclimate', function() {
  var token = '19deb5fc3438551272f5d3352c0ec3f85175e75f91657ae1f71c02038c5f0ec6';
  var exec = path.join(__dirname, '../node_modules/.bin/codeclimate-test-reporter');
  var lcovPath = path.join(__dirname, '../coverage/lcov.info');
  var command = 'CODECLIMATE_REPO_TOKEN=' + token + ' ' + exec + ' < ' + lcovPath;
  console.log('Codeclimate: ' + command);

  $.shell.task(command)();
});

