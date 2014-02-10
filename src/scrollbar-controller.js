
function ScrollbarController(main, page, sbar, hand) {
	this.main = main;
	this.page = page;
	this.sbar = sbar;
	this.hand = hand;

	this._lock = _.bind(this.lock, this);
	this._drag = _.bind(this.drag, this);
	_.on(sbar, 'mousedown', this._lock);
	_.on(hand, 'mousedown', this._lock);

	this.dragging = false;
	this.offset = 0;
}

ScrollbarController.prototype.lock = function(e) {
	e = e || window.event;
	e.target = e.target || e.srcElement;

	this.offset = e.target == this.hand ? _.getPointer(e).y - _.getOffset(this.hand).top : 0;

	this.dragging = /mousedown/.test(e.type);
	this.drag(e);

	var fn = this.dragging ? 'on' : 'off';
	_[fn](document, 'mousemove', this._drag);
	_[fn](document, 'mouseup', this._lock);
	_[fn](document, 'selectstart', this.stopSelect);
};

ScrollbarController.prototype.drag = function(e) {
	e = e || window.event;
	if (this.dragging) {
		if (e.preventDefault) e.preventDefault();
		
		var mouseY = _.getPointer(e).y - _.getOffset(this.sbar).top - this.offset;
		var y = _.map(mouseY, 0, this.sbar.offsetHeight-this.hand.offsetHeight, 0, this.page.height()-this.main.height());
		y = _.clamp(y, 0, this.page.height() - this.main.height());
		
		this.page.morph.set('y', -y);
		return false;
	}

};

ScrollbarController.prototype.stopSelect = function() {
	return false;
};
