/** @license
 * Skinny Scroll
 *
 * Author: Wesley Luyten
 * Version: 1.0 - (2012/07/30)
 *			1.1 - (2013/01/25)
 */

SkinnyScroll.defaults = {
	color: '#fff',
	radius: 6,
	width: 6
};

function SkinnyScroll(el, options) {
	this.config = _.extend(SkinnyScroll.defaults, options);

	this.events = {
		scroll: new Signal()
	};

	this.el = _.query(el) || el;
	this.el.style.overflow = 'hidden';

	this.page = new Page(this, this.el.children[0]);

	this.sbar = new Scrollbar(this, this.page);
	this.el.appendChild(this.sbar.el);

	this.controllers = [];
	this.controllers.push(new MouseController(this, this.page));
	this.controllers.push(new TouchController(this, this.page));

	this.redraw();
	this._redraw = _.bind(this.redraw, this);
	_.on(window, 'resize', this._redraw);

	this.y(0);
}

SkinnyScroll.prototype.height = function() {
	return this.el.offsetHeight;
};

SkinnyScroll.prototype.y = function(n) {
	this.page.morph.set('y', n);
};

SkinnyScroll.prototype.redraw = function() {
	this.sbar.redraw();
};

SkinnyScroll.prototype.destroy = function() {
	_.invoke(this.controllers, 'destroy');
	_.off(window, 'resize', this._redraw);
	this.sbar.destroy();
};

window.SkinnyScroll = SkinnyScroll;
