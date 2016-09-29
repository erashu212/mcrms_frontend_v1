'use strict';

var
  gulp = require('gulp'),
  debug = require('gulp-debug'),
  less = require('gulp-less'),
  bower = require('gulp-bower'),
  gulpFilter = require('gulp-filter'),
  cleanCSS = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  mainBowerFiles = require('main-bower-files'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  del = require('del'),
  jsFilter = gulpFilter('*.js'),
  cssFilter = gulpFilter(['*.less', '*.css']),
  fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf']);

gulp.task('clean', function (cb) {
  return del(['assets/*.min.js', 'assets/*.min.css','assets/*.html'], cb);
});

gulp.task('bower', function () {
  return bower();
});

gulp.task('js', function () {
  return gulp.src([
    'bower_components/jquery/jquery.js',
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js',
    'bower_components/angular/angular.min.js',
    'bower_components/angular-route/angular-route.min.js',
    'js/app.js'
  ])
    .pipe(debug({title: 'Processing js files:'}))
    .pipe(concat('mcrms.js'))
    //    .pipe(gulp.dest('assets/dist'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('assets'));
});

gulp.task('css', function () {
  return gulp.src([
    'bower_components/bootstrap/dist/css/bootstrap.css'
  ])
    .pipe(debug({title: 'Processing less files:'}))
    .pipe(less())
    .pipe(debug({title: 'Processing css files:'}))
    .pipe(concat('mcrms.css'))
    //    .pipe(gulp.dest('assets/dist'))
    .pipe(cleanCSS({}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('assets'));
});

gulp.task('copy', function () {
  return gulp.src([
    'index.html',
    'favicon.ico',
    'logo.png'
  ])
    .pipe(gulp.dest('assets'));
});

gulp.task('default', ['clean', 'bower'], function () {
  return gulp.start('js', 'css', 'copy');
});

gulp.task('deploy_lab_2', ['default'], function () {
  return gulp.src([
    'assets/*'
  ])
    .pipe(gulp.dest('/var/www/html/mcrms'));
});
