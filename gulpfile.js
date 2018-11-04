
const gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	concat = require('gulp-concat'),
	copy = require('gulp-copy'),
	webserver = require('gulp-webserver'),
	sass = require('gulp-sass'),
	maps = require('gulp-sourcemaps'),
	del = require('del'),
	imageMin = require('gulp-imagemin'),
	runSequence = require('run-sequence');

gulp.task('scripts', function() {
   return gulp.src([
        'js/circle/autogrow.js',
        'js/circle/circle.js',
        'js/global.js'
        ])
    .pipe(maps.init())
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('styles', function() {
    return gulp.src(['sass/global.scss'])
    .pipe(maps.init())
    .pipe(sass())
    .pipe(concat('all.min.css'))
    .pipe(cleanCSS())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/styles'));
});


gulp.task('images', function(){
	return gulp.src('images/*')
	.pipe(imageMin())
	.pipe(copy('dist/content', { prefix: 1 }));
});

gulp.task('html', function(){
	return gulp.src('index.html')
	.pipe(gulp.dest('dist'));
})

gulp.task('watchFiles', function() {
  gulp.watch('sass/global.scss', ['styles']);
});

gulp.task('serve', function(){
	gulp.src('dist')
		.pipe(webserver({
			livereload: true,
			port: 3000,
			open: true
			}));
});

gulp.task('clean', function(){
	return del('dist/*');
});

//runs tasks in sequence with callback so tasks are complete before being served
gulp.task('build', ['clean'], function(callback){
	runSequence('images', ['scripts', 'styles', 'html'], function(){
		callback();
	});
});

gulp.task('default', ['build'], function(){
	gulp.start('serve','watchFiles');
});