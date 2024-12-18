import{F as n,u as N,j as l,M as g,ak as F,bU as v,B as d,I as z,l as I,U as T,r as y,y as C}from"./index-4b3d7bc8.js";import{B as E}from"./CustomerTab-c6c321f7.js";const{INVOICE_TERMS:M}=I,{BsPlus:V,MdOutlineRemoveCircleOutline:A}=z,S=({visible:r,org_terms:_,refetch:f,toggle:o,estimate_form:c,invoice_form:m})=>{const[u]=n.useForm(),{callAxios:x,bool:b,toggle:p}=N(),a=t=>{p(),x({method:"put",url:M,data:t}).then(i=>{var s;if(i){const e=(s=t==null?void 0:t.invoice_terms)==null?void 0:s.at(-1);o(),f(),c==null||c.setFieldsValue({payment_terms:e?{id:e==null?void 0:e.value,label:e==null?void 0:e.name,payment_term_value:e==null?void 0:e.value,payment_term_name:e==null?void 0:e.name}:null}),m==null||m.setFieldsValue({invoice_terms:e?{id:e==null?void 0:e.value,label:e==null?void 0:e.name,invoice_term_value:e==null?void 0:e.value,invoice_term_name:e==null?void 0:e.name}:null})}})};return l.jsx(l.Fragment,{children:l.jsx(g,{footer:null,open:r,destroyOnClose:!0,onCancel:o,title:"Invoice Terms",wrapClassName:"generic_modal_style",maskClosable:!1,children:l.jsxs(n,{form:u,name:"dynamic_form_nest_item",className:"generic_modal",onFinish:a,autoComplete:"off",children:[l.jsx(n.List,{name:"invoice_terms",initialValue:_,children:(t,{add:i,remove:s})=>l.jsxs(l.Fragment,{children:[t.map(({key:e,name:h,...j})=>l.jsxs("div",{className:"flexbox align-center cusTom_InvociesModal",children:[l.jsx(n.Item,{className:"form-group flex-47 mr-5",...j,name:[h,"name"],rules:[{required:!0,message:"Name Required"}],children:l.jsx(F,{placeholder:"Enter Term Name"})}),l.jsx(n.Item,{className:"form-group flex-47",...j,name:[h,"value"],rules:[{required:!0,message:"Value Required"}],children:l.jsx(v,{controls:!1,min:1,placeholder:"Enter Value",className:"Input_Num"})}),l.jsx(A,{className:"delete_tool",size:20,onClick:()=>s(h)})]},e)),l.jsx("div",{className:"mb-0",children:l.jsx(d,{size:"middle",type:"ghost",icon:l.jsx(V,{size:25}),btnText:"Add New",clickHandler:()=>i(),className:"btn-form-size btn-primary d-flex align-center justify-center"})})]})}),l.jsxs("div",{className:"button_flexbox flex-end ",children:[l.jsx(d,{size:"middle",type:"default",btnText:"Cancel",className:"btn-form-size btn-default mr-20",htmlType:"button",clickHandler:()=>{o(),u.resetFields()}}),l.jsx(d,{className:"btn-form-size btn-primary",size:"middle",btnText:"Save",loading:b})]})]})})})},q=({url:r,loading:_,onSubmit:f,setEditBill:o,bool:c=!1,handleCancel:m,setCreateBill:u,setBillLoading:x,editBill:b=!1,createBill:p=!1})=>{const[a]=n.useForm(),{callAxios:t}=N(),{country_id:i}=T();y.useEffect(()=>{a.setFieldsValue({bill_fax:"",bill_city:"",bill_state:"",bill_phone:"",bill_street:"",bill_zip_code:"",bill_street_2:"",bill_attention:"",bill_country_id:i})},[i,p]),y.useEffect(()=>{b&&(x(!0),t({method:"get",url:r}).then(e=>{a.setFieldsValue({bill_fax:e==null?void 0:e.fax,bill_city:e==null?void 0:e.city,bill_state:e==null?void 0:e.state,bill_phone:e==null?void 0:e.phone,bill_street:e==null?void 0:e.street,bill_zip_code:e==null?void 0:e.zip_code,bill_street_2:e==null?void 0:e.street_2,bill_attention:e==null?void 0:e.attention,bill_country_id:e==null?void 0:e.country_id}),x(!1)}))},[b,r]);const s=()=>{m(),o(!1),u(!1),a.resetFields()};return l.jsx(l.Fragment,{children:_?l.jsx(C,{}):l.jsxs(n,{form:a,onFinish:f,children:[l.jsx(E,{isModal:!0}),l.jsxs("div",{className:"button_flexbox flex-end form-row-container ml-20 ",children:[l.jsx(d,{type:"default",btnText:"Cancel",htmlType:"button",clickHandler:s,className:"btn-default btn-form-size mr-20"}),l.jsx(d,{btnText:"Save",loading:c,className:"btn-primary btn-form-size"})]})]})})};export{q as A,S as I};
