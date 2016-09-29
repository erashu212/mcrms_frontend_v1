'use strict';

var
  deployPath = '/var/www/html/mcrms';

var
  path = require('path'),
  gulp = require('gulp'),
  debug = require('gulp-debug'),
  inject = require('gulp-inject'),
  replace = require('gulp-inject-string').replace,
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
  return del([
    'assets/*.min.js',
    'assets/*.min.css',
    'assets/*.html',
    'assets/templates/*.html'
  ], cb);
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

gulp.task('templates', function () {
  return gulp.src([
    'templates/*.html'
  ])
    .pipe(gulp.dest('assets/templates'));

});

gulp.task('copy', ['templates'], function () {
  return gulp.src([
    'favicon.ico',
    'logo.png'
  ])
    .pipe(gulp.dest('assets'));
});

gulp.task('index', ['copy'], function () {
  var
    sources = gulp.src([
        'assets/*.min.js',
        'assets/*.min.css'
      ],
      {read: false},
      {relative: true}
    );

  return gulp.src(['index.html'])
    .pipe(inject(sources))
    .pipe(replace('="/assets/', '="/'))
    .pipe(gulp.dest('assets/'));
});

gulp.task('default', ['clean', 'bower'], function () {
  return gulp.start('js', 'css').start('index');
});


gulp.task('clean_deploy_lab_2', function (cb) {
  return del([
    path.join(deployPath, '*.png'),
    path.join(deployPath, '*.jpg'),
    path.join(deployPath, '*.ico'),
    path.join(deployPath, '*.min.js'),
    path.join(deployPath, '*.min.css'),
    path.join(deployPath, '*.html'),
    path.join(deployPath, '*.min.js'),
    path.join(deployPath, 'templates', '*.min.js')
  ],{force:true}, cb);
});


gulp.task('deploy_lab_2_templates', ['clean_deploy_lab_2'], function () {
  return gulp.src([
    'assets/templates/*.html'
  ])
    .pipe(gulp.dest(path.join(deployPath, 'templates')));
});


gulp.task('deploy_lab_2', ['deploy_lab_2_templates'], function () {
    return gulp.src([
      'assets/favicon.ico',
      'assets/*.png',
      'assets/*.jpg',
      'assets/*.min.js',
      'assets/*.min.css',
      'assets/*.html'
    ])
      .pipe(gulp.dest(deployPath))
  }
);
