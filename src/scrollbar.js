(function(C) {

	C.Scrollbar = function(main, el, hasMouse) {
		var Utils = C.Utils;
		var that = this;

		var color = main.config.color;
		var radius = main.config.radius;
		var width = main.config.width;

		el = typeof el === "object" ? el : document.getElementById(el);

		that.rail = Utils.add('div', el, {
			position: "absolute",
			right: 2,
			top: 2,
			bottom: 2,
			width: width,
			zIndex: 90
		});
		that.rail.className = "skinnyscrollbar";

		that.back = Utils.add('div', that.rail, {
			backgroundColor: color,
			filter: "alpha(opacity=15)",
			opacity: 0.15,
			borderRadius: radius,
			position: "absolute",
			left: 0,
			top: 0,
			right: 0,
			bottom: 0
		});

		that.hand = Utils.add('div', that.rail, {
			backgroundColor: color,
			filter: "alpha(opacity=25)",
			opacity: 0.25,
			borderRadius: radius,
			position: "absolute",
			left: 0,
			top: 0,
			width: width,
			height: 7
		});

		that.diff = Utils.getOffset(that.hand).top;

		if (hasMouse) {
			Utils.on(that.hand, 'mousedown', start);
			Utils.on(that.rail, 'mousedown', drag);
		}

		function start(e) {
			e = e || window.event;
			fixPage(e);

			if (e.preventDefault) e.preventDefault();

			Utils.on(document, 'mousemove', drag);
			Utils.on(document, 'mouseup', end);
			Utils.on(that.hand, 'mouseup', end);

			that.diff = e.pageY - that.hand.offsetTop;
		}

		function drag(e) {
			e = e || window.event;
			fixPage(e);

			main.scrollTop((e.pageY - that.diff) * that.ratio);
			return false;
		}

		function end(e) {
			e = e || window.event;

			Utils.off(document, 'mousemove', drag);
			Utils.off(document, 'mouseup', end);
			Utils.off(that.hand, 'mouseup', end);
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

			var that = this;
			that.rail.style.display = height >= scrollHeight ? "none" : "block";

			that.scrollHeight = scrollHeight;
			that.height = height;
			that.handHeight = Math.max(height / scrollHeight * that.rail.offsetHeight, 25);
			that.ratio = (scrollHeight - height) / (that.rail.offsetHeight - that.handHeight);
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
