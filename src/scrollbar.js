
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

	main.events.scroll.on(this.y, this);

	_.on(this.el, 'mousedown', lock);
	_.on(this.hand, 'mousedown', lock);

	var dragging = false;
	var offset = 0;

	function lock(e) {
		e = e || window.event;
		e.target = e.target || e.srcElement;

		offset = e.target == _this.hand ? _.getPointer(e).y - _.getOffset(_this.hand).top : 0;

		dragging = /mousedown/.test(e.type);
		drag(e);

		var fn = dragging ? 'on' : 'off';
		_[fn](document, 'mousemove', drag);
		_[fn](document, 'mouseup', lock);
		_[fn](document, 'selectstart', stopSelect);
	}

	function drag(e) {
		e = e || window.event;
		if (dragging) {
			if (e.preventDefault) e.preventDefault();
			
			var mouseY = _.getPointer(e).y - _.getOffset(_this.el).top - offset;
			var y = _.map(mouseY, 0, _this.el.offsetHeight, 0, _this.page.height());
			y = _.clamp(y, 0, _this.page.height() - _this.main.height());
			
			page.morph.set('y', -y);
			return false;
		}
	}

	function stopSelect() {
		return false;
	}
}

Scrollbar.prototype.y = function(y) {

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

	var visible = hei < this.page.height();
	this.el.style.display = visible ? 'block' : 'none';

	this.handHeight = Math.max(hei / this.page.height() * this.el.offsetHeight, 25);
	this.ratio = (this.page.height() - hei) / (this.el.offsetHeight - this.handHeight);
};

Scrollbar.prototype.destroy = function() {
	var pn = this.el.parentNode;
	if (pn) pn.removeChild(this.el);
};
