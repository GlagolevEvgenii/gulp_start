const gulp = require('gulp'),
    babel = require('gulp-babel'),
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    concatCss = require('gulp-concat-css'),
    pug = require('gulp-pug'),
    sync = require('browser-sync'),
    reload = sync.reload;

// --------------------------------------------If you need svg sprite
const svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace');


const svgSpriteBuild = () => {
    return gulp.src('app/i/icons/*.svg')
        // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg",
                    render: {
                        scss: {
                            dest:'../../../sass/_sprite.scss',
                            template: "app/sass/_sprite_template.scss"
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest('app/i/sprite/'));
};

exports.svgSpriteBuild = svgSpriteBuild;


// --------------------------------------------If you need icon fonts
const iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    fontName = 'Icons';

const iconFonts = () => {
    gulp.src(['app/i/icons/*.svg'])
        .pipe(iconfontCss({
            fontName: fontName,
            path: 'app/sass/iconfont/_icons.scss',
            targetPath: '../sass/_icons.scss',
            fontPath: '../fonts/'
        }))
        .pipe(iconfont({
            fontName: fontName,
            formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
            normalize: true,
            fontHeight: 1001,
            centerHorizontally: true
        }))
        .pipe(gulp.dest('app/fonts/'));
};

exports.iconFonts = iconFonts;

//pug task
const html = () => {
    return gulp.src('app/pug/**/*.pug')
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('./dist/'))
        .pipe(reload({stream: true}));
};

exports.html = html;

// Styles

const style = () => {
    return gulp.src('app/sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(prefix('last 10 versions'))
        .pipe(gulp.dest('dist/css/'))
        .pipe(cleanCSS())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('dist/css/'))
        .pipe(reload({stream: true}));
};
exports.style = style;


// Styles libs

const styleLibs = () => {
    return gulp.src(
        ['node_modules/swiper/swiper-bundle.css',
            './node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css',
        ]
    )
        .pipe(concatCss("lib.min.css"))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css/'));
};
exports.styleLibs = styleLibs;


// Scripts

const js = () => {
    return gulp.src('app/js/main.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(plumber())
        .pipe(gulp.dest('dist/js/'))
        .pipe(uglify())
        .pipe(rename("main.min.js"))
        .pipe(gulp.dest('dist/js/'))
        .pipe(reload({stream: true}));
};

exports.js = js;

// Scripts libs
const jsLibs = () => {
    return gulp.src(
        ['node_modules/jquery/dist/jquery.min.js',
            'node_modules/swiper/swiper-bundle.min.js',
            './node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
        ]
    )
        .pipe(concat("lib.min.js"))
        .pipe(gulp.dest('dist/js/'));
};

exports.jsLibs = jsLibs;

// Copy

const copy = () => {
    return gulp.src([
        'app/fonts/**/*',
        'app/images/**/*',
        'app/sass/**/*',
        'app/i/**/*',
    ], {
        base: 'app'
    })
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream({
            once: true
        }));
};

exports.copy = copy;


// Server

const server = () => {
    let files = [
        'app/sass/**/*.scss'
    ]
    sync.init(files,{
        ui: false,
        notify: false,
        server: {
            baseDir: 'dist'
        }
    });
};

exports.server = server;

// Watch

const watch = () => {
    gulp.watch('app/pug/**/*.pug', gulp.series(html));
    gulp.watch('app/sass/**/*.scss', gulp.series(style));
    gulp.watch('app/js/**/*.js', gulp.series(js));
    gulp.watch([
        'app/fonts/**/*',
        'app/images/**/*',
    ], gulp.series(copy));
};

exports.watch = watch;

// Default

exports.default = gulp.series(
    gulp.parallel(
        html,
        style,
        js,
        styleLibs,
        jsLibs,
        copy,
    ),
    gulp.parallel(
        watch,
        server,
    ),
);