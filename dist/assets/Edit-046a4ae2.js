import{i as N,k as R,r as s,u as W,j as p,l as B,h as d}from"./index-4b3d7bc8.js";import{I as J}from"./ItemForm-ceb885e2.js";import{u as U}from"./usePermissions-36032956.js";import{A as z}from"./AccessDenied-45b92511.js";import"./ImageCrop-db92a92e.js";import"./ImageUploader-b2d6894b.js";import"./progress-e3fed29d.js";import"./index-d9b76a87.js";import"./index-b8658cbe.js";const{ITEMS:f}=B,ee=()=>{const k=N(),[x]=R(),c=x.get("id"),{checkPermission:y}=U(),[r,b]=s.useState(!1),{callAxios:I,toggle:j,bool:S}=W(),[E,L]=s.useState(),[m,o]=s.useState([]),[_,l]=s.useState([]),{has_ItemEdit_permission:T}=y("ItemEdit"),[A,O]=s.useState([]),[i,$]=s.useState([]),w=e=>L(e),F=e=>b(e),C=s.useCallback(e=>{o(e)},[]),P=s.useCallback(e=>o(e),[]),D=s.useCallback(e=>{l(e)},[]),q=s.useCallback(e=>{O(e)},[]),M=e=>{const h=[],u=[];m.forEach(t=>{t.old_image?h.push(t.name):u.push(t)});const g=[];if(_.forEach(t=>{t.old_image||g.push(t.originFileObj)}),e.opening_stock>0&&e.opening_stock_value<=0)d({message:"Opening stock value field is required",type:"info"});else if(e.opening_stock<=0&&e.opening_stock_value>0)d({message:"Opening stock value field is required",type:"info"});else{let t=new FormData;t.append("name",e.name),t.append("sku",e.sku),t.append("upc",e.upc),t.append("mpn",e.mpn),t.append("ean",e.ean),t.append("isbn",e.isbn),t.append("unit",e.unit),t.append("brand",e.brand),t.append("weight",e.weight),t.append("notes",e.notes||""),t.append("tax_type",E||null),t.append("dimensions",e.dimensions),t.append("tax_id",e.tax_id||null),t.append("dimensions",e.dimensions),t.append("category_id",e.category_id),t.append("manufacturer",e.manufacturer),t.append("description",e.description||""),t.append("reorder_level",e.reorder_level||0),t.append("sales_account_id",e.sales_account_id),t.append("sales_unit_price",e.sales_unit_price||0),t.append("purchase_account_id",e.purchase_account_id),t.append("type",e.type==="Inventory"?"goods":""),t.append("sales_description",e.sales_description||""),t.append("purchase_unit_price",e.purchase_unit_price||0),t.append("opening_stock_value",e.opening_stock_value||0),t.append("purchase_description",e.purchase_description||""),i.length>0&&t.append("is_attachment_deleted",JSON.stringify(i.length>0)),t.append("warehouses[0][id]",A[0].id),t.append("warehouses[0][opening_stock]",e.opening_stock||0),t.append("inventory_type",r?"inventory":"noninventory");for(let[n,a]of Object.entries(u))t.append(`upload_images[${n}]`,a);for(let[n,a]of Object.entries(h))t.append(`images[${n}]`,a);for(let[n,a]of Object.entries(g))t.append(`attachments[${n}]`,a);for(let[n,a]of Object.entries(i))t.append(`deleted_attachments[${n}]`,a);j(),I({method:"post",url:`${f}/${c}`,data:t}).then(n=>{n&&(d({message:n.message}),k(-1))})}};return p.jsx(p.Fragment,{children:T?p.jsx(J,{edit:!0,loading:S,tracked:r,onSubmit:M,fileList:m,attachList:_,setFileList:o,setAttachList:l,handleTaxType:w,handleFileList:P,handleImageList:C,url:`${f}/${c}/edit`,deleteAttachments:i,setDeleteAttachments:$,handleTrackInventory:F,handleWareshouseList:q,handleImageAttachList:D}):p.jsx(z,{})})};export{ee as default};
