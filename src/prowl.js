(($) => {
	class Prowl {
		constructor(targets, opts) {

			/* DEFAULT OPTIONS */
			this._pluginname = 'ProwlJS'
			this._container = opts.containerClass || '.prowl'
			this._target = null
			this._toggle = opts.toggleClass || '.prowl-toggle'
			this._overlay = opts.overlayClass || '.prowl-overlay'
			this._modal = opts.modalClass || '.prowl-modal'
			this._isMobile = false;

			(window.prowlToggles != undefined) ? this.removeBinding() : this.reset()

			this._background = opts.background || 'rgba(12, 13, 13, 0.57)'
			this._animate = 'fade reveal swash drop'.includes(opts.animate) ? opts.animate : 'fade' || 'fade'
			this._duration = opts.duration || 200
			this._escape = opts.closeOnEscape || true
			this._state = 'open closed'.includes(opts.state) ? opts.state : 'closed' || 'closed'

			(this._toggle.charAt(0) == '.') ? this._toggle : `.${this._toggle}`

			this.cssTop = $(this._modal).css('top')
			this.cssMobileTop = 0
			this.cssLeft = $(this._modal).css('left')
			this.cssMobileLeft = 0
			this.cssBottom = $(this._modal).css('bottom')
			this.cssRight = $(this._modal).css('right')
			this.cssTransform = $(this._modal).css('-webkit-transform').split(/[()]/)[1]

			this._opts = opts

			targets.addClass(this._toggle.substr(1))
			this.triggers()
			this.initiate(targets)
		}

		initiate(targets) {
			let checkWidth = () => {
				($(this._modal).css("position") == "fixed" ) ? this._isMobile = true : this._isMobile = false

				const _visibleModal = $(this._modal).not(":hidden")

				if (_visibleModal.length < 1) return

				if (this._isMobile && _visibleModal[0].style.top != "0px") {
					_visibleModal.css({
						top: this.cssMobileTop,
						left: this.cssMobileLeft
					})
				} else if (!this._isMobile && _visibleModal[0].style.top != this.cssTop) {
					_visibleModal.css({
						top: this.cssTop,
						left: this.cssLeft
					})
				}
			}

			this.validColor(this._background) && $(this._overlay).css('background-color', this._background)

			this._state == 'open' ? this.triggerOpen() : this.triggerClose()

			window.prowlEscape = $(document).keyup((e) => (e.keyCode === 27 && this._state == 'open' && this._escape == true) && this.triggerClose())

			checkWidth()

			window.prowlMobile = $(window).resize(checkWidth)

			if ($(targets).length)
				window.prowlToggles = $(targets).bind('click', (e) => this.toggle(e))
		}

		reset() {
			window.prowlToggles = null
			window.prowlEscape = null
			window.prowlMobile = null
		}

		removeBinding() {
			window.prowlToggles.unbind()
			window.prowlEscape.unbind()
			window.prowlMobile.unbind()
			$(this._modal).removeAttr('style')
		}

		triggers() {
			$(this._container).on('open', (e) => {
				this._state = 'open'
				$('body').addClass('locked')
				$(this._container).removeClass('opening closing closed')
					.addClass('open')
					.attr('data-prowl-state', 'open')

				if (this._opts.onOpen !== undefined) this._opts.onOpen(e)
			}).on('close', (e) => {
				this._state = 'closed'
				$('body').removeClass('locked')
				$(this._container).removeClass('closing opening open')
					.addClass('closed')
					.attr('data-prowl-state', 'closed')

				if (this._opts.onClose !== undefined) this._opts.onClose(e)
			}).on('opening', (e) => {
				this._state = 'opening'
				$(this._container).removeClass('opening closing closed')
					.addClass('opening')
					.attr('data-prowl-state', 'opening')

				if (this._opts.onOpening !== undefined) this._opts.onOpening(e)
			}).on('closing', (e) => {
				this._state = 'closing'
				$(this._container).removeClass('opening closed open')
					.addClass('closing')
					.attr('data-prowl-state', 'closing')

				if (this._opts.onClosing !== undefined) this._opts.onClosing(e)
			})

		}

		triggerOpen(e) {
			$(`${this._container}`).trigger('opening')
			this.open(e)
		}

		triggerClose(e) {
			$(`${this._container}`).trigger('closing')
			this.close(e)
		}

		open(e) {
			$(this._container).fadeIn('fast', () => {
				this.animate(e, 'open', false)
			})
		}

		close(e) {
			this.animate(e, 'close', (status) => {
				$(this._container).fadeOut('fast')
			})
		}

		animate(target, type, cb) {

			if (target !== undefined) {
				let targetModal = $.grep($(this._modal), function(el) {
					return $(el).data('prowl-id') == $(target.target).data('prowl-target')
				})

				this._target = targetModal[0]
			}

			switch (`${this._animate}_${type}`) {
				case 'fade_open':
					$(this._target).fadeIn(this._duration)
					break
				case 'fade_close':
					$(this._target).fadeOut(this._duration)
					break
				case 'reveal_open':
					$(this._target).css({
						top : !this._isMobile ? this.cssTop : this.cssMobileTop,
						left : !this._isMobile ? this.cssLeft : this.cssMobileLeft
					}).slideDown(this._duration)
					break
				case 'reveal_close':
					$(this._target).slideUp(this._duration)
					break
				case 'drop_open':
					$(this._target).css({
						top: -$(this._target).height(),
						left : !this._isMobile ? this.cssLeft : this.cssMobileLeft,
						display: 'block'
					}).animate({
						 top : !this._isMobile ? this.cssTop : this.cssMobileTop
					}, this._duration)
					break
				case 'drop_close':
					$(this._target).animate({top: -$(this._target).height()}, this._duration, () => {
						$(this._target).hide()
					})
					break
				case 'swash_open':
					$(this._target).css({
						top : !this._isMobile ? this.cssTop : this.cssMobileTop,
						left: -$(this._target).width(),
						display: 'block'
					}).animate({
						 left : !this._isMobile ? this.cssLeft : this.cssMobileLeft
					}, this._duration)
					break
				case 'swash_close':
					$(this._target).animate({left: $(window).width()}, this._duration, () => $(this._target).hide())
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

		toggle(e) {
			if (this._state == 'open')
				this.triggerClose()
			else if (this._state == 'closed')
				this.triggerOpen(e)
		}

		validColor(color) {
			const ele = document.createElement("div")
			ele.style.color = color
			return ele.style.color.split(/\s+/).join('').toLowerCase()
		}

		getState() {
			return this._state
		}

	}

	$.fn.prowl = function(opts) {
		opts = opts || {}
		let _this = $(this)
		const instance = new Prowl(_this, opts)

		return instance
	}

})(jQuery)
