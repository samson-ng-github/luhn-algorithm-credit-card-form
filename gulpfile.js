const server = require('node-http-server');
const gulp = require('gulp');
const sass = require('gulp-sass');
 
sass.compiler = require('node-sass');
 
gulp.task('sass', () => {
    return gulp.src('./src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src'));
});
 
gulp.task('default', () => {
    gulp.series('sass')();
    gulp.watch('./src/**/*.scss', gulp.series('sass'));
});

server.deploy({
    port: 2467,
    root: './src'
}, () => console.log('Server running on http://localhost:2467'));