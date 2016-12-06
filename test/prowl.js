(($) => {
	class Prowl {
		constructor($elem, opts) {

			/* DEFAULT OPTIONS */
			this._pluginname = 'ProwlJS'
			this._container = opts.container || '.prowl'
			this._toggle = opts.toggleClass.charAt(0) == '.' ? opts.toggleClass : `.${opts.toggleClass}` || '.prowl-toggle'
			this._overlay = opts.overlay || '.prowl-overlay'
			this._background = opts.background || '#FFF'
			this._state = 'closed'

			this._opts = opts

			$elem.addClass(this._toggle.substr(1))
			this.initiate()
			this.triggers()

		}

		initiate() {
			if (this._container )
			$('body').on('click', '.toggle', (e) => {
				this.toggle()
			})
		}

		triggers() {

			$(this._container).on('open', (e) => {
				this._state = 'open'
				$(this._container).removeClass('opening closing closed')
					.addClass('open')
					.attr('data-prowl-state', 'open')

				if (this._opts.onOpen !== undefined) this._opts.onOpen(e)
			})

			$(this._container).on('close', (e) => {
				this._state = 'closed'
				$(this._container).removeClass('closing opening open')
					.addClass('closed')
					.attr('data-prowl-state', 'closed')

				if (this._opts.onClose !== undefined) this._opts.onClose(e)
			})

			$(this._container).on('opening', (e) => {
				this._state = 'opening'
				$(this._container).removeClass('opening closing closed')
					.addClass('opening')
					.attr('data-prowl-state', 'opening')

				if (this._opts.onOpening !== undefined) this._opts.onOpening(e)
			})

			$(this._container).on('closing', (e) => {
				this._state = 'closing'
				$(this._container).removeClass('opening closed open')
					.addClass('closing')
					.attr('data-prowl-state', 'closing')

				if (this._opts.onClosing !== undefined) this._opts.onClosing(e)
			})

		}

		triggerOpen() {
			$(`${this._container}`).trigger('opening')
			this.open()
		}

		triggerClose() {
			$(`${this._container}`).trigger('closing')
			this.close()
		}

		open() {
			$(this._overlay).fadeIn('fast', () => {
				$(this._container).trigger('open')
			})
		}

		close() {
			$(this._overlay).fadeOut('fast', () => {
				$(this._container).trigger('close')
			})
		}

		toggle() {
			if ($(this._container).hasClass("open"))
				this.triggerClose()
			else if ($(this._container).hasClass("closed"))
				this.triggerOpen()
		}

		getState() {
			return this._state
		}

	}

	$.fn.prowl = function(opts) {
		opts = opts || {}
		$this = $(this)
		instance = new Prowl($this, opts)

		return instance
	}

})(jQuery)
