/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

'use strict';

var _SRC = './src/';
var SRC = _SRC.concat('/');

var _BUILT = './built';
var BUILT = _BUILT.concat('/');
var BUILT_TEST = _BUILT.concat('.test/');
var BUILT_TYPINGS = _BUILT.concat('/typings/');

var DST = './dist/';
var LIB = './lib/';

var gulp = require('gulp');
var del = require('del');
var merge = require('merge2');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var ts = require('gulp-typescript');
var tsProject = ts.createProject(SRC.concat('tsconfig.json'));

gulp.task('clean', function (done) {
    del([BUILT, BUILT_TEST, DST, LIB]).then(paths => done());
});

gulp.task('build', function () {
    var result = gulp.src(SRC.concat('**/*.ts'))
        .pipe(tsProject(ts.reporter.defaultReporter()));

    return merge([
        result.js.pipe(gulp.dest(BUILT)),
        result.dts.pipe(gulp.dest(BUILT_TYPINGS)),
        gulp.src(SRC.concat('pxtcloud.api.d.ts')).pipe(gulp.dest(BUILT_TYPINGS)),
    ]);
});

var glob = require('glob');
var browserify = require('browserify');
var uglifyjs = require('uglify-js');
var rename = require('gulp-rename');
var composer = require('gulp-uglify/composer');
var minify = composer(uglifyjs, console);

var rollup = require('rollup-stream');

gulp.task('bundle', function () {
    var result = rollup('rollup.config.js')
        .pipe(source('index.js'))
        .pipe(gulp.dest(LIB));

    var bundle = browserify({
            entries: glob.sync(BUILT.concat('**/*.js')),
            standalone: 'PxtCloudAPI',
        })
        .bundle();

    var resultb = bundle
        .pipe(source('pxtcloud.api.dev.js'))
        .pipe(buffer())
        .pipe(gulp.dest(DST))
        .pipe(minify())
        .pipe(rename('pxtcloud.api.js'))
        .pipe(gulp.dest(DST));

    return merge([
        result,
        gulp.src(BUILT_TYPINGS.concat('**')).pipe(gulp.dest(LIB)),
        resultb,
    ]);
});

gulp.task('default', gulp.series('clean', 'build', 'bundle'));