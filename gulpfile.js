`use strict`;

//declarations
const gulp = require(`gulp`);
const babel = require(`gulp-babel`);
const concat = require(`gulp-concat`);
const minify = require(`gulp-minify`);
const annotate = require(`gulp-ng-annotate`);
const rename = require(`gulp-rename`);
const uglify = require(`gulp-uglify`);
const htmlMin = require(`gulp-htmlmin`);
const uglyCss = require(`gulp-uglifycss`);
const gutil = require(`gulp-util`);
const merge = require(`merge-stream`);
const browserify = require(`browserify`);
const source = require(`vinyl-source-stream`);
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const del = require(`del`);


let env = `development`;
//Gulp tasks

gulp.task(`js`, () => {

    let b = browserify({
        entries: './index.js',
        debug: true
    });

    return b.transform("babelify", {presets: ["es2015"]})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat(`all.js`))
        .pipe(annotate())
        .pipe(env === `production` ? minify() : gutil.noop())
        .pipe(rename(`all.min.js`))
        .pipe(env === `production` ? uglify() : gutil.noop())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task(`css`, () => {
    return gulp.src(`./styles.css`)
        .pipe(uglyCss())
        .pipe(concat(`style.css`))
        .pipe(gulp.dest(`./dist`));
});

gulp.task(`views`, () => {
    return gulp.src(`./home/*.html`)
        .pipe(htmlMin(
            {collapseWhitespace: true}
        ))
        .pipe(gulp.dest(`./dist/routes`))
});

gulp.task(`index`, () => {
    return gulp.src(`./index.html`)
        .pipe(htmlMin(
            {collapseWhitespace: true}
        ))
        .pipe(gulp.dest(`./dist/`))
});

gulp.task('clean', () => {
    return del([`./dist/**/*`]);
});

gulp.task(`deploy`, [`js`, `css`, `views`, `index`], (next) => {
    env = `production`;
    return next();
});

gulp.task(`dev`, [`js`, `css`, `views`, `index`], (next) => {
    env = `development`;
    return next();
});

gulp.task(`watch`, ()=> {
    gulp.watch([`./home/*.*`, `./index.js`, `./index.html`, `./style.css`], [`dev`])
});

gulp.task(`default`, [`dev`, `watch`], (next)=> {
    return next();
});
