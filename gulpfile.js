var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var del = require('del');
var jshint = require('gulp-jshint');

var buildProduction = utilities.env.production;//

//telling the bower-files package where to find the Bootstrap files we're interested in ...
var lib = require('bower-files')({
  /* ...we do so by passing an object into our initital call to the bower-files pkg with some initialization settings in it*/
  "overrides":{
    "bootstrap" :{
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dits/js/bootstrap.js"
      ]
    }
  }
});

var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

//linter to check for js errors
gulp.task('jshint', function(){
  return gulp.src(['js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//combine all js files in js folder in temporary file allConcat
gulp.task('concatInterface', function() {
  return gulp.src(['./js/*.js'])
    .pipe(concat('allConcat.js'))
    .pipe(gulp.dest('./tmp'));
});

// run concatInterface before jsBrowserify
gulp.task('jsBrowserify', ['concatInterface'], function() {
  return browserify({ entries: ['./tmp/allConcat.js'] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'));
});

//minify files
gulp.task("minifyScripts", ["jsBrowserify"], function(){
  return gulp.src("./build/js/app.js")
  .pipe(uglify())
  .pipe(gulp.dest("./build/js"));
});

/* use gulp.src to pull in all files with .js extension and output one concatenated minified file called vendor.min.js. Finally use gulp.dest to put the finished file into our build/js directory */
gulp.task('bowerJS', function(){
  return gulp.src(lib.ext('js').files)
  .pipe(concat('vendor.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./build/js'));
});

/* use gulp.src to pull in all files with .css extension and output one concatenated file called vendor.css. Finally use gulp.dest to put the finished file into our build/css directory */
gulp.task('bowerCSS', function(){
  return gulp.src(lib.ext('css').files)
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('./build/css'));
});

/*combining the two bower tasks into one, since they can run in parallel
Now we can run a task with gulp bower - thus running both JS and CSS tasks concurrently - any time we add a bower dependency*/
gulp.task('bower', ['bowerJS', 'bowerCSS']); //bowerJS and bowerCSS are two dependency tasks

//Clean up directory
gulp.task("clean", function(){
  return del(['build', 'tmp']);
});

//combines clean and build, running clean first because it is a dependency
gulp.task("build", ['clean'], function(){
  if (buildProduction) {
    gulp.start('minifyScripts');//ensure minify runs each time we build
  } else {
    gulp.start('jsBrowserify');
  }
  gulp.start('bower'); //making sure that this bower task runs automatically when we build
  gulp.start('cssBuild');
});

// make a task to start server using browserSync pkg
gulp.task('serve', ['build'], function(){
  browserSync.init({//initialise browserSync
    server: {
      baseDir:"./",//telling browserSync to launch the local server from the directory that we are currently in
      index:"index.html"//telling it that the entry point, the place where we want to start our app, is our index.html file.
    }
  });
/*Automatic replacement of files on the server and reloading of browser when JavaScript changes using the method watch i.e. gulp.watch()
gulp.watch() takes two arguments:
    first is an array of file names that we want gulp to keep an eye on.
    The second argument is an array of tasks to run whenever any of the aforementioned files change*/
  gulp.watch(['js/*.js'], ['jsBuild']); //says to watch all the files in the development JS folder and whenever one of the files changes, run the task jsBuild
  gulp.watch(['bower.json'], ['bowerBuild']);//watcher for bower dependencies. ...watching the Bower manifest file for changes so that whenever we install or uninstall a frontend dependency our vendor files will be rebuilt and the browser reloaded with the bowerBuild task (below)

  gulp.watch(['*.html'], ['htmlBuild']);// because we have more than one .html file to keep track of, we add a watcher to our server for HTML files

  gulp.watch("scss/*.scss", ['cssBuild']);
});// add a watcher for our SCSS files to our serve task, so that they are built automatically whenever they are changed.

/*This task lists an array of dependency tasks that need to be run whenever any of the js files change, i.e. the linter (jshint) and jsBrowserify along with its dependencies*/
gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function(){ //the linter can be run at the same time as we concatenate and browserify our files since they are independent from each other.
  browserSync.reload(); //Then once those are complete, we use the task functon to call browserSync.reload() and reload the browser
});

// bowerBuild task referenced above
gulp.task('bowerBuild', ['bower'], function(){
  browserSync.reload();
});

// HTMl build task to reload the browser any time our HTML files change
gulp.task('htmlBuild', function() {
  browserSync.reload();
});


gulp.task('cssBuild', function(){
  return gulp.src(['scss/*.scss']) //load all files in scss folder that have ext .scss
  .pipe(sourcemaps.init()) //sourcemaps adds code that allows us to see thich sass files are responsible for each css rule we see in the browser
  .pipe(sass()) //translates files into normal css
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./build/css')) //save compiled css with its source maps into a folder names css
  .pipe(browserSync.stream());
});
