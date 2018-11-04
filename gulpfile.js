/*
(COMPLETE) 1. Build Process Dependencies:
	-Running the npm install command installs the build process dependencies properly

(COMPLETE) 2. Scripts Task:
	-The gulp scripts command concatenates, minifies, and copies all of the project’s JavaScript files into an all.min.js file
	-The command copies the all.min.js file into the dist/scripts folder

(COMPLETE) 3. Styles Task:
	-The gulp styles command compiles the project’s SCSS files into CSS, and concatenates and minifies into an all.min.css file
	-The command copies the all.min.css file into the dist/styles folder

(COMPLETE) 4. Source Maps:
	-The gulp scripts command generates JavaScript source maps
	-The gulp styles command generates CSS source maps

(COMPLETE) 5. Images Task:
	-The gulp images command copies the optimized images to the dist/content folder.
 
(COMPLETE) 6. Clean Task:
 	-The gulp clean command deletes all of the files and folders in the dist folder.

(COMPLETE) 7. Build Task:
 	-The gulp build command properly runs the clean, scripts, styles, and images tasks.
 	-The clean task fully completes before the scripts, styles, and images tasks are ran.

8. Default Task:
	-The gulp command properly runs the build task as a dependency
	-The gulp command serves the project using a local webserver.
	-The gulp command also listens for changes to any .scss file. When there is a change to any .scss file, the gulp styles command is run, the files are compiled, concatenated and minified to the dist folder, and the browser reloads, displaying the changes
*/

const gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	concat = require('gulp-concat'),
	copy = require('gulp-copy'),
	webserver = require('gulp-webserver'),
	sass = require('gulp-sass'),
	maps = require('gulp-sourcemaps'),
	del = require('del'),
	useref = require('gulp-useref'),
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


gulp.task('watchFiles', function() {
  gulp.watch('sass/global.scss', ['styles']);
});

gulp.task('reload', function(){

})

gulp.task('serve', function(){
	gulp.src(['dist'])
		.pipe(webserver({
			livereload: {
				enable: true,
				filter: function(fileName) {
          			if (fileName.match(/.map$/)) { // exclude all source maps from livereload
            			return false;
          			} else {
            			return true;
          			} 
				}	
			},
			port: 3000,
			open: true
			}));
});

gulp.task('clean', function(){
	return del(['dist/content','dist/scripts','dist/styles']);
});

gulp.task('build', ['clean'], function(callback){
	runSequence('images', ['scripts', 'styles'], function(){
		callback();
	});
});

gulp.task('default', ['build'], function(){
	gulp.start('serve','watchFiles');
});