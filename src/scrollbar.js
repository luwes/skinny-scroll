(function(C) {

	C.Scrollbar = function(main, el, hasMouse) {
		var _this = this;

		var color = main.config.color;
		var radius = main.config.radius;
		var width = main.config.width;

		el = typeof el === "object" ? el : document.getElementById(el);

		this.rail = C.Utils.add('div', el, {
			position: "absolute",
			right: 0,
			top: 2,
			bottom: 2,
			width: width + 2,
			zIndex: 90
		});
		this.rail.className = "skinnyscrollbar";

		this.back = C.Utils.add('div', this.rail, {
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

		this.hand = C.Utils.add('div', this.rail, {
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

		this.diff = C.Utils.getOffset(this.hand).top;

		if (hasMouse) {
			C.Utils.on(this.hand, 'mousedown', start);
			C.Utils.on(this.rail, 'mousedown', drag);
		}

		function start(e) {
			e = e || window.event;
			fixPage(e);

			if (e.preventDefault) e.preventDefault();

			C.Utils.on(document, 'mousemove', drag);
			C.Utils.on(document, 'mouseup', end);
			C.Utils.on(_this.hand, 'mouseup', end);

			_this.diff = e.pageY - _this.hand.offsetTop;
		}

		function drag(e) {
			e = e || window.event;
			fixPage(e);

			main.scrollTop(-(e.pageY - _this.diff) * _this.ratio);
			return false;
		}

		function end(e) {
			e = e || window.event;

			C.Utils.off(document, 'mousemove', drag);
			C.Utils.off(document, 'mouseup', end);
			C.Utils.off(_this.hand, 'mouseup', end);
		}

		function fixPage(event) {
			// Calculate pageX/Y if missing and clientX/Y available
			if (event.pageX === undefined && event.clientX !== undefined) {
				var doc = document.documentElement, body = document.body;
				event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
				event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc   && doc.clientTop  || body && body.clientTop  || 0);
			}
		}
	};

	C.Scrollbar.prototype = {

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

})(SkinnyScroll);
