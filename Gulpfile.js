'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    babel = require('gulp-babel'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-clean-css'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    imagemin = require('gulp-imagemin'),
    fileinclude = require('gulp-file-include');

    var path = {
        build: { //Destination where to put our ready to use files
            html: 'public/',
            js: 'public/js/',
            css: 'public/css/',
            img: 'public/img/',
            fonts: 'public/fonts/',
            video: 'public/video/'

        },
        src: { //Source folder
            html: 'src/*.html', //This is the place where we take our htm file
            js: 'src/js/main.js', //The place we take our js file, its the only one - and its the main

            style: 'src/scss/main.scss', //Here we take our scss, it includes all of the scss we use
            img: 'src/img/**/*', //We take images here, including nested folders
            fonts: 'src/fonts/*',
            video: 'src/video/*'
        },
        watch: { //We "watch" for changes from this folders and files
            html: 'src/**/*.html',
            js: 'src/**/*.js',

            style: 'src/scss/**/*.scss',
            img: 'src/img/**/*',
            fonts: 'src/fonts/*',
            video: 'src/video/*'
        },
        clean: './public'
    };


var config = {
    server: {
        baseDir: "./public"
    },
    //tunnel: true, //it is commented, because of an issue while using proxy connection, so far it fixes the problem
    host: 'localhost',
    port: 9000,
    logPrefix: "NeedHate"
};


gulp.task('html:build', function () {
    gulp.src(path.src.html)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});
gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger()) //This pipe helps to take all needed js files, which are included through the main.js
        .pipe(babel({
            presets: ['env', 'stage-0']
        }))
        .pipe(sourcemaps.init()) //Inits sourcemap
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});
gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        //.pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(path.build.img))
        // .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        // .pipe(reload({stream: true}));
});

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
});

gulp.task('clear', () =>
    cache.clearAll()
);

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'image:build',
    'fonts:build'
]);

gulp.task('server', function () {
    browserSync(config);
});

gulp.task('start', ['build', 'server', 'watch']);
