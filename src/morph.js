(function(window, document) {
var divstyle = document.createElement('div').style;

var _ = {

	extend: function(src, dest) {
		for (var key in dest) {
			src[key] = dest[key];
		}
		return src;
	},

	bind: function(fn, context) {
		return function() { fn.apply(context, [].slice.call(arguments)); };
	},

	style: function(el, prop) {
		if (window.getComputedStyle) {
			return getComputedStyle(el).getPropertyValue(_.uncamel(prop));
		} else if (el.currentStyle) {
			return el.currentStyle[_.camel(prop)];
		} else return el.style[_.camel(prop)];
	},

	matrix: function(str) {
		var arr = str.match(/\(([-\d., ]+?)\)/)[1].split(', ');
		if (arr.length == 6) {
			return { x: arr[4], y: arr[5] };
		} else if (arr.length == 16) {
			return { x: arr[12], y: arr[13] };
		}
	},

	contains: function(list, el) {
		for (var key in list) {
			if (list[key] === el) return true;
		}
		return false;
	},

	query: function(selector, el) {
		if (typeof selector != 'string') return null;
		el = el || document;
		return el.querySelector(selector);
	},

	vendorPropName: function(name) {
		if (name in divstyle) return name;

		var camel = _.camel('-' + name);
		var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
		for (var i = 0; i < prefixes.length; i++) {
			name = prefixes[i] + camel;
			if (name in divstyle) return name;
		}
	},

	has3d: function() {
		var transform = _.vendorPropName('transform');
		divstyle[transform] = '';
		divstyle[transform] = 'rotateY(90deg)';
		return divstyle[transform] !== '';
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

	camel: function(str) {
		return (''+str).replace(/-(\w)/g, function(match, c) {
			return c.toUpperCase();
		});
	},

	uncamel: function(str) {
		return (''+str).replace(/([A-Z])/g, '-$1').toLowerCase();
	},

	addUnit: function(v) {
		return typeof v == 'string' ? v : v + 'px';
	},

	getUnit: function(v) {
		return typeof v == 'string' ? v.replace(/[-\d\.]/g, '') : 'px';
	},

	num: function(n) {
		return +(''+n).replace(/[^-\d.]/g, '');
	},

	lerp: function(ratio, start, end) {
		return start + (end - start) * ratio;
	}
};

/** @license
 * Morph
 *
 * Author: Wesley Luyten
 * Version: 1.0.0 - (2013/02/06)
 */

Morph.defaults = {
	duration: 500
};

Morph.support = {
	transition: _.vendorPropName('transition'),
	transform: _.vendorPropName('transform'),
	transform3d: _.has3d()
};

function Morph(el) {
	if (!(this instanceof Morph)) return new Morph(el);
	this.el = _.query(el) || el;
	this.events = {
		update: new Signal(),
		end: new Signal()
	};
	if (Morph.support.transition) {
		this.engine = new V8(this);
	} else {
		this.engine = new V6(this);
	}
	this.duration(Morph.defaults.duration);
}

Morph.prototype.duration = function(dur) {
	this.engine.duration(dur);
	return this;
};

Morph.prototype.get = function(prop) {
	return this.engine.get(prop);
};

Morph.prototype.set = function(obj, val) {
	this.engine.set(obj, val);
	return this;
};

Morph.prototype.to = function(prop, val) {
	this.engine.to(prop, val);
	return this;
};

Morph.prototype.ease = function(fn) {
	this.engine.ease(fn);
	return this;
};

Morph.prototype.start = function() {
	this.engine.start();
	return this;
};

Morph.prototype.on = function(event, fn) {
	this.events[event].on(fn);
	return this;
};

Morph.prototype.off = function(event, fn) {
	this.events[event].off(fn);
	return this;
};

window.Morph = Morph;


function Signal() {
	this.c = [];
}

Signal.prototype.on = function(fn, c) {
	this.c.push({fn: fn, c: c});
	return this;
};

Signal.prototype.fire = function() {
	var args = [].slice.call(arguments);
	for (var i = 0; i < this.c.length; i++) {
		this.c[i].fn.apply(this.c[i].c || this, args);
	}
	return this;
};

Signal.prototype.off = function(fn) {
	if (fn) {
		for (var i = 0; i < this.c.length; i++) {
			if (this.c[i] === fn) {
				this.c.splice(i, 1);
				i--;
			}
		}
	} else {
		this.c = [];
	}
	return this;
};


V6.aliases = {
	x: 'left',
	y: 'top'
};

function V6(main) {
	this.main = main;
	this.el = main.el;
	this._start = {};
	this._end = {};
}

V6.prototype.duration = function(dur) {
	this._duration = dur;
};

V6.prototype.get = function(prop) {
	prop = V6.aliases[prop] || prop;
	return _.style(this.el, prop);
};

V6.prototype.set = function(obj, val) {
	_.extend(this._start, this.add(obj, val));
	this.setProperties();
	this.update();
};

V6.prototype.to = function(obj, val) {
	_.extend(this._end, this.add(obj, val));
};

V6.prototype.add = function(obj, val) {
	var map = {};
	if (val !== undefined) map[obj] = val;
	else _.extend(map, obj);
	for (var alias in V6.aliases) {
		if (map[alias] !== undefined) {
			map[V6.aliases[alias]] = map[alias];
			delete map[alias];
		}
	}
	return map;
};

V6.prototype.setProperties = function() {
	for (var prop in this._start) {
		this.el.style[_.camel(prop)] = _.addUnit(this._start[prop]);
	}
};

V6.prototype.initProperties = function() {
	for (var prop in this._end) {
		if (!this._start[prop]) {
			this._start[prop] = _.style(this.el, prop) || 1;
		}
	}
};

V6.prototype.applyProperties = function(ratio) {
	for (var prop in this._end) {
		var start = this._start[prop];
		var end = this._end[prop];
		var calc = _.lerp(ratio, _.num(start), _.num(end));
		this.el.style[_.camel(prop)] = calc + _.getUnit(end);
	}
};

V6.prototype.ease = function(fn) {
	
};

V6.prototype.start = function() {
	this.reset();
	this.initProperties();

	var _this = this;
	var ratio = 0;
	var last = +new Date();
	var tick = function() {
		ratio += (new Date() - last) / _this._duration;
		ratio = ratio > 1 ? 1 : ratio;
		last = +new Date();
		_this.applyProperties(ratio);
		_this.update();
		if (ratio === 1) _this.end();
	};
	this.id = setInterval(tick, 16);
};

V6.prototype.update = function() {
	this.main.events.update.fire();
};

V6.prototype.end = function() {
	clearInterval(this.id);
	this.main.events.end.fire();
};

V6.prototype.reset = function() {
	clearInterval(this.id);
	this._start = {};
};


V8.translate = _.has3d ? ['translate3d(',', 0)'] : ['translate(',')'];

V8.ends = [
	'transitionend',
	'webkitTransitionEnd',
	'oTransitionEnd',
	'MSTransitionEnd'
];

V8.aliases = {
	x: {
		set: function(map, v) { map.transformX = V8.translate.join(v + ', 0'); },
		get: function(el, prop) { return _.matrix(_.style(el, _.vendorPropName('transform'))).x; }
	},
	y: {
		set: function(map, v) { map.transformY = V8.translate.join('0, ' + v); },
		get: function(el, prop) { return _.matrix(_.style(el, _.vendorPropName('transform'))).y; }
	}
};

function V8(main) {
	this.main = main;
	this.el = main.el;

	this._update = _.bind(this.update, this);
	this._end = _.bind(this.end, this);

	this.reset();
}

V8.prototype.reset = function() {
	this._props = {};
	this._transitionProps = [];
	this._transforms = [];
	this._ease = '';
};

V8.prototype.duration = function(n) {
	this._duration = n;
};

V8.prototype.ease = function(fn) {
	this._ease = fn;
};

V8.prototype.setVendorProperty = function(prop, val) {
	this.setProperty(_.uncamel(_.vendorPropName(prop)), val);
};

V8.prototype.setProperty = function(prop, val) {
	this._props[prop] = val;
};

V8.prototype.get = function(prop) {
	if (V8.aliases[prop]) return V8.aliases[prop].get(this.el, prop);
	return _.style(this.el, _.vendorPropName(prop));
};

V8.prototype.set = function(obj, val) {
	this.duration(0);
	this.to(obj, val);
	this.start();
	this.update();
};

V8.prototype.to = function(obj, val) {
	var adds = this.add(obj, val);
	for (var prop in adds) {
		if (prop.match(/^transform/)) {
			this.transform(adds[prop]);
			delete adds[prop];
		} else {
			this.transition(prop);
		}
	}
	_.extend(this._props, adds);
};

V8.prototype.add = function(obj, val) {
	var map = {};
	if (val !== undefined) map[obj] = val;
	else _.extend(map, obj);
	for (var alias in V8.aliases) {
		if (map[alias] !== undefined) {
			var value = _.addUnit(map[alias]);
			V8.aliases[alias].set(map, value);
			delete map[alias];
		}
	}
	return map;
};

V8.prototype.transition = function(prop) {
	if (!_.contains(this._transitionProps, prop)) {
		this._transitionProps.push(prop);
	}
};

V8.prototype.transform = function(transform) {
	if (!_.contains(this._transforms, transform)) {
		this._transforms.push(transform);
	}
};

V8.prototype.applyProperties = function(map) {
	for (var prop in map) {
		this.el.style.setProperty(prop, map[prop]);
	}
};

V8.prototype.start = function() {

	if (this._transforms.length) {
		this.setVendorProperty('transform', this._transforms.join(' '));
		this.transition(_.uncamel(Morph.support.transform));
	}

	this.setVendorProperty('transition', '');
	if (this._duration > 0) {
		this.setVendorProperty('transition-duration', this._duration + 'ms');
		this.setVendorProperty('transition-property', this._transitionProps.join(', '));
		this.setVendorProperty('transition-timing-function', this._ease);

		clearInterval(this.id);
		this.id = setInterval(this._update, 16);
		this.fired = false;
		
		_.on(this.el, V8.ends.join(' '), this._end);
	}

	this.applyProperties(this._props);
	this.reset();
};

V8.prototype.update = function() {
	this.main.events.update.fire();
};

V8.prototype.end = function() {
	_.off(this.el, V8.ends.join(' '), this._end);
	clearInterval(this.id);
	if (!this.fired) {
		this.fired = true;
		this.main.events.end.fire();
	}
};
})(window, document);