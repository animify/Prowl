const connect = require('connect')

const serveStatic = require('serve-static')
connect().use(serveStatic('test', {'index': ['prowl.html']})).listen(8000, () => {
	console.log('Running static Prowl test')
})
