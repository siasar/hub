define(["@grafana/data","react","@grafana/ui","d3"],((t,e,n,r)=>(()=>{"use strict";var o={305:e=>{e.exports=t},388:t=>{t.exports=n},200:t=>{t.exports=r},650:t=>{t.exports=e}},i={};function s(t){var e=i[t];if(void 0!==e)return e.exports;var n=i[t]={exports:{}};return o[t](n,n.exports,s),n.exports}s.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return s.d(e,{a:e}),e},s.d=(t,e)=>{for(var n in e)s.o(e,n)&&!s.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},s.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),s.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var a={};return(()=>{s.r(a),s.d(a,{plugin:()=>Y});var t=s(305),e=s(650),n=s.n(e),r=Math.PI,o=2*r,i=1e-6,l=o-i;function c(){this._x0=this._y0=this._x1=this._y1=null,this._=""}function u(){return new c}c.prototype=u.prototype={constructor:c,moveTo:function(t,e){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+e)},closePath:function(){null!==this._x1&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")},lineTo:function(t,e){this._+="L"+(this._x1=+t)+","+(this._y1=+e)},quadraticCurveTo:function(t,e,n,r){this._+="Q"+ +t+","+ +e+","+(this._x1=+n)+","+(this._y1=+r)},bezierCurveTo:function(t,e,n,r,o,i){this._+="C"+ +t+","+ +e+","+ +n+","+ +r+","+(this._x1=+o)+","+(this._y1=+i)},arcTo:function(t,e,n,o,s){t=+t,e=+e,n=+n,o=+o,s=+s;var a=this._x1,l=this._y1,c=n-t,u=o-e,d=a-t,f=l-e,h=d*d+f*f;if(s<0)throw new Error("negative radius: "+s);if(null===this._x1)this._+="M"+(this._x1=t)+","+(this._y1=e);else if(h>i)if(Math.abs(f*c-u*d)>i&&s){var p=n-a,y=o-l,g=c*c+u*u,m=p*p+y*y,x=Math.sqrt(g),b=Math.sqrt(h),k=s*Math.tan((r-Math.acos((g+h-m)/(2*x*b)))/2),v=k/b,w=k/x;Math.abs(v-1)>i&&(this._+="L"+(t+v*d)+","+(e+v*f)),this._+="A"+s+","+s+",0,0,"+ +(f*p>d*y)+","+(this._x1=t+w*c)+","+(this._y1=e+w*u)}else this._+="L"+(this._x1=t)+","+(this._y1=e)},arc:function(t,e,n,s,a,c){t=+t,e=+e,c=!!c;var u=(n=+n)*Math.cos(s),d=n*Math.sin(s),f=t+u,h=e+d,p=1^c,y=c?s-a:a-s;if(n<0)throw new Error("negative radius: "+n);null===this._x1?this._+="M"+f+","+h:(Math.abs(this._x1-f)>i||Math.abs(this._y1-h)>i)&&(this._+="L"+f+","+h),n&&(y<0&&(y=y%o+o),y>l?this._+="A"+n+","+n+",0,1,"+p+","+(t-u)+","+(e-d)+"A"+n+","+n+",0,1,"+p+","+(this._x1=f)+","+(this._y1=h):y>i&&(this._+="A"+n+","+n+",0,"+ +(y>=r)+","+p+","+(this._x1=t+n*Math.cos(a))+","+(this._y1=e+n*Math.sin(a))))},rect:function(t,e,n,r){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+e)+"h"+ +n+"v"+ +r+"h"+-n+"Z"},toString:function(){return this._}};const d=u;var f=Array.prototype.slice;function h(t){return function(){return t}}function p(t){return t[0]}function y(t){return t[1]}function g(t){return t.source}function m(t){return t.target}function x(t,e,n,r,o){t.moveTo(e,n),t.bezierCurveTo(e=(e+r)/2,n,e,o,r,o)}function b(t){return[t.source.x1,t.y0]}function k(t){return[t.target.x0,t.y1]}function v(){return function(t){var e=g,n=m,r=p,o=y,i=null;function s(){var s,a=f.call(arguments),l=e.apply(this,a),c=n.apply(this,a);if(i||(i=s=d()),t(i,+r.apply(this,(a[0]=l,a)),+o.apply(this,a),+r.apply(this,(a[0]=c,a)),+o.apply(this,a)),s)return i=null,s+""||null}return s.source=function(t){return arguments.length?(e=t,s):e},s.target=function(t){return arguments.length?(n=t,s):n},s.x=function(t){return arguments.length?(r="function"==typeof t?t:h(+t),s):r},s.y=function(t){return arguments.length?(o="function"==typeof t?t:h(+t),s):o},s.context=function(t){return arguments.length?(i=null==t?null:t,s):i},s}(x).source(b).target(k)}const w=({data:t,panelId:e})=>{const r=v(),o=t.color,i=`${e}-${t.id}`,s=`sankey-path${e}`;return n().createElement(n().Fragment,null,n().createElement("path",{d:r(t),fill:"none",stroke:o,strokeOpacity:.8,opacity:.7,strokeWidth:t.width,id:i,display:t.displayValue,className:s}))};var _=s(388);const L=({data:t,textColor:e,nodeColor:r,panelId:o})=>{const i=(0,_.useTheme2)();let s=t.x0,a=t.x1,l=t.y0,c=t.y1,u=t.index,d=t.name,f=t.value;const h=a-s,p=i.typography.fontSize,y=`sankey-node${o}`;return n().createElement(n().Fragment,null,n().createElement("rect",{x:s,y:l,rx:5,ry:5,width:h,height:c-l,stroke:"black",fill:r,"data-index":u,id:o+","+t.id,d:f,name:d,className:y}),n().createElement("text",{x:s<h/2?a+6:s-6,y:(c+l)/2,style:{fill:e,alignmentBaseline:"middle",fontSize:p,textAnchor:s<h/2?"start":"end",pointerEvents:"none",userSelect:"none"}},d))};function M(t,e){let n=0;if(void 0===e)for(let e of t)(e=+e)&&(n+=e);else{let r=-1;for(let o of t)(o=+e(o,++r,t))&&(n+=o)}return n}function C(t,e){let n;if(void 0===e)for(const e of t)null!=e&&(n<e||void 0===n&&e>=e)&&(n=e);else{let r=-1;for(let o of t)null!=(o=e(o,++r,t))&&(n<o||void 0===n&&o>=o)&&(n=o)}return n}function S(t,e){return t.sourceLinks.length?t.depth:e-1}function $(t){return function(){return t}}function E(t,e){return A(t.source,e.source)||t.index-e.index}function P(t,e){return A(t.target,e.target)||t.index-e.index}function A(t,e){return t.y0-e.y0}function O(t){return t.value}function N(t){return t.index}function I(t){return t.nodes}function V(t){return t.links}function F(t,e){const n=t.get(e);if(!n)throw new Error("missing: "+e);return n}function D({nodes:t}){for(const e of t){let t=e.y0,n=t;for(const n of e.sourceLinks)n.y0=t+n.width/2,t+=n.width;for(const t of e.targetLinks)t.y1=n+t.width/2,n+=t.width}}var T=s(200);const j=({rowNames:t,field:n,panelId:r})=>{const[o,i]=(0,e.useState)({mouseX:100,mouseY:100}),s=t=>{i({mouseX:t.clientX,mouseY:t.clientY})};return(0,e.useEffect)((()=>{window.addEventListener("mousemove",s);const e=`.sankey-path${r}`;T.selectAll(e).on("mouseover",(function(n,r){let i=T.select(this).attr("id"),s=i.split("-"),a=t.find((t=>t.name===s[1])).display;T.selectAll(e).each((function(t){let e=T.select(this).attr("id"),n=i===e;T.select(this).attr("opacity",n?1:.4)}));let l=T.select(this).attr("id");T.select("body").append("div").attr("class",`tooltip-${l}`).html((()=>{let t=T.select(this).attr("display");return`${a} <br> <b>${t}</b>`})).style("padding","10px 15px").style("background","black").style("color","white").style("border","#A8A8A8 solid 5px").style("border-radius","5px").style("left",o.mouseX+"px").style("top",o.mouseY+"px").style("opacity",0).style("position","absolute").transition().duration(200).style("opacity",.8)})).on("mouseout",(function(t){let n=T.select(this).attr("id");T.selectAll(`.tooltip-${n}`).transition().duration(300).remove(),T.selectAll(e).attr("opacity",.7)}));const i=`.sankey-node${r}`;return T.selectAll(i).on("mouseover",(function(t,r){let i=T.select(this).attr("id").split(","),s=i[0],a=[];i.forEach((t=>{a.push(`${s}-${t}`)})),T.selectAll(e).each((function(t){let e=T.select(this).attr("id"),n=a.find((t=>t===e));T.select(this).attr("opacity",n?1:.2)}));let l=T.select(this).attr("data-index");T.select("body").append("div").attr("class",`tooltip-node${l}`).html((()=>{let t,e=n.display(T.select(this).attr("d")),r=T.select(this).attr("name");return t=e.suffix?`${r}: <b>${e.text} ${e.suffix}</b>`:`${r}: <b>${e.text}</b>`,t})).style("padding","10px 15px").style("background","black").style("color","white").style("border","#A8A8A8 solid 5px").style("border-radius","5px").style("left",o.mouseX+"px").style("top",o.mouseY+"px").style("opacity",0).style("position","absolute").transition().duration(200).style("opacity",.8)})).on("mouseout",(function(t){let n=T.select(this).attr("data-index");T.selectAll(`.tooltip-node${n}`).transition().duration(300).remove(),T.selectAll(e).attr("opacity",.7)})),()=>{window.removeEventListener("mousemove",s)}})),null},z=({displayNames:t,width:n,id:r,topMargin:o,textColor:i})=>((0,e.useEffect)((()=>{T.select("#"+r).selectAll(".header-text").remove();const e=T.select("#"+r).append("g").attr("id",`${r} header`),s=o/2;if(e.append("text").attr("class","header-text").attr("transform","translate(20,"+s+")").attr("font-size","14pt").attr("font-weight","500").attr("text-anchor","start").text(t[0]).attr("fill",i),e.append("text").attr("class","header-text").attr("transform","translate("+(n+20)+","+s+")").attr("font-size","14pt").attr("font-weight","500").attr("text-anchor","end").text(t[t.length-2]).attr("fill",i),t.length>3){const r=n/(t.length-2);for(let n=1;n<t.length-2;n++){let o=r*n+20;e.append("text").attr("class","header-text").attr("transform",`translate(${o},${s})`).attr("font-size","14pt").attr("font-weight","500").attr("text-anchor","middle").text(t[n]).attr("fill",i)}}})),null),B=({data:t,width:e,height:r,displayNames:o,rowDisplayNames:i,id:s,textColor:a,nodeColor:l,field:c,nodeWidth:u,nodePadding:d,iteration:f})=>{const h=e-20-20,p=r-75-50,y=function(){let t,e,n,r=0,o=0,i=1,s=1,a=24,l=8,c=N,u=S,d=I,f=V,h=6;function p(){const p={nodes:d.apply(null,arguments),links:f.apply(null,arguments)};return function({nodes:t,links:e}){for(const[e,n]of t.entries())n.index=e,n.sourceLinks=[],n.targetLinks=[];const r=new Map(t.map(((e,n)=>[c(e,n,t),e])));for(const[t,n]of e.entries()){n.index=t;let{source:e,target:o}=n;"object"!=typeof e&&(e=n.source=F(r,e)),"object"!=typeof o&&(o=n.target=F(r,o)),e.sourceLinks.push(n),o.targetLinks.push(n)}if(null!=n)for(const{sourceLinks:e,targetLinks:r}of t)e.sort(n),r.sort(n)}(p),function({nodes:t}){for(const e of t)e.value=void 0===e.fixedValue?Math.max(M(e.sourceLinks,O),M(e.targetLinks,O)):e.fixedValue}(p),function({nodes:t}){const e=t.length;let n=new Set(t),r=new Set,o=0;for(;n.size;){for(const t of n){t.depth=o;for(const{target:e}of t.sourceLinks)r.add(e)}if(++o>e)throw new Error("circular link");n=r,r=new Set}}(p),function({nodes:t}){const e=t.length;let n=new Set(t),r=new Set,o=0;for(;n.size;){for(const t of n){t.height=o;for(const{source:e}of t.targetLinks)r.add(e)}if(++o>e)throw new Error("circular link");n=r,r=new Set}}(p),function(n){const c=function({nodes:t}){const n=C(t,(t=>t.depth))+1,o=(i-r-a)/(n-1),s=new Array(n);for(const e of t){const t=Math.max(0,Math.min(n-1,Math.floor(u.call(null,e,n))));e.layer=t,e.x0=r+t*o,e.x1=e.x0+a,s[t]?s[t].push(e):s[t]=[e]}if(e)for(const t of s)t.sort(e);return s}(n);t=Math.min(l,(s-o)/(C(c,(t=>t.length))-1)),function(e){const n=function(t,e){let n;if(void 0===e)for(const e of t)null!=e&&(n>e||void 0===n&&e>=e)&&(n=e);else{let r=-1;for(let o of t)null!=(o=e(o,++r))&&(n>o||void 0===n&&o>=o)&&(n=o)}return n}(e,(e=>(s-o-(e.length-1)*t)/M(e,O)));for(const r of e){let e=o;for(const o of r){o.y0=e,o.y1=e+o.value*n,e=o.y1+t;for(const t of o.sourceLinks)t.width=t.value*n}e=(s-e+t)/(r.length+1);for(let t=0;t<r.length;++t){const n=r[t];n.y0+=e*(t+1),n.y1+=e*(t+1)}v(r)}}(c);for(let t=0;t<h;++t){const e=Math.pow(.99,t),n=Math.max(1-e,(t+1)/h);g(c,e,n),y(c,e,n)}}(p),D(p),p}function y(t,n,r){for(let o=1,i=t.length;o<i;++o){const i=t[o];for(const t of i){let e=0,r=0;for(const{source:n,value:o}of t.targetLinks){let i=o*(t.layer-n.layer);e+=w(n,t)*i,r+=i}if(!(r>0))continue;let o=(e/r-t.y0)*n;t.y0+=o,t.y1+=o,k(t)}void 0===e&&i.sort(A),m(i,r)}}function g(t,n,r){for(let o=t.length-2;o>=0;--o){const i=t[o];for(const t of i){let e=0,r=0;for(const{target:n,value:o}of t.sourceLinks){let i=o*(n.layer-t.layer);e+=_(t,n)*i,r+=i}if(!(r>0))continue;let o=(e/r-t.y0)*n;t.y0+=o,t.y1+=o,k(t)}void 0===e&&i.sort(A),m(i,r)}}function m(e,n){const r=e.length>>1,i=e[r];b(e,i.y0-t,r-1,n),x(e,i.y1+t,r+1,n),b(e,s,e.length-1,n),x(e,o,0,n)}function x(e,n,r,o){for(;r<e.length;++r){const i=e[r],s=(n-i.y0)*o;s>1e-6&&(i.y0+=s,i.y1+=s),n=i.y1+t}}function b(e,n,r,o){for(;r>=0;--r){const i=e[r],s=(i.y1-n)*o;s>1e-6&&(i.y0-=s,i.y1-=s),n=i.y0-t}}function k({sourceLinks:t,targetLinks:e}){if(void 0===n){for(const{source:{sourceLinks:t}}of e)t.sort(P);for(const{target:{targetLinks:e}}of t)e.sort(E)}}function v(t){if(void 0===n)for(const{sourceLinks:e,targetLinks:n}of t)e.sort(P),n.sort(E)}function w(e,n){let r=e.y0-(e.sourceLinks.length-1)*t/2;for(const{target:o,width:i}of e.sourceLinks){if(o===n)break;r+=i+t}for(const{source:t,width:o}of n.targetLinks){if(t===e)break;r-=o}return r}function _(e,n){let r=n.y0-(n.targetLinks.length-1)*t/2;for(const{source:o,width:i}of n.targetLinks){if(o===e)break;r+=i+t}for(const{target:t,width:o}of e.sourceLinks){if(t===n)break;r-=o}return r}return p.update=function(t){return D(t),t},p.nodeId=function(t){return arguments.length?(c="function"==typeof t?t:$(t),p):c},p.nodeAlign=function(t){return arguments.length?(u="function"==typeof t?t:$(t),p):u},p.nodeSort=function(t){return arguments.length?(e=t,p):e},p.nodeWidth=function(t){return arguments.length?(a=+t,p):a},p.nodePadding=function(e){return arguments.length?(l=t=+e,p):l},p.nodes=function(t){return arguments.length?(d="function"==typeof t?t:$(t),p):d},p.links=function(t){return arguments.length?(f="function"==typeof t?t:$(t),p):f},p.linkSort=function(t){return arguments.length?(n=t,p):n},p.size=function(t){return arguments.length?(r=o=0,i=+t[0],s=+t[1],p):[i-r,s-o]},p.extent=function(t){return arguments.length?(r=+t[0][0],i=+t[1][0],o=+t[0][1],s=+t[1][1],p):[[r,o],[i,s]]},p.iterations=function(t){return arguments.length?(h=+t,p):h},p}().iterations(f).nodeWidth(u).nodePadding(d).extent([[0,0],[h,p]]);if(t){const{links:u,nodes:d}=y(t);return n().createElement("svg",{id:"Chart_"+s,width:e,height:r},n().createElement(z,{displayNames:o,width:h,id:"Chart_"+s,topMargin:75,textColor:a}),n().createElement(j,{rowNames:i,field:c,panelId:s}),n().createElement("g",{transform:"translate(20, 75)"},u.map(((t,e)=>n().createElement(w,{key:e,data:t,panelId:s})))),n().createElement("g",{transform:"translate(20, 75)"},d.map(((t,e)=>n().createElement(L,{data:t,key:e,textColor:a,nodeColor:l,panelId:s})))))}return n().createElement("div",{id:"Chart_"+s,style:{height:r,width:e}})};function W(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function X(t,e,n,r,o,i,s){try{var a=t[i](s),l=a.value}catch(t){return void n(t)}a.done?e(l):Promise.resolve(l).then(r,o)}const Y=new t.PanelPlugin((({options:e,data:r,width:o,height:i,id:s})=>{let a=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable})))),r.forEach((function(e){W(t,e,n[e])}))}return t}({},e);const l=(0,_.useTheme2)();let c=[];try{c=function(e,n,r,o){const i=n.valueField;function s(t){switch(t){case"dark-green":t="#1A7311";break;case"semi-dark-green":t="#36872D";break;case"light-green":t="#73BF68";break;case"super-light-green":t="#96D88C";break;case"dark-yellow":t="rgb(207, 159, 0)";break;case"semi-dark-yellow":t="rgb(224, 180, 0)";break;case"light-yellow":t="rgb(250, 222, 42)";break;case"super-light-yellow":t="rgb(255, 238, 82)";break;case"dark-red":t="rgb(173, 3, 23)";break;case"semi-dark-red":t="rgb(196, 22, 42)";break;case"light-red":t="rgb(242, 73, 92)";break;case"super-light-red":t="rgb(255, 115, 131)";break;case"dark-blue":t="rgb(18, 80, 176)";break;case"semi-dark-blue":t="rgb(31, 96, 196)";break;case"light-blue":t="rgb(87, 148, 242)";break;case"super-light-blue":t="rgb(138, 184, 255)";break;case"dark-orange":t="rgb(229, 84, 0)";break;case"semi-dark-orange":t="rgb(250, 100, 0)";break;case"light-orange":t="rgb(255, 152, 48)";break;case"super-light-orange":t="rgb(255, 179, 87)";break;case"dark-purple":t="rgb(124, 46, 163)";break;case"semi-dark-purple":t="rgb(143, 59, 184)";break;case"light-purple":t="rgb(184, 119, 217)";break;case"super-light-purple":t="rgb(202, 149, 229)"}return t}const a=[];r?a.push(s(o)):(a.push("#018EDB"),a.push("#DB8500"),a.push("#7C00DB"),a.push("#DB0600"),a.push("#00DB57"));let l=e.series[0].fields,c=l.length-1,u=[];l.forEach((e=>{u.push((0,t.getFieldDisplayName)(e))}));const d=i?e.series.map((t=>t.fields.find((t=>t.name===i)))):e.series.map((t=>t.fields.find((t=>"number"===t.type))));let f=[];d[0].values.map((t=>{f.push([t,d[0].display(t),d[0].name])}));const h=e.series[0],p=new t.DataFrameView(h);let y,g=[],m=[],x=[],b=[],k=0;return p.forEach((t=>{var e;let n=[];for(let e=0;e<c;e++){let r=t[e],o=m.findIndex((t=>t.name===r&&t.colId===e));-1===o?(o=m.push({name:r,id:[`row${k}`],colId:e})-1,0===e&&(y=a[x.length%a.length],x.push({name:r,index:o,color:y}))):m[o].id.push(`row${k}`),n.push(o)}let r=null===(e=x.find((t=>t.index===n[0])))||void 0===e?void 0:e.color,o=`${m[n[0]].name}`;for(let e=0;e<n.length-1;e++){let i,s=d[0].display(t[c]);i=s.suffix?`${s.text} ${s.suffix}`:`${s.text}`,g.push({source:n[e],target:n[e+1],value:t[c],displayValue:i,id:`row${k}`,color:r,node0:n[0]}),o=o.concat(` -> ${m[n[e+1]].name}`)}b.push({name:`row${k}`,display:o}),k++})),[{links:g,nodes:m},u,b,d[0],s]}(r,e,a.monochrome,a.color)}catch(t){console.error("parsing error: ",t)}const u=c[1],d=c[0],f=c[2],h=c[3],p=c[4],y=l.colors.text.primary,g=p(a.nodeColor);return n().createElement("g",null,n().createElement(B,{data:d,displayNames:u,rowDisplayNames:f,width:o,height:i,id:s,textColor:y,nodeColor:g,field:h,nodeWidth:a.nodeWidth,nodePadding:a.nodePadding,iteration:a.iteration}))})).setPanelOptions((e=>{var n,r;e.addBooleanSwitch({path:"monochrome",name:"Single Link color only",defaultValue:!1}).addColorPicker({path:"color",name:"Link Color",showIf:(!0,t=>true===t.monochrome),defaultValue:"blue"}).addColorPicker({path:"nodeColor",name:"Node color",defaultValue:"grey"}).addSliderInput({path:"nodeWidth",name:"Node width",defaultValue:30,settings:{min:5,max:100,step:1}}).addSliderInput({path:"nodePadding",name:"Node padding",defaultValue:30,settings:{min:1,max:100,step:1}}).addSelect({path:"valueField",name:"Value Field",description:"Select the field that should be used for the link thickness",settings:{allowCustomValue:!1,options:[],getOptions:(n=function*(e){const n=[];if(e&&e.data)for(const r of e.data)for(const o of r.fields){const i=(0,t.getFieldDisplayName)(o,r,e.data),s=i;n.push({value:s,label:i})}return Promise.resolve(n)},r=function(){var t=this,e=arguments;return new Promise((function(r,o){var i=n.apply(t,e);function s(t){X(i,r,o,s,a,"next",t)}function a(t){X(i,r,o,s,a,"throw",t)}s(void 0)}))},function(t){return r.apply(this,arguments)})}}).addSliderInput({path:"iteration",name:"Layout iterations",defaultValue:7,settings:{min:1,max:30,step:1}})})).useFieldConfig({disableStandardOptions:[t.FieldConfigProperty.NoValue,t.FieldConfigProperty.Max,t.FieldConfigProperty.Min],standardOptions:{[t.FieldConfigProperty.Color]:{settings:{byValueSupport:!0,bySeriesSupport:!0,preferThresholdsMode:!0}}}})})(),a})()));
//# sourceMappingURL=module.js.map