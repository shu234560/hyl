(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/components/starrySkyBg/index"],{"1d15":function(t,n,r){"use strict";r.r(n);var a=r("3121"),e=r.n(a);for(var i in a)"default"!==i&&function(t){r.d(n,t,(function(){return a[t]}))}(i);n["default"]=e.a},3121:function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a={name:"starrySkyBg",data:function(){return{width:300,height:800,arr:[],timer:null}},mounted:function(){this.updateInfo(),this.timer=setInterval(this.updateInfo,6e3)},methods:{updateInfo:function(t){this.arr=[];for(var n=0;n<-29*Math.random()+60;n++)this.arr.push({left:Math.random()*(this.width+100)+"px",top:Math.random()*this.height+"px",transform:"scale(".concat(Math.random(),",").concat(Math.random()+Math.random(),") "),animationDelay:2.5*Math.random()+"s"})}},beforeDestroy:function(){this.timer&&(clearTimeout(this.timer),this.timer=null)}};n.default=a},5551:function(t,n,r){},7273:function(t,n,r){"use strict";var a;r.d(n,"b",(function(){return e})),r.d(n,"c",(function(){return i})),r.d(n,"a",(function(){return a}));var e=function(){var t=this,n=t.$createElement;t._self._c},i=[]},"82f2":function(t,n,r){"use strict";r.r(n);var a=r("7273"),e=r("1d15");for(var i in e)"default"!==i&&function(t){r.d(n,t,(function(){return e[t]}))}(i);r("c569");var o,u=r("f0c5"),c=Object(u["a"])(e["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],o);n["default"]=c.exports},c569:function(t,n,r){"use strict";var a=r("5551"),e=r.n(a);e.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/components/starrySkyBg/index-create-component',
    {
        'pages/components/starrySkyBg/index-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("82f2"))
        })
    },
    [['pages/components/starrySkyBg/index-create-component']]
]);
