import{i as p,r as o,u as x,j as a,P as C,o as k,l as h,am as E,h as j,ci as i}from"./index-4b3d7bc8.js";import{P as S}from"./PackageForm-ed679579.js";import{u as f}from"./usePermissions-36032956.js";import{A as _}from"./AccessDenied-45b92511.js";const{PACKAGES:K}=k,{PACKAGES:F,PACKAGE_CREATE:G}=h,R=()=>{const n=p(),{checkPermission:c}=f(),[m,r]=o.useState([]),{callAxios:g,toggle:d,bool:l}=x(),{has_PackageCreate_permission:u}=c("PackageCreate"),A=o.useCallback(s=>r(s),[]),P=s=>{d(),g({method:"post",url:F,data:{...s,items:m,package_date:E(s.package_date)}}).then(e=>{var t;e&&(j({message:e.message}),i("once",!0),i("id",(t=e==null?void 0:e.data)==null?void 0:t.id),n(-1))})};return a.jsx(a.Fragment,{children:u?a.jsxs(a.Fragment,{children:[a.jsx(C,{title:"Create Package",navigateTo:K}),a.jsx(S,{loading:l,onSubmit:P,url:G,handleItemsList:A})]}):a.jsx(_,{})})};export{R as CreatePackage,R as default};
