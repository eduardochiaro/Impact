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

const useLazy = false;

(function (window, document) {
	// next link element
	var nextElement = document.querySelector('link[rel=next]');
	if (!nextElement) {
		return;
	}

	// post feed element
	var feedElement = document.querySelector('.feed');
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
		if (this.status === 404 && useLazy) {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
			return;
		}

		// append contents
		var postElements = this.response.querySelectorAll('article.post-card');
		console.log(postElements.length);
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
			//console.log('last');
			if (useLazy) {
				window.removeEventListener('scroll', onScroll);
				window.removeEventListener('resize', onResize);
			} else {
				$('.load-next-page').remove();
			}
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
		if (useLazy) {
			if (lastScrollY + lastWindowHeight <= lastDocumentHeight - buffer) {
				ticking = false;
				return;
			}
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

	if (useLazy) {
		window.addEventListener('scroll', onScroll, {passive: true});
		window.addEventListener('resize', onResize);
	
		requestTick();
	} else {
		$('.load-next-page').on('click', function(event) {
			event.preventDefault();
			onUpdate();
		})
	}
})(window, document);