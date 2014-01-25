
var MouseMode = function(main, wrap, view) {
	var _this = this;
	var sbar = new Scrollbar(main, wrap, true);

	function scrollOnMousewheel(e) {
		e = e || window.event;
		if (_this.enabled) {

			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;

			var delta = 0;
			if (e.wheelDelta) delta = -e.wheelDelta / 120;
			if (e.detail) delta = e.detail / 3;

			_this.scrollTop(_this.scrollTop() - delta * 20);
		}
	}

	_.on(wrap, 'DOMMouseScroll mousewheel', scrollOnMousewheel);

	this.scrollTop = function(y) {
		if (y === undefined) {
			return -view.scrollTop;
		} else {
			view.scrollTop = -y;
			sbar.setY(view.scrollTop);
		}
	};

	this.redraw = function() {
		this.enabled = sbar.redraw(view.scrollHeight, view.offsetHeight);
		_this.scrollTop(_this.scrollTop());
		return this.enabled;
	};

	this.destroy = function() {
		_.off(wrap, 'DOMMouseScroll mousewheel', scrollOnMousewheel);
		sbar.destroy();
	};
};
