!function(window, document) {
    var _ = {
        append: function(parent, css, tag) {
            var el = document.createElement(tag || "div");
            return _.css(el, css), parent.appendChild(el);
        },
        bind: function(fn, context) {
            return function() {
                fn.apply(context, [].slice.call(arguments));
            };
        },
        on: function(el, type, fn) {
            for (var arr = type.split(" "), i = 0; i < arr.length; i++) el.attachEvent ? el.attachEvent("on" + arr[i], fn) : el.addEventListener(arr[i], fn, !1);
        },
        off: function(el, type, fn) {
            for (var arr = type.split(" "), i = 0; i < arr.length; i++) el.detachEvent ? el.detachEvent("on" + arr[i], fn) : el.removeEventListener(arr[i], fn, !1);
        },
        extend: function(src, dest) {
            for (var key in dest) src[key] = dest[key];
            return src;
        },
        css: function(el, props) {
            for (var key in props) {
                var val = props[key];
                if ("undefined" != typeof val) {
                    if ("number" == typeof val && "zIndex" != key && "opacity" != key) {
                        if (isNaN(val)) continue;
                        val = Math.ceil(val) + "px";
                    }
                    try {
                        el.style[key] = val;
                    } catch (e) {}
                }
            }
        },
        getPointer: function(e) {
            var x = e.pageX, y = e.pageY;
            if (e.touches && (x = e.touches[0].pageX, y = e.touches[0].pageY), null == x) {
                var doc = document.documentElement, body = document.body;
                x = e.clientX + (doc.scrollLeft || body.scrollLeft || 0) - (doc.clientLeft || body.clientLeft || 0), 
                y = e.clientY + (doc.scrollTop || body.scrollTop || 0) - (doc.clientTop || body.clientTop || 0);
            }
            return {
                x: x,
                y: y
            };
        },
        getOffset: function(el) {
            var docElem = document.documentElement, box = el.getBoundingClientRect(el);
            return {
                top: box.top + (window.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
                left: box.left + (window.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
            };
        }
    };
    window.SkinnyScroll = function(el, options) {
        var mode = null;
        this.hasTouch = "ontouchstart" in window;
        var defaults = {
            color: "#fff",
            radius: 6,
            width: 6
        };
        this.config = _.extend(defaults, options);
        var wrap = document.getElementById(el) || el;
        _.css(wrap, {
            overflow: "hidden"
        });
        var view = wrap.children[0];
        _.css(view, {
            position: "absolute",
            left: 0,
            top: 0,
            right: 0
        }), this.hasTouch ? mode = new TouchMode(this, wrap, view) : (_.css(view, {
            overflow: "hidden",
            bottom: 0
        }), mode = new MouseMode(this, wrap, view)), mode.redraw(), _.on(window, "resize", mode.redraw), 
        this.scrollTop = function(y) {
            return mode.scrollTop(y);
        }, this.redraw = function() {
            return mode.redraw();
        }, this.destroy = function() {
            _.off(window, "resize", mode.redraw), mode.destroy();
        };
    };
    var MouseMode = function(main, wrap, view) {
        function scrollOnMousewheel(e) {
            if (e = e || window.event, _this.enabled) {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
                var delta = 0;
                e.wheelDelta && (delta = -e.wheelDelta / 120), e.detail && (delta = e.detail / 3), 
                _this.scrollTop(_this.scrollTop() - 20 * delta);
            }
        }
        var _this = this, sbar = new Scrollbar(main, wrap, !0);
        _.on(wrap, "DOMMouseScroll mousewheel", scrollOnMousewheel), this.scrollTop = function(y) {
            return void 0 === y ? -view.scrollTop : (view.scrollTop = -y, void sbar.setY(view.scrollTop));
        }, this.redraw = function() {
            return this.enabled = sbar.redraw(view.scrollHeight, view.offsetHeight), _this.scrollTop(_this.scrollTop()), 
            this.enabled;
        }, this.destroy = function() {
            _.off(wrap, "DOMMouseScroll mousewheel", scrollOnMousewheel), sbar.destroy();
        };
    }, Scrollbar = function(main, el, hasMouse) {
        function start(e) {
            e = e || window.event, e.preventDefault && e.preventDefault(), _.on(document, "mousemove", drag), 
            _.on(document, "mouseup", end), _.on(_this.hand, "mouseup", end), _this.diff = _.getPointer(e).y - _this.hand.offsetTop;
        }
        function drag(e) {
            return e = e || window.event, main.scrollTop(-(_.getPointer(e).y - _this.diff) * _this.ratio), 
            !1;
        }
        function end(e) {
            e = e || window.event, _.off(document, "mousemove", drag), _.off(document, "mouseup", end), 
            _.off(_this.hand, "mouseup", end);
        }
        var _this = this, color = main.config.color, radius = main.config.radius, width = main.config.width;
        el = document.getElementById(el) || el, this.rail = _.append(el, {
            position: "absolute",
            right: 0,
            top: 2,
            bottom: 2,
            width: width + 2,
            zIndex: 90
        }), this.rail.className = "skinnyscrollbar", this.back = _.append(this.rail, {
            backgroundColor: color,
            filter: "alpha(opacity=20)",
            opacity: .2,
            borderRadius: radius,
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: width
        }), this.hand = _.append(this.rail, {
            backgroundColor: color,
            filter: "alpha(opacity=40)",
            opacity: .4,
            borderRadius: radius,
            position: "absolute",
            left: 0,
            top: 0,
            width: width,
            height: 7
        }), this.diff = _.getOffset(this.hand).top, hasMouse && (_.on(this.hand, "mousedown", start), 
        _.on(this.rail, "mousedown", drag));
    };
    Scrollbar.prototype = {
        redraw: function(scrollHeight, height) {
            var visible = scrollHeight > height;
            return this.rail.style.display = visible ? "block" : "none", this.scrollHeight = scrollHeight, 
            this.height = height, this.handHeight = Math.max(height / scrollHeight * this.rail.offsetHeight, 25), 
            this.ratio = (scrollHeight - height) / (this.rail.offsetHeight - this.handHeight), 
            visible;
        },
        destroy: function() {
            var pn = this.rail.parentNode;
            pn && pn.removeChild(this.rail);
        },
        setY: function(y) {
            var offset = y / this.ratio;
            isNaN(offset) && (offset = 0);
            var diff = offset + this.handHeight - this.rail.offsetHeight, handStyle = this.hand.style;
            0 > y ? (handStyle.height = Math.max(this.handHeight + offset, 25) + "px", handStyle.top = "0px") : diff > 0 ? (handStyle.height = Math.max(this.handHeight - diff, 25) + "px", 
            handStyle.bottom = "0px", handStyle.top = "auto") : (handStyle.height = this.handHeight + "px", 
            handStyle.top = offset + "px");
        }
    };
    var TouchMode = function(main, wrap, view) {
        function transitionEnd() {
            clearInterval(interval), view.style.WebkitTransitionDuration = "0s";
        }
        var interval, _this = this, sbar = new Scrollbar(main, wrap), hasMatrix = "WebKitCSSMatrix" in window, has3D = hasMatrix && "m11" in new WebKitCSSMatrix();
        this.wrap = wrap, this.view = view, this.x = 0, this.y = 0, _.on(view, "touchstart", this), 
        _.on(view, "webkitTransitionEnd", transitionEnd), view.style.WebkitTransition = "-webkit-transform 1s cubic-bezier(0,0,0.2,1)", 
        this.scrollTop = function(y) {
            return void 0 === y ? (this.clampY(), this.y) : (this.setY(y), void sbar.setY(-y));
        }, this.setY = function(y) {
            this.y = y, view.style.WebkitTransform = has3D ? "translate3d(0, " + y + "px, 0)" : "translate(0, " + y + "px)";
        }, this.getY = function() {
            if (hasMatrix) {
                var transform = window.getComputedStyle(this.view).webkitTransform;
                if (transform && "none" !== transform) {
                    var matrix = new WebKitCSSMatrix(transform);
                    return matrix.f;
                }
            }
            return this.y;
        }, this.redraw = function() {
            var visible = sbar.redraw(view.offsetHeight, wrap.offsetHeight);
            return _this.scrollTop(_this.scrollTop()), visible;
        }, this.destroy = function() {
            _.off(view, "touchstart", this), _.off(view, "webkitTransitionEnd", transitionEnd), 
            view.style.WebkitTransition = "", sbar.destroy();
        }, this.animateScrollbar = function() {
            clearInterval(interval), interval = setInterval(function() {
                sbar.setY(-_this.getY());
            }, 1e3 / 30);
        };
    };
    TouchMode.prototype = {
        handleEvent: function(e) {
            this[e.type](e);
        },
        touchstart: function(e) {
            this.wrap.offsetHeight < this.view.offsetHeight && (this.moved = !1, this.startX = e.touches[0].pageX - this.x, 
            this.startY = e.touches[0].pageY - this.y, this.view.style.WebkitTransitionDuration = "0s", 
            _.on(this.view, "touchmove", this), _.on(this.view, "touchend", this));
        },
        touchmove: function(e) {
            this.lastX = this.x, this.lastY = this.y, this.x = e.touches[0].pageX - this.startX, 
            this.y = e.touches[0].pageY - this.startY, 1 === e.touches.length && Math.abs(this.y - this.lastY) > Math.abs(this.x - this.lastX) && (e.preventDefault(), 
            this.moved = !0, this.lastMoveTime = new Date().getTime(), this.scrollTop(this.y));
        },
        touchend: function(e) {
            if (_.off(this.view, "touchmove", this), _.off(this.view, "touchend", this), this.moved) {
                e.preventDefault();
                var delta = this.y - this.lastY, dt = new Date().getTime() - this.lastMoveTime + 1;
                this.y = this.y + 200 * delta / dt, this.view.style.WebkitTransitionDuration = this.clampY() ? "0.5s" : "1s", 
                this.setY(this.y), this.animateScrollbar();
            }
        },
        clampY: function() {
            return this.y >= 0 ? (this.y = 0, !0) : this.y < this.wrap.offsetHeight - this.view.offsetHeight ? (this.y = this.wrap.offsetHeight - this.view.offsetHeight, 
            !0) : void 0;
        }
    };
}(window, document);