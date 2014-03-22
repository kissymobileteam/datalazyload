## 综述

Datalazyload是。

* 版本：1.0
* 作者：常胤
* demo：[http://gallery.kissyui.com/datalazyload/1.0/demo/index.html](http://gallery.kissyui.com/datalazyload/1.0/demo/index.html)

## 初始化组件
		
    S.use('gallery/datalazyload/1.0/index', function (S, Datalazyload) {
         var datalazyload = new Datalazyload();
    })
	
	

## API说明



-  v0.01
-  [文档地址](http://changyin.demo.taobao.net/datalazyload/)



### Configs

threshold
{Number} - 可选，设置后可以提前加载视窗以外的内容，提升体验

event
{String} - 可选，响应的事件，默认 "scroll touchmove resize"

container
{dom} - 可选，不设置则为document.body

attribute
{String} - 可选，设置需要lazyload的属性名，默认为data-ks-lazyload

duration
{Number} - 可选，延迟触发事件，默认 300ms

load
{Function} - 可选，每加载一个元素就会触发一次这个回调

complete
{Function} - 可选，所有元素加载完成后会触发此回调

### Methods

refresh()
强制立刻检测懒加载元素

pause()
暂停监控懒加载元素

resume()
继续监控懒加载元素

destroy()
停止监控并销毁组件


### 示例


KISSY.use("datalazyload",function(S,DataLazyLoad){

new DataLazyLoad({
load: function(el){
console.log(el);
},
complete: function(){
alert("加载完毕");
}

});

})


### DEMO

-  [普通demo](http://changyin.demo.taobao.net/datalazyload/demo/demo1.html)
-  [横向测试](http://changyin.demo.taobao.net/datalazyload/demo/demo2.html)
-  [淘宝detail](http://changyin.demo.taobao.net/datalazyload/demo/demo3.html)



### 移动设备测试

![DataLazyload](http://ma.taobao.com/qrcode/qrcode.do?activity=preview&text=http%253A%252F%252Fchangyin.demo.taobao.net%252Fdatalazyload%252F&width=300&height=300&characterSet=gbk&channel_id&channel_name=)