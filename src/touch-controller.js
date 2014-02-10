
function TouchController(main, page) {
	this.main = main;
	this.page = page;

	this.x = 0;
	this.y = 0;
	main.events.scroll.on(function(y) { this.y = parseFloat(y); }, this);
	
	_.on(page.el, 'touchstart', this);
}

TouchController.prototype.handleEvent = function(e) {
	this[e.type](e);
};

TouchController.prototype.touchstart = function(e) {
	if (this.main.height < this.page.height) {
		this.moved = false;

		this.startX = e.touches[0].pageX - this.x;
		this.startY = e.touches[0].pageY - this.y;

		_.on(this.page.el, 'touchmove', this);
		_.on(this.page.el, 'touchend', this);
	}
};

TouchController.prototype.touchmove = function(e) {
	this.lastX = this.x;
	this.lastY = this.y;
	this.x = e.touches[0].pageX - this.startX;
	this.y = e.touches[0].pageY - this.startY;

	if (e.touches.length === 1 && Math.abs(this.y - this.lastY) > Math.abs(this.x - this.lastX)) {
		e.preventDefault();

		this.moved = true;
		this.lastMoveTime = +new Date();
		this.page.morph.set('y', this.y);
	}
};

TouchController.prototype.touchend = function(e) {
	_.off(this.page.el, 'touchmove', this);
	_.off(this.page.el, 'touchend', this);

	if (this.moved) {
		e.preventDefault();

		var delta = this.y - this.lastY;
		var dt = new Date() - this.lastMoveTime + 1;
		
		this.y = this.y + delta * 200 / dt;

		var dur = this.clampY() ? 500 : 1000;
		this.page.morph
			.duration(dur)
			.to('y', this.y)
			.ease('cubic-bezier(0,0,0.2,1)')
			.start();
	}
};

TouchController.prototype.clampY = function() {
	if (this.y >= 0) {
		this.y = 0;
		return true;
	} else if (this.y < this.main.height - this.page.height) {
		this.y = this.main.height - this.page.height;
		return true;
	}
};

TouchController.prototype.destroy = function() {
	_.off(this.page.el, 'touchstart', this);
};
