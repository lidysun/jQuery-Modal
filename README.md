### 配置参数
        var defaults = {
            vision: '1.0',
            modal: null, //页面上是否已存在 ok
            type: null, //类型：alert|confirm|dialog|tips|popbox
            title: null, //标题 ok
            boxClass: '', //ok
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
