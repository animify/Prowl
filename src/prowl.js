'use strict'

class Prowl {
	constructor($elem) {
		this.PLUGINNAME = 'Prowl'
		$elem.addClass('prowl')
	}
}
(function ( $, undefined ) {
$.fn.prowl = (opts) => {
	let instance = null

	return this.each((index, elem) => {
		console.log(index, elem);
		$elem = $(elem)
		instance = new Prowl($elem)
	})

}
}( jQuery ));
