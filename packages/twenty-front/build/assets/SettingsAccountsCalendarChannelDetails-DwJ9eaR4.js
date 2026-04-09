import{g7 as S,gm as t,ld as s,fM as C,gr as j,gs as h,hL as E,ga as m,gp as d,gq as a,gQ as v,h as y,g0 as x}from"./index-Dbs2BKyJ.js";import{a as M,S as l}from"./SettingsAccountsVisibilityIcon--1ptAt-e.js";import{S as f}from"./SettingsOptionCardContentToggle-CbpBj7Da.js";import{S as r}from"./index-LO3IUtNs.js";const _=S`
  mutation UpdateCalendarChannel($input: UpdateCalendarChannelInput!) {
    updateCalendarChannel(input: $input) {
      id
      visibility
      isContactAutoCreationEnabled
      contactAutoCreationPolicy
    }
  }
`,c=C("div")({name:"StyledCardMediaContainer",class:"s13a7ob6",propsAsIs:!1}),R=[{title:{id:"wqF3jl"},description:{id:"MHLapp"},value:s.SHARE_EVERYTHING,cardMedia:t.jsx(c,{children:t.jsx(l,{subject:"active",body:"active"})})},{title:{id:"6GBt0m"},description:{id:"zii2Qj"},value:s.METADATA,cardMedia:t.jsx(c,{children:t.jsx(l,{subject:"active",body:"inactive"})})}],T=({onChange:i,value:n=s.SHARE_EVERYTHING})=>t.jsx(M,{name:"event-visibility",options:R,value:n,onChange:i}),I=C("div")({name:"StyledDetailsContainer",class:"sxvfjl",propsAsIs:!1}),V=({calendarChannel:i})=>{const p=j()[h.IS_CONNECTED_ACCOUNT_MIGRATED]??!1,{updateOneRecord:u}=E(),[g]=m(_),o=e=>{p?g({variables:{input:{id:i.id,update:e}}}):u({objectNameSingular:x.CalendarChannel,idToUpdate:i.id,updateOneRecordInput:e})},A=e=>{o({visibility:e})},b=e=>{o({isContactAutoCreationEnabled:e})};return t.jsxs(I,{children:[t.jsxs(r,{children:[t.jsx(d,{title:a._({id:"poC90w"}),description:a._({id:"bQkkFU"})}),t.jsx(T,{value:i.visibility,onChange:A})]}),t.jsxs(r,{children:[t.jsx(d,{title:a._({id:"Y2y0mC"}),description:a._({id:"YRT7ZW"})}),t.jsx(v,{rounded:!0,children:t.jsx(f,{Icon:y,title:a._({id:"2zJkmL"}),description:a._({id:"lgw3U4"}),checked:i.isContactAutoCreationEnabled,onChange:()=>{b(!i.isContactAutoCreationEnabled)}})})]})]})};export{V as S};
