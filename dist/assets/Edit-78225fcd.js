import{i as L,r as o,k as S,u as A,j as i,l as E,am as r,h as k}from"./index-4b3d7bc8.js";import{B as I}from"./BillForm-53909519.js";import{u as P}from"./usePermissions-36032956.js";import{A as T}from"./AccessDenied-45b92511.js";import"./PaginateSelect-b668bdaf.js";import"./ItemTable-c0313657.js";import"./react-beautiful-dnd.esm-fdc0d50f.js";import"./Create-8edeb959.js";import"./ItemForm-ceb885e2.js";import"./ImageCrop-db92a92e.js";import"./ImageUploader-b2d6894b.js";import"./progress-e3fed29d.js";import"./index-d9b76a87.js";import"./index-b8658cbe.js";import"./Create-93e4462e.js";import"./calculation-671db1b1.js";import"./itemDetailModal-4a763e01.js";import"./DetailPage-51a1d58a.js";import"./capitalize-cfd5966b.js";import"./Processing-a1197381.js";const{BILLS:m}=E,W=()=>{const n=L(),[d,l]=o.useState([]),[c,p]=o.useState(0),[u]=S(),s=u.get("id"),{checkPermission:_}=P(),{callAxios:g,toggle:h,bool:x}=A(),{has_BillEdit_permission:b}=_("BillEdit"),j=o.useCallback(t=>p(t),[]),f=o.useCallback(t=>l(t),[]),B=t=>{var e;h(),g({method:"put",url:`${m}/${s}`,data:{...t,items:d,total:c,discount_type:"",discount_transaction_level:0,adjustment:t.adjustment||0,due_date:r(t.due_date),bill_date:r(t.bill_date),vendor_id:typeof t.vendor_id=="object"?(e=t.vendor_id)==null?void 0:e.id:t.vendor_id}}).then(a=>{a&&(k({message:a.message}),n(-1))})};return i.jsx(i.Fragment,{children:b?i.jsx(I,{loading:x,onSubmit:B,handleTotal:j,handleItemList:f,url:`${m}/${s}/edit`}):i.jsx(T,{})})};export{W as default};