/** @license
 * Skinny Scroll
 *
 * Author: Wesley Luyten
 * Version: 1.0 - (2012/07/30)
 */

(function(global) {

	var C = function(el, config) {

		var mode = null;

		this.hasTouch = "ontouchstart" in window;
		this.config = {
			color: "#fff",
			radius: 7,
			width: 7
		};

		for (var i in config) this.config[i] = config[i];

		var wrap = typeof el === "object" ? el : document.getElementById(el);
		C.Utils.css(wrap, {
			overflow: "hidden"
		});

		var view = wrap.children[0];
		C.Utils.css(view, {
			position: "absolute",
			left: 0,
			top: 0,
			right: 0
		});

		if (this.hasTouch) {
			mode = new C.TouchMode(this, wrap, view);
		} else {

			C.Utils.css(view, {
				overflow: "hidden",
				bottom: 0
			});

			mode = new C.MouseMode(this, wrap, view);
		}

		mode.redraw();
		C.Utils.on(window, 'resize', mode.redraw);

		this.scrollTop = function(y) {
			return mode.scrollTop(y);
		};

		this.redraw = function() {
			return mode.redraw();
		};

		this.destroy = function() {
			C.Utils.off(window, 'resize', mode.redraw);
			mode.destroy();
		};
	};

	global.SkinnyScroll = C;

})(window);
