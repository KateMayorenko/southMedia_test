var gulp = require('gulp');

var sass = require('gulp-sass');

var svgSprite = require('gulp-svg-sprites'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace'); //обьявляю плагины

gulp.task('svgSpriteBuild', function () {
	return gulp.src('images/sprites/*.svg')
		// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill and style declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		// cheerio plugin create unnecessary string '>', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
				mode: "symbols",
				preview: false,
				selector: "icon-%f",
				svg: {
					symbols: 'symbol_sprite.html' //наш спрайт дорогой
				}
			}
		))
		.pipe(gulp.dest('images/'));
});

// делаю стиль для symbol_sprite.html 
gulp.task('svgSpriteSass', function () {
	return gulp.src('images/sprites/*.svg')
		.pipe(svgSprite({
				preview: false,
				selector: "icon-%f",
				svg: {
					sprite: 'svg_sprite.html'
				},
				cssFile: '../sass/_svg_sprite.scss',
				templates: {
					css: require("fs").readFileSync('sass/_sprite-template.scss', "utf-8")
				}
			}
		))
		.pipe(gulp.dest('images/'));
});

gulp.task('svgSprite', ['svgSpriteBuild', 'svgSpriteSass']);