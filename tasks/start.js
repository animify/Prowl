const gulp = require('gulp')

gulp.task('start', ['stylusmain', 'stylus', 'copy'])
gulp.task('dev', ['stylusmaintest', 'stylustest', 'copy_test'])
