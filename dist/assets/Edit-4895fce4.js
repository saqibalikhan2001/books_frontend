import{i as x,k as g,u as h,j as o,l as E,h as f}from"./index-4b3d7bc8.js";import{k as S}from"./calculation-671db1b1.js";import{E as d}from"./ExpenseForm-c21cee50.js";import"./index-76e73ee7.js";import"./index-b8658cbe.js";import"./progress-e3fed29d.js";const{EXPENSES:n}=E,k=()=>{const r=x(),[m]=g(),t=m.get("id"),{callAxios:l,toggle:a,bool:p}=h(),u=e=>{let s;return e.itemize?s={...e,total_amount:(e==null?void 0:e.itemize)&&S(e==null?void 0:e.expense_details)}:s={...e},s},c=e=>{const s=u(e);a(),l({method:"put",url:`${n}/${t}`,data:s}).then(i=>{i&&(f({message:i.message}),r(-1))})};return o.jsx(o.Fragment,{children:o.jsx(d,{loading:p,url:`${n}/${t}/edit`,onSubmit:c})})};export{k as default};