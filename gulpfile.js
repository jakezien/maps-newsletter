var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');

var juice = require('gulp-juice-concat');
var htmlMin = require('gulp-htmlmin');
var cssNano = require('gulp-cssnano');

var htmlMinOpts = { 
      removeComments: true,
      removeCommentsFromCDATA: true,
      removeCDATASectionsFromCDATA :true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeRedundantAttributes: true,
      preventAttributesEscaping: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      caseSensitive: true,
      minifyCSS: true,
      minifyURLs: true
    }

// Dev tasks
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
          baseDir: "./",
          routes: {
            '/' : 'dev',
            '/prod':'prod'
          }
        },
        port: 9000
    });
});

gulp.task('dev-css', function() {
  gulp.src('assets/css/*.styl', {base: 'assets/css/'})
    .pipe(stylus())
    // .pipe(autoprefixer())
    .pipe(gulp.dest('dev'))
    .pipe(browserSync.stream());
  gulp.src('assets/css/mailframework.css', {base: 'assets/css/'})
    .pipe(gulp.dest('dev'));
});

gulp.task('dev-img', function() {
  gulp.src('assets/img/*', {base: 'assets/'})
    .pipe(gulp.dest('dev'));
});

gulp.task('dev-jade', function() {
  var locals = {};

  gulp.src('./index.jade')
    .pipe(jade({
      locals: locals,
      pretty: true
    }))
    .pipe(gulp.dest('./dev/'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  gulp.watch("assets/css/*", ['prod']);
  gulp.watch("assets/img/*", ['prod']);
  gulp.watch("./**/*.jade", ['prod']);
});

gulp.task('server', ['watch', 'browserSync'])
gulp.task('default', ['server'])



// Production tasks
gulp.task('prod-css', function() {
  gulp.src('assets/css/*.styl', {base: 'assets/css/'})
    .pipe(stylus({compress: true}))
    // .pipe(autoprefixer())
    .pipe(cssNano())
    .pipe(gulp.dest('dev'))
    .pipe(browserSync.stream());
  gulp.src('assets/css/mailframework.css', {base: 'assets/css/'})
    .pipe(cssNano())
    .pipe(gulp.dest('dev'));
});

gulp.task('juice', function() {
  return gulp.src('dev/index.html')
    .pipe(juice({preserveMediaQueries:true}))
    .pipe(gulp.dest('./prod/'))
});

gulp.task('minify-html', function() {
  return gulp.src('dev/index.html')
    .pipe(htmlMin())
    .pipe(gulp.dest('./prod/'))
});

gulp.task('prod', ['prod-css', 'dev-img', 'dev-jade'], function() {
  gulp.src('assets/img/*', {base: 'assets/'})
    .pipe(gulp.dest('./prod'));
  gulp.src('dev/index.html')
    .pipe(juice({ preserveMediaQueries: true }))
    .pipe(htmlMin(htmlMinOpts))
    // .pipe(rename('index.packed.html'))
    .pipe(gulp.dest('./prod'))
    .pipe(browserSync.stream());
});
