import{u as f,O as M,cD as O,r,j as e,cr as G,J as V,aa as _,t as v,al as j,aw as H,ax as L,I as N,l as E,P as R,n as T,p as B,o as I,bV as J,ci as b,ay as Y,f as Q,S as U,T as W,i as X,v as q,cE as Z,$ as ee,a4 as y}from"./index-4b3d7bc8.js";import{c as w}from"./capitalize-cfd5966b.js";import{u as F}from"./useSearchParam-ebfda256.js";import{u as $}from"./usePermissions-36032956.js";import{A as se}from"./ActionMenu-149e95aa.js";import{A as te}from"./index-9f4b88aa.js";import{A as ae}from"./AccessDenied-45b92511.js";const{VscClose:ne}=N,{PACKAGES:A,ACTIVITY:oe}=E,re=({detail:a,handleFullScreen:u})=>{const{callAxios:n}=f(),l=M("tab_key"),i=O("id"),[t,d]=r.useState();r.useEffect(()=>{n({url:`${A}/${i||(a==null?void 0:a.id)}`}).then(h=>{d(h)})},[a==null?void 0:a.id]);const m=r.useMemo(()=>[{key:"1",label:"History",children:e.jsxs(e.Fragment,{children:[t&&Object.keys(t).length>0&&e.jsx(G,{url:`${A}/${t==null?void 0:t.id}${oe}`}),","]})}],[t]);return e.jsx(e.Fragment,{children:e.jsx(V,{title:t==null?void 0:t.package_no,subTitle:e.jsx(_,{children:w(t==null?void 0:t.status)}),extra:[e.jsx(ne,{size:20,onClick:()=>v(u)},"close")],footer:e.jsxs(e.Fragment,{children:[e.jsx(j,{}),e.jsx(H,{defaultActiveKey:l||"1",items:m,onChange:L}),e.jsx(j,{})]})})})},{NEW_PACKAGE:ce}=T,{all_packages:ie}=B,{ADD_PACKAGE:le}=I,de=({enable:a=!1})=>e.jsx(e.Fragment,{children:e.jsx(R.SubHeader,{enabled:a,title:ie,btnText:ce,navigateTo:le})}),me=({render:a})=>{const u=J("once"),[n,l]=r.useState(),[i,t]=r.useState(u||!1),d=r.useCallback(g=>t(g),[]),m=g=>{const{id:p,payment_no:o}=g;b("id",p||o),b("once",!0),localStorage.setItem("id",p||o),localStorage.setItem("once",JSON.stringify(!0)),l(g),!i&&t(!0)},h=r.useCallback(m,[i]);return a({fullScreen:i,handleFullScreen:d,detail:n,memoizeHandleClick:h})},{NAME:S,SYMBOL:ge,CODE:ue,DELETE:he,_PACKAGES:pe}=T,xe=({total:a,loading:u,showDetail:n,handleClick:l,listing:i=[],handleConfirm:t,handleViewClick:d})=>{const{checkPermission:m}=$(),{onChange:h,getParams:g}=F(""),{page:p,pageSize:o}=g(),{has_PackageDelete_permission:x}=m("PackageDelete"),C=r.useMemo(()=>[{title:"Date",dataIndex:"package_date",key:S,width:n?95:120,ellipsis:!0,render:s=>Y(s)},{title:"Package#",dataIndex:"package_no",key:ge,width:n?0:130,ellipsis:!0},{title:"SalesOrder#",dataIndex:"sales_order_no",key:ue,width:n?0:120,ellipsis:!0},{title:"Customer Name",dataIndex:"display_name",key:S,ellipsis:!0,width:n?130:400},{title:"Status",dataIndex:"status",key:S,ellipsis:!0,width:n?95:120,render:s=>e.jsx(_,{autoCapitalize:"",color:s==="draft"?"red":"green",children:w(s)},s)},{title:"",dataIndex:"",width:50,key:"x",align:"center",render:s=>e.jsx(se,{data:s,handleClick:l,handleConfirm:t,canEdit:s.platform_type==="books",deletePermission:s.platform_type==="books"?x:!1,title:s.platform_type==="books"&&x?`${he} "${s.package_no}" ${pe} ?`:"Access Denied"})}],[l,t,x,n]),P={onChange:(s,k)=>{console.log(`selectedRowKeys: ${s}`,"selectedRows: ",k)},getCheckboxProps:s=>({disabled:s.name==="Disabled User",name:s.name})};return e.jsx(e.Fragment,{children:e.jsx(Q,{bordered:!0,loading:u,dataSource:i,columns:C,scroll:{...Number(a)>10&&{y:600}},rowSelection:{type:"checkbox",...P},pagination:{total:a,current:p,pageSize:o,size:"small",showTotal:()=>e.jsx(U,{children:e.jsx(W.Title,{level:5,code:!0,children:`Total:  ${a}`})}),showLessItems:!0,position:["topRight"],showSizeChanger:!0,pageSizeOptions:["10","20","30","50"]},onChange:h,rowKey:s=>s.package_no,onRow:(s,k)=>({onClick:c=>{c.stopPropagation(),console.log({event:c,record:s,index:k,showDetail:n}),d(s)}})})})},{PACKAGES:ke}=E,{EDIT_PACKAGE:Ce}=I,_e=()=>{const a=X(),{bool:u,handleConfirm:n}=f(),{checkPermission:l}=$(),{total:i,getParams:t,setTotal:d}=F(""),{has_PackageView_permission:m}=l("PackageView"),{getCurrentModule:h,checkModulePermission:g}=q(),{status:p=void 0}=h("Package")||{},{data:o=[],refetch:x,isLoading:C}=Z(t(),{refetchOnMountOrArgChange:!0,skip:!m||g("Package")});r.useEffect(()=>{d(o==null?void 0:o.total)},[d,o==null?void 0:o.total]);const P=c=>a(`${Ce}?id=${c.id}`),s=r.useCallback(P,[a]),k=r.useCallback(c=>n(c,ke,x),[n,x]);return e.jsx(me,{render:({fullScreen:c,handleFullScreen:D,memoizeHandleClick:z,detail:K})=>e.jsx(e.Fragment,{children:m?e.jsxs(e.Fragment,{children:[!p&&e.jsx(te,{showIcon:!0,type:"info",message:"Module Permissions",description:"Please Enable Module Permissions To See Details"}),e.jsx(de,{enable:!p}),e.jsxs(ee,{children:[e.jsx(y,{span:c?10:24,children:e.jsx(xe,{total:i,showDetail:c,listing:(o==null?void 0:o.data)||[],handleClick:s,loading:u||C,handleConfirm:k,handleViewClick:z})}),c&&e.jsx(e.Fragment,{children:e.jsx(y,{span:14,children:e.jsx(re,{detail:K,handleFullScreen:D})})})]})]}):e.jsx(ae,{})})})};export{_e as default};