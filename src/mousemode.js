(function(C) {

	C.MouseMode = function(main, wrap, view) {
		var that = this;
		var sbar = new C.Scrollbar(main, wrap, true);

		var mousewheel = new C.Mousewheel(wrap);
		function scrollOnMousewheel(e, delta) {
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;

			that.scrollTop(that.scrollTop() + delta * 20);
		}
		mousewheel.on(scrollOnMousewheel);

		that.scrollTop = function(y) {
			if (y === undefined) {
				return view.scrollTop;
			} else {
				view.scrollTop = y;
				sbar.setY(view.scrollTop);
			}
		};

		that.redraw = function() {
			sbar.redraw(view.scrollHeight, view.offsetHeight);
			that.scrollTop(that.scrollTop());
		};

		that.destroy = function() {
			mousewheel.off(scrollOnMousewheel);
			sbar.destroy();
		};
	};

})(SkinnyScroll);
