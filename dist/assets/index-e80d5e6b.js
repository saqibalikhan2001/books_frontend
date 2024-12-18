import{r as u,j as e,y as S,F as f,A as R,D,p as k,B as T,ak as G,n as p,M as $,u as N,G as I,h as b,l as _,f as M,cJ as v,J as B,a2 as z,s as L,aP as U,T as Y}from"./index-4b3d7bc8.js";import{C as J,u as H}from"./useCustomPagination-4b61827d.js";import{A as V}from"./ActionMenu-149e95aa.js";const{TextArea:q}=G,{NAME:K,DESCRIPTION:Q}=p,W={name:"",description:""},X=({form:i,boolean:a,loading:s,onSubmit:n,current:o,handleCancel:l})=>(u.useEffect(()=>{o&&Object.keys(o).length&&i.setFieldsValue({...o})},[o,i]),e.jsx(e.Fragment,{children:a?e.jsx(S,{}):e.jsx(f,{form:i,layout:"vertical",className:"formin",onFinish:n,name:"form_in_modal",requiredMark:!1,initialValues:W,children:e.jsxs("div",{children:[e.jsx(R,{name:"name",label:e.jsxs("label",{className:"title",children:[K,e.jsx("span",{className:"staric",children:"*"})]}),className:"input_field",disabled:!!(o!=null&&o.name),rules:D({message:k.enter_name})}),e.jsx(f.Item,{name:"description",label:e.jsxs("label",{className:"title",children:[Q,e.jsx("span",{className:"staric",children:"*"})]}),children:e.jsx(q,{showCount:!0,maxLength:255,rows:4,className:"h-100"})}),e.jsxs("div",{className:"button_flexbox flex-end nectuophile custom_blocklevel",children:[e.jsx(T,{btnText:"Cancel",htmlType:"button",clickHandler:l,className:"btn-default btn-form-size cate_cancel_btn"}),e.jsx(T,{loading:s,className:"btn-primary btn-form-size",btnText:"Save"})]})]})})})),{CREATE_CATEGORY:Z,UPDATE_CATEGORY:ee}=p,O=({boolean:i,loading:a,onSubmit:s,current:n,isModalOpen:o,setIsModalOpen:l})=>{const[r]=f.useForm(),d=()=>r.resetFields(),c=()=>{l(!1),r.resetFields()};return e.jsx(e.Fragment,{children:e.jsx($,{footer:null,destroyOnClose:!0,open:o,onCancel:c,afterClose:d,className:"category_modal",title:n!=null&&n.name?ee:Z,children:e.jsx(X,{form:r,loading:a,boolean:i,current:n,onSubmit:s,handleCancel:c})})})},{PRODUCT_CATEGORY:E}=_,se=({refetch:i,current:a,isModalOpen:s,setIsModalOpen:n})=>{const[o,l]=u.useState(),{callAxios:r,bool:d,toggle:c}=N(),{bool:x,setFalse:g}=I(!0);u.useEffect(()=>{a&&Object.keys(a).length&&r({method:"get",url:`${E}/${a==null?void 0:a.id}/edit`}).then(t=>{t&&(l(t),b({message:t.message}),c(),g())})},[a]);const h=t=>{const j={name:t.name,description:t.description};c(),r({data:j,method:"put",url:`${E}/${a==null?void 0:a.id}`}).then(m=>{i(),m&&(n(!1),b({message:m.message}))})};return e.jsx(e.Fragment,{children:e.jsx(O,{loading:d,boolean:x,current:o,onSubmit:h,isModalOpen:s,setIsModalOpen:n})})},{ADD_CATEGORY:te}=_,ae=({refetch:i,isFetching:a,isModalOpen:s,setIsModalOpen:n})=>{const{callAxios:o,toggle:l,bool:r}=N(),d=c=>{l();const x={name:c.name,description:c.description};o({data:x,method:"post",url:te}).then(g=>{i(),g&&(n(!1),b({message:g.message}))})};return e.jsx(e.Fragment,{children:e.jsx(O,{loading:r,toggle:l,onSubmit:d,isFetching:a,isModalOpen:s,setIsModalOpen:n})})},{DELETE:oe,PRODUCT_CATEGORIES:ne}=p,le=({Prev:i,Next:a,data:s,bool:n,onChange:o,isLoading:l,handlePage:r,pagination:d,handleClick:c,handleRowSize:x,handleConfirm:g})=>{const h=localStorage.getItem("params"),t=JSON.parse(h),j=u.useMemo(()=>[{dataIndex:"name",key:"name",sorter:!0,showSorterTooltip:!1,defaultSortOrder:"ascend",sortDirections:["ascend","descend"],title:()=>e.jsxs("div",{children:["Name",t.sort_column==="name"?(t==null?void 0:t.sort)==="asc"?e.jsx("span",{className:"arrow arrow-bar is-top"}):e.jsx("span",{className:"arrow arrow-bar is-bottom"}):""]})},{title:()=>e.jsxs("div",{children:["Products",(t==null?void 0:t.sort_column)==="item_count"?(t==null?void 0:t.sort)==="asc"?e.jsx("span",{className:"arrow arrow-bar is-top"}):e.jsx("span",{className:"arrow arrow-bar is-bottom"}):""]}),dataIndex:"item_count",key:"item_count",align:"center",sorter:!0,showSorterTooltip:!1,sortDirections:["ascend","descend"]},{title:"",dataIndex:"",align:"center",width:50,render:m=>e.jsx(V,{category:!0,data:m,canEdit:!0,deletePermission:!0,handleClick:c,handleConfirm:g,title:`${oe} "${m.name}" ${ne} `})}],[c,g,t==null?void 0:t.sort]);return e.jsxs(e.Fragment,{children:[e.jsx(J,{Prev:i,Next:a,paginate:d,handlePage:r,className:"pagination_row",totalPages:s==null?void 0:s.last_page,handleRowSize:x}),e.jsx(M,{size:"middle",pagination:!1,onChange:o,columns:j,loading:n||l,dataSource:(s==null?void 0:s.data)||[],rowKey:m=>m.id,className:"generic-table categorie_table",scroll:{...Number(s==null?void 0:s.data.length)>10&&{y:600}}})]})},{Title:ie}=Y,{PRODUCT_CATEGORY:re}=_,ge=()=>{const{toggle:i,callAxios:a}=N(),[s,n]=u.useState(),[o,l]=u.useState(!1),{paginate:r,Prev:d,Next:c,onChange:x,handlePage:g,handleRowSize:h}=H("categories"),{data:t,isLoading:j,refetch:m,isFetching:y}=v(r,{refetchOnMountOrArgChange:!0}),A=C=>{n(C),l(!0)},F=C=>{a({method:"delete",url:`${re}/${C.id}`}).then(w=>{i(),b({message:w.message}),m()})},P=()=>{l(!0),n([])};return e.jsxs(e.Fragment,{children:[e.jsx(B,{className:"generic_top_header product-header",title:e.jsxs(e.Fragment,{children:[e.jsx(z,{name:"",category:!0,className:"_product_breadcrumbs"}),e.jsx(ie,{style:{marginTop:0,marginBottom:0},level:4,children:"Product Categories"})]}),extra:e.jsxs(L,{className:"d-flex align-center btn-primary",onClick:P,children:[e.jsx(U,{size:15,className:"mr-5"})," New category"]},"1")}),e.jsx(le,{data:t,Prev:d,Next:c,bool:y,onChange:x,isLoading:j,pagination:r,handlePage:g,handleClick:A,handleRowSize:h,handleConfirm:F}),!(s&&Object.keys(s).length)&&e.jsx(ae,{refetch:m,isFetching:y,isModalOpen:o,setIsModalOpen:l}),s&&Object.keys(s).length&&e.jsx(se,{refetch:m,current:s,isModalOpen:o,setIsModalOpen:l})]})};export{ge as default};