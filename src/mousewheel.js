(function(C) {

	C.Mousewheel = function(el) {
		var that = this;

		that.el = typeof el === "object" ? el : document.getElementById(el);
		that.calls = [];

		that.t = function(e) {
			//this in the function to() has to reference to this instance
			that.to(e);
		};
	};

	C.Mousewheel.prototype = {

		on: function(func) {

			if (this.calls.length === 0) {
				C.Utils.on(this.el, 'DOMMouseScroll mousewheel', this.t);
			}

			this.calls.push(func);
		},

		off: function(func) {
			if (func) {
				for (var i = 0; i < this.calls.length; i++) {
					if (this.calls[i] === func) {
						this.calls.splice(i, 1);
						i--;
					}
				}
			} else {
				this.calls = [];
			}

			if (this.calls.length === 0) {
				C.Utils.off(this.el, 'DOMMouseScroll mousewheel', this.t);
			}
		},

		to: function(e) {
			e = e || window.event;

			var delta = 0;
			if (e.wheelDelta) delta = -e.wheelDelta / 120;
			if (e.detail) delta = e.detail / 3;

			var args = [].slice.call(arguments, 1);
			args.unshift(e, delta);

			for (var i = 0; i < this.calls.length; i++) {
				if (typeof this.calls[i] === "function") {
					this.calls[i].apply(this, args);
				}
			}
		}
	};

})(SkinnyScroll);
