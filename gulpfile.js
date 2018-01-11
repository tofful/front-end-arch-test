// Loading modules
var gulp           = require('gulp');
var autoprefixer   = require('gulp-autoprefixer');
var browserSync    = require('browser-sync').create();
var concat         = require('gulp-concat');
var csslint        = require('gulp-csslint');
var header         = require('gulp-header');
var jshint         = require('gulp-jshint');
var pkg            = require('./package.json');
var sass           = require('gulp-sass');
var sassLint       = require('gulp-sass-lint');
var sourcemaps     = require('gulp-sourcemaps');
var uglify         = require('gulp-uglify');

// App config
var themeDir = 'app/';

var app = {

    path: {
        theme          : themeDir,
        srcDir         : themeDir + 'src',
        cssDir         : themeDir + 'css',
        jsDir          : themeDir + 'js',
        jsSrcDir       : themeDir + 'src/js',
        jsApp          : themeDir + 'src/js/app.js',

        sassFiles      : [
            themeDir + 'src/sass/**/*.scss'
        ]
    },

    banner: ['/**',
        ' * v<%= pkg.version %>',
        ' * Copyright (c) <%= pkg.year %> - <%= pkg.author %>',
        ' * <%= pkg.license %> License',
        ' */',
    ''].join('\n')
};


// Compile sass into CSS, add vendor prefixes, lint it & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(app.path.sassFiles)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(header(app.banner, {pkg: pkg}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(app.path.cssDir))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

// Sass Lint
gulp.task('sass-lint', function () {
    return gulp.src(app.path.sassFiles)
        .pipe(sassLint({
            options: { configFile: '.sass-lint.yml'}
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

// Minify JavaScript files & reload browsers
// this is for demo purposes, NOT IN USE for this demo
gulp.task('js', function() {
    // return gulp.src(app.path.jsApp)
    //     .pipe(uglify())
    //     .pipe(header(app.banner, {pkg: pkg}))
    //     .pipe(gulp.dest(app.path.jsDir))
    //     .pipe(browserSync.stream());
});

// Static Server + watching files
gulp.task('serve', ['sass', 'sass-lint', 'js'], function() {
    gulp.watch(app.path.sassFiles, ['sass']);
    gulp.watch(app.path.sassFiles, ['sass-lint']);
    gulp.watch(app.path.jsApp, ['js-lint']);
});

// Main tasks
gulp.task('default', ['serve']);
