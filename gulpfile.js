var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var stylus = require('gulp-stylus');

// Dev tasks
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./prod"
        }
    });
});

gulp.task('dev-css', function() {
  gulp.src('assets/css/style.styl', {base: 'assets/'})
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(gulp.dest('prod'));
});

gulp.task('dev-html', function() {
  gulp.src('index.html')
    .pipe(gulp.dest('prod'));
});

gulp.task('dev-img', function() {
  gulp.src('assets/img/*', {base: 'assets/'})
    .pipe(gulp.dest('prod'));
});

gulp.task('watch', function() {
  gulp.watch("assets/css/*.styl", ['dev-css']);
  gulp.watch("assets/img/*", ['dev-img']);
  gulp.watch("index.html", ['dev-html']);
});

gulp.task('server', ['watch', 'browserSync'])