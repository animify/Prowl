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

			console.log(this.width);
			console.log(this.height);

			this.cssTop = $(this._modal).css('top')
			this.cssLeft = $(this._modal).css('left')
			this.cssBottom = $(this._modal).css('bottom')
			this.cssRight = $(this._modal).css('right')
			this.cssTransform = $(this._modal).css('-webkit-transform').split(/[()]/)[1]
			console.log(this.cssTransform);

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
			let _this = this
			this.animate('close', function(status) {
				$(_this._container).fadeOut('fast')
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
				case 'reveal_open':
					$(this._modal).slideDown(this._duration)
					break
				case 'reveal_close':
					$(this._modal).slideUp(this._duration)
					break
				case 'drop_open':
					$(this._modal).css({
						top: -$(this._modal).height(),
						display: 'block'
					}).animate({
						 top : this.cssTop
					}, this._duration)
					break
				case 'drop_close':
					$(this._modal).animate({top: -$(this._modal).height()}, this._duration, () => {
						$(this._modal).hide()
					})
					break
				case 'swash_open':
					$(this._modal).css({
						left: -$(this._modal).width(),
						display: 'block'
					}).animate({
						 left : this.cssLeft
					}, this._duration)
					break
				case 'swash_close':
					$(this._modal).animate({left: $(window).width() + $(this._modal).width()}, this._duration, () => {
						$(this._modal).hide()
					})
					break
				case 'scale_open':
					console.log( this.height);
					$(this._modal).addClass('scale').animate({
							height: this.height,
							width: this.width
						}, this._duration);
					break
				case 'scale_close':
					$(this._modal).animate({left: $(window).width() + $(this._modal).width()}, this._duration, () => {
						$(this._modal).hide()
					})
					break
			}

			if (typeof cb === 'function') {
				setTimeout(() => {
					$(this._container).trigger(type)
					cb(`${this._animate}_${type}`)
				}, this._duration)
			} else {
				$(this._container).trigger(type)
			}

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
