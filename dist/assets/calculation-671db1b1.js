const g=t=>{let e=0;return t.forEach(n=>{n.payment&&(e+=n.payment||n.payment_made)}),parseFloat(e.toFixed(2))},d=t=>t==null?void 0:t.reduce((e,n)=>n.discount_type==="percent"?e+c(n)||0:e+parseFloat(n.discount_item_level||0),0).toFixed(2),i=t=>{const e=t.quantity*t.rate,n=+a(t),r=t.total*parseFloat(t.tax_rate??0)/100;return(e+r-n).toFixed(2)},a=t=>{let e;return t.discount_type==="percent"?e=(t.item_total_amount??0)*parseFloat(t.discount_item_level)/100:e=parseFloat(t.discount_item_level||0),e.toFixed(2)},v=t=>{let e,n=t.rate*t.quantity;return t.discount_type==="percent"?e=n*parseFloat(t.discount_item_level)/100:e=parseFloat(t.discount_item_level||0),e.toFixed(2)},p=t=>t.rate*t.quantity,c=t=>+t.total*parseFloat(t.discount_item_level)/100,x=t=>t==null?void 0:t.reduce((n,r)=>n+F(r)||0,0).toFixed(2),F=t=>t.total*parseFloat(t.tax_rate)/100,_=t=>parseFloat(t.reduce((e,n)=>e+u(n),0).toFixed(2)),T=t=>{const e=t.reduce((n,r)=>n+u(r),0);return parseFloat(e).toFixed(2)},h=t=>{let e=_(t),n=0;t.forEach(o=>{n+=(o==null?void 0:o.quantity)*(o==null?void 0:o.rate)*((o==null?void 0:o.tax_rate)/100||0)});let r=0;return t.forEach(o=>o.discount_type==="percent"?r+=o.total*parseFloat(o.discount_item_level)/100:r+=o.discount_item_level),parseFloat((n+e-r).toFixed(2))};function u(t){let e=(t==null?void 0:t.quantity)*(t==null?void 0:t.rate);return parseFloat(e.toFixed(2))||0}function b(t){let e=0;return t==null||t.forEach(n=>e+=n==null?void 0:n.amount),parseFloat(e.toFixed(2))||0}const A=t=>{let e=0;return t==null||t.forEach(n=>{const r=parseFloat(n==null?void 0:n.amount)||0;e=e+r}),e.toFixed(2)},D=(t,e,n,r)=>{let o=0;const l=e==null?void 0:e.find(s=>s.id===t);return l&&n?o=r?`${(n-n*100/(100+(l==null?void 0:l.rate))).toFixed(2)} USD`:`${((l==null?void 0:l.rate)*.01*n).toFixed(2)} USD`:o},f=t=>t.reduce((n,r)=>{let o=!1;for(let l=0;l<n.length;l++)n[l].label===r.label&&(o=!0,n[l].value+=r.value);return o||n.push(r),n},[]),E=(t,e,n)=>{if((t==null?void 0:t.length)>0){const r=t==null?void 0:t.map(o=>{if(o!=null&&o.tax_id){const l=e==null?void 0:e.find(s=>s.id===o.tax_id);return{label:l.label,value:o.amount?parseFloat(n?(o.amount-o.amount*100/(100+(l==null?void 0:l.rate))).toFixed(2):((l==null?void 0:l.rate)*.01*o.amount).toFixed(2)):0}}else return[{label:"",value:0}]});return f(r)}else return},q=(t,e,n)=>{let r=0;return n||e==null||e.forEach(o=>{o.value&&(r=r+parseFloat(o.value))}),t+r};export{p as a,v as b,T as c,d,x as e,h as f,b as g,i as h,_ as i,g as j,A as k,E as l,q as m,D as n};
