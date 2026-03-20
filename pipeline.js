// ============================================
// 待上线 Pipeline 数据模块 V2.1
// 数据源：腾讯文档 MCP（第一优先级）+ Skills深度补充（Playwright + Market Research + Web Search）
// Skills补充来源：GamesRadar Release Calendar, PushSquare PS5 2026, VGC, 机核网, SteamDB
// 最后更新: 2026-03-20 (V2.1 Skills深度补充版)
// ============================================

// ====== 未上线产品数据（全部展示）======
const pipelineUnreleased = [
    // ===== 海外产品 =====
    { region: "海外", name: "MLB The Show 26", publisher: "EA", studio: "San Diego Studios", releaseDate: "2026/3/17", platforms: "PC+Switch+PS5+Xbox", heat: "中低", heatNote: "美国职棒大联盟官方授权", gameplay: "棒球模拟运动游戏，主打投打对决、球队管理与赛季模拟", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "贪婪之秋2：垂死世界", publisher: "Spiders", studio: "/", releaseDate: "2026/3/19", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "前作销量200万", gameplay: "沉浸叙事型RPG，大航海殖民背景，外交/战斗/潜行多路线选择", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "索尼克赛车：交叉世界", publisher: "世嘉", studio: "Sonic Team", releaseDate: "2026/3/26", platforms: "Switch2", heat: "低", heatNote: "直接对标马里奥赛车", gameplay: "卡通风卡丁车竞速，多人联机赛车对战", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Screamer", publisher: "Milestone S.r.l.", studio: "/", releaseDate: "2026/3/26", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "赛车垂类头部公司", gameplay: "二次元赛车", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "奇异人生：重逢", publisher: "SE/Deck Nine", studio: "Deck Nine Games", releaseDate: "2026/3/26", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "《奇异人生》系列新作，IP全球销量2000万+", gameplay: "剧情驱动冒险游戏，蝴蝶效应式选择分支叙事", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Replaced", publisher: "Sad Cat Studios", studio: "/", releaseDate: "2026/4/14", platforms: "PC+Xbox", heat: "低", heatNote: "多次跳票，微软E3首曝", gameplay: "2.5D科幻复古动作平台跳跃，像素风+自由流动格斗", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "虚实万象/PRAGMATA", publisher: "卡普空", studio: "/", releaseDate: "2026/4/24", platforms: "PC+Switch2+PS5+Xbox", heat: "中", heatNote: "《Fami通》票最受期待游戏榜单第一名，据GamesRadar确认4/24", gameplay: "第三人称射击+黑客解谜", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "朋友聚会：生活梦想", publisher: "任天堂", studio: "/", releaseDate: "2026/4/16", platforms: "Switch+Switch2", heat: "中", heatNote: "任天堂社交模拟系列回归", gameplay: "生活模拟社交游戏，Mii角色互动、搞笑日常", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "明日潮汐", publisher: "Digixart", studio: "/", releaseDate: "2026/4/22", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "《96号公路》团队新作，知名独游", gameplay: "类《无人深空》异步联机探索生存玩法", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Masters of Albion", publisher: "Rebellion", studio: "Rebellion", releaseDate: "2026/4/22", platforms: "PC", heat: "中低", heatNote: "中世纪城市建造管理", gameplay: "城市建造管理策略游戏，中世纪英国背景", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "South of Midnight", publisher: "微软", studio: "Compulsion Games", releaseDate: "2026/3/31", platforms: "PC+Xbox", heat: "中", heatNote: "Xbox Developer Direct重点展示，据PushSquare确认3/31发售", gameplay: "第三人称动作冒险，美国南方民间传说为背景，编织魔法战斗系统", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "暗黑破坏神4：憎恨之王", publisher: "暴雪", studio: "/", releaseDate: "2026/4/28", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "DLC扩展包", gameplay: "ARPG暗黑刷宝，新增魂灵师职业、雇佣兵系统、团队副本", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "SAROS", publisher: "索尼", studio: "Housemarque", releaseDate: "2026/4/30", platforms: "PS5", heat: "中低", heatNote: "索尼一方游戏", gameplay: "第三人称科幻射击游戏，\"永久成长\"死亡机制", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Mixtape", publisher: "Annapurna Interactive", studio: "Beethoven & Dinosaur", releaseDate: "2026/5/7", platforms: "PC+PS5+Xbox+Switch2", heat: "中低", heatNote: "Annapurna发行，独立游戏精品", gameplay: "叙事驱动音乐冒险，90年代青少年公路旅行背景", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "夺宝奇兵：古老之圈（Switch2版）", publisher: "微软", studio: "MachineGames", releaseDate: "2026/5/12", platforms: "Switch2", heat: "中", heatNote: "原版PC/Xbox/PS5已上线，Switch2移植版", gameplay: "第一人称动作冒险，印第安纳·琼斯IP", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Directive 8020", publisher: "索尼", studio: "Naughty Dog", releaseDate: "2026/5/12", platforms: "PC+PS5+Xbox", heat: "中高", heatNote: "顽皮狗（《最后生还者》开发商）全新科幻IP", gameplay: "第三人称科幻动作冒险", licenseStatus: "", licenseNote: "" },
    // [已删除] Doom: The Dark Ages — 2025/5/15已发售（据id Software+游民星空确认），非2026年产品
    { region: "海外", name: "极限竞速：地平线6", publisher: "微软", studio: "Playground Games", releaseDate: "2026/5/19", platforms: "PC+Xbox", heat: "中低", heatNote: "IP续作，垂类头部", gameplay: "赛车竞速游戏头部游戏", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "耀西与神秘之书", publisher: "任天堂", studio: "/", releaseDate: "2026/5/21", platforms: "Switch2", heat: "中", heatNote: "任天堂Switch2平台独占耀西新作", gameplay: "平台跳跃冒险，耀西系列经典2.5D横版探索", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "乐高蝙蝠侠：黑暗骑士的遗产", publisher: "华纳兄弟", studio: "/", releaseDate: "2026/5/22", platforms: "PC+Switch2+PS5+Xbox", heat: "中低", heatNote: "乐高IP，蝙蝠侠IP", gameplay: "潜行跑酷+开放世界探索", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Paralives", publisher: "Paralives Studio", studio: "/", releaseDate: "2026/5/25", platforms: "PC", heat: "中", heatNote: "社区期待的《模拟人生》竞品，Early Access", gameplay: "生活模拟经营游戏，房屋建造+角色养成+社区互动", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "007：锋芒初露", publisher: "世嘉", studio: "IO Interactive", releaseDate: "2026/5/27", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "开发成本达1.8亿美元", gameplay: "特工题材ACG，通过潜行及多武器枪战刺杀等玩法通关游戏", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "最终幻想7 重生 Xbox/Switch版", publisher: "史克威尔艾尼克斯", studio: "/", releaseDate: "2026/6/3", platforms: "Xbox+Switch", heat: "中高", heatNote: "FF7重制三部曲第二作，移植版", gameplay: "ARPG，开放世界探索+ATB战斗系统", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "CALX", publisher: "Dear Villagers", studio: "True Colors", releaseDate: "2026/6/4", platforms: "PC", heat: "低", heatNote: "Future Games Show春季展公布", gameplay: "氛围感3D动作冒险探索与战斗", licenseStatus: "", licenseNote: "" },
    // [已删除] 马里奥卡丁车世界 — 2025/6/5已随Switch 2首发，非2026年产品（据GamesRadar+3DM确认）
    { region: "海外", name: "Control Resonant", publisher: "Remedy", studio: "Remedy Entertainment", releaseDate: "2026年Q2", platforms: "PC+Switch+PS5+Xbox", heat: "中低", heatNote: "前作销量500万", gameplay: "超自然第三人称动作冒险，以迪伦·法登为主角对抗异常实体", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "碧蓝幻想Relink：无尽黄昏", publisher: "Cygames", studio: "Cygames", releaseDate: "2026/7/9", platforms: "PC+Switch2+PS5", heat: "中", heatNote: "前作全球销量300万+，Steam特别好评", gameplay: "多人联机ARPG，新增召唤系统与单人极沌空处模式", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "幻兽帕鲁集换式卡牌", publisher: "Pocketpair", studio: "/", releaseDate: "2026/7/30", platforms: "待定", heat: "中", heatNote: "《幻兽帕鲁》IP", gameplay: "集换式卡牌", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Beast of Reincarnation", publisher: "Game Freak", studio: "/", releaseDate: "2026/8/4", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "宝可梦开发商Game Freak转型之作", gameplay: "大型动作RPG，非宝可梦的全新IP，首日入库Game Pass", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Halloween: The Game", publisher: "IllFonic&Gun Interactive", studio: "/", releaseDate: "2026/9/8", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "", gameplay: "非对称对抗+恐怖冒险", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "漫威金刚狼", publisher: "索尼", studio: "Insomniac Games", releaseDate: "2026/9/15", platforms: "PS5", heat: "中高", heatNote: "漫威IP，Insomniac顶级工作室", gameplay: "第三人称动作冒险，金刚狼爪战斗系统，类蜘蛛侠系列的开放世界", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "GTA6", publisher: "Take-Two", studio: "Rockstar Games", releaseDate: "2026/11/19", platforms: "PS5+Xbox", heat: "高", heatNote: "系列销量4亿4000万", gameplay: "拟真开放世界犯罪动作冒险，主打自由", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "刺客信条4：黑旗 重制版", publisher: "育碧", studio: "/", releaseDate: "2026年Q1(预计推迟)", platforms: "待定", heat: "中", heatNote: "刺客信条史上最经典游戏之一", gameplay: "潜行刺杀+海战+岛屿探索", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "宝可梦冠军", publisher: "任天堂", studio: "宝可梦公司", releaseDate: "2026年Q2", platforms: "Switch+Switch2", heat: "中高", heatNote: "宝可梦IP竞技格斗新作", gameplay: "宝可梦IP动作竞技游戏", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "丰收之月：大地回声", publisher: "Natsume", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox+Switch2", heat: "低", heatNote: "经典农场模拟IP新作", gameplay: "农场模拟经营，种植+畜牧+社交+探索", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "黎明行者之血", publisher: "待定", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "", gameplay: "动作冒险类，暗黑奇幻世界观", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "魔法门之英雄无敌：上古纪元", publisher: "育碧", studio: "/", releaseDate: "2026年", platforms: "PC", heat: "中低", heatNote: "Steam愿望单数量100万份", gameplay: "类《魔兽世界》欧美奇幻风，主打阵营搭配与克制", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "堕落之主2", publisher: "CI Games", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "", gameplay: "类魂战斗+世界崩坏背景", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "原子之心2", publisher: "Mundfish", studio: "/", releaseDate: "2026年", platforms: "PC", heat: "中低", heatNote: "前作销量500万", gameplay: "第一人称射击+苏联科幻风开放世界探索", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "战锤40K：战争黎明4", publisher: "King Art Games", studio: "/", releaseDate: "2026年", platforms: "PC", heat: "中高", heatNote: "《战锤40K：星际战士2》单游戏销量700万+", gameplay: "即时战略RTS，指挥部队战斗，基地建设与资源管理", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "战争机器：E-Day", publisher: "微软", studio: "/", releaseDate: "2026年", platforms: "PC+Xbox", heat: "中低", heatNote: "《战争机器》IP", gameplay: "第三人称射击", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "女神异闻录4 Revival", publisher: "世嘉", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "《女神异闻录》IP", gameplay: "JRPG", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "皇牌空战8：希孚之翼", publisher: "万代南梦宫", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "皇牌空战系列IP", gameplay: "空战射击", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "古墓丽影：亚特兰蒂斯遗迹", publisher: "Crystal Dynamics", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "《古墓丽影》IP", gameplay: "第三人称动作冒险，探墓解谜+攀爬射击", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "致命躯壳 II", publisher: "Playstack", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "前作销量破百万", gameplay: "魂系ARPG", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "神鬼寓言4", publisher: "微软", studio: "Playground Games", releaseDate: "2026年Q4", platforms: "PC+Xbox+PS5", heat: "中", heatNote: "经典IP重启，据GameSpot确认Q4 2026，新增PS5平台", gameplay: "开放世界动作RPG，英式幽默叙事风格，角色养成与多选择剧情", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "The Duskbloods", publisher: "待定", studio: "/", releaseDate: "2026年", platforms: "Switch2", heat: "中低", heatNote: "", gameplay: "角色扮演冒险", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "漫威1943：九头蛇崛起", publisher: "Skydance New Media", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "漫威IP", gameplay: "二战背景动作冒险，多角色切换协作战斗", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "冒险家艾略特的千年物语", publisher: "史克威尔艾尼克斯", studio: "/", releaseDate: "2026年", platforms: "PC+Switch+PS5+Xbox", heat: "低", heatNote: "玩法类似《塞尔达》，信息较少", gameplay: "开放世界动作冒险，类《塞尔达》解谜探索", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "战锤40K：机械神教2", publisher: "Kasedo Games", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "《战锤》IP，核心粉丝忠诚度高", gameplay: "策略战棋", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "宝可梦：风 / 浪", publisher: "任天堂", studio: "宝可梦公司", releaseDate: "2027年", platforms: "Switch2", heat: "高", heatNote: "宝可梦第十世代新作，2027年Switch 2独占发售", gameplay: "回合制战斗+类《宝可梦传说：阿尔宙斯》战斗系统", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Exodus", publisher: "Archetype Entertainment", studio: "/", releaseDate: "2027年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "BioWare前核心成员研发", gameplay: "科幻第三人称动作角色扮演游戏", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "古墓丽影：催化剂", publisher: "Crystal Dynamics", studio: "/", releaseDate: "2027年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "《古墓丽影》IP", gameplay: "第三人称动作冒险，探墓解谜+攀爬射击", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "洛克人：双重超载", publisher: "卡普空", studio: "/", releaseDate: "2027年", platforms: "PC+Switch+PS+Xbox", heat: "低", heatNote: "《洛克人》IP", gameplay: "横版动作射击，经典洛克人玩法+双角色切换", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "马克思佩恩 1&2重制版", publisher: "Rockstar Games", studio: "/", releaseDate: "2027年", platforms: "待定", heat: "中", heatNote: "系列销量1100万份", gameplay: "子弹时间第三人称射击，黑色电影风格叙事", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "光环：战役进化", publisher: "微软", studio: "Halo Studios", releaseDate: "待定", platforms: "PC", heat: "中高", heatNote: "《光环》IP续作，系列超800万", gameplay: "FPS射击，经典科幻战役+多人对战", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "4:LOOP", publisher: "Bad Robot Games LLC", studio: "/", releaseDate: "待定", platforms: "PC", heat: "中低", heatNote: "《求生之路》研发商", gameplay: "4人小队合作战斗射击玩法", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "全面战争：战锤40000", publisher: "Creative Assembly", studio: "/", releaseDate: "待定", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "全战系列销量4200万+，战锤前作销量700万+", gameplay: "回合制+即时战术RTS，大规模兵团指挥", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "森林3", publisher: "Endnight Games Ltd", studio: "/", releaseDate: "待定", platforms: "PC", heat: "低", heatNote: "初代PC销量530万套，续作首日销量200万套", gameplay: "开放世界恐怖生存建造", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "星球大战：旧共和国的命运", publisher: "Arcanaut Studios", studio: "/", releaseDate: "待定", platforms: "PC", heat: "低", heatNote: "前作可查销量219万套", gameplay: "星战宇宙MMORPG/RPG", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "幻兽帕鲁：帕鲁农场", publisher: "Pocketpair", studio: "/", releaseDate: "待定", platforms: "PC", heat: "中", heatNote: "《幻兽帕鲁》IP，首日销量200万", gameplay: "将《幻兽帕鲁》经营模块独立出来，融入探索社交等玩法", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "地平线：钢铁边境", publisher: "索尼", studio: "Guerrilla Games&NCSOFT", releaseDate: "待定", platforms: "移动+PC", heat: "中低", heatNote: "", gameplay: "狩猎+MMORPG", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "神界", publisher: "Larian Studios", studio: "/", releaseDate: "待定", platforms: "PC", heat: "中高", heatNote: "《神界》IP，《博德之门3》研发商", gameplay: "回合制/即时切换RPG，深度叙事与角色互动", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "上古卷轴6", publisher: "微软", studio: "Bethesda Games", releaseDate: "待定", platforms: "未知", heat: "高", heatNote: "开放世界鼻祖，前作销量6000万+", gameplay: "开放世界RPG，自由探索+任务驱动叙事", licenseStatus: "", licenseNote: "" },

    // ===== 网络搜索补充的海外产品 =====
    { region: "海外", name: "鬼武者：剑之道", publisher: "卡普空", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中高", heatNote: "经典动作IP回归，卡普空重磅新作，据GamesRadar确认2026年发售", gameplay: "动作冒险，日本战国武士题材，刀剑战斗系统", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "合金装备 精选集 Vol.2", publisher: "科乐美", studio: "/", releaseDate: "2026/8/27", platforms: "PC+PS5+Xbox+Switch+Switch2", heat: "中", heatNote: "MGS经典系列合集第二弹，据GamesRadar确认8/27发售", gameplay: "潜行动作冒险，合金装备系列经典合集", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "火焰之纹章：命运之织", publisher: "任天堂", studio: "Intelligent Systems", releaseDate: "2026年", platforms: "Switch2", heat: "中高", heatNote: "火纹系列Switch2新作，据GamesRadar确认2026年发售", gameplay: "回合制战术RPG，角色养成+战场策略", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "深海迷航2", publisher: "Krafton", studio: "Unknown Worlds", releaseDate: "2026年", platforms: "PC+Xbox", heat: "中", heatNote: "前作全平台销量超2000万，据GamesRadar确认2026年发售", gameplay: "开放世界海洋探索生存，水下建造+外星生态", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "恶魔城：贝尔蒙特的诅咒", publisher: "科乐美", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox+Switch", heat: "中", heatNote: "恶魔城系列新作，科乐美IP复兴，据GamesRadar确认2026年", gameplay: "动作冒险，哥特风横版动作+探索", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "瘟疫传说：遗响", publisher: "Focus Entertainment", studio: "Asobo Studio", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "瘟疫传说系列续作，据GamesRadar确认2026年", gameplay: "线性叙事动作冒险，中世纪背景+潜行+解谜", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "InZOI", publisher: "Krafton", studio: "Krafton", releaseDate: "2026年", platforms: "PS5", heat: "中", heatNote: "韩国Krafton开发的模拟人生竞品，据GamesRadar确认2026年PS5版", gameplay: "生活模拟经营，AI驱动NPC行为+建造+社交", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "巫师4", publisher: "CD Projekt Red", studio: "CD Projekt Red", releaseDate: "待定", platforms: "PC+PS5+Xbox", heat: "高", heatNote: "《巫师3》开发商新作，系列累计销量超7500万，据GamesRadar确认开发中", gameplay: "开放世界动作RPG，深度叙事+选择分支+巫师猎魔", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Intergalactic: The Heretic Prophet", publisher: "索尼", studio: "Naughty Dog", releaseDate: "待定", platforms: "PS5", heat: "中高", heatNote: "顽皮狗第二款在研项目，据GamesRadar确认", gameplay: "科幻第三人称动作冒险", licenseStatus: "", licenseNote: "" },

    // ===== Skills深度补充的海外产品（来源：Playwright抓取GamesRadar/PushSquare/VGC + Market Research交叉验证）=====
    { region: "海外", name: "Starfield（PS5版）", publisher: "微软/Bethesda", studio: "Bethesda Games", releaseDate: "2026/4/7", platforms: "PS5", heat: "中高", heatNote: "据VGC 3/17报道确认PS5版4月上线，含DLC和PS5 Pro支持", gameplay: "太空探索开放世界RPG，数百颗星球+飞船定制+剧情选择", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Silent Hill: Townfall", publisher: "科乐美/Annapurna", studio: "Screen Burn", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "寂静岭系列新作，据3DM/游侠网确认2026年发售", gameplay: "心理恐怖冒险，岛屿小镇背景，紧张周旋+激烈冲突+难解谜题", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Game of Thrones: War for Westeros", publisher: "待定", studio: "/", releaseDate: "2026年", platforms: "PC", heat: "中", heatNote: "权力的游戏IP新游，据GamesRadar 2026日程表确认", gameplay: "策略游戏，维斯特洛大陆战争题材", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Turok: Origins", publisher: "待定", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox+Switch2", heat: "中低", heatNote: "经典射击IP回归，据GamesRadar日程表确认2026年", gameplay: "第一人称射击，恐龙+外星人题材", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Professor Layton and the New World of Steam", publisher: "任天堂/Level-5", studio: "Level-5", releaseDate: "2026年", platforms: "Switch+Switch2", heat: "中", heatNote: "雷顿教授系列新作，据GamesRadar日程表确认", gameplay: "解谜冒险，经典谜题收集+剧情驱动探索", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Gothic 1 Remake", publisher: "THQ Nordic", studio: "Alkimia Interactive", releaseDate: "2026/6/5", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "经典RPG重制，据GamesRadar确认6/5发售", gameplay: "开放世界动作RPG，中世纪暗黑奇幻", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Terminator: Survivors", publisher: "Nacon", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "终结者IP生存游戏，据GamesRadar日程表确认2026年", gameplay: "开放世界生存建造，终结者审判日后背景", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "The Long Dark 2: Blackfrost", publisher: "Hinterland", studio: "Hinterland Studio", releaseDate: "2026年", platforms: "PC", heat: "中低", heatNote: "《漫漫长夜》续作，据GamesRadar日程表确认2026年", gameplay: "极地生存冒险，极端天气+资源管理", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Thick as Thieves", publisher: "待定", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "多人合作盗窃游戏，据GamesRadar日程表确认2026年", gameplay: "多人合作潜行盗窃", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Kena: Scars of Kosmora", publisher: "Ember Lab", studio: "Ember Lab", releaseDate: "2026年", platforms: "PC+PS5", heat: "中", heatNote: "《Kena: Bridge of Spirits》续作，据GamesRadar确认2026年", gameplay: "第三人称动作冒险，精灵引导+森林探索战斗", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Star Wars: Galactic Racer", publisher: "EA", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "星球大战IP竞速游戏，据GamesRadar日程表确认2026年", gameplay: "科幻竞速，星球大战宇宙中的高速赛车", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Dead or Alive 6 Last Round", publisher: "光荣特库摩", studio: "Team Ninja", releaseDate: "2026/6/25", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "格斗游戏经典系列，据GamesRadar确认6/25发售", gameplay: "3D格斗对战", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Moonlighter 2: The Endless Vault", publisher: "11 bit studios", studio: "Digital Sun", releaseDate: "2026年", platforms: "PS5+Switch2", heat: "中低", heatNote: "《夜勤人》续作，据GamesRadar日程表确认2026年", gameplay: "Roguelite动作RPG+商店经营模拟", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Valheim（Switch 2版）", publisher: "Iron Gate AB", studio: "Iron Gate AB", releaseDate: "2026年", platforms: "Switch2", heat: "中低", heatNote: "北欧维京生存大作Switch 2移植版，据GamesRadar确认", gameplay: "维京主题开放世界生存建造合作", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Witchbrook", publisher: "Chucklefish", studio: "Chucklefish", releaseDate: "2026年", platforms: "PC+Xbox+Switch+Switch2", heat: "中低", heatNote: "魔法学校模拟RPG，据GamesRadar日程表确认2026年", gameplay: "魔法学校生活模拟RPG", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Hell Let Loose: Vietnam", publisher: "Team17", studio: "Black Matter", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "《地狱放开》越战DLC/续作，据GamesRadar日程表确认", gameplay: "50v50大规模多人二战射击，越南战争新设定", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Mina the Hollower", publisher: "Yacht Club Games", studio: "Yacht Club Games", releaseDate: "2026年Q2", platforms: "PS5+Xbox+Switch+Switch2", heat: "中低", heatNote: "《铲子骑士》开发商新作，据PushSquare确认Q2 2026", gameplay: "俯视角动作冒险，复古风格+地下城探索", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Enshrouded", publisher: "Keen Games", studio: "Keen Games", releaseDate: "2026年Q3", platforms: "PS5", heat: "中低", heatNote: "热门生存建造大作主机版，据PushSquare确认Q3 2026 PS5版", gameplay: "开放世界生存建造RPG，多人合作探索+战斗", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Disgaea Mayhem", publisher: "日本一", studio: "Nippon Ichi Software", releaseDate: "2026年Q3", platforms: "PS5", heat: "低", heatNote: "魔界战记系列新作，据PushSquare确认Q3 2026", gameplay: "策略战棋RPG，日式搞笑+深度策略养成", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Danganronpa 2x2", publisher: "Spike Chunsoft", studio: "Spike Chunsoft", releaseDate: "2026年", platforms: "Switch+Switch2", heat: "中", heatNote: "弹丸论破系列新作，据GamesRadar日程表确认2026年", gameplay: "推理视觉小说+学级裁判", licenseStatus: "", licenseNote: "" },
    { region: "海外", name: "Captain Tsubasa 2: World Fighters", publisher: "万代南梦宫", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox+Switch", heat: "低", heatNote: "足球小将IP续作，据GamesRadar日程表确认2026年", gameplay: "足球竞技动作游戏，必杀技射门+队伍培养", licenseStatus: "", licenseNote: "" },

    // ===== 国内产品（需要版号信息） =====
    { region: "国内", name: "黑神话：钟馗", publisher: "游戏科学", studio: "/", releaseDate: "待定", platforms: "PC+PS5+Xbox", heat: "高", heatNote: "《黑神话：悟空》IP续作，24年销量2800万", gameplay: "类黑悟空ARPG，钟馗捉鬼背景", licenseStatus: "未获版号", licenseNote: "预计最快2026年内获批" },
    { region: "国内", name: "锋刃零（Phantom Blade Zero）", publisher: "S-GAME", studio: "S-GAME", releaseDate: "2026/9/9", platforms: "PC+PS5", heat: "高", heatNote: "中国独立工作室S-GAME开发，武侠动作大作，据GamesRadar确认9/9发售", gameplay: "武侠硬核动作游戏，快节奏近战连击+弹反系统+华丽连招", licenseStatus: "未获版号", licenseNote: "国行版需另行审批" },
    { region: "国内", name: "燕云十六声", publisher: "Everstone/网易", studio: "/", releaseDate: "2026年(持续更新)", platforms: "PC+PS5+Xbox", heat: "中高", heatNote: "已开启EA，持续更新中，移动端新春上线", gameplay: "开放世界武侠RPG，轻功+武术战斗+势力系统", licenseStatus: "已获版号", licenseNote: "PC版已公测" },
    { region: "国内", name: "刺客信条：影（国行版）", publisher: "育碧/腾讯", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "国行版预计需要较长审核", gameplay: "潜行动作冒险，日本战国背景", licenseStatus: "审核中", licenseNote: "腾讯代理国行版" },
];

// ====== 已上线产品数据（仅展示2026年上线的）======
const pipelineReleased = [
    // ===== 海外已上线 =====
    // --- Skills深度补充发现的1-2月已上线产品（据GamesRadar+PushSquare交叉验证）---
    { region: "海外", name: "2XKO", publisher: "Riot Games", studio: "Riot Games", releaseDate: "2026/1/20", platforms: "PC+PS5+Xbox", heat: "中高", heatNote: "英雄联盟IP格斗游戏，免费游玩，据GamesRadar确认1/20发售", gameplay: "2v2团队格斗对战，英雄联盟角色" },
    { region: "海外", name: "Animal Crossing: New Horizons Switch 2 Edition", publisher: "任天堂", studio: "/", releaseDate: "2026/1/15", platforms: "Switch2", heat: "中", heatNote: "动物森友会Switch 2强化版，据GamesRadar确认1/15发售", gameplay: "生活模拟经营，岛屿建设+社交" },
    { region: "海外", name: "Code Vein 2", publisher: "万代南梦宫", studio: "/", releaseDate: "2026/1/30", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "噬血代码续作，据GamesRadar确认1/30发售", gameplay: "类魂动作RPG，吸血鬼题材+同伴系统" },
    { region: "海外", name: "英雄传说：轨迹系列 Beyond the Horizon", publisher: "日本Falcom", studio: "Nihon Falcom", releaseDate: "2026/1/15", platforms: "PC+PS5+Switch+Switch2", heat: "中", heatNote: "轨迹系列最新作，据GamesRadar确认1/15发售", gameplay: "JRPG，回合制战斗+深度剧情叙事" },
    { region: "海外", name: "仁王3 (Nioh 3)", publisher: "光荣特库摩", studio: "Team Ninja", releaseDate: "2026/2/6", platforms: "PS5", heat: "中高", heatNote: "忍者组新作，仁王系列续作，据GamesRadar确认2/6发售", gameplay: "高难度魂系动作RPG，日本战国背景+妖怪讨伐" },
    { region: "海外", name: "文明7", publisher: "2K Games", studio: "Firaxis Games", releaseDate: "2026/2/11", platforms: "PC+PS5+Xbox+Switch", heat: "中高", heatNote: "经典策略IP，系列销量7000万+", gameplay: "回合制策略模拟，建设文明帝国从远古到现代" },
    { region: "海外", name: "Yakuza Kiwami 3 & Dark Ties", publisher: "世嘉", studio: "RGG Studio", releaseDate: "2026/2/12", platforms: "PC+PS5+Xbox+Switch2", heat: "中", heatNote: "如龙极3重制版，含全新Dark Ties章节，据SEGADriven确认2/12发售", gameplay: "开放世界动作冒险，日本黑道题材+格斗+城市探索" },
    { region: "海外", name: "High on Life 2", publisher: "Squanch Games", studio: "Squanch Games", releaseDate: "2026/2/13", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "会说话的枪FPS续作，据GamesRadar确认2/13发售", gameplay: "喜剧第一人称射击，会说话的外星武器" },
    { region: "海外", name: "生化危机9：安魂曲", publisher: "卡普空", studio: "/", releaseDate: "2026/2/27", platforms: "PC+PS5+Xbox+Switch2", heat: "中高", heatNote: "生化危机系列最新作，首周销量500万，据VGC确认为系列最大首发", gameplay: "恐怖生存动作冒险，第三人称视角" },
    { region: "海外", name: "杀手蛇（Slay the Spire 2）", publisher: "Mega Crit Games", studio: "Mega Crit", releaseDate: "2026/3/5", platforms: "PC", heat: "中", heatNote: "前作Steam特别好评，Roguelike卡牌鼻祖级续作", gameplay: "Roguelike卡牌构筑，策略战斗+随机地牢探索" },
    { region: "海外", name: "Marathon", publisher: "索尼/Bungie", studio: "Bungie", releaseDate: "2026/3/5", platforms: "PC+PS5+Xbox", heat: "中高", heatNote: "Bungie被索尼收购后首款新作，据VGC确认3/5发售", gameplay: "团队撤离射击PvPvE，赛博雇佣兵设定，高风险搜刮玩法" },
    { region: "海外", name: "零～红蝶～REMAKE～", publisher: "光荣特库摩", studio: "/", releaseDate: "2026/3/12", platforms: "PC+Switch2+PS5+Xbox", heat: "低", heatNote: "经典恐怖IP重制版", gameplay: "和风恐怖冒险，使用「射影机」拍照对抗幽灵的独特战斗方式" },
    { region: "海外", name: "怪物猎人物语3：命运双龙", publisher: "卡普空", studio: "/", releaseDate: "2026/3/13", platforms: "PC+Switch+PS5", heat: "中高", heatNote: "《怪物猎人》IP系列，系列销量1亿500万", gameplay: "ARPG，击败怪物获得素材强化角色，收服怪物携伴冒险" },
    { region: "海外", name: "勇者斗恶龙7 Reimagined", publisher: "史克威尔艾尼克斯", studio: "/", releaseDate: "2026/2/5", platforms: "PC+Switch2+PS5+Xbox", heat: "中", heatNote: "DQ系列经典重制，据GamesRadar确认2/5发售（非3/13）", gameplay: "JRPG，回合制战斗+职业转换系统" },
    { region: "海外", name: "死亡搁浅2：冥滩之上", publisher: "小岛工作室", studio: "/", releaseDate: "2026/3/19", platforms: "PC", heat: "中低", heatNote: "PS端首周销量140万", gameplay: "开放世界动作冒险，核心为「连接」主题的送货与探索，融合潜行与战斗" },
    { region: "海外", name: "真·三国无双2 with 猛将传 Remastered", publisher: "光荣特库摩", studio: "/", releaseDate: "2026/3/19", platforms: "PC+Switch+PS5", heat: "低", heatNote: "IP重制版，垂类头部", gameplay: "割草游戏" },
    { region: "海外", name: "红色沙漠", publisher: "Pearl Abyss", studio: "/", releaseDate: "2026/3/20", platforms: "PC+Xbox+PS5", heat: "中", heatNote: "开放世界大作，多平台发售", gameplay: "开放世界动作冒险，中世纪背景，流畅的近战与骑马战斗系统" },
];

// ====== 数据合并与处理 ======
const pipelineData = [
    ...pipelineUnreleased.map(g => ({ ...g, released: false })),
    ...pipelineReleased.map(g => ({ ...g, released: true }))
];

// Pipeline 数据处理函数
function getPipelineQuarter(dateStr) {
    if (!dateStr) return 'tbd';
    if (dateStr.includes('待定') || dateStr.includes('待')) return 'tbd';
    if (dateStr.includes('2027')) return '2027';
    
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
    
    if (dateStr.includes('2026年')) return '2026year';
    
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

function getHeatClass(heat) {
    switch(heat) {
        case '高': return 'heat-high';
        case '中高': return 'heat-mid-high';
        case '中': return 'heat-mid';
        case '中低': return 'heat-mid-low';
        case '低': return 'heat-low';
        default: return 'heat-low';
    }
}

function getHeatIcon(heat) {
    switch(heat) {
        case '高': return '🔥';
        case '中高': return '⚡';
        case '中': return '📊';
        case '中低': return '📉';
        case '低': return '⬜';
        default: return '⬜';
    }
}

function getRegionFlag(region) {
    return region === '国内' ? '🇨🇳' : '🌍';
}

// ============ Pipeline Tab 渲染引擎 V2 ============

function renderPipelineV2() {
    const timeFilter = document.getElementById('pipelineTimeFilter')?.value || 'all';
    const heatFilter = document.getElementById('pipelineHeatFilter')?.value || 'all';
    const regionFilter = document.getElementById('pipelineRegionFilter')?.value || 'all';
    const searchFilter = document.getElementById('pipelineSearchInput')?.value?.toLowerCase() || '';

    // 筛选未上线产品
    let unreleased = pipelineUnreleased.filter(g => {
        if (timeFilter !== 'all' && getPipelineQuarter(g.releaseDate) !== timeFilter) return false;
        if (heatFilter !== 'all' && g.heat !== heatFilter) return false;
        if (regionFilter !== 'all' && g.region !== regionFilter) return false;
        if (searchFilter && !g.name.toLowerCase().includes(searchFilter) && !g.publisher.toLowerCase().includes(searchFilter)) return false;
        return true;
    });

    // 2026已上线产品
    let released = pipelineReleased.filter(g => {
        if (heatFilter !== 'all' && g.heat !== heatFilter) return false;
        if (regionFilter !== 'all' && g.region !== regionFilter) return false;
        if (searchFilter && !g.name.toLowerCase().includes(searchFilter) && !g.publisher.toLowerCase().includes(searchFilter)) return false;
        return true;
    });

    // 更新 KPI
    updatePipelineKPI(unreleased, released);

    // 渲染已上线折叠区（置顶显示）
    renderReleasedSection(released);

    // 渲染未上线时间轴
    renderPipelineTimeline(unreleased);
}

function updatePipelineKPI(unreleased, released) {
    const total = unreleased.length;
    const now = new Date();
    const threeMonthsLater = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
    
    const upcoming = unreleased.filter(g => {
        const match = g.releaseDate.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
        if (match) {
            const d = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
            return d >= now && d <= threeMonthsLater;
        }
        return false;
    }).length;

    const highHeat = unreleased.filter(g => g.heat === '高' || g.heat === '中高').length;
    const xboxCount = unreleased.filter(g => hasPlatform(g.platforms, 'Xbox')).length;
    const domesticCount = unreleased.filter(g => g.region === '国内').length;

    const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    
    el('pipelineTotalCount', total);
    el('pipelineUpcomingCount', upcoming);
    el('pipelineHighHeatCount', highHeat);
    el('pipelineXboxCount', xboxCount);
    el('pipelineXboxPct', total > 0 ? Math.round(xboxCount / total * 100) + '%' : '0%');
    el('pipelineDomesticCount', domesticCount);
    el('pipelineReleasedCount', released.length);
}

function renderPipelineTimeline(games) {
    const container = document.getElementById('pipelineTimeline');
    if (!container) return;

    // 按季度分组（顺序：Q1→Q2→Q3→Q4→2026年→2027年→待定）
    const quarters = {
        'q1': { label: '2026 Q1 (1-3月)', icon: '🌱', games: [] },
        'q2': { label: '2026 Q2 (4-6月)', icon: '☀️', games: [] },
        'q3': { label: '2026 Q3 (7-9月)', icon: '🍂', games: [] },
        'q4': { label: '2026 Q4 (10-12月)', icon: '❄️', games: [] },
        '2026year': { label: '2026年（具体时间待定）', icon: '📆', games: [] },
        '2027': { label: '2027年', icon: '🔮', games: [] },
        'tbd': { label: '待定/未知', icon: '❓', games: [] }
    };

    games.forEach(g => {
        const q = getPipelineQuarter(g.releaseDate);
        if (quarters[q]) quarters[q].games.push(g);
        else quarters['tbd'].games.push(g);
    });

    let html = '<div class="pipeline-timeline-grid">';
    
    Object.entries(quarters).forEach(([key, q]) => {
        if (q.games.length === 0) return;
        
        // 排序：高关注度优先，同关注度按日期
        const heatOrder = { '高': 0, '中高': 1, '中': 2, '中低': 3, '低': 4 };
        q.games.sort((a, b) => {
            const ha = heatOrder[a.heat] ?? 5;
            const hb = heatOrder[b.heat] ?? 5;
            if (ha !== hb) return ha - hb;
            return getPipelineSortDate(a.releaseDate) - getPipelineSortDate(b.releaseDate);
        });

        html += `
        <div class="timeline-quarter">
            <div class="timeline-quarter-header">
                <span class="timeline-quarter-label">${q.icon} ${q.label}</span>
                <span class="timeline-quarter-count">${q.games.length} 款</span>
            </div>
            <div class="timeline-quarter-games">
        `;

        q.games.forEach((g, idx) => {
            const heatCls = getHeatClass(g.heat);
            const platforms = g.platforms.split('+').map(p => 
                `<span class="platform-tag-sm">${p.trim()}</span>`
            ).join('');
            
            const regionFlag = getRegionFlag(g.region);
            const cardId = `card-${key}-${idx}`;
            
            // 版号信息（仅国内产品）
            let licenseHtml = '';
            if (g.region === '国内' && g.licenseStatus) {
                const lcCls = g.licenseStatus === '已获版号' ? 'license-approved' : 
                              g.licenseStatus === '审核中' ? 'license-pending' : 'license-none';
                licenseHtml = `<span class="license-tag ${lcCls}">${g.licenseStatus}</span>`;
            }

            html += `
            <div class="timeline-game-card ${heatCls}" id="${cardId}" onclick="toggleCardDetail('${cardId}')">
                <div class="timeline-game-header">
                    <div class="timeline-game-name">
                        ${regionFlag} ${g.name}
                        ${licenseHtml}
                    </div>
                    <span class="card-expand-icon" id="expand-${cardId}">▼</span>
                </div>
                <div class="timeline-game-meta">
                    <span>${g.publisher}${g.studio && g.studio !== '/' ? ' · ' + g.studio : ''}</span>
                    <span>${g.releaseDate}</span>
                </div>
                <div class="timeline-game-tags">
                    <span class="heat-tag ${heatCls}">${getHeatIcon(g.heat)} ${g.heat}</span>
                    ${platforms}
                </div>
                <div class="card-detail-panel" id="detail-${cardId}" style="display:none;">
                    <div class="detail-divider"></div>
                    <div class="detail-row">
                        <span class="detail-label">🎮 玩法简析</span>
                        <span class="detail-value">${g.gameplay || '暂无信息'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">📝 关注度说明</span>
                        <span class="detail-value">${g.heatNote || '暂无信息'}</span>
                    </div>
                    ${g.region === '国内' ? `
                    <div class="detail-row">
                        <span class="detail-label">📋 版号状态</span>
                        <span class="detail-value">${g.licenseStatus || '暂无信息'}${g.licenseNote ? ' · ' + g.licenseNote : ''}</span>
                    </div>
                    ` : ''}
                    <div class="detail-row">
                        <span class="detail-label">🏢 发行商</span>
                        <span class="detail-value">${g.publisher}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">🎬 工作室</span>
                        <span class="detail-value">${g.studio && g.studio !== '/' ? g.studio : '未知'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">🌐 平台</span>
                        <span class="detail-value">${g.platforms}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">🗺️ 地区</span>
                        <span class="detail-value">${g.region === '国内' ? '🇨🇳 国内产品' : '🌍 海外产品'}</span>
                    </div>
                </div>
            </div>
            `;
        });

        html += '</div></div>';
    });

    html += '</div>';
    container.innerHTML = html;
}

function renderReleasedSection(released) {
    const container = document.getElementById('pipelineReleasedSection');
    if (!container) return;

    if (released.length === 0) {
        container.innerHTML = '<div style="padding:20px;color:var(--text-muted);text-align:center;">暂无符合条件的已上线产品</div>';
        return;
    }

    // 按日期倒序
    released.sort((a, b) => getPipelineSortDate(b.releaseDate) - getPipelineSortDate(a.releaseDate));

    let html = `
    <div class="released-section-wrapper">
        <div class="released-section-header" onclick="toggleReleasedSection()">
            <div class="released-section-title">
                <span class="released-icon">✅</span>
                <span>2026年已上线产品</span>
                <span class="released-count">${released.length} 款</span>
            </div>
            <span class="released-chevron" id="releasedChevron">▶</span>
        </div>
        <div class="released-section-body" id="releasedSectionBody" style="display:none;">
            <div class="released-grid">
    `;

    released.forEach((g, idx) => {
        const heatCls = getHeatClass(g.heat);
        const platforms = g.platforms.split('+').map(p => 
            `<span class="platform-tag-sm">${p.trim()}</span>`
        ).join('');
        const regionFlag = getRegionFlag(g.region);
        const cardId = `released-${idx}`;

        html += `
        <div class="timeline-game-card timeline-card-released ${heatCls}" id="${cardId}" onclick="toggleCardDetail('${cardId}')">
            <div class="timeline-game-header">
                <div class="timeline-game-name">
                    ${regionFlag} ${g.name}
                    <span class="released-badge">已上线</span>
                </div>
                <span class="card-expand-icon" id="expand-${cardId}">▼</span>
            </div>
            <div class="timeline-game-meta">
                <span>${g.publisher}${g.studio && g.studio !== '/' ? ' · ' + g.studio : ''}</span>
                <span>${g.releaseDate}</span>
            </div>
            <div class="timeline-game-tags">
                <span class="heat-tag ${heatCls}">${getHeatIcon(g.heat)} ${g.heat}</span>
                ${platforms}
            </div>
            <div class="card-detail-panel" id="detail-${cardId}" style="display:none;">
                <div class="detail-divider"></div>
                <div class="detail-row">
                    <span class="detail-label">🎮 玩法简析</span>
                    <span class="detail-value">${g.gameplay || '暂无信息'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">📝 关注度说明</span>
                    <span class="detail-value">${g.heatNote || '暂无信息'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🏢 发行商</span>
                    <span class="detail-value">${g.publisher}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🎬 工作室</span>
                    <span class="detail-value">${g.studio && g.studio !== '/' ? g.studio : '未知'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🌐 平台</span>
                    <span class="detail-value">${g.platforms}</span>
                </div>
            </div>
        </div>
        `;
    });

    html += '</div></div></div>';
    container.innerHTML = html;
}

// ============ 交互函数 ============

function toggleCardDetail(cardId) {
    const detail = document.getElementById('detail-' + cardId);
    const expandIcon = document.getElementById('expand-' + cardId);
    if (!detail) return;
    
    const isVisible = detail.style.display !== 'none';
    detail.style.display = isVisible ? 'none' : 'block';
    if (expandIcon) {
        expandIcon.textContent = isVisible ? '▼' : '▲';
        expandIcon.classList.toggle('expanded', !isVisible);
    }
    
    // 添加动画
    if (!isVisible) {
        detail.style.animation = 'slideDown 0.3s ease-out';
    }
}

function toggleReleasedSection() {
    const body = document.getElementById('releasedSectionBody');
    const chevron = document.getElementById('releasedChevron');
    if (!body) return;
    
    const isVisible = body.style.display !== 'none';
    body.style.display = isVisible ? 'none' : 'block';
    if (chevron) {
        chevron.textContent = isVisible ? '▶' : '▼';
    }
}

// ============ 定期刷新扫描功能 ============

let pipelineRefreshTimer = null;
let pipelineLastRefresh = new Date();
const PIPELINE_REFRESH_INTERVAL = 30 * 60 * 1000;

function startPipelineAutoRefresh() {
    if (pipelineRefreshTimer) clearInterval(pipelineRefreshTimer);
    pipelineRefreshTimer = setInterval(() => {
        pipelineLastRefresh = new Date();
        renderPipelineV2();
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
    renderPipelineV2();
    updatePipelineRefreshStatus();
    
    const btn = document.getElementById('pipelineRefreshBtn');
    if (btn) {
        btn.classList.add('spinning');
        setTimeout(() => btn.classList.remove('spinning'), 1000);
    }
}

// 初始化
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        startPipelineAutoRefresh();
        
        // 绑定筛选器事件
        ['pipelineTimeFilter', 'pipelineHeatFilter', 'pipelineRegionFilter'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', renderPipelineV2);
        });
        
        const searchInput = document.getElementById('pipelineSearchInput');
        if (searchInput) {
            let debounce;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounce);
                debounce = setTimeout(renderPipelineV2, 300);
            });
        }
    });
}
