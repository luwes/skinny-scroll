
var _ = {

	extend: function(src, dest) {
		for (var key in dest) {
			src[key] = dest[key];
		}
		return src;
	},

	query: function(selector, el) {
		if (typeof selector != 'string') return null;
		el = el || document;
		return el.querySelector(selector);
	},

	clamp: function(val, min, max) {
		return val < min? min : (val > max? max : val);
	},

	append: function(parent, css, tag) {
		var el = document.createElement(tag || 'div');
		_.css(el, css);
		return parent.appendChild(el);
	},

	bind: function(fn, context) {
		return function() { fn.apply(context, [].slice.call(arguments)); };
	},

	invoke: function(array, method) {
		var args = slice.call(arguments, 2);
		for (var i = 0; i < array.length; i++) {
			array[i][method].apply(array[i], args);
		}
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

	css: function(el, props) {
		for (var prop in props) {
			el.style[_.camel(prop)] = _.addUnit(props[prop]);
		}
	},

	camel: function(str) {
		return (''+str).replace(/-(\w)/g, function(match, c) {
			return c.toUpperCase();
		});
	},

	addUnit: function(v) {
		return typeof v == 'string' ? v : v + 'px';
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
	},

	lerp: function(ratio, start, end) {
		return start + (end - start) * ratio;
	},

	norm: function(val, min, max) {
		return (val - min) / (max - min);
	},

	map: function(val, min1, max1, min2, max2) {
		return _.lerp( _.norm(val, min1, max1), min2, max2 );
	}
};
