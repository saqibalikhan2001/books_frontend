import{i as B,r as o,k as G,u as K,aD as N,j as s,l as Q,h as _,p as U,am as h,aB as q}from"./index-4b3d7bc8.js";import{E as z}from"./EstimateForm-74a2693a.js";import{u as H}from"./usePermissions-36032956.js";import{A as J}from"./AccessDenied-45b92511.js";import"./AddressModal-12b3ae58.js";import"./CustomerTab-c6c321f7.js";import"./useListing-af775608.js";import"./useDelayUnmount-cb77ae7b.js";import"./index-b8658cbe.js";import"./progress-e3fed29d.js";import"./ImageUploader-b2d6894b.js";import"./Create-76ba1395.js";import"./ContactDetailModal-bc8d3392.js";import"./DetailPage-c0159ae7.js";import"./capitalize-cfd5966b.js";import"./Table-9972bb2a.js";import"./Processing-a1197381.js";import"./PaginateSelect-b668bdaf.js";import"./ItemTable-c0313657.js";import"./react-beautiful-dnd.esm-fdc0d50f.js";import"./Create-8edeb959.js";import"./ItemForm-ceb885e2.js";import"./ImageCrop-db92a92e.js";import"./index-d9b76a87.js";import"./Create-93e4462e.js";import"./calculation-671db1b1.js";import"./itemDetailModal-4a763e01.js";import"./DetailPage-51a1d58a.js";const{ESTIMATES:y}=Q,At=()=>{const g=B(),[l,I]=o.useState(0),[f]=G(),b=f.get("id"),{checkPermission:x}=H(),{callAxios:E,toggle:m,bool:j}=K(),{data:A=[]}=N(""),[r,S]=o.useState([]),[T,u]=o.useState(""),{has_EstimatesCreate_permission:w}=x("EstimatesCreate"),[C,P]=o.useState(),k=o.useCallback(t=>I(t),[]),L=o.useCallback(t=>S(t),[]),W=o.useCallback(t=>u(t),[]),D=o.useCallback(t=>P(t),[]),F=({values:t})=>{var i,n,a,p,c,d;const M={name:((i=t==null?void 0:t.payment_terms)==null?void 0:i.payment_term_name)??((n=t==null?void 0:t.payment_terms)==null?void 0:n.name),value:((a=t==null?void 0:t.payment_terms)==null?void 0:a.payment_term_value)??((p=t==null?void 0:t.payment_terms)==null?void 0:p.value)};if(!r.length)_({message:U.select_item,type:"error"});else{const R=r.filter(e=>e.id!==null).map(e=>({...e,item_obj:null,warehouseId:e.warehouse_id})),$={...t,total:l,items:R,clone_status:1,adjustment:t.adjustment||0,shipping_charge:t.shipping_charge||0,discount_transaction_level:0,warehouse_id:T||C,sent:(t==null?void 0:t.saveAs)==="sent"||t.saveAs==="email",estimate_date:h(t.estimate_date),expiry_date:h(t.expiry_date),billing_address_id:(c=t==null?void 0:t.billing_address_id)==null?void 0:c.id,customer_id:typeof t.customer_id=="object"?(d=t.customer_id)==null?void 0:d.id:t.customer_id,payment_terms:typeof t.payment_terms!="object"?A.find(e=>e.id===t.payment_terms)||{}:M};m(),E({method:"post",url:y,data:$}).then(e=>{m(),e&&(t.saveAs==="email"&&q("email",!0),_({message:e.message}),g(-1))})}};return s.jsx(s.Fragment,{children:w?s.jsx(z,{item:r,loading:j,onSubmit:F,handleTotal:k,handleItemList:L,handleWarehouseId:W,url:`${y}/${b}/clone`,handlePrimaryWarehouse:D}):s.jsx(J,{})})};export{At as default};