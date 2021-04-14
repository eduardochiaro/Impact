

;(function( $ ){
  $('[data-toggle="tooltip"]').tooltip();
})( window.jQuery );


/* eslint-env browser */

/**
 * Infinite Scroll
 * Used on all pages where there is a list of posts (homepage, tag index, etc).
 *
 * When the page is scrolled to 300px from the bottom, the next page of posts
 * is fetched by following the the <link rel="next" href="..."> that is output
 * by {{ghost_head}}.
 *
 * The individual post items are extracted from the fetched pages by looking for
 * a wrapper element with the class "post-card". Any found elements are appended
 * to the element with the class "post-feed" in the currently viewed page.
 */

(function (window, document) {
	// next link element
	var nextElement = document.querySelector('link[rel=next]');
	if (!nextElement) {
		return;
	}

	// post feed element
	var feedElement = document.querySelector('.grid');
	if (!feedElement) {
		return;
	}

	var buffer = 300;

	var ticking = false;
	var loading = false;

	var lastScrollY = window.scrollY;
	var lastWindowHeight = window.innerHeight;
	var lastDocumentHeight = document.documentElement.scrollHeight;

	function onPageLoad() {
		if (this.status === 404) {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
			return;
		}

		// append contents
		var postElements = this.response.querySelectorAll('article.post-card');
		postElements.forEach(function (item) {
			// document.importNode is important, without it the item's owner
			// document will be different which can break resizing of
			// `object-fit: cover` images in Safari
			feedElement.appendChild(document.importNode(item, true));
		});

		// set next link
		var resNextElement = this.response.querySelector('link[rel=next]');
		if (resNextElement) {
			nextElement.href = resNextElement.href;
		} else {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
		}

		// sync status
		lastDocumentHeight = document.documentElement.scrollHeight;
		ticking = false;
		loading = false;
	}

	function onUpdate() {
		// return if already loading
		if (loading) {
			return;
		}

		// return if not scroll to the bottom
		if (lastScrollY + lastWindowHeight <= lastDocumentHeight - buffer) {
			ticking = false;
			return;
		}

		loading = true;

		var xhr = new window.XMLHttpRequest();
		xhr.responseType = 'document';

		xhr.addEventListener('load', onPageLoad);

		xhr.open('GET', nextElement.href);
		xhr.send(null);
	}

	function requestTick() {
		ticking || window.requestAnimationFrame(onUpdate);
		ticking = true;
	}

	function onScroll() {
		lastScrollY = window.scrollY;
		requestTick();
	}

	function onResize() {
		lastWindowHeight = window.innerHeight;
		lastDocumentHeight = document.documentElement.scrollHeight;
		requestTick();
	}

	window.addEventListener('scroll', onScroll, {passive: true});
	window.addEventListener('resize', onResize);

	requestTick();
})(window, document);
/* eslint-env browser */

/**
 * Gallery card support
 * Used on any individual post/page
 *
 * Detects when a gallery card has been used and applies sizing to make sure
 * the display matches what is seen in the editor.
 */

 (function (window, document) {
	var resizeImagesInGalleries = function resizeImagesInGalleries() {
			var images = document.querySelectorAll('.kg-gallery-image img');
			images.forEach(function (image) {
					var container = image.closest('.kg-gallery-image');
					var width = image.attributes.width.value;
					var height = image.attributes.height.value;
					var ratio = width / height;
					container.style.flex = ratio + ' 1 0%';
			});
	};

	document.addEventListener('DOMContentLoaded', resizeImagesInGalleries);
})(window, document);
(function(root, factory) {

	if (typeof define === 'function' && define.amd) {
			define([], factory);
	} else if (typeof module === 'object' && module.exports) {
			module.exports = factory();
	} else {
			root.SimpleLightbox = factory();
	}

}(this, function() {

	function assign(target) {

			for (var i = 1; i < arguments.length; i++) {

					var obj = arguments[i];

					if (obj) {
							for (var key in obj) {
									obj.hasOwnProperty(key) && (target[key] = obj[key]);
							}
					}

			}

			return target;

	}

	function addClass(element, className) {

			if (element && className) {
					element.className += ' ' + className;
			}

	}

	function removeClass(element, className) {

			if (element && className) {
					element.className = element.className.replace(
							new RegExp('(\\s|^)' + className + '(\\s|$)'), ' '
					).trim();
			}

	}

	function parseHtml(html) {

			var div = document.createElement('div');
			div.innerHTML = html.trim();

			return div.childNodes[0];

	}

	function matches(el, selector) {

			return (el.matches || el.matchesSelector || el.msMatchesSelector).call(el, selector);

	}

	function getWindowHeight() {

			return 'innerHeight' in window
					? window.innerHeight
					: document.documentElement.offsetHeight;

	}

	function SimpleLightbox(options) {

			this.init.apply(this, arguments);

	}

	SimpleLightbox.defaults = {

			// add custom classes to lightbox elements
			elementClass: '',
			elementLoadingClass: 'slbLoading',
			htmlClass: 'slbActive',
			closeBtnClass: '',
			nextBtnClass: '',
			prevBtnClass: '',
			loadingTextClass: '',

			// customize / localize controls captions
			closeBtnCaption: 'Close',
			nextBtnCaption: 'Next',
			prevBtnCaption: 'Previous',
			loadingCaption: 'Loading...',

			bindToItems: true, // set click event handler to trigger lightbox on provided $items
			closeOnOverlayClick: true,
			closeOnEscapeKey: true,
			nextOnImageClick: true,
			showCaptions: true,

			captionAttribute: 'title', // choose data source for library to glean image caption from
			urlAttribute: 'href', // where to expect large image

			startAt: 0, // start gallery at custom index
			loadingTimeout: 100, // time after loading element will appear

			appendTarget: 'body', // append elsewhere if needed

			beforeSetContent: null, // convenient hooks for extending library behavoiur
			beforeClose: null,
			afterClose: null,
			beforeDestroy: null,
			afterDestroy: null,

			videoRegex: new RegExp(/youtube.com|vimeo.com/) // regex which tests load url for iframe content

	};

	assign(SimpleLightbox.prototype, {

			init: function(options) {

					options = this.options = assign({}, SimpleLightbox.defaults, options);

					var self = this;
					var elements;

					if (options.$items) {
							elements = options.$items.get();
					}

					if (options.elements) {
							elements = [].slice.call(
									typeof options.elements === 'string'
											? document.querySelectorAll(options.elements)
											: options.elements
							);
					}

					this.eventRegistry = {lightbox: [], thumbnails: []};
					this.items = [];
					this.captions = [];

					if (elements) {

							elements.forEach(function(element, index) {

									self.items.push(element.getAttribute(options.urlAttribute));
									self.captions.push(element.getAttribute(options.captionAttribute));

									if (options.bindToItems) {

											self.addEvent(element, 'click', function(e) {

													e.preventDefault();
													self.showPosition(index);

											}, 'thumbnails');

									}

							});

					}

					if (options.items) {
							this.items = options.items;
					}

					if (options.captions) {
							this.captions = options.captions;
					}

			},

			addEvent: function(element, eventName, callback, scope) {

					this.eventRegistry[scope || 'lightbox'].push({
							element: element,
							eventName: eventName,
							callback: callback
					});

					element.addEventListener(eventName, callback);

					return this;

			},

			removeEvents: function(scope) {

					this.eventRegistry[scope].forEach(function(item) {
							item.element.removeEventListener(item.eventName, item.callback);
					});

					this.eventRegistry[scope] = [];

					return this;

			},

			next: function() {

					return this.showPosition(this.currentPosition + 1);

			},

			prev: function() {

					return this.showPosition(this.currentPosition - 1);

			},

			normalizePosition: function(position) {

					if (position >= this.items.length) {
							position = 0;
					} else if (position < 0) {
							position = this.items.length - 1;
					}

					return position;

			},

			showPosition: function(position) {

					var newPosition = this.normalizePosition(position);

					if (typeof this.currentPosition !== 'undefined') {
							this.direction = newPosition > this.currentPosition ? 'next' : 'prev';
					}

					this.currentPosition = newPosition;

					return this.setupLightboxHtml()
							.prepareItem(this.currentPosition, this.setContent)
							.show();

			},

			loading: function(on) {

					var self = this;
					var options = this.options;

					if (on) {

							this.loadingTimeout = setTimeout(function() {

									addClass(self.$el, options.elementLoadingClass);

									self.$content.innerHTML =
											'<p class="slbLoadingText ' + options.loadingTextClass + '">' +
													options.loadingCaption +
											'</p>';
									self.show();

							}, options.loadingTimeout);

					} else {

							removeClass(this.$el, options.elementLoadingClass);
							clearTimeout(this.loadingTimeout);

					}

			},

			prepareItem: function(position, callback) {

					var self = this;
					var url = this.items[position];

					this.loading(true);

					if (this.options.videoRegex.test(url)) {

							callback.call(self, parseHtml(
									'<div class="slbIframeCont"><iframe class="slbIframe" frameborder="0" allowfullscreen src="' + url + '"></iframe></div>')
							);

					} else {

							var $imageCont = parseHtml(
									'<div class="slbImageWrap"><img class="slbImage" src="' + url + '" /></div>'
							);

							this.$currentImage = $imageCont.querySelector('.slbImage');

							if (this.options.showCaptions && this.captions[position]) {
									$imageCont.appendChild(parseHtml(
											'<div class="slbCaption">' + this.captions[position] + '</div>')
									);
							}

							this.loadImage(url, function() {

									self.setImageDimensions();

									callback.call(self, $imageCont);

									self.loadImage(self.items[self.normalizePosition(self.currentPosition + 1)]);

							});

					}

					return this;

			},

			loadImage: function(url, callback) {

					if (!this.options.videoRegex.test(url)) {

							var image = new Image();
							callback && (image.onload = callback);
							image.src = url;

					}

			},

			setupLightboxHtml: function() {

					var o = this.options;

					if (!this.$el) {

							this.$el = parseHtml(
									'<div class="slbElement ' + o.elementClass + '">' +
											'<div class="slbOverlay"></div>' +
											'<div class="slbWrapOuter">' +
													'<div class="slbWrap">' +
															'<div class="slbContentOuter">' +
																	'<div class="slbContent"></div>' +
																	'<button type="button" title="' + o.closeBtnCaption + '" class="slbCloseBtn ' + o.closeBtnClass + '">×</button>' +
																	(this.items.length > 1
																			? '<div class="slbArrows">' +
																					 '<button type="button" title="' + o.prevBtnCaption + '" class="prev slbArrow' + o.prevBtnClass + '">' + o.prevBtnCaption + '</button>' +
																					 '<button type="button" title="' + o.nextBtnCaption + '" class="next slbArrow' + o.nextBtnClass + '">' + o.nextBtnCaption + '</button>' +
																				'</div>'
																			: ''
																	) +
															'</div>' +
													'</div>' +
											'</div>' +
									'</div>'
							);

							this.$content = this.$el.querySelector('.slbContent');

					}

					this.$content.innerHTML = '';

					return this;

			},

			show: function() {

					if (!this.modalInDom) {

							document.querySelector(this.options.appendTarget).appendChild(this.$el);
							addClass(document.documentElement, this.options.htmlClass);
							this.setupLightboxEvents();
							this.modalInDom = true;

					}

					return this;

			},

			setContent: function(content) {

					var $content = typeof content === 'string'
							? parseHtml(content)
							: content
					;

					this.loading(false);

					this.setupLightboxHtml();

					removeClass(this.$content, 'slbDirectionNext');
					removeClass(this.$content, 'slbDirectionPrev');

					if (this.direction) {
							addClass(this.$content, this.direction === 'next'
									? 'slbDirectionNext'
									: 'slbDirectionPrev'
							);
					}

					if (this.options.beforeSetContent) {
							this.options.beforeSetContent($content, this);
					}

					this.$content.appendChild($content);

					return this;

			},

			setImageDimensions: function() {

					if (this.$currentImage) {
							this.$currentImage.style.maxHeight = getWindowHeight() + 'px';
					}

			},

			setupLightboxEvents: function() {

					var self = this;

					if (this.eventRegistry.lightbox.length) {
							return this;
					}

					this.addEvent(this.$el, 'click', function(e) {

							var $target = e.target;

							if (matches($target, '.slbCloseBtn') || (self.options.closeOnOverlayClick && matches($target, '.slbWrap'))) {

									self.close();

							} else if (matches($target, '.slbArrow')) {

									matches($target, '.next') ? self.next() : self.prev();

							} else if (self.options.nextOnImageClick && self.items.length > 1 && matches($target, '.slbImage')) {

									self.next();

							}

					}).addEvent(document, 'keyup', function(e) {

							self.options.closeOnEscapeKey && e.keyCode === 27 && self.close();

							if (self.items.length > 1) {
									(e.keyCode === 39 || e.keyCode === 68) && self.next();
									(e.keyCode === 37 || e.keyCode === 65) && self.prev();
							}

					}).addEvent(window, 'resize', function() {

							self.setImageDimensions();

					});

					return this;

			},

			close: function() {

					if (this.modalInDom) {

							this.runHook('beforeClose');
							this.removeEvents('lightbox');
							this.$el && this.$el.parentNode.removeChild(this.$el);
							removeClass(document.documentElement, this.options.htmlClass);
							this.modalInDom = false;
							this.runHook('afterClose');

					}

					this.direction = undefined;
					this.currentPosition = this.options.startAt;

			},

			destroy: function() {

					this.close();
					this.runHook('beforeDestroy');
					this.removeEvents('thumbnails');
					this.runHook('afterDestroy');

			},

			runHook: function(name) {

					this.options[name] && this.options[name](this);

			}

	});

	SimpleLightbox.open = function(options) {

			var instance = new SimpleLightbox(options);

			return options.content
					? instance.setContent(options.content).show()
					: instance.showPosition(instance.options.startAt);

	};

	SimpleLightbox.registerAsJqueryPlugin = function($) {

			$.fn.simpleLightbox = function(options) {

					var lightboxInstance;
					var $items = this;

					return this.each(function() {
							if (!$.data(this, 'simpleLightbox')) {
									lightboxInstance = lightboxInstance || new SimpleLightbox($.extend({}, options, {$items: $items}));
									$.data(this, 'simpleLightbox', lightboxInstance);
							}
					});

			};

			$.SimpleLightbox = SimpleLightbox;

	};

	if (typeof window !== 'undefined' && window.jQuery) {
			SimpleLightbox.registerAsJqueryPlugin(window.jQuery);
	}

	return SimpleLightbox;

}));


;(function( $ ){
  SimpleLightbox.registerAsJqueryPlugin($);

	new SimpleLightbox({
		elements: '.kg-gallery-container img', 
		urlAttribute: 'src',
		nextOnImageClick: false
	});

})( window.jQuery );