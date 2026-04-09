import{g9 as u,ga as f,jQ as h,gm as i,go as x,gp as j,gR as D,aO as p,gq as n,jR as y,ge as E,g7 as v,gT as R,gx as S,fH as g,gU as c,gy as A,gz as k,gA as l,gB as m}from"./index-Dbs2BKyJ.js";const _=({domain:e})=>{const{enqueueSuccessSnackBar:s,enqueueErrorSnackBar:r}=u(),[t,{loading:a}]=f(h);if(!e.verificationRecords||e.verificationRecords.length===0)return null;const o=async()=>{try{await t({variables:{id:e.id}}),s({message:n._({id:"hTX65V"})})}catch(d){r({...E.is(d)?{apolloError:d}:{}})}};return i.jsxs(x,{children:[i.jsx(j,{title:n._({id:"RDL+lZ"}),description:n._({id:"FQArA8"}),adornment:i.jsx(D,{onClick:o,isLoading:a,variant:"secondary",Icon:p,size:"small",title:n._({id:"h5C4B4"}),disabled:a})}),i.jsx(y,{records:e.verificationRecords})]})},V=v`
  query GetEmailingDomains {
    getEmailingDomains {
      id
      domain
      driver
      status
      verifiedAt
      verificationRecords {
        type
        key
        value
        priority
      }
      createdAt
      updatedAt
    }
  }
`,C=()=>{const{domainId:e}=R(),{data:s,loading:r,error:t}=S(V,{skip:!e}),a=s?.getEmailingDomains?.find(o=>o.id===e);return r?i.jsx("div",{children:n._({id:"Z3FXyt"})}):g(t)||!g(a)?i.jsx(c,{id:"OjtVhh"}):i.jsx(A,{title:a.domain,links:[{children:i.jsx(c,{id:"pmUArF"}),href:l(m.Workspace)},{children:i.jsx(c,{id:"axQccV"}),href:l(m.Domains)},{children:a.domain}],children:i.jsx(k,{children:a.verificationRecords&&a.verificationRecords.length>0&&i.jsx(_,{domain:a})})})};export{C as SettingsEmailingDomainDetail};
