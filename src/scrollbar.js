
var Scrollbar = function(main, el, hasMouse) {
	var _this = this;

	var color = main.config.color;
	var radius = main.config.radius;
	var width = main.config.width;

	el = document.getElementById(el) || el;

	this.rail = _.append(el, {
		position: "absolute",
		right: 0,
		top: 2,
		bottom: 2,
		width: width + 2,
		zIndex: 90
	});
	this.rail.className = "skinnyscrollbar";

	this.back = _.append(this.rail, {
		backgroundColor: color,
		filter: "alpha(opacity=20)",
		opacity: 0.20,
		borderRadius: radius,
		position: "absolute",
		left: 0,
		top: 0,
		bottom: 0,
		width: width
	});

	this.hand = _.append(this.rail, {
		backgroundColor: color,
		filter: "alpha(opacity=40)",
		opacity: 0.40,
		borderRadius: radius,
		position: "absolute",
		left: 0,
		top: 0,
		width: width,
		height: 7
	});

	this.diff = _.getOffset(this.hand).top;

	if (hasMouse) {
		_.on(this.hand, 'mousedown', start);
		_.on(this.rail, 'mousedown', drag);
	}

	function start(e) {
		e = e || window.event;
		if (e.preventDefault) e.preventDefault();

		_.on(document, 'mousemove', drag);
		_.on(document, 'mouseup', end);
		_.on(_this.hand, 'mouseup', end);

		_this.diff = _.getPointer(e).y - _this.hand.offsetTop;
	}

	function drag(e) {
		e = e || window.event;

		main.scrollTop(-(_.getPointer(e).y - _this.diff) * _this.ratio);
		return false;
	}

	function end(e) {
		e = e || window.event;

		_.off(document, 'mousemove', drag);
		_.off(document, 'mouseup', end);
		_.off(_this.hand, 'mouseup', end);
	}
};

Scrollbar.prototype = {

	redraw: function(scrollHeight, height) {

		var visible = height < scrollHeight;
		this.rail.style.display = visible ? "block" : "none";

		this.scrollHeight = scrollHeight;
		this.height = height;
		this.handHeight = Math.max(height / scrollHeight * this.rail.offsetHeight, 25);
		this.ratio = (scrollHeight - height) / (this.rail.offsetHeight - this.handHeight);
		
		return visible;
	},

	destroy: function() {
		var pn = this.rail.parentNode;
		if (pn) pn.removeChild(this.rail);
	},

	setY: function(y) {

		var offset = y / this.ratio;
		if (isNaN(offset)) offset = 0;

		var diff = (offset + this.handHeight) - this.rail.offsetHeight;
		var handStyle = this.hand.style;
		if (y < 0) {
			handStyle.height = Math.max((this.handHeight + offset), 25) + "px";
			handStyle.top = "0px";
		} else if (diff > 0) {
			handStyle.height = Math.max((this.handHeight - diff), 25) + "px";
			handStyle.bottom = "0px";
			handStyle.top = "auto";
		} else {
			handStyle.height = this.handHeight + "px";
			handStyle.top = offset + "px";
		}
	}
};
