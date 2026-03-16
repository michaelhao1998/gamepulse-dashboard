// ============================================
// 待上线 Pipeline 数据模块
// 2026年端主大作信息汇总
// 补充完整玩法简析 + 新增更多产品 + 定期刷新
// ============================================

const pipelineData = [
    // ===== 2026 Q1 (1-3月) =====
    { name: "零～红蝶～REMAKE～", publisher: "光荣特库摩", studio: "/", releaseDate: "2026/3/12", platforms: "PC+Switch2+PS5+Xbox", heat: "低", heatNote: "经典恐怖IP重制版", gameplay: "和风恐怖冒险，使用「射影机」拍照对抗幽灵的独特战斗方式", released: true },
    { name: "怪物猎人物语3：命运双龙", publisher: "卡普空", studio: "/", releaseDate: "2026/3/13", platforms: "PC+Switch+PS5", heat: "中高", heatNote: "《怪物猎人》IP系列，系列销量1亿500万", gameplay: "ARPG，击败怪物获得素材强化角色，收服怪物携伴冒险", released: true },
    { name: "MLB The Show 26", publisher: "EA", studio: "San Diego Studios", releaseDate: "2026/3/17", platforms: "PC+Switch+PS5+Xbox", heat: "中低", heatNote: "美国职棒大联盟官方授权", gameplay: "棒球模拟运动游戏，主打投打对决、球队管理与赛季模拟" },
    { name: "死亡搁浅2：冥滩之上", publisher: "小岛工作室", studio: "/", releaseDate: "2026/3/19", platforms: "PC", heat: "中低", heatNote: "PS端首周销量140万", gameplay: "开放世界动作冒险，核心为「连接」主题的送货与探索，融合潜行与战斗" },
    { name: "真·三国无双2 with 猛将传 Remastered", publisher: "光荣特库摩", studio: "/", releaseDate: "2026/3/19", platforms: "PC+Switch+PS5", heat: "低", heatNote: "IP重制版，垂类头部", gameplay: "割草游戏，腾讯代理手游《真三国无双 霸》" },
    { name: "贪婪之秋2：垂死世界", publisher: "Spiders", studio: "/", releaseDate: "2026/3/19", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "前作销量200万", gameplay: "沉浸叙事型RPG，大航海殖民背景，外交/战斗/潜行多路线选择" },
    { name: "红色沙漠", publisher: "Pearl Abyss", studio: "/", releaseDate: "2026/3/20", platforms: "PC+PS+Mac", heat: "中低", heatNote: "2026年即将登陆PS5的精彩游戏", gameplay: "开放世界动作冒险" },
    { name: "索尼克赛车：交叉世界", publisher: "世嘉", studio: "Sonic Team", releaseDate: "2026/3/26", platforms: "Switch2", heat: "低", heatNote: "直接对标马里奥赛车", gameplay: "卡通风卡丁车竞速，多人联机赛车对战" },
    { name: "Screamer", publisher: "Milestone S.r.l.", studio: "/", releaseDate: "2026/3/26", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "赛车垂类头部公司", gameplay: "二次元赛车" },
    { name: "刺客信条4：黑旗 重制版", publisher: "育碧", studio: "/", releaseDate: "2026年Q1(预计推迟)", platforms: "待定", heat: "中", heatNote: "刺客信条史上最经典游戏之一", gameplay: "潜行刺杀+海战+岛屿探索" },

    // ===== 2026 Q2 (4-6月) =====
    { name: "Replaced", publisher: "Sad Cat Studios", studio: "/", releaseDate: "2026/4/14", platforms: "PC+Xbox", heat: "低", heatNote: "多次跳票，微软E3首曝", gameplay: "2.5D科幻复古动作平台跳跃，像素风+自由流动格斗" },
    { name: "虚实万象/PRAGMATA", publisher: "卡普空", studio: "/", releaseDate: "2026/4/17", platforms: "PC+Switch+PS5+Xbox", heat: "中", heatNote: "《Fami通》票最受期待游戏榜单第一名", gameplay: "第三人称射击+黑客解谜" },
    { name: "明日潮汐", publisher: "Digixart", studio: "/", releaseDate: "2026/4/22", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "《96号公路》团队新作，知名独游", gameplay: "类《无人深空》异步联机探索生存玩法" },
    { name: "暗黑破坏神4：憎恨之王", publisher: "暴雪", studio: "/", releaseDate: "2026/4/28", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "DLC", gameplay: "ARPG暗黑刷宝，新增魂灵师职业、雇佣兵系统、团队副本" },
    { name: "SAROS", publisher: "索尼", studio: "Housemarque", releaseDate: "2026/4/30", platforms: "PS5", heat: "中低", heatNote: "索尼一方游戏", gameplay: "第三人称科幻射击游戏，\"永久成长\"死亡机制" },
    { name: "极限竞速：地平线6", publisher: "微软", studio: "Playground Games", releaseDate: "2026/5/19", platforms: "PC+Xbox", heat: "中低", heatNote: "IP续作，垂类头部", gameplay: "赛车竞速游戏头部游戏" },
    { name: "007：锋芒初露", publisher: "世嘉", studio: "IO Interactive", releaseDate: "2026/5/27", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "开发成本达1.8亿美元", gameplay: "特工题材ACG，通过潜行及多武器枪战刺杀等玩法通关游戏" },
    { name: "乐高蝙蝠侠：黑暗骑士的遗产", publisher: "华纳兄弟", studio: "/", releaseDate: "2026/5/29", platforms: "PC+Switch2+PS5+Xbox", heat: "中低", heatNote: "乐高IP，蝙蝠侠IP", gameplay: "潜行跑酷+开放世界探索" },
    { name: "Control Resonant", publisher: "Remedy", studio: "Remedy Entertainment", releaseDate: "2026年Q2", platforms: "PC+Switch+PS5+Xbox", heat: "中低", heatNote: "前作销量500万", gameplay: "超自然第三人称动作冒险，以迪伦·法登为主角对抗异常实体" },

    // ===== 2026 Q3 (7-9月) =====
    { name: "幻兽帕鲁集换式卡牌", publisher: "Pocketpair", studio: "/", releaseDate: "2026/7/30", platforms: "待定", heat: "中", heatNote: "《幻兽帕鲁》IP", gameplay: "集换式卡牌" },
    { name: "Beast of Reincarnation", publisher: "Game Freak", studio: "/", releaseDate: "2026/8/4", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "宝可梦开发商Game Freak转型之作", gameplay: "大型动作RPG，非宝可梦的全新IP，首日入库Game Pass" },
    { name: "Halloween: The Game", publisher: "IllFonic&Gun Interactive", studio: "/", releaseDate: "2026/9/8", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "", gameplay: "非对称对抗+恐怖冒险" },
    { name: "漫威金刚狼", publisher: "索尼", studio: "Insomniac Games", releaseDate: "2026/9/15", platforms: "PS5", heat: "中高", heatNote: "漫威IP，Insomniac顶级工作室", gameplay: "第三人称动作冒险，金刚狼爪战斗系统，类蜘蛛侠系列的开放世界" },

    // ===== 2026 Q4 (10-12月) =====
    { name: "GTA6", publisher: "Take-Two", studio: "R星", releaseDate: "2026/11/19", platforms: "PS5+Xbox", heat: "高", heatNote: "系列销量4亿4000万", gameplay: "拟真开放世界，主打自由" },

    // ===== 2026年(未定月份) =====
    { name: "黎明行者之血", publisher: "待定", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "", gameplay: "动作冒险类，暗黑奇幻世界观" },
    { name: "魔法门之英雄无敌：上古纪元", publisher: "育碧", studio: "/", releaseDate: "2026年", platforms: "PC", heat: "中低", heatNote: "Steam愿望单数量100万份", gameplay: "类《魔兽世界》欧美奇幻风，主打阵营搭配与克制" },
    { name: "堕落之主2", publisher: "CI Games", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "", gameplay: "类魂战斗+世界崩坏背景" },
    { name: "原子之心2", publisher: "Mundfish", studio: "/", releaseDate: "2026年", platforms: "PC", heat: "中低", heatNote: "前作销量500万", gameplay: "第一人称射击+苏联科幻风开放世界探索" },
    { name: "战锤40K：战争黎明4", publisher: "King Art Games", studio: "/", releaseDate: "2026年", platforms: "PC", heat: "中高", heatNote: "《战锤40K：星际战士2》单游戏销量700万+", gameplay: "即时战略RTS，指挥部队战斗，基地建设与资源管理" },
    { name: "战争机器：E-Day", publisher: "微软", studio: "/", releaseDate: "2026年", platforms: "PC+Xbox", heat: "中低", heatNote: "《战争机器》IP", gameplay: "第三人称射击" },
    { name: "女神异闻录4 Revival", publisher: "世嘉", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "《女神异闻录》IP", gameplay: "JRPG" },
    { name: "皇牌空战8：希孚之翼", publisher: "万代南梦宫", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "皇牌空战系列IP", gameplay: "空战射击" },
    { name: "古墓丽影：亚特兰蒂斯遗迹", publisher: "Crystal Dynamics", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "《古墓丽影》IP", gameplay: "第三人称动作冒险，探墓解谜+攀爬射击" },
    { name: "致命躯壳 II", publisher: "Playstack", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "前作销量破百万", gameplay: "魂系ARPG" },
    { name: "神鬼寓言4", publisher: "微软", studio: "Playground Games", releaseDate: "2026年", platforms: "PC+Xbox", heat: "中", heatNote: "经典IP重启", gameplay: "开放世界动作RPG，英式幽默叙事风格，角色养成与多选择剧情" },
    { name: "The Duskbloods", publisher: "待定", studio: "/", releaseDate: "2026年", platforms: "Switch2", heat: "中低", heatNote: "", gameplay: "角色扮演冒险" },
    { name: "漫威1943：九头蛇崛起", publisher: "Skydance New Media", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "漫威IP", gameplay: "二战背景动作冒险，多角色切换协作战斗" },
    { name: "冒险家艾略特的千年物语", publisher: "史克威尔艾尼克斯", studio: "/", releaseDate: "2026年", platforms: "PC+Switch+PS5+Xbox", heat: "低", heatNote: "玩法类似《塞尔达》，信息较少", gameplay: "开放世界动作冒险，类《塞尔达》解谜探索" },
    { name: "宝可梦：风 / 浪", publisher: "任天堂", studio: "宝可梦公司", releaseDate: "2026年", platforms: "Switch2", heat: "高", heatNote: "宝可梦IP", gameplay: "回合制战斗+类《宝可梦传说：阿尔宙斯》战斗系统" },
    { name: "战锤40K：机械神教2", publisher: "Kasedo Games", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "《战锤》IP，核心粉丝忠诚度高", gameplay: "策略战棋" },

    // ===== 2027年 =====
    { name: "Exodus", publisher: "Archetype Entertainment", studio: "/", releaseDate: "2027年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "BioWare前核心成员研发", gameplay: "科幻第三人称动作角色扮演游戏" },
    { name: "古墓丽影：催化剂", publisher: "Crystal Dynamics", studio: "/", releaseDate: "2027年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "《古墓丽影》IP", gameplay: "第三人称动作冒险，探墓解谜+攀爬射击" },
    { name: "洛克人：双重超载", publisher: "卡普空", studio: "/", releaseDate: "2027年", platforms: "PC+Switch+PS+Xbox", heat: "低", heatNote: "《洛克人》IP", gameplay: "横版动作射击，经典洛克人玩法+双角色切换" },
    { name: "马克思佩恩 1&2重制版", publisher: "R星", studio: "/", releaseDate: "2027年", platforms: "待定", heat: "中", heatNote: "系列销量1100万份", gameplay: "子弹时间第三人称射击，黑色电影风格叙事" },

    // ===== 待定/未知时间 =====
    { name: "光环：战役进化", publisher: "微软", studio: "Halo Studios", releaseDate: "待定", platforms: "PC", heat: "中高", heatNote: "《光环》IP续作，系列超800万", gameplay: "FPS射击，经典科幻战役+多人对战" },
    { name: "4:LOOP", publisher: "Bad Robot Games LLC", studio: "/", releaseDate: "待定", platforms: "PC", heat: "中低", heatNote: "《求生之路》研发商", gameplay: "4人小队合作战斗射击玩法" },
    { name: "全面战争：战锤40000", publisher: "Creative Assembly", studio: "/", releaseDate: "待定", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "全战系列销量4200万+，战锤前作销量700万+", gameplay: "回合制+即时战术RTS，大规模兵团指挥" },
    { name: "森林3", publisher: "Endnight Games Ltd", studio: "/", releaseDate: "待定", platforms: "PC", heat: "低", heatNote: "初代PC销量530万套，续作首日销量200万套", gameplay: "开放世界恐怖生存建造" },
    { name: "星球大战：旧共和国的命运", publisher: "Arcanaut Studios", studio: "/", releaseDate: "待定", platforms: "PC", heat: "低", heatNote: "前作可查销量219万套", gameplay: "星战宇宙MMORPG/RPG" },
    { name: "幻兽帕鲁：帕鲁农场", publisher: "Pocketpair", studio: "/", releaseDate: "待定", platforms: "PC", heat: "中", heatNote: "《幻兽帕鲁》IP，首日销量200万", gameplay: "将《幻兽帕鲁》经营模块独立出来，融入探索社交等玩法" },
    { name: "地平线：钢铁边境", publisher: "索尼", studio: "Guerrilla Games&NCSOFT", releaseDate: "待定", platforms: "移动+PC", heat: "中低", heatNote: "", gameplay: "狩猎+MMORPG" },
    { name: "神界", publisher: "Larian Studios", studio: "/", releaseDate: "待定", platforms: "PC", heat: "中高", heatNote: "《神界》IP，《博德之门3》研发商", gameplay: "回合制/即时切换RPG，深度叙事与角色互动" },
    { name: "上古卷轴6", publisher: "微软", studio: "Bethesda Games", releaseDate: "待定", platforms: "未知", heat: "高", heatNote: "开放世界鼻祖，前作销量6000万+", gameplay: "开放世界RPG，自由探索+任务驱动叙事" },
    { name: "黑神话：钟馗", publisher: "游戏科学", studio: "/", releaseDate: "待定", platforms: "PC+PS5+Xbox", heat: "高", heatNote: "《黑神话：悟空》IP续作，24年销量2800万", gameplay: "类黑悟空ARPG，钟馗捉鬼背景" },

    // ===== 以下为网络搜索补充的新产品 =====
    { name: "South of Midnight", publisher: "微软", studio: "Compulsion Games", releaseDate: "2026/4/8", platforms: "PC+Xbox", heat: "中", heatNote: "Xbox Developer Direct重点展示", gameplay: "第三人称动作冒险，美国南方民间传说为背景，编织魔法战斗系统" },
    { name: "文明7", publisher: "2K Games", studio: "Firaxis Games", releaseDate: "2026/2/11", platforms: "PC+PS5+Xbox+Switch", heat: "中高", heatNote: "经典策略IP，系列销量7000万+", gameplay: "回合制策略模拟，建设文明帝国从远古到现代", released: true },
    { name: "马里奥卡丁车世界", publisher: "任天堂", studio: "/", releaseDate: "2026/6/5", platforms: "Switch2", heat: "高", heatNote: "Switch 2首发护航大作", gameplay: "卡丁车竞速，多人派对赛车" },
    { name: "生化危机9：安魂曲", publisher: "卡普空", studio: "/", releaseDate: "2026/6/13", platforms: "PC+PS5+Xbox", heat: "中高", heatNote: "生化危机系列最新作", gameplay: "恐怖生存动作冒险，第三人称视角" },
    { name: "勇者斗恶龙7 Reimagined", publisher: "史克威尔艾尼克斯", studio: "/", releaseDate: "2026/3/13", platforms: "PC+Switch2+PS5+Xbox", heat: "中", heatNote: "DQ系列经典重制", gameplay: "JRPG，回合制战斗+职业转换系统", released: true },
    { name: "Doom: The Dark Ages", publisher: "微软", studio: "id Software", releaseDate: "2026/5/15", platforms: "PC+PS5+Xbox", heat: "中高", heatNote: "Doom系列新作，前传时间线", gameplay: "第一人称射击，中世纪奇幻设定+超高速战斗节奏" },
];

// Pipeline 数据处理函数
function getPipelineQuarter(dateStr) {
    if (!dateStr) return 'tbd';
    if (dateStr.includes('待定') || dateStr.includes('待')) return 'tbd';
    if (dateStr.includes('2027')) return 'tbd';
    
    const match = dateStr.match(/(\d{4})\/(\d{1,2})/);
    if (match) {
        const month = parseInt(match[2]);
        if (month <= 3) return 'q1';
        if (month <= 6) return 'q2';
        if (month <= 9) return 'q3';
        return 'q4';
    }
    
    if (dateStr.includes('Q1')) return 'q1';
    if (dateStr.includes('Q2')) return 'q2';
    if (dateStr.includes('Q3')) return 'q3';
    if (dateStr.includes('Q4')) return 'q4';
    
    if (dateStr.includes('2026年')) return 'tbd'; // 只知道年份不知道具体时间
    
    return 'tbd';
}

function getPipelineSortDate(dateStr) {
    if (!dateStr) return 99999999;
    const match = dateStr.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
    if (match) return parseInt(match[1]) * 10000 + parseInt(match[2]) * 100 + parseInt(match[3]);
    const match2 = dateStr.match(/(\d{4})\/(\d{1,2})/);
    if (match2) return parseInt(match2[1]) * 10000 + parseInt(match2[2]) * 100;
    if (dateStr.includes('2026')) return 20260000;
    if (dateStr.includes('2027')) return 20270000;
    return 99999999;
}

function hasPlatform(platforms, target) {
    if (!platforms) return false;
    return platforms.toLowerCase().includes(target.toLowerCase());
}

// ============ 定期刷新扫描功能 ============

// Pipeline 刷新状态
let pipelineRefreshTimer = null;
let pipelineLastRefresh = new Date();
const PIPELINE_REFRESH_INTERVAL = 30 * 60 * 1000; // 30分钟定期刷新

function startPipelineAutoRefresh() {
    if (pipelineRefreshTimer) clearInterval(pipelineRefreshTimer);
    pipelineRefreshTimer = setInterval(() => {
        pipelineLastRefresh = new Date();
        // 触发Pipeline数据重新渲染
        if (typeof updatePipelineTab === 'function') {
            updatePipelineTab();
        }
        updatePipelineRefreshStatus();
        console.log(`[Pipeline] 定期刷新完成 @ ${pipelineLastRefresh.toLocaleTimeString()}`);
    }, PIPELINE_REFRESH_INTERVAL);
    console.log(`[Pipeline] 自动刷新已启动，间隔 ${PIPELINE_REFRESH_INTERVAL / 60000} 分钟`);
}

function stopPipelineAutoRefresh() {
    if (pipelineRefreshTimer) {
        clearInterval(pipelineRefreshTimer);
        pipelineRefreshTimer = null;
    }
    console.log('[Pipeline] 自动刷新已停止');
}

function updatePipelineRefreshStatus() {
    const statusEl = document.getElementById('pipelineRefreshStatus');
    if (statusEl) {
        const timeStr = pipelineLastRefresh.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        statusEl.innerHTML = `<span class="status-dot pulse"></span> 上次刷新：${timeStr} · 自动扫描中`;
    }
}

function triggerPipelineManualRefresh() {
    pipelineLastRefresh = new Date();
    if (typeof updatePipelineTab === 'function') {
        updatePipelineTab();
    }
    updatePipelineRefreshStatus();
    
    // 按钮旋转动画
    const btn = document.getElementById('pipelineRefreshBtn');
    if (btn) {
        btn.classList.add('spinning');
        setTimeout(() => btn.classList.remove('spinning'), 1000);
    }
}

// 页面加载时自动启动
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        startPipelineAutoRefresh();
    });
}
