(function(){
  const ROLE_KEY='wenduiRoleVersion';
  const ROLES={
    teacher:{label:'教师版',switchLabel:'切换到学生版',authKey:'wenduiTeacherAuth',defaultUser:{name:'志博',phone:'18193185960',loggedIn:true,org:'个人教师账号'},fallbackName:'老师'},
    student:{label:'学生版',switchLabel:'切换到教师版',authKey:'wenduiStudentAuth',defaultUser:{name:'小名',phone:'18193185960',loggedIn:true,org:'个人学生账号'},fallbackName:'小名'}
  };
  const role=()=>localStorage.getItem(ROLE_KEY)==='student'?'student':'teacher';
  const setRole=(r)=>localStorage.setItem(ROLE_KEY,r==='student'?'student':'teacher');
  const cfg=()=>ROLES[role()];
  function get(){try{return JSON.parse(localStorage.getItem(cfg().authKey)||'null')}catch(e){return null}}
  function login(){localStorage.setItem(cfg().authKey,JSON.stringify(cfg().defaultUser));return cfg().defaultUser}
  function logout(){localStorage.removeItem(cfg().authKey);location.href='/wendui-engine/login/'}
  function nextUrl(){const q=new URLSearchParams(location.search);return q.get('next')||'/wendui-engine/me/'}
  window.WenduiRole={get:role,set:setRole,isStudent(){return role()==='student'},toggle(){setRole(role()==='student'?'teacher':'student');location.reload()}};
  window.WenduiAuth={get key(){return cfg().authKey},get,login,logout,ensureDemo(){return get()},nextUrl};

  function walkText(map){
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement;if(!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;if(p&&(p.closest('script')||p.closest('style')||p.closest('.version-switcher')))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{let v=n.nodeValue;for(const [a,b] of Object.entries(map)){if(v.includes(a))v=v.split(a).join(b)}n.nodeValue=v;});
  }
  function isLiteSubpage(){const n=location.pathname.replace(/\/index\.html$/,'/');return n.endsWith('/wendui-engine/production/onboarding/')||n.endsWith('/wendui-engine/production/practice/')||n.endsWith('/wendui-engine/hermes/');}
  function makeSelector(){
    const n=location.pathname.replace(/\/index\.html$/,'/');const allow=n==='/wendui-engine/'||n.endsWith('/wendui-engine/login/');
    document.querySelectorAll('.version-switcher').forEach(el=>{if(!allow)el.remove()}); if(!allow)return;
    const brand=document.querySelector('.brand'); if(!brand||brand.querySelector('.version-switcher'))return;
    const c=cfg();const btn=document.createElement('button');btn.type='button';btn.className='version-switcher';btn.innerHTML='<b>当前'+c.label+'</b><span>'+c.switchLabel+'</span>';btn.onclick=e=>{e.preventDefault();window.WenduiRole.toggle()};brand.appendChild(btn);
  }
  function applyStudentGallery(){
    const gallery=document.querySelector('.gallery');if(!gallery||gallery.dataset.studentGallery)return;gallery.dataset.studentGallery='1';
    gallery.innerHTML=`<article class="panel artifact-card"><div class="thumb"><iframe src="/wendui-engine/production/practice/cases/student-insect-research.html" title="城市昆虫观察小研究缩略图"></iframe></div><div class="artifact-body"><div class="artifact-meta"><span>小研究</span><span>观察记录</span><span>可展示页面</span></div><h3>我的城市昆虫观察小研究</h3><p>把一周观察到的昆虫、地点、时间和发现整理成可展示的小研究页面。</p><div class="evidence">适用场景：科学探究、项目学习、社团展示。</div><div class="artifact-actions"><a class="btn" target="_blank" href="/wendui-engine/production/practice/cases/student-insect-research.html">打开完整预览</a></div></div></article><article class="panel artifact-card"><div class="thumb"><iframe src="/wendui-engine/production/practice/cases/student-math-game.html" title="二次函数闯关小游戏缩略图"></iframe></div><div class="artifact-body"><div class="artifact-meta"><span>数学练习</span><span>互动工具</span><span>闯关产品成果</span></div><h3>二次函数闯关小游戏</h3><p>把二次函数图像判断做成三关小游戏，边玩边复习顶点、开口和交点。</p><div class="evidence">适用场景：自主复习、小组挑战、成果展示。</div><div class="artifact-actions"><a class="btn" target="_blank" href="/wendui-engine/production/practice/cases/student-math-game.html">打开完整预览</a></div></div></article><article class="panel artifact-card"><div class="thumb"><iframe src="/wendui-engine/production/practice/cases/student-water-poster.html" title="校园节水倡议海报页缩略图"></iframe></div><div class="artifact-body"><div class="artifact-meta"><span>公共议题</span><span>海报页</span><span>路演说明</span></div><h3>校园节水倡议海报页</h3><p>把校园节水问题、调查发现、行动建议和倡议口号做成一页展示产品成果。</p><div class="evidence">适用场景：班会展示、项目路演、校园倡议。</div><div class="artifact-actions"><a class="btn" target="_blank" href="/wendui-engine/production/practice/cases/student-water-poster.html">打开完整预览</a></div></div></article>`;
  }
  function studentMap(){return {
    '教师 AI 工作流引擎':'学生 AI 创作伙伴',
    '学校 AI 养马创作与产品成果平台':'学生 AI 养马创作与产品成果平台',
    '养马创作':'养马创作','产品成果':'产品成果','个人中心':'个人空间',
    '我的成果':'我的成果','成果沉淀':'成果沉淀','成果记录':'成果记录','成果条目':'成果条目','成果库':'成果库','成果管理':'成果管理','成果空间':'成果空间','资源成长平台':'产品成果成长平台','资源成长':'产品成果成长','资源展示':'产品成果展示','优秀成果案例':'优秀产品成果案例','组织资源':'组织产品成果','成员资源':'成员产品成果','成果最多':'成果最多','教师共享成果':'学生共享成果','教师成果空间':'学生成果空间','教师组织':'学习组织',
    '做成资源':'做成产品成果','资源可预览':'成果可预览','真实资源':'真实产品成果','真实成果':'真实产品成果','成果生成数据':'成果成长数据','养马创作入口':'养马创作入口','最近成果':'最近成果','继续养马创作':'继续养马创作','查看成果':'查看成果','生成产品成果':'生成产品成果','日常成果修改':'日常产品成果修改','成果整理':'产品成果整理','成果打磨':'产品成果打磨','成果修改':'产品成果修改','资源版会员':'成果版会员','月度任务包':'月度创作包','开通成果版':'开通成果版',
    '教师登录':'学生登录','教学想法':'创作想法','教学需求':'创作需求','教学目标':'创作目标','教学任务':'创作任务','教学成果':'创作成果','教学':'创作','课堂':'学习场景','备课':'学习规划','教研':'项目复盘','老师':'学生','教师':'学生','志博':'小名','个人教师账号':'个人学生账号',
    '进入个人创作通道、产品成果和组织管理。':'进入个人创作通道、产品成果和组织管理。','进入个人创作通道、产品成果和组织管理。':'进入个人创作通道、产品成果和组织管理。','进入个人创作通道':'进入个人创作通道','生产任务':'创作任务','组织协作':'组织管理',
    '养好你的爱马，把工作想法做成可使用、可展示、可复用的产品成果。':'养好你的爱马，把想法做成可展示、可分享、可继续迭代的产品成果。',
    '节点引擎由爱马驱动，面向学生每天真实遇到的学习规划、上课、项目复盘和成果整理任务。它不是“多一个聊天窗口”，而是帮学生把学习需求做成项目方案、学习场景工具、研究报告、展示页面和可复用成果。':'节点引擎由爱马驱动，面向学生真实遇到的想法表达、项目研究、产品成果创作、展示汇报和成长记录任务。它不是“多一个聊天窗口”，而是帮你把想法做成小研究、互动产品成果、展示页面、项目材料和个人成果集。',
    '节点引擎由爱马驱动，面向老师每天真实遇到的教学准备、班级事务、材料整理、家校沟通、教研协作和成果沉淀任务。它不是“多一个聊天窗口”，而是帮老师把工作想法做成可使用的方案、材料、工具、报告、展示页面和可复用成果。':'节点引擎由爱马驱动，面向学生真实遇到的想法表达、项目研究、产品成果创作、展示汇报和成长记录任务。它不是“多一个聊天窗口”，而是帮你把想法做成小研究、互动产品成果、展示页面、项目材料和个人成果集。',
    '进入养马创作':'进入养马创作','进入产品成果':'进入产品成果','爱马养马创作流':'爱马养马创作流',
    '我想把一个工作想法做成能直接使用的材料，最好还能形成可展示、可复用的工具。':'我想做一个关于“校园节水”的项目，最好能做成可展示的页面和海报。',
    '我会先拆解教学目标，再生成互动页面、学习场景提问、使用说明和成果记录。':'我会先拆解创作目标，再生成研究步骤、展示页面、海报文案和成果记录。',
    '爱马：陪老师把工作想法落地的 AI 工作流伙伴':'爱马：陪学生把想法做成产品成果的 AI 养马创作伙伴',
    '养成之后，你可以把教学想法交给它，让它生产课堂工具、任务单、报告和资源页。':'养成之后，你可以把自己的想法交给它，让它生成项目页面、小研究、报告、海报和产品成果集。',
    '养马攻略：从教学任务到资源':'养马攻略：从创作想法到产品成果','当前为个人组织管理。加入学校或教师组织后，可以看到组织资源、教师成果和优秀成果案例。':'当前为个人组织管理。加入学习组织后，可以看到同学成果、组织产品成果和优秀产品成果案例。',
    '把创作想法做成成果':'把创作想法做成产品成果','把创作想法交给它生产成果':'把创作想法交给它生成产品成果','输入开通码，开始养马创作':'输入开通码，开始养马创作','开始生产':'开始创作','生产成果':'产品成果','成果可预览':'成果可预览','再发任务':'再发起创作','学习场景工具':'互动学习工具','项目复盘简报':'项目展示页面','可复用到产品成果':'可复用到产品成果',
    '养好你的爱马，把工作想法做成可使用、可展示、可复用的产品成果。':'养好你的爱马，把想法做成可展示、可分享、可继续迭代的产品成果。','把创作想法做成能上课、能展示、能复用的成果。':'养好你的爱马，把想法做成可展示、可分享、可继续迭代的产品成果。','帮学生把创作需求做成课程方案、互动学习工具、研究报告、展示页面和可复用成果。':'帮你把想法做成小研究、互动产品成果、展示页面、项目材料和个人成果集。','课程方案':'项目方案','可复用成果':'可复用成果','上课':'展示','资源页面':'产品页面','资源材料':'产品成果材料','产品成果':'产品成果','养马创作':'养马创作','爱马养成':'爱马养成','把你的爱马养起来。':'把你的爱马养起来。','先把需求说清楚':'先把想法说清楚','爱马会识别年级、学科、课堂场景和预期成果，先帮学生把模糊想法整理成清楚任务。':'爱马会识别你的主题、目标、使用场景和想做出的产品成果，先帮你把模糊想法整理清楚。','再拆成可执行步骤':'再拆成一步步任务','把一个创作想法拆成课程结构、学习场景任务、互动工具、展示页面和成果记录。':'把一个创作想法拆成资料收集、页面结构、展示内容、互动工具和成果记录。','直接生成可用材料':'直接做出可展示产品成果','围绕项目、工具、报告、任务单和页面等教育场景，输出学生能直接查看、使用和继续修改的成果。':'围绕项目、工具、报告、展示页等学习场景，输出你能直接查看、展示和继续修改的产品成果。','把成果留下来':'把产品成果留下来','把一次生成结果沉淀到学校产品成果，让优秀成果能被查找、复用、迭代，而不是停留在聊天记录里。':'把一次创作结果保存到产品成果库，让好产品成果能被查看、展示、继续修改，而不是停留在聊天记录里。','进入组织成果空间':'进入班级/学校产品成果空间','个人先使用，加入组织后可以查看学校成果、学生共享成果和官方推荐成果。':'个人先使用，加入组织后可以查看同学成果、学校产品成果和官方推荐产品成果。','下次继续修改':'下次继续改进','已经生成的工具、页面和材料可以继续修改、扩展和沉淀，形成可复用的产品成果。':'已经生成的工具、页面和材料可以继续修改、扩展和展示，形成自己的展示产品成果。','教师 AI 工作流伙伴':'学生 AI 养马创作伙伴','6. 开始第一个教学任务':'6. 开始第一个创作任务','教学想法':'创作想法','交付资源':'交付产品成果','协助你整理教学成果':'陪你创作产品成果','协助你生产产品成果':'陪你创作产品成果','生产产品成果':'创作产品成果','个人中心、养马创作和产品成果':'个人空间、养马创作和产品成果','个人中心、养马创作和产品成果':'个人空间、养马创作和产品成果','AI 助手':'AI 小伙伴','研究材料':'小研究','展示页面':'展示海报','汇报材料':'路演材料','把你的想法做成能展示、能分享、能继续迭代的资源。':'养好你的爱马，把想法做成可展示、可分享、可继续迭代的产品成果。','学习场景场景':'学习场景','课程结构':'项目结构','围绕方案、工具、报告、材料和页面等教育场景':'围绕项目、工具、报告、展示页和产品成果集等学习场景','生成结果':'创作结果','学校产品成果':'产品成果','AI 工作流伙伴':'AI 养马创作伙伴','养成好':'养起来','生成互动学习工具、任务单、项目展示海报、展示海报和产品成果材料':'生成互动学习工具、项目步骤、展示页面和产品成果材料','生产产品成果':'创作产品成果','综合生产':'综合创作','开始第一个教学任务':'开始第一个创作任务','资源集':'产品成果集','方案、工具、报告、材料':'项目、工具、报告、产品页','组织执行':'组织创作','生成结果':'创作结果','AI 养马创作内核':'AI 养马创作伙伴','AI 工作流伙伴':'超级智能体创作伙伴','课程材料':'产品成果材料','组织多步骤执行':'组织多步骤创作','理解 → 规划 → 生成 → 验证 → 沉淀':'理解 → 规划 → 创作 → 发布 → 沉淀','理解 → 规划 → 生产 → 发布 → 沉淀':'理解 → 规划 → 创作 → 发布 → 沉淀','一次生成':'一次创作','连接资源':'连接产品成果','能展示、能展示':'能使用、能展示','为什么学生需要的不只是普通问答':'为什么学生需要一匹自己的爱马','学生不只需要一段建议，更需要能展示、能展示、能继续修改的成果。':'学生不只需要一段建议，更需要一匹能陪自己想清楚、做出来、改下去的爱马。','学生提出：我想做一个学生能操作的函数图像工具。':'学生提出：我想做一个能帮助同学理解函数图像的互动产品成果。','学生对象':'使用对象','课程结构':'项目结构','创作页面':'产品页面','简报页面':'展示页面','把一次创作和产品成果连接起来':'把一次创作和产品成果连接起来','学校成果':'个人产品成果','沉淀个人产品成果':'沉淀个人产品成果','应用实践':'养马攻略','应用案例':'养马攻略','案例成果':'养马攻略'
  }}

  const teacherCleanup={
    '切换到学生版':'切换到学生版','养马创作':'养马创作','产品成果':'产品成果','产品成果':'产品成果','养马攻略':'养马攻略','养马攻略':'养马攻略','养马攻略':'养马攻略','查看养马攻略':'查看养马攻略','查看养马攻略':'查看养马攻略','养马攻略':'养马攻略','养马攻略':'养马攻略','养马攻略':'养马攻略','进入养马创作':'进入养马创作','进入产品成果':'进入产品成果','进入养马创作':'进入养马创作','进入产品成果':'进入产品成果','组织管理':'组织管理','组织管理':'组织管理','组织管理':'组织管理','组织管理':'组织管理','创作版':'工作流版','月度创作包':'月度任务包','开通成果版':'开通成果版','个人空间':'个人中心','节点引擎':'节点引擎'
  };

  function finalCopySweep(){
    const fixes={
      '生产创作资源':'创作产品成果',
      '协助你生产创作资源':'陪你创作产品成果',
      '每天协助你生产创作资源的地方':'每天陪你创作产品成果的地方',
      '可展示、可展示':'可展示、可分享',
      '做成产品成果':'做成产品成果',
      '产品成果':'产品成果','产品成果详情':'成果详情','点击产品成果卡片':'点击成果卡片','官方产品成果库':'官方成果库','个人产品成果库':'个人成果库','产品成果空间':'成果空间','个人产品成果':'个人成果','官方产品成果':'官方成果','产品成果展示':'产品成果展示','AI 产品成果':'AI 产品成果','产品成果最多优先':'成果最多优先','推荐产品成果':'推荐成果','学生个人共享产品成果':'成员个人成果','同学产品成果':'同学成果',
      '生成产品成果':'生成产品成果',
      '沉淀到产品成果':'沉淀成产品成果','互动学习工具、任务单、项目展示海报和展示海报':'互动学习工具、小研究、任务单和展示页面','个人产品成果先可见':'个人成果先可见','未加入组织时先显示个人成果':'未加入组织时先显示个人成果','已获得个人产品成果权限':'已加入学习组织','学生自己生产的课程、工具、任务单和项目复盘页面，会先沉淀为个人产品成果。':'学生通过养马创作生成的小研究、互动产品成果和展示页面，会先沉淀为个人成果。','个人产品成果库':'个人成果库','学生通过养马创作做出的互动学习工具、任务单、项目展示海报和展示海报':'学生通过养马创作做出的互动学习工具、小研究、任务单和展示页面','老师自己生产的课程、工具、任务单和教研页面，会先沉淀为个人成果。':'老师通过养马创作生成的课堂工具、任务单和教研页面，会先沉淀为个人成果。'
    };
    if(role()==='student'){
      Object.assign(fixes,{
        '服务与权益':'成长权益','用量与额度':'创作额度','本月用量':'本月创作','剩余额度':'剩余创作额度','当前大脑':'当前爱马大脑',
        '从这里管理你的爱马、爱马大脑、使用额度、服务权益和组织身份。成果统一沉淀在「产品成果」库，个人空间只保留入口和用量概览。':'从这里管理你的爱马、创作额度、学习组织和个人成果入口。正式成果统一沉淀在「产品成果」库，个人空间只保留常用入口和状态概览。',
        '完成协作入口、名字、头像和开通码':'完成协作入口、名字、头像和开通码',
        '完成飞书安装、起名、头像和开通码，让你的个人 AI 小伙伴真正进入工作状态。':'完成协作入口、起名、头像和开通码，让你的个人 AI 小伙伴真正开始陪你创作。',
        '进入协作空间':'进入协作空间',
        '这里先用飞书作为马厩，':'这里先用协作空间作为马厩，',
        '帮你把想法做成学习计划、小研究、互动产品成果、展示海报和个人成果集':'帮你把想法做成小研究、互动产品成果、展示页面、项目材料和个人成果集',
        '最终交付：可打开的互动工具、展示说明、任务拆解、发布链接。':'最终交付：可打开的互动工具、展示说明、任务拆解和分享链接。',
        '最终交付：可打开的互动工具、学生使用说明、任务拆解、发布链接。':'最终交付：可打开的互动工具、展示说明、任务拆解和分享链接。',
        '学生自己生产的课程、工具、任务单和项目复盘页面，会先沉淀为个人成果。':'学生通过养马创作生成的小研究、互动产品成果和展示页面，会先沉淀为个人成果。',
        '我会先拆解创作目标，再生成互动页面、学习场景提问、使用说明和成果记录。':'我会先拆解创作目标，再生成研究步骤、展示页面、说明文案和成果记录。',
        '学生通过养马创作做出的互动学习工具、小研究、任务单和展示海报':'学生通过养马创作做出的互动学习工具、小研究、任务拆解和展示页面',
        '学生通过养马创作做出的互动学习工具、小研究、任务单和展示页面':'学生通过养马创作做出的互动学习工具、小研究、任务拆解和展示页面',
        '这里是你的个人工作台：继续让爱马处理创作任务，查看已经沉淀的产品成果，管理学校组织和常用设置。':'这里是你的个人创作空间：继续做产品成果，查看已经完成的展示成果，加入学习组织，也可以回到爱马继续修改。',
        '当前爱马':'我的爱马',
        '综合创作马':'综合创作马',
        '适合综合创作任务':'适合项目、作业和展示产品成果',
        '本月已完成':'我的产品成果',
        '12 个创作成果':'12 个展示成果',
        '3 个本周更新':'3 个本周继续修改',
        '组织状态':'学习组织',
        '个人空间':'个人创作空间',
        '可加入学校组织':'可加入班级/学校组织',
        '最近入口':'下一步',
        '产品成果库':'我的产品成果库',
        '查看和复用成果':'查看、展示和继续修改',
        '继续做创作材料':'继续做产品成果',
        '继续做教学材料':'继续做产品成果',
        '查看产品成果库':'查看我的产品成果',
        '管理组织':'加入学习组织',
        '查看使用记录':'查看创作记录',
        '从这里管理你的爱马、创作额度、学习组织和个人成果入口。正式成果统一沉淀在「产品成果」库，个人空间只保留常用入口和状态概览。':'这里是你的个人创作空间：继续做产品成果，查看已经完成的展示成果，加入学习组织，也可以回到爱马继续修改。',
        '创作额度':'创作记录',
        '成长权益':'成长支持',
        
        '爱马：陪学生把创作想法落地的 超级智能体创作伙伴':'爱马：陪学生把想法做成产品成果的 AI 创作伙伴',
        '爱马会识别年级、学科、学习场景和预期成果，先帮学生把模糊想法整理成清楚任务。':'爱马会识别你的主题、目标、使用场景和想做出的产品成果，先帮你把模糊想法整理清楚。',
        '围绕项目、工具、报告、产品页和页面等场景，输出学生能查看、使用和继续修改的成果。':'围绕项目、工具、报告和展示页等学习场景，输出你能查看、展示和继续修改的产品成果。',
        '这匹爱马负责接收你的想法、拆解任务、生成产品成果并沉淀下来。':'这匹爱马负责接收你的想法、拆解任务、生成产品成果并保存下来。',
        '把一次创作结果沉淀成我的产品成果库，让好成果能被查找、复用和继续迭代。':'把一次创作结果保存到我的产品成果库，让产品成果能被查看、展示和继续修改。',
        '支持项目复盘复用':'让产品成果可以展示',
        '产品成果完成后，可以用于班级展示、项目汇报，也可以作为自己的成长记录。':'产品成果完成后，可以用于班级展示、项目汇报，也可以作为自己的成长记录。',
        '持续积累能力':'下次继续改好',
        '每次创作都会沉淀经验，让下一次项目、产品成果和表达更顺手。':'产品成果不是一次完成就结束，可以继续修改、扩展和升级。',
        '大脑选配':'创作方式',
        '大模型是爱马的底层思考能力；不同大脑适合不同任务，也会影响算力消耗。':'不同创作方式适合不同任务：有的适合写作表达，有的适合复杂项目，有的适合日常修改。',
        '豆包大脑':'日常创作马',
        '小米大脑':'轻量陪伴马',
        'GPT 大脑':'复杂项目马',
        
        '让学生和项目复盘组更容易发现哪些成果能直接借鉴、改造和推广。':'产品成果完成后，可以用于班级展示、项目汇报，也可以作为自己的成长记录。',
        '学生可以先用个人身份开通创作通道，发起任务、查看养马攻略、学习怎么描述需求。重点不是问一句话，而是拿到能用于学习场景或项目复盘的成果。':'学生可以先养好自己的爱马，发起任务、查看养马攻略、学习怎么描述需求。重点不是问一句话，而是把想法做成能展示和继续修改的产品成果。',
        '学生可以先建立自己的成果空间，找到课程、工具、任务单和展示页；加入学习组织后，还能看到组织内其他学生的资源。':'学生可以先建立自己的产品成果空间，找到小研究、互动工具、展示页和产品说明；加入学习组织后，还能看到同学的产品成果。',
        '课程、工具、任务单':'小研究、互动工具、产品说明',
        '组织成员资源':'同学成果',
        '个人成果空间':'个人产品成果空间',
      });
    } else {
      Object.assign(fixes,{
        '从这里管理你的爱马、爱马大脑、使用额度、服务权益和组织身份。成果统一沉淀在「产品成果」库，个人中心只保留入口和用量概览。':'从这里管理你的爱马、爱马大脑、使用额度、服务权益和组织身份。正式成果统一沉淀在「产品成果」库，个人中心只保留常用入口和状态概览。',
        '最终交付：可打开的互动工具、老师使用说明、任务拆解、发布链接。':'最终交付：可打开的工具、材料说明、任务拆解和发布链接。',
        '我会先拆解目标和使用场景，再生成页面、材料、说明和成果记录。':'我会先拆解目标和使用场景，再生成页面、材料、说明和成果记录。',
        '这里是你的个人工作台：继续让爱马处理教学任务，查看已经沉淀的产品成果，管理学校组织和常用设置。':'这里是你的个人工作台：继续做教学材料，查看已经沉淀的产品成果，管理学校组织和常用设置。',
        '当前爱马':'我的爱马',
        '本月已完成':'本月成果',
        '组织状态':'学校组织',
        '最近入口':'下一步',
        '继续做教学材料':'继续做教学材料',
        '查看产品成果库':'查看成果库',
        '查看使用记录':'查看使用记录',
        '项目结构':'课程结构',
        '产品成果不是一次完成就结束，可以继续修改、扩展和升级。':'成果不是一次完成就结束，可以继续修改、扩展和复用。',
        '报告、展示页、产品说明':'报告、页面、任务单',
        '产品成果：把做过的产品成果找回来':'产品成果：把做过的成果找回来',
        '老师可以先用个人身份开通创作通道，发起任务、查看养马攻略、学习怎么描述需求。重点不是问一句话，而是拿到能用于课堂或教研的成果。':'老师可以先养好自己的爱马，发起任务、查看养马攻略、学习怎么描述需求。重点不是问一句话，而是拿到能用于课堂或教研的成果。',
      });
    }
    if(role()==='student')Object.assign(fixes,{
      '节点引擎由爱马驱动，面向学生每天真实遇到的创作准备、班级事务、材料整理、家校沟通、项目复盘协作和成果沉淀任务。它不是“多一个聊天窗口”，而是帮学生把工作想法做成可使用的方案、材料、工具、报告、展示海报和可复用成果。':'节点引擎由爱马驱动，面向学生真实遇到的想法表达、项目研究、产品成果创作、展示汇报和成长记录任务。它不是“多一个聊天窗口”，而是帮你把想法做成小研究、互动产品成果、展示页面、项目材料和个人成果集。',
      '爱马：陪学生把工作想法落地的 超级智能体创作伙伴':'爱马：陪学生把想法做成产品成果的 AI 创作伙伴',
      '爱马不是普通问答助手，而是陪你把想法做成成果的核心伙伴。学生提出一个工作目标后，它会帮助梳理目标、拆成步骤、生成成果，并把可复用内容沉淀下来。':'爱马不是普通问答助手，而是陪你把想法做成产品成果的创作伙伴。你提出一个目标后，它会帮你梳理想法、拆成步骤、生成产品成果，并把可继续修改的成果保存下来。',
      '把一个工作想法拆成任务结构、执行步骤、可用工具、展示海报和成果记录。':'把一个想法拆成项目结构、行动步骤、产品页面、展示材料和成果记录。',
      '围绕方案、工具、报告、任务单、沟通材料和页面等场景，输出学生能查看、使用和继续修改的成果。':'围绕小研究、互动工具、展示页、项目材料和产品说明等场景，输出你能查看、展示和继续修改的产品成果。',
      '养马创作：把工作想法做出来':'养马创作：把想法做成产品成果',
      '学生可以先用个人身份养好自己的爱马，发起任务、查看养马攻略、学习怎么描述需求。重点不是问一句话，而是把日常工作、创作项目复盘、沟通汇报和成果沉淀做成可交付内容。':'学生可以先养好自己的爱马，发起任务、查看攻略、学习描述需求。重点不是问一句话，而是把想法、项目和产品成果做成能打开、能分享、能继续修改的成果。',
      '学生可以先建立自己的成果空间，找到方案、工具、材料、报告和展示页；加入学习组织后，还能看到组织内其他学生的资源。':'学生可以先建立自己的成果空间，找到小研究、互动工具、展示页、产品说明和项目材料；加入组织后，还能看到同学的产品成果。',
      '从日常事务到创作项目复盘、从材料整理到成果展示，节点引擎都围绕学生的真实工作展开。':'从一个想法开始，到项目推进、产品成果展示和成果复盘，节点引擎都围绕学生真实要完成的事展开。',
      '开始一项工作前':'有一个想法时',
      '把一个想法变成方案结构、执行步骤或可用工具雏形。':'把一个想法变成项目结构、行动步骤或产品成果雏形。',
      '执行过程中':'做产品成果时',
      '把用过的成果沉淀下来，下一次同类工作继续改、继续用。':'把做过的成果沉淀下来，下一次项目、展示或产品成果升级时继续改、继续用。',
      '让工作成果做得出来，也找得回来。':'让产品成果做得出来，也找得回来。',
      '综合创作马':'综合创作马',
    });
    Object.assign(fixes,{
      '适合班级、项目复盘组或学校统一开通，支持组织成果库和成员协作。':'适合班级、社团或学校统一开通，支持组织成果库和成员协作。',
      '学生 超级智能体创作伙伴':'学生 AI 创作伙伴',
      '爱马就是学生在节点引擎里养的一匹 超级智能体创作伙伴。学生提出创作目标后，它会帮助梳理需求、拆解步骤、生成产品成果材料、互动学习工具、报告页面，并把可复用成果沉淀成产品成果。':'爱马就是学生在节点引擎里养的一匹 AI 创作伙伴。你提出创作目标后，它会帮助梳理需求、拆解步骤、生成产品成果材料、互动学习工具和展示页面，并把可继续修改的成果保存下来。',
      '帮助学生和项目复盘组看见哪些成果能复用、能改造、能推广。':'帮助学生看见哪些产品成果能继续修改、展示和分享。',
      '让学生和项目复盘组更容易发现哪些成果能直接借鉴、改造和推广。':'产品成果完成后，可以用于班级展示、项目汇报，也可以作为自己的成长记录。',
      '学生可以先用个人身份养好自己的爱马，发起任务、查看养马攻略、学习怎么描述需求。重点不是问一句话，而是拿到能用于学习场景或项目复盘的成果。':'学生可以先养好自己的爱马，发起任务、查看养马攻略、学习怎么描述需求。重点不是问一句话，而是把想法做成能展示和继续修改的产品成果。',
      '你不需要理解模型参数，只要选择任务类型；爱马会自动用合适方式完成。':'你不用管背后的技术，只要选择任务类型；爱马会自动用合适方式完成。',
      '你不需要理解模型参数，只要选择任务类型，爱马会自动用合适方式完成。':'你不用管背后的技术，只要选择任务类型，爱马会自动用合适方式完成。',
    });
    if(role()==='student')Object.assign(fixes,{
      '帮你把想法做成小研究、互动产品成果、展示海报、项目材料和个人成果集':'帮你把想法做成小研究、互动产品成果、展示页面、项目材料和个人成果集',
      '爱马：陪学生把想法做成产品成果的 AI 创作伙伴':'爱马：陪学生把想法做成产品成果的 AI 创作伙伴',
      '爱马不是普通问答助手，而是陪你把想法做成产品成果的创作伙伴。你提出一个目标后，它会帮你梳理想法、拆成步骤、生成产品成果，并把可继续修改的成果保存下来。':'爱马不是普通问答助手，而是陪你把想法做成产品成果的创作伙伴。你提出一个目标后，它会帮你梳理想法、拆成步骤、生成产品成果，并把可继续修改的成果保存下来。',
      '爱马会识别对象、场景、任务类型和预期成果，先帮学生把模糊想法整理成清楚任务。':'爱马会识别你的主题、目标、使用场景和想做出的产品成果，先帮你把模糊想法整理清楚。',
      '支持组织复用':'支持展示分享',
      '让学生和组织成员更容易发现哪些成果能直接借鉴、改造和推广。':'让产品成果更容易被展示、分享、继续修改和升级。',
      '养马创作：把想法做成产品成果':'养马创作：把想法做成产品成果',
    });
    walkText(fixes);
    // Final product-grade terminology cleanup after role maps; prevents repeated replacements such as 产品产品成果.
    walkText({
      '产品产品产品产品成果':'产品成果',
      '产品产品产品成果':'产品成果',
      '产品产品成果':'产品成果',
      '产品成果成果':'产品成果',
      '产品成果产品成果':'产品成果',
      '日常产品成果修改':'日常成果修改',
      '产品成果整理':'成果整理',
      '产品成果打磨':'成果打磨'
    });
  }

  function applyRole(){
    const r=role(), user=get();document.body.classList.toggle('role-student',r==='student');document.body.classList.toggle('subpage-lite',isLiteSubpage());
    if(r==='teacher')walkText(teacherCleanup);
    if(r==='student'){walkText(studentMap());applyStudentGallery();}
    document.querySelectorAll('header .brand p,.topbar .brand p').forEach(el=>el.textContent=r==='student'?'学生 AI 创作伙伴':'教师 AI 工作流引擎');
    document.querySelectorAll('[data-auth-name]').forEach(el=>el.textContent=user?user.name:cfg().fallbackName);
    document.querySelectorAll('[data-auth-phone]').forEach(el=>el.textContent=user?user.phone:'18193185960');
    document.querySelectorAll('[data-auth-status]').forEach(el=>el.textContent=user?'已登录 · '+user.name:'未登录');
    const av=document.querySelector('.account-avatar'); if(av)av.textContent=r==='student'?'名':'志';
    const meLink=document.querySelector('.links a[href="/wendui-engine/me/"]');
    if(meLink){if(user){meLink.textContent=user.name;meLink.classList.add('identity-link')}else{meLink.textContent='登录';meLink.classList.remove('identity-link');meLink.href='/wendui-engine/login/?next=/wendui-engine/me/'}}
    const officialKicker=document.querySelector('.official-login-copy .kicker'); if(officialKicker)officialKicker.textContent=r==='student'?'学生登录':'教师登录';
    makeSelector();normalizeAccountSections();renderOrgState();setupAccountScrollspy();setupHorseScrollspy();finalCopySweep();
  }

  function setupHorseScrollspy(){
    const menu=document.querySelector('.taming-menu'); if(!menu||menu.dataset.spyReady)return; menu.dataset.spyReady='1';
    const links=[...menu.querySelectorAll('a')];
    links.forEach((a,i)=>{const sec=a.getAttribute('href')?document.querySelector(a.getAttribute('href')):null; if(!sec){const s=[...document.querySelectorAll('.taming-step')][i]; if(s){s.id=s.id||'horse-step-'+(i+1); a.setAttribute('href','#'+s.id)}}});
    const fresh=[...menu.querySelectorAll('a[href^="#"]')]; const sections=fresh.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const setActive=id=>fresh.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));
    fresh.forEach(a=>a.addEventListener('click',e=>{const sec=document.querySelector(a.getAttribute('href')); if(!sec)return; e.preventDefault(); sec.scrollIntoView({behavior:'smooth',block:'start'}); setActive(sec.id)}));
    const update=()=>{let best=sections[0],score=1e9; for(const sec of sections){const r=sec.getBoundingClientRect(); const sc=Math.abs(r.top-92)+(r.bottom<92?9999:0); if(sc<score){score=sc;best=sec}} if(best)setActive(best.id)};
    window.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true}); setTimeout(update,60); setInterval(update,160);
  }

  function bindLogin(){const btns=document.querySelectorAll('.login-submit');btns.forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.addEventListener('click',e=>{e.preventDefault();login();const res=document.getElementById('loginResult');if(res){res.className='result show ok';res.textContent='登录成功，正在进入。'}setTimeout(()=>location.href=nextUrl(),160)},true)})}

  function normalizeAccountSections(){
    const menu=document.querySelector('.account-menu'); const detail=document.querySelector('.account-detail'); if(!menu||!detail)return;
    const labels=role()==='student' ? [['overview','我的首页'],['horse','我的爱马'],['brain','创作方式'],['usage','创作记录'],['billing','成长支持'],['space','学习组织'],['security','账号安全']] : [['overview','我的首页'],['horse','我的爱马'],['brain','任务方式'],['usage','使用记录'],['billing','服务支持'],['space','组织管理'],['security','账号安全']];
    [...menu.querySelectorAll('a')].forEach((a,i)=>{if(labels[i]){a.setAttribute('href','#'+labels[i][0]);a.textContent=labels[i][1];}});
    labels.forEach(([id])=>{const sec=document.getElementById(id); if(sec){sec.classList.add('account-section');sec.style.scrollMarginTop=window.innerWidth<=760?'82px':'104px';}});
    const sp=document.getElementById('space'); if(sp){const k=sp.querySelector('.kicker,h3,h4'); if(k)k.textContent='组织管理';}
  }

  function renderOrgState(){
    const box=document.getElementById('orgStateBox'); if(!box)return;
    const user=get(); const isStudent=role()==='student';
    function memberships(){try{const arr=JSON.parse(localStorage.getItem('wenduiOrgMemberships')||'[]');if(Array.isArray(arr)&&arr.length)return arr;const legacy=JSON.parse(localStorage.getItem('wenduiOrgState')||'null');if(legacy&&legacy.org)return [legacy.org]}catch(e){}return []}
    function activeOrg(){const arr=memberships();const code=localStorage.getItem('wenduiActiveOrgCode');return arr.find(o=>String(o.code)===String(code))||arr[0]||null}
    if(!user){
      box.innerHTML=`<div class="org-state-banner warn"><b>未登录，暂不能加入组织</b><span>请先登录${isStudent?'学生':'教师'}账号，再输入学校或组织码。登录后这里会显示个人组织、已加入组织和组织成果权限。</span></div><div class="org-actions"><a class="btn primary" href="/wendui-engine/login/?next=/wendui-engine/me/">去登录</a><a class="btn" href="/wendui-engine/resources/">先看产品成果</a></div>`;
      return;
    }
    const arr=memberships(); const org=activeOrg();
    if(arr.length){
      box.innerHTML=`<div class="org-state-banner ok"><b>已加入 ${arr.length} 个组织</b><span>当前组织：${org.name||'学校组织'} · 组织码 ${org.code||'BJZX-2026'} · 身份 ${org.role||'成员'}。可以继续加入或创建组织，并在产品成果空间左上角选择。</span></div><div class="org-summary-grid">${arr.map(o=>`<div><span>${String(o.code||'ORG')}</span><b>${o.name||'学校组织'}</b><em>${String(o.code)===String(org.code)?'当前使用':'可选择'}</em></div>`).join('')}</div><div class="input-stack org-join-row"><input id="joinOrgCodeMe" value="CSXY-2026" aria-label="继续加入组织代码"><button class="btn primary" type="button" onclick="WenduiOrg.join(document.getElementById('joinOrgCodeMe').value||'CSXY-2026');location.reload()">继续加入组织</button><button class="btn" type="button" onclick="WenduiOrg.create(prompt('请输入新组织名称')||'我的新组织');location.reload()">创建新组织</button><a class="btn" href="/wendui-engine/resources/bjzx/">进入产品成果空间</a><button class="btn" type="button" onclick="WenduiOrg.reset();location.reload()">清空演示组织</button><div class="org-help">多组织会保存在本机浏览器，产品成果空间会出现组织选择器。</div></div>`;
      return;
    }
    box.innerHTML=`<div class="org-state-banner"><b>已登录，尚未加入学校或组织</b><span>当前是个人空间，只能看到自己的爱马、用量和个人成果入口。输入组织码后，产品成果库会出现组织资源、${isStudent?'同学成果':'教师成果'}和优秀成果案例。</span></div><div class="input-stack org-join-row"><input id="joinOrgCodeMe" value="BJZX-2026" aria-label="组织管理代码"><button class="btn primary" type="button" onclick="WenduiOrg.join(document.getElementById('joinOrgCodeMe').value||'BJZX-2026');location.reload()">加入组织</button><button class="btn" type="button" onclick="WenduiOrg.create(prompt('请输入新组织名称')||'我的教学组织');location.reload()">创建组织</button><div class="org-help">现在支持加入/创建多个组织；加入后可在产品成果空间左上角选择。</div></div>`;
  }

  function setupAccountScrollspy(){
    const menu=document.querySelector('.account-menu');const detail=document.querySelector('.account-detail');if(!menu||!detail||menu.dataset.spyReady)return;menu.dataset.spyReady='1';
    const links=[...menu.querySelectorAll('a[href^="#"]')];const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
    function setActive(id){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));}
    links.forEach(a=>a.addEventListener('click',e=>{const sec=document.querySelector(a.getAttribute('href'));if(!sec)return;e.preventDefault();sec.scrollIntoView({behavior:'smooth',block:'start'});setActive(sec.id);setTimeout(()=>setActive(sec.id),260);setTimeout(update,620)}));
    const update=()=>{if(!sections.length)return;let best=sections[0],score=1e9;const target=window.innerWidth<=760?86:96;for(const s of sections){const r=s.getBoundingClientRect();const sc=Math.abs(r.top-target)+(r.bottom<target?10000:0);if(sc<score){score=sc;best=s}}setActive(best.id)};
    window.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});detail.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});setInterval(update,80);setTimeout(update,80);setTimeout(update,500);
  }

  document.addEventListener('DOMContentLoaded',()=>{
    const n=location.pathname.replace(/\/index\.html$/,'/');const user=get();
    if(user&&n.endsWith('/wendui-engine/login/')){const q=new URLSearchParams(location.search);location.replace(q.get('next')||'/wendui-engine/me/');return}
    if(!user&&n.endsWith('/wendui-engine/me/')){document.body.classList.remove('is-logged-in')}
    document.body.classList.toggle('is-logged-in',!!user);bindLogin();applyRole();setTimeout(applyRole,200);setTimeout(applyRole,1000);
  });
  window.WenduiDoLogin=function(ev){if(ev)ev.preventDefault();login();const r=document.getElementById('loginResult');if(r){r.className='result show ok';r.textContent='登录成功，正在进入。'}setTimeout(()=>location.href=nextUrl(),160);return false};
  window.WenduiLogout=logout;
})();
