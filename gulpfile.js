var gulp = require("gulp");
var pug = require("gulp-pug");
var stylus = require("gulp-stylus");
var terser = require("gulp-terser");

// Compile the index .pug file from "src" to "/" 
gulp.task("pug-index-to-html", function () {
	return gulp.src("src/index.pug")
		.pipe(pug())
		.pipe(gulp.dest("."))
});

// Compile .pug files (Pug templates) from "src" to "dist"
gulp.task("pug-to-html", function () {
	return gulp.src(["src/[^_]*.pug", "!src/index.pug"])
		.pipe(pug())
		.pipe(gulp.dest("dist"))
});

// Compile .styl files (Stylus stylesheets) from "src" to "dist"
gulp.task("stylus-to-css", function () {
	return gulp.src("src/css/[^_]*.styl")
		.pipe(stylus({
			compress: true
		}))
		.pipe(gulp.dest("dist/css"));
});

// Minify the js output from "src" to "dist"
gulp.task("minify-js", function () {
	return gulp.src("src/js/*.js")
		.pipe(terser())
		.pipe(gulp.dest("dist/js"));
});

// Compile Pug templates, stylus stylesheets and Coffeescript scripts at once
gulp.task("build", gulp.parallel("pug-index-to-html", "pug-to-html", "stylus-to-css", "minify-js"));

// Watch for any file change on the "src" directory
gulp.task("watch", function () {
	gulp.watch("src/index.pug", gulp.parallel("pug-index-to-html"));
	gulp.watch(["src/*.pug", "!src/index.pug"], gulp.parallel("pug-to-html"));
	gulp.watch("src/css/*.styl", gulp.parallel("stylus-to-css"));
	gulp.watch("src/js/*.js", gulp.parallel("minify-js"));
});

// Run the build task and watch for file changes
gulp.task("default", gulp.parallel("build", "watch"));