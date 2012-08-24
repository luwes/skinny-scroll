(function(C) {
	
	C.Utils = function() {
	};

	C.Utils.add = function(tag, parent, css) {
		var element = document.createElement(tag);
		parent.appendChild(element);
		C.Utils.css(element, css);
		return element;
	};

	C.Utils.css = function(element, props) {
		if (element) {
			for (var key in props) {
				if (typeof props[key] === "undefined") {
					continue;
				} else if (typeof props[key] == "number" && !(key == "zIndex" || key == "opacity")) {
					if (isNaN(props[key])) {
						continue;
					}
					props[key] = Math.ceil(props[key]) + "px";
				}
				try {
					element.style[key] = props[key];
				} catch (e) {}
			}
		}
	};

	C.Utils.getOffset = function(el) {
		var _x = 0;
		var _y = 0;
		while (el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop )) {
			_x += el.offsetLeft - el.scrollLeft;
			_y += el.offsetTop - el.scrollTop;
			el = el.offsetParent;
		}
		return { top: _y, left: _x };
	};

	C.Utils.on = function(elem, type, func) {
		if (elem === null || elem === undefined) return;
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (elem.addEventListener) {
				elem.addEventListener(arr[i], func, false);
			} else if (elem.attachEvent) {
				elem.attachEvent('on' + arr[i], func);
			} else {
				elem['on' + arr[i]] = func;
			}
		}
	};

	C.Utils.off = function(elem, type, func) {
		if (elem === null || elem === undefined) return;
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (elem.removeEventListener) {
				elem.removeEventListener(arr[i], func, false);
			} else if (elem.detachEvent) {
				elem.detachEvent('on' + arr[i], func);
			} else {
				elem['on' + arr[i]] = null;
			}
		}
	};
	
})(SkinnyScroll);
