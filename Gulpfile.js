'use strict';

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    bourbon = require('node-bourbon'),
    browsersync = require('browser-sync'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    imagemin 	 = require('gulp-imagemin'),
    pngquant 	 = require('imagemin-pngquant'),
    cache 		 = require('gulp-cache'),
    reload = browsersync.reload;

var appRoot = './app',
    buildRoot = './',
    dir = {
        html: '',
        htmlTpl: '/html-tpl',
        js: '/js',
        scss: '/scss',
        css: '/css',
        img: '/img'
    },
    appPaths = {
        html: appRoot + dir.html + '/*.html',
        htmlTpl: appRoot + dir.htmlTpl + '/*.html',
        js: appRoot + dir.js + '/**/*.js',
        scss: appRoot + dir.scss + '/**/*.scss',
        img: appRoot + dir.img + '/**/*.*'
    },
    buildPaths = {
        html: buildRoot + dir.html,
        js: buildRoot + dir.js,
        css: buildRoot + dir.css,
        img: buildRoot + dir.img,
    };

gulp.task('stylesheets', function() {
    return gulp.src(appPaths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass({
            //loadPath: [appPaths.mainScss],
            outputStyle: 'compressed',
            includePaths: bourbon.includePaths
        })).on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(sourcemaps.write())
        //.pipe(rename('index.css'))
        .pipe(gulp.dest(buildPaths.css))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('js', function() {
    return gulp.src(appPaths.js)
        .pipe(uglify())
        .pipe(rename('index.js'))
        .pipe(gulp.dest(buildPaths.js))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('html', function() {
    gulp.src(appPaths.html)
        .pipe(rigger())
        .pipe(gulp.dest(buildPaths.html))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('img', function(){
  return gulp.src(appPaths.img)
    .pipe(cache(imagemin({
      interlaced:true,
      progressive: true,
      svgoplugind:[{removeViewBox:false}],
      use:[pngquant()]
    })))
    .pipe(gulp.dest(buildPaths.img));
});

gulp.task('server', function() {
    browsersync.init({
        server: buildRoot,
        port: 4000,
        notify: false,
        open: true
    });
});

gulp.task('build', [
    'html',
    'js',
    'stylesheets',
    'img'
]);

gulp.task('watch', function() {
    watch([appPaths.html, appPaths.htmlTpl], function(event, cb) {
        gulp.start('html');
    });
    watch([appPaths.scss], function(event, cb) {
        gulp.start('stylesheets');
    });
    watch([appPaths.js], function(event, cb) {
        gulp.start('js');
    });
    watch([appPaths.img], function(event, cb) {
        gulp.start('img');
    });
});

gulp.task('default', [
    'build',
    'server',
    'watch'
]);