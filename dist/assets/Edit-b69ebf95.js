import{i as B,r as i,k as G,u as K,aD as N,j as o,l as Q,h,p as U,am as y,aB as q}from"./index-4b3d7bc8.js";import{E as z}from"./EstimateForm-74a2693a.js";import{u as H}from"./usePermissions-36032956.js";import{A as J}from"./AccessDenied-45b92511.js";import"./AddressModal-12b3ae58.js";import"./CustomerTab-c6c321f7.js";import"./useListing-af775608.js";import"./useDelayUnmount-cb77ae7b.js";import"./index-b8658cbe.js";import"./progress-e3fed29d.js";import"./ImageUploader-b2d6894b.js";import"./Create-76ba1395.js";import"./ContactDetailModal-bc8d3392.js";import"./DetailPage-c0159ae7.js";import"./capitalize-cfd5966b.js";import"./Table-9972bb2a.js";import"./Processing-a1197381.js";import"./PaginateSelect-b668bdaf.js";import"./ItemTable-c0313657.js";import"./react-beautiful-dnd.esm-fdc0d50f.js";import"./Create-8edeb959.js";import"./ItemForm-ceb885e2.js";import"./ImageCrop-db92a92e.js";import"./index-d9b76a87.js";import"./Create-93e4462e.js";import"./calculation-671db1b1.js";import"./itemDetailModal-4a763e01.js";import"./DetailPage-51a1d58a.js";const{ESTIMATES:g}=Q,St=()=>{const E=B(),[I,f]=i.useState(0),[b]=G(),s=b.get("id"),{checkPermission:x}=H(),{callAxios:j,toggle:r,bool:A}=K(),{data:S=[]}=N(""),[m,T]=i.useState([]),[l,w]=i.useState(""),{has_EstimatesEdit_permission:P}=x("EstimatesEdit"),[k,u]=i.useState(),C=i.useCallback(t=>f(t),[]),L=i.useCallback(t=>T(t),[]),W=i.useCallback(t=>w(t),[]),$=i.useCallback(t=>u(t),[]),D=({values:t})=>{var n,a,p,d,c,_;const F={name:((n=t==null?void 0:t.payment_terms)==null?void 0:n.payment_term_name)??((a=t==null?void 0:t.payment_terms)==null?void 0:a.name),value:((p=t==null?void 0:t.payment_terms)==null?void 0:p.payment_term_value)??((d=t==null?void 0:t.payment_terms)==null?void 0:d.value)};if(!m.length)h({message:U.select_item,type:"error"});else{const M=m.filter(e=>e.id!==null).map(e=>({...e,item_obj:null,warehouseId:e.warehouse_id})),R={...t,total:I,items:M,adjustment:t.adjustment||0,shipping_charge:t.shipping_charge||0,discount_transaction_level:0,warehouse_id:l||k,sent:(t==null?void 0:t.saveAs)==="sent"||t.saveAs==="email",estimate_date:y(t.estimate_date),expiry_date:y(t.expiry_date),billing_address_id:(c=t==null?void 0:t.billing_address_id)==null?void 0:c.id,customer_id:typeof t.customer_id=="object"?(_=t.customer_id)==null?void 0:_.id:t.customer_id,payment_terms:typeof t.payment_terms!="object"?S.find(e=>e.id===t.payment_terms)||{}:F,discount_level:t==null?void 0:t.discount_level};r(),j({method:"put",url:`${g}/${s}`,data:R}).then(e=>{r(),e&&(t.saveAs==="email"&&q("email",!0),h({message:e.message}),E(-1))})}};return o.jsx(o.Fragment,{children:P?o.jsx(z,{item:m,loading:A,onSubmit:D,handleTotal:C,handleItemList:L,handleWarehouseId:W,url:`${g}/${s}/edit`,handlePrimaryWarehouse:$}):o.jsx(J,{})})};export{St as default};
