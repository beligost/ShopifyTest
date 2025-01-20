import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import autoprefixer from 'gulp-autoprefixer';
import groupmedia from 'gulp-group-css-media-queries';

const sass = gulpSass(dartSass);

const path = {
    styles: {
        src: './src/scss/*.scss',
        dist: './assets/',
        watch: './src/scss/*.{scss,sass}'
    },

};

gulp.task('styles', () => {
    return gulp.src(path.styles.src)
        .pipe(sass())
        .pipe(groupmedia())
        .pipe(autoprefixer({ cascade: false, grid: true }))
        .pipe(gulp.dest(path.styles.dist))
});

gulp.task('watch', () => {
    gulp.watch(path.styles.watch, gulp.series('styles'));
})