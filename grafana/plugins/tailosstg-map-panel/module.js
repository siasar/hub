define(["@grafana/data","@emotion/css","@grafana/ui","react"],((e,t,o,r)=>(()=>{"use strict";var a={644:e=>{e.exports=t},305:t=>{t.exports=e},388:e=>{e.exports=o},650:e=>{e.exports=r}},n={};function l(e){var t=n[e];if(void 0!==t)return t.exports;var o=n[e]={exports:{}};return a[e](o,o.exports,l),o.exports}l.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return l.d(t,{a:t}),t},l.d=(e,t)=>{for(var o in t)l.o(t,o)&&!l.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),l.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var i={};return(()=>{l.r(i),l.d(i,{plugin:()=>p});var e=l(305),t=l(644),o=l(388),r=l(650),a=l.n(r);const n=({imageUrl:e,downloadUrl:o,width:n,height:l})=>{const i=s(),[d,c]=(0,r.useState)(!1);return a().createElement(a().Fragment,null,a().createElement("img",{src:e||"",onError:()=>{throw c(!1),new Error("No map image available!")},onLoad:()=>c(!0),className:(0,t.cx)(t.css`
              width: ${n}px;
              height: ${l}px;
            `)}),d&&a().createElement("a",{target:"_blank",rel:"noopener noreferrer",href:e,download:!0,className:i.downloadButton,onClick:e=>(()=>{const e=document.createElement("a");e.href=o,e.download=o.substr(o.lastIndexOf("/")+1),e.click()})()},a().createElement("i",{className:"fa fa-download"})))},s=(0,o.stylesFactory)((()=>({downloadButton:t.css`
    height: 2rem;
    width: 2rem;
    font-size: 1.5rem;

    position: absolute;
    left: 20px;
    top: 20px;
    text-shadow: 0 0 3px #000;

    color: #ffffff;
    text-align: center;
    `}))),d=({videoUrl:e,imageUrl:o,downloadUrl:r,width:n,height:l})=>{const i=c();return a().createElement(a().Fragment,null,a().createElement("video",{src:e,controls:!0,width:n,height:l,poster:o,loop:!1,muted:!0,preload:"auto",onError:e=>console.log("Error playing video",e),className:(0,t.cx)(t.css`
              width: ${n}px;
              height: ${l}px;
            `)}),a().createElement("a",{target:"_blank",rel:"noopener noreferrer",href:o,download:!0,className:i.downloadButton,onClick:e=>(()=>{const e=document.createElement("a");e.href=r,e.download=r.substr(r.lastIndexOf("/")+1),e.click()})()},a().createElement("i",{className:"fa fa-download"})))},c=(0,o.stylesFactory)((()=>({downloadButton:t.css`
      height: 2rem;
      width: 2rem;
      font-size: 1.5rem;

      position: absolute;
      left: 20px;
      top: 20px;
      text-shadow: 0 0 3px #000;

      color: #ffffff;
      text-align: center;
    `}))),m=e=>/\.(mp4|webm|ogg|mkv)(\?|$)/i.test(e),g=(0,o.stylesFactory)((()=>({panel:t.css`
      display: flex;
      justify-content: center;
      align-items: flex-end;
    `,wrapper:t.css`
      padding: 10px;
      position: relative;
    `}))),p=new e.PanelPlugin((({options:e,data:t,width:o,height:l})=>{var i,s;const c=g(),p=JSON.parse(t.series[0].fields[0].values.get(0));let f=null===(i=p.layers)||void 0===i?void 0:i.cleaning;const h=null===(s=p.videos)||void 0===s?void 0:s.cleaning,u=p.mapBundle||h||f,{width:w,height:v}=((e,t,o,a)=>{const[n,l]=(0,r.useState)(0),[i,s]=(0,r.useState)(0);return(0,r.useEffect)((()=>{let r,a,n;const i=new Image;i.onload=()=>{r=i.width,a=i.height;let e=0,d=0;r>=a?(n=r/a,e=t,d=e/n,d>o&&(d=o,e=d*n)):a>r&&(n=a/r,d=o,e=d/n,e>t&&(e=t,d=e*n)),l(e),s(d)},i.src=e}),[t,o,e]),{width:n,height:i}})(f,o,l),x={videoUrl:h,imageUrl:f,downloadUrl:u,mediaWidth:w,mediaHeight:v};return a().createElement("div",{className:c.panel},a().createElement("div",{className:c.wrapper},(e=>{const{videoUrl:t,imageUrl:o,downloadUrl:r,mediaWidth:l,mediaHeight:i}=e;return/\.(gif|jpe?g|tiff?|png|webp|bmp)(\?|$)/i.test(o)||m(t)?m(t)?a().createElement(d,{videoUrl:t,imageUrl:o,downloadUrl:r,width:l,height:i}):a().createElement(n,{imageUrl:o,downloadUrl:r,width:l,height:i}):a().createElement(a().Fragment,null,"ERROR: Data source must return a valid image or video URL, like `https://grafana.com/media/images/logos/grafana-logo-footer.svg`")})(x)))}))})(),i})()));
//# sourceMappingURL=module.js.map