
var _ = {

	append: function(parent, css, tag) {
		var el = document.createElement(tag || 'div');
		_.css(el, css);
		return parent.appendChild(el);
	},

	bind: function(fn, context) {
		return function() { fn.apply(context, [].slice.call(arguments)); };
	},

	on: function(el, type, fn) {
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (el.attachEvent) {
				el.attachEvent('on' + arr[i], fn);
			} else {
				el.addEventListener(arr[i], fn, false);
			}
		}
	},

	off: function(el, type, fn) {
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (el.detachEvent) {
				el.detachEvent('on' + arr[i], fn);
			} else {
				el.removeEventListener(arr[i], fn, false);
			}
		}
	},

	extend: function(src, dest) {
		for (var key in dest) {
			src[key] = dest[key];
		}
		return src;
	},

	css: function(el, props) {
		for (var key in props) {
			var val = props[key];
			if (typeof val === 'undefined') {
				continue;
			} else if (typeof val == 'number' && !(key == 'zIndex' || key == 'opacity')) {
				if (isNaN(val)) continue;
				val = Math.ceil(val) + 'px';
			}
			try {
				el.style[key] = val;
			} catch (e) {}
		}
	},

	getPointer: function(e) {
		var x = e.pageX,
			y = e.pageY;
		if (e.touches) {
			x = e.touches[0].pageX;
			y = e.touches[0].pageY;
		}
		if (x == null) {
			var doc = document.documentElement;
			var body = document.body;
			x = e.clientX + (doc.scrollLeft || body.scrollLeft || 0) - (doc.clientLeft || body.clientLeft || 0);
			y = e.clientY + (doc.scrollTop || body.scrollTop  || 0) - (doc.clientTop  || body.clientTop  || 0);
		}
		return { x: x, y: y };
	},

	getOffset: function(el) {
		var docElem = document.documentElement;
		var box = el.getBoundingClientRect(el);
		return {
			top: box.top + (window.pageYOffset || docElem.scrollTop)  - (docElem.clientTop || 0),
			left: box.left + (window.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
		};
	}
};
