
function MouseController(main, page) {
	this.main = main;
	this.page = page;

	this.y = 0;
	main.events.scroll.on(function(y) { this.y = parseFloat(y); }, this);

	this._scroll = _.bind(this.scroll, this);
	_.on(main.el, 'DOMMouseScroll mousewheel', this._scroll);
}

MouseController.prototype.scroll = function(e) {
	e = e || window.event;
	if (this.page.height() > this.main.height()) {
		if (e.preventDefault) e.preventDefault();

		var delta = e.wheelDelta ? -e.wheelDelta / 120 : e.detail / 3;
		this.y -= delta * 20;
		this.y = _.clamp(this.y, -this.page.height() + this.main.height(), 0);
		
		this.page.morph.set('y', this.y);
		return false;
	}	
};

MouseController.prototype.destroy = function() {
	_.off(this.main.el, 'DOMMouseScroll mousewheel', this._scroll);
};
