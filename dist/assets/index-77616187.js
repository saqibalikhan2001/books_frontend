import{F as A,r as h,j as e,M as V,n,A as _,D as b,E as K,S as p,B as k,I as f,p as $,u as R,G as T,h as z,l as N,T as y,H as w,f as W,J as X,K as J}from"./index-4b3d7bc8.js";import{A as O}from"./AccessDenied-45b92511.js";import{u as B}from"./useSearchParam-ebfda256.js";import{u as Q}from"./useListing-af775608.js";import{u as q}from"./usePermissions-36032956.js";const{GrCurrency:S,CgArrowsExchange:Z}=f,{enter_name:ee,enter_currency_code:se,enter_symbol:te}=$,ne={name:"",symbol:"",exchange_rate:"",currency_code:null},D=({bool:c,toggle:l,loading:i,current:s,onSubmit:a,currncy_list:d,has_permission:r})=>{const[o]=A.useForm();h.useEffect(()=>{s&&Object.keys(s).length&&o.setFieldsValue({...s})},[s,o]);const m=()=>o.resetFields();return e.jsx(V,{title:s!=null&&s.id?n.UPDATE_CURRENCY:n.NEW_CURRENCY,open:c,footer:null,destroyOnClose:!0,onCancel:l,style:{top:0},maskClosable:!1,afterClose:m,children:r?e.jsxs(A,{name:n.NEW_CURRENCY,initialValues:ne,form:o,layout:"vertical",onFinish:a,children:[e.jsx(_,{size:"middle",name:"name",label:n.NAME,LeftIcon:e.jsx(S,{}),disabled:!!(s!=null&&s.name),rules:b({message:ee}),placeholder:`${n.ENTER} ${n.NAME}`}),e.jsx(K,{name:"currency_code",className:"flex_root",options:d,label:n.CURRENCY_CODE,placeholder:n.CURRENCY_CODE,rules:b({message:se})}),e.jsx(_,{size:"middle",name:"symbol",label:n.SYMBOL,LeftIcon:e.jsx(S,{}),placeholder:n.SYMBOL,rules:b({message:te})}),e.jsx(_,{size:"middle",label:n.EXCHANGE_RATE,name:"exchange_rate",rules:[],LeftIcon:e.jsx(Z,{size:20}),placeholder:n.EXCHANGE_RATE}),e.jsxs(p,{className:"steps-action",children:[e.jsx(k,{type:"default",htmlType:"button",clickHandler:l,btnText:n.CANCEL}),e.jsx(k,{block:!0,loading:i,style:{width:"120px"},btnText:s!=null&&s.id?n.UPDATE:n.CREATE})]})]}):e.jsx(O,{})})},{CURRENCY:oe}=N,ae=({bool:c,toggle:l,loading:i,refetch:s,current:a,currncy_list:d,has_permission:r})=>{const{callAxios:o}=R(),{setTrue:m,setFalse:t}=T(),u=x=>{m(),o({method:"put",data:{...x,currency_code:`${x.currency_code}`},url:`${oe}/${a.id}`}).then(g=>{g&&(t(),l(),s(),z({message:g.message}))})};return e.jsx(e.Fragment,{children:e.jsx(D,{bool:c,toggle:l,loading:i,current:a,onSubmit:u,currncy_list:d,has_permission:r})})},{Text:le}=y,{GrCurrency:re}=f,{NAME:L,SYMBOL:F,CODE:U,EXCHANGE_RATE:Y}=n,ce=({total:c,loading:l,listing:i=[]})=>{const{onChange:s,getParams:a}=B(""),{page:d,pageSize:r}=a(),o=h.useMemo(()=>[{title:L,key:L,width:500,responsive:["sm"],render:t=>e.jsxs(p,{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx(y,{children:t.name}),(t==null?void 0:t.basic_currency_status)&&e.jsx(w,{placement:"topLeft",title:"Base Currency",children:e.jsx(re,{size:20})})]})},{key:F,width:200,title:F,dataIndex:"symbol",align:"center"},{key:U,width:150,title:U,ellipsis:!0,align:"center",dataIndex:"currency_code",responsive:["md"]},{width:150,ellipsis:!0,key:Y,title:Y,dataIndex:"exchange_rate",align:"center",responsive:["sm"],render:t=>e.jsxs(y,{children:[`${t}`,e.jsx(w,{placement:"topLeft",title:"Currency Rate",children:e.jsx(le,{code:!0,children:"%"})})]})}],[]),m={onChange:(t,u)=>{console.log(`selectedRowKeys: ${t}`,"selectedRows: ",u)},getCheckboxProps:t=>({disabled:t.name==="Disabled User",name:t.name})};return e.jsx(e.Fragment,{children:e.jsx(W,{bordered:!0,loading:l,onChange:s,dataSource:i,columns:o,rowSelection:{type:"checkbox",...m,columnWidth:30},pagination:{total:c,current:d,pageSize:r,size:"small",showTotal:()=>e.jsx(p,{children:e.jsx(y.Title,{level:5,code:!0,children:`Total:  ${c}`})}),showLessItems:!0,position:["topRight"],showSizeChanger:!0,pageSizeOptions:["10","20","30","50"]},rowKey:t=>t.id})})},{currency:ie}=$,{GrCurrency:de}=f,{Title:me}=y,{CURRENCY:ue}=N,Ce=({refetch:c,currncy_list:l,has_permission:i})=>{const{callAxios:s,bool:a,toggle:d}=R(),{bool:r,toggle:o}=T(),m=t=>{o(),s({method:"post",data:{...t,currency_code:`${t.currency_code}`},url:ue}).then(u=>{o(),u&&(c(),z({message:u.message}),d())})};return e.jsxs(e.Fragment,{children:[e.jsx(D,{bool:a,toggle:d,onSubmit:m,loading:r,currncy_list:l,has_permission:i}),e.jsx(X,{title:e.jsxs(p,{children:[e.jsx(de,{size:25}),e.jsx(me,{level:3,children:ie})]}),style:{borderBottom:"1px solid gray",paddingBottom:"0"}})]})},{CURRENCY:he}=N,je=()=>{const{bool:c}=T(),{currncy_list:l}=Q(),[i,s]=h.useState({}),{checkPermission:a}=q(),{handleConfirm:d,bool:r,toggle:o}=R(),{total:m,getParams:t,setTotal:u}=B(""),{has_CurrencyView_permission:x}=a("CurrencyView"),{has_CurrencyEdit_permission:g}=a("CurrencyEdit"),{has_CurrencyCreate_permission:G}=a("CurrencyCreate"),{has_CurrencyDelete_permission:I}=a("CurrencyDelete"),{data:C={},isLoading:M,refetch:E}=J(t(),{refetchOnMountOrArgChange:!0,skip:!x});h.useEffect(()=>{u(C==null?void 0:C.total)},[u,C==null?void 0:C.total]);const P=j=>{s(j),o()},H=h.useCallback(P,[o]),v=h.useCallback(j=>d(j,he,E),[]);return e.jsxs(e.Fragment,{children:[e.jsx(Ce,{refetch:E,currncy_list:l,has_permission:G}),x?e.jsx(ce,{total:m,listing:(C==null?void 0:C.data)||[],loading:r||M,handleClick:H,handleConfirm:v,has_permission:I}):e.jsx(O,{}),r&&Object.keys(i).length>0&&e.jsx(ae,{bool:r,toggle:o,current:i,refetch:E,loading:c,currncy_list:l,has_permission:g})]})};export{je as default};