/** @license
 * Skinny Scroll
 *
 * Author: Wesley Luyten
 * Version: 1.0 - (2012/07/30)
 */

(function(C) {

	C.SkinnyScroll = function(el, config) {
		var C = SkinnyScroll;
		var Utils = C.Utils;
		var that = this;
		var mode = null;

		that.hasTouch = 'ontouchstart' in window;
		that.config = {
			color: "#fff",
			radius: 7,
			width: 7
		};

		for (var i in config) that.config[i] = config[i];

		var wrap = typeof el === "object" ? el : document.getElementById(el);
		Utils.css(wrap, {
			overflow: "hidden"
		});

		var view = wrap.children[0];
		Utils.css(view, {
			position: "absolute",
			left: 0,
			top: 0,
			right: 0
		});

		if (that.hasTouch) {

			mode = new C.TouchMode(this, wrap, view);
		} else {

			Utils.css(view, {
				overflow: "hidden",
				bottom: 0
			});

			mode = new C.MouseMode(this, wrap, view);
		}

		mode.redraw();
		Utils.on(window, 'resize', mode.redraw);

		that.scrollTop = function(y) {
			return mode.scrollTop(y);
		};

		that.redraw = function() {
			mode.redraw();
		};

		that.destroy = function() {
			Utils.off(window, 'resize', mode.redraw);
			mode.destroy();
		};
	};

})(window);
