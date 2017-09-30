'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
let cleanCSS = require('gulp-clean-css');
 
gulp.task('sass', function () {
  return gulp.src('./public/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./public/css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./public/scss/*.scss', ['sass']);
  gulp.watch('./public/scss/site/*.scss', ['sass']);
});