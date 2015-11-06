var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');

var insertLines = require('gulp-insert-lines');
var insertFile = require('gulp-file-insert');

var inlineSource = require('gulp-inline-source');
var inlineCss = require('gulp-inline-css');
var mcInlineCss = require('gulp-mc-inline-css');
var juice = require('gulp-juice');
var premailer = require('gulp-premailer');

var minifyHtml = require('gulp-minify-html');


// Dev tasks
gulp.task('browserSync', function() {
    browserSync.init({
        server: { baseDir: "./prod" },
        port: 9000
    });
});

gulp.task('dev-css', function() {
  gulp.src('assets/css/*.styl', {base: 'assets/css/'})
    .pipe(stylus())
    // .pipe(autoprefixer())
    .pipe(gulp.dest('prod'))
    .pipe(browserSync.stream());
  gulp.src('assets/css/ink.css', {base: 'assets/css/'})
    .pipe(gulp.dest('prod'));
});

gulp.task('dev-img', function() {
  gulp.src('assets/img/*', {base: 'assets/'})
    .pipe(gulp.dest('prod'));
});
 
gulp.task('dev-jade', function() {
  var locals = {};
 
  gulp.src('./index.jade')
    .pipe(jade({
      locals: locals,
      pretty: true
    }))
    .pipe(gulp.dest('./prod/'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  gulp.watch("assets/css/*", ['dev-css']);
  gulp.watch("assets/img/*", ['dev-img']);
  gulp.watch("./**/*.jade", ['dev-jade']);
});

gulp.task('server', ['watch', 'browserSync'])
gulp.task('default', ['server'])



// Production tasks

gulp.task('inline-css', function() {
  return gulp.src('prod/index.html')
    .pipe(inlineCss({removeStyleTags: true, preserveMediaQueries:true}))
    .pipe(gulp.dest('./prod/'))
});

gulp.task('juice', function() {
  return gulp.src('prod/index.html', {base: 'prod/'})
    .pipe(juice())
    .pipe(gulp.dest('./prod/'))
});

gulp.task('premailer', function() {
  return gulp.src('prod/index.html', {base: 'prod/'})
    .pipe(premailer())
    .pipe(gulp.dest('./prod/'))
});

gulp.task('insert-file', function() {
  gulp.src('prod/index.html')
    .pipe(insertFile({
      '/* media.css */': './prod/media.css'
    }))
  .pipe(gulp.dest('./prod/'));
});

gulp.task('mc-inline-css', function() {
  return gulp.src('prod/index.html')
    .pipe(inlineSource())
    .pipe(gulp.dest('./prod/'))
    .pipe(mcInlineCss('860b261d2e6dcd1668d4ca32ec3fe6e3-us12'))
    .pipe(gulp.dest('./prod/'))
});

gulp.task('inline-source', function() {
  return gulp.src('prod/index.html')
    .pipe(inlineSource())
    .pipe(gulp.dest('./prod/'))
});

gulp.task('minify-html', function() {
  return gulp.src('prod/index.html')
    .pipe(minifyHtml())
    .pipe(gulp.dest('./prod/'))
});

gulp.task('prod', ['dev-css', 'dev-img', 'dev-jade'], function() {
  return gulp.src('prod/index.html')
    .pipe(inlineSource())
    .pipe(inlineCss({removeStyleTags: true, preserveMediaQueries:true}))
    .pipe(minifyHtml())
    .pipe(gulp.dest('./prod/'))
});