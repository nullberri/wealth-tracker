var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:!0});import{j as jsx,b as jsxs,F as Fragment}from"./@emotion-C5te-C3E.js";import"./ag-grid-community-Dstgf3nq.js";import{S as Store,u as useStore}from"./@tanstack-C7NK6ToA.js";import{A as AgChartsReact}from"./ag-charts-react-CWpTvsl8.js";import{D as DateTime}from"./luxon-BOQzYXYm.js";import{r as reactExports,a as React}from"./react-Dp-UgLSZ.js";import{m as merge}from"./deepmerge-LYrNqSsX.js";import{z}from"./zod-f9fbzKyR.js";import{c as create}from"./mutative-SUdGWNRE.js";import{D as Dialog,B as Button,a as DialogTitle,S as Stack,T as TextField,M as MenuItem,b as DialogContent,c as DialogActions,P as Paper,d as default_1,G as Grid,e as DatePicker,I as InputAdornment,f as Stack$1,g as Tabs,h as Tab,i as Box,j as Typography,k as Divider,l as default_1$1,m as Tooltip,n as Box$1,o as createTheme,L as LocalizationProvider,A as AdapterLuxon,C as CssBaseline,p as ThemeProvider}from"./@mui-D7vaUaxX.js";import{m as main}from"./ag-grid-react-DlnuLdlC.js";import{v as v4}from"./uuid-DmDH2-Ii.js";import{c as client}from"./react-dom-tAkJLv4D.js";import{E as ErrorBoundary}from"./react-error-boundary-DbFwlpNr.js";import"./hoist-non-react-statics-BI0zVOZ1.js";import"./react-is-BurAzYM9.js";import"./@babel-Da9QAQIm.js";import"./stylis-BvCTCaD4.js";import"./use-sync-external-store-BvrDn2mX.js";import"./ag-charts-community-BzVcA-B_.js";import"./clsx-DvC3wpxN.js";import"./prop-types-BAUTa6OW.js";import"./react-transition-group-C3q6_IyI.js";import"./dom-helpers-Hfa3ly4k.js";import"./@popperjs-4P2G51Yq.js";import"./scheduler-Dnx1gCjA.js";__name(function(){const relList=document.createElement("link").relList;if(relList&&relList.supports&&relList.supports("modulepreload"))return;for(const link of document.querySelectorAll('link[rel="modulepreload"]'))processPreload(link);new MutationObserver(mutations=>{for(const mutation of mutations)if(mutation.type==="childList")for(const node of mutation.addedNodes)node.tagName==="LINK"&&node.rel==="modulepreload"&&processPreload(node)}).observe(document,{childList:!0,subtree:!0});function getFetchOpts(link){const fetchOpts={};return link.integrity&&(fetchOpts.integrity=link.integrity),link.referrerPolicy&&(fetchOpts.referrerPolicy=link.referrerPolicy),link.crossOrigin==="use-credentials"?fetchOpts.credentials="include":link.crossOrigin==="anonymous"?fetchOpts.credentials="omit":fetchOpts.credentials="same-origin",fetchOpts}__name(getFetchOpts,"getFetchOpts");function processPreload(link){if(link.ep)return;link.ep=!0;const fetchOpts=getFetchOpts(link);fetch(link.href,fetchOpts)}__name(processPreload,"processPreload")},"polyfill")();const accountDataValidator=z.object({date:z.string(),value:z.number(),id:z.string()}),accountValidator=z.object({type:z.literal("account"),data:z.array(accountDataValidator)}),loanValidator=z.object({principal:z.number(),ratePct:z.number(),paymentsPerYear:z.number(),payment:z.number(),firstPaymentDate:z.string(),ownershipPct:z.number()}),mortgageValidator=z.object({type:z.literal("mortgage"),loan:loanValidator.optional(),data:z.array(accountDataValidator)}),wealth=z.record(z.union([accountValidator,mortgageValidator])),projectedWealth=z.object({timeSeries:z.object({monthlyIncome:z.array(accountDataValidator),retirementRate:z.array(accountDataValidator),savingsRate:z.array(accountDataValidator),meritBonusPct:z.array(accountDataValidator),companyBonusPct:z.array(accountDataValidator),meritBonus:z.array(accountDataValidator),companyBonus:z.array(accountDataValidator),retirementBonus:z.array(accountDataValidator),equityPct:z.array(accountDataValidator),meritIncreasePct:z.array(accountDataValidator)})}),storeValidator=z.object({wealth,projectedIncome:projectedWealth}),createStore=__name((key,validator2,defaultValue)=>{const localData=localStorage.getItem(key);let data=localData?JSON.parse(localData):defaultValue;const parse=validator2.safeParse(data);if(!parse.success){console.log("zod error",parse.error),console.log("original",data);const next=merge(data,defaultValue);console.log("merged",next),localStorage.setItem(`${key}-previous`,JSON.stringify(data)),localStorage.setItem(key,JSON.stringify(next)),data=next}const store2=new Store(data);return store2.subscribe(()=>{const current=localStorage.getItem(key);current&&localStorage.setItem(`${key}-previous`,current),localStorage.setItem(key,JSON.stringify(store2.state))}),store2},"createStore"),store=createStore("store",storeValidator,{projectedIncome:{timeSeries:{monthlyIncome:[],retirementRate:[],savingsRate:[],meritBonusPct:[],companyBonusPct:[],meritBonus:[],companyBonus:[],retirementBonus:[],equityPct:[],meritIncreasePct:[]}},wealth:{}}),formatCashShort=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",notation:"compact",maximumFractionDigits:1}).format,formatCash=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format,calcLoanBalance=__name((date,loan)=>{const{firstPaymentDate,paymentsPerYear,principal:pricipal,ratePct:rate,payment:monthlyPayment}=loan,anualizedRate=rate/paymentsPerYear,periods=date.diff(DateTime.fromISO(firstPaymentDate),"months").months,totalRate=(1+anualizedRate)**periods;return pricipal*totalRate-monthlyPayment/anualizedRate*(totalRate-1)},"calcLoanBalance"),calcEquity=__name((ownershipPct,houseValue,loanBalance,principal)=>houseValue?houseValue*ownershipPct-loanBalance:principal-loanBalance,"calcEquity"),findNearstOnOrBefore=__name((date,data)=>data.find((x,idx,array)=>{if(idx==0&&DateTime.fromISO(x.date).startOf("day")>date||idx<array.length-1&&DateTime.fromISO(x.date).startOf("day")<=date&&DateTime.fromISO(data[idx+1].date).startOf("day")>date||idx===array.length-1)return!0}),"findNearstOnOrBefore"),findSameYear=__name((date,data)=>data.find(x=>DateTime.fromISO(x.date).year===date.year),"findSameYear"),getMortgateValue=__name((date,mortgage)=>{if(!mortgage.loan)return 0;const entry=findNearstOnOrBefore(date,mortgage.data);if(entry!=null&&entry.date&&mortgage.data[0]===entry&&DateTime.fromISO(entry.date)>date)return 0;const{ownershipPct,principal}=mortgage.loan,balance=calcLoanBalance(date,mortgage.loan);return calcEquity(ownershipPct,entry==null?void 0:entry.value,balance,principal)},"getMortgateValue"),getAccountValue=__name((date,account)=>{const entry=findNearstOnOrBefore(date,account.data);return entry!=null&&entry.date&&account.data[0]===entry&&DateTime.fromISO(entry.date)>date?0:(entry==null?void 0:entry.value)??0},"getAccountValue"),getGraphValue=__name((date,account)=>{switch(account.type){case"account":return getAccountValue(date,account);case"mortgage":return getMortgateValue(date,account)}},"getGraphValue"),getGraphDates=__name(accounts=>[...new Set(accounts.flatMap(x=>x.data.map(x2=>DateTime.fromISO(x2.date).startOf("day").toISO())))].map(x=>DateTime.fromISO(x)).sort((a,b)=>a.toMillis()-b.toMillis()),"getGraphDates"),useGraphData=__name(()=>{const wealth2=useStore(store,x=>x.wealth);return reactExports.useMemo(()=>{const dates=getGraphDates(Object.values(wealth2)),accounts=Object.entries(wealth2),graphData=dates.map(date=>accounts.reduce((acc,[accountName,account])=>{const value=getGraphValue(date,account);return acc[accountName]=value,acc.total=acc.total+value,acc.date=date.toJSDate(),acc},{total:0})),firstNonZero=graphData.findIndex(x=>x.total>0);return graphData.slice(firstNonZero)},[wealth2])},"useGraphData"),WealthChart=__name(()=>{const wealth2=useStore(store,x=>x.wealth),data=useGraphData(),series=reactExports.useMemo(()=>[...Object.keys(wealth2).map(x=>({stacked:!0,type:"area",xKey:"date",yKey:x,yName:x,tooltip:{renderer:({datum,yKey,xKey})=>({content:`${DateTime.fromJSDate(datum[xKey]).toISODate()} ${formatCashShort(datum[yKey])}`})}})),{type:"line",xKey:"date",yKey:"total",yName:"Total",tooltip:{renderer:({datum,yKey,xKey})=>({content:`${DateTime.fromJSDate(datum[xKey]).toISODate()} ${formatCashShort(datum[yKey])}`})}}],[wealth2]),options=reactExports.useMemo(()=>{var _a;return{theme:"ag-default-dark",title:{text:`Total Wealth ${formatCashShort(((_a=data[data.length-1])==null?void 0:_a.total)??0)}`},data,axes:[{type:"time",position:"bottom",label:{format:"%Y"}},{type:"number",position:"left"}],series}},[data,series]);return jsx(AgChartsReact,{options})},"WealthChart"),NewAccount=reactExports.forwardRef((props,ref)=>{const[open,setOpen]=reactExports.useState(!1),nameRef=reactExports.useRef(null),[error,setError]=reactExports.useState(!1),[accountType,setAccountType]=reactExports.useState();return jsxs(Fragment,{children:[jsx(Button,{ref,onClick:()=>{setOpen(!0),setError(!1),setAccountType(void 0)},children:"add account"}),jsxs(Dialog,{open,onClose:()=>setOpen(!1),children:[jsx(DialogTitle,{children:"Add New Account"}),jsx(DialogContent,{children:jsxs(Stack,{spacing:2,margin:2,children:[jsxs(TextField,{select:!0,color:error?"error":"primary",onChange:value=>{setError(!1),setAccountType(value.target.value)},label:"Type",children:[jsx(MenuItem,{value:"mortgage",children:"Mortgage"}),jsx(MenuItem,{value:"account",children:"Generic Account"})]}),jsx(TextField,{placeholder:"Name",onChange:()=>{setError(!1)},error,inputRef:nameRef})]})}),jsx(DialogActions,{children:jsx(Button,{disabled:error,onClick:()=>{store.setState(prev=>create(prev,next=>{var _a;if(!((_a=nameRef.current)!=null&&_a.value)||!accountType||prev.wealth[nameRef.current.value]){setError(!0);return}next.wealth[nameRef.current.value]={type:accountType,data:[]},setOpen(!1)}))},children:"Add"})})]}),props==null?void 0:props.children]})}),AgGrid=__name(props=>{const{id,...rest}=props;return jsx("div",{id,className:"ag-theme-quartz-dark",style:{height:"100%"},children:jsx(main.AgGridReact,{...rest})})},"AgGrid"),shortDate="yyyy-MM-dd",sortByDate=__name((select,direction)=>(a,b)=>direction==="asc"?select(a).toMillis()-select(b).toMillis():select(b).toMillis()-select(a).toMillis(),"sortByDate"),DeleteAccount=__name(props=>{const{accountName}=props;return jsx(Paper,{elevation:3,sx:{padding:2,width:"100%"},children:jsx(Button,{onClick:__name(()=>{store.setState(prev=>create(prev,next=>{delete next.wealth[accountName]}))},"onDeleteAccount"),color:"error",children:"Delete Account"})})},"DeleteAccount"),RenameAccount=__name(props=>{const{accountName}=props,[nextAccountName,setNextAccountName]=reactExports.useState(accountName);return jsx(Paper,{elevation:3,sx:{padding:2},children:jsxs(Stack,{spacing:1,children:[jsx(TextField,{label:"Account Name",value:nextAccountName,onChange:event=>setNextAccountName(event.target.value),placeholder:""}),jsx(Button,{disabled:!nextAccountName,onClick:__name(()=>{store.setState(prev=>create(prev,next=>{next.wealth[nextAccountName]=next.wealth[accountName],delete next.wealth[accountName]}))},"onUpdateName"),children:"Update Name"})]})})},"RenameAccount"),createAccountColumnConfig$2=__name(accountName=>[{headerName:"Date",sort:"desc",valueFormatter:x=>{var _a;return(_a=x.value)==null?void 0:_a.toFormat(shortDate)},valueGetter:x=>x.data&&DateTime.fromISO(x.data.date)},{headerName:"Value",valueGetter:x=>{var _a;return(_a=x.data)==null?void 0:_a.value},valueFormatter:x=>formatCashShort(x.value),type:"numericColumn"},{headerName:"Actions",cellRenderer:props=>jsx(Button,{onClick:()=>{store.setState(prev=>create(prev,next=>{const idxToRemove=next.wealth[accountName].data.findIndex(x=>{var _a;return x.id===((_a=props.data)==null?void 0:_a.id)});return next.wealth[accountName].data.splice(idxToRemove,1),next}))},color:"error",children:jsx(default_1,{})})}],"createAccountColumnConfig$2"),AccountTab=__name(props=>{const{accountName}=props,account=useStore(store,state=>state.wealth[accountName]),[date,setDate]=reactExports.useState(DateTime.local()),[amount,setamount]=reactExports.useState(0),hasSameDate=reactExports.useMemo(()=>{var _a;return!!((_a=account==null?void 0:account.data)!=null&&_a.find(x=>date.hasSame(DateTime.fromISO(x.date),"day")))},[account==null?void 0:account.data,date]),onAddEntry=__name(()=>{store.setState(prev=>create(prev,next=>{next.wealth[accountName].data.push({date:date.toString(),value:amount,id:v4()}),next.wealth[accountName].data.sort(sortByDate(x=>DateTime.fromISO(x.date),"asc"))}))},"onAddEntry"),accountColumnConfig=reactExports.useMemo(()=>createAccountColumnConfig$2(accountName),[accountName]);return jsxs(Grid,{container:!0,height:"100%",width:"100%",padding:1,spacing:2,children:[jsx(Grid,{xs:3,children:jsx(AgGrid,{reactiveCustomComponents:!0,rowData:(account==null?void 0:account.data)??[],columnDefs:accountColumnConfig,id:account+"-history"})}),jsx(Grid,{xs:9,children:jsx("div",{children:jsxs(Grid,{container:!0,spacing:2,children:[jsx(Grid,{xs:2,children:jsx(Paper,{elevation:3,sx:{padding:2},children:jsxs(Stack,{spacing:1,children:[jsx(DatePicker,{format:shortDate,sx:{color:"white"},label:"Date",defaultValue:date,onChange:value=>value&&setDate(value)}),jsx(TextField,{label:"amount",value:amount,type:"number",onChange:event=>setamount(+event.target.value),InputProps:{startAdornment:jsx(InputAdornment,{position:"start",children:"$"})},placeholder:""}),jsx(Button,{disabled:!amount||!date||hasSameDate,onClick:onAddEntry,children:"Add Entry"})]})})}),jsx(Grid,{xs:8}),jsx(Grid,{xs:2,children:jsxs(Stack,{spacing:2,children:[jsx(DeleteAccount,{accountName}),jsx(RenameAccount,{accountName})]})})]})})})]})},"AccountTab"),createAccountColumnConfig$1=__name(accountName=>[{headerName:"Date",sort:"desc",valueFormatter:x=>{var _a;return(_a=x.value)==null?void 0:_a.toFormat(shortDate)},valueGetter:x=>x.data&&DateTime.fromISO(x.data.date)},{headerName:"Home Value",valueGetter:x=>{var _a;return(_a=x.data)==null?void 0:_a.value},valueFormatter:x=>formatCashShort(x.value),type:"numericColumn"},{headerName:"Actions",cellRenderer:props=>jsx(Button,{onClick:()=>{store.setState(prev=>create(prev,next=>{const account=next.wealth[accountName],idxToRemove=account.data.findIndex(x=>{var _a;return x.id===((_a=props.data)==null?void 0:_a.id)});return account.data.splice(idxToRemove,1),next}))},color:"error",children:jsx(default_1,{})})}],"createAccountColumnConfig$1"),mortgageColumnConfig=[{headerName:"Date",sort:"desc",valueFormatter:x=>{var _a;return(_a=x.value)==null?void 0:_a.toFormat(shortDate)},valueGetter:x=>{var _a;return(_a=x.data)==null?void 0:_a.date}},{headerName:"Loan Balance",valueGetter:x=>{var _a;return(_a=x.data)==null?void 0:_a.balance.toFixed(2)},valueFormatter:x=>formatCashShort(x.value),type:"numericColumn"}];function groupBy(array,selector){return array.reduce((acc,curr)=>{const key=selector(curr);return acc[key]??(acc[key]=[]),acc[key].push(curr),acc},{})}__name(groupBy,"groupBy");const convertPct=__name(value=>value>1?value/100:value,"convertPct"),validator=z.object({principal:z.number().min(0),ratePct:z.number().min(0),paymentsPerYear:z.number().min(0),payment:z.number().min(0),firstPaymentDate:z.string().datetime({offset:!0}),ownershipPct:z.number().min(0)}),AddLoan=__name(props=>{var _a;const{accountName}=props,loan=useStore(store,x=>{const account=x.wealth[accountName];if("loan"in account)return account.loan}),ref=reactExports.useRef(loan??{}),[error,setError]=reactExports.useState({});return jsx(Paper,{elevation:3,sx:{padding:2},children:jsxs(Stack,{spacing:1,children:[jsx(DatePicker,{defaultValue:(_a=ref.current)!=null&&_a.firstPaymentDate?DateTime.fromISO(ref.current.firstPaymentDate):null,label:"First Payment",slotProps:{textField:{error:!!error.firstPaymentDate}},onChange:value=>{value&&(ref.current.firstPaymentDate=value.toISO())}}),jsx(TextField,{error:!!error.principal,defaultValue:loan==null?void 0:loan.principal,onChange:event=>{ref.current.principal=+event.target.value},variant:"outlined",label:"Principal",type:"number"}),jsx(TextField,{error:!!error.ratePct,defaultValue:loan==null?void 0:loan.ratePct,onChange:event=>{ref.current.ratePct=convertPct(+event.target.value)},variant:"outlined",label:"Rate",type:"number"}),jsx(TextField,{error:!!error.paymentsPerYear,defaultValue:loan==null?void 0:loan.paymentsPerYear,onChange:event=>{ref.current.paymentsPerYear=+event.target.value},variant:"outlined",label:"Payments Per Year",type:"number"}),jsx(TextField,{defaultValue:loan==null?void 0:loan.payment,error:!!error.payment,onChange:event=>{ref.current.payment=+event.target.value},variant:"outlined",label:"Payment",type:"number"}),jsx(TextField,{defaultValue:loan==null?void 0:loan.ownershipPct,error:!!error.ownershipPct,onChange:event=>{ref.current.ownershipPct=convertPct(+event.target.value)},variant:"outlined",label:"Ownership (%)",type:"number"}),jsx(Button,{onClick:()=>{const parsed=validator.safeParse(ref.current);if(parsed.success)setError({}),store.setState(prev=>create(prev,next=>{next.wealth[accountName].loan=parsed.data}));else{const issues=groupBy(parsed.error.issues,x=>x.path.join(""));setError(issues)}},children:"Set Loan"})]})})},"AddLoan"),AddEntry=__name(props=>{const{accountName}=props,ref=reactExports.useRef({date:DateTime.local(),value:0}),onAddEntry=__name(()=>{const{date,value}=ref.current;!date||!value||store.setState(prev=>create(prev,next=>{next.wealth[accountName].data.push({date:date.toISO(),value,id:v4()})}))},"onAddEntry");return jsx(Paper,{elevation:3,sx:{padding:2},children:jsxs(Stack$1,{spacing:1,children:[jsx(DatePicker,{defaultValue:DateTime.local(),onChange:date=>{date&&(ref.current.date=date)}}),jsx(TextField,{label:"Home value",type:"numeric",onChange:event=>{ref.current.value=+event.target.value}}),jsx(Button,{onClick:onAddEntry,children:"Add Home Value"})]})})},"AddEntry"),MortgageTab=__name(props=>{const{accountName}=props,account=useStore(store,state=>state.wealth[accountName]),allAccounts=useStore(store,x=>x.wealth),accountColumnConfig=reactExports.useMemo(()=>createAccountColumnConfig$1(accountName),[accountName]),mortgageData=reactExports.useMemo(()=>account!=null&&account.loan?getGraphDates(Object.values(allAccounts)).map(date=>({date,balance:calcLoanBalance(date,account.loan)})):[],[account.loan,allAccounts]);return jsxs(Grid,{container:!0,height:"100%",width:"100%",padding:1,spacing:2,children:[jsx(Grid,{xs:3,children:jsx(AgGrid,{reactiveCustomComponents:!0,rowData:(account==null?void 0:account.data)??[],columnDefs:accountColumnConfig,id:account+"-history"})}),jsx(Grid,{xs:3,children:jsx(AgGrid,{rowData:mortgageData,columnDefs:mortgageColumnConfig,id:account+"-history"})}),jsx(Grid,{xs:6,children:jsx("div",{children:jsxs(Grid,{container:!0,spacing:2,children:[jsx(Grid,{xs:3,children:jsx(AddLoan,{accountName})}),jsx(Grid,{xs:3,children:jsx(AddEntry,{accountName})}),jsx(Grid,{xs:3}),jsx(Grid,{xs:3,children:jsxs(Stack$1,{spacing:2,children:[jsx(DeleteAccount,{accountName}),jsx(RenameAccount,{accountName})]})})]})})})]})},"MortgageTab"),AccountTabs=__name(()=>{var _a,_b,_c;const accounts=useStore(store,x=>x.wealth),firstAccount=((_a=Object.keys(accounts))==null?void 0:_a[0])??"",[account,setAccount]=reactExports.useState(firstAccount);return reactExports.useEffect(()=>{var _a2;accounts[account]||setAccount(((_a2=Object.keys(accounts))==null?void 0:_a2[0])??"")},[account,accounts]),jsxs(Box,{display:"flex",flexDirection:"column",width:"100%",height:"100%",children:[jsx(Box,{display:"flex",flex:"0 1 auto",children:jsxs(Tabs,{value:account,defaultValue:firstAccount,onChange:(_,value)=>{setAccount(value)},children:[Object.keys(accounts).map(account2=>jsx(Tab,{value:account2,label:account2},account2)),jsx(Tab,{component:NewAccount})]})}),jsxs(Box,{flex:"1 1 auto",children:[((_b=accounts[account])==null?void 0:_b.type)==="account"&&jsx(AccountTab,{accountName:account}),((_c=accounts[account])==null?void 0:_c.type)==="mortgage"&&jsx(MortgageTab,{accountName:account})]})]})},"AccountTabs"),NetWealth=__name(()=>jsxs(Grid,{container:!0,height:"100%",width:"100%",children:[jsx(Grid,{xs:12,height:"50%",children:jsx(WealthChart,{})}),jsx(Grid,{xs:12,height:"50%",children:jsx(AccountTabs,{})})]}),"NetWealth"),valueByDateRange=__name(account=>account.toSorted(sortByDate(x=>DateTime.fromISO(x.date),"asc")).map((x,index,array)=>{const next=array[index+1];return[DateTime.fromISO(x.date),(next!=null&&next.date?DateTime.fromISO(next==null?void 0:next.date).startOf("day"):DateTime.fromISO(x.date).startOf("day").plus({years:1})).minus({days:1}),x.value]}),"valueByDateRange"),useBaseIncome=__name((startDate,endDate)=>{const timeSeries=useStore(store,x=>x.projectedIncome.timeSeries),baseIncome=timeSeries.monthlyIncome,lastMerit=reactExports.useMemo(()=>{var _a;const endOfYear=DateTime.fromObject({day:31,month:12});return 1+(((_a=findNearstOnOrBefore(endOfYear,timeSeries.meritIncreasePct))==null?void 0:_a.value)??0)},[timeSeries.meritIncreasePct]);return reactExports.useMemo(()=>{const payPerPeriod=valueByDateRange(baseIncome),mostRecentPay=payPerPeriod.length>0?payPerPeriod[payPerPeriod.length-1]:[startDate,endDate,1],projectedPayPerPeriod=Array(10).fill(mostRecentPay).map(([start,end,value],index)=>{var _a;const startDate2=start.plus({years:index+1});return[startDate2,end.plus({years:index+1}),value*(lastMerit+(((_a=findSameYear(startDate2,timeSeries.equityPct))==null?void 0:_a.value)??0))**(index+1)]}),incomePerPeriod=[...payPerPeriod,...projectedPayPerPeriod].filter(([start,end])=>{const rangeOutside=startDate<=start&&endDate>=end,rangeInside=startDate>=start&&end>=endDate,overlapEnd=startDate<=start&&endDate<end&&endDate>start,overlapStart=startDate<=end&&startDate>=start&&endDate>end;return rangeInside||rangeOutside||overlapEnd||overlapStart}).map(([start,end,value])=>[DateTime.max(start,startDate),DateTime.min(end,endDate),value]).map(([start,end,value])=>end.diff(start,"weeks").weeks/2*value);return Math.round(incomePerPeriod.reduce((acc,curr)=>acc+curr,0))},[baseIncome,startDate,endDate,lastMerit,timeSeries.equityPct])},"useBaseIncome"),minMaxAvg=__name(values=>values.length===0?{min:0,max:0,avg:0}:values.reduce((acc,curr,index,arr)=>{const{min,max,avg}=acc;return{min:Math.min(curr,min),max:Math.max(curr,max),avg:index===arr.length-1?(avg+curr)/arr.length:avg+curr}},{min:1/0,max:0,avg:0}),"minMaxAvg"),outcomeFromSingle=__name(value=>({min:value,max:value,avg:value,actual:value}),"outcomeFromSingle"),scaleOutcome=__name((outcome,value)=>({min:outcome.min*value,max:outcome.max*value,avg:outcome.avg*value,actual:outcome.actual?outcome.actual*value:void 0}),"scaleOutcome"),AddOutcome=__name((...outcomes)=>{const everyActualDefined=outcomes.every(x=>x.actual!=null);return outcomes.reduce((acc,curr)=>({min:acc.min+curr.min,avg:acc.avg+curr.avg,max:acc.max+curr.max,actual:everyActualDefined?(acc.actual??0)+(curr.actual??0):void 0}),{min:0,max:0,avg:0,actual:void 0})},"AddOutcome"),useAprilBonus=__name(year=>{const payedOn=reactExports.useMemo(()=>DateTime.fromObject({day:15,month:4,year}),[year]),timeSeries=useStore(store,x=>x.projectedIncome.timeSeries),income=useBaseIncome(DateTime.fromObject({day:1,month:1,year:year-1}),DateTime.fromObject({day:1,month:1,year})),bonusAmmount=reactExports.useMemo(()=>{var _a;return(_a=findSameYear(payedOn,timeSeries.meritBonus))==null?void 0:_a.value},[payedOn,timeSeries.meritBonus]),bonusPercent2=reactExports.useMemo(()=>{var _a;return(_a=findSameYear(payedOn,timeSeries.meritBonusPct))==null?void 0:_a.value},[payedOn,timeSeries.meritBonusPct]);return reactExports.useMemo(()=>{const meritOutcome=minMaxAvg(timeSeries.meritBonusPct.filter(x=>DateTime.fromISO(x.date).year<=year).slice(-3).map(x=>x.value));return{percent:{...meritOutcome,actual:bonusPercent2},cash:{...scaleOutcome(meritOutcome,income),actual:bonusAmmount}}},[bonusAmmount,bonusPercent2,income,timeSeries.meritBonusPct,year])},"useAprilBonus"),useJuneBonus=__name(year=>{const payedOn=reactExports.useMemo(()=>DateTime.fromObject({day:15,month:6,year}),[year]),timeseries=useStore(store,x=>x.projectedIncome.timeSeries),income=useBaseIncome(DateTime.fromObject({day:1,month:4,year:year-1}),DateTime.fromObject({day:31,month:3,year}));return reactExports.useMemo(()=>{const mostRecentBonus=findSameYear(payedOn,timeseries.companyBonus),mostRecentPercent=findSameYear(payedOn,timeseries.companyBonusPct),meritFactor=timeseries.meritBonusPct.filter(x=>DateTime.fromISO(x.date).year<=year).slice(-3).reduce((acc,curr)=>acc+curr.value,0),outcomes=minMaxAvg(timeseries.companyBonusPct.map(x=>x.value)),cash=scaleOutcome(outcomes,meritFactor*income);return{percent:{...outcomes,actual:mostRecentPercent==null?void 0:mostRecentPercent.value},cash:{...cash,actual:mostRecentBonus==null?void 0:mostRecentBonus.value}}},[income,payedOn,timeseries.companyBonus,timeseries.companyBonusPct,timeseries.meritBonusPct,year])},"useJuneBonus"),bonusPercent=.15,useJulyBonus=__name(year=>{const payDay=reactExports.useMemo(()=>DateTime.fromObject({day:15,month:7,year}),[year]),actual=useStore(store,x=>{var _a;return(_a=findSameYear(payDay,x.projectedIncome.timeSeries.retirementBonus))==null?void 0:_a.value}),income=useBaseIncome(DateTime.fromObject({day:1,month:7,year:year-1}),DateTime.fromObject({day:1,month:7,year})),meritBonus=useAprilBonus(year),juneBonus=useJuneBonus(year);return reactExports.useMemo(()=>{const eligbleIncome=outcomeFromSingle(income),outcome=scaleOutcome(AddOutcome(eligbleIncome,meritBonus.cash,juneBonus.cash),bonusPercent);return{...outcome,actual:actual??outcome.actual}},[actual,income,juneBonus.cash,meritBonus.cash])},"useJulyBonus"),Value=__name(props=>{const{children,secondaryValue,title}=props;return jsxs(Box,{sx:{display:"flex",minWidth:106,height:64,padding:"0px 8px",flexDirection:"column",justifyContent:"center",alignItems:"flex-start",gap:.5,flexShrink:0},children:[jsxs(Box,{display:"flex",alignItems:"center",gap:.5,children:[jsx(Box,{fontSize:18,fontWeight:700,lineHeight:"20px",children:children||"??"}),!!secondaryValue&&jsx(Box,{alignSelf:"flex-end",fontSize:12,fontWeight:500,lineHeight:"16px",textTransform:"uppercase",color:"#888",children:secondaryValue})]}),jsx(Box,{fontSize:12,fontWeight:500,lineHeight:"16px",textTransform:"uppercase",children:title})]})},"Value"),Cash=__name(({value})=>value?formatCashShort(value):null,"Cash"),Duration=__name(({dateTime,children})=>{const countDownStr=reactExports.useMemo(()=>dateTime.diffNow(["months","days","hours"]).toFormat("d'd'"),[dateTime]),countDownColor=reactExports.useMemo(()=>{const days=dateTime.diffNow("days").days;return days<30?"green":days<60?"yellow":"red"},[dateTime]);return dateTime>DateTime.local()?jsx(Box,{color:countDownColor,children:countDownStr}):children},"Duration"),formatPercent=new Intl.NumberFormat("en-us",{style:"percent",maximumFractionDigits:1}).format,Percent=__name(({value})=>formatPercent(value),"Percent"),Until=__name(props=>{const{dateTime,children}=props;return DateTime.local()<dateTime&&children},"Until"),BonusOutcome=__name(props=>{const{outcome,title,payDate}=props;return jsxs(Box,{sx:{border:"1px solid rgba(255,255,255,0.1)",borderRadius:2},children:[jsx(Typography,{sx:{paddingBottom:1,paddingLeft:2,paddingTop:1},variant:"h5",children:title}),jsx(Divider,{}),jsxs(Stack,{padding:1,direction:"row",spacing:.5,children:[jsx(Value,{secondaryValue:jsx(Percent,{value:outcome.percent.min}),title:"min",children:jsx(Cash,{value:outcome.cash.min})}),jsx(Value,{secondaryValue:jsx(Percent,{value:outcome.percent.avg}),title:"avg",children:jsx(Cash,{value:outcome.cash.avg})}),jsx(Value,{secondaryValue:jsx(Percent,{value:outcome.percent.max}),title:"max",children:jsx(Cash,{value:outcome.cash.max})}),jsx(Value,{title:"Actual",secondaryValue:jsx(Until,{dateTime:payDate,children:jsx(Cash,{value:outcome.cash.actual})}),children:jsx(Duration,{dateTime:payDate,children:jsx(Cash,{value:outcome.cash.actual})})})]})]})},"BonusOutcome"),Outcome=__name(props=>{const{outcome,title,payDate}=props;return jsxs(Box,{sx:{border:"1px solid rgba(255,255,255,0.1)",borderRadius:2},children:[jsx(Typography,{sx:{paddingBottom:1,paddingLeft:2,paddingTop:1},variant:"h5",children:title}),jsx(Divider,{}),jsxs(Stack,{padding:1,direction:"row",spacing:.5,children:[jsx(Value,{title:"min",children:jsx(Cash,{value:outcome.min})}),jsx(Value,{title:"avg",children:jsx(Cash,{value:outcome.avg})}),jsx(Value,{title:"max",children:jsx(Cash,{value:outcome.max})}),payDate&&jsx(Value,{title:"Actual",secondaryValue:jsx(Until,{dateTime:payDate,children:jsx(Cash,{value:outcome.actual})}),children:jsx(Duration,{dateTime:payDate,children:jsx(Cash,{value:outcome.actual})})})]})]})},"Outcome"),MeritOutcome=__name(props=>{const{title,payDate}=props,income=useStore(store,x=>findNearstOnOrBefore(payDate,x.projectedIncome.timeSeries.monthlyIncome)),meritPct=useStore(store,x=>payDate&&findNearstOnOrBefore(payDate,x.projectedIncome.timeSeries.meritIncreasePct)),equityPct=useStore(store,x=>payDate&&findSameYear(payDate,x.projectedIncome.timeSeries.equityPct)),totalAdjust=((meritPct==null?void 0:meritPct.value)??0)+((equityPct==null?void 0:equityPct.value)??0),multiplier=DateTime.local()<payDate?1+totalAdjust:1;return jsxs(Box,{sx:{border:"1px solid rgba(255,255,255,0.1)",borderRadius:2},children:[jsx(Typography,{sx:{paddingBottom:1,paddingLeft:2,paddingTop:1},variant:"h5",children:title}),jsx(Divider,{}),jsxs(Stack,{padding:1,direction:"row",spacing:.5,children:[jsx(Value,{title:"Monthly",secondaryValue:jsx(Percent,{value:totalAdjust}),children:jsx(Cash,{value:((income==null?void 0:income.value)??0)*multiplier})}),jsx(Value,{title:"Base Pay",secondaryValue:jsx(Percent,{value:totalAdjust}),children:jsx(Cash,{value:((income==null?void 0:income.value)??0)*multiplier*26})}),jsx(Value,{title:"Actual",secondaryValue:jsx(Until,{dateTime:payDate,children:jsx(Percent,{value:totalAdjust})}),children:jsx(Duration,{dateTime:payDate,children:jsx(Percent,{value:totalAdjust})})})]})]})},"MeritOutcome"),createAccountColumnConfig=__name((accountName,variant)=>[{headerName:"Date",sort:"desc",valueFormatter:x=>{var _a;return(_a=x.value)==null?void 0:_a.toFormat(shortDate)},valueGetter:x=>x.data&&DateTime.fromISO(x.data.date),cellRenderer:x=>jsxs(Stack$1,{direction:"row",alignItems:"center",children:[x.valueFormatted," ",x.value&&x.value>DateTime.local()&&jsx(Tooltip,{title:"Future Event",children:jsx(default_1$1,{htmlColor:"yellow"})})]})},{headerName:"Value",valueGetter:x=>{var _a;return(_a=x.data)==null?void 0:_a.value},valueFormatter:x=>variant==="number"?x.value:variant==="cash"?formatCash(x.value):(x.value*100).toFixed(2)+"%",type:"numericColumn",editable:!0,cellEditor:"agNumberCellEditor",valueSetter:x=>(store.setState(prev=>create(prev,next2=>{const account=next2.projectedIncome.timeSeries[accountName],idx=account.findIndex(({id})=>id===x.data.id);account[idx].value=+x.newValue})),!0)},{headerName:"Actions",cellRenderer:props=>jsx(Button,{onClick:()=>{store.setState(prev=>create(prev,next=>{const idxToRemove=next.projectedIncome.timeSeries[accountName].findIndex(x=>{var _a;return x.id===((_a=props.data)==null?void 0:_a.id)});next.projectedIncome.timeSeries[accountName].splice(idxToRemove,1)}))},color:"error",children:jsx(default_1,{})})}],"createAccountColumnConfig"),DataEntry=__name(props=>{const{accountName,defaultDate,variant="number"}=props,account=useStore(store,state=>state.projectedIncome.timeSeries[accountName]),[date,setDate]=reactExports.useState(defaultDate),[amount,setAmount]=reactExports.useState(null),hasSameDate=reactExports.useMemo(()=>!!(account!=null&&account.find(x=>date.hasSame(DateTime.fromISO(x.date),"day"))),[account,date]),onAddEntry=__name(()=>{amount!=null&&store.setState(prev=>create(prev,next=>{next.projectedIncome.timeSeries[accountName]=next.projectedIncome.timeSeries[accountName].concat({date:date.toString(),value:variant==="percent"?amount/100:amount,id:v4()}).sort(sortByDate(x=>DateTime.fromISO(x.date),"asc"))}))},"onAddEntry"),accountColumnConfig=reactExports.useMemo(()=>createAccountColumnConfig(accountName,variant),[accountName,variant]);return jsxs(Box,{display:"flex",flexDirection:"column",height:"100%",children:[jsxs(Stack,{spacing:2,flex:"0 1 auto",children:[jsx(DatePicker,{format:shortDate,sx:{color:"white"},label:"Date",value:date,onChange:value=>{console.log(value),value&&setDate(value)}}),jsx(TextField,{label:"amount",value:amount??"",type:"number",onChange:event=>event.target.value===""?setAmount(null):setAmount(+event.target.value),InputProps:{startAdornment:variant!=="number"&&jsx(InputAdornment,{position:"start",children:variant==="cash"?"$":"%"})}}),jsx(Button,{disabled:amount===null||!date||hasSameDate,onClick:onAddEntry,children:"Add Entry"})]}),jsx(Box,{sx:{paddingTop:2,flex:"1 1 auto"},children:jsx(AgGrid,{reactiveCustomComponents:!0,rowData:account??[],columnDefs:accountColumnConfig,id:account+"-history",autoSizeStrategy:{type:"fitGridWidth"},stopEditingWhenCellsLoseFocus:!0})})]})},"DataEntry"),Layout=__name(props=>{const{title,accountName,defaultDate,variant}=props;return jsx(Paper,{sx:{padding:2,height:"100%",width:450,flexShrink:0},children:jsxs(Box,{display:"flex",flexDirection:"column",height:"100%",children:[jsx(Box,{flex:"0 1 auto",marginBottom:2,children:jsx(Typography,{sx:{marginBottom:2},variant:"h5",children:title})}),jsx(Box,{flex:"1 1 auto",children:jsx(DataEntry,{variant,accountName,defaultDate})})]})})},"Layout"),ProjectedIncome=__name(()=>{const[year,setYear]=reactExports.useState(DateTime.local().year),income=useBaseIncome(DateTime.fromObject({day:1,month:1,year}),DateTime.fromObject({day:1,month:1,year:year+1})),junePayDay=reactExports.useMemo(()=>DateTime.fromObject({day:15,month:6,year}),[year]),meritPayDay=reactExports.useMemo(()=>DateTime.fromObject({day:15,month:4,year}),[year]),meritIncreaseDay=reactExports.useMemo(()=>DateTime.fromObject({day:1,month:4,year}),[year]),julyPayDay=reactExports.useMemo(()=>DateTime.fromObject({day:15,month:7,year}),[year]),meritBonus=useAprilBonus(year),juneBonus=useJuneBonus(year),julyBonus=useJulyBonus(year),incomeOutcome=reactExports.useMemo(()=>AddOutcome(outcomeFromSingle(income),meritBonus.cash,juneBonus.cash,julyBonus),[income,julyBonus,juneBonus,meritBonus]);return jsxs(Box$1,{display:"flex",flexDirection:"column",height:"100%",gap:2,children:[jsx(Box$1,{flex:"0 1 auto",children:jsxs(Stack$1,{gap:2,direction:"row",overflow:"auto",children:[jsx(Outcome,{title:jsxs(Box$1,{display:"flex",alignItems:"center",gap:2,width:"100%",children:[jsx("span",{children:"Projected Income"}),jsx(DatePicker,{sx:{width:90,marginLeft:"auto",marginRight:2},label:"year",views:["year"],defaultValue:DateTime.local(),slotProps:{textField:{variant:"standard",label:""}},onYearChange:year2=>{setYear(year2.year)}})]}),outcome:incomeOutcome,payDate:junePayDay}),jsx(MeritOutcome,{title:"Merit Increase",payDate:meritIncreaseDay}),jsx(BonusOutcome,{title:"Merit Bonus",outcome:meritBonus,payDate:meritPayDay}),jsx(BonusOutcome,{title:"Company Bonus",outcome:juneBonus,payDate:junePayDay}),jsx(Outcome,{title:"Retirement Bonus",outcome:julyBonus,payDate:julyPayDay})]})}),jsx(Box$1,{flex:"1 1 auto",children:jsx(Box$1,{overflow:"auto",width:"100%",height:"100%",children:jsxs(Box$1,{height:"100%",display:"flex",gap:2,flexWrap:"nowrap",flexShrink:0,children:[jsx(Layout,{accountName:"monthlyIncome",variant:"cash",defaultDate:DateTime.fromObject({day:1,month:4}),title:"Income Per Check ($)"}),jsx(Layout,{title:"Merit Increase (%)",accountName:"meritIncreasePct",variant:"percent",defaultDate:meritIncreaseDay}),jsx(Layout,{title:"Equity Increase (%)",accountName:"equityPct",variant:"percent",defaultDate:meritIncreaseDay}),jsx(Layout,{title:"Merit Bonus (%)",accountName:"meritBonusPct",variant:"percent",defaultDate:meritPayDay}),jsx(Layout,{title:"Merit Bonus ($)",accountName:"meritBonus",variant:"cash",defaultDate:meritPayDay}),jsx(Layout,{title:"Company Bonus Factor (%)",accountName:"companyBonusPct",defaultDate:junePayDay,variant:"percent"}),jsx(Layout,{title:"Company Bonus ($)",accountName:"companyBonus",defaultDate:junePayDay,variant:"cash"}),jsx(Layout,{title:"Retirement Bonus ($)",accountName:"retirementBonus",defaultDate:julyPayDay,variant:"cash"})]})})})]})},"ProjectedIncome"),App=__name(()=>{const[tab,setTab]=reactExports.useState("projected-income");return jsxs(Fragment,{children:[jsxs(Tabs,{value:tab,onChange:(_,value)=>setTab(value),children:[jsx(Tab,{value:"wealth",label:"Total Wealth"}),jsx(Tab,{value:"projected-income",label:"Projected Income"}),jsx(Tab,{disabled:!0,value:"projected-wealth",label:"Projected Wealth"})]}),jsxs(Box,{padding:2,height:"95%",width:"100%",children:[tab==="wealth"&&jsx(NetWealth,{}),tab==="projected-income"&&jsx(ProjectedIncome,{})]})]})},"App"),darkTheme=createTheme({palette:{mode:"dark"}});client.createRoot(document.getElementById("root")).render(jsx(React.StrictMode,{children:jsx(ErrorBoundary,{fallbackRender:props=>jsxs(Fragment,{children:[jsx("div",{style:{backgroundColor:"#FFF"},children:props.error.message}),jsx("div",{style:{backgroundColor:"#FFF"},children:props.error.stackTrace})]}),children:jsx(LocalizationProvider,{dateAdapter:AdapterLuxon,children:jsxs(ThemeProvider,{theme:darkTheme,children:[jsx(CssBaseline,{}),jsx(App,{})]})})})}));
//# sourceMappingURL=index-LgT_QRCt.js.map
