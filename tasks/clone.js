'use strict'

const gulp = require('gulp')
const jetpack = require('fs-jetpack')
const watch = require('gulp-watch')

const srcDir = jetpack.cwd('./src')
const destDir = jetpack.cwd('./dist')
const testDir = jetpack.cwd('./test')

gulp.task('copy', () => {
	return watch(srcDir.path('prowl.js'))
		.pipe(gulp.dest(destDir.path()))
})

gulp.task('copy_test', () => {
	return watch(srcDir.path('prowl.js'))
		.pipe(gulp.dest(testDir.path()))
})
