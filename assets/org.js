(function(){
  const KEY='wenduiOrgState';
  const LIST_KEY='wenduiOrgMemberships';
  const ACTIVE_KEY='wenduiActiveOrgCode';
  function defaultState(){return {org:null, personalResources:[
    {title:'函数图像互动探究工具', type:'数学课堂', owner:'志博', url:'/wendui-engine-resources/production/practice/cases/function-explorer.html'},
    {title:'托物言志阅读任务单', type:'语文阅读', owner:'志博', url:'/wendui-engine-resources/production/practice/cases/reading-task.html'},
    {title:'学校 AI 应用教研简报', type:'教研汇报', owner:'志博', url:'/wendui-engine-resources/production/practice/cases/ai-education-brief.html'}
  ]}}
  function get(){try{return JSON.parse(localStorage.getItem(KEY)||'null')||defaultState()}catch(e){return defaultState()}}
  function set(s){localStorage.setItem(KEY, JSON.stringify(s)); return s}
  function memberships(){try{const arr=JSON.parse(localStorage.getItem(LIST_KEY)||'[]');if(Array.isArray(arr))return arr}catch(e){}return []}
  function saveMemberships(arr){localStorage.setItem(LIST_KEY,JSON.stringify(arr));return arr}
  function syncActive(org){if(!org)return;localStorage.setItem(ACTIVE_KEY,org.code);localStorage.setItem(KEY,JSON.stringify({org,personalResources:get().personalResources||defaultState().personalResources,joinedAt:org.joinedAt||Date.now()}))}
  function addMembership(org){const clean={name:org.name||'学校组织',code:org.code,role:org.role||'成员',logo:org.logo||'',joinedAt:org.joinedAt||Date.now()};const arr=memberships();const idx=arr.findIndex(o=>String(o.code)===String(clean.code));if(idx>=0)arr[idx]={...arr[idx],...clean};else arr.push(clean);saveMemberships(arr);syncActive(clean);return clean}
  function codeFromName(name){let seed=0; for(const c of name){seed=(seed*31+c.charCodeAt(0))%10000} return 'ORG-'+String(seed).padStart(4,'0')+'-2026'}
  window.WenduiOrg={
    get,set,memberships,saveMemberships,addMembership,
    create(name){const clean=(name||'我的教学组织').trim(); const s=get(); const org=addMembership({name:clean, code:codeFromName(clean), role:'创建者', members:[
      {name:'志博', role:'创建者', resources:s.personalResources.length},
      {name:'陈老师', role:'成员', resources:2},
      {name:'林老师', role:'成员', resources:1}
    ], orgResources:[
      {title:'单元项目学习任务包', type:'项目学习', owner:'陈老师', url:'#'},
      {title:'课堂提问脚手架模板', type:'课堂工具', owner:'陈老师', url:'#'},
      {title:'阅读圈分工记录表', type:'语文阅读', owner:'林老师', url:'#'}
    ]}); s.org=org; return set(s)},
    join(code){const v=(code||'').trim().toUpperCase(); if(!/^ORG-\d{4}-2026$/.test(v) && !['BJZX-2026','BJZX-OFFICIAL-2026','CSXY-2026','WMZJ-2026'].includes(v)) return {ok:false,message:'暂未识别该组织代码，请核对后再试。'}; const s=get(); const name=v.startsWith('BJZX')?'北京中学':v.startsWith('CSXY')?'创世学院':v.startsWith('WMZJ')?'未名之境':'已加入的教学组织'; const org=addMembership({name, code:v, role:'成员'}); s.org=org; set(s); return {ok:true,message:'已加入 '+org.name+'。可继续加入或创建其他组织，并在产品成果空间左上角选择。'}},
    switch(code){const org=memberships().find(o=>String(o.code)===String(code)); if(org)syncActive(org); return org},
    leave(code){let arr=memberships(); const target=code||localStorage.getItem(ACTIVE_KEY); arr=arr.filter(o=>String(o.code)!==String(target)); saveMemberships(arr); if(arr[0])syncActive(arr[0]); else {localStorage.removeItem(KEY); localStorage.removeItem(ACTIVE_KEY)} return arr},
    reset(){localStorage.removeItem(KEY);localStorage.removeItem(LIST_KEY);localStorage.removeItem(ACTIVE_KEY)}
  };
})();
