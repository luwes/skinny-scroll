
var TouchMode = function(main, wrap, view) {
	var _this = this;
	var sbar = new Scrollbar(main, wrap);

	var hasMatrix = 'WebKitCSSMatrix' in window;
	var has3D = hasMatrix && 'm11' in new WebKitCSSMatrix();
	var interval;

	this.wrap = wrap;
	this.view = view;
	this.x = 0;
	this.y = 0;

	_.on(view, 'touchstart', this);

	_.on(view, 'webkitTransitionEnd', transitionEnd);
	view.style.WebkitTransition = "-webkit-transform 1s cubic-bezier(0,0,0.2,1)";

	this.scrollTop = function(y) {
		if (y === undefined) {
			this.clampY();
			return this.y;
		} else {
			this.setY(y);
			sbar.setY(-y);
		}
	};

	this.setY = function(y) {
		this.y = y;
		view.style.WebkitTransform = has3D ? "translate3d(0, " + y + "px, 0)" : "translate(0, " + y + "px)";
	};

	this.getY = function() {
		if (hasMatrix) {
			var transform = window.getComputedStyle(this.view).webkitTransform;
			if (!!transform && transform !== 'none') {
				var matrix = new WebKitCSSMatrix(transform);
				return matrix.f;
			}
		}
		return this.y;
	};

	this.redraw = function() {
		var visible = sbar.redraw(view.offsetHeight, wrap.offsetHeight);
		_this.scrollTop(_this.scrollTop());
		return visible;
	};

	this.destroy = function() {
		_.off(view, 'touchstart', this);
		_.off(view, 'webkitTransitionEnd', transitionEnd);
		view.style.WebkitTransition = "";
		sbar.destroy();
	};

	this.animateScrollbar = function() {
		clearInterval(interval);
		interval = setInterval(function() {
			sbar.setY(-_this.getY());
		}, 1000 / 30);
	};

	function transitionEnd() {
		clearInterval(interval);
		view.style.WebkitTransitionDuration = "0s";
	}
};

TouchMode.prototype = {

	handleEvent: function(e) {
		this[e.type](e);
	},

	touchstart: function(e) {
		if (this.wrap.offsetHeight < this.view.offsetHeight) {
			this.moved = false;

			this.startX = e.touches[0].pageX - this.x;
			this.startY = e.touches[0].pageY - this.y;
			this.view.style.WebkitTransitionDuration = "0s";

			_.on(this.view, 'touchmove', this);
			_.on(this.view, 'touchend', this);
		}
	},

	touchmove: function(e) {
		this.lastX = this.x;
		this.lastY = this.y;
		this.x = e.touches[0].pageX - this.startX;
		this.y = e.touches[0].pageY - this.startY;

		if (e.touches.length === 1 && Math.abs(this.y - this.lastY) > Math.abs(this.x - this.lastX)) {
			e.preventDefault();
			this.moved = true;

			this.lastMoveTime = new Date().getTime();
			this.scrollTop(this.y);
		}
	},

	touchend: function(e) {
		_.off(this.view, 'touchmove', this);
		_.off(this.view, 'touchend', this);

		if (this.moved) {
			e.preventDefault();

			var delta = this.y - this.lastY;
			var dt = new Date().getTime() - this.lastMoveTime + 1;
			
			this.y = this.y + delta * 200 / dt;
			this.view.style.WebkitTransitionDuration = this.clampY() ? "0.5s" : "1s";
			this.setY(this.y);

			this.animateScrollbar();
		}
	},

	clampY: function() {
		if (this.y >= 0) {
			this.y = 0;
			return true;
		} else if (this.y < this.wrap.offsetHeight - this.view.offsetHeight) {
			this.y = this.wrap.offsetHeight - this.view.offsetHeight;
			return true;
		}
	}
};
