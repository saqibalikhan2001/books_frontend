import{b9 as l}from"./index-4b3d7bc8.js";const p=i=>i.map(n=>["View","Create","Edit","Delete"].map(e=>`${n}${e}`)).flatMap(n=>n),u=()=>{const{role:{permissions:i={}}}=l(({authReducer:e})=>e);return{permissions:i,checkPermission:e=>{let a=Object.entries(i);var o=!1,s="";for(const[r,t]of a)if(r==="superAccess"&&t){o=t,s=e;break}else if(e===r){o=t,s=r;break}return{[`has_${s}_permission`]:o}},checkAllPermissions:e=>{let a=Object.entries(i);const o=p([e]);console.log({moduleName:e,roles:o});var s=!1;for(const[r,t]of a)if(r==="superAccess"&&t){s=t;break}return{...o.map(r=>s&&{[`has_${r}_permission`]:s})}}}};export{p as g,u};