/** @license
 * Skinny Scroll
 *
 * Author: Wesley Luyten
 * Version: 1.0 - (2012/07/30)
 *			1.1 - (2013/01/25)
 */

window.SkinnyScroll = function(el, options) {

	var mode = null;

	this.hasTouch = 'ontouchstart' in window;
	var defaults = {
		color: '#fff',
		radius: 6,
		width: 6
	};
	this.config = _.extend(defaults, options);

	var wrap = document.getElementById(el) || el;
	_.css(wrap, { overflow: 'hidden' });

	var view = wrap.children[0];
	_.css(view, {
		position: 'absolute',
		left: 0,
		top: 0,
		right: 0
	});

	if (this.hasTouch) {
		mode = new TouchMode(this, wrap, view);
	} else {
		_.css(view, {
			overflow: 'hidden',
			bottom: 0
		});
		mode = new MouseMode(this, wrap, view);
	}

	mode.redraw();
	_.on(window, 'resize', mode.redraw);

	this.scrollTop = function(y) {
		return mode.scrollTop(y);
	};

	this.redraw = function() {
		return mode.redraw();
	};

	this.destroy = function() {
		_.off(window, 'resize', mode.redraw);
		mode.destroy();
	};
};
