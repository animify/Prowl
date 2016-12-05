const express = require('express')
const app = express()
const fs = require('fs')
const jetpack = require('fs-jetpack')

const jt = jetpack.cwd('./app/')

const log = require(jt.path('logs/log'))(module)
const config = require(jt.path('config'))

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const request = require('request').defaults({ encoding: null })

const root = require(jt.path('routes/root'))
const endpoint = require(jt.path('routes/endpoint'))

app.use(express.static("app/public"))
app.use(bodyParser())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.set('port', process.env.PORT || config.get('port') || 80)
app.set('views', jt.path('views/pages'))
app.set('view engine', 'pug')
app.set('view options', { layout: false })

app.use('/', root)
app.use('/api/v1', endpoint)

app.listen(app.get('port'), () => {
	log.info('Slant running on port ' + app.get('port'))
})
