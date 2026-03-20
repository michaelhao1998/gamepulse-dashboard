// ============================================
// 待上线 Pipeline 数据模块 V3.0
// 数据源：腾讯文档 MCP（唯一基准，文档ID: LRcKfOTzgHrV）
//         + 网络搜索验证补充（标注来源，不覆盖MCP数据）
// 最后更新: 2026-03-20 (V3.0 全量MCP基准重建版)
// ============================================

// ====== 未上线产品数据（全部展示）======
const pipelineUnreleased = [
    // =============================================
    // ===== 一、MCP 腾讯文档基准数据（未上线 Sheet BB08J2）=====
    // =============================================

    // --- MCP 海外产品（有具体日期）---
    { region: "海外", name: "红色沙漠", publisher: "Pearl Abyss", studio: "/", releaseDate: "2026/3/20", platforms: "PC+PS+Mac", heat: "中", heatNote: "开放世界大作", gameplay: "开放世界动作冒险，中世纪背景，近战与骑马战斗", licenseStatus: "", licenseNote: "", source: "MCP" },

    { region: "海外", name: "奇异人生：重聚（Life is Strange: Reunion）", publisher: "Square Enix", studio: "Deck Nine Games", releaseDate: "2026/3/26", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "IP全球销量2000万+", gameplay: "剧情驱动冒险游戏，蝴蝶效应式选择分支叙事", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "Screamer", publisher: "Milestone S.r.l.", studio: "/", releaseDate: "2026/3/26", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "赛车垂类头部公司", gameplay: "二次元赛车", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "Replaced", publisher: "Coatsink", studio: "Sad Cat Studios", releaseDate: "2026年", platforms: "PC+Xbox", heat: "低", heatNote: "多次跳票，原定3/12发售后再次延期", gameplay: "2.5D科幻复古动作平台跳跃", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "识质存在/PRAGMATA", publisher: "卡普空", studio: "/", releaseDate: "2026/4/17", platforms: "PC+Switch2+PS5+Xbox", heat: "中", heatNote: "Fami通最受期待榜第一", gameplay: "第三人称射击+黑客解谜", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "明日潮汐", publisher: "Digixart", studio: "/", releaseDate: "2026/4/22", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "《96号公路》团队新作", gameplay: "异步联机探索生存", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "暗黑破坏神4：憎恨之王", publisher: "暴雪", studio: "/", releaseDate: "2026/4/28", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "DLC扩展包", gameplay: "ARPG暗黑刷宝，新增魂灵师职业", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "SAROS", publisher: "索尼", studio: "Housemarque", releaseDate: "2026/4/30", platforms: "PS5", heat: "中低", heatNote: "索尼一方游戏", gameplay: "第三人称科幻射击", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "极限竞速：地平线6", publisher: "微软", studio: "Playground Games", releaseDate: "2026/5/19", platforms: "PC+Xbox", heat: "中低", heatNote: "IP续作，垂类头部", gameplay: "赛车竞速", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "007：锋芒初露", publisher: "世嘉", studio: "IO Interactive", releaseDate: "2026/5/27", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "开发成本1.8亿美元", gameplay: "特工潜行+枪战", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "乐高蝙蝠侠：黑暗骑士的遗产", publisher: "华纳兄弟", studio: "/", releaseDate: "2026/5/29", platforms: "PC+Switch2+PS5+Xbox", heat: "中低", heatNote: "乐高+蝙蝠侠双IP", gameplay: "潜行跑酷+开放世界探索", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "幻兽帕鲁集换式卡牌", publisher: "Pocketpair", studio: "/", releaseDate: "2026/7/30", platforms: "待定", heat: "中", heatNote: "幻兽帕鲁IP", gameplay: "集换式卡牌", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "Beast of Reincarnation", publisher: "Game Freak", studio: "/", releaseDate: "2026/8/4", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "宝可梦开发商转型之作", gameplay: "大型动作RPG，Game Pass首日入库", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "Halloween: The Game", publisher: "IllFonic&Gun Interactive", studio: "/", releaseDate: "2026/9/8", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "", gameplay: "非对称对抗+恐怖冒险", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "漫威金刚狼", publisher: "索尼", studio: "Insomniac Games", releaseDate: "2026/9/15", platforms: "PS5", heat: "中高", heatNote: "漫威IP+Insomniac顶级工作室", gameplay: "第三人称动作冒险，开放世界", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "GTA6", publisher: "Take-Two/R星", studio: "Rockstar Games", releaseDate: "2026/11/19", platforms: "PS5+Xbox", heat: "高", heatNote: "系列销量4.4亿", gameplay: "开放世界犯罪动作冒险", licenseStatus: "", licenseNote: "", source: "MCP" },

    // --- MCP 海外产品（季度/年份）---
    { region: "海外", name: "Control Resonant", publisher: "505 Games", studio: "Remedy Entertainment", releaseDate: "2026年Q2", platforms: "PC+Switch+PS5+Xbox", heat: "中低", heatNote: "前作销量500万", gameplay: "超自然第三人称动作冒险", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "真·三国无双2 with 猛将传 Remastered", publisher: "光荣特库摩", studio: "/", releaseDate: "2026年", platforms: "PC+Switch+PS5", heat: "低", heatNote: "IP重制版", gameplay: "割草动作", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "流星洛克人：完美合集", publisher: "卡普空", studio: "/", releaseDate: "2026年", platforms: "待定", heat: "低", heatNote: "洛克人系列合集", gameplay: "横版动作射击合集", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "黎明行者之血", publisher: "待定", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "", gameplay: "动作冒险，暗黑奇幻", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "魔法门之英雄无敌：上古纪元", publisher: "育碧", studio: "/", releaseDate: "2026年", platforms: "PC", heat: "中低", heatNote: "Steam愿望单100万+", gameplay: "欧美奇幻RPG策略", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "堕落之主2", publisher: "CI Games", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "", gameplay: "类魂ARPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "原子之心2", publisher: "Mundfish", studio: "/", releaseDate: "2026年", platforms: "PC", heat: "中低", heatNote: "前作销量500万", gameplay: "第一人称射击+苏联科幻风", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "战锤40K：战争黎明4", publisher: "King Art Games", studio: "/", releaseDate: "2026年", platforms: "PC", heat: "中高", heatNote: "星际战士2销量700万+", gameplay: "即时战略RTS", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "战争机器：E-Day", publisher: "微软", studio: "/", releaseDate: "2026年", platforms: "PC+Xbox", heat: "中低", heatNote: "战争机器IP", gameplay: "第三人称射击", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "女神异闻录4 Revival", publisher: "世嘉", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "女神异闻录IP", gameplay: "JRPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "皇牌空战8：希孚之翼", publisher: "万代南梦宫", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "皇牌空战系列IP", gameplay: "空战射击", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "古墓丽影：亚特兰蒂斯遗迹", publisher: "Crystal Dynamics", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "古墓丽影IP", gameplay: "第三人称动作冒险，探墓解谜", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "致命躯壳 II", publisher: "Playstack", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "前作销量破百万", gameplay: "魂系ARPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "神鬼寓言4", publisher: "微软", studio: "Playground Games", releaseDate: "2026年", platforms: "PC+Xbox+PS5", heat: "中", heatNote: "经典IP重启", gameplay: "开放世界动作RPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "The Duskbloods", publisher: "待定", studio: "/", releaseDate: "2026年", platforms: "Switch2", heat: "中低", heatNote: "", gameplay: "角色扮演冒险", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "漫威1943：九头蛇崛起", publisher: "Skydance New Media", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "漫威IP", gameplay: "二战背景动作冒险", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "冒险家艾略特的千年物语", publisher: "史克威尔艾尼克斯", studio: "/", releaseDate: "2026年", platforms: "PC+Switch+PS5+Xbox", heat: "低", heatNote: "类塞尔达", gameplay: "开放世界动作冒险", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "宝可梦：风 / 浪", publisher: "任天堂", studio: "宝可梦公司", releaseDate: "2026年", platforms: "Switch2", heat: "高", heatNote: "宝可梦第十世代新作", gameplay: "回合制战斗RPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "战锤40K：机械神教2", publisher: "Kasedo Games", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "战锤IP", gameplay: "策略战棋", licenseStatus: "", licenseNote: "", source: "MCP" },

    // --- MCP 海外产品（待定）---
    { region: "海外", name: "凯恩的遗产：崛起", publisher: "Crystal Dynamics", studio: "/", releaseDate: "待定", platforms: "PC+PS5+Xbox", heat: "中高", heatNote: "Crystal Dynamics新IP", gameplay: "动作冒险", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "光环：战役进化", publisher: "微软", studio: "Halo Studios", releaseDate: "待定", platforms: "PC", heat: "中高", heatNote: "光环IP，系列超800万", gameplay: "FPS射击", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "4:LOOP", publisher: "Bad Robot Games LLC", studio: "/", releaseDate: "待定", platforms: "PC", heat: "中低", heatNote: "求生之路研发商", gameplay: "4人合作射击", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "全面战争：战锤40000", publisher: "Creative Assembly", studio: "/", releaseDate: "待定", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "全战系列销量4200万+", gameplay: "回合制+即时战术RTS", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "森林3", publisher: "Endnight Games Ltd", studio: "/", releaseDate: "待定", platforms: "PC", heat: "低", heatNote: "续作首日200万套", gameplay: "开放世界恐怖生存建造", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "星球大战：旧共和国的命运", publisher: "Arcanaut Studios", studio: "/", releaseDate: "待定", platforms: "PC", heat: "低", heatNote: "", gameplay: "星战宇宙RPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "幻兽帕鲁：帕鲁农场", publisher: "Pocketpair", studio: "/", releaseDate: "待定", platforms: "PC", heat: "中", heatNote: "幻兽帕鲁IP", gameplay: "经营模拟+探索社交", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "地平线：钢铁边境", publisher: "索尼", studio: "Guerrilla&NCSOFT", releaseDate: "待定", platforms: "移动+PC", heat: "中低", heatNote: "", gameplay: "狩猎MMORPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "神界", publisher: "Larian Studios", studio: "/", releaseDate: "待定", platforms: "PC", heat: "中高", heatNote: "博德之门3研发商", gameplay: "回合制/即时RPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "上古卷轴6", publisher: "微软", studio: "Bethesda Games", releaseDate: "待定", platforms: "未知", heat: "高", heatNote: "前作销量6000万+", gameplay: "开放世界RPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "黑神话：钟馗", publisher: "游戏科学", studio: "/", releaseDate: "待定", platforms: "PC+PS5+Xbox", heat: "高", heatNote: "黑神话悟空IP续作，24年销量2800万", gameplay: "类魂ARPG，钟馗捉鬼背景", licenseStatus: "", licenseNote: "", source: "MCP" },

    // --- MCP 海外产品（2027年）---
    { region: "海外", name: "Exodus", publisher: "Archetype Entertainment", studio: "/", releaseDate: "2027年", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "BioWare前核心成员", gameplay: "科幻ARPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "古墓丽影：催化剂", publisher: "Crystal Dynamics", studio: "/", releaseDate: "2027年", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "古墓丽影IP", gameplay: "第三人称动作冒险", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "洛克人：双重超载", publisher: "卡普空", studio: "/", releaseDate: "2027年", platforms: "PC+Switch+PS+Xbox", heat: "低", heatNote: "洛克人IP", gameplay: "横版动作射击", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "海外", name: "马克思佩恩 1&2重制版", publisher: "R星", studio: "Rockstar Games", releaseDate: "2027年", platforms: "待定", heat: "中", heatNote: "系列销量1100万", gameplay: "子弹时间射击", licenseStatus: "", licenseNote: "", source: "MCP" },

    // --- MCP 国内产品（有具体日期）---
    { region: "国内", name: "洛克王国：世界", publisher: "腾讯", studio: "/", releaseDate: "2026/3/26", platforms: "PC+移动", heat: "中高", heatNote: "腾讯头部IP，国民级少儿IP", gameplay: "宠物养成冒险RPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "异环（Neverness to Everness）", publisher: "完美世界", studio: "/", releaseDate: "2026/4/23", platforms: "PC+PS5+移动", heat: "中高", heatNote: "完美世界头部新品", gameplay: "开放世界动作冒险RPG", licenseStatus: "", licenseNote: "", source: "MCP" },

    { region: "国内", name: "影之刃零（Phantom Blade Zero）", publisher: "灵游坊", studio: "/", releaseDate: "2026/9/9", platforms: "PC+PS5", heat: "高", heatNote: "武侠硬核动作大作", gameplay: "武侠硬核动作，快节奏近战连击+弹反+华丽连招", licenseStatus: "未获版号", licenseNote: "国行版需另行审批", source: "MCP" },

    // --- MCP 国内产品（2026年/季度）---
    { region: "国内", name: "无限大（Ananta）", publisher: "网易", studio: "雷火旗下Naked Rain", releaseDate: "2026年", platforms: "PC+PS5", heat: "高", heatNote: "网易高关注度新品", gameplay: "开放世界动作RPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "星绘友晴天", publisher: "网易", studio: "/", releaseDate: "2026年", platforms: "PC+移动", heat: "中", heatNote: "网易新品", gameplay: "社交模拟", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "大侠立志传外传", publisher: "半瓶醋工作室", studio: "/", releaseDate: "2026年", platforms: "PC", heat: "中低", heatNote: "大侠立志传衍生", gameplay: "武侠RPG策略", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "星布谷地（Petit Planet）", publisher: "米哈游", studio: "/", releaseDate: "2026年", platforms: "PC+移动", heat: "中", heatNote: "米哈游牧场项目", gameplay: "牧场模拟经营", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "崩坏：因缘精灵", publisher: "米哈游", studio: "/", releaseDate: "2026年", platforms: "PC+移动", heat: "中", heatNote: "米哈游崩坏IP", gameplay: "RPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "望月", publisher: "诗悦网络", studio: "/", releaseDate: "2026年", platforms: "PC", heat: "中低", heatNote: "", gameplay: "仙侠RPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "荒野起源（Light of Motiram）", publisher: "腾讯", studio: "北极光", releaseDate: "2026年", platforms: "PC+PS5+移动", heat: "中高", heatNote: "腾讯北极光工作室", gameplay: "开放世界生存冒险", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "异人之下（The Hidden Ones）", publisher: "腾讯", studio: "魔方", releaseDate: "2026年", platforms: "PC+移动", heat: "中高", heatNote: "腾讯魔方+顶级国漫IP", gameplay: "动作冒险RPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "镭明闪击（Warp Knights）", publisher: "字节跳动", studio: "/", releaseDate: "2026年", platforms: "PC", heat: "中", heatNote: "字节跳动游戏", gameplay: "射击", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "雾影猎人（Mistfall Hunter）", publisher: "字节跳动", studio: "北京绿洲(Bellring Games)", releaseDate: "2026年7月", platforms: "PC", heat: "中", heatNote: "字节旗下绿洲工作室，原定3月发售已跳票至7月", gameplay: "共斗ARPG搜打撤", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "遗忘之海（Sea of Remnants）", publisher: "网易", studio: "/", releaseDate: "2026年Q3", platforms: "PC+PS5", heat: "中", heatNote: "网易新品", gameplay: "开放世界海洋冒险", licenseStatus: "", licenseNote: "", source: "MCP" },

    // --- MCP 国内产品（待定）---
    { region: "国内", name: "烽火十四", publisher: "烽火工作室", studio: "/", releaseDate: "待定", platforms: "PC", heat: "中", heatNote: "", gameplay: "SLG策略", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "龙帮", publisher: "网易", studio: "名越工作室", releaseDate: "待定", platforms: "PC+PS5", heat: "中高", heatNote: "网易+名越稻叶联合制作", gameplay: "动作冒险", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "剑心雕龙", publisher: "网易", studio: "雷火旗下临安24th", releaseDate: "待定", platforms: "PC", heat: "中", heatNote: "网易雷火", gameplay: "武侠ARPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "山海奇旅（Floatopia）", publisher: "网易", studio: "/", releaseDate: "待定", platforms: "PC+移动", heat: "中", heatNote: "", gameplay: "开放世界冒险", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "归唐（Blood Message）", publisher: "网易", studio: "雷火旗下临安24th", releaseDate: "待定", platforms: "PC+PS5", heat: "中", heatNote: "网易雷火", gameplay: "动作冒险RPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "万民长歌：三国", publisher: "网易", studio: "第十事业部", releaseDate: "待定", platforms: "PC", heat: "中", heatNote: "网易三国题材", gameplay: "策略RPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "破碎之地", publisher: "网易", studio: "北落师门", releaseDate: "待定", platforms: "PC+PS5", heat: "中", heatNote: "网易北落师门", gameplay: "开放世界动作", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "某写实开放世界", publisher: "米哈游", studio: "/", releaseDate: "待定", platforms: "待定", heat: "高", heatNote: "米哈游高关注度全新IP", gameplay: "写实风格开放世界", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "欧美卡通设计", publisher: "米哈游", studio: "/", releaseDate: "待定", platforms: "待定", heat: "中", heatNote: "米哈游在研项目", gameplay: "待定", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "CODE：PJSH", publisher: "米哈游", studio: "/", releaseDate: "待定", platforms: "PC+移动", heat: "高", heatNote: "米哈游高关注度新品", gameplay: "待定", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "灰境行者", publisher: "腾讯", studio: "北极光", releaseDate: "待定", platforms: "PC+PS5", heat: "中", heatNote: "腾讯北极光", gameplay: "射击动作", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "穿越火线：虹", publisher: "腾讯", studio: "琳琅天上", releaseDate: "待定", platforms: "PC+移动", heat: "中高", heatNote: "CF头部IP新品", gameplay: "FPS射击", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "百相千面（The Perceiver）", publisher: "叠纸", studio: "十七折", releaseDate: "待定", platforms: "PC+PS5", heat: "中高", heatNote: "叠纸头部新品", gameplay: "武侠动作冒险", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "万物契约（Ballad of Antara）", publisher: "叠纸", studio: "/", releaseDate: "待定", platforms: "PC+PS5+移动", heat: "中高", heatNote: "叠纸头部RPG", gameplay: "开放世界RPG", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "project prince", publisher: "字节跳动", studio: "/", releaseDate: "待定", platforms: "PC", heat: "中", heatNote: "字节跳动游戏", gameplay: "待定", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "头号禁区", publisher: "字节跳动", studio: "沐瞳", releaseDate: "待定", platforms: "PC+移动", heat: "中", heatNote: "字节旗下沐瞳", gameplay: "射击竞技", licenseStatus: "", licenseNote: "", source: "MCP" },
    { region: "国内", name: "《三体》IP游戏", publisher: "字节跳动", studio: "杭州江南", releaseDate: "待定", platforms: "PC", heat: "中高", heatNote: "三体超级IP", gameplay: "待定", licenseStatus: "", licenseNote: "", source: "MCP" },

    // --- MCP 国内产品（2027年）---
    { region: "国内", name: "逆神者", publisher: "帕斯亚科技", studio: "/", releaseDate: "2027年", platforms: "PC", heat: "中低", heatNote: "", gameplay: "动作RPG", licenseStatus: "", licenseNote: "", source: "MCP" },

    // =============================================
    // ===== 二、网络搜索验证补充（不在腾讯文档中，已验证真实性）=====
    // =============================================
    { region: "海外", name: "鬼武者：剑之道", publisher: "卡普空", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中高", heatNote: "TGA 2024公布，卡普空经典IP回归", gameplay: "日本战国剑斗动作", licenseStatus: "", licenseNote: "", source: "网络搜索" },
    { region: "海外", name: "深海迷航2", publisher: "Krafton", studio: "Unknown Worlds", releaseDate: "2026年", platforms: "PC+Xbox", heat: "中", heatNote: "前作销量超2000万，2026年5月EA", gameplay: "海洋探索生存建造", licenseStatus: "", licenseNote: "", source: "网络搜索" },
    { region: "海外", name: "Starfield（PS5版）", publisher: "微软/Bethesda", studio: "Bethesda Games", releaseDate: "2026/4/7", platforms: "PS5", heat: "中高", heatNote: "B社确认PS5版4/7发售", gameplay: "太空探索开放世界RPG", licenseStatus: "", licenseNote: "", source: "网络搜索" },
    { region: "海外", name: "Directive 8020", publisher: "万代南梦宫", studio: "Supermassive Games", releaseDate: "2026/5/12", platforms: "PC+PS5+Xbox", heat: "中高", heatNote: "直到黎明开发商新作", gameplay: "电影式科幻恐怖冒险", licenseStatus: "", licenseNote: "", source: "网络搜索" },

    { region: "海外", name: "恶魔城：贝尔蒙特的诅咒", publisher: "科乐美", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox+Switch", heat: "中", heatNote: "恶魔城系列新作", gameplay: "哥特风横版动作冒险", licenseStatus: "", licenseNote: "", source: "网络搜索" },
    { region: "海外", name: "瘟疫传说：遗响", publisher: "Focus Entertainment", studio: "Asobo Studio", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "瘟疫传说续作", gameplay: "线性叙事动作冒险", licenseStatus: "", licenseNote: "", source: "网络搜索" },
    { region: "海外", name: "InZOI", publisher: "Krafton", studio: "Krafton", releaseDate: "2026年", platforms: "PS5", heat: "中", heatNote: "模拟人生竞品", gameplay: "生活模拟经营", licenseStatus: "", licenseNote: "", source: "网络搜索" },
    { region: "海外", name: "Silent Hill: Townfall", publisher: "科乐美/Annapurna", studio: "Screen Burn", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "寂静岭系列新作", gameplay: "心理恐怖冒险", licenseStatus: "", licenseNote: "", source: "网络搜索" },
    { region: "海外", name: "Intergalactic: The Heretic Prophet", publisher: "索尼", studio: "Naughty Dog", releaseDate: "待定", platforms: "PS5", heat: "中高", heatNote: "顽皮狗全新科幻IP", gameplay: "科幻第三人称动作冒险", licenseStatus: "", licenseNote: "", source: "网络搜索" },
    { region: "海外", name: "巫师4", publisher: "CD Projekt Red", studio: "CD Projekt Red", releaseDate: "2027年", platforms: "PC+PS5+Xbox", heat: "高", heatNote: "CDPR确认最早2027年发售", gameplay: "开放世界动作RPG", licenseStatus: "", licenseNote: "", source: "网络搜索" },
    { region: "海外", name: "碧蓝幻想Relink：无尽黄昏", publisher: "Cygames", studio: "Cygames", releaseDate: "2026/7/9", platforms: "PC+Switch2+PS5", heat: "中", heatNote: "前作全球300万+", gameplay: "多人联机ARPG", licenseStatus: "", licenseNote: "", source: "网络搜索" },
    { region: "海外", name: "最终幻想7 重生 Xbox/Switch版", publisher: "史克威尔艾尼克斯", studio: "/", releaseDate: "2026/6/3", platforms: "Xbox+Switch", heat: "中高", heatNote: "FF7重制三部曲第二作移植版", gameplay: "ARPG", licenseStatus: "", licenseNote: "", source: "网络搜索" },
    { region: "海外", name: "刺客信条4：黑旗 重制版", publisher: "育碧", studio: "/", releaseDate: "2026年", platforms: "待定", heat: "中", heatNote: "刺客信条经典之作", gameplay: "潜行刺杀+海战", licenseStatus: "", licenseNote: "", source: "网络搜索" },

    { region: "国内", name: "刺客信条：影（国行版）", publisher: "育碧/腾讯", studio: "/", releaseDate: "2026年", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "国行版审核中", gameplay: "潜行动作冒险", licenseStatus: "审核中", licenseNote: "腾讯代理国行版", source: "网络搜索" },
];

// ====== 已上线产品数据（仅展示2026年上线的）======
const pipelineReleased = [
    // ===== 腾讯文档 MCP 已上线基准数据 =====
    { region: "海外", name: "检疫区：最后一站", publisher: "Sprung Studios", studio: "/", releaseDate: "2026/1/12", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "", gameplay: "合作射击生存", source: "MCP" },
    { region: "海外", name: "2XKO", publisher: "Riot Games", studio: "Riot Games", releaseDate: "2026/1/20", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "英雄联盟IP格斗游戏", gameplay: "2v2格斗对战", source: "MCP" },
    { region: "海外", name: "英雄传说 界之轨迹 -告别塞姆利亚", publisher: "日本Falcom", studio: "Nihon Falcom", releaseDate: "2026/1/22", platforms: "PC+PS5+Switch", heat: "中", heatNote: "轨迹系列最新作", gameplay: "JRPG，回合制战斗+深度剧情", source: "MCP" },
    { region: "海外", name: "最终幻想7重制版：间奏", publisher: "史克威尔艾尼克斯", studio: "/", releaseDate: "2026/1/22", platforms: "PC+PS5+Switch", heat: "低", heatNote: "FF7重制系列DLC/过渡篇", gameplay: "ARPG", source: "MCP" },
    { region: "海外", name: "明日方舟：终末地", publisher: "鹰角网络", studio: "/", releaseDate: "2026/1/22", platforms: "PC+移动", heat: "中", heatNote: "明日方舟IP新作", gameplay: "3D开放世界RPG", source: "MCP" },
    { region: "海外", name: "巅峰守卫", publisher: "待定", studio: "/", releaseDate: "2026/1/26", platforms: "PC+移动", heat: "低", heatNote: "", gameplay: "塔防策略", source: "MCP" },
    { region: "海外", name: "七大罪：起源", publisher: "网石", studio: "/", releaseDate: "2026/1/28", platforms: "PC+移动", heat: "低", heatNote: "七大罪IP", gameplay: "MMORPG", source: "MCP" },
    { region: "海外", name: "噬血代码2", publisher: "万代南梦宫", studio: "/", releaseDate: "2026/1/30", platforms: "PC+PS5+Xbox", heat: "中", heatNote: "噬血代码续作", gameplay: "类魂ARPG，吸血鬼题材", source: "MCP" },
    { region: "海外", name: "勇者斗恶龙7重制版", publisher: "史克威尔艾尼克斯", studio: "/", releaseDate: "2026/2/5", platforms: "PC+Switch2+PS5+Xbox", heat: "中", heatNote: "DQ经典重制", gameplay: "JRPG，回合制战斗", source: "MCP" },
    { region: "海外", name: "仁王3", publisher: "光荣特库摩", studio: "Team Ninja", releaseDate: "2026/2/6", platforms: "PS5", heat: "中", heatNote: "忍者组新作", gameplay: "高难度魂系动作RPG", source: "MCP" },
    { region: "海外", name: "如龙极3 & 如龙3外传 Dark Ties", publisher: "世嘉", studio: "RGG Studio", releaseDate: "2026/2/12", platforms: "PC+PS5+Xbox+Switch2", heat: "中", heatNote: "如龙极3重制+全新外传", gameplay: "开放世界动作冒险", source: "MCP" },
    { region: "海外", name: "马力欧网球：狂热", publisher: "任天堂", studio: "/", releaseDate: "2026/2/12", platforms: "Switch2", heat: "中", heatNote: "任天堂体育IP", gameplay: "体育竞技网球", source: "MCP" },
    { region: "海外", name: "极速骑行6", publisher: "Milestone", studio: "/", releaseDate: "2026/2/12", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "摩托赛车垂类", gameplay: "摩托车竞速", source: "MCP" },
    { region: "海外", name: "苍翼：混沌效应X", publisher: "Arc System Works", studio: "/", releaseDate: "2026/2/12", platforms: "PC+PS5+Xbox+Switch", heat: "低", heatNote: "苍翼默示录IP", gameplay: "2D格斗对战", source: "MCP" },
    { region: "海外", name: "嗨嗨人生2", publisher: "Squanch Games", studio: "Squanch Games", releaseDate: "2026/2/13", platforms: "PC+PS5+Xbox", heat: "中低", heatNote: "会说话的枪FPS续作", gameplay: "喜剧第一人称射击", source: "MCP" },
    { region: "海外", name: "生灵重塑/REANIMAL", publisher: "任天堂", studio: "/", releaseDate: "2026/2/13", platforms: "Switch2", heat: "低", heatNote: "任天堂新IP", gameplay: "冒险解谜", source: "MCP" },
    { region: "海外", name: "冥河:贪婪之刃", publisher: "Focus Entertainment", studio: "/", releaseDate: "2026/2/19", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "", gameplay: "潜行动作RPG", source: "MCP" },
    { region: "海外", name: "生化危机9：安魂曲", publisher: "卡普空", studio: "/", releaseDate: "2026/2/27", platforms: "PC+PS5+Xbox+Switch2", heat: "中高", heatNote: "首周销量500万", gameplay: "恐怖生存动作冒险", source: "MCP" },
    { region: "海外", name: "宝可梦 Pokopia", publisher: "任天堂", studio: "宝可梦公司", releaseDate: "2026/3/5", platforms: "Switch2", heat: "中", heatNote: "宝可梦IP新衍生作", gameplay: "宝可梦模拟经营", source: "MCP" },
    { region: "海外", name: "杀戮尖塔2（Slay the Spire 2）", publisher: "Mega Crit Games", studio: "Mega Crit", releaseDate: "2026/3/5", platforms: "PC", heat: "中", heatNote: "前作Steam好评如潮，EA版大获成功", gameplay: "Roguelike卡牌构筑", source: "网络搜索" },
    { region: "海外", name: "失落星船：马拉松", publisher: "索尼/Bungie", studio: "Bungie", releaseDate: "2026/3/6", platforms: "PC+PS5+Xbox", heat: "中高", heatNote: "Bungie被索尼收购后首款新作", gameplay: "团队撤离射击PvPvE", source: "MCP" },
    { region: "海外", name: "贪婪之秋2", publisher: "Spiders", studio: "/", releaseDate: "2026/3/11", platforms: "PC+PS5+Xbox", heat: "低", heatNote: "前作销量200万", gameplay: "沉浸叙事型RPG", source: "MCP" },
    { region: "海外", name: "零～红蝶～REMAKE～", publisher: "光荣特库摩", studio: "/", releaseDate: "2026/3/12", platforms: "PC+Switch2+PS5+Xbox", heat: "低", heatNote: "经典恐怖IP重制", gameplay: "和风恐怖冒险", source: "MCP" },
    { region: "海外", name: "怪物猎人物语3", publisher: "卡普空", studio: "/", releaseDate: "2026/3/13", platforms: "PC+Switch+PS5", heat: "中高", heatNote: "怪猎IP，系列销量1亿500万", gameplay: "ARPG+怪物收服", source: "MCP" },
    { region: "海外", name: "MLB The Show 26", publisher: "EA/San Diego Studios", studio: "San Diego Studios", releaseDate: "2026/3/17", platforms: "PC+Switch+PS5+Xbox", heat: "中低", heatNote: "美国职棒官方授权", gameplay: "棒球模拟运动", source: "网络搜索" },
    { region: "海外", name: "死亡搁浅2：冥滩之上（PC版）", publisher: "小岛工作室", studio: "/", releaseDate: "2026/3/19", platforms: "PC", heat: "中低", heatNote: "PS端首周140万", gameplay: "开放世界送货冒险", source: "MCP" },
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
    if (dateStr.includes('2027')) return 'y2027';
    
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
        'y2027': { label: '2027年', icon: '🔮', games: [] },
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
            const regionTag = g.region === '国内' 
                ? '<span class="region-tag region-domestic">🇨🇳 国内</span>' 
                : '<span class="region-tag region-overseas">🌍 海外</span>';
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
                        ${regionTag}
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
                    <div class="detail-row">
                        <span class="detail-label">📂 数据来源</span>
                        <span class="detail-value">${g.source || '腾讯文档MCP'}</span>
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
        const regionTag = g.region === '国内' 
            ? '<span class="region-tag region-domestic">🇨🇳 国内</span>' 
            : '<span class="region-tag region-overseas">🌍 海外</span>';
        const cardId = `released-${idx}`;

        html += `
        <div class="timeline-game-card timeline-card-released ${heatCls}" id="${cardId}" onclick="toggleCardDetail('${cardId}')">
            <div class="timeline-game-header">
                <div class="timeline-game-name">
                    ${regionFlag} ${g.name}
                    ${regionTag}
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
