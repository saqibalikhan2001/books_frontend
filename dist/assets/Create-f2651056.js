import{i as B,r as i,u as I,aD as T,j as s,P as E,o as S,l as y,h as m,p as D,am as l,z as F}from"./index-4b3d7bc8.js";import{R as N}from"./Form-e90ab2db.js";import{u as P}from"./usePermissions-36032956.js";import{A as k}from"./AccessDenied-45b92511.js";import"./RepeatModal-0fdc96f9.js";import"./PaginateSelect-b668bdaf.js";import"./ItemTable-c0313657.js";import"./react-beautiful-dnd.esm-fdc0d50f.js";import"./Create-8edeb959.js";import"./ItemForm-ceb885e2.js";import"./ImageCrop-db92a92e.js";import"./ImageUploader-b2d6894b.js";import"./progress-e3fed29d.js";import"./index-d9b76a87.js";import"./index-b8658cbe.js";import"./Create-93e4462e.js";import"./calculation-671db1b1.js";import"./itemDetailModal-4a763e01.js";import"./DetailPage-51a1d58a.js";import"./capitalize-cfd5966b.js";import"./Processing-a1197381.js";const{RECURRING_BILLS:G}=S,{RECURRING_BILL:c,CREATE:w}=y,it=()=>{const p=B(),[d,u]=i.useState(0),{checkPermission:g}=P(),{callAxios:_,bool:R,toggle:f}=I(),[r,b]=i.useState(),{has_RecurringBillsCreate_permission:j}=g("RecurringBillsCreate"),{data:x=[]}=T(""),C=i.useCallback(t=>u(t),[]),h=i.useCallback(t=>b(t),[]),L=t=>{let a;if(typeof t.repeat_duration=="string"){const o=t.repeat_duration.split(" ");a=o[0]+" "+o[1].split("(s)")[0].toLowerCase()}const A=a||t.repeat_duration.value;if(!(r!=null&&r.length))m({message:D.select_item,type:"error"});else{const o={...t,repeat_duration:A,bill_terms:typeof t.bill_terms!="object"?x.find(e=>e.id===t.bill_terms)||{}:t.bill_terms,start_date:l(t.start_date),end_date:l(t.end_date),items:r,total:d,discount_transaction_level:0,adjustment:t.adjustment||0};f(),_({method:"post",url:c,data:o}).then(e=>{var n;e&&(m({message:e.message}),F((n=e==null?void 0:e.data)==null?void 0:n.id,!0,"recurringbills"),p(-1))})}};return s.jsx(s.Fragment,{children:j?s.jsxs(s.Fragment,{children:[s.jsx(E,{title:"Create Recurring Bill",navigateTo:G}),s.jsx(N,{create:!0,loading:R,onSubmit:L,handleTotal:C,handleItemList:h,url:`${c}${w}`})]}):s.jsx(k,{})})};export{it as default};
