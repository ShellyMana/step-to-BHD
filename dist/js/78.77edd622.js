"use strict";(globalThis["webpackChunkionic_app_base"]=globalThis["webpackChunkionic_app_base"]||[]).push([[78],{8487:(o,t,e)=>{e.d(t,{a:()=>u,c:()=>p,g:()=>l,s:()=>h});var s=e(6587);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const n="ION-CONTENT",r="ion-content",a=".ion-content-scroll-host",i=`${r}, ${a}`,c=o=>o.tagName===n,l=async o=>c(o)?(await new Promise((t=>(0,s.c)(o,t))),o.getScrollElement()):o,u=o=>o.closest(i),h=(o,t)=>{if(c(o)){const e=o;return e.scrollToTop(t)}return Promise.resolve(o.scrollTo({top:0,left:0,behavior:t>0?"smooth":"auto"}))},p=(o,t,e,s)=>{if(c(o)){const n=o;return n.scrollByPoint(t,e,s)}return Promise.resolve(o.scrollBy({top:e,left:t,behavior:s>0?"smooth":"auto"}))}},6078:(o,t,e)=>{e.r(t),e.d(t,{startStatusTap:()=>a});var s=e(65),n=e(8487),r=e(6587);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const a=()=>{const o=window;o.addEventListener("statusTap",(()=>{(0,s.wj)((()=>{const t=o.innerWidth,e=o.innerHeight,a=document.elementFromPoint(t/2,e/2);if(!a)return;const i=(0,n.a)(a);i&&new Promise((o=>(0,r.c)(i,o))).then((()=>{(0,s.Iu)((async()=>{i.style.setProperty("--overflow","hidden"),await(0,n.s)(i,300),i.style.removeProperty("--overflow")}))}))}))}))}}}]);
//# sourceMappingURL=78.77edd622.js.map