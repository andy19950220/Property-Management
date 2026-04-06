import { useState, useEffect, useCallback, useRef } from "react";

const HK_COMPLIANCE_TEMPLATE = [
  {
    category: "消防安全", icon: "🔥", color: "#E24B4A",
    items: [
      { id: "fire-1", name: "消防装置及设备年检", agency: "消防处 FSD", freq: "每年", freqDays: 365, executor: "注册承办商", law: "Cap.95B" },
      { id: "fire-2", name: "消防演习与疏散演练", agency: "消防处 FSD", freq: "每半年", freqDays: 183, executor: "内外协作", law: "FSD" },
      { id: "fire-3", name: "防烟门检查维护", agency: "消防处 FSD", freq: "每月", freqDays: 30, executor: "管理处", law: "Cap.95" },
      { id: "fire-4", name: "逃生通道畅通检查", agency: "消防处 FSD", freq: "每月", freqDays: 30, executor: "管理处", law: "Cap.95" },
      { id: "fire-5", name: "灭火器检查与更换", agency: "消防处 FSD", freq: "每年", freqDays: 365, executor: "注册承办商", law: "Cap.95B" },
    ]
  },
  {
    category: "建筑结构", icon: "🏗️", color: "#378ADD",
    items: [
      { id: "bld-1", name: "强制验楼计划 (MBIS)", agency: "屋宇署 BD", freq: "每10年", freqDays: 3650, executor: "注册检验员 RI", law: "Cap.123P", condition: "楼龄≥30年" },
      { id: "bld-2", name: "强制验窗计划 (MWIS)", agency: "屋宇署 BD", freq: "每5年", freqDays: 1825, executor: "合资格人士 QP", law: "Cap.123P", condition: "楼龄≥10年" },
      { id: "bld-3", name: "斜坡安全维护", agency: "土木工程拓展署", freq: "每年", freqDays: 365, executor: "岩土工程师", law: "Cap.123" },
    ]
  },
  {
    category: "电梯与扶梯", icon: "🛗", color: "#1D9E75",
    items: [
      { id: "lift-1", name: "电梯全面检查及认证", agency: "机电工程署 EMSD", freq: "每年", freqDays: 365, executor: "注册工程师 RE", law: "Cap.618" },
      { id: "lift-2", name: "自动扶梯全面检查", agency: "EMSD", freq: "每6个月", freqDays: 183, executor: "注册工程师 RE", law: "Cap.618" },
      { id: "lift-3", name: "电梯/扶梯日常维保", agency: "EMSD", freq: "每月", freqDays: 30, executor: "注册承办商 RC", law: "Cap.618" },
      { id: "lift-4", name: "电梯使用许可证更新", agency: "EMSD", freq: "每年", freqDays: 365, executor: "内外协作", law: "Cap.618" },
    ]
  },
  {
    category: "电气与燃气", icon: "⚡", color: "#BA7517",
    items: [
      { id: "elec-1", name: "固定电气装置定期检测 (PITC)", agency: "EMSD", freq: "每5年", freqDays: 1825, executor: "注册电业承办商", law: "Cap.406E", condition: "负载>100A" },
      { id: "elec-2", name: "燃气装置安全检查", agency: "EMSD", freq: "每年", freqDays: 365, executor: "注册燃气承办商", law: "Cap.51" },
      { id: "elec-3", name: "建筑物能源审计", agency: "EMSD", freq: "每10年", freqDays: 3650, executor: "注册能源评审师", law: "Cap.610" },
    ]
  },
  {
    category: "大厦管理 (BMO)", icon: "🏘️", color: "#534AB7",
    items: [
      { id: "bmo-1", name: "业主立案法团 (OC) 周年大会", agency: "民政事务处 HAD", freq: "每年", freqDays: 365, executor: "管理处/OC", law: "Cap.344" },
      { id: "bmo-2", name: "经审计的财务报告", agency: "Cap.344", freq: "每年", freqDays: 365, executor: "注册核数师", law: "Cap.344" },
      { id: "bmo-3", name: "第三者风险保险续保", agency: "Cap.344", freq: "每年", freqDays: 365, executor: "内外协作", law: "Cap.344 §28" },
      { id: "bmo-4", name: "采购合规（招标/记录）", agency: "Cap.344 修订 2024", freq: "每次采购", freqDays: 0, executor: "管委会", law: "BMO 2024" },
    ]
  },
  {
    category: "物管牌照", icon: "📋", color: "#D4537E",
    items: [
      { id: "lic-1", name: "物业管理公司牌照 (PMC)", agency: "物管监管局 PMSA", freq: "每3年", freqDays: 1095, executor: "物管公司", law: "Cap.626" },
      { id: "lic-2", name: "物业管理人牌照 (PMP)", agency: "PMSA", freq: "每3年", freqDays: 1095, executor: "个人", law: "Cap.626" },
      { id: "lic-3", name: "持续专业进修 (CPD)", agency: "PMSA", freq: "每年", freqDays: 365, executor: "个人", law: "Cap.626" },
    ]
  },
  {
    category: "环境卫生", icon: "🌿", color: "#639922",
    items: [
      { id: "env-1", name: "食水水箱清洗", agency: "水务署 WSD", freq: "每季度", freqDays: 90, executor: "持牌水喉匠", law: "WSD" },
      { id: "env-2", name: "虫鼠防治", agency: "食环署 FEHD", freq: "每月", freqDays: 30, executor: "灭虫公司", law: "FEHD" },
      { id: "env-3", name: "渠管清洁与检查", agency: "屋宇署/食环署", freq: "每季度", freqDays: 90, executor: "注册承办商", law: "BD/FEHD" },
      { id: "env-4", name: "泳池水质检测", agency: "康文署 LCSD", freq: "每月", freqDays: 30, executor: "持牌承办商", law: "LCSD" },
    ]
  },
  {
    category: "税务与劳工", icon: "💰", color: "#D85A30",
    items: [
      { id: "tax-1", name: "利得税报税", agency: "税务局 IRD", freq: "每年", freqDays: 365, executor: "会计师", law: "IRD" },
      { id: "tax-2", name: "差饷及地租缴纳", agency: "差饷物业估价署", freq: "每季度", freqDays: 90, executor: "管理处", law: "RVD" },
      { id: "tax-3", name: "强积金 (MPF) 供款", agency: "积金局 MPFA", freq: "每月", freqDays: 30, executor: "管理处", law: "MPFA" },
      { id: "tax-4", name: "雇员补偿保险续保", agency: "Cap.282", freq: "每年", freqDays: 365, executor: "内外协作", law: "Cap.282" },
    ]
  },
];

function fmt(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
function generateId(){return Date.now().toString(36)+Math.random().toString(36).substr(2,5);}
function formatDate(d){if(!d)return"";return fmt(new Date(d));}
function daysUntil(s){if(!s)return null;const n=new Date();n.setHours(0,0,0,0);const t=new Date(s);t.setHours(0,0,0,0);return Math.ceil((t-n)/864e5);}
const MN=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const lbl={fontSize:12,color:"#888780",display:"block",marginBottom:4};
const inp={width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #d3d1c7",fontSize:14,boxSizing:"border-box"};
const ls={fontSize:11,color:"#888780",display:"block",marginBottom:3};
const is={width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #d3d1c7",fontSize:13,boxSizing:"border-box"};
const bo={padding:"8px 20px",borderRadius:8,border:"1px solid #d3d1c7",background:"#fff",cursor:"pointer",fontSize:13};
const bp={padding:"8px 20px",borderRadius:8,border:"none",background:"#2c2c2a",color:"#fff",cursor:"pointer",fontSize:13};
const ss={padding:"6px 10px",borderRadius:8,border:"1px solid #d3d1c7",fontSize:12};

function generateDemoData(){
  const props=[
    {id:"demo-1",name:"海景花园",address:"九龙尖沙咀弥敦道188号",type:"residential",buildingAge:"38",lifts:4,escalators:0,hasPool:true,hasSlope:false},
    {id:"demo-2",name:"富豪商业中心",address:"香港中环德辅道中68号",type:"commercial",buildingAge:"25",lifts:6,escalators:2,hasPool:false,hasSlope:false},
  ];
  const vd={"fire":{vendor:"信安消防工程有限公司",contractNo:"FS-2024-001"},"lift":{vendor:"奥的斯电梯(香港)有限公司",contractNo:"LT-2024-088"},"elec":{vendor:"中华电力工程服务",contractNo:"EE-2023-015"},"env":{vendor:"碧瑶绿色集团",contractNo:"ENV-2024-032"},"bld":{vendor:"联力建筑顾问有限公司",contractNo:"BD-2022-006"},"bmo":{vendor:"德勤会计师事务所",contractNo:"AU-2024-011"},"tax":{vendor:"毕马威会计师事务所",contractNo:"TX-2024-003"},"lic":{vendor:"",contractNo:""}};
  const comp={},hist=[];const now=new Date();
  props.forEach(p=>{HK_COMPLIANCE_TEMPLATE.forEach(cat=>{cat.items.forEach(item=>{
    const key=`${p.id}_${item.id}`,px=item.id.split("-")[0],v=vd[px]||{};
    const r=Math.random();let status,lc,dd,notes="";const ff=[];
    if(r<0.45){status="completed";const da=Math.floor(Math.random()*180)+10;const lcd=new Date(now);lcd.setDate(lcd.getDate()-da);lc=fmt(lcd);const ddd=new Date(lcd);ddd.setDate(ddd.getDate()+(item.freqDays||365));dd=fmt(ddd);
      notes=["检查合格，无异常","已通过检测","报告已存档","证书已更新","检查完毕，结果良好"][Math.floor(Math.random()*5)];
      ff.push({name:`${item.name}_报告_${lc}.pdf`,type:"application/pdf",size:`${Math.floor(Math.random()*900+100)}KB`,uploadDate:lc});
      if(Math.random()>0.5)ff.push({name:`${item.name}_证书_${lc}.pdf`,type:"application/pdf",size:`${Math.floor(Math.random()*500+50)}KB`,uploadDate:lc});
      const he={id:`h-${key}-${da}`,propertyId:p.id,propertyName:p.name,itemId:item.id,itemName:item.name,category:cat.category,categoryIcon:cat.icon,executor:item.executor,agency:item.agency,completedDate:lc,vendor:v.vendor||"",contractNo:v.contractNo||"",notes,fileCount:ff.length,fileNames:ff.map(f=>f.name),loggedAt:lcd.toISOString()};
      hist.push(he);
      if(item.freqDays>0&&item.freqDays<=365){const pd=new Date(lcd);pd.setFullYear(pd.getFullYear()-1);const ps=fmt(pd);hist.push({...he,id:`h-${key}-p1`,completedDate:ps,fileNames:[`${item.name}_报告_${ps}.pdf`],fileCount:1,loggedAt:pd.toISOString(),notes:["检查合格","已通过","证书已续期"][Math.floor(Math.random()*3)]});
        if(Math.random()>0.3){const p2=new Date(pd);p2.setFullYear(p2.getFullYear()-1);const p2s=fmt(p2);hist.push({...he,id:`h-${key}-p2`,completedDate:p2s,fileNames:[`${item.name}_报告_${p2s}.pdf`],fileCount:1,loggedAt:p2.toISOString(),notes:"已完成"});}
      }
    }else if(r<0.7){status="pending";const da=Math.floor(Math.random()*400)+200;const lcd=new Date(now);lcd.setDate(lcd.getDate()-da);lc=fmt(lcd);const ddd=new Date(lcd);ddd.setDate(ddd.getDate()+(item.freqDays||365));dd=fmt(ddd);
      hist.push({id:`h-${key}-old`,propertyId:p.id,propertyName:p.name,itemId:item.id,itemName:item.name,category:cat.category,categoryIcon:cat.icon,executor:item.executor,agency:item.agency,completedDate:lc,vendor:v.vendor||"",contractNo:v.contractNo||"",notes:"已完成",fileCount:1,fileNames:[`${item.name}_报告_${lc}.pdf`],loggedAt:lcd.toISOString()});
    }else if(r<0.8){status="in_progress";const da=Math.floor(Math.random()*300)+100;const lcd=new Date(now);lcd.setDate(lcd.getDate()-da);lc=fmt(lcd);const ddd=new Date(now);ddd.setDate(ddd.getDate()+Math.floor(Math.random()*20));dd=fmt(ddd);notes="承办商已安排，待检查";
    }else{status="pending";lc="";dd="";}
    comp[key]={status,lastCompleted:lc||"",dueDate:dd||"",vendor:v.vendor||"",contractNo:v.contractNo||"",notes,files:ff};
  });});});
  // === 2024年示例数据（用于历史记录展示） ===
  const sample2024=[
    {pi:0,cat:"消防安全",icon:"🔥",item:"消防装置及设备年检",iid:"fire-1",exec:"注册承办商",ag:"消防处 FSD",vd:"信安消防工程有限公司",cn:"FS-2024-001",
      recs:[{d:"2024-01-15",n:"年度检查合格，所有消防喉辘正常运作"},{d:"2024-06-10",n:"半年度消防演习完成，疏散时间4分32秒"},{d:"2024-09-05",n:"季度巡查，防烟门全部合格"},{d:"2024-12-18",n:"年终检查完成，证书FS-2024-0412已更新"}]},
    {pi:0,cat:"消防安全",icon:"🔥",item:"灭火器检查与更换",iid:"fire-5",exec:"注册承办商",ag:"消防处 FSD",vd:"信安消防工程有限公司",cn:"FS-2024-001",
      recs:[{d:"2024-03-22",n:"更换3楼灭火筒2个（已过期）"},{d:"2024-08-14",n:"全栋灭火筒例行检查合格"}]},
    {pi:0,cat:"电梯与扶梯",icon:"🛗",item:"电梯全面检查及认证",iid:"lift-1",exec:"注册工程师 RE",ag:"机电工程署 EMSD",vd:"奥的斯电梯(香港)有限公司",cn:"LT-2024-088",
      recs:[{d:"2024-02-08",n:"年度全面检查，4部电梯全部合格"},{d:"2024-04-19",n:"2号电梯摩打继电器更换"},{d:"2024-07-11",n:"季度维保完成"},{d:"2024-10-25",n:"使用许可证续期完成"}]},
    {pi:0,cat:"环境卫生",icon:"🌿",item:"食水水箱清洗",iid:"env-1",exec:"持牌水喉匠",ag:"水务署 WSD",vd:"碧瑶绿色集团",cn:"ENV-2024-032",
      recs:[{d:"2024-01-20",n:"Q1水箱清洗完成，水质检测合格"},{d:"2024-04-15",n:"Q2水箱清洗完成"},{d:"2024-07-22",n:"Q3水箱清洗完成，发现轻微藻类已处理"},{d:"2024-10-10",n:"Q4水箱清洗完成，全年水质报告已存档"}]},
    {pi:0,cat:"环境卫生",icon:"🌿",item:"虫鼠防治",iid:"env-2",exec:"灭虫公司",ag:"食环署 FEHD",vd:"碧瑶绿色集团",cn:"ENV-2024-033",
      recs:[{d:"2024-01-12",n:"1月灭虫处理完成"},{d:"2024-02-09",n:"2月例行处理"},{d:"2024-03-15",n:"3月处理，垃圾房加强处理"},{d:"2024-04-12",n:"4月处理完成"},{d:"2024-05-10",n:"5月处理完成"},{d:"2024-06-14",n:"6月处理，夏季加强灭蚊"},{d:"2024-07-12",n:"7月处理完成"},{d:"2024-08-16",n:"8月处理完成"},{d:"2024-09-13",n:"9月处理完成"},{d:"2024-10-11",n:"10月处理完成"},{d:"2024-11-15",n:"11月处理完成"},{d:"2024-12-13",n:"12月年终处理完成"}]},
    {pi:0,cat:"大厦管理 (BMO)",icon:"🏘️",item:"业主立案法团 (OC) 周年大会",iid:"bmo-1",exec:"管理处/OC",ag:"民政事务处 HAD",vd:"德勤会计师事务所",cn:"AU-2024-011",
      recs:[{d:"2024-03-30",n:"2024年度周年大会完成，出席率72%"},{d:"2024-06-15",n:"经审计财务报告已提交"},{d:"2024-09-01",n:"第三者保险续保完成"}]},
    {pi:0,cat:"税务与劳工",icon:"💰",item:"差饷及地租缴纳",iid:"tax-2",exec:"管理处",ag:"差饷物业估价署",vd:"毕马威会计师事务所",cn:"TX-2024-003",
      recs:[{d:"2024-01-31",n:"Q1差饷已缴纳 $42,800"},{d:"2024-04-30",n:"Q2差饷已缴纳 $42,800"},{d:"2024-07-31",n:"Q3差饷已缴纳 $43,200（已调整）"},{d:"2024-10-31",n:"Q4差饷已缴纳 $43,200"}]},
    {pi:0,cat:"建筑结构",icon:"🏗️",item:"斜坡安全维护",iid:"bld-3",exec:"岩土工程师",ag:"土木工程拓展署",vd:"联力建筑顾问有限公司",cn:"BD-2024-007",
      recs:[{d:"2024-05-20",n:"年度斜坡检查合格，排水系统正常"}]},
    {pi:1,cat:"消防安全",icon:"🔥",item:"消防装置及设备年检",iid:"fire-1",exec:"注册承办商",ag:"消防处 FSD",vd:"信安消防工程有限公司",cn:"FS-2024-002",
      recs:[{d:"2024-02-20",n:"年度检查合格"},{d:"2024-05-18",n:"消防演习完成"},{d:"2024-08-12",n:"半年度检查，5楼灭火筒需更换"},{d:"2024-11-28",n:"年终复查完成，所有设备合规"}]},
    {pi:1,cat:"电梯与扶梯",icon:"🛗",item:"自动扶梯全面检查",iid:"lift-2",exec:"注册工程师 RE",ag:"EMSD",vd:"奥的斯电梯(香港)有限公司",cn:"LT-2024-089",
      recs:[{d:"2024-03-05",n:"2部扶梯全面检查合格"},{d:"2024-06-20",n:"半年检查，1号扶梯需调整速度感应器"},{d:"2024-09-15",n:"维修完成，运作正常"},{d:"2024-12-02",n:"年终检查合格，许可证更新"}]},
    {pi:1,cat:"电气与燃气",icon:"⚡",item:"燃气装置安全检查",iid:"elec-2",exec:"注册燃气承办商",ag:"EMSD",vd:"中华电力工程服务",cn:"EE-2024-016",
      recs:[{d:"2024-04-08",n:"年度燃气检查合格"},{d:"2024-10-22",n:"半年跟进检查完成"}]},
    {pi:1,cat:"环境卫生",icon:"🌿",item:"渠管清洁与检查",iid:"env-3",exec:"注册承办商",ag:"屋宇署/食环署",vd:"碧瑶绿色集团",cn:"ENV-2024-034",
      recs:[{d:"2024-02-28",n:"Q1渠管清洁完成"},{d:"2024-05-25",n:"Q2渠管检查，地库排水口需通渠"},{d:"2024-08-30",n:"Q3渠管清洁完成"},{d:"2024-11-22",n:"Q4渠管清洁完成，年度报告已存档"}]},
    {pi:1,cat:"物管牌照",icon:"📋",item:"持续专业进修 (CPD)",iid:"lic-3",exec:"个人",ag:"PMSA",vd:"",cn:"",
      recs:[{d:"2024-06-30",n:"2024年度CPD时数已完成（20小时）"},{d:"2024-12-15",n:"年度CPD证书已提交物管监管局"}]},
  ];
  sample2024.forEach(s=>{const p=props[s.pi];s.recs.forEach((r,ri)=>{hist.push({id:`h24-${p.id}-${s.iid}-${ri}`,propertyId:p.id,propertyName:p.name,itemId:s.iid,itemName:s.item,category:s.cat,categoryIcon:s.icon,executor:s.exec,agency:s.ag,completedDate:r.d,vendor:s.vd,contractNo:s.cn,notes:r.n,fileCount:1,fileNames:[`${s.item}_报告_${r.d}.pdf`],loggedAt:new Date(r.d).toISOString()});});});

  hist.sort((a,b)=>new Date(b.completedDate)-new Date(a.completedDate));
  return{props,compliance:comp,history:hist};
}

function UploadBtn({onUpload,label}){const ref=useRef();return(
  <label style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:8,border:"1px solid #d3d1c7",background:"#fff",cursor:"pointer",fontSize:12,color:"#5f5e5a",whiteSpace:"nowrap"}}>
    <span style={{fontSize:14}}>📎</span>{label||"上传文件"}
    <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" multiple style={{display:"none"}} onChange={e=>{
      const fl=Array.from(e.target.files||[]);if(!fl.length)return;
      Promise.all(fl.map(f=>new Promise(res=>{const r=new FileReader();r.onload=ev=>{const kb=f.size/1024;res({name:f.name,type:f.type,size:kb>1024?`${(kb/1024).toFixed(1)}MB`:`${Math.round(kb)}KB`,uploadDate:formatDate(new Date()),dataUrl:ev.target.result});};r.readAsDataURL(f);}))).then(onUpload);
      if(ref.current)ref.current.value="";
    }}/>
  </label>
);}

function StatusBadge({status,dueDate}){const d=daysUntil(dueDate);let l,b,f;
  if(status==="completed"){l="✓ 已完成";b="#E1F5EE";f="#0F6E56";}
  else if(status==="not_applicable"){l="不适用";b="#F1EFE8";f="#5F5E5A";}
  else if(status==="in_progress"){l="进行中";b="#E6F1FB";f="#185FA5";}
  else if(!dueDate){l="未设置";b="#F1EFE8";f="#5F5E5A";}
  else if(d!==null&&d<0){l=`逾期 ${Math.abs(d)}天`;b="#FCEBEB";f="#A32D2D";}
  else if(d!==null&&d<=30){l=`${d}天后到期`;b="#FAEEDA";f="#854F0B";}
  else if(d!==null&&d<=90){l=`${d}天后到期`;b="#E6F1FB";f="#185FA5";}
  else{l=`${d}天后到期`;b="#E1F5EE";f="#0F6E56";}
  return <span style={{fontSize:11,padding:"3px 10px",borderRadius:6,background:b,color:f,fontWeight:500,whiteSpace:"nowrap"}}>{l}</span>;
}

function Dashboard({properties:ps,complianceData:cd,onNavigate}){
  const[panel,setPanel]=useState(null);// null | "overdue" | "upcoming"
  const[catFilter,setCatFilter]=useState("all");

  // 收集所有事项及其状态
  const allItems=[];
  ps.forEach(p=>{HK_COMPLIANCE_TEMPLATE.forEach(cat=>{cat.items.forEach(item=>{
    const k=`${p.id}_${item.id}`;const r=cd[k]||{};const d=daysUntil(r.dueDate);
    let urgency="ok";
    if(r.status==="completed")urgency="completed";
    else if(r.status==="not_applicable")urgency="na";
    else if(r.status==="in_progress")urgency="in_progress";
    else if(!r.dueDate)urgency="not_set";
    else if(d<0)urgency="overdue";
    else if(d<=30)urgency="due_soon";
    else if(d<=90)urgency="upcoming_90";
    allItems.push({...item,propId:p.id,propName:p.name,category:cat.category,catIcon:cat.icon,catColor:cat.color,rec:r,daysLeft:d,urgency});
  });});});

  let t=allItems.length,c=allItems.filter(i=>i.urgency==="completed").length,o=allItems.filter(i=>i.urgency==="overdue").length,ds=allItems.filter(i=>i.urgency==="due_soon").length,tf=0;
  allItems.forEach(i=>{if(i.rec.files?.length)tf+=i.rec.files.length;});
  const rate=t>0?Math.round((c/t)*100):0;

  // 面板数据
  const panelItems=panel==="overdue"?allItems.filter(i=>i.urgency==="overdue").sort((a,b)=>a.daysLeft-b.daysLeft)
    :panel==="upcoming"?allItems.filter(i=>i.urgency==="due_soon"||i.urgency==="upcoming_90").sort((a,b)=>a.daysLeft-b.daysLeft)
    :[];
  const panelCats=[...new Set(panelItems.map(i=>i.category))];
  const filteredPanel=catFilter==="all"?panelItems:panelItems.filter(i=>i.category===catFilter);
  // 按类别分组
  const grouped={};filteredPanel.forEach(i=>{if(!grouped[i.category])grouped[i.category]=[];grouped[i.category].push(i);});

  const kpis=[
    {l:"物业数量",v:ps.length,c:"#378ADD",k:null},
    {l:"合规项总数",v:t,c:"#534AB7",k:null},
    {l:"已完成",v:c,c:"#1D9E75",k:null},
    {l:"已逾期",v:o,c:"#E24B4A",k:"overdue"},
    {l:"即将到期",v:ds,c:"#BA7517",k:"upcoming"},
    {l:"完成率",v:`${rate}%`,c:"#639922",k:null},
    {l:"已上传文件",v:tf,c:"#378ADD",k:null},
  ];

  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(105px,1fr))",gap:10,marginBottom:24}}>
      {kpis.map((m,i)=>{const clickable=m.k&&((m.k==="overdue"&&o>0)||(m.k==="upcoming"&&ds>0));const active=panel===m.k;return(
        <div key={i} onClick={()=>{if(clickable){setPanel(active?null:m.k);setCatFilter("all");}}} style={{background:active?m.c+"14":"#f8f7f4",borderRadius:10,padding:"14px 10px",textAlign:"center",cursor:clickable?"pointer":"default",border:active?`2px solid ${m.c}`:"2px solid transparent",transition:"all 0.15s",position:"relative"}}>
          <div style={{fontSize:11,color:"#888780",marginBottom:4}}>{m.l}</div>
          <div style={{fontSize:22,fontWeight:600,color:m.c}}>{m.v}</div>
          {clickable&&<div style={{fontSize:9,color:m.c,marginTop:3,fontWeight:500}}>{active?"▲ 收起":"▼ 点击查看"}</div>}
        </div>);})}
    </div>

    {/* 展开面板：逾期 / 即将到期 */}
    {panel&&panelItems.length>0&&(<div style={{background:"#fff",border:"1px solid #e8e7e3",borderRadius:12,padding:20,marginBottom:20,animation:"slideUp 0.25s ease"}}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:16,fontWeight:600,color:panel==="overdue"?"#A32D2D":"#854F0B"}}>
          {panel==="overdue"?"⚠️ 逾期项目明细":"⏰ 即将到期项目明细"}
          <span style={{fontSize:12,fontWeight:400,color:"#888780",marginLeft:8}}>共 {panelItems.length} 项</span>
        </div>
        <button onClick={()=>setPanel(null)} style={{fontSize:12,padding:"4px 12px",borderRadius:6,border:"1px solid #d3d1c7",background:"#fff",cursor:"pointer",color:"#5f5e5a"}}>✕ 关闭</button>
      </div>

      {/* 类别筛选标签 */}
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        <button onClick={()=>setCatFilter("all")} style={{padding:"5px 12px",borderRadius:8,fontSize:12,cursor:"pointer",border:catFilter==="all"?"2px solid #2c2c2a":"1px solid #e8e7e3",background:catFilter==="all"?"#2c2c2a":"#f8f7f4",color:catFilter==="all"?"#fff":"#5f5e5a",fontWeight:catFilter==="all"?600:400}}>全部 ({panelItems.length})</button>
        {panelCats.map(cat=>{const ci=HK_COMPLIANCE_TEMPLATE.find(c=>c.category===cat);const cnt=panelItems.filter(i=>i.category===cat).length;const active=catFilter===cat;return(
          <button key={cat} onClick={()=>setCatFilter(active?"all":cat)} style={{padding:"5px 12px",borderRadius:8,fontSize:12,cursor:"pointer",border:active?`2px solid ${ci?.color||"#2c2c2a"}`:"1px solid #e8e7e3",background:active?(ci?.color||"#2c2c2a")+"12":"#f8f7f4",color:active?ci?.color||"#2c2c2a":"#5f5e5a",fontWeight:active?600:400}}>{ci?.icon||""} {cat} ({cnt})</button>
        );})}
      </div>

      {/* 按类别分组列表 */}
      {Object.entries(grouped).map(([cat,items])=>{const ci=HK_COMPLIANCE_TEMPLATE.find(c=>c.category===cat);return(
        <div key={cat} style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",background:"#f8f7f4",borderRadius:8,marginBottom:4}}>
            <span style={{fontSize:16}}>{ci?.icon||""}</span>
            <span style={{fontSize:13,fontWeight:600,color:"#2c2c2a"}}>{cat}</span>
            <span style={{fontSize:11,color:"#888780",marginLeft:"auto"}}>{items.length} 项</span>
          </div>
          {items.map((it,idx)=>{
            const urgent=it.urgency==="overdue";const d=it.daysLeft;
            return(<div key={it.id+it.propId+idx} style={{padding:"10px 12px 10px 24px",borderBottom:"0.5px solid #f1efe8",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,cursor:"pointer"}} onClick={()=>{if(onNavigate)onNavigate("checklist",it.propId);}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500,color:"#2c2c2a"}}>{it.name}</div>
                <div style={{fontSize:11,color:"#888780",marginTop:2,display:"flex",flexWrap:"wrap",gap:4}}>
                  <span>🏢 {it.propName}</span>
                  <span>· {it.executor}</span>
                  {it.rec.vendor&&<span>· {it.rec.vendor}</span>}
                  {it.rec.dueDate&&<span>· 到期：{it.rec.dueDate}</span>}
                </div>
                {it.rec.notes&&<div style={{fontSize:11,color:"#888780",marginTop:2,fontStyle:"italic"}}>{it.rec.notes}</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                <span style={{fontSize:11,padding:"3px 10px",borderRadius:6,fontWeight:600,whiteSpace:"nowrap",background:urgent?"#FCEBEB":d<=30?"#FAEEDA":"#E6F1FB",color:urgent?"#A32D2D":d<=30?"#854F0B":"#185FA5"}}>
                  {urgent?`逾期 ${Math.abs(d)} 天`:`${d} 天后到期`}
                </span>
                <span style={{fontSize:10,color:"#b4b2a9"}}>点击查看 →</span>
              </div>
            </div>);
          })}
        </div>
      );})}
    </div>)}

    {/* 逾期警告（面板关闭时显示简版） */}
    {!panel&&o>0&&(<div style={{background:"#FCEBEB",borderRadius:10,padding:"14px 18px",marginBottom:16,cursor:"pointer"}} onClick={()=>{setPanel("overdue");setCatFilter("all");}}>
      <div style={{fontSize:14,fontWeight:600,color:"#A32D2D",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span>⚠️ 逾期项目需立即处理</span>
        <span style={{fontSize:11,fontWeight:400,color:"#A32D2D",background:"#fff",padding:"3px 10px",borderRadius:6}}>点击展开全部 →</span>
      </div>
      {ps.map(p=>{const oi=allItems.filter(i=>i.propId===p.id&&i.urgency==="overdue").sort((a,b)=>a.daysLeft-b.daysLeft);if(!oi.length)return null;return(<div key={p.id} style={{marginBottom:8}}><div style={{fontSize:12,color:"#791F1F",fontWeight:500,marginBottom:4}}>{p.name}</div>{oi.slice(0,3).map((x,j)=>(<div key={j} style={{fontSize:13,color:"#A32D2D",padding:"2px 0"}}>{x.catIcon} {x.name} — 逾期 {Math.abs(x.daysLeft)} 天</div>))}{oi.length>3&&<div style={{fontSize:12,color:"#A32D2D"}}>还有 {oi.length-3} 项...</div>}</div>);})}
    </div>)}

    {/* 即将到期提醒（面板关闭时显示简版） */}
    {!panel&&ds>0&&(<div style={{background:"#FAEEDA",borderRadius:10,padding:"14px 18px",marginBottom:16,cursor:"pointer"}} onClick={()=>{setPanel("upcoming");setCatFilter("all");}}>
      <div style={{fontSize:14,fontWeight:600,color:"#854F0B",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span>⏰ 即将到期项目（30天内）</span>
        <span style={{fontSize:11,fontWeight:400,color:"#854F0B",background:"#fff",padding:"3px 10px",borderRadius:6}}>点击展开全部 →</span>
      </div>
      {ps.map(p=>{const ui=allItems.filter(i=>i.propId===p.id&&i.urgency==="due_soon").sort((a,b)=>a.daysLeft-b.daysLeft);if(!ui.length)return null;return(<div key={p.id} style={{marginBottom:8}}><div style={{fontSize:12,color:"#6B4106",fontWeight:500,marginBottom:4}}>{p.name}</div>{ui.slice(0,3).map((x,j)=>(<div key={j} style={{fontSize:13,color:"#854F0B",padding:"2px 0"}}>{x.catIcon} {x.name} — {x.daysLeft} 天后到期</div>))}{ui.length>3&&<div style={{fontSize:12,color:"#854F0B"}}>还有 {ui.length-3} 项...</div>}</div>);})}
    </div>)}
  </div>);
}

function PropertyForm({property,onSave,onCancel}){
  const[f,sF]=useState(property||{name:"",address:"",type:"residential",buildingAge:"",lifts:0,escalators:0,hasPool:false,hasSlope:false});
  return(<div style={{background:"#fff",borderRadius:12,border:"1px solid #e8e7e3",padding:20,marginBottom:16}}>
    <div style={{fontSize:16,fontWeight:600,marginBottom:16,color:"#2c2c2a"}}>{property?"编辑物业":"新增物业"}</div>
    <div style={{display:"grid",gap:12}}>
      <div><label style={lbl}>物业名称 *</label><input value={f.name} onChange={e=>sF({...f,name:e.target.value})} placeholder="例：海景花园" style={inp}/></div>
      <div><label style={lbl}>地址</label><input value={f.address} onChange={e=>sF({...f,address:e.target.value})} placeholder="例：九龙尖沙咀弥敦道100号" style={inp}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div><label style={lbl}>物业类型</label><select value={f.type} onChange={e=>sF({...f,type:e.target.value})} style={inp}><option value="residential">住宅</option><option value="commercial">商业</option><option value="composite">综合</option><option value="industrial">工业</option></select></div>
        <div><label style={lbl}>楼龄（年）</label><input type="number" value={f.buildingAge} onChange={e=>sF({...f,buildingAge:e.target.value})} placeholder="35" style={inp}/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div><label style={lbl}>电梯数量</label><input type="number" value={f.lifts} onChange={e=>sF({...f,lifts:parseInt(e.target.value)||0})} style={inp}/></div>
        <div><label style={lbl}>扶梯数量</label><input type="number" value={f.escalators} onChange={e=>sF({...f,escalators:parseInt(e.target.value)||0})} style={inp}/></div>
      </div>
      <div style={{display:"flex",gap:16}}><label style={{fontSize:13,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}><input type="checkbox" checked={f.hasPool} onChange={e=>sF({...f,hasPool:e.target.checked})}/> 泳池</label><label style={{fontSize:13,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}><input type="checkbox" checked={f.hasSlope} onChange={e=>sF({...f,hasSlope:e.target.checked})}/> 注册斜坡</label></div>
    </div>
    <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}><button onClick={onCancel} style={bo}>取消</button><button onClick={()=>{if(f.name.trim())onSave({...f,id:f.id||generateId()});}} style={bp}>保存</button></div>
  </div>);
}

function ComplianceChecklist({property:p,complianceData:cd,onUpdate,onUploadGeneral}){
  const[ec,sEC]=useState({});const[ei,sEI]=useState(null);
  const tc=c=>sEC(pv=>({...pv,[c]:!pv[c]}));
  const gs=cat=>{let t=0,d=0,o=0;cat.items.forEach(i=>{const k=`${p.id}_${i.id}`;const r=cd[k];t++;if(r?.status==="completed")d++;else if(r?.dueDate&&daysUntil(r.dueDate)<0&&r?.status!=="not_applicable")o++;});return{t,d,o};};
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,gap:8,flexWrap:"wrap"}}>
      <div><div style={{fontSize:18,fontWeight:600,color:"#2c2c2a",marginBottom:4}}>{p.name}</div><div style={{fontSize:13,color:"#888780"}}>{p.address||"未填写地址"} · 楼龄{p.buildingAge||"?"}年 · {p.lifts}部电梯 · {p.escalators}部扶梯</div></div>
      <UploadBtn label="上传报告/证书" onUpload={files=>onUploadGeneral(p.id,files)}/>
    </div>
    {HK_COMPLIANCE_TEMPLATE.map(cat=>{const s=gs(cat);const ex=ec[cat.category]!==false;return(<div key={cat.category} style={{marginBottom:12}}>
      <div onClick={()=>tc(cat.category)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:"#f8f7f4",borderRadius:10,cursor:"pointer",userSelect:"none"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{cat.icon}</span><span style={{fontSize:15,fontWeight:600,color:"#2c2c2a"}}>{cat.category}</span></div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>{s.o>0&&<span style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:"#FCEBEB",color:"#A32D2D"}}>{s.o} 逾期</span>}<span style={{fontSize:12,color:"#888780"}}>{s.d}/{s.t}</span><span style={{fontSize:12,color:"#b4b2a9",transform:ex?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</span></div>
      </div>
      {ex&&<div style={{padding:"4px 0"}}>{cat.items.map(item=>{const key=`${p.id}_${item.id}`;const rec=cd[key]||{};const ie=ei===key;return(<div key={item.id} style={{borderBottom:"1px solid #f1efe8",padding:"12px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500,color:"#2c2c2a",marginBottom:2}}>{item.name}</div><div style={{fontSize:12,color:"#888780"}}>{item.agency} · {item.executor} · {item.freq}{item.condition&&<span style={{color:"#BA7517"}}> · {item.condition}</span>}</div></div>
          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
            {(rec.files||[]).length>0&&<span style={{fontSize:11,padding:"2px 7px",borderRadius:6,background:"#E6F1FB",color:"#185FA5"}}>📎{rec.files.length}</span>}
            <StatusBadge status={rec.status} dueDate={rec.dueDate}/>
            <button onClick={()=>sEI(ie?null:key)} style={{fontSize:12,padding:"4px 10px",borderRadius:6,border:"1px solid #d3d1c7",background:ie?"#2c2c2a":"#fff",color:ie?"#fff":"#5f5e5a",cursor:"pointer"}}>{ie?"收起":"编辑"}</button>
          </div>
        </div>
        {ie&&<div style={{marginTop:12,padding:14,background:"#fafaf8",borderRadius:8,display:"grid",gap:10}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <div><label style={ls}>状态</label><select value={rec.status||"pending"} onChange={e=>onUpdate(key,{...rec,status:e.target.value})} style={is}><option value="pending">待处理</option><option value="in_progress">进行中</option><option value="completed">已完成</option><option value="not_applicable">不适用</option></select></div>
            <div><label style={ls}>上次完成日期</label><input type="date" value={rec.lastCompleted||""} onChange={e=>{const ld=e.target.value;let nd=rec.dueDate;if(ld&&item.freqDays>0){const d=new Date(ld);d.setDate(d.getDate()+item.freqDays);nd=formatDate(d);}onUpdate(key,{...rec,lastCompleted:ld,dueDate:nd});}} style={is}/></div>
            <div><label style={ls}>下次到期日</label><input type="date" value={rec.dueDate||""} onChange={e=>onUpdate(key,{...rec,dueDate:e.target.value})} style={is}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label style={ls}>负责承办商</label><input value={rec.vendor||""} onChange={e=>onUpdate(key,{...rec,vendor:e.target.value})} placeholder="信安消防工程有限公司" style={is}/></div>
            <div><label style={ls}>合约编号</label><input value={rec.contractNo||""} onChange={e=>onUpdate(key,{...rec,contractNo:e.target.value})} placeholder="CT-2024-001" style={is}/></div>
          </div>
          <div><label style={ls}>备注</label><textarea value={rec.notes||""} onChange={e=>onUpdate(key,{...rec,notes:e.target.value})} placeholder="记录检查结果、证书编号等" rows={2} style={{...is,resize:"vertical"}}/></div>
          <div><label style={ls}>上传证书/报告</label>
            {(rec.files||[]).length>0&&<div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:8}}>{rec.files.map((f,fi)=>(<div key={fi} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 10px",background:"#fff",borderRadius:6,border:"1px solid #e8e7e3"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,minWidth:0,flex:1}}><span style={{fontSize:14,flexShrink:0}}>{f.type?.includes("pdf")?"📕":f.type?.includes("image")?"🖼️":"📎"}</span><div style={{minWidth:0,flex:1}}><div style={{fontSize:12,fontWeight:500,color:"#2c2c2a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div><div style={{fontSize:11,color:"#b4b2a9"}}>{f.size} · {f.uploadDate}</div></div></div>
              <button onClick={()=>{const nf=[...(rec.files||[])];nf.splice(fi,1);onUpdate(key,{...rec,files:nf});}} style={{fontSize:11,padding:"3px 8px",borderRadius:4,border:"1px solid #f7c1c1",background:"#fff",color:"#E24B4A",cursor:"pointer"}}>删除</button>
            </div>))}</div>}
            <UploadBtn label="点击上传文件" onUpload={nf=>onUpdate(key,{...rec,files:[...(rec.files||[]),...nf]})}/>
          </div>
        </div>}
      </div>);})}</div>}
    </div>);})}
  </div>);
}

function HistoryView({historyData:hd,properties:ps,onDelete,onUploadToHistory}){
  const[vm,sVM]=useState("year");const[fp,sFP]=useState("all");const[fc,sFC]=useState("all");const[fy,sFY]=useState("all");const[fm,sFM]=useState("all");const[eg,sEG]=useState({});
  const tg=k=>sEG(p=>({...p,[k]:p[k]===undefined?false:!p[k]}));
  const yrs=[...new Set(hd.map(h=>new Date(h.completedDate).getFullYear()))].sort((a,b)=>b-a);
  const cats=[...new Set(hd.map(h=>h.category))];
  const cim={};HK_COMPLIANCE_TEMPLATE.forEach(c=>{cim[c.category]=c.icon;});
  let fl=hd;if(fp!=="all")fl=fl.filter(h=>h.propertyId===fp);if(fc!=="all")fl=fl.filter(h=>h.category===fc);if(fy!=="all")fl=fl.filter(h=>new Date(h.completedDate).getFullYear()===parseInt(fy));if(fm!=="all")fl=fl.filter(h=>new Date(h.completedDate).getMonth()===parseInt(fm));
  const miy=fy!=="all"?[...new Set(hd.filter(h=>new Date(h.completedDate).getFullYear()===parseInt(fy)).map(h=>new Date(h.completedDate).getMonth()))].sort((a,b)=>b-a):[...Array(12).keys()];
  const gr={};fl.forEach(h=>{let gk;if(vm==="year")gk=String(new Date(h.completedDate).getFullYear());else if(vm==="month")gk=`${new Date(h.completedDate).getFullYear()}-${String(new Date(h.completedDate).getMonth()+1).padStart(2,"0")}`;else gk=h.category;if(!gr[gk])gr[gk]=[];gr[gk].push(h);});
  const gks=Object.keys(gr).sort((a,b)=>vm==="category"?a.localeCompare(b):b.localeCompare(a));

  /* ── 导出PDF（生成可打印HTML报告） ── */
  const exportPDF=()=>{
    const propLabel=fp!=="all"?(ps.find(p=>p.id===fp)?.name||"全部"):"全部物业";
    const catLabel=fc!=="all"?fc:"全部类别";
    const yrLabel=fy!=="all"?fy+"年":"全部年份";
    const moLabel=fm!=="all"?MN[parseInt(fm)]:"全部月份";
    let rows="";const sorted=[...fl].sort((a,b)=>new Date(b.completedDate)-new Date(a.completedDate));
    let curCat="";sorted.forEach(h=>{
      if(h.category!==curCat){curCat=h.category;rows+=`<tr><td colspan="5" style="background:#f5f5f2;font-weight:700;padding:10px 12px;font-size:14px;">${cim[h.category]||""} ${h.category}</td></tr>`;}
      rows+=`<tr><td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:12px;">${h.completedDate}</td><td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:12px;">${h.propertyName}</td><td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:12px;font-weight:500;">${h.itemName}</td><td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:12px;color:#888;">${h.vendor||"—"}</td><td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:12px;color:#888;font-style:italic;">${h.notes||""}</td></tr>`;
    });
    const catSummary={};fl.forEach(h=>{catSummary[h.category]=(catSummary[h.category]||0)+1;});
    let sumRows="";Object.entries(catSummary).sort((a,b)=>b[1]-a[1]).forEach(([c,n])=>{sumRows+=`<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px;">${cim[c]||""} ${c}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px;text-align:center;font-weight:600;">${n}</td></tr>`;});
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>合规历史记录报告</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:-apple-system,'PingFang SC','Noto Sans SC',sans-serif;padding:40px;color:#2c2c2a;max-width:1000px;margin:0 auto;}h1{font-size:22px;margin-bottom:4px;}table{width:100%;border-collapse:collapse;margin:16px 0;}th{background:#2c2c2a;color:#fff;padding:8px 10px;text-align:left;font-size:12px;}.filters{display:flex;gap:10px;margin:12px 0;flex-wrap:wrap;}.ftag{background:#f5f5f2;padding:5px 12px;border-radius:6px;font-size:12px;}.footer{margin-top:30px;padding-top:16px;border-top:2px solid #2c2c2a;font-size:11px;color:#aaa;text-align:center;}@media print{body{padding:20px;}}</style></head><body><h1>物业合规管理系统</h1><div style="font-size:14px;font-weight:600;color:#534AB7;margin:4px 0 8px;">合规历史记录报告</div><div style="font-size:12px;color:#888;">生成日期：${formatDate(new Date())}</div><div class="filters"><div class="ftag">🏢 ${propLabel}</div><div class="ftag">📋 ${catLabel}</div><div class="ftag">📅 ${yrLabel}</div><div class="ftag">🗓️ ${moLabel}</div><div class="ftag">共 ${fl.length} 条记录</div></div><h3 style="font-size:14px;margin:16px 0 6px;">类别汇总</h3><table><thead><tr><th>类别</th><th style="width:80px;text-align:center;">记录数</th></tr></thead><tbody>${sumRows}</tbody></table><h3 style="font-size:14px;margin:20px 0 6px;">详细记录</h3><table><thead><tr><th style="width:90px;">日期</th><th style="width:100px;">物业</th><th>合规事项</th><th style="width:130px;">承办商</th><th>备注</th></tr></thead><tbody>${rows}</tbody></table><div class="footer">本报告由物业合规管理系统自动生成 · ${formatDate(new Date())}<br/>可使用浏览器打印功能 (Ctrl+P / Cmd+P) 保存为PDF</div></body></html>`;
    const w=window.open("","_blank");if(w){w.document.write(html);w.document.close();}
  };

  /* ── 导出Excel（CSV格式，支持中文） ── */
  const exportExcel=()=>{
    const BOM="\uFEFF";
    const header=["完成日期","物业","类别","合规事项","承办商","合约编号","备注","文件数"].join(",");
    const sorted=[...fl].sort((a,b)=>new Date(b.completedDate)-new Date(a.completedDate));
    const csvRows=sorted.map(h=>{
      const esc=v=>`"${String(v||"").replace(/"/g,'""')}"`;
      return [esc(h.completedDate),esc(h.propertyName),esc(h.category),esc(h.itemName),esc(h.vendor),esc(h.contractNo),esc(h.notes),h.fileCount||0].join(",");
    });
    // 类别汇总sheet（append到底部）
    const catSummary={};fl.forEach(h=>{catSummary[h.category]=(catSummary[h.category]||0)+1;});
    csvRows.push("");csvRows.push("类别汇总,,,,,,");csvRows.push("类别,记录数,,,,,");
    Object.entries(catSummary).sort((a,b)=>b[1]-a[1]).forEach(([c,n])=>{csvRows.push(`"${c}",${n},,,,,`);});
    // 筛选条件
    const propLabel=fp!=="all"?(ps.find(p=>p.id===fp)?.name||"全部"):"全部物业";
    csvRows.push("");csvRows.push(`筛选条件: 物业=${propLabel} | 类别=${fc!=="all"?fc:"全部"} | 年份=${fy!=="all"?fy:"全部"} | 月份=${fm!=="all"?MN[parseInt(fm)]:"全部"},,,,,,`);
    csvRows.push(`生成日期: ${formatDate(new Date())},,,,,,`);
    const csv=BOM+header+"\n"+csvRows.join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");
    a.href=url;a.download=`合规历史记录_${fp!=="all"?(ps.find(p=>p.id===fp)?.name||""):"全部"}_${fy!=="all"?fy:"全部"}.csv`;
    document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
  };

  if(hd.length===0)return(<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:48,marginBottom:12}}>🕐</div><div style={{fontSize:18,fontWeight:600,marginBottom:8,color:"#2c2c2a"}}>暂无历史记录</div><div style={{fontSize:14,color:"#888780",lineHeight:1.7}}>当您在"合规检查"中标记已完成时，系统会自动记录。</div></div>);
  return(<div>
    <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
      <div style={{display:"flex",borderRadius:8,overflow:"hidden",border:"1px solid #d3d1c7"}}>{[{id:"year",l:"按年份"},{id:"month",l:"按月份"},{id:"category",l:"按类别"}].map(m=>(<button key={m.id} onClick={()=>{sVM(m.id);sFM("all");}} style={{padding:"6px 12px",fontSize:12,border:"none",cursor:"pointer",background:vm===m.id?"#2c2c2a":"#fff",color:vm===m.id?"#fff":"#5f5e5a",fontWeight:vm===m.id?600:400}}>{m.l}</button>))}</div>
      {ps.length>1&&<select value={fp} onChange={e=>sFP(e.target.value)} style={ss}><option value="all">全部物业</option>{ps.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>}
      <select value={fy} onChange={e=>{sFY(e.target.value);sFM("all");}} style={ss}><option value="all">全部年份</option>{yrs.map(y=><option key={y} value={y}>{y}年</option>)}</select>
      <select value={fm} onChange={e=>sFM(e.target.value)} style={ss}><option value="all">全部月份</option>{miy.map(m=><option key={m} value={m}>{MN[m]}</option>)}</select>
      {vm!=="category"&&<select value={fc} onChange={e=>sFC(e.target.value)} style={ss}><option value="all">全部类别</option>{cats.map(c=><option key={c} value={c}>{cim[c]||""} {c}</option>)}</select>}
      <UploadBtn label="上传历史文件" onUpload={onUploadToHistory}/>
      <div style={{fontSize:12,color:"#888780",marginLeft:"auto"}}>共 {fl.length} 条</div>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
      <button onClick={exportPDF} disabled={fl.length===0} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 16px",borderRadius:8,border:"none",background:fl.length?"#C0392B":"#ccc",color:"#fff",cursor:fl.length?"pointer":"default",fontSize:12,fontWeight:600}}>📄 导出 PDF</button>
      <button onClick={exportExcel} disabled={fl.length===0} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 16px",borderRadius:8,border:"none",background:fl.length?"#1D9E75":"#ccc",color:"#fff",cursor:fl.length?"pointer":"default",fontSize:12,fontWeight:600}}>📊 导出 Excel</button>
      <span style={{fontSize:11,color:"#b4b2a9"}}>根据当前筛选条件导出</span>
    </div>
    <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>{yrs.slice(0,6).map(y=>{const cnt=hd.filter(h=>new Date(h.completedDate).getFullYear()===y).length;const ac=fy===String(y);return <button key={y} onClick={()=>{sFY(ac?"all":String(y));sFM("all");}} style={{padding:"6px 14px",borderRadius:8,fontSize:12,cursor:"pointer",border:ac?"2px solid #534AB7":"1px solid #e8e7e3",background:ac?"#EEEDFE":"#f8f7f4",color:ac?"#534AB7":"#5f5e5a",fontWeight:ac?600:400}}>{y}年 ({cnt})</button>;})}</div>
    {gks.length===0?<div style={{textAlign:"center",padding:40,color:"#888780",fontSize:14}}>没有匹配的记录</div>:gks.map(gk=>{
      const its=gr[gk];const ex=eg[gk]!==false;
      const sg={};its.forEach(h=>{const sk=vm==="category"?`${new Date(h.completedDate).getFullYear()}-${String(new Date(h.completedDate).getMonth()+1).padStart(2,"0")}`:h.category;if(!sg[sk])sg[sk]=[];sg[sk].push(h);});
      const sks=Object.keys(sg).sort((a,b)=>vm==="category"?b.localeCompare(a):a.localeCompare(b));
      let gl=gk;if(vm==="year")gl=`${gk}年`;else if(vm==="month"){const[y,m]=gk.split("-");gl=`${y}年${MN[parseInt(m)-1]}`;}
      return(<div key={gk} style={{marginBottom:14}}>
        <div onClick={()=>tg(gk)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:"#f8f7f4",borderRadius:10,cursor:"pointer",userSelect:"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{vm==="category"?(cim[gk]||"📋"):"📅"}</span><span style={{fontSize:15,fontWeight:600,color:"#2c2c2a"}}>{gl}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:12,color:"#888780"}}>{its.length} 条</span><span style={{fontSize:12,color:"#b4b2a9",transform:ex?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</span></div>
        </div>
        {ex&&sks.map(sk=>(<div key={sk}>
          <div style={{padding:"8px 16px 4px",fontSize:12,fontWeight:600,color:"#888780",display:"flex",alignItems:"center",gap:6}}>{vm!=="category"&&<span>{cim[sk]||""}</span>}{vm==="category"?(()=>{const[y,m]=sk.split("-");return `${y}年${MN[parseInt(m)-1]}`;})():sk} <span style={{fontWeight:400}}>({sg[sk].length})</span></div>
          {sg[sk].sort((a,b)=>new Date(b.completedDate)-new Date(a.completedDate)).map(h=>(<div key={h.id} style={{padding:"10px 16px 10px 28px",borderBottom:"0.5px solid #f1efe8"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500,color:"#2c2c2a"}}>{h.itemName}</div>
                <div style={{fontSize:11,color:"#888780",marginTop:2,display:"flex",flexWrap:"wrap",gap:4}}><span>✓ {h.completedDate}</span>{h.vendor&&<span>· 承办商：{h.vendor}</span>}{h.contractNo&&<span>· 合约：{h.contractNo}</span>}{ps.length>1&&<span>· {h.propertyName}</span>}</div>
                {h.fileCount>0&&<div style={{fontSize:11,color:"#378ADD",marginTop:2}}>📎 {h.fileNames?.join("、")||`${h.fileCount}份`}</div>}
                {h.notes&&<div style={{fontSize:11,color:"#888780",marginTop:2,fontStyle:"italic"}}>备注：{h.notes}</div>}
              </div>
              <button onClick={()=>onDelete(h.id)} style={{fontSize:10,padding:"2px 8px",borderRadius:4,border:"1px solid #f1efe8",background:"#fff",color:"#b4b2a9",cursor:"pointer",flexShrink:0}}>删除</button>
            </div>
          </div>))}
        </div>))}
      </div>);
    })}
  </div>);
}

function ReportGenerator({properties:ps,complianceData:cd,onUploadToReport}){
  const[sp,sSP]=useState(ps[0]?.id||"");const[sv,sSV]=useState(false);const p=ps.find(x=>x.id===sp);
  const grd=()=>{if(!p)return null;let ti=0,ci=0,oi=0,tf=0;
    const cats=HK_COMPLIANCE_TEMPLATE.map(cat=>{const items=cat.items.map(item=>{const k=`${p.id}_${item.id}`;const r=cd[k]||{};ti++;if(r.files?.length)tf+=r.files.length;let s="not_set",sl="未设置",sc="#888780";
      if(r.status==="completed"){s="completed";sl="已完成";sc="#1D9E75";ci++;}else if(r.status==="not_applicable"){s="na";sl="不适用";}else if(r.status==="in_progress"){s="in_progress";sl="进行中";sc="#185FA5";}else if(r.dueDate){const d=daysUntil(r.dueDate);if(d<0){s="overdue";sl=`逾期${Math.abs(d)}天`;sc="#E24B4A";oi++;}else if(d<=30){s="due_soon";sl=`${d}天后到期`;sc="#BA7517";}else{s="ok";sl=`${d}天后到期`;sc="#1D9E75";}}
      return{...item,rec:r,status:s,statusLabel:sl,statusColor:sc};});return{...cat,items};});
    return{prop:p,categories:cats,totalItems:ti,completedItems:ci,overdueItems:oi,totalFiles:tf,rate:ti>0?Math.round(ci/ti*100):0};};
  const dl=()=>{const d=grd();if(!d)return;
    const statusIcon={completed:"✅",overdue:"🔴",due_soon:"🟡",ok:"🟢",na:"➖",in_progress:"🔵",not_set:"⬜"};
    const statusBg={completed:"#E1F5EE",overdue:"#FCEBEB",due_soon:"#FAEEDA",ok:"#E1F5EE",in_progress:"#E6F1FB",na:"#F1EFE8",not_set:"#F1EFE8"};
    let rows="";d.categories.forEach(c=>{rows+=`<tr><td colspan="4" style="background:#f5f5f2;font-weight:700;padding:10px 12px;font-size:15px;">${c.icon} ${c.category}</td></tr>`;
      c.items.forEach(i=>{rows+=`<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;"><strong>${i.name}</strong><br/><span style="color:#888;font-size:12px;">${i.executor} · ${i.freq}${i.rec.vendor?` · ${i.rec.vendor}`:""}</span>${i.rec.notes?`<br/><span style="color:#888;font-size:12px;font-style:italic;">${i.rec.notes}</span>`:""}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center;font-size:13px;">${i.rec.lastCompleted||"—"}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center;font-size:13px;">${i.rec.dueDate||"—"}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center;"><span style="padding:3px 10px;border-radius:6px;font-size:12px;background:${statusBg[i.status]||"#F1EFE8"};color:${i.statusColor};">${statusIcon[i.status]||"⬜"} ${i.statusLabel}</span></td></tr>`;});});
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${d.prop.name} 合规报告</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:-apple-system,'PingFang SC','Noto Sans SC',sans-serif;padding:40px;color:#2c2c2a;max-width:900px;margin:0 auto;}h1{font-size:24px;margin-bottom:4px;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#2c2c2a;color:#fff;padding:10px 12px;text-align:left;font-size:13px;}.stats{display:flex;gap:12px;margin:20px 0;}.stat{background:#f5f5f2;border-radius:8px;padding:14px 18px;text-align:center;flex:1;}.stat-v{font-size:24px;font-weight:700;}.stat-l{font-size:11px;color:#888;margin-top:2px;}.footer{margin-top:30px;padding-top:16px;border-top:2px solid #2c2c2a;font-size:11px;color:#aaa;text-align:center;}@media print{body{padding:20px;}}</style></head><body><h1>${d.prop.name}</h1><div style="font-size:15px;font-weight:600;color:#534AB7;margin:4px 0 12px;">合规状况报告</div><div style="font-size:13px;color:#888;">生成日期：${formatDate(new Date())} · 地址：${d.prop.address||"未填写"} · 楼龄：${d.prop.buildingAge||"?"}年 · 电梯：${d.prop.lifts}部 · 扶梯：${d.prop.escalators}部</div><div class="stats"><div class="stat"><div class="stat-v" style="color:#534AB7">${d.totalItems}</div><div class="stat-l">合规项总数</div></div><div class="stat"><div class="stat-v" style="color:#1D9E75">${d.completedItems}</div><div class="stat-l">已完成</div></div><div class="stat"><div class="stat-v" style="color:#E24B4A">${d.overdueItems}</div><div class="stat-l">已逾期</div></div><div class="stat"><div class="stat-v" style="color:${d.rate>=80?"#1D9E75":"#BA7517"}">${d.rate}%</div><div class="stat-l">完成率</div></div><div class="stat"><div class="stat-v" style="color:#378ADD">${d.totalFiles}</div><div class="stat-l">已上传文件</div></div></div><table><thead><tr><th>合规事项</th><th style="width:100px;text-align:center;">上次完成</th><th style="width:100px;text-align:center;">下次到期</th><th style="width:120px;text-align:center;">状态</th></tr></thead><tbody>${rows}</tbody></table><div class="footer">本报告由物业合规管理系统自动生成 · ${formatDate(new Date())}<br/>可使用浏览器打印功能 (Ctrl+P / Cmd+P) 保存为PDF</div><script>document.title="${d.prop.name}_合规报告_${formatDate(new Date())}";</script></body></html>`;
    const w=window.open("","_blank");if(w){w.document.write(html);w.document.close();}
  };
  const rd=grd();
  return(<div>
    <div style={{background:"#f8f7f4",borderRadius:12,padding:20,marginBottom:20}}>
      <div style={{fontSize:16,fontWeight:600,color:"#2c2c2a",marginBottom:12}}>📄 生成 AGM 合规报告</div>
      <div style={{fontSize:13,color:"#888780",marginBottom:16}}>选择物业后预览并下载合规状况报告，可用于周年大会或审计。</div>
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        <select value={sp} onChange={e=>{sSP(e.target.value);sSV(false);}} style={{flex:1,minWidth:140,padding:"8px 12px",borderRadius:8,border:"1px solid #d3d1c7",fontSize:14}}>{ps.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <button onClick={()=>sSV(true)} style={bo}>预览报告</button><button onClick={dl} style={bp}>打开报告 ↗</button>
        <UploadBtn label="上传报告文件" onUpload={onUploadToReport}/>
      </div>
    </div>
    {sv&&rd&&(<div style={{background:"#fff",border:"1px solid #e8e7e3",borderRadius:12,padding:"24px 20px"}}>
      <div style={{borderBottom:"2px solid #2c2c2a",paddingBottom:16,marginBottom:20}}><div style={{fontSize:20,fontWeight:700,color:"#2c2c2a"}}>{rd.prop.name}</div><div style={{fontSize:14,fontWeight:600,color:"#534AB7",marginTop:4}}>合规状况报告</div><div style={{fontSize:12,color:"#888780",marginTop:8}}>生成日期：{formatDate(new Date())} · {rd.prop.address||"未填写"} · 楼龄{rd.prop.buildingAge||"?"}年</div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8,marginBottom:24}}>{[{l:"合规项",v:rd.totalItems,c:"#534AB7"},{l:"已完成",v:rd.completedItems,c:"#1D9E75"},{l:"已逾期",v:rd.overdueItems,c:"#E24B4A"},{l:"完成率",v:`${rd.rate}%`,c:rd.rate>=80?"#1D9E75":"#BA7517"},{l:"文件数",v:rd.totalFiles,c:"#378ADD"}].map((m,i)=>(<div key={i} style={{background:"#f8f7f4",borderRadius:8,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:11,color:"#888780",marginBottom:3}}>{m.l}</div><div style={{fontSize:20,fontWeight:600,color:m.c}}>{m.v}</div></div>))}</div>
      {rd.categories.map(cat=>(<div key={cat.category} style={{marginBottom:20}}>
        <div style={{fontSize:15,fontWeight:600,color:"#2c2c2a",marginBottom:8,display:"flex",alignItems:"center",gap:6,borderBottom:"1px solid #e8e7e3",paddingBottom:8}}><span>{cat.icon}</span> {cat.category}</div>
        {cat.items.map(it=>(<div key={it.id} style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) auto",gap:8,padding:"8px 0",borderBottom:"0.5px solid #f1efe8",alignItems:"start"}}>
          <div><div style={{fontSize:13,fontWeight:500,color:"#2c2c2a"}}>{it.name}</div><div style={{fontSize:11,color:"#888780",marginTop:2}}>{it.executor} · {it.freq}{it.rec.vendor&&` · ${it.rec.vendor}`}{it.rec.dueDate&&` · 到期：${it.rec.dueDate}`}</div>
            {it.rec.files?.length>0&&<div style={{fontSize:11,color:"#378ADD",marginTop:2}}>📎 {it.rec.files.map(f=>f.name).join("、")}</div>}
            {it.rec.notes&&<div style={{fontSize:11,color:"#888780",marginTop:2,fontStyle:"italic"}}>{it.rec.notes}</div>}
          </div>
          <span style={{fontSize:11,padding:"3px 10px",borderRadius:6,fontWeight:500,whiteSpace:"nowrap",background:it.status==="completed"?"#E1F5EE":it.status==="overdue"?"#FCEBEB":it.status==="due_soon"?"#FAEEDA":it.status==="in_progress"?"#E6F1FB":it.status==="ok"?"#E1F5EE":"#F1EFE8",color:it.statusColor}}>{it.statusLabel}</span>
        </div>))}
      </div>))}
      <div style={{borderTop:"2px solid #2c2c2a",paddingTop:12,marginTop:12,fontSize:11,color:"#b4b2a9",textAlign:"center"}}>物业合规管理系统 · {formatDate(new Date())}</div>
    </div>)}
  </div>);
}

/* ═══════════════════════════════════════════════════
   AI COMPLIANCE BOT — Serverless, fully client-side
   No API keys needed. Analyzes local compliance data
   for categorization, risk scoring & reporting.
   ═══════════════════════════════════════════════════ */

function AIBot({properties,complianceData,historyData,onNavigate}){
  const[msgs,setMsgs]=useState([]);const[input,setInput]=useState("");const[thinking,setThinking]=useState(false);const chatRef=useRef(null);

  // ── Analysis engine ──
  const analyze=useCallback(()=>{
    const allItems=[];const catStats={};const propStats={};
    properties.forEach(p=>{
      if(!propStats[p.id])propStats[p.id]={name:p.name,total:0,done:0,overdue:0,dueSoon:0,notSet:0,inProgress:0};
      HK_COMPLIANCE_TEMPLATE.forEach(cat=>{
        if(!catStats[cat.category])catStats[cat.category]={icon:cat.icon,color:cat.color,total:0,done:0,overdue:0,dueSoon:0};
        cat.items.forEach(item=>{
          const k=`${p.id}_${item.id}`;const r=complianceData[k]||{};const d=daysUntil(r.dueDate);
          let urgency="not_set";
          if(r.status==="completed")urgency="completed";
          else if(r.status==="not_applicable")urgency="na";
          else if(r.status==="in_progress")urgency="in_progress";
          else if(r.dueDate&&d<0)urgency="overdue";
          else if(r.dueDate&&d<=30)urgency="due_soon";
          else if(r.dueDate&&d<=90)urgency="upcoming";
          else if(r.dueDate)urgency="ok";
          allItems.push({...item,propId:p.id,propName:p.name,category:cat.category,catIcon:cat.icon,rec:r,daysLeft:d,urgency});
          catStats[cat.category].total++;propStats[p.id].total++;
          if(urgency==="completed"){catStats[cat.category].done++;propStats[p.id].done++;}
          if(urgency==="overdue"){catStats[cat.category].overdue++;propStats[p.id].overdue++;}
          if(urgency==="due_soon"){catStats[cat.category].dueSoon++;propStats[p.id].dueSoon++;}
          if(urgency==="not_set")propStats[p.id].notSet++;
          if(urgency==="in_progress")propStats[p.id].inProgress++;
        });
      });
    });
    // History stats
    const histByMonth={};const histByCat={};
    historyData.forEach(h=>{
      const ym=h.completedDate?.substring(0,7)||"unknown";
      histByMonth[ym]=(histByMonth[ym]||0)+1;
      histByCat[h.category]=(histByCat[h.category]||0)+1;
    });
    return{allItems,catStats,propStats,histByMonth,histByCat,totalHistory:historyData.length};
  },[properties,complianceData,historyData]);

  // ── Bot response logic ──
  const getResponse=(q)=>{
    const data=analyze();const ql=q.toLowerCase();const total=data.allItems.length;
    const overdue=data.allItems.filter(i=>i.urgency==="overdue");
    const dueSoon=data.allItems.filter(i=>i.urgency==="due_soon");
    const completed=data.allItems.filter(i=>i.urgency==="completed");
    const rate=total>0?Math.round(completed.length/total*100):0;

    // ── Quick commands ──
    if(ql.includes("总览")||ql.includes("summary")||ql.includes("overview")||ql.includes("状况")||ql==="hi"||ql==="你好"||ql.includes("报告")||ql.includes("report")){
      let r=`📊 **合规总览**\n\n`;
      r+=`物业数量：${properties.length}\n`;
      r+=`合规项总计：${total}\n`;
      r+=`✅ 已完成：${completed.length} (${rate}%)\n`;
      r+=`🔴 已逾期：${overdue.length}\n`;
      r+=`🟡 30天内到期：${dueSoon.length}\n`;
      r+=`📁 历史记录：${data.totalHistory} 条\n\n`;
      if(overdue.length>0)r+=`⚠️ **需立即处理的逾期项目：**\n`+overdue.sort((a,b)=>a.daysLeft-b.daysLeft).slice(0,5).map(i=>`  • ${i.catIcon} ${i.name} (${i.propName}) — 逾期 ${Math.abs(i.daysLeft)} 天`).join("\n")+"\n\n";
      if(dueSoon.length>0)r+=`⏰ **即将到期：**\n`+dueSoon.sort((a,b)=>a.daysLeft-b.daysLeft).slice(0,5).map(i=>`  • ${i.catIcon} ${i.name} (${i.propName}) — ${i.daysLeft} 天后`).join("\n")+"\n";
      return r;
    }

    if(ql.includes("逾期")||ql.includes("overdue")||ql.includes("过期")){
      if(overdue.length===0)return "✅ 目前没有逾期项目，所有合规事项均在有效期内。";
      let r=`🔴 **逾期项目分析** (共 ${overdue.length} 项)\n\n`;
      const byCat={};overdue.forEach(i=>{if(!byCat[i.category])byCat[i.category]={icon:i.catIcon,items:[]};byCat[i.category].items.push(i);});
      Object.entries(byCat).forEach(([cat,v])=>{r+=`**${v.icon} ${cat}** (${v.items.length} 项逾期)\n`;v.items.sort((a,b)=>a.daysLeft-b.daysLeft).forEach(i=>{r+=`  • ${i.name} @ ${i.propName} — 逾期 ${Math.abs(i.daysLeft)} 天\n`;if(i.rec.vendor)r+=`    承办商：${i.rec.vendor}\n`;});r+="\n";});
      r+=`💡 **建议优先级：** 逾期超过90天的项目应优先安排，可能面临罚款风险。`;
      return r;
    }

    if(ql.includes("分类")||ql.includes("categoriz")||ql.includes("category")||ql.includes("类别")){
      let r=`📋 **按类别合规分析**\n\n`;
      Object.entries(data.catStats).sort((a,b)=>b[1].overdue-a[1].overdue).forEach(([cat,s])=>{
        const catRate=s.total>0?Math.round(s.done/s.total*100):0;
        const risk=s.overdue>2?"🔴 高风险":s.overdue>0?"🟡 中风险":catRate>=80?"🟢 良好":"🔵 进行中";
        r+=`**${s.icon} ${cat}** ${risk}\n`;
        r+=`  完成率 ${catRate}% (${s.done}/${s.total}) | 逾期 ${s.overdue} | 即将到期 ${s.dueSoon}\n\n`;
      });
      return r;
    }

    if(ql.includes("物业")||ql.includes("property")||ql.includes("building")){
      let r=`🏢 **物业合规对比**\n\n`;
      Object.values(data.propStats).forEach(p=>{
        const pRate=p.total>0?Math.round(p.done/p.total*100):0;
        const risk=p.overdue>5?"🔴":p.overdue>0?"🟡":"🟢";
        r+=`**${risk} ${p.name}**\n`;
        r+=`  完成率 ${pRate}% | ✅${p.done} 🔴${p.overdue} 🟡${p.dueSoon} ⏳${p.inProgress} ⬜${p.notSet}\n\n`;
      });
      return r;
    }

    if(ql.includes("风险")||ql.includes("risk")||ql.includes("评估")){
      let r=`⚠️ **风险评估报告**\n\n`;
      // Score each property
      Object.values(data.propStats).forEach(p=>{
        const score=Math.max(0,100-p.overdue*15-p.notSet*5-(p.total-p.done-p.overdue)*2);
        const grade=score>=80?"A (优秀)":score>=60?"B (良好)":score>=40?"C (需改善)":"D (高风险)";
        r+=`**${p.name}** — 评分 ${score}/100 (${grade})\n`;
      });
      r+="\n**风险因素权重：**\n";
      r+=`  • 逾期项目：-15分/项\n  • 未设置到期日：-5分/项\n  • 未完成项目：-2分/项\n\n`;
      // Top risks
      const critical=overdue.filter(i=>Math.abs(i.daysLeft)>90);
      if(critical.length>0){r+=`🚨 **严重逾期 (>90天)：**\n`;critical.forEach(i=>{r+=`  • ${i.catIcon} ${i.name} @ ${i.propName} — ${Math.abs(i.daysLeft)} 天 (${i.law||""})\n`;});}
      return r;
    }

    if(ql.includes("历史")||ql.includes("history")||ql.includes("趋势")||ql.includes("trend")){
      let r=`📅 **历史趋势分析**\n\n`;
      r+=`总记录数：${data.totalHistory}\n\n`;
      r+=`**按月份分布：**\n`;
      Object.entries(data.histByMonth).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,12).forEach(([ym,cnt])=>{
        const bar="█".repeat(Math.min(Math.ceil(cnt/2),20));
        r+=`  ${ym} ${bar} ${cnt}\n`;
      });
      r+=`\n**按类别分布：**\n`;
      Object.entries(data.histByCat).sort((a,b)=>b[1]-a[1]).forEach(([cat,cnt])=>{r+=`  • ${cat}：${cnt} 条\n`;});
      return r;
    }

    if(ql.includes("建议")||ql.includes("suggest")||ql.includes("recommend")||ql.includes("怎么办")||ql.includes("action")){
      let r=`💡 **行动建议**\n\n`;
      if(overdue.length>0){
        r+=`**1. 优先处理逾期项目** (${overdue.length} 项)\n`;
        const urgentCats={};overdue.forEach(i=>{urgentCats[i.category]=(urgentCats[i.category]||0)+1;});
        const topCat=Object.entries(urgentCats).sort((a,b)=>b[1]-a[1])[0];
        r+=`   重点类别：${topCat[0]} (${topCat[1]} 项逾期)\n\n`;
      }
      if(dueSoon.length>0){
        r+=`**2. 安排即将到期检查** (${dueSoon.length} 项，30天内)\n`;
        const vendors={};dueSoon.forEach(i=>{if(i.rec.vendor)vendors[i.rec.vendor]=(vendors[i.rec.vendor]||0)+1;});
        if(Object.keys(vendors).length>0)r+=`   需联系承办商：${Object.entries(vendors).map(([v,c])=>`${v}(${c}项)`).join("、")}\n\n`;
      }
      const notSet=data.allItems.filter(i=>i.urgency==="not_set");
      if(notSet.length>0)r+=`**3. 补充缺失数据** — ${notSet.length} 个项目尚未设置到期日\n\n`;
      r+=`**4. 定期复查** — 建议每月使用本系统检查合规状态\n`;
      return r;
    }

    if(ql.includes("help")||ql.includes("帮助")||ql.includes("功能")||ql.includes("?")||ql.includes("？")){
      return `🤖 **合规助手功能**\n\n您可以问我：\n• **"总览"** — 查看合规整体状况\n• **"逾期"** — 分析所有逾期项目\n• **"分类"** — 按类别查看合规率\n• **"物业"** — 对比各物业合规情况\n• **"风险"** — 风险评估与评分\n• **"历史"** — 历史趋势分析\n• **"建议"** — 获取行动建议\n• **"报告"** — 生成合规总览\n\n直接输入关键词即可！`;
    }

    return `我可以帮您分析合规数据。试试输入：\n• "总览" — 合规总览\n• "逾期" — 逾期分析\n• "分类" — 类别分析\n• "风险" — 风险评估\n• "建议" — 行动建议\n• "帮助" — 查看所有功能`;
  };

  const send=()=>{
    const q=input.trim();if(!q)return;
    setMsgs(prev=>[...prev,{role:"user",text:q}]);setInput("");setThinking(true);
    setTimeout(()=>{
      const resp=getResponse(q);
      setMsgs(prev=>[...prev,{role:"bot",text:resp}]);setThinking(false);
    },400+Math.random()*600);
  };

  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},[msgs,thinking]);

  // Auto-greeting
  useEffect(()=>{
    const data=analyze();const overdue=data.allItems.filter(i=>i.urgency==="overdue");
    const completed=data.allItems.filter(i=>i.urgency==="completed");
    const rate=data.allItems.length>0?Math.round(completed.length/data.allItems.length*100):0;
    let greeting=`你好！我是合规智能助手 🤖\n\n`;
    greeting+=`当前系统状态：${properties.length} 个物业，合规率 ${rate}%`;
    if(overdue.length>0)greeting+=`\n⚠️ 检测到 ${overdue.length} 项逾期，输入"逾期"查看详情`;
    greeting+=`\n\n输入"帮助"查看所有功能`;
    setMsgs([{role:"bot",text:greeting}]);
  },[]);// eslint-disable-line

  const renderText=(text)=>{
    return text.split("\n").map((line,i)=>{
      let processed=line.replace(/\*\*(.+?)\*\*/g,"<b>$1</b>");
      return <div key={i} style={{minHeight:line===""?8:"auto"}} dangerouslySetInnerHTML={{__html:processed||"&nbsp;"}}/>;
    });
  };

  return(<div>
    <div style={{background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",borderRadius:16,overflow:"hidden",border:"1px solid #e8e7e3"}}>
      {/* Header */}
      <div style={{padding:"16px 20px",background:"rgba(255,255,255,0.05)",borderBottom:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#00d2ff,#3a7bd5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🤖</div>
        <div><div style={{fontSize:15,fontWeight:600,color:"#fff"}}>合规智能助手</div><div style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>AI Compliance Analyzer · 本地运行 · 无需API</div></div>
      </div>

      {/* Chat area */}
      <div ref={chatRef} style={{height:420,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"85%",padding:"10px 14px",borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.role==="user"?"linear-gradient(135deg,#3a7bd5,#00d2ff)":"rgba(255,255,255,0.08)",color:m.role==="user"?"#fff":"rgba(255,255,255,0.9)",fontSize:13,lineHeight:1.6,backdropFilter:"blur(10px)"}}>
              {renderText(m.text)}
            </div>
          </div>
        ))}
        {thinking&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{padding:"10px 14px",borderRadius:"14px 14px 14px 4px",background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.5)",fontSize:13}}>分析中<span style={{animation:"blink 1s infinite"}}>...</span></div></div>}
        <style>{`@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0.3}}`}</style>
      </div>

      {/* Quick actions */}
      <div style={{padding:"8px 16px",display:"flex",gap:6,overflowX:"auto",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
        {[{l:"📊 总览",q:"总览"},{l:"🔴 逾期",q:"逾期"},{l:"📋 分类",q:"分类"},{l:"⚠️ 风险",q:"风险"},{l:"💡 建议",q:"建议"},{l:"📅 历史",q:"历史"}].map(b=>(
          <button key={b.q} onClick={()=>{setInput(b.q);setTimeout(()=>{const q=b.q;setMsgs(prev=>[...prev,{role:"user",text:q}]);setInput("");setThinking(true);setTimeout(()=>{setMsgs(prev=>[...prev,{role:"bot",text:getResponse(q)}]);setThinking(false);},500);},50);}}
            style={{padding:"5px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.7)",fontSize:11,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s",flexShrink:0}}
            onMouseOver={e=>{e.target.style.background="rgba(255,255,255,0.15)";}}
            onMouseOut={e=>{e.target.style.background="rgba(255,255,255,0.05)";}}
          >{b.l}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.1)",display:"flex",gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send();}}
          placeholder="输入问题，例如：逾期、分类、风险评估..."
          style={{flex:1,padding:"10px 14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:13,outline:"none"}}/>
        <button onClick={send} disabled={!input.trim()||thinking}
          style={{padding:"10px 18px",borderRadius:10,border:"none",background:input.trim()&&!thinking?"linear-gradient(135deg,#3a7bd5,#00d2ff)":"rgba(255,255,255,0.1)",color:"#fff",cursor:input.trim()&&!thinking?"pointer":"default",fontSize:13,fontWeight:600}}>发送</button>
      </div>
    </div>
  </div>);
}

export default function App(){
  const[view,setView]=useState("dashboard");const[properties,setProperties]=useState([]);const[complianceData,setComplianceData]=useState({});const[historyData,setHistoryData]=useState([]);const[showAddProperty,setShowAddProperty]=useState(false);const[selectedProperty,setSelectedProperty]=useState(null);const[loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{let has=false;try{const r=await window.storage.get("hk-compliance-properties");if(r?.value){setProperties(JSON.parse(r.value));has=true;}}catch{}try{const r=await window.storage.get("hk-compliance-data");if(r?.value)setComplianceData(JSON.parse(r.value));}catch{}try{const r=await window.storage.get("hk-compliance-history");if(r?.value)setHistoryData(JSON.parse(r.value));}catch{}
    if(!has){const d=generateDemoData();setProperties(d.props);setComplianceData(d.compliance);setHistoryData(d.history);try{await window.storage.set("hk-compliance-properties",JSON.stringify(d.props));}catch{}try{await window.storage.set("hk-compliance-data",JSON.stringify(d.compliance));}catch{}try{await window.storage.set("hk-compliance-history",JSON.stringify(d.history));}catch{}}
    setLoading(false);})();},[]);
  const sv=useCallback(async(k,d,s)=>{s(d);try{await window.storage.set(k,JSON.stringify(d));}catch{}},[]);
  const sP=d=>sv("hk-compliance-properties",d,setProperties);const sC=d=>sv("hk-compliance-data",d,setComplianceData);const sH=d=>sv("hk-compliance-history",d,setHistoryData);
  const handleAddProperty=p=>{sP([...properties,p]);setShowAddProperty(false);setSelectedProperty(p.id);setView("checklist");};
  const handleDeleteProperty=id=>{sP(properties.filter(p=>p.id!==id));const nd={...complianceData};Object.keys(nd).forEach(k=>{if(k.startsWith(id+"_"))delete nd[k];});sC(nd);if(selectedProperty===id){setSelectedProperty(null);setView("dashboard");}};
  const handleComplianceUpdate=(key,record)=>{const old=complianceData[key]||{};if((record.status==="completed"&&old.status!=="completed")||(record.lastCompleted&&record.lastCompleted!==old.lastCompleted)){const[pid,...ip]=key.split("_");const iid=ip.join("_");const pr=properties.find(p=>p.id===pid);let in_="",cn="",ci="",ex="",ag="";HK_COMPLIANCE_TEMPLATE.forEach(c=>{c.items.forEach(i=>{if(i.id===iid){in_=i.name;cn=c.category;ci=c.icon;ex=i.executor;ag=i.agency;}});});sH([{id:generateId(),propertyId:pid,propertyName:pr?.name||"",itemId:iid,itemName:in_,category:cn,categoryIcon:ci,executor:ex,agency:ag,completedDate:record.lastCompleted||formatDate(new Date()),vendor:record.vendor||"",contractNo:record.contractNo||"",notes:record.notes||"",fileCount:record.files?.length||0,fileNames:(record.files||[]).map(f=>f.name),loggedAt:new Date().toISOString()},...historyData]);}sC({...complianceData,[key]:record});};
  const handleReset=async()=>{if(confirm("确定要重置并加载示例数据吗？")){try{await window.storage.delete("hk-compliance-properties");}catch{}try{await window.storage.delete("hk-compliance-data");}catch{}try{await window.storage.delete("hk-compliance-history");}catch{}const d=generateDemoData();setProperties(d.props);setComplianceData(d.compliance);setHistoryData(d.history);try{await window.storage.set("hk-compliance-properties",JSON.stringify(d.props));}catch{}try{await window.storage.set("hk-compliance-data",JSON.stringify(d.compliance));}catch{}try{await window.storage.set("hk-compliance-history",JSON.stringify(d.history));}catch{}setView("dashboard");}};

  if(loading)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:300,fontFamily:"'Noto Sans SC','PingFang SC',-apple-system,sans-serif"}}><div style={{textAlign:"center",color:"#888780"}}><div style={{fontSize:28,marginBottom:8}}>🏢</div><div style={{fontSize:14}}>加载中...</div></div></div>);
  const nav=[{id:"dashboard",l:"总览",i:"📊"},{id:"properties",l:"物业",i:"🏢"},{id:"checklist",l:"合规",i:"✅"},{id:"report",l:"报告",i:"📄"},{id:"history",l:"历史",i:"🕐"},{id:"ai",l:"AI 助手",i:"🤖"}];
  return(<div style={{fontFamily:"'Noto Sans SC','PingFang SC',-apple-system,sans-serif",maxWidth:800,margin:"0 auto",color:"#2c2c2a"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}><div><div style={{fontSize:22,fontWeight:700,letterSpacing:-0.5}}>物业合规管理系统</div><div style={{fontSize:12,color:"#888780",marginTop:2}}>香港物业管理合规追踪 · Property Compliance Tracker</div></div><button onClick={handleReset} style={{fontSize:11,color:"#b4b2a9",background:"none",border:"none",cursor:"pointer",padding:"4px 8px"}}>重置示例</button></div>
    <div style={{display:"flex",gap:2,marginBottom:24,borderBottom:"1px solid #e8e7e3",overflowX:"auto"}}>{nav.map(n=>(<button key={n.id} onClick={()=>setView(n.id)} style={{padding:"10px 12px",fontSize:13,fontWeight:view===n.id?600:400,color:view===n.id?"#2c2c2a":"#888780",background:"none",border:"none",borderBottom:view===n.id?"2px solid #2c2c2a":"2px solid transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:4,transition:"all 0.15s",whiteSpace:"nowrap",flexShrink:0}}><span style={{fontSize:14}}>{n.i}</span> {n.l}</button>))}</div>

    {view==="dashboard"&&<Dashboard properties={properties} complianceData={complianceData} onNavigate={(v,pid)=>{setSelectedProperty(pid);setView(v);}}/>}

    {view==="properties"&&<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontSize:16,fontWeight:600}}>我的物业</div><button onClick={()=>setShowAddProperty(true)} style={{padding:"6px 16px",borderRadius:8,border:"none",background:"#2c2c2a",color:"#fff",cursor:"pointer",fontSize:13}}>+ 新增</button></div>
      {showAddProperty&&<PropertyForm onSave={handleAddProperty} onCancel={()=>setShowAddProperty(false)}/>}
      {properties.map(p=>{let d=0,t=0,o=0;HK_COMPLIANCE_TEMPLATE.forEach(c=>c.items.forEach(i=>{const k=`${p.id}_${i.id}`;const r=complianceData[k];t++;if(r?.status==="completed")d++;else if(r?.dueDate&&r?.status!=="not_applicable"&&daysUntil(r.dueDate)<0)o++;}));return(<div key={p.id} style={{background:"#fff",border:"1px solid #e8e7e3",borderRadius:12,padding:"16px 18px",marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:15,fontWeight:600,color:"#2c2c2a"}}>{p.name}</div><div style={{fontSize:12,color:"#888780",marginTop:2}}>{p.address||"未填写"} · {({residential:"住宅",commercial:"商业",composite:"综合",industrial:"工业"})[p.type]} · 楼龄{p.buildingAge||"?"}年</div><div style={{display:"flex",gap:12,marginTop:8}}><span style={{fontSize:12,color:"#1D9E75"}}>✓ {d}/{t}</span>{o>0&&<span style={{fontSize:12,color:"#E24B4A"}}>⚠ {o} 逾期</span>}</div></div>
          <div style={{display:"flex",gap:6}}><button onClick={()=>{setSelectedProperty(p.id);setView("checklist");}} style={{fontSize:12,padding:"6px 12px",borderRadius:6,border:"1px solid #d3d1c7",background:"#fff",cursor:"pointer"}}>查看合规</button><button onClick={()=>handleDeleteProperty(p.id)} style={{fontSize:12,padding:"6px 12px",borderRadius:6,border:"1px solid #f7c1c1",background:"#fff",cursor:"pointer",color:"#E24B4A"}}>删除</button></div>
        </div></div>);})}
    </div>}

    {view==="checklist"&&<div>
      {properties.length>1&&<div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>{properties.map(p=>(<button key={p.id} onClick={()=>setSelectedProperty(p.id)} style={{padding:"6px 14px",borderRadius:8,fontSize:13,cursor:"pointer",border:(selectedProperty||properties[0]?.id)===p.id?"2px solid #2c2c2a":"1px solid #d3d1c7",background:(selectedProperty||properties[0]?.id)===p.id?"#2c2c2a":"#fff",color:(selectedProperty||properties[0]?.id)===p.id?"#fff":"#5f5e5a",fontWeight:(selectedProperty||properties[0]?.id)===p.id?600:400}}>{p.name}</button>))}</div>}
      {(selectedProperty||properties[0]?.id)&&<ComplianceChecklist property={properties.find(p=>p.id===(selectedProperty||properties[0]?.id))} complianceData={complianceData} onUpdate={handleComplianceUpdate} onUploadGeneral={(pid,files)=>{alert(`已为物业上传 ${files.length} 个文件`);}}/>}
    </div>}

    {view==="report"&&(properties.length===0?<div style={{textAlign:"center",padding:40,color:"#888780",fontSize:14}}>请先添加物业</div>:<ReportGenerator properties={properties} complianceData={complianceData} onUploadToReport={files=>{alert(`已上传 ${files.length} 个报告文件`);}}/>)}

    {view==="history"&&<HistoryView historyData={historyData} properties={properties} onDelete={id=>sH(historyData.filter(h=>h.id!==id))} onUploadToHistory={files=>{alert(`已上传 ${files.length} 个历史文件`);}}/>}

    {view==="ai"&&<AIBot properties={properties} complianceData={complianceData} historyData={historyData} onNavigate={(v,pid)=>{setSelectedProperty(pid);setView(v);}}/>}

    <div style={{marginTop:32,padding:"12px 16px",borderTop:"1px solid #e8e7e3",fontSize:11,color:"#b4b2a9",lineHeight:1.6}}>基于香港法例：Cap.95 消防条例 · Cap.123 建筑物条例 · Cap.344 建筑物管理条例 · Cap.406 电力条例 · Cap.572 消防安全(建筑物)条例 · Cap.618 升降机及自动梯条例 · Cap.626 物业管理服务条例。资料仅供参考。<br/>⚠️ 当前为演示版本，预装了示例数据。点击右上角「重置示例」可重新加载。</div>
  </div>);
}
