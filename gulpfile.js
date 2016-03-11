const gulp = require('gulp');
const babel = require('gulp-babel');
const header = require('gulp-header');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const pkg = require('./package.json');

const src = 'lightense.es6';
const dest = './';
const banner = '/*! <%= pkg.name %> v<%= pkg.version %> | © <%= pkg.author %> | <%= pkg.license %> */\n';

gulp.task('default', () =>
  gulp.src(src)
    .pipe(babel({ babelrc: true }))
    .pipe(gulp.dest(dest))
    .pipe(uglify())
    .pipe(header(banner, { pkg : pkg }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(dest))
);
