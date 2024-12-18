import{i as Z,u as ee,G as se,r as n,O as G,v as te,U as be,l as m,h as M,j as s,b3 as ye,a3 as Ee,H as T,y as Se,J as Ne,aa as ae,a0 as W,a1 as ve,b4 as Te,V as ke,W as Ce,aq as we,ar as De,as as Y,at as q,au as Ie,an as Q,aw as Ae,ax as Oe,av as Me,T as Pe,o as $,P as $e,n as ne,p as Fe,I as ze,ay as Re,cf as Le,cg as He,$ as Be,a4 as X,z as Ke}from"./index-4b3d7bc8.js";import{u as Ve}from"./usePermissions-36032956.js";import{c as oe}from"./capitalize-cfd5966b.js";import{P as Je}from"./Processing-a1197381.js";import{A as Ue}from"./ActionMenu-149e95aa.js";import{u as Ge}from"./useSearchParam-ebfda256.js";import{u as We}from"./useDetailPageProps-fa80b790.js";import{u as Ye}from"./usePersistItemDetail-b111bdde.js";import{A as qe}from"./index-9f4b88aa.js";const{Title:Qe}=Pe,{ESTIMATES_ClONE:Xe,EDIT_ESTIMATE:Ze}=$,es=({data:_,detail:c,refetch:i,setparam:x,setFalse:d,handleConfirm:g})=>{var B,K,V,J,U;const u=Z(),{callAxios:l}=ee(),{bool:E,setTrue:a}=se(),[S,j]=n.useState(!1),[k,o]=n.useState("1"),[y,C]=n.useState(!1),[b,w]=n.useState(!1),{checkPermission:D}=Ve(),r=JSON.parse(G("obj")),[O,N]=n.useState([]),h=JSON.parse(G("email")),[ie,re]=n.useState(!1),{checkModulePermission:ce}=te(),{created_by_platform:le,org_date_format:F}=be(),[me,de]=n.useState(!1),[e,ue]=n.useState(),I=ce("sales-order"),{has_SalesOrderCreate_permission:A}=D("SalesOrderCreate"),{has_EstimatesDelete_permission:v}=D("EstimatesDelete"),z=()=>j(!S),_e=()=>de(!me),he=()=>re(!ie);n.useEffect(()=>{((c==null?void 0:c.id)??(r==null?void 0:r.curr_id))&&(C(!0),l({url:`${m.ESTIMATES}/${(c==null?void 0:c.id)??(r==null?void 0:r.curr_id)}`}).then(t=>{ue(t),N(t==null?void 0:t.attachments),d==null||d(!1),C(!1)}))},[r==null?void 0:r.curr_id,c==null?void 0:c.id,E]),n.useEffect(()=>{j(!!h)},[h]);const R=n.useCallback(()=>l({url:`${m.ESTIMATE}/${e==null?void 0:e.id}${m.SALES_ORDERS}`,method:"post",data:e}).then(t=>{t&&(M({message:t.message}),i==null||i(),a())}),[e,i,a]),L=n.useCallback(()=>l({url:`${m.ESTIMATES}/${e==null?void 0:e.id}${m.ESTIMATE_SENT}`,method:"put"}).then(t=>{t&&(M({message:t.message}),i==null||i(),a())}),[e,i,a]),H=t=>{if(o("2"),t.target.files!==void 0){w(!0);const f=new FormData;f.append("subjectId",e==null?void 0:e.id),f.append("name",e==null?void 0:e.estimate_no),f.append("files[0]",t.target.files[0]),l({url:m.ESTIMATE_ATTACHMENT,method:"post",data:f}).then(p=>{w(!1),M({message:p==null?void 0:p.message}),N([...O,p==null?void 0:p.data[0]]),a()})}},pe=()=>{l({url:`${m.ESTIMATES}/${e==null?void 0:e.id}/pdf`}).then(t=>{console.log(t)})},xe=()=>{l({url:`${m.ESTIMATES}/${e==null?void 0:e.id}/pdf?download=true`}).then(t=>{var p;const f=document.createElement("a");f.href=t,f.download=`${(p=e==null?void 0:e.contact)==null?void 0:p.display_name} Statement.pdf`,f.click()})},ge=n.useMemo(()=>[{key:"1",label:"Details",children:s.jsx(s.Fragment,{children:e&&Object.keys(e).length>0&&s.jsx(s.Fragment,{})})},{key:"2",label:"Attachments",children:s.jsx(s.Fragment,{children:e&&Object.keys(e).length>0&&s.jsx(s.Fragment,{})})},{key:"3",label:"History",children:s.jsx(s.Fragment,{children:e&&Object.keys(e).length>0&&s.jsx(s.Fragment,{})})}],[e,b]),je=n.useMemo(()=>[{key:"0",onClick:R,label:"Convert to SO",icon:s.jsx(ye,{size:18}),disabled:(e==null?void 0:e.status)!=="accepted"||!(!I&&A)}],[R,e==null?void 0:e.status,A,I]),fe=n.useMemo(()=>[{key:"0",label:"Duplicate",onClick:()=>u(`${Xe}?id=${e==null?void 0:e.id}`)},{key:"1",label:"Mark as sent",onClick:L,disabled:(e==null?void 0:e.status)!=="draft"||!(!I&&A)},{key:"2",label:s.jsx(Ee,{placement:"left",disabled:!((e==null?void 0:e.platform_type)==="books"&&v)||(e==null?void 0:e.status)!=="draft",title:`Are you sure you want to delete "${e==null?void 0:e.estimate_no}"?`,okText:(e==null?void 0:e.platform_type)==="books"&&v?"YES":"OK",cancelText:"No",showCancel:(e==null?void 0:e.platform_type)==="books"&&v,onCancel:t=>t==null?void 0:t.stopPropagation(),onConfirm:t=>{t==null||t.stopPropagation(),(e==null?void 0:e.platform_type)==="books"&&g(e,"/estimates",i,_,"/estimates",x)},children:s.jsx(T,{title:"Delete",children:s.jsx("label",{style:{cursor:(e==null?void 0:e.platform_type)==="books"&&v||(e==null?void 0:e.status)==="draft"?"pointer":"not-allowed",width:"100%",display:"block"},onClick:t=>t==null?void 0:t.stopPropagation(),children:"Delete"})})},"confirm"),disabled:(e==null?void 0:e.status)!=="draft"}],[_,i,e,u,L,x,g,v,A,I]);return s.jsx(s.Fragment,{children:y?s.jsx(Se,{}):s.jsx(s.Fragment,{children:s.jsx("div",{style:{animation:"fadeInRight",animationDuration:"0.5s"},children:s.jsx("div",{style:{opacity:b?.5:1,pointerEvents:b?"none":"auto"},children:s.jsx(Ne,{className:" __items_details_header __estimate_detials_header",title:e==null?void 0:e.estimate_no,subTitle:s.jsx(ae,{className:`generic-bagde ${(e==null?void 0:e.status)&&(e==null?void 0:e.status)}`,children:oe(e==null?void 0:e.status)}),extra:[s.jsx(s.Fragment,{children:!S&&s.jsxs("div",{className:"__items_details_actions d-flex",children:[s.jsx(W.Button,{menu:{items:fe},trigger:["click"],icon:s.jsx(ve,{}),className:"mr-10 btn-edit",children:s.jsx("div",{style:{cursor:(e==null?void 0:e.status)==="draft"?"pointer":"not-allowed",width:"100%"},onClick:()=>(e==null?void 0:e.status)==="draft"?u(`${Ze}?id=${e==null?void 0:e.id}`):null,children:"Edit"})}),s.jsx("div",{className:"d-flex align-center __convert_invoice_btn",children:s.jsx(W.Button,{type:"primary",disabled:(e==null?void 0:e.status)!=="accepted",onClick:he,menu:{items:je},className:"__header_dropdown",trigger:["click"],icon:s.jsx(Te,{size:10,className:"icon-radius estimates-icon"}),children:"Convert to invoice"})})]})})],footer:s.jsx(s.Fragment,{children:S?s.jsx(Me,{setEmail:j,handleEmail:z,emailUrl:`${m.ESTIMATES}/${(e==null?void 0:e.id)??(r==null?void 0:r.curr_id)}/mail`}):s.jsxs("div",{className:"__estimate_content_side",children:[s.jsxs("div",{className:"_estimate_detial_page",children:[s.jsxs("div",{className:"d-flex mb-30",children:[s.jsx("div",{className:"__customer_image",children:s.jsx(ke,{className:"customer-dp",preview:!1,src:(B=e==null?void 0:e.contact)!=null&&B.photo?Ce((K=e==null?void 0:e.contact)==null?void 0:K.photo,le):"https://s3-us-west-2.amazonaws.com/ims-development/media/default-user-image-placeholder.svg",placeholder:s.jsx(we,{style:{width:34,height:34}})})}),s.jsxs("div",{className:"__estimate_detials",children:[s.jsxs("div",{className:"account_receipt d-flex __estimate_receipt",children:[s.jsx(T,{placement:"bottom",title:"PDF",children:s.jsx("img",{className:"mr-10",src:"https://s3-us-west-2.amazonaws.com/ims-development/static/media/PDF.svg",alt:"",onClick:xe})}),s.jsx(T,{placement:"bottom",title:"Print",children:s.jsx("img",{className:"mr-10",src:"https://s3-us-west-2.amazonaws.com/ims-development/static/media/Print.svg",alt:"",onClick:pe})})," ",s.jsx(T,{placement:"bottom",title:"Email",children:s.jsx("img",{className:"mr-5",src:"https://ims-development.s3.us-west-2.amazonaws.com/static/media/email.svg",alt:"",onClick:z})}),s.jsxs("label",{htmlFor:"myattachements",className:"",children:[s.jsx(T,{placement:"bottom",title:"Attachment",children:s.jsx(De,{size:"25px",onClick:H})}),s.jsx("input",{type:"file",name:"myfile",id:"myattachements",onChange:H,style:{display:"none"}})]})]}),s.jsxs("div",{className:"mb-15 __customer_info",children:[s.jsx("span",{className:"fw-md",children:"Reference number: "}),s.jsx("span",{className:"ref_title",children:e==null?void 0:e.reference})]}),s.jsxs("div",{className:"mb-15 __customer_info estimates_names estimates_reference",children:[s.jsx(Y,{size:"18px"}),s.jsx("span",{onClick:_e,className:"_display_name estimates-name cursor",children:e==null?void 0:e.display_name})]}),s.jsxs("div",{className:"mb-15 __customer_info",children:[s.jsx(q,{size:"18px"}),s.jsx("span",{children:(V=e==null?void 0:e.contact)==null?void 0:V.company_name})]})]})]}),s.jsxs("div",{className:"product-details",children:[s.jsx("div",{className:"mb-20",children:s.jsx(Qe,{level:4,children:"Bill to"})}),s.jsxs("div",{className:"d-flex justify_between",children:[s.jsxs("div",{className:"__estimate_details_left ",children:[s.jsxs("div",{className:"mb-15 __customer_info estimates_names",children:[s.jsx(Y,{size:"18px"}),s.jsx("span",{className:"_display_name estimates-name",children:e==null?void 0:e.display_name})]}),s.jsxs("div",{className:"mb-15 __customer_info",children:[s.jsx(q,{size:"18px"}),s.jsx("span",{children:(J=e==null?void 0:e.contact)==null?void 0:J.company_name})]}),s.jsxs("div",{className:"mb-15 __customer_info",children:[s.jsx(Ie,{size:"18px"}),s.jsx("span",{children:(U=e==null?void 0:e.billing_address)==null?void 0:U.country_name})]})]}),s.jsxs("div",{className:"__estimate_details_right ",children:[s.jsxs("div",{className:"__customer_info mb-10",children:[s.jsx("span",{className:"fw-md w-102 mr-10",children:"Issue date:"})," ",s.jsx("span",{children:Q(e==null?void 0:e.estimate_date,F)})]}),s.jsxs("div",{className:"__customer_info mb-10",children:[s.jsx("span",{className:"fw-md w-102  mr-10",children:"Expiry date:"}),s.jsx("span",{children:Q(e==null?void 0:e.expiry_date,F)})]}),s.jsxs("div",{className:"__customer_info mb-10",children:[s.jsx("span",{className:"fw-md w-102  mr-10",children:"Payment terms:"}),s.jsx("span",{children:e==null?void 0:e.payment_term_name})]})]})]})]}),b&&s.jsx(Je,{})]}),s.jsx("div",{className:"bg-white",children:s.jsx(Ae,{items:ge,onChange:Oe,defaultActiveKey:k,className:"__items-details_container __estimate_tab_container"})})]})})})})})})})},{VscAdd:ss}=ze,{NEW_CREDIT_NOTE:ts}=ne,{all_credit_notes:as}=Fe,{ADD_CREDIT_NOTE:ns}=$,os=[{key:"filters",type:"group",label:"DEFAULT FILTERS",children:[]},{type:"divider"},{key:"10",label:"New Custom View",icon:s.jsx(ss,{})}],is=({enable:_})=>(console.log(_),s.jsx(s.Fragment,{children:s.jsx($e.SubHeader,{items:os,title:as,btnText:ts,navigateTo:ns})})),{CREDIT_NOTES:rs}=m,{NAME:P,SYMBOL:cs,CODE:ls,DELETE:ms,_SALES_ORDERS:ds}=ne,us=({loading:_,refetch:c,listing:i,handleClick:x,showDetail:d,handleConfirm:g,bulkDeleteTrue:u,handleViewClick:l})=>{const E=n.useMemo(()=>[{title:"Date",dataIndex:"order_date",key:P,width:80,ellipsis:!0,render:a=>Re(a)},{title:"Credit note number",dataIndex:"Credit_note_number",key:cs,width:130,ellipsis:!0},{title:"Customer",dataIndex:"customer",key:ls,width:d?0:100,ellipsis:!0},{title:"Amount",dataIndex:"amount",key:P,ellipsis:!0,width:d?0:200},{title:"Status",dataIndex:"status",key:P,ellipsis:!0,width:d?0:70,render:a=>s.jsx(ae,{autoCapitalize:"",color:a==="draft"?"red":"green",children:oe(a)},a)},{title:"",dataIndex:"",width:30,key:"x",align:"center",render:a=>s.jsx(Ue,{data:a,handleClick:x,handleConfirm:g,canEdit:a.platform_type==="books",deletePermission:a.platform_type==="books",title:a.platform_type==="books"?`${ms} "${a.sales_order_no}" ${ds} ?`:"Permission Denied"})}],[x,g,d]);return s.jsx(s.Fragment,{children:s.jsx(Le,{loading:_,refetch:c,listing:i,url:rs,columns:E,bulkDeleteTrue:u,handleViewClick:l})})},{SALES_ORDERS:_s}=m,{EDIT_SALES_ORDER:hs}=$,Ns=()=>{var N;const _=Z(),{getParams:c}=Ge(""),{bool:i,handleConfirm:x}=ee(),{getCurrentModule:d}=te(),{status:g=void 0}=d("sales-order")||{},{bool:u,setTrue:l,setFalse:E}=se(),{memoizeHandleClick:a,detail:S,fullScreen:j,handleFullScreen:k}=We(),{data:o,refetch:y,isLoading:C,isFetching:b}=He(c(),{refetchOnMountOrArgChange:!0}),{handleSessionState:w}=Ye(k,E,u);console.log("data",o),n.useEffect(()=>{!b&&u&&w(o==null?void 0:o.salesOrders,"salesorders")},[b,u,o==null?void 0:o.salesOrders]);const D=h=>{Ke(h==null?void 0:h.id,!0,"salesOrder"),_(`${hs}?id=${h.id}`)},r=n.useCallback(D,[_]),O=n.useCallback(h=>x(h,_s,y,l),[x,y,l]);return s.jsx(s.Fragment,{children:s.jsxs(s.Fragment,{children:[!g&&s.jsx(qe,{showIcon:!0,type:"info",message:"Module Permissions",description:"Please Enable Module Permissions To See Details"}),s.jsx(is,{enable:!g}),s.jsxs(Be,{children:[s.jsx(X,{span:j?10:24,children:(o==null?void 0:o.salesOrders)&&s.jsx(us,{refetch:y,showDetail:j,listing:o.salesOrders,handleClick:r,bulkDeleteTrue:l,loading:i||C,handleConfirm:O,handleViewClick:a})}),j&&s.jsx(s.Fragment,{children:s.jsx(X,{span:14,children:(o==null?void 0:o.salesOrders)&&s.jsx(es,{detail:S,refetchSO:y,deleteItem:u,handleFullScreen:k,dataLength:(N=o.salesOrders.data)==null?void 0:N.length})})})]})]})})};export{Ns as default};
