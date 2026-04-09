import{g7 as i,gG as m,g9 as C,ga as a,fG as s,lu as L,ge as c,gI as u,gq as r}from"./index-Dbs2BKyJ.js";import{G as N}from"./getLogicFunctionSourceCode-NuI2z_iT.js";import{L as F}from"./logicFunctionFragment-C2akPVf1.js";const _=i`
  mutation UpdateOneLogicFunction($input: UpdateLogicFunctionFromSourceInput!) {
    updateOneLogicFunction(input: $input)
  }
`,T=i`
  ${F}
  mutation CreateOneLogicFunction($input: CreateLogicFunctionFromSourceInput!) {
    createOneLogicFunction(input: $input) {
      ...LogicFunctionFields
    }
  }
`,f=i`
  ${F}
  mutation DeleteOneLogicFunction($input: LogicFunctionIdInput!) {
    deleteOneLogicFunction(input: $input) {
      ...LogicFunctionFields
    }
  }
`,y=i`
  ${F}
  query FindManyLogicFunctions {
    findManyLogicFunctions {
      ...LogicFunctionFields
    }
  }
`,U=()=>{const{handleMetadataError:e}=m(),{enqueueErrorSnackBar:n}=C(),[g]=a(T),[p]=a(f),[l]=a(_),d=s.useCallback(async o=>{try{return{status:"successful",response:await g({variables:o,awaitRefetchQueries:!0,refetchQueries:[L(y)??""]})}}catch(t){return c.is(t)?e(t,{primaryMetadataName:"logicFunction",operationType:u.CREATE}):n({message:r._({id:"XyOToQ"})}),{status:"failed",error:t}}},[g,e,n]),O=s.useCallback(async o=>{try{return{status:"successful",response:await l({variables:o})}}catch(t){return c.is(t)?e(t,{primaryMetadataName:"logicFunction",operationType:u.UPDATE}):n({message:r._({id:"XyOToQ"})}),{status:"failed",error:t}}},[l,e,n]),E=s.useCallback(async o=>{try{return{status:"successful",response:await p({variables:o,awaitRefetchQueries:!0,refetchQueries:[L(N)??""]})}}catch(t){return c.is(t)?e(t,{primaryMetadataName:"logicFunction",operationType:u.DELETE}):n({message:r._({id:"XyOToQ"})}),{status:"failed",error:t}}},[p,e,n]);return{createLogicFunction:d,updateLogicFunction:O,deleteLogicFunction:E}};export{U as u};
