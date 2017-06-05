const connect = require('connect')

const serveStatic = require('serve-static')
connect().use(serveStatic('test', {'index': ['index.html']})).listen(8000, () => {
	console.log('Serving static files on :8000')
})
