const { src, dest, watch, series, parallel } = require('gulp')
const cssnano = require('gulp-cssnano')
const pug = require('gulp-pug')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const gls = require('gulp-live-server')
const clean = require('gulp-clean')

const css = () => {
  return src('./src/css/*.css')
    .pipe(cssnano())
    .pipe(dest('./dist/css'))
}

const js = () => {
  return src('./src/js/*.js')
    .pipe(concat('app.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(dest('./dist/js'))
}

const asset = () => {
  return src('./src/assets/**/*.{png,jpg,jpeg,webp,svg,ico}')
    .pipe(dest('./dist/assets'))
}

const pages = () => {
  return src('./src/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest('./dist'))
}

const cleanup = () => {
  return src('./dist', { read: false, allowEmpty: true })
    .pipe(clean())
}

const compile = series(cleanup, parallel(pages, asset), js, css)

const serve = () => {
  const server = gls.static('dist')

  server.start()

  watch(['./src/css/*.css', './src/js/*.js', './src/assets/**/*.{png,jpg,jpeg,webp,svg,ico}', './src/**/*.pug'], compile)
}

exports.css = css
exports.js = js
exports.asset = asset
exports.pages = pages
exports.cleanup = cleanup
exports.serve = series(compile, serve)
exports.default = compile