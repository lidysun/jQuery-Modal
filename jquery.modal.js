;
(function($, window) {
    $.fn.extend({
        popbox: function(opt) {
            var popbox = new Modal(opt);
            return popbox;
        }
    });

    function Modal(opts) {
        //默认设置
        var defaults = {
            vision: '1.0',
            modal: null, //页面上是否已存在 ok
            type: null, //类型：alert|confirm|dialog|tips|popbox
            title: null, //标题 ok
            boxClass: '', //页面上不存在modal时必须传递boxClass ok
            animate: true, //是否开启动画效果 //ok
            width: 600, //ok
            height: 400, //ok
            top: 0.3, //ok
            left: 0.5, //ok
            effect: 'fade', //出现时效果：none|fall|zoom|fade|fadeUp|fadeDown|fadeLeft|fadeRight
            effectOut: null, //关闭时效果：同上
            mask: true, //是否显示遮罩mask层 ok
            maskOpacity: 0.5, //遮罩透明度 ok
            maskCloseable: false, //点击mask是否可关闭弹窗 ok
            zIndex: 19901027, //mask层级,内容层级+1 ok
            delay: 0, //延迟时间 ok
            closeAuto: 0, //多少毫秒时间后自动关闭弹窗 ok
            closeHandle: '', //自定义的关闭弹窗触发器选择器(须加.或#选择符号) ok
            closeBtn: 'modal-close', //关闭按钮默认公用class(无须加.或#选择符号) ok
            beforeShowFn: null, //显示弹窗前回调 ok
            showedFn: null, //显示弹窗主内容后回调(需存在$content) ok
            beforeCloseFn: null, //关闭弹窗前回调 ok
            closedFn: null, //关闭弹窗主内容后回调(需存在$content) ok
            remove: false //关闭弹窗后是否移除弹窗主内容(不含mask) ok
        };
        this.opt = $.extend({}, defaults, opts);
        this.init();
    }

    Modal.prototype = {
        //初始化
        init: function() {
            var me = this;
            var opt = $.extend({}, me.opt);
            me.show();
            //窗口缩放
            $(window).resize(function() {
                me.locate(me.position);
            });

            //点击mask
            if (opt.maskCloseable) {
                $(me.get('mask')).on('click', function() {
                    me.close();
                });
            }

            //点击所有关闭按钮
            me.get('closeBtns').on('click', function() {
                me.close();
            });

            //Esc关闭
            $(document).keydown(function(e) {
                e.keyCode == 27 && me.close();
            });
        },
        //创建html结构
        initHtml: function() {
            var me = this;
            var opt = me.opt;
            var contentClass = opt.boxClass ? ' modal-item-' + opt.boxClass : '';
            var existMask = $('body').find('.modal-mask');
            var $modalMask, $modalBody, $modalHtml;
            var modalBody = '';
            if (!opt.modal) {
                try {
                    var $existBody = $('body').find('.' + $.trim(contentClass));
                    if ($existBody.length > 0) {
                        $modalBody = $existBody;
                    } else {
                        $modalBody = $('<div class="modal-item' + contentClass + '" style="position:fixed;background:#fff;"></div>');
                        if (opt.title) {
                            $modalBody.append('<div class="modal-title" style="height:34px;line-height:34px;border-bottom:1px solid #eee;background:#fafafa;padding:0 47px 0 15px;">' + opt.title + '</div>');
                        }
                        if (opt.closeBtn) {
                            $modalBody.append('<div class=' + opt.closeBtn + ' style="position:absolute;top:2px;right:2px;color:#ccc;font:700 30px/1 Simsun;cursor:pointer;">×</div>');
                        }
                    }
                } catch (err) {
                    console.error('"boxClass" is necessary if opt.modal is false !');
                }
            } else {
                $modalBody = $(opt.modal).addClass('modal-item' + contentClass).css({
                    position: 'fixed',
                    background: '#fff'
                });
            }
            //是否显示遮罩层
            if (opt.mask) {
                $modalMask = existMask.length > 0 ? existMask : $('<div class="modal-mask" style="position:fixed;top:0;left:0;right:0;bottom:0;background:#000;"></div>');
                $modalHtml = $modalMask.add($modalBody);
            } else {
                $modalHtml = $modalBody;
            }
            me.$modalHtml = $modalHtml;
            me.$modalHtml.remove().appendTo('body');

        },
        //定位
        locate: function(param) {
            var me = this;
            var $mask = me.get('mask');
            var $content = me.get();
            var opt = param ? $.extend({}, me.opt, param) : me.opt;
            var winWidth = $(window).width();
            var winHeight = $(window).height();

            opt.left = Math.abs(opt.left);
            opt.top = Math.abs(opt.top);
            opt.width = Math.abs(opt.width);
            opt.height = Math.abs(opt.height);

            opt.width = opt.width < 1 ? winWidth * opt.width : opt.width;
            opt.height = opt.height < 1 ? winHeight * opt.height : opt.height;
            var tempLeft = opt.left < 1 ? (winWidth - opt.width) * opt.left : opt.left;
            var tempTop = opt.top < 1 ? (winHeight - opt.height) * opt.top : opt.top;
            opt.animateHeight = opt.height / 4;

            //防止左、上超出屏幕
            tempLeft = tempLeft < 0 ? 0 : tempLeft;
            tempTop = tempTop < 0 ? 0 : tempTop;

            //共享位置属性
            me.opt.position = {
                width: opt.width,
                height: opt.height,
                top: tempTop,
                left: tempLeft
            };

            //初始化定位
            $content.stop().css(me.opt.position);
        },
        //显示
        show: function(param) {
            var me = this;
            me.initHtml();
            me.locate();
            var $mask = me.get('mask');
            var $content = me.get();
            var opt = param ? $.extend({}, me.opt, param) : me.opt;
            var position = opt.position;
            //显示前
            opt.beforeShowFn && opt.beforeShowFn(me);
            $mask.css({
                'opacity': 0,
                'filter:': 'alpha(opacity=0)',
                'zIndex': opt.zIndex
            }).removeClass('hide');
            $content.css({
                'top': position.top - opt.animateHeight,
                'opacity': 0,
                'zIndex': opt.zIndex + 1
            }).removeClass('hide');
            //显示后
            clearTimeout(t);
            var t = setTimeout(function() {
                $mask.fadeTo(400, opt.maskOpacity);
                if (opt.animate) {
                    $content.animate({
                        'top': position.top,
                        'opacity': 1,
                        'filter:': 'alpha(opacity=100)'
                    }, 400).show(function() {
                        opt.showedFn && opt.showedFn(me);
                    });
                } else {
                    $content.css({
                        'top': position.top,
                        'opacity': 1,
                        'filter:': 'alpha(opacity=100)'
                    }).show(function() {
                        opt.showedFn && opt.showedFn(me);
                    });
                }
            }, opt.delay);
            if (opt.closeAuto) {
                clearTimeout(c);
                var c = setTimeout(function() {
                    me.close();
                }, opt.closeAuto);
            }
        },

        close: function() {
            var me = this;
            var opt = me.opt;
            var position = opt.position;
            var $mask = me.get('mask');
            var $content = me.get();
            opt.beforeCloseFn && opt.beforeCloseFn(me);
            $mask.fadeTo(400, 0, function() {
                $mask.css('display', 'none');
            });
            if (opt.animate) {
                $content.animate({
                    top: position.top - opt.animateHeight,
                    opacity: 0
                }, 400, function() {
                    $content.hide(function() {
                        !opt.modal && opt.remove && $content.remove();
                        opt.closedFn && opt.closedFn(me);
                    });
                });
            } else {
                $content.css({
                    top: position.top - opt.animateHeight,
                    opacity: 0
                }).hide(function() {
                    !opt.modal && opt.remove && $content.remove();
                    opt.closedFn && opt.closedFn(me);
                });
            }

        },

        //获取modal内元素
        get: function(sel) {
            sel = $.trim(sel);
            var me = this;
            var opt = me.opt;
            var $modal = me.$modalHtml;
            if (!sel) {
                return $modal.not('.modal-mask');
            } else if (sel == 'mask') {
                return $modal.filter('.modal-mask');
            } else if (sel == 'closeBtns') {
                return $modal.find('.' + opt.closeBtn + (opt.closeHandle ? ',' + opt.closeHandle : ''));
            }
            return $modal.find(sel);
        }
    };
    window.Modal = Modal;
})(jQuery, window, undefined);