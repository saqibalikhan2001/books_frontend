import{i as A,k as E,r as n,u as $,j as o,l as D,h as N}from"./index-4b3d7bc8.js";import{C as k}from"./CustomerTab-c6c321f7.js";import{u as J}from"./usePermissions-36032956.js";import{A as L}from"./AccessDenied-45b92511.js";import"./useListing-af775608.js";import"./useDelayUnmount-cb77ae7b.js";import"./index-b8658cbe.js";import"./progress-e3fed29d.js";import"./ImageUploader-b2d6894b.js";const{CUSTOMERS:l}=D,w=()=>{const u=A(),[h]=E(),r=h.get("id"),[g,_]=n.useState([]),{checkPermission:f}=J(),{callAxios:x,toggle:S,bool:C}=$(),[c,m]=n.useState([]),[a,y]=n.useState([]),{has_ContactEdit_permission:b}=f("ContactEdit"),O=n.useCallback(s=>{m(s)},[]),j=s=>{const p=[];c.forEach(t=>{t.old_image||p.push(t.originFileObj)});let e=new FormData;const d={...s,currency_id:"",isContactImageDeleted:!1};for(const t in d)e.append(t,d[t]||"");e.append("contact_type_id","2"),e.append("currency_id",g),e.append("tax_exempt",JSON.stringify(!!s.tax_exempt)),e.append("same_as_billing",JSON.stringify(s.same_as_billing)),e.append("isContactImageDeleted",JSON.stringify(!s.photo)),a.length>0&&e.append("is_attachment_deleted",JSON.stringify(a.length>0));for(let[t,i]of Object.entries(p))e.append(`attachments[${t}]`,i);for(let[t,i]of Object.entries(a))e.append(`deleted_attachments[${t}]`,i);S(),x({method:"post",url:`${l}/${r}`,data:e}).then(t=>{t&&(N({message:t.message}),u(-1))})};return o.jsx(o.Fragment,{children:b?o.jsx(k,{edit:!0,loading:C,onSubmit:j,attachList:c,setCurrency:_,setAttachList:m,deleteAttachments:a,setDeleteAttachments:y,url:`${l}/${r}/edit`,handleImageAttachList:O}):o.jsx(L,{})})};export{w as default};
