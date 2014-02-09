
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
