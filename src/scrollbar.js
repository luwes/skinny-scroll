
function Scrollbar(main, page) {
	this.main = main;
	this.page = page;
	var _this = this;

	var color = main.config.color;
	var radius = main.config.radius;
	var width = main.config.width;

	this.el = document.createElement('div');
	_.css(this.el, {
		position: 'absolute',
		right: 0,
		top: 2,
		bottom: 2,
		width: width + 2,
		zIndex: 90
	});
	this.el.className = 'skinnyscrollbar';

	this.back = _.append(this.el, {
		backgroundColor: color,
		filter: 'alpha(opacity=20)',
		opacity: '0.2',
		borderRadius: radius,
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		width: width
	});

	this.hand = _.append(this.el, {
		backgroundColor: color,
		filter: 'alpha(opacity=40)',
		opacity: '0.4',
		borderRadius: radius,
		position: 'absolute',
		left: 0,
		top: 0,
		width: width,
		height: 7
	});

	new ScrollbarController(main, page, this.el, this.hand);
	main.events.scroll.on(this.y, this);
}

Scrollbar.prototype.y = function(y) {
	this._y = y;

	var offset = -parseFloat(y) / this.ratio;
	if (isNaN(offset)) offset = 0;

	var diff = (offset + this.handHeight) - this.el.offsetHeight;
	var handStyle = this.hand.style;
	if (y > 0) {
		handStyle.height = Math.max((this.handHeight + offset), 25) + 'px';
		handStyle.top = '0px';
	} else if (diff > 0) {
		handStyle.height = Math.max((this.handHeight - diff), 25) + 'px';
		handStyle.bottom = '0px';
		handStyle.top = 'auto';
	} else {
		handStyle.height = this.handHeight + 'px';
		handStyle.top = offset + 'px';
	}
};

Scrollbar.prototype.redraw = function() {

	var hei = this.main.height();
	this.el.style.display = hei < this.page.height() ? 'block' : 'none';

	this.handHeight = Math.round(Math.max(hei / this.page.height() * this.el.offsetHeight, 25));
	this.ratio = (this.page.height() - hei) / (this.el.offsetHeight - this.handHeight);

	this.y(this._y);
};

Scrollbar.prototype.destroy = function() {
	var pn = this.el.parentNode;
	if (pn) pn.removeChild(this.el);
};
