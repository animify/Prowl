const gulp = require('gulp')

gulp.task('start', ['stylusmain', 'stylus'])
gulp.task('test', ['stylusmaintest', 'stylustest'])
