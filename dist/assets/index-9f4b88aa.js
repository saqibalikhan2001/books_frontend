import{bn as _,bo as D,bp as W,br as R,r as s,g as F,m as G,b as X,a as Q,c as x,bW as V,a8 as Y,bX as Z,bQ as q,bR as J,bY as K,bP as U,bZ as ee}from"./index-4b3d7bc8.js";let oe=function(o){_(t,o);var e=D(t);function t(){var n;return W(this,t),n=e.apply(this,arguments),n.state={error:void 0,info:{componentStack:""}},n}return R(t,[{key:"componentDidCatch",value:function(r,a){this.setState({error:r,info:a})}},{key:"render",value:function(){const{message:r,description:a,children:d}=this.props,{error:l,info:p}=this.state,c=p&&p.componentStack?p.componentStack:null,u=typeof r>"u"?(l||"").toString():r,m=typeof a>"u"?c:a;return l?s.createElement(me,{type:"error",message:u,description:s.createElement("pre",{style:{fontSize:"0.9em",overflowX:"auto"}},m)}):d}}]),t}(s.Component);const ne=oe,S=(o,e,t,n,r)=>({backgroundColor:o,border:`${n.lineWidth}px ${n.lineType} ${e}`,[`${r}-icon`]:{color:t}}),te=o=>{const{componentCls:e,motionDurationSlow:t,marginXS:n,marginSM:r,fontSize:a,fontSizeLG:d,lineHeight:l,borderRadiusLG:p,motionEaseInOutCirc:c,alertIconSizeLG:u,colorText:m,paddingContentVerticalSM:b,alertPaddingHorizontal:f,paddingMD:h,paddingContentHorizontalLG:y}=o;return{[e]:Object.assign(Object.assign({},X(o)),{position:"relative",display:"flex",alignItems:"center",padding:`${b}px ${f}px`,wordWrap:"break-word",borderRadius:p,[`&${e}-rtl`]:{direction:"rtl"},[`${e}-content`]:{flex:1,minWidth:0},[`${e}-icon`]:{marginInlineEnd:n,lineHeight:0},"&-description":{display:"none",fontSize:a,lineHeight:l},"&-message":{color:m},[`&${e}-motion-leave`]:{overflow:"hidden",opacity:1,transition:`max-height ${t} ${c}, opacity ${t} ${c},
        padding-top ${t} ${c}, padding-bottom ${t} ${c},
        margin-bottom ${t} ${c}`},[`&${e}-motion-leave-active`]:{maxHeight:0,marginBottom:"0 !important",paddingTop:0,paddingBottom:0,opacity:0}}),[`${e}-with-description`]:{alignItems:"flex-start",paddingInline:y,paddingBlock:h,[`${e}-icon`]:{marginInlineEnd:r,fontSize:u,lineHeight:0},[`${e}-message`]:{display:"block",marginBottom:n,color:m,fontSize:d},[`${e}-description`]:{display:"block"}},[`${e}-banner`]:{marginBottom:0,border:"0 !important",borderRadius:0}}},re=o=>{const{componentCls:e,colorSuccess:t,colorSuccessBorder:n,colorSuccessBg:r,colorWarning:a,colorWarningBorder:d,colorWarningBg:l,colorError:p,colorErrorBorder:c,colorErrorBg:u,colorInfo:m,colorInfoBorder:b,colorInfoBg:f}=o;return{[e]:{"&-success":S(r,n,t,o,e),"&-info":S(f,b,m,o,e),"&-warning":S(l,d,a,o,e),"&-error":Object.assign(Object.assign({},S(u,c,p,o,e)),{[`${e}-description > pre`]:{margin:0,padding:0}})}}},se=o=>{const{componentCls:e,iconCls:t,motionDurationMid:n,marginXS:r,fontSizeIcon:a,colorIcon:d,colorIconHover:l}=o;return{[e]:{"&-action":{marginInlineStart:r},[`${e}-close-icon`]:{marginInlineStart:r,padding:0,overflow:"hidden",fontSize:a,lineHeight:`${a}px`,backgroundColor:"transparent",border:"none",outline:"none",cursor:"pointer",[`${t}-close`]:{color:d,transition:`color ${n}`,"&:hover":{color:l}}},"&-close-text":{color:d,transition:`color ${n}`,"&:hover":{color:l}}}}},ae=o=>[te(o),re(o),se(o)],ie=F("Alert",o=>{const{fontSizeHeading3:e}=o,t=G(o,{alertIconSizeLG:e,alertPaddingHorizontal:12});return[ae(t)]});var le=globalThis&&globalThis.__rest||function(o,e){var t={};for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&e.indexOf(n)<0&&(t[n]=o[n]);if(o!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,n=Object.getOwnPropertySymbols(o);r<n.length;r++)e.indexOf(n[r])<0&&Object.prototype.propertyIsEnumerable.call(o,n[r])&&(t[n[r]]=o[n[r]]);return t};const ce={success:J,info:K,error:U,warning:ee},de=o=>{const{icon:e,prefixCls:t,type:n}=o,r=ce[n]||null;return e?Z(e,s.createElement("span",{className:`${t}-icon`},e),()=>({className:x(`${t}-icon`,{[e.props.className]:e.props.className})})):s.createElement(r,{className:`${t}-icon`})},pe=o=>{const{isClosable:e,closeText:t,prefixCls:n,closeIcon:r,handleClose:a}=o;return e?s.createElement("button",{type:"button",onClick:a,className:`${n}-close-icon`,tabIndex:0},t?s.createElement("span",{className:`${n}-close-text`},t):r):null},O=o=>{var{description:e,prefixCls:t,message:n,banner:r,className:a="",style:d,onMouseEnter:l,onMouseLeave:p,onClick:c,afterClose:u,showIcon:m,closable:b,closeText:f,closeIcon:h=s.createElement(q,null),action:y}=o,C=le(o,["description","prefixCls","message","banner","className","style","onMouseEnter","onMouseLeave","onClick","afterClose","showIcon","closable","closeText","closeIcon","action"]);const[E,w]=s.useState(!1),N=s.useRef(),{getPrefixCls:B,direction:z}=s.useContext(Q),i=B("alert",t),[T,H]=ie(i),M=g=>{var $;w(!0),($=C.onClose)===null||$===void 0||$.call(C,g)},j=()=>{const{type:g}=C;return g!==void 0?g:r?"warning":"info"},k=f?!0:b,v=j(),I=r&&m===void 0?!0:m,A=x(i,`${i}-${v}`,{[`${i}-with-description`]:!!e,[`${i}-no-icon`]:!I,[`${i}-banner`]:!!r,[`${i}-rtl`]:z==="rtl"},a,H),L=V(C);return T(s.createElement(Y,{visible:!E,motionName:`${i}-motion`,motionAppear:!1,motionEnter:!1,onLeaveStart:g=>({maxHeight:g.offsetHeight}),onLeaveEnd:u},g=>{let{className:$,style:P}=g;return s.createElement("div",Object.assign({ref:N,"data-show":!E,className:x(A,$),style:Object.assign(Object.assign({},d),P),onMouseEnter:l,onMouseLeave:p,onClick:c,role:"alert"},L),I?s.createElement(de,{description:e,icon:C.icon,prefixCls:i,type:v}):null,s.createElement("div",{className:`${i}-content`},n?s.createElement("div",{className:`${i}-message`},n):null,e?s.createElement("div",{className:`${i}-description`},e):null),y?s.createElement("div",{className:`${i}-action`},y):null,s.createElement(pe,{isClosable:!!k,closeText:f,prefixCls:i,closeIcon:h,handleClose:M}))}))};O.ErrorBoundary=ne;const me=O;export{me as A};
