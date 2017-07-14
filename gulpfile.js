'use strict'

var gulp = require('gulp');
var pug = require('gulp-pug');
var prettify = require('gulp-html-prettify');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssmin = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var svgmin = require('gulp-svgmin');
var del = require('del');
var svgstore = require('gulp-svgstore');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var server = require('browser-sync').create();


//Сборка из PUG в HTML
gulp.task('html', function buildHTML() {
  return gulp.src('source/pug/pages/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(prettify({indent_char: ' ', indent_size: 2}))
  .pipe(gulp.dest('prebuild'));
});
//Сборка CSS из SASS
gulp.task('style', function() {
  gulp.src('source/scss/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        'last 2 versions'
      ]})
    ]))
    .pipe(cssmin())
    .pipe(gulp.dest('prebuild/css'))
    //.pipe(server.stream());
});
//Оптимизация картинок
gulp.task('images', function() {
  return gulp.src('source/img/**/*.{png,jpg,gif}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
]))
    .pipe(gulp.dest('prebuild/img'));
});
//Оптимизация SVG
gulp.task('svg', function () {
    return gulp.src('source/img/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(gulp.dest('prebuild/img/icons'))
});
//Удаление папки Build
gulp.task('clean', function() {
  return del('prebuild');
});
//SVG спрайт
gulp.task("symbols", function() {
return gulp.src("prebuild/img/icons/*.svg") .pipe(svgmin())
.pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("prebuild/img/icons")); 
});
//Сервер
// Static server
/*
gulp.task('server', function() {
    server.init({
        server: {
            baseDir: "prebuild"
        }
    });
*/
gulp.task('server', ['style'], function() {
  server.init({
    server: 'prebuild',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
///Вотч
gulp.watch('source/scss/**/*.{scss,sass}', ['style']).on('change',server.reload);
  gulp.watch('source/pug/**/*.pug',['html']).on('change', server.reload);
});
//Копирование файлов




