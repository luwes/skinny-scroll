
function Page(main, el) {
	this.main = main;
	this.el = el;
	this.morph = new Morph(el);
	this.morph.on('update', _.bind(this.update, this));
}

Page.prototype.height = function() {
	return this.el.offsetHeight;
};

Page.prototype.update = function() {
	this.main.events.scroll.fire(this.morph.get('y'));
};
