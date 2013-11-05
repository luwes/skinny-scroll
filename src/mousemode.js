(function(C) {

	C.MouseMode = function(main, wrap, view) {
		var _this = this;
		var sbar = new C.Scrollbar(main, wrap, true);

		var mousewheel = new C.Mousewheel(wrap);
		function scrollOnMousewheel(e, delta) {
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;

			_this.scrollTop(_this.scrollTop() - delta * 20);
		}
		mousewheel.on(scrollOnMousewheel);

		this.scrollTop = function(y) {
			if (y === undefined) {
				return -view.scrollTop;
			} else {
				view.scrollTop = -y;
				sbar.setY(view.scrollTop);
			}
		};

		this.redraw = function() {
			var visible = sbar.redraw(view.scrollHeight, view.offsetHeight);
			_this.scrollTop(_this.scrollTop());
			return visible;
		};

		this.destroy = function() {
			mousewheel.off(scrollOnMousewheel);
			sbar.destroy();
		};
	};

})(SkinnyScroll);
