/**
 * @fileoverview 
 * @author 常胤<changyin@taobao.com>
 * @module datalazyload
 **/
KISSY.add(function (S, Node) {
    var $ = Node.all, win = window;

    //默认设置
    var settings = {
        //临界点
        threshold: 0,
        event: "scroll touchmove resize",
        effect: "show",
        container: document,
        attribute: "data-ks-lazyload",
        duration: 300,
        load: null,
        complete: null
    };

    function LazyLoad(options) {
        var self = this,
            config = S.merge(settings, options),
            loadItems = function () {
                self._loadElement();
            };


        /**
         * lazyload容器
         * @type {*|HTMLElement}
         */
        self.container = $(config.container);

        /**
         * 配置
         * @type {*|Object|Object}
         */
        self.config = config;

        /**
         * buffer监听事件，防止出现效率问题
         * @type {*|Array}
         * @private
         */
        self._loadFn = buffer(loadItems, config.duration, self);

        /**
         * 容器是否为document对象
         * @type {boolean}
         * @private
         */
        self._containerIsNotDocument = self.container[0].nodeType != 9;

        //获取所有需要lazyload的节点
        self.lazyElements = self.__filterLazyElements();

        //启动监听
        self.resume();

        //立即加载一次，以保证第一屏的延迟项可见
        self._loadElement();
    }

    LazyLoad.prototype = {


        _loadElement: function () {
            var self = this,
                complete = self.config.complete,
                container = self.container,
                lazyElement = self.lazyElements;

            // container is display none
            if (self._containerIsNotDocument && !container.offset().width) {
                return;
            }

            for (var i = 0; i < lazyElement.length; i++) {
                var el = lazyElement[i];
                if (self.__inViewport(el)) {
                    self.__renderElement(el);
                    lazyElement.splice(i--, 1);
                }
            }

            if (lazyElement.length < 1) {
                if (complete && typeof(complete) == "function") {
                    complete.call(this);
                }
                self.destroy();
            }

        },

        /**
         * 加载需要lazyload的节点，只看是否有对应属性
         * @private
         */
        __filterLazyElements: function () {
            var self = this,
                config = self.config,
                container = self.container;

            var el = container.all("[" + config.attribute + "]");

            return Array.prototype.slice.call(el);

            //return S.makeArray(el);
        },

        /**
         * 强制立刻检测懒加载元素
         */
        refresh: function () {
            this.__filterLazyElements();
        },

        /**
         * 暂停监控懒加载元素
         */
        pause: function () {
            var self = this,
                events = self.config.event,
                load = self._loadFn;
            if (self._destroyed) {
                return;
            }

            $(win).detach(events, load);
            if (self._containerIsNotDocument) {
                self.container.detach(events, load);
            }
        },

        /**
         * 继续监控懒加载元素
         */
        resume: function () {
            var self = this,
                events = self.config.event,
                load = self._loadFn;
            if (self._destroyed) {
                return;
            }

            $(win).on(events, load);
            if (self._containerIsNotDocument) {
                self.container.on(events, load);
            }
        },

        /**
         * 判断对象是否在视窗里面
         * @param el
         * @returns {boolean}
         * @private
         */
        __inViewport: function (el) {
            var self = this,
                isDoc = !self._containerIsNotDocument,
                container = self.container,
                boxOffset = isDoc ? null : $(container).offset(),
                elOffset = $(el).offset(),
                threshold = self.config.threshold,
            //判断元素是否在视窗之下
                below,
            //元素是否在视窗的右边以内
                right,
            //元素是否在视窗之上
                above,
            //元素是否在视窗左边以内
                left;

            //如果没有设置容器
            if (isDoc) {
                var w = win.innerWidth,
                    h = win.innerHeight,
                    x = win.scrollX,
                    y = win.scrollY;

                below = h + y <= elOffset.top - threshold;
                right = w + x <= elOffset.left - threshold;
                above = y >= elOffset.top + el.offsetHeight + threshold;
                left = x > elOffset.left + el.offsetWidth + threshold;
            }

            else {
                var scrollTop = container.scrollTop(),
                    scrollLeft = container.scrollLeft(),
                    w = container.width(),
                    h = container.height();

                below = scrollTop + h <= scrollTop + elOffset.top - boxOffset.top + threshold;
                right = scrollLeft + w <= scrollLeft + elOffset.left - boxOffset.left + threshold;
                above = scrollTop >= scrollTop + (elOffset.top - boxOffset.top) + el.offsetHeight - threshold;
                left = scrollLeft >= scrollLeft + (elOffset.left - boxOffset.left) + el.offsetWidth - threshold;
            }

            return !below && !right && !above && !left;

        },

        __renderElement: function (el) {
            var self = this,
                config = self.config,
                $el = $(el),
                nodeName = el.nodeName.toUpperCase(),
                lazyFlag = config.attribute,
                load = config.load;


            if (nodeName == "IMG") {
                var src = $el.attr(lazyFlag);
                $el.attr("src", src);
            }

            //html
            else if (nodeName == "TEXTAREA") {
                var html = $el.val(),
                    content = $("<div/>");

                content.html(html, true).insertBefore($el);

                $el.hide();
            }


            else {
                return;
            }

            if (typeof(load) == "function") {
                load.call(this, el);
            }

        },

        destroy: function () {
            var self = this;
            self.pause();
            S.log("datalazyload is destroyed!");
        }

    }


    function buffer(fn, ms, context) {
        ms = ms || 150;

        if (ms === -1) {
            return function () {
                fn.apply(context || this, arguments);
            };
        }
        var bufferTimer = null;

        function f() {
            f.stop();
            bufferTimer = later(fn, ms, 0, context || this, arguments);
        }

        f.stop = function () {
            if (bufferTimer) {
                bufferTimer.cancel();
                bufferTimer = 0;
            }
        };

        return f;
    }

    function later(fn, when, periodic, context, data) {
        when = when || 0;
        var m = fn,
            d = S.makeArray(data),
            f,
            r;

        if (typeof fn === 'string') {
            m = context[fn];
        }

        if (!m) {
            S.error('method undefined');
        }

        f = function () {
            m.apply(context, d);
        };

        r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

        return {
            id: r,
            interval: periodic,
            cancel: function () {
                if (this.interval) {
                    clearInterval(r);
                } else {
                    clearTimeout(r);
                }
            }
        };
    };


    return LazyLoad;


}, {
    requires: ["node"]
});