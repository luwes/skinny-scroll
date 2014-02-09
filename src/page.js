
function Page(main, el) {
	this.main = main;
	this.el = el;
	this.morph = new Morph(el);
	this.morph.on('update', _.bind(this.update, this));
	this.count = 1;
}

Page.prototype.height = function() {
	return this.el.offsetHeight;
};

Page.prototype.update = function() {
	this.count += 1;
	if (this.count % 2 === 0) {
		this.main.events.scroll.fire(this.morph.get('y'));
	}
};
