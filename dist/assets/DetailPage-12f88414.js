import{e as j,i as r,k as N,ai as f,j as s,a2 as p,S as b,H as t,V as _,W as v,R as d,T as g,I as y,l as k}from"./index-4b3d7bc8.js";const C=j(new Date),{Text:a,Title:l}=g,{ORGANIZATIONS:w}=k,{FiEdit:I,AiOutlineInfoCircle:T}=y,D=()=>{var o,c,m;const n=r(),[x]=N(),i=x.get("org"),{details:e}=f(`${w}/${i}`);return s.jsx(s.Fragment,{children:s.jsxs("div",{className:"main_wrapper container-1280",children:[s.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[s.jsx(p,{name:"Manage Businesses",organization:!0,organizationName:e==null?void 0:e.name}),["books"].includes(e==null?void 0:e.platform_type)&&((e==null?void 0:e.is_owner)||(e==null?void 0:e.exact_owner))&&!(e!=null&&e.is_default)&&s.jsxs("div",{className:"d-flex align-center",style:{color:"blue",cursor:"pointer"},onClick:()=>n(`/organization-profile?org=${i}`),children:[s.jsx(I,{className:"mr-5"}),"Edit"]}),(e==null?void 0:e.platform_type)!=="books"&&((e==null?void 0:e.is_owner)||(e==null?void 0:e.exact_owner))&&!(e!=null&&e.is_default)&&s.jsx(b,{children:s.jsx(t,{title:"Go to inventory to edit this business",children:s.jsx(T,{size:18})})})]}),s.jsxs("div",{className:"_container organization-detail-page",children:[s.jsx(l,{level:4,className:"h4 company_logo",children:"Company Logo"}),s.jsx("div",{className:"form_box mbx-30",children:s.jsx(_,{preview:!1,style:{width:100,height:100},fallback:"./img/company_logo.png",onClick:h=>h.stopPropagation(),src:v(e==null?void 0:e.logo,e==null?void 0:e.created_by_platform)})}),s.jsx(l,{level:4,className:"h4 mb-25",children:"Company Name"}),s.jsx("div",{className:"form_box",children:s.jsxs("div",{className:"flexbox form-row-container justify-content-between",children:[s.jsxs("div",{className:"form_group flex-47",children:[s.jsx(l,{className:"text-col",level:5,children:"Company name"}),s.jsx(a,{className:"mb-22 d-inline-block",children:e==null?void 0:e.name})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"text-col",level:5,children:"Legal name"}),s.jsx(a,{className:"mb-22 d-inline-block",children:e==null?void 0:e.legal_name})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"text-col",level:5,children:"EIN"}),s.jsxs(a,{className:"text-col",children:[s.jsx(d,{disabled:(e==null?void 0:e.number_type)!==1,checked:(e==null?void 0:e.number_type)===1,children:"EIN"}),s.jsx(d,{disabled:(e==null?void 0:e.number_type)!==2,checked:(e==null?void 0:e.number_type)===2,children:"SNN"})]}),s.jsx(a,{className:" d-inline-block",children:e==null?void 0:e.number_value})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"text-col",level:5,children:"Licence number"}),s.jsx(a,{className:" d-inline-block",children:e==null?void 0:e.license_no})]})]})}),s.jsx(l,{level:4,className:"h4 mb-25",children:"Company Type"}),s.jsx("div",{className:"form_box",children:s.jsxs("div",{className:"flexbox form-row-container justify-content-between",children:[s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Tax form"}),s.jsx(a,{className:"d-inline-block",children:e==null?void 0:e.tax_form})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Industry"}),s.jsx(a,{className:" d-inline-block",children:(o=e==null?void 0:e.get_type)==null?void 0:o.label})]})]})}),s.jsx(l,{level:4,className:"h4 mb-25",children:"Company Info"}),s.jsx("div",{className:"form_box",children:s.jsxs("div",{className:"flexbox form-row-container justify-content-between",children:[s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Currency"}),s.jsx(a,{className:"mb-22 d-inline-block",children:(c=e==null?void 0:e.get_currency)==null?void 0:c.name})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Time Zone"}),s.jsx(a,{className:"mb-22 d-inline-block",children:e==null?void 0:e.time_zone})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Date Format"}),s.jsx(a,{className:"mb-22 d-inline-block",children:`MMM,DD YY [${C.format("MMM,DD YY")}]`})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Contact person name"}),s.jsx(a,{className:"mb-22 d-inline-block",children:e==null?void 0:e.primary_contact_name})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Company email"}),s.jsx(a,{className:"mb-22 d-inline-block",children:e==null?void 0:e.company_email})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Customer-facing email"}),s.jsx(a,{className:"mb-22 d-inline-block",children:e==null?void 0:e.primary_contact_email})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Company phone"}),s.jsx(a,{className:" d-inline-block",children:e==null?void 0:e.phone})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Company website"}),s.jsx(a,{className:" d-inline-block",children:e==null?void 0:e.company_website})]})]})}),s.jsx(l,{level:4,className:"h4 mb-25",children:"Address"}),s.jsx("div",{className:"form_box",children:s.jsxs("div",{className:"flexbox form-row-container justify-content-between",children:[s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Country"}),s.jsx(a,{className:"d-inline-block mb-22",children:(m=e==null?void 0:e.country)==null?void 0:m.country_name})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"State/Province"}),s.jsx(a,{className:"d-inline-block mb-22",children:e==null?void 0:e.company_province})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Street address 1"}),s.jsx(a,{className:"d-inline-block mb-22",children:e==null?void 0:e.company_street})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Street address 2"}),s.jsx(a,{className:"d-inline-block mb-22",children:e==null?void 0:e.company_street_2})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"City"}),s.jsx(a,{className:"d-inline-block mb-22",children:e==null?void 0:e.company_city})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"ZIP code"}),s.jsx(a,{className:"d-inline-block mb-22",children:e==null?void 0:e.company_postal_code})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Company address"}),s.jsx(a,{className:"d-inline-block mb-22",children:e==null?void 0:e.company_address})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Customer-facing address"}),s.jsx(a,{className:"d-inline-block ",children:e==null?void 0:e.customer_address})]}),s.jsxs("div",{className:"form_group flex-47 ",children:[s.jsx(l,{className:"h5",level:5,children:"Legal address"}),s.jsx(a,{className:"d-inline-block ",children:e==null?void 0:e.legal_address})]})]})})]})]})})};export{D as default};