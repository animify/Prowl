(($) => {
	class Prowl {
		constructor($elem, opts) {

			/* DEFAULT OPTIONS */
			this._pluginname = 'ProwlJS'
			this._container = opts.container || '.prowl'
			this._toggle = opts.toggleClass.charAt(0) == '.' ? opts.toggleClass : `.${opts.toggleClass}` || '.prowl-toggle'
			this._overlay = opts.overlay || '.prowl-overlay'
			this._modal = opts.modal || '.prowl-modal'
			this._background = opts.background || 'rgba(0,0,0,.85)'
			this._animate = opts.animate || 'fade'
			this._duration = opts.duration || 200

			this._state = 'closed'
			this._states = {
				closed: 'closed',
				open: 'open',
				closing: 'closing',
				opening: 'opening'
			}

			this._opts = opts

			$elem.addClass(this._toggle.substr(1))
			this.initiate()
			this.triggers()
		}

		initiate() {
			if (this.validColor(this._background))
				$(this._overlay).css('background-color', this._background)

			if ($(this._container).is('.opening, .closing, .open, .closed'))
				console.log('true');
			else
				console.log('false');

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
			$(this._container).fadeIn('fast', () => {
				this.animate('open', false)
			})
		}

		close() {
			this.animate('close', function(status) {
				console.log(status);
				$(this._container).fadeOut('fast')
			})
		}

		animate(type, cb) {

			let _this = this

			switch (`${this._animate}_${type}`) {
				case 'fade_open':
					$(this._modal).fadeIn(this._duration)
					break
				case 'fade_close':
					$(this._modal).fadeOut(this._duration)
					break
				case 'slide_open':
					$(this._modal).slideDown(this._duration)
					break
				case 'slide_close':
					$(this._modal).slideUp(this._duration)
					break
			}




			setTimeout($.proxy(typeof cb === 'function' && cb(`${this._animate}_${type}`), $(this._container).trigger(type)), this._duration)
		}

		toggle() {
			if ($(this._container).hasClass("open"))
				this.triggerClose()
			else if ($(this._container).hasClass("closed"))
				this.triggerOpen()
		}

		validColor(color) {
			let ele = document.createElement("div")
			ele.style.color = color
			return ele.style.color.split(/\s+/).join('').toLowerCase()
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
