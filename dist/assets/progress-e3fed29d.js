import{r as n,bL as re,bM as se,bN as V,bs as oe,bx as z,bl as ne,c as F,bO as K,H as ie,g as ce,m as ae,a5 as le,b as ue,a as de,bi as pe,bP as ge,bQ as fe,bR as me,bS as Ce}from"./index-4b3d7bc8.js";var be={percent:0,prefixCls:"rc-progress",strokeColor:"#2db7f5",strokeLinecap:"round",strokeWidth:1,trailColor:"#D9D9D9",trailWidth:1,gapPosition:"bottom"},ye=function(){var t=n.useRef([]),r=n.useRef(null);return n.useEffect(function(){var s=Date.now(),o=!1;t.current.forEach(function(c){if(c){o=!0;var i=c.style;i.transitionDuration=".3s, .3s, .3s, .06s",r.current&&s-r.current<100&&(i.transitionDuration="0s, 0s")}}),o&&(r.current=Date.now())}),t.current},q=0,he=se();function Se(){var e;return he?(e=q,q+=1):e="TEST_OR_SSR",e}const ve=function(e){var t=n.useState(),r=re(t,2),s=r[0],o=r[1];return n.useEffect(function(){o("rc_progress_".concat(Se()))},[]),e||s};var $e=["id","prefixCls","steps","strokeWidth","trailWidth","gapDegree","gapPosition","trailColor","strokeLinecap","style","className","strokeColor","percent"];function Y(e){return+e.replace("%","")}function Z(e){var t=e??[];return Array.isArray(t)?t:[t]}var A=100,G=function(t,r,s,o,c,i,d,l,u,g){var C=arguments.length>10&&arguments[10]!==void 0?arguments[10]:0,a=s/100*360*((360-i)/360),f=i===0?0:{bottom:0,top:180,left:90,right:-90}[d],b=(100-o)/100*r;return u==="round"&&o!==100&&(b+=g/2,b>=r&&(b=r-.01)),{stroke:typeof l=="string"?l:void 0,strokeDasharray:"".concat(r,"px ").concat(t),strokeDashoffset:b+C,transform:"rotate(".concat(c+a+f,"deg)"),transformOrigin:"0 0",transition:"stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s",fillOpacity:0}},ke=function(t){var r=V(V({},be),t),s=r.id,o=r.prefixCls,c=r.steps,i=r.strokeWidth,d=r.trailWidth,l=r.gapDegree,u=l===void 0?0:l,g=r.gapPosition,C=r.trailColor,a=r.strokeLinecap,f=r.style,b=r.className,y=r.strokeColor,p=r.percent,w=oe(r,$e),B=ve(s),k="".concat(B,"-gradient"),x=A/2-i/2,O=Math.PI*2*x,P=u>0?90+u/2:-90,E=O*((360-u)/360),v=z(c)==="object"?c:{count:c,space:2},m=v.count,h=v.space,R=G(O,E,0,100,P,u,g,C,a,i),W=Z(p),_=Z(y),H=_.find(function(S){return S&&z(S)==="object"}),U=ye(),J=function(){var $=0;return W.map(function(N,D){var T=_[D]||_[_.length-1],j=T&&z(T)==="object"?"url(#".concat(k,")"):void 0,L=G(O,E,$,N,P,u,g,T,a,i);return $+=N,n.createElement("circle",{key:D,className:"".concat(o,"-circle-path"),r:x,cx:0,cy:0,stroke:j,strokeLinecap:a,strokeWidth:i,opacity:N===0?0:1,style:L,ref:function(M){U[D]=M}})}).reverse()},ee=function(){var $=Math.round(m*(W[0]/100)),N=100/m,D=0;return new Array(m).fill(null).map(function(T,j){var L=j<=$-1?_[0]:C,Q=L&&z(L)==="object"?"url(#".concat(k,")"):void 0,M=G(O,E,D,N,P,u,g,L,"butt",i,h);return D+=(E-M.strokeDashoffset+h)*100/E,n.createElement("circle",{key:j,className:"".concat(o,"-circle-path"),r:x,cx:0,cy:0,stroke:Q,strokeWidth:i,opacity:1,style:M,ref:function(te){U[j]=te}})})};return n.createElement("svg",ne({className:F("".concat(o,"-circle"),b),viewBox:"".concat(-A/2," ").concat(-A/2," ").concat(A," ").concat(A),style:f,id:s,role:"presentation"},w),H&&n.createElement("defs",null,n.createElement("linearGradient",{id:k,x1:"100%",y1:"0%",x2:"0%",y2:"0%"},Object.keys(H).sort(function(S,$){return Y(S)-Y($)}).map(function(S,$){return n.createElement("stop",{key:$,offset:S,stopColor:H[S]})}))),!m&&n.createElement("circle",{className:"".concat(o,"-circle-trail"),r:x,cx:0,cy:0,stroke:C,strokeLinecap:a,strokeWidth:d||i,style:R}),m?ee():J())};function I(e){return!e||e<0?0:e>100?100:e}function X(e){let{success:t,successPercent:r}=e,s=r;return t&&"progress"in t&&(s=t.progress),t&&"percent"in t&&(s=t.percent),s}const xe=e=>{let{percent:t,success:r,successPercent:s}=e;const o=I(X({success:r,successPercent:s}));return[o,I(I(t)-o)]},Pe=e=>{let{success:t={},strokeColor:r}=e;const{strokeColor:s}=t;return[s||K.green,r||null]},Ee=3,Ie=e=>Ee/e*100,we=e=>{const{prefixCls:t,width:r=120,strokeWidth:s=Math.max(Ie(r),6),trailColor:o=null,strokeLinecap:c="round",gapPosition:i,gapDegree:d,type:l,children:u,success:g}=e,C={width:r,height:r,fontSize:r*.15+6},a=n.useMemo(()=>{if(d||d===0)return d;if(l==="dashboard")return 75},[d,l]),f=i||l==="dashboard"&&"bottom"||void 0,b=Object.prototype.toString.call(e.strokeColor)==="[object Object]",y=Pe({success:g,strokeColor:e.strokeColor}),p=F(`${t}-inner`,{[`${t}-circle-gradient`]:b}),w=n.createElement(ke,{percent:xe(e),strokeWidth:s,trailWidth:s,strokeColor:y,strokeLinecap:c,trailColor:o,prefixCls:t,gapDegree:a,gapPosition:f});return n.createElement("div",{className:p,style:C},r<=20?n.createElement(ie,{title:u},w):n.createElement(n.Fragment,null,w,u))},Oe=we;var De=globalThis&&globalThis.__rest||function(e,t){var r={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(r[s]=e[s]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,s=Object.getOwnPropertySymbols(e);o<s.length;o++)t.indexOf(s[o])<0&&Object.prototype.propertyIsEnumerable.call(e,s[o])&&(r[s[o]]=e[s[o]]);return r};const _e=e=>{let t=[];return Object.keys(e).forEach(r=>{const s=parseFloat(r.replace(/%/g,""));isNaN(s)||t.push({key:s,value:e[r]})}),t=t.sort((r,s)=>r.key-s.key),t.map(r=>{let{key:s,value:o}=r;return`${o} ${s}%`}).join(", ")},Ne=(e,t)=>{const{from:r=K.blue,to:s=K.blue,direction:o=t==="rtl"?"to left":"to right"}=e,c=De(e,["from","to","direction"]);if(Object.keys(c).length!==0){const i=_e(c);return{backgroundImage:`linear-gradient(${o}, ${i})`}}return{backgroundImage:`linear-gradient(${o}, ${r}, ${s})`}},je=e=>{const{prefixCls:t,direction:r,percent:s,strokeWidth:o,size:c,strokeColor:i,strokeLinecap:d="round",children:l,trailColor:u=null,success:g}=e,C=i&&typeof i!="string"?Ne(i,r):{backgroundColor:i},a=d==="square"||d==="butt"?0:void 0,f={backgroundColor:u||void 0,borderRadius:a},b=Object.assign({width:`${I(s)}%`,height:o||(c==="small"?6:8),borderRadius:a},C),y=X(e),p={width:`${I(y)}%`,height:o||(c==="small"?6:8),borderRadius:a,backgroundColor:g==null?void 0:g.strokeColor};return n.createElement(n.Fragment,null,n.createElement("div",{className:`${t}-outer`},n.createElement("div",{className:`${t}-inner`,style:f},n.createElement("div",{className:`${t}-bg`,style:b}),y!==void 0?n.createElement("div",{className:`${t}-success-bg`,style:p}):null)),l)},Le=je,Ae=e=>{const{size:t,steps:r,percent:s=0,strokeWidth:o=8,strokeColor:c,trailColor:i=null,prefixCls:d,children:l}=e,u=Math.round(r*(s/100)),g=t==="small"?2:14,C=new Array(r);for(let a=0;a<r;a++){const f=Array.isArray(c)?c[a]:c;C[a]=n.createElement("div",{key:a,className:F(`${d}-steps-item`,{[`${d}-steps-item-active`]:a<=u-1}),style:{backgroundColor:a<=u-1?f:i,width:g,height:o}})}return n.createElement("div",{className:`${d}-steps-outer`},C,l)},Re=Ae,We=new le("antProgressActive",{"0%":{transform:"translateX(-100%) scaleX(0)",opacity:.1},"20%":{transform:"translateX(-100%) scaleX(0)",opacity:.5},to:{transform:"translateX(0) scaleX(1)",opacity:0}}),Te=e=>{const{componentCls:t,iconCls:r}=e;return{[t]:Object.assign(Object.assign({},ue(e)),{display:"inline-block","&-rtl":{direction:"rtl"},"&-line":{position:"relative",width:"100%",fontSize:e.fontSize,marginInlineEnd:e.marginXS,marginBottom:e.marginXS},[`${t}-outer`]:{display:"inline-block",width:"100%"},[`&${t}-show-info`]:{[`${t}-outer`]:{marginInlineEnd:`calc(-2em - ${e.marginXS}px)`,paddingInlineEnd:`calc(2em + ${e.paddingXS}px)`}},[`${t}-inner`]:{position:"relative",display:"inline-block",width:"100%",overflow:"hidden",verticalAlign:"middle",backgroundColor:e.progressRemainingColor,borderRadius:e.progressLineRadius},[`${t}-inner:not(${t}-circle-gradient)`]:{[`${t}-circle-path`]:{stroke:e.colorInfo}},[`&${t}-success-bg, ${t}-bg`]:{position:"relative",backgroundColor:e.colorInfo,borderRadius:e.progressLineRadius,transition:`all ${e.motionDurationSlow} ${e.motionEaseInOutCirc}`},[`${t}-success-bg`]:{position:"absolute",insetBlockStart:0,insetInlineStart:0,backgroundColor:e.colorSuccess},[`${t}-text`]:{display:"inline-block",width:"2em",marginInlineStart:e.marginXS,color:e.progressInfoTextColor,lineHeight:1,whiteSpace:"nowrap",textAlign:"start",verticalAlign:"middle",wordBreak:"normal",[r]:{fontSize:e.fontSize}},[`&${t}-status-active`]:{[`${t}-bg::before`]:{position:"absolute",inset:0,backgroundColor:e.colorBgContainer,borderRadius:e.progressLineRadius,opacity:0,animationName:We,animationDuration:e.progressActiveMotionDuration,animationTimingFunction:e.motionEaseOutQuint,animationIterationCount:"infinite",content:'""'}},[`&${t}-status-exception`]:{[`${t}-bg`]:{backgroundColor:e.colorError},[`${t}-text`]:{color:e.colorError}},[`&${t}-status-exception ${t}-inner:not(${t}-circle-gradient)`]:{[`${t}-circle-path`]:{stroke:e.colorError}},[`&${t}-status-success`]:{[`${t}-bg`]:{backgroundColor:e.colorSuccess},[`${t}-text`]:{color:e.colorSuccess}},[`&${t}-status-success ${t}-inner:not(${t}-circle-gradient)`]:{[`${t}-circle-path`]:{stroke:e.colorSuccess}}})}},Me=e=>{const{componentCls:t,iconCls:r}=e;return{[t]:{[`${t}-circle-trail`]:{stroke:e.progressRemainingColor},[`&${t}-circle ${t}-inner`]:{position:"relative",lineHeight:1,backgroundColor:"transparent"},[`&${t}-circle ${t}-text`]:{position:"absolute",insetBlockStart:"50%",insetInlineStart:0,width:"100%",margin:0,padding:0,color:e.colorText,lineHeight:1,whiteSpace:"normal",textAlign:"center",transform:"translateY(-50%)",[r]:{fontSize:`${e.fontSize/e.fontSizeSM}em`}},[`${t}-circle&-status-exception`]:{[`${t}-text`]:{color:e.colorError}},[`${t}-circle&-status-success`]:{[`${t}-text`]:{color:e.colorSuccess}}},[`${t}-inline-circle`]:{lineHeight:1,[`${t}-inner`]:{verticalAlign:"bottom"}}}},ze=e=>{const{componentCls:t}=e;return{[t]:{[`${t}-steps`]:{display:"inline-block","&-outer":{display:"flex",flexDirection:"row",alignItems:"center"},"&-item":{flexShrink:0,minWidth:e.progressStepMinWidth,marginInlineEnd:e.progressStepMarginInlineEnd,backgroundColor:e.progressRemainingColor,transition:`all ${e.motionDurationSlow}`,"&-active":{backgroundColor:e.colorInfo}}}}}},Xe=e=>{const{componentCls:t,iconCls:r}=e;return{[t]:{[`${t}-small&-line, ${t}-small&-line ${t}-text ${r}`]:{fontSize:e.fontSizeSM}}}},Fe=ce("Progress",e=>{const t=e.marginXXS/2,r=ae(e,{progressLineRadius:100,progressInfoTextColor:e.colorText,progressDefaultColor:e.colorInfo,progressRemainingColor:e.colorFillSecondary,progressStepMarginInlineEnd:t,progressStepMinWidth:t,progressActiveMotionDuration:"2.4s"});return[Te(r),Me(r),ze(r),Xe(r)]});var Be=globalThis&&globalThis.__rest||function(e,t){var r={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(r[s]=e[s]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,s=Object.getOwnPropertySymbols(e);o<s.length;o++)t.indexOf(s[o])<0&&Object.prototype.propertyIsEnumerable.call(e,s[o])&&(r[s[o]]=e[s[o]]);return r};const He=["normal","exception","active","success"],Ge=e=>{const{prefixCls:t,className:r,steps:s,strokeColor:o,percent:c=0,size:i="default",showInfo:d=!0,type:l="line",status:u,format:g}=e,C=Be(e,["prefixCls","className","steps","strokeColor","percent","size","showInfo","type","status","format"]),a=n.useMemo(()=>{var v,m;const h=X(e);return parseInt(h!==void 0?(v=h??0)===null||v===void 0?void 0:v.toString():(m=c??0)===null||m===void 0?void 0:m.toString(),10)},[c,e.success,e.successPercent]),f=n.useMemo(()=>!He.includes(u)&&a>=100?"success":u||"normal",[u,a]),{getPrefixCls:b,direction:y}=n.useContext(de),p=b("progress",t),[w,B]=Fe(p),k=n.useMemo(()=>{if(!d)return null;const v=X(e);let m;const h=g||(W=>`${W}%`),R=l==="line";return g||f!=="exception"&&f!=="success"?m=h(I(c),I(v)):f==="exception"?m=R?n.createElement(ge,null):n.createElement(fe,null):f==="success"&&(m=R?n.createElement(me,null):n.createElement(Ce,null)),n.createElement("span",{className:`${p}-text`,title:typeof m=="string"?m:void 0},m)},[d,a,f,l,p,g]),x=Array.isArray(o)?o[0]:o,O=typeof o=="string"||Array.isArray(o)?o:void 0;let P;l==="line"?P=s?n.createElement(Re,Object.assign({},e,{strokeColor:O,prefixCls:p,steps:s}),k):n.createElement(Le,Object.assign({},e,{strokeColor:x,prefixCls:p,direction:y}),k):(l==="circle"||l==="dashboard")&&(P=n.createElement(Oe,Object.assign({},e,{strokeColor:x,prefixCls:p,progressStatus:f}),k));const E=F(p,{[`${p}-inline-circle`]:l==="circle"&&e.width<=20,[`${p}-${l==="dashboard"&&"circle"||s&&"steps"||l}`]:!0,[`${p}-status-${f}`]:!0,[`${p}-show-info`]:d,[`${p}-${i}`]:i,[`${p}-rtl`]:y==="rtl"},r,B);return w(n.createElement("div",Object.assign({className:E,role:"progressbar"},pe(C,["trailColor","strokeWidth","width","gapDegree","gapPosition","strokeLinecap","success","successPercent"])),P))},Qe=Ge;export{Qe as P};