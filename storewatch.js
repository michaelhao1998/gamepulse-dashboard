// ============================================================
// StoreWatch — PS & Xbox 商店资源监控 Tab
// 数据来源：腾讯文档 LXXdrpHEWcSr (sheet BB08J2 + xsejuk)
// 更新频率：工作日每天中午 12:00
// ============================================================

// ============ 元数据 ============
const storewatchMeta = {
    lastUpdated: '2026-03-17',
    dataRange: '2025-12-19 ~ 2026-03-16',
    sheetId: 'LXXdrpHEWcSr',
    mainSheet: 'BB08J2',
    vendorSheet: 'xsejuk',
    platforms: ['PS5', 'Xbox'],
    regions: ['美国', '日本', '香港'],
    schedule: '工作日每天 12:00',
};

// ============ 资源位价值排序（Xbox归并后3组） ============
const storewatchSlotPriority = {
    PS5: [
        { name: 'Must See', tier: 1, label: '🏆 顶级推荐位', color: '#003087' },
        { name: 'Top games in your country', tier: 2, label: '🔥 区域热门', color: '#0070d1' },
        { name: "What's hot", tier: 3, label: '📈 热门趋势', color: '#00bfff' },
    ],
    Xbox: [
        { name: 'Dash home-banner', tier: 1, label: '🏆 主界面Banner', subSlots: ['Dash home-banner', 'Dash home-banner2'], color: '#107c10' },
        { name: 'Store Home-banner', tier: 2, label: '🛒 商店Banner', subSlots: ['Store Home-banner', 'Store Home-hero banner'], color: '#0e7a0d' },
        { name: 'Game Home-banner', tier: 3, label: '🎮 游戏Banner', subSlots: ['Game Home-banner', 'Game Home-hero banner'], color: '#2d7d2d' },
    ],
};

// Xbox 原始资源位到归并组的映射
const xboxSlotGroupMap = {
    'Dash home-banner': 'Dash home-banner',
    'Dash home-banner2': 'Dash home-banner',
    'Store Home-hero banner': 'Store Home-banner',
    'Store Home-banner': 'Store Home-banner',
    'Game Home-hero banner': 'Game Home-banner',
    'Game Home-banner': 'Game Home-banner',
};

// ============ 厂商对照表（基于腾讯文档 xsejuk 产品对照表） ============
// 格式：游戏名 → 厂商/发行商（与腾讯文档"中文名（英文名）"格式对齐）
const storewatchVendorMap = {
    // === 腾讯文档 xsejuk 原始映射（中文名（英文名）格式） ===
    "怪物猎人:荒野（Monster Hunter Wilds）": "CAPCOM",
    "死亡搁浅2:冥滩之上（Death Stranding 2:On the Beach）": "小岛工作室",
    "分裂虚构（Split Fiction）": "EA",
    "GT赛车7（Gran Turismo 7）": "索尼",
    "游戏王 Early Access（Yu-Gi-Oh! Early Access）": "KONAMI",
    "文明7（Sid Meier's Civilization VII）": "2K",
    "刺客信条:影（Assassin's Creed Shadows）": "育碧",
    "如龙:海盗 在夏威夷嗨翻天（Like a Dragon: Pirate Yakuza in Hawaii）": "世嘉",
    "真·三国无双 起源（Dynasty Warriors: Origins）": "光荣",
    "天国：拯救2（Kingdom Come: Deliverance II）": "Deep Silver",
    "狙击精英:反抗（Sniper Elite: Resistance）": "Rebellion",
    "宣誓（Avowed）": "微软",
    "模拟人生4（The Sims 4）": "EA",
    "恒星之刃（Stellar Blade）": "索尼",
    "命运2（Destiny 2）": "Bungie",
    "黎明杀机（Dead by Daylight）": "Behaviour",
    "守望先锋2（Overwatch 2）": "暴雪",
    "漫威争锋（Marvel Rivals）": "网易",
    "使命召唤:黑色行动6（Call of Duty: Black Ops 6）": "微软",
    "幻兽帕鲁（Palworld）": "Pocketpair",
    "艾尔登法环（Elden Ring）": "万代南梦宫",
    "霍格沃茨之遗（Hogwarts Legacy）": "华纳",
    "博德之门3（Baldur's Gate 3）": "拉瑞安",
    "最终幻想VII Rebirth（Final Fantasy VII Rebirth）": "SE",
    "铁拳8（Tekken 8）": "万代南梦宫",
    "街头霸王6（Street Fighter 6）": "CAPCOM",
    "龙珠电光炸裂!零（Dragon Ball: Sparking! Zero）": "万代南梦宫",
    "战神:诸神黄昏（God of War Ragnarök）": "索尼",
    "对马岛之魂（Ghost of Tsushima）": "索尼",
    "绝地潜兵2（Helldivers 2）": "索尼",
    "最后生还者 Part II 重制版（The Last of Us Part II Remastered）": "索尼",
    "地平线:西之绝境（Horizon Forbidden West）": "索尼",
    "蜘蛛侠2（Spider-Man 2）": "索尼",
    "宇宙机器人（Astro Bot）": "索尼",
    "匹诺曹的谎言（Lies of P）": "Neowiz",
    "星球大战:亡命之徒（Star Wars Outlaws）": "育碧",
    "黑神话:悟空（Black Myth: Wukong）": "游戏科学",
    "战锤40K:星际战士2（Warhammer 40,000: Space Marine 2）": "Focus",
    "寂静岭2（Silent Hill 2）": "KONAMI",
    "龙腾世纪:帷幕守护者（Dragon Age: The Veilguard）": "EA",
    "印第安纳·琼斯与大圆环（Indiana Jones and the Great Circle）": "微软",
    "流放之路2（Path of Exile 2）": "GGG",
    "哈迪斯II（Hades II）": "Supergiant",
    "潜行者2（S.T.A.L.K.E.R. 2）": "GSC",
    "暗喻幻想（Metaphor: ReFantazio）": "Atlus",
    "原神（Genshin impact）": "米哈游",
    "崩坏:星穹铁道（Honkai:StarRail）": "米哈游",
    "鸣潮（Wuthering Waves）": "米哈游",
    "绝区零（Zenless Zone Zero）": "米哈游",
    "无限暖暖（Infinity Nikki）": "叠纸",
    // === 英文名直接映射（兼容旧数据） ===
    "Monster Hunter Wilds": "CAPCOM",
    "DEATH STRANDING 2: ON THE BEACH": "小岛工作室",
    "Split Fiction": "EA",
    "Gran Turismo 7": "索尼",
    "Yu-Gi-Oh! Early Access": "KONAMI",
    "Sid Meier's Civilization VII": "2K",
    "Assassin's Creed Shadows": "育碧",
    "Like a Dragon: Pirate Yakuza in Hawaii": "世嘉",
    "Dynasty Warriors: Origins": "光荣",
    "Kingdom Come: Deliverance II": "Deep Silver",
    "Sniper Elite: Resistance": "Rebellion",
    "Avowed": "微软",
    "The Sims 4": "EA",
    "Stellar Blade": "索尼",
    "Destiny 2": "Bungie",
    "Dead by Daylight": "Behaviour",
    "Overwatch 2": "暴雪",
    "Marvel Rivals": "网易",
    "Call of Duty: Black Ops 6": "微软",
    "Palworld": "Pocketpair",
    "Elden Ring": "万代南梦宫",
    "Hogwarts Legacy": "华纳",
    "Baldur's Gate 3": "拉瑞安",
    "Final Fantasy VII Rebirth": "SE",
    "Tekken 8": "万代南梦宫",
    "Street Fighter 6": "CAPCOM",
    "Dragon Ball: Sparking! Zero": "万代南梦宫",
    "God of War Ragnarök": "索尼",
    "Ghost of Tsushima": "索尼",
    "Helldivers 2": "索尼",
    "The Last of Us Part II Remastered": "索尼",
    "Horizon Forbidden West": "索尼",
    "Spider-Man 2": "索尼",
    "Astro Bot": "索尼",
    "Lies of P": "Neowiz",
    "Star Wars Outlaws": "育碧",
    "Black Myth: Wukong": "游戏科学",
    "Warhammer 40,000: Space Marine 2": "Focus",
    "Silent Hill 2": "KONAMI",
    "Dragon Age: The Veilguard": "EA",
    "Indiana Jones and the Great Circle": "微软",
    "Path of Exile 2": "GGG",
    "Hades II": "Supergiant",
    "S.T.A.L.K.E.R. 2": "GSC",
    "Metaphor: ReFantazio": "Atlus",
    // === 中文名直接映射 ===
    "使命召唤:黑色行动7": "微软",
    "堡垒之夜": "Epic",
    "Roblox": "Roblox",
    "FC 25": "EA",
    "Fortnite": "Epic",
    "GTA Online": "Rockstar",
    "NBA 2K25": "2K",
    "Minecraft": "微软",
    "Apex Legends": "EA",
    "Diablo IV": "暴雪",
    "生化危机:安魂曲": "CAPCOM",
    "失落星船:马拉松": "Bungie",
    "WWE 2K26": "2K",
    "战地风云6": "EA",
    "刺客信条:影": "育碧",
    "原神": "米哈游",
    "崩坏:星穹铁道": "米哈游",
    "鸣潮": "米哈游",
    "绝区零": "米哈游",
    "无限暖暖": "叠纸",
};

// ============ 中英文游戏名称对照表（基于腾讯文档 xsejuk 原始格式） ============
// 腾讯文档原始格式为"中文名（英文名）"，本表提供双向映射
const storewatchGameNameMap = {
    // === 英文名 → 中文名 ===
    "Call of Duty: Black Ops 6": "使命召唤:黑色行动6",
    "Fortnite": "堡垒之夜",
    "Roblox": "Roblox",
    "FC 25": "EA FC 25",
    "GTA Online": "GTA Online",
    "NBA 2K25": "NBA 2K25",
    "Minecraft": "我的世界",
    "Apex Legends": "Apex英雄",
    "Diablo IV": "暗黑破坏神IV",
    "Monster Hunter Wilds": "怪物猎人:荒野",
    "DEATH STRANDING 2: ON THE BEACH": "死亡搁浅2:冥滩之上",
    "Death Stranding 2:On the Beach": "死亡搁浅2:冥滩之上",
    "Split Fiction": "分裂虚构",
    "Gran Turismo 7": "GT赛车7",
    "Yu-Gi-Oh! Early Access": "游戏王 Early Access",
    "Sid Meier's Civilization VII": "文明7",
    "Assassin's Creed Shadows": "刺客信条:影",
    "Like a Dragon: Pirate Yakuza in Hawaii": "如龙:海盗 在夏威夷嗨翻天",
    "Dynasty Warriors: Origins": "真·三国无双 起源",
    "Kingdom Come: Deliverance II": "天国:拯救2",
    "Sniper Elite: Resistance": "狙击精英:反抗",
    "Avowed": "宣誓",
    "The Sims 4": "模拟人生4",
    "Stellar Blade": "恒星之刃",
    "Destiny 2": "命运2",
    "Dead by Daylight": "黎明杀机",
    "Overwatch 2": "守望先锋2",
    "Marvel Rivals": "漫威争锋",
    "Palworld": "幻兽帕鲁",
    "Elden Ring": "艾尔登法环",
    "Hogwarts Legacy": "霍格沃茨之遗",
    "Baldur's Gate 3": "博德之门3",
    "Final Fantasy VII Rebirth": "最终幻想VII Rebirth",
    "Tekken 8": "铁拳8",
    "Street Fighter 6": "街头霸王6",
    "Dragon Ball: Sparking! Zero": "龙珠电光炸裂!零",
    "God of War Ragnarök": "战神:诸神黄昏",
    "Ghost of Tsushima": "对马岛之魂",
    "Helldivers 2": "绝地潜兵2",
    "The Last of Us Part II Remastered": "最后生还者 Part II 重制版",
    "Horizon Forbidden West": "地平线:西之绝境",
    "Spider-Man 2": "蜘蛛侠2",
    "Astro Bot": "宇宙机器人",
    "Lies of P": "匹诺曹的谎言",
    "Star Wars Outlaws": "星球大战:亡命之徒",
    "Black Myth: Wukong": "黑神话:悟空",
    "Warhammer 40,000: Space Marine 2": "战锤40K:星际战士2",
    "Silent Hill 2": "寂静岭2",
    "Dragon Age: The Veilguard": "龙腾世纪:帷幕守护者",
    "Indiana Jones and the Great Circle": "印第安纳·琼斯与大圆环",
    "Path of Exile 2": "流放之路2",
    "Hades II": "哈迪斯II",
    "S.T.A.L.K.E.R. 2": "潜行者2",
    "Metaphor: ReFantazio": "暗喻幻想",
    "WWE 2K26": "WWE 2K26",
    "Genshin impact": "原神",
    "Wuthering Waves": "鸣潮",
    "Honkai:StarRail": "崩坏:星穹铁道",
    "Zenless Zone Zero": "绝区零",
    "Infinity Nikki": "无限暖暖",
    // === 中文名 → 英文名（反向映射） ===
    "使命召唤:黑色行动7": "Call of Duty: Black Ops 7",
    "堡垒之夜": "Fortnite",
    "生化危机:安魂曲": "Resident Evil: Requiem",
    "失落星船:马拉松": "Marathon",
    "战地风云6": "Battlefield 6",
    "刺客信条:影": "Assassin's Creed Shadows",
    "原神": "Genshin Impact",
    "崩坏:星穹铁道": "Honkai: Star Rail",
    "鸣潮": "Wuthering Waves",
    "绝区零": "Zenless Zone Zero",
    "无限暖暖": "Infinity Nikki",
};

// ============ 非游戏分类标签（灰色字体内容）============
const storewatchNonGameTags = [
    '优惠活动', '游戏专题', '榜单热门', '平台服务',
    '会员订阅', '新品预告', '赛事活动', '硬件推广',
    'DLC/更新', '免费游戏推荐'
];

// ============ 商店监控数据 ============
// 数据来源：腾讯文档 LXXdrpHEWcSr (sheet BB08J2)
// 最后更新：2026-03-17
// 数据范围：2025-12-19 ~ 2026-03-16
const storewatchData = {
    PS5: [
        { date: '2026-03-16', slots: {
            'Must See': { positions: [
                { rank: 1, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '人中之龙游戏专题', hk: '生化危机:安魂曲（Resident Evil: Requiem）', jpNonGame: true },
                { rank: 1, us: '七大罪:起源（The Seven Deadly Sins:Origin）', jp: '七大罪:起源（The Seven Deadly Sins:Origin）', hk: '七大罪:起源（The Seven Deadly Sins:Origin）' },
                { rank: 2, us: 'WWE 2K26', jp: '1500日元以下（games under 円1500）', hk: '热门优惠' },
                { rank: 2, us: 'WWE 2K26', jp: '人中之龙游戏专题', hk: '生化危机:安魂曲（Resident Evil: Requiem）', jpNonGame: true },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '侠盗猎车手6（Grand Theft Auto VI）' },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '1500日元以下（games under 円1500）', hk: '热门优惠' },
                { rank: 4, us: 'MEGA MARCH', jp: '美国职业棒球大联盟26（MLB The Show 26）', hk: '战神:斯巴达之子（God of War: Sons of Sparta）' },
                { rank: 4, us: '红色沙漠（Crimson Desert）', jp: '美国职业棒球大联盟26（MLB The Show 26）', hk: '侠盗猎车手6（Grand Theft Auto VI）' },
                { rank: 5, us: '红色沙漠（Crimson Desert）', jp: '2026绝佳游戏（2026 GREAT GAMES）', hk: 'ARC Raiders', jpNonGame: true },
                { rank: 5, us: 'MEGA MARCH', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '美国职业棒球大联盟26（MLB The Show 26）' },
                { rank: 6, us: '15美元以下（games under $15）', jp: 'MEGA MARCH', hk: '合家欢游戏专题', usNonGame: true, hkNonGame: true },
                { rank: 6, us: '15美元以下（games under $15）', jp: '2026绝佳游戏（2026 GREAT GAMES）', hk: '战神:斯巴达之子（God of War: Sons of Sparta）', usNonGame: true, jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '红色沙漠（Crimson Desert）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: 'Apex英雄（Apex Legends）' },
                { rank: 1, us: '红色沙漠（Crimson Desert）', jp: '堡垒之夜（Fortnite）', hk: 'Apex英雄（Apex Legends）' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: 'Apex英雄（Apex Legends）', hk: '暗黑破坏神4（Diablo IV）' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '暗黑破坏神4（Diablo IV）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: 'Apex英雄（Apex Legends）', hk: '实况足球（eFootball）' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', hk: '实况足球（eFootball）' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 5, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '原神（Genshin impact）', hk: '跑车浪漫旅7（Gran Turismo 7）' },
                { rank: 5, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', hk: '跑车浪漫旅7（Gran Turismo 7）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '毒液突击队（John Carpenter\'s Toxic Commando）', jp: '堡垒之夜（Fortnite）', hk: '侠盗猎车手5（Grand Theft Auto V）' },
                { rank: 1, us: '侠盗猎车手5（Grand Theft Auto V）', jp: '赛马大亨10（Winning Post 10 2026）', hk: '侠盗猎车手5（Grand Theft Auto V）' },
                { rank: 2, us: '侠盗猎车手5（Grand Theft Auto V）', jp: '首都高赛车（Shutokou Battle）', hk: '三角洲行动（Delta Force）' },
                { rank: 2, us: '羊蹄山之魂（Ghost of Yōtei）', jp: '侠盗猎车手5（Grand Theft Auto V）', hk: '破碎怪谈:恶意取关（BrokenLore UNFOLLOW）' },
                { rank: 3, us: '007:锋芒初露（007 First Light）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '寂静岭2（Silent Hill 2）' },
                { rank: 3, us: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '三角洲行动（Delta Force）' },
                { rank: 4, us: '七大罪:起源（The Seven Deadly Sins:Origin）', jp: '七大罪:起源（The Seven Deadly Sins:Origin）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 4, us: '毒液突击队（John Carpenter\'s Toxic Commando）', jp: '七大罪:起源（The Seven Deadly Sins:Origin）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: '羊蹄山之魂（Ghost of Yōtei）', jp: '侠盗猎车手5（Grand Theft Auto V）', hk: '破碎怪谈:恶意取关（BrokenLore UNFOLLOW）' },
                { rank: 5, us: '007:锋芒初露（007 First Light）', jp: '首都高赛车（Shutokou Battle）', hk: '跑车浪漫旅7（Gran Turismo 7）' },
                { rank: 6, us: '贪婪之秋2:垂死世界（GreedFall: The Dying World）', jp: '赛马大亨10（Winning Post 10 2026）', hk: '跑车浪漫旅7（Gran Turismo 7）' },
                { rank: 6, us: '贪婪之秋2:垂死世界（GreedFall: The Dying World）', jp: '堡垒之夜（Fortnite）', hk: '寂静岭2（Silent Hill 2）' },
            ] },
        } },
        { date: '2026-03-13', slots: {
            'Must See': { positions: [
                { rank: 1, us: '明日方舟:终末地（Arknights: Endfield）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '明日方舟:终末地（Arknights: Endfield）' },
                { rank: 2, us: 'MEGA MARCH', jp: '人中之龙游戏专题', hk: '生化危机:安魂曲（Resident Evil: Requiem）', jpNonGame: true },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '侠盗猎车手6（Grand Theft Auto VI）' },
                { rank: 4, us: '红色沙漠（Crimson Desert）', jp: '美国职业棒球大联盟26（MLB The Show 26）', hk: '热门优惠' },
                { rank: 5, us: '失落星船:马拉松（Marathon）', jp: 'WWE 2K26', hk: '战神:斯巴达之子（God of War: Sons of Sparta）' },
                { rank: 6, us: 'ARC Raiders', jp: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', hk: '美国职业棒球大联盟26（MLB The Show 26）' },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生��危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', hk: 'Apex英雄（Apex Legends）' },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: 'Apex英雄（Apex Legends）', hk: '实况足球（eFootball）' },
                { rank: 5, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: 'EA Sports FC 26' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '侠盗猎车手5（Grand Theft Auto V）', jp: '赛马大亨10（Winning Post 10 2026）', hk: '2026绝佳游戏（2026 GREAT GAMES）', hkNonGame: true },
                { rank: 2, us: '毒液突击队（John Carpenter\'s Toxic Commando）', jp: '首都高赛车（Shutokou Battle）', hk: '鬼灭之刃:火之神血风谭2（Demon Slayer: Kimetsu no Yaiba – The Hinokami Chronicles 2）' },
                { rank: 3, us: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）', jp: '武士题材游戏专题', hk: '第一后裔（THE FIRST DESCENDANT）' },
                { rank: 4, us: '007:锋芒初露（007 First Light）', jp: '堡垒之夜（Fortnite）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: '羊蹄山之魂（Ghost of Yōtei）', jp: '侠盗猎车手5（Grand Theft Auto V）', hk: '破碎怪谈:恶意取关（BrokenLore UNFOLLOW）' },
                { rank: 6, us: '鬼灭之刃:火之神血风谭2（Demon Slayer: Kimetsu no Yaiba – The Hinokami Chronicles 2）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '寂静岭2（Silent Hill 2）' },
            ] },
        } },
        { date: '2026-03-12', slots: {
            'Must See': { positions: [
                { rank: 1, us: '明日方舟:终末地（Arknights: Endfield）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '明日方舟:终末地（Arknights: Endfield��' },
                { rank: 2, us: 'MEGA MARCH', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '度假模式游戏专题', hk: '战神:斯巴达之子（God of War: Sons of Sparta）' },
                { rank: 4, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '人中之龙游戏专题', hk: '侠盗猎车手6（Grand Theft Auto VI）', jpNonGame: true },
                { rank: 5, us: 'WWE 2K26', jp: 'Apex英雄（Apex Legends）', hk: '漫威金刚狼（Marvel\'s Wolverine）' },
                { rank: 6, us: '优惠狂热（DEALMANIA）', jp: '美国职业棒球大联盟26（MLB The Show 26）', hk: '仁王3（NIOH 3）', usNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', hk: 'Apex英雄（Apex Legends）' },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '实况足球（eFootball）' },
                { rank: 5, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: 'Apex英雄（Apex Legends）', hk: 'EA Sports FC 26' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '侠盗猎车手5（Grand Theft Auto V）', jp: '度假模式游戏专题', hk: '度假模式游戏专题' },
                { rank: 2, us: '007:锋芒初露（007 First Light）', jp: '羊蹄山之魂（Ghost of Yōtei）', hk: '羊蹄山之魂（Ghost of Yōtei）' },
                { rank: 3, us: '宣誓（Avowed）', jp: '零红蝶', hk: '鬼��之刃:火之神血风谭2（Demon Slayer: Kimetsu no Yaiba – The Hinokami Chronicles 2）' },
                { rank: 4, us: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', jp: '赛马大亨10（Winning Post 10 2026）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', jp: '首都高赛车（Shutokou Battle）', hk: '破碎怪谈:恶意取关（BrokenLore UNFOLLOW）' },
                { rank: 6, us: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）', jp: '数码宝贝物语:时空异客（Digimon Story: Time Stranger）', hk: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）' },
            ] },
        } },
        { date: '2026-03-11', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'WWE 2K26', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '优惠狂热（DEALMANIA）', hkNonGame: true },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: 'Apex英雄（Apex Legends）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: '优惠狂热（DEALMANIA）', jp: 'NBA 2K26', hk: '战神:斯巴达之子（God of War: Sons of Sparta）', usNonGame: true },
                { rank: 4, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '优惠狂热（DEALMANIA）', hk: '侠盗猎车手6（Grand Theft Auto VI）', jpNonGame: true },
                { rank: 5, us: '20美元以下（games under $20）', jp: '人中之龙游戏专题', hk: '漫威金刚狼（Marvel\'s Wolverine）', usNonGame: true, jpNonGame: true },
                { rank: 6, us: '红色沙漠（Crimson Desert）', jp: '1500日元以下（games under 円1500）', hk: 'ARC Raiders', jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: 'Apex英雄（Apex Legends）', hk: '实况足球（eFootball）' },
                { rank: 4, us: '罗布乐思（Roblox）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '机动战士高达 激战任务2（MOBILE SUIT GUNDAMBATTLE OPERATION 2）' },
                { rank: 5, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '原神（Genshin impact）', hk: '仁王3（NIOH 3）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '侠盗猎车手5（Grand Theft Auto V）', jp: '消逝的光芒（Dying Light）', hk: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）' },
                { rank: 2, us: '宣誓（Avowed）', jp: '极速滑板（skate）', hk: '消逝的光芒（Dying Light）' },
                { rank: 3, us: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '鬼灭之刃:火之神血风谭2（Demon Slayer: Kimetsu no Yaiba – The Hinokami Chronicles 2）' },
                { rank: 4, us: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', jp: '赛马大亨10（Winning Post 10 2026）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: '007:锋芒初露（007 First Light）', jp: '首都高赛车（Shutokou Battle）', hk: '跑车浪漫旅7（Gran Turismo 7）' },
                { rank: 6, us: '幻兽帕鲁（Palworld）', jp: '零红蝶', hk: '第一后裔（THE FIRST DESCENDANT）' },
            ] },
        } },
        { date: '2026-03-10', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'WWE 2K26', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '优惠狂热（DEALMANIA）', hkNonGame: true },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '优惠狂热（DEALMANIA）', hk: '生化危机:安魂曲（Resident Evil: Requiem）', jpNonGame: true },
                { rank: 3, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '2000日元以下（games under 円2000）', hk: '战神:斯巴达之子（God of War: Sons of Sparta）', jpNonGame: true },
                { rank: 4, us: '优惠狂热（DEALMANIA）', jp: '人中之龙游戏专题', hk: '热门优惠', isNonGame: true },
                { rank: 5, us: '20美元以下（games under $20）', jp: '美国职业棒球大联盟26（MLB The Show 26）', hk: 'Saros', usNonGame: true },
                { rank: 6, us: 'ARC Raiders', jp: '失落星船:马拉松（Marathon）', hk: '漫威金刚狼（Marvel\'s Wolverine）' },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: 'Apex英雄（Apex Legends）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '实况足球（eFootball）' },
                { rank: 4, us: '失落星船:马拉松（Marathon）', jp: '鸣潮（Wuthering Waves）', hk: '双影奇境（Split Fiction）' },
                { rank: 5, us: '彩虹六号:围攻X（Tom Clancy\'s Rainbow Six Siege X）', jp: '原神（Genshin impact）', hk: '机动战士高达 激战任务2（MOBILE SUIT GUNDAMBATTLE OPERATION 2）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '侠盗猎车手5（Grand Theft Auto V）', jp: '首都高赛车（Shutokou Battle）', hk: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）' },
                { rank: 2, us: '宣誓（Avowed）', jp: '零红蝶', hk: '破碎怪谈:恶意取关（BrokenLore UNFOLLOW）' },
                { rank: 3, us: '生灵重塑（Reanimal）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: '跑车浪漫旅7（Gran Turismo 7）' },
                { rank: 4, us: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', jp: '赛马大亨10（Winning Post 10 2026）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: '幻兽帕鲁（Palworld）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '三角洲行动（Delta Force）' },
                { rank: 6, us: '007:锋芒初露（007 First Light）', jp: '宣誓（Avowed）', hk: '第一后裔（THE FIRST DESCENDANT）' },
            ] },
        } },
        { date: '2026-03-09', slots: {
            'Must See': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 2, us: 'WWE 2K26', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '2000日元以下（games under 円2000）', hk: '优惠狂热（DEALMANIA）', jpNonGame: true, hkNonGame: true },
                { rank: 4, us: '20美元以下（games under $20）', jp: '优惠狂热（DEALMANIA）', hk: '热门优惠', isNonGame: true },
                { rank: 5, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '人中之龙游戏专题', hk: '战神:斯巴达之子（God of War: Sons of Sparta）', jpNonGame: true },
                { rank: 6, us: 'ARC Raiders', jp: '伊苏X -诺曼荣光-（Ys X: Nordics）', hk: '侠盗猎车手6（Grand Theft Auto VI）' },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '首都高赛车（Shutokou Battle）', hk: '生灵重塑（Reanimal）' },
                { rank: 3, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '实况足球（eFootball）' },
                { rank: 5, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: 'Apex英雄（Apex Legends）', hk: '绝区零（Zenless Zone Zero）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '侠盗猎车手5（Grand Theft Auto V）', jp: '赛马大亨10（Winning Post 10 2026）', hk: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）' },
                { rank: 2, us: '幻兽帕鲁（Palworld）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）', jp: '宣誓（Avowed）', hk: '007:锋芒初露（007 First Light）' },
                { rank: 4, us: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', jp: '首都高赛车（Shutokou Battle）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: '宣誓（Avowed）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: '破碎怪谈:恶意取关（BrokenLore UNFOLLOW）' },
                { rank: 6, us: '007:锋芒初露（007 First Light）', jp: '零红蝶', hk: '鬼灭之刃:火之神血风谭2（Demon Slayer: Kimetsu no Yaiba – The Hinokami Chronicles 2）' },
            ] },
        } },
        { date: '2026-03-06', slots: {
            'Must See': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 2, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 3, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 4, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 5, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 6, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: 'WWE 2K26', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生灵重塑（Reanimal）' },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '实况足球（eFootball）' },
                { rank: 5, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '原神（Genshin impact）', hk: '绝区零（Zenless Zone Zero）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '宣誓（Avowed）', jp: '首都高赛车（Shutokou Battle）', hk: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）' },
                { rank: 2, us: '首都高赛车（Shutokou Battle）', jp: '赛马大亨10（Winning Post 10 2026）', hk: '007:锋芒初露（007 First Light）' },
                { rank: 3, us: '生灵重塑（Reanimal）', jp: '宣誓（Avowed）', hk: '街头霸王6（Street Fighter 6）' },
                { rank: 4, us: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', jp: '武士题材游戏专题', hk: 'PS5必玩游戏', jpNonGame: true, hkNonGame: true },
                { rank: 5, us: '侠盗猎车手5（Grand Theft Auto V）', jp: '盗贼之海（Sea of Thieves）', hk: '新游期待榜', hkNonGame: true },
                { rank: 6, us: '幻兽帕鲁（Palworld）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: '破碎怪谈:恶意取关（BrokenLore UNFOLLOW）' },
            ] },
        } },
        { date: '2026-03-05', slots: {
            'Must See': { positions: [
                { rank: 1, us: '战神:斯巴达之子（God of War: Sons of Sparta）', jp: '伊苏X -诺曼荣光-（Ys X: Nordics）', hk: '优惠狂热（DEALMANIA）', hkNonGame: true },
                { rank: 2, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 3, us: '优惠狂热（DEALMANIA）', jp: '丹生明里推荐游戏专题', hk: '热门优惠', isNonGame: true },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '战神:斯巴达之子（God of War: Sons of Sparta）', hk: 'Saros' },
                { rank: 5, us: '炫酷动作游戏专题（STYLISH ACTION）', jp: '优惠狂热（DEALMANIA）', hk: '生化危机:安魂曲（Resident Evil: Requiem）', usNonGame: true, jpNonGame: true },
                { rank: 6, us: 'PS5专享升级（UPGRADED FOR PS5）', jp: '人中之龙0:誓约的场所导演剪辑版（Yakuza 0 Director\'s Cut）', hk: '2026绝佳游戏（2026 GREAT GAMES）', usNonGame: true, hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: 'WWE 2K26', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生灵重塑（Reanimal）' },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '实况足球（eFootball）' },
                { rank: 5, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '原神（Genshin impact）', hk: '绝区零（Zenless Zone Zero）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '2026绝佳游戏（2026 GREAT GAMES）', jp: '2026绝佳游戏（2026 GREAT GAMES）', hk: '007:锋芒初露（007 First Light）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: '奇异人生:重聚（Life is Strange: Reunion）', jp: '奇异人生:重聚（Life is Strange: Reunion）', hk: '新游期待榜', hkNonGame: true },
                { rank: 3, us: '首都高赛车（Shutokou Battle）', jp: '逸剑风云决（Wandering Sword）', hk: '复古经典游戏专题', hkNonGame: true },
                { rank: 4, us: '幻兽帕鲁（Palworld）', jp: '幻兽帕鲁（Palworld）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: '动漫改编游戏专题', jp: '动漫改编游戏专题', hk: '破碎怪谈:恶意取关（BrokenLore UNFOLLOW）', usNonGame: true, jpNonGame: true },
                { rank: 6, us: '逸剑风云决（Wandering Sword）', jp: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', hk: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）' },
            ] },
        } },
        { date: '2026-03-04', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'WWE 2K26', jp: '丹生明里推荐游戏专题', hk: 'Saros', jpNonGame: true },
                { rank: 2, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 3, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: '人中之龙:极3（Yakuza 3 Remastere）', hk: '2026绝佳游戏（2026 GREAT GAMES）', hkNonGame: true },
                { rank: 4, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: '优惠狂热（DEALMANIA）', hkNonGame: true },
                { rank: 5, us: '2026绝佳游戏（2026 GREAT GAMES）', jp: '007:锋芒初露（007 First Light）', hk: '生化危机:安魂曲（Resident Evil: Requiem）', usNonGame: true },
                { rank: 6, us: '复古经典游戏专题', jp: '复古经典游戏专题', hk: '热门优惠', isNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: 'WWE 2K26', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '生灵重塑（Reanimal）' },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '首都高赛车（Shutokou Battle）', hk: '原神（Genshin impact）' },
                { rank: 5, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '实况足球（eFootball）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '幻兽帕鲁（Palworld）', jp: 'PlayStation5 5周年 特集', hk: '七大罪:起源（The Seven Deadly Sins:Origin）', jpNonGame: true },
                { rank: 2, us: 'Neva', jp: '彩虹六号:围攻X（Tom Clancy\'s Rainbow Six Siege X）', hk: '复古经典游戏专题', hkNonGame: true },
                { rank: 3, us: 'DEALS FOR YOU', jp: 'Neva', hk: '007:锋芒初露（007 First Light）', usNonGame: true },
                { rank: 4, us: '彩虹六号:围攻X（Tom Clancy\'s Rainbow Six Siege X）', jp: '武士题材游戏专题', hk: '红色沙漠（Crimson Desert）', jpNonGame: true },
                { rank: 5, us: '街头霸王6（Street Fighter 6）', jp: '幻兽帕鲁（Palworld）', hk: '破碎怪谈:恶意取关（BrokenLore UNFOLLOW）' },
                { rank: 6, us: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）', jp: 'WWE 2K26', hk: 'PS5必玩游戏', hkNonGame: true },
            ] },
        } },
        { date: '2026-03-03', slots: {
            'Must See': { positions: [
                { rank: 1, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: '人中之龙:极3（Yakuza 3 Remastere）', hk: '热门优惠', hkNonGame: true },
                { rank: 2, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 3, us: '战神:斯巴达之子（God of War: Sons of Sparta）', jp: '战神:斯巴达之子（God of War: Sons of Sparta）', hk: '优惠狂热（DEALMANIA）', hkNonGame: true },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 5, us: '堡垒之夜（Fortnite）', jp: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', hk: '战神:斯巴达之子（God of War: Sons of Sparta）' },
                { rank: 6, us: '原神（Genshin impact）', jp: '堡垒之夜（Fortnite）', hk: 'PS5必玩游戏', hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: 'WWE 2K26', jp: '首都高赛车（Shutokou Battle）', hk: '生灵重塑（Reanimal）' },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '原神（Genshin impact）' },
                { rank: 5, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '鸣潮（Wuthering Waves）', hk: '实况足球（eFootball）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '无限暖暖（Infinity Nikki）', jp: '黎明杀机（Dead by Daylight）', hk: '���限暖暖（Infinity Nikki）' },
                { rank: 2, us: '第一后裔（THE FIRST DESCENDANT）', jp: '无限暖暖（Infinity Nikki）', hk: '第一后裔（THE FIRST DESCENDANT）' },
                { rank: 3, us: 'DEALS FOR YOU', jp: '麦登橄榄球26（MaddenNFL26）', hk: 'DEALS FOR YOU', usNonGame: true, hkNonGame: true },
                { rank: 4, us: '黎明杀机（Dead by Daylight）', jp: '侠盗猎车手6（Grand Theft Auto VI）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: '麦登橄榄球26（MaddenNFL26）', jp: '死或生6（DEAD OR ALIVE 6）', hk: '三角洲行动（Delta Force）' },
                { rank: 6, us: '崩坏:星穹铁道（Honkai: Star Rail）', jp: '第一后裔（THE FIRST DESCENDANT）', hk: '红色沙漠（Crimson Desert）' },
            ] },
        } },
        { date: '2026-03-02', slots: {
            'Must See': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 2, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', hk: '优惠狂热（DEALMANIA）', hkNonGame: true },
                { rank: 3, us: '战神:斯巴达之子（God of War: Sons of Sparta）', jp: '战神:斯巴达之子（God of War: Sons of Sparta）', hk: '热门优惠', hkNonGame: true },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '人气经典游戏', hk: '生化危机:安魂曲（Resident Evil: Requiem）', jpNonGame: true },
                { rank: 5, us: 'WWE 2K26', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 6, us: '漫威金刚狼（Marvel\'s Wolverine）', jp: '人中之龙:极3（Yakuza 3 Remastere）', hk: '战神:斯巴达之子（God of War: Sons of Sparta）' },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '生灵重塑（Reanimal）' },
                { rank: 3, us: 'WWE 2K26', jp: '首都高赛车（Shutokou Battle）', hk: '原神（Genshin impact）' },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '实况足球（eFootball）' },
                { rank: 5, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '鸣潮（Wuthering Waves）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '黎明杀机（Dead by Daylight）', jp: '侠盗猎车手6（Grand Theft Auto VI）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 2, us: '麦登橄榄球26（MaddenNFL26）', jp: '第一后裔（THE FIRST DESCENDANT）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: 'DEALS FOR YOU', jp: '死或生6（DEAD OR ALIVE 6）', hk: '红色沙漠（Crimson Desert）', usNonGame: true },
                { rank: 4, us: '第一后裔（THE FIRST DESCENDANT）', jp: '黎明杀机（Dead by Daylight）', hk: '第一后裔（THE FIRST DESCENDANT）' },
                { rank: 5, us: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', jp: '麦登橄榄球26（MaddenNFL26）', hk: 'PS5专享升级（UPGRADED FOR PS5）', hkNonGame: true },
                { rank: 6, us: '鬼灭之刃:火之神血风谭2（Demon Slayer: Kimetsu no Yaiba – The Hinokami Chronicles 2）', jp: 'WWE 2K26', hk: '破碎怪谈:恶意取关（BrokenLore UNFOLLOW）' },
            ] },
        } },
        { date: '2026-02-27', slots: {
            'Must See': { positions: [
                { rank: 1, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 4, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 5, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: '战神:斯巴达之子（God of War: Sons of Sparta）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 6, us: '战神:斯巴达之子（God of War: Sons of Sparta）', jp: '2000日元以下（games under 円2000）', hk: '战神:斯巴达之子（God of War: Sons of Sparta）', jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '生灵重塑（Reanimal）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 4, us: '漫威争锋（Marvel Rivals）', jp: '首都高赛车（Shutokou Battle）', hk: 'NBA 2K26' },
                { rank: 5, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '鸣潮（Wuthering Waves）', hk: '实况足球（eFootball）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '黎明杀机（Dead by Daylight）', jp: '侠盗猎车手6（Grand Theft Auto VI）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 2, us: '鸣潮（Wuthering Waves）', jp: '第一后裔（THE FIRST DESCENDANT）', hk: '第一后裔（THE FIRST DESCENDANT）' },
                { rank: 3, us: 'DEALS FOR YOU', jp: '鸣潮（Wuthering Waves）', hk: '红色沙漠（Crimson Desert）', usNonGame: true },
                { rank: 4, us: '第一后裔（THE FIRST DESCENDANT）', jp: '黎明杀机（Dead by Daylight）', hk: '三角洲行动（Delta Force）' },
                { rank: 5, us: '动漫改编游戏专题', jp: '动漫改编游戏专题', hk: '在线多人游戏专题（ONLINE MULTIPLAYER）', isNonGame: true },
                { rank: 6, us: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', jp: '无法成眠的伊达键 - From AI:梦境档案（No Sleep For Kaname Date – From AI: The Somnium Files‌）', hk: '逸剑风云决（Wandering Sword）' },
            ] },
        } },
        { date: '2026-02-26', slots: {
            'Must See': { positions: [
                { rank: 1, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: '战神:斯巴达之子（God of War: Sons of Sparta）', hk: '战神:斯巴达之子（God of War: Sons of Sparta）' },
                { rank: 2, us: '战神:斯巴达之子（God of War: Sons of Sparta）', jp: '2000日元以下（games under 円2000）', hk: '生化危机:安魂曲（Resident Evil: Requiem）', jpNonGame: true },
                { rank: 3, us: '20美元以下（games under $20）', jp: '绯夜传奇Remastered（Tales of Berseria Remastered）', hk: '仁王3（NIOH 3）', usNonGame: true },
                { rank: 4, us: 'MARVEL Tōkon: Fighting Souls', jp: 'MARVEL Tōkon: Fighting Souls', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: 'WWE 2K26', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: 'PS5专享升级（UPGRADED FOR PS5）', hkNonGame: true },
                { rank: 6, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '原神（Genshin impact）', hk: '热门优惠', hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '生灵重塑（Reanimal）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '鸣潮（Wuthering Waves）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 4, us: '漫威争锋（Marvel Rivals）', jp: '原神（Genshin impact）', hk: 'NBA 2K26' },
                { rank: 5, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '实况足球（eFootball）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '黎明杀机（Dead by Daylight）', jp: '侠盗猎车手6（Grand Theft Auto VI）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 2, us: '第一后裔（THE FIRST DESCENDANT）', jp: '鸣潮（Wuthering Waves）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: 'DEALS FOR YOU', jp: '第一后裔（THE FIRST DESCENDANT）', hk: '鸣潮（Wuthering Waves）', usNonGame: true },
                { rank: 4, us: '鸣潮（Wuthering Waves）', jp: '黎明杀机（Dead by Daylight）', hk: '第一后裔（THE FIRST DESCENDANT）' },
                { rank: 5, us: '动漫改编游戏专题', jp: '动漫改编游戏专题', hk: '无法成眠的伊达键 - From AI:梦境档案（No Sleep For Kaname Date – From AI: The Somnium Files‌）', usNonGame: true, jpNonGame: true },
                { rank: 6, us: '鬼灭之刃:火之神血风谭2（Demon Slayer: Kimetsu no Yaiba – The Hinokami Chronicles 2）', jp: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）', hk: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）' },
            ] },
        } },
        { date: '2026-02-25', slots: {
            'Must See': { positions: [
                { rank: 1, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: '农历新年促销（Lunar New Year sale）', hk: '新春优惠', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: '战神:斯巴达之子（God of War: Sons of Sparta）', jp: '战神:斯巴达之子（God of War: Sons of Sparta）', hk: '战神:斯巴达之子（God of War: Sons of Sparta）' },
                { rank: 3, us: 'WWE 2K26', jp: '2000日元以下（games under 円2000）', hk: '生化危机:安魂曲（Resident Evil: Requiem）', jpNonGame: true },
                { rank: 4, us: 'MARVEL Tōkon: Fighting Souls', jp: 'MARVEL Tōkon: Fighting Souls', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: 'PS5专享升级（UPGRADED FOR PS5）', hkNonGame: true },
                { rank: 6, us: 'WWE 2K26', jp: 'SALE MANIA', hk: '仁王3（NIOH 3）', jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '生灵重塑（Reanimal）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: 'NBA 2K26' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '原神（Genshin impact）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 5, us: '漫威争锋（Marvel Rivals）', jp: '鸣潮（Wuthering Waves）', hk: '实况足球（eFootball）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '黎明杀机（Dead by Daylight）', jp: '侠盗猎车手6（Grand Theft Auto VI）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 2, us: '动漫改编游戏专题', jp: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）', hk: '逸剑风云决（Wandering Sword）', usNonGame: true },
                { rank: 3, us: 'DEALS FOR YOU', jp: '第一后裔（THE FIRST DESCENDANT）', hk: '红色沙漠（Crimson Desert）', usNonGame: true },
                { rank: 4, us: '第一后裔（THE FIRST DESCENDANT）', jp: '黎明杀机（Dead by Daylight）', hk: '第一后裔（THE FIRST DESCENDANT）' },
                { rank: 5, us: '鬼灭之刃:火之神血风谭2（Demon Slayer: Kimetsu no Yaiba – The Hinokami Chronicles 2）', jp: '动漫改编游戏专题', hk: '冒险家艾略特的千年奇谭（The Adventures of Elliot: The Millennium Tales）', jpNonGame: true },
                { rank: 6, us: '侠盗猎车手5（Grand Theft Auto V）', jp: 'WWE 2K26', hk: '破碎怪谈:恶意取关（BrokenLore UNFOLLOW）' },
            ] },
        } },
        { date: '2026-02-24', slots: {
            'Must See': { positions: [
                { rank: 1, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: '战神:斯巴达之子（God of War: Sons of Sparta）', hk: '新春优惠', hkNonGame: true },
                { rank: 2, us: '战神:斯巴达之子（God of War: Sons of Sparta）', jp: '农历新年促销（Lunar New Year sale）', hk: '热门优惠', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: 'MARVEL Tōkon: Fighting Souls', jp: 'MARVEL Tōkon: Fighting Souls', hk: '战神:斯巴达之子（God of War: Sons of Sparta）' },
                { rank: 4, us: 'WWE 2K26', jp: '1500日元以下（games under 円1500）', hk: 'PS5必玩游戏', jpNonGame: true, hkNonGame: true },
                { rank: 5, us: 'WWE 2K26', jp: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', hk: '暗黑破坏神4（Diablo IV）' },
                { rank: 6, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: 'PS5专享升级（UPGRADED FOR PS5）', hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '生灵重塑（Reanimal）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: 'NBA 2K26' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '原神（Genshin impact）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 5, us: '漫威争锋（Marvel Rivals）', jp: '鸣潮（Wuthering Waves）', hk: '实况足球（eFootball）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '黎明杀机（Dead by Daylight）', jp: '侠盗猎车手6（Grand Theft Auto VI）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 2, us: '动漫改编游戏专题', jp: '黎明杀机（Dead by Daylight）', hk: '第一后裔（THE FIRST DESCENDANT）', usNonGame: true },
                { rank: 3, us: 'WWE 2K26', jp: '鬼灭之刃:火之神血风谭2（Demon Slayer: Kimetsu no Yaiba – The Hinokami Chronicles 2）', hk: '逸剑风云决（Wandering Sword）' },
                { rank: 4, us: '鬼灭之刃:火之神血风谭2（Demon Slayer: Kimetsu no Yaiba – The Hinokami Chronicles 2）', jp: 'WWE 2K26', hk: 'WWE 2K26' },
                { rank: 5, us: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', jp: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）', hk: '红色沙漠（Crimson Desert）' },
                { rank: 6, us: '第一后裔（THE FIRST DESCENDANT）', jp: '动漫改编游戏专题', hk: '动漫改编游戏专题', jpNonGame: true, hkNonGame: true },
            ] },
        } },
        { date: '2026-02-13', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'STATE OF PLAY专题', jp: 'STATE OF PLAY专题', hk: 'STATE OF PLAY专题', isNonGame: true },
                { rank: 2, us: '羊蹄山之魂（Ghost of Yōtei）', jp: '潜行者2:切尔诺贝利之心（S.T.A.L.K.E.R. 2: Heart of Chornobyl）', hk: '独立游戏促销（PLAYSTATION INDIES）', hkNonGame: true },
                { rank: 3, us: 'NBA 2K26', jp: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', hk: 'Apex英雄（Apex Legends）' },
                { rank: 4, us: '命运2（Destiny 2）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 5, us: '独立游戏促销（PLAYSTATION INDIES）', jp: '识质存在（Pragmata）', hk: '人中之龙游戏专题', usNonGame: true, hkNonGame: true },
                { rank: 6, us: '超级英雄游戏专题', jp: 'PS5最精彩瞬间', hk: '羊蹄山之魂（Ghost of Yōtei）', usNonGame: true, jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '黑神话:悟空（Black Myth: Wukong）' },
                { rank: 3, us: '守望先锋（OVERWATCH）', jp: '人中之龙:极3（Yakuza 3 Remastere）', hk: '仁王3（NIOH 3）' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '鸣潮（Wuthering Waves）', hk: 'NBA 2K26' },
                { rank: 5, us: '仁王3（NIOH 3）', jp: '原神（Genshin impact）', hk: '实况足球（eFootball）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '崩坏:星穹铁道（Honkai: Star Rail）', jp: 'PS5最精彩瞬间', hk: '苍翼:混沌效应X（BlazBlue: Entropy Effect X‌）', jpNonGame: true },
                { rank: 2, us: '在线多人游戏专题（ONLINE MULTIPLAYER）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '人中之龙:极3（Yakuza 3 Remastere）', usNonGame: true },
                { rank: 3, us: 'ARC Raiders', jp: '女神异闻录３ Reload（Persona 3 Reload）', hk: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）' },
                { rank: 4, us: '索尼一方工作室游戏推荐（Discover Playstation Studios）', jp: '赛马大亨10（Winning Post 10 2026）', hk: '符文工房:龙之天地（Rune Factory: Guardians of Azuma）', usNonGame: true },
                { rank: 5, us: '神界:原罪2（Divinity: Original Sin 2）', jp: '赛博朋克2077（Cyberpunk 2077）', hk: '麦登橄榄球26（MaddenNFL26）' },
                { rank: 6, us: '照片模式游戏专题（PHOTOMODE）', jp: '寂静岭2（Silent Hill 2）', hk: '晶核（Crystal of Atlan）', usNonGame: true },
            ] },
        } },
        { date: '2026-02-12', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'NBA 2K26', jp: '潜行者2:切尔诺贝利之心（S.T.A.L.K.E.R. 2: Heart of Chornobyl）', hk: '新春优惠', hkNonGame: true },
                { rank: 2, us: '命运2（Destiny 2）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '独立游戏促销（PLAYSTATION INDIES）', hkNonGame: true },
                { rank: 3, us: '独立游戏促销（PLAYSTATION INDIES）', jp: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', hk: 'Apex英雄（Apex Legends）', usNonGame: true },
                { rank: 4, us: '超级英雄游戏专题', jp: '识质存在（Pragmata）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true },
                { rank: 5, us: '格斗游戏专题（FIGHTING GAMES）', jp: 'PS5最精彩瞬间', hk: '人中之龙游戏专题', isNonGame: true },
                { rank: 6, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '武士题材游戏专题', hk: '每月精选游戏', isNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '仁王3（NIOH 3）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '黑神话:悟空（Black Myth: Wukong）' },
                { rank: 3, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '鸣潮（Wuthering Waves）', hk: '仁王3（NIOH 3）' },
                { rank: 4, us: '守望先锋（OVERWATCH）', jp: '人中之龙:极3（Yakuza 3 Remastere）', hk: 'NBA 2K26' },
                { rank: 5, us: '罗布乐思（Roblox）', jp: '仁王3（NIOH 3）', hk: '鸣潮（Wuthering Waves）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '崩坏:星穹铁道（Honkai: Star Rail）', jp: '女神异闻录３ Reload（Persona 3 Reload）', hk: '真·三国无双:起源（Dynasty Warriors: Origins）' },
                { rank: 2, us: '在线多人游戏专题（ONLINE MULTIPLAYER）', jp: '赛博朋克2077（Cyberpunk 2077）', hk: '绝地潜兵2（Helldivers 2）', usNonGame: true },
                { rank: 3, us: 'ARC Raiders', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）' },
                { rank: 4, us: '索尼一方工作室游戏推荐（Discover Playstation Studios）', jp: 'PS5最精彩瞬间', hk: '晶核（Crystal of Atlan）', usNonGame: true, jpNonGame: true },
                { rank: 5, us: '神界:原罪2（Divinity: Original Sin 2）', jp: '寂静岭2（Silent Hill 2）', hk: '铁拳8（Tekken 8）' },
                { rank: 6, us: '照片模式游戏专题（PHOTOMODE）', jp: '燕云十六声（Where Winds Meet）', hk: '人中之龙游戏专题', usNonGame: true, hkNonGame: true },
            ] },
        } },
        { date: '2026-02-11', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'NBA 2K26', jp: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '命运2（Destiny 2）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '麦登橄榄球26（MaddenNFL26）' },
                { rank: 3, us: '明日方舟:终末地（Arknights: Endfield）', jp: '潜行者2:切尔诺贝利之心（S.T.A.L.K.E.R. 2: Heart of Chornobyl）', hk: 'WWE 2K26' },
                { rank: 4, us: '超级英雄游戏专题', jp: '识质存在（Pragmata）', hk: '美国职业棒球大联盟26（MLB The Show 26）', usNonGame: true },
                { rank: 5, us: '格斗游戏专题（FIGHTING GAMES）', jp: '跑车浪漫旅7（Gran Turismo 7）', hk: '格斗游戏专题（FIGHTING GAMES）', usNonGame: true, hkNonGame: true },
                { rank: 6, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '人中之龙0:誓约的场所导演剪辑版（Yakuza 0 Director\'s Cut）', hk: '巅峰守卫（Highguard）', usNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '黑神话:悟空（Black Myth: Wukong）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '鸣潮（Wuthering Waves）', hk: '仁王3（NIOH 3）' },
                { rank: 4, us: '仁王3（NIOH 3）', jp: '人中之龙:极3（Yakuza 3 Remastere）', hk: 'NBA 2K26' },
                { rank: 5, us: '守望先锋（OVERWATCH）', jp: '原神（Genshin impact）', hk: '鸣潮（Wuthering Waves）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '崩坏:星穹铁道（Honkai: Star Rail）', jp: '女神异闻录３ Reload（Persona 3 Reload）', hk: '真·三国无双:起源（Dynasty Warriors: Origins）' },
                { rank: 2, us: '在线多人游戏专题（ONLINE MULTIPLAYER）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '绝地潜兵2（Helldivers 2）', usNonGame: true },
                { rank: 3, us: 'ARC Raiders', jp: '赛博朋克2077（Cyberpunk 2077）', hk: '铁拳8（Tekken 8）' },
                { rank: 4, us: '索尼一方工作室游戏推荐（Discover Playstation Studios）', jp: '燕云十六声（Where Winds Meet）', hk: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）', usNonGame: true },
                { rank: 5, us: '神界:原罪2（Divinity: Original Sin 2）', jp: '在线多人游戏专题（ONLINE MULTIPLAYER）', hk: '艾尔登法环:黑夜君临（Elden Ring: Nightreign）', jpNonGame: true },
                { rank: 6, us: '照片模式游戏专题（PHOTOMODE）', jp: '索尼一方工作室游戏推荐（Discover Playstation Studios）', hk: '航海王:海贼无双4（One Piece: Pirate Warriors 4）', usNonGame: true, jpNonGame: true },
            ] },
        } },
        { date: '2026-02-10', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'NBA 2K26', jp: 'NBA 2K26', hk: '麦登橄榄球26（MaddenNFL26）' },
                { rank: 2, us: '命运2（Destiny 2）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '美国职业棒球大联盟26（MLB The Show 26）' },
                { rank: 3, us: '明日方舟:终末地（Arknights: Endfield）', jp: 'EA Sports FC 26', hk: 'WWE 2K26' },
                { rank: 4, us: '超级英雄游戏专题', jp: '超级英雄游戏专题', hk: '格斗游戏专题（FIGHTING GAMES）', isNonGame: true },
                { rank: 5, us: '格斗游戏专题（FIGHTING GAMES）', jp: '格斗游戏专题（FIGHTING GAMES）', hk: '巅峰守卫（Highguard）', usNonGame: true, jpNonGame: true },
                { rank: 6, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '新春优惠', isNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '明日方舟:终末地（Arknights: Endfield）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '双人成行（It Takes Two）' },
                { rank: 4, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '黑神话:悟空（Black Myth: Wukong）' },
                { rank: 5, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '明日方舟:终末地（Arknights: Endfield）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '崩坏:星穹铁道（Honkai: Star Rail）', jp: '在线多人游戏专题（ONLINE MULTIPLAYER）', hk: '华丽无比的战斗游戏专题', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: '在线多人游戏专题（ONLINE MULTIPLAYER）', jp: '辐射4（Fallout 4）', hk: '宣誓（Avowed）', usNonGame: true },
                { rank: 3, us: '辐射4（Fallout 4）', jp: 'ARC Raiders', hk: 'LET IT DIE: INFERNO' },
                { rank: 4, us: '索尼一方工作室游戏推荐（Discover Playstation Studios）', jp: '索尼一方工作室游戏推荐（Discover Playstation Studios）', hk: '幻兽帕鲁（Palworld）', usNonGame: true, jpNonGame: true },
                { rank: 5, us: 'ARC Raiders', jp: '神界:原罪2（Divinity: Original Sin 2）', hk: '奇异人生:重聚（Life is Strange: Reunion）' },
                { rank: 6, us: '神界:原罪2（Divinity: Original Sin 2）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: 'WWE 2K26' },
            ] },
        } },
        { date: '2026-02-09', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'NBA 2K26', jp: 'NBA 2K26', hk: '2026绝佳游戏（2026 GREAT GAMES）', hkNonGame: true },
                { rank: 2, us: '命运2（Destiny 2）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '新春优惠', hkNonGame: true },
                { rank: 3, us: '仁王3（NIOH 3）', jp: '仁王3（NIOH 3）', hk: '仁王3（NIOH 3）' },
                { rank: 4, us: '超级英雄游戏专题', jp: '超级英雄游戏专题', hk: '热门优惠', isNonGame: true },
                { rank: 5, us: '格斗游戏专题（FIGHTING GAMES）', jp: '格斗游戏专题（FIGHTING GAMES）', hk: '宇宙机器人（Astro Bot）', usNonGame: true, jpNonGame: true },
                { rank: 6, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '明日方舟:终末地（Arknights: Endfield）', usNonGame: true, jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '明日方舟:终末地（Arknights: Endfield）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '明日方舟:终末地（Arknights: Endfield）' },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '双人成行（It Takes Two）' },
                { rank: 5, us: '仁王3（NIOH 3）', jp: '仁王3（NIOH 3）', hk: '仁王3（NIOH 3）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '崩坏:星穹铁道（Honkai: Star Rail）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）' },
                { rank: 2, us: '在线多人游戏专题（ONLINE MULTIPLAYER）', jp: '在��多人游戏专题（ONLINE MULTIPLAYER）', hk: '鸣潮（Wuthering Waves）', usNonGame: true, jpNonGame: true },
                { rank: 3, us: '辐射4（Fallout 4）', jp: '辐射4（Fallout 4）', hk: '怪物猎人:荒野（Monster Hunter Wilds）' },
                { rank: 4, us: '索尼一方工作室游戏推荐（Discover Playstation Studios）', jp: '索尼一方工作室游戏推荐（Discover Playstation Studios）', hk: '冒险家艾略特的千年奇谭（The Adventures of Elliot: The Millennium Tales）', usNonGame: true, jpNonGame: true },
                { rank: 5, us: 'ARC Raiders', jp: 'ARC Raiders', hk: '荣耀战魂（For Honor）' },
                { rank: 6, us: '神界:原罪2（Divinity: Original Sin 2）', jp: '神界:原罪2（Divinity: Original Sin 2）', hk: '逸剑风云决（Wandering Sword）' },
            ] },
        } },
        { date: '2026-02-06', slots: {
            'Must See': { positions: [
                { rank: 1, us: '仁王3（NIOH 3）', jp: '仁王3（NIOH 3）', hk: '2026绝佳游戏（2026 GREAT GAMES）', hkNonGame: true },
                { rank: 2, us: '仁王3（NIOH 3）', jp: 'NBA 2K26', hk: '新春优惠', hkNonGame: true },
                { rank: 3, us: '仁王3（NIOH 3）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '热门优惠', hkNonGame: true },
                { rank: 4, us: 'NBA 2K26', jp: '超级英雄游戏专题', hk: '暗黑破坏神4（Diablo IV）', jpNonGame: true },
                { rank: 5, us: '命运2（Destiny 2）', jp: '格斗游戏专题（FIGHTING GAMES）', hk: '宇宙机器人（Astro Bot）', jpNonGame: true },
                { rank: 6, us: '超级英雄游戏专题', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '明日方舟:终末地（Arknights: Endfield）', usNonGame: true, jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '明日方舟:终末地（Arknights: Endfield）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '仁王3（NIOH 3）', hk: '明日方舟:终末地（Arknights: Endfield）' },
                { rank: 4, us: '仁王3（NIOH 3）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '双人成行（It Takes Two）' },
                { rank: 5, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', hk: '黑神话:悟空（Black Myth: Wukong）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '崩坏:星穹铁道（Honkai: Star Rail）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）' },
                { rank: 2, us: '在线多人游戏专题（ONLINE MULTIPLAYER）', jp: '女神异闻录３ Reload（Persona 3 Reload）', hk: '怪物猎人:荒野（Monster Hunter Wilds）', usNonGame: true },
                { rank: 3, us: '辐射4（Fallout 4）', jp: '在线多人游戏专题（ONLINE MULTIPLAYER）', hk: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', jpNonGame: true },
                { rank: 4, us: '索尼一方工作室游戏推荐（Discover Playstation Studios）', jp: '索尼一方工作室游戏推荐（Discover Playstation Studios）', hk: '第一后裔（The First Descendant）', usNonGame: true, jpNonGame: true },
                { rank: 5, us: 'ARC Raiders', jp: '辐射4（Fallout 4）', hk: '逸剑风云决（Wandering Sword）' },
                { rank: 6, us: '神界:原罪2（Divinity: Original Sin 2）', jp: 'ARC Raiders', hk: '黑色沙漠（Black Desert）' },
            ] },
        } },
        { date: '2026-02-05', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: 'ARC Raiders' },
                { rank: 2, us: '明日方舟:终末地（Arknights: Endfield）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '2026绝佳游戏（2026 GREAT GAMES）', hkNonGame: true },
                { rank: 3, us: '死亡搁浅2:冥滩之上（Death Stranding 2:On the Beach）', jp: '战地风云6（Battlefield 6）', hk: '暗黑破坏神4（Diablo IV）' },
                { rank: 4, us: '格斗游戏专题（FIGHTING GAMES）', jp: '格斗游戏专题（FIGHTING GAMES）', hk: '开放世界游戏专题', isNonGame: true },
                { rank: 5, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: 'EA Sports College Football 26', usNonGame: true, jpNonGame: true },
                { rank: 6, us: '超级英雄游戏专题', jp: '超级英雄游戏专题', hk: '新春优惠', isNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '明日方舟:终末地（Arknights: Endfield）', jp: 'Aces of Thunder', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: 'Aces of Thunder', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '明日方舟:终末地（Arknights: Endfield）' },
                { rank: 4, us: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', jp: '仁王3（NIOH 3）', hk: '赛博朋克2077（Cyberpunk 2077）' },
                { rank: 5, us: '仁王3（NIOH 3）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '我的世界（Minecraft）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '无限暖暖（Infinity Nikki）', jp: '无限暖暖（Infinity Nikki）', hk: '适合新手游戏专题', hkNonGame: true },
                { rank: 2, us: '在线多人游戏专题（ONLINE MULTIPLAYER）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '开放世界游戏专题', usNonGame: true, hkNonGame: true },
                { rank: 3, us: '神界:原罪2（Divinity: Original Sin 2）', jp: '燕云十六声（Where Winds Meet）', hk: '识质存在（Pragmata）' },
                { rank: 4, us: '最终幻想14（Final Fantasy XIV）', jp: '最终幻想14（Final Fantasy XIV）', hk: '刺客信条:幻景（Assassin\'s Creed Mirage）' },
                { rank: 5, us: '脑力解谜游戏专题（BRAIN TEASERS）', jp: '女神异闻录３ Reload（Persona 3 Reload）', hk: '仁王3（NIOH 3）', usNonGame: true },
                { rank: 6, us: '故事驱动游戏专题（STORY-DRIVEN）', jp: '在线多人游戏专题（ONLINE MULTIPLAYER）', hk: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）', usNonGame: true, jpNonGame: true },
            ] },
        } },
        { date: '2026-02-04', slots: {
            'Must See': { positions: [
                { rank: 1, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: 'EA Sports FC 26', hk: '2026绝佳游戏（2026 GREAT GAMES）', hkNonGame: true },
                { rank: 2, us: '暗黑破坏神4（Diablo IV）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '暗黑破坏神4（Diablo IV）' },
                { rank: 3, us: '失落星船:马拉松（Marathon）', jp: '人中之龙0:誓约的场所导演剪辑版（Yakuza 0 Director\'s Cut）', hk: '新春优惠', hkNonGame: true },
                { rank: 4, us: 'EA Sports College Football 26', jp: '格斗游戏专题（FIGHTING GAMES）', hk: '开放世界游戏专题', jpNonGame: true, hkNonGame: true },
                { rank: 5, us: 'WWE 2K26', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '格斗游戏专题（FIGHTING GAMES）', jpNonGame: true, hkNonGame: true },
                { rank: 6, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '超级英雄游戏专题', hk: '热门优惠', jpNonGame: true, hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '燕云十六声（Where Winds Meet）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '仁王3（NIOH 3）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '明日方舟:终末地（Arknights: Endfield）' },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '仁王3（NIOH 3）', hk: '三角洲行动（Delta Force）' },
                { rank: 4, us: 'WWE 2K26', jp: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', hk: '哈迪斯2（Hades2）' },
                { rank: 5, us: '鸣潮（Wuthering Waves）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '我的世界（Minecraft）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '罗布乐思（Roblox）', jp: '无限暖暖（Infinity Nikki）', hk: '刺客信条:幻景（Assassin\'s Creed Mirage）' },
                { rank: 2, us: '失落星船:马拉松（Marathon）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '开放世界游戏专题', hkNonGame: true },
                { rank: 3, us: '原神（Genshin impact）', jp: '燕云十六声（Where Winds Meet）', hk: '神界:原罪2（Divinity: Original Sin 2）' },
                { rank: 4, us: '黎明杀机（Dead by Daylight）', jp: '最终幻想14（Final Fantasy XIV）', hk: '适合新手游戏专题', hkNonGame: true },
                { rank: 5, us: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', jp: '在线多人游戏专题（ONLINE MULTIPLAYER）', hk: '荣耀战魂（For Honor）', jpNonGame: true },
                { rank: 6, us: '绝地潜兵2（Helldivers 2）', jp: '神界:原罪2（Divinity: Original Sin 2）', hk: '宣誓（Avowed）' },
            ] },
        } },
        { date: '2026-02-03', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'EA Sports FC 26', jp: '漫威争锋（Marvel Rivals）', hk: '热门优惠', hkNonGame: true },
                { rank: 2, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: '堡垒之夜（Fortnite）', hk: 'EA Sports College Football 26' },
                { rank: 3, us: 'WWE 2K26', jp: '歧路旅人0（Octopath Traveler 0）', hk: '麦登橄榄球26（MaddenNFL26）' },
                { rank: 4, us: '麦登橄榄球26（MaddenNFL26）', jp: 'LGBTQIA+游戏专题', hk: '2026绝佳游戏（2026 GREAT GAMES）', jpNonGame: true, hkNonGame: true },
                { rank: 5, us: 'EA Sports College Football 26', jp: 'EA Sports FC 26', hk: '月度优惠', hkNonGame: true },
                { rank: 6, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '侠盗猎车手6（Grand Theft Auto VI）' },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '明日方舟:终末地（Arknights: Endfield）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '仁王3（NIOH 3）', jp: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', hk: '明日方舟:终末地（Arknights: Endfield）' },
                { rank: 3, us: 'WWE 2K26', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '三角洲行动（Delta Force）' },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '仁王3（NIOH 3）', hk: '哈迪斯2（Hades2）' },
                { rank: 5, us: '鸣潮（Wuthering Waves）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '我的世界（Minecraft）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '无限暖暖（Infinity Nikki）', jp: '晶核（Crystal of Atlan）', hk: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）' },
                { rank: 2, us: 'Roguelike游戏专题', jp: '绝区零（Zenless Zone Zero）', hk: '黎明杀机（Dead by Daylight）', usNonGame: true },
                { rank: 3, us: '黎明杀机（Dead by Daylight）', jp: '怪物猎人游戏专题', hk: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', jpNonGame: true },
                { rank: 4, us: '不寐之境:女巫与魔咒（Never Grave: The Witch and The Curse）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '罗布乐思（Roblox）' },
                { rank: 5, us: '失落星船:马拉松（Marathon）', jp: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）', hk: 'WWE 2K26' },
                { rank: 6, us: '罗布乐思（Roblox）', jp: '在线多人游戏专题（ONLINE MULTIPLAYER）', hk: '仁王3（NIOH 3）', jpNonGame: true },
            ] },
        } },
        { date: '2026-02-02', slots: {
            'Must See': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '歧路旅人0（Octopath Traveler 0）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '原神（Genshin impact）', jp: '鸣潮（Wuthering Waves）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '人中之龙0:誓约的场所（Yakuza 0）', hk: '侠盗猎车手在线模式（Grand Theft Auto Online）' },
                { rank: 4, us: '明日方舟:终末地（Arknights: Endfield）', jp: '跑车浪漫旅7（Gran Turismo 7）', hk: '跑车浪漫旅7（Gran Turismo 7）' },
                { rank: 5, us: '失落星船:马拉松（Marathon）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '每月精选游戏', hkNonGame: true },
                { rank: 6, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: '人中之龙游戏专题', hk: '侠盗猎车手6（Grand Theft Auto VI）', jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '明日方舟:终末地（Arknights: Endfield）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '明日方舟:终末地（Arknights: Endfield）' },
                { rank: 2, us: 'WWE 2K26', jp: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 3, us: '仁王3（NIOH 3）', jp: '仁王3（NIOH 3）', hk: '三角洲行动（Delta Force）' },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '哈迪斯2（Hades2）' },
                { rank: 5, us: '鸣潮（Wuthering Waves）', jp: '凶乱魔界主义（Kyouran Makaism）', hk: '我的世界（Minecraft）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', jp: '孤山独影（CAIRN）', hk: '孤山独影（CAIRN）' },
                { rank: 2, us: '航海王:海贼无双4（One Piece: Pirate Warriors 4）', jp: '怪物猎人游戏专题', hk: '铁拳8（Tekken 8）', jpNonGame: true },
                { rank: 3, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: 'PS5最精彩瞬间', hk: '真·三国无双:起源（Dynasty Warriors: Origins）', jpNonGame: true },
                { rank: 4, us: '超级机器人大战Y（Super Robot Wars Y‌）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '仁王3（NIOH 3）' },
                { rank: 5, us: '晶核（Crystal of Atlan）', jp: '巨击大乱斗（GigaBash）', hk: '航海王:海贼无双4（One Piece: Pirate Warriors 4）' },
                { rank: 6, us: '逆转裁判123 成步堂精选集（Phoenix Wright: Ace Attorney Trilogy）', jp: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）', hk: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）' },
            ] },
        } },
        { date: '2026-01-30', slots: {
            'Must See': { positions: [
                { rank: 1, us: '战地风云6（Battlefield 6）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '凶乱魔界主义（Kyouran Makaism）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 3, us: 'EA Sports FC 26', jp: '无限传说复刻版（Tales of Xillia Remastered）', hk: '侠盗猎车手在线模式（Grand Theft Auto Online）' },
                { rank: 4, us: '羊蹄山之魂（Ghost of Yōtei）', jp: '歧路旅人0（Octopath Traveler 0）', hk: 'NBA 2K26' },
                { rank: 5, us: 'ARC Raiders', jp: '人中之龙0:誓约的场所（Yakuza 0）', hk: '每月精选游戏', hkNonGame: true },
                { rank: 6, us: '跑车浪漫旅7（Gran Turismo 7）', jp: '流星洛克人:完美专题（Mega Man Star Force: Legacy Collection）', hk: '月度优惠', jpNonGame: true, hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '明日方舟:终末地（Arknights: Endfield）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '原神（Genshin impact）', jp: '罗布乐思（Roblox）', hk: '明日方舟:终末地（Arknights: Endfield）' },
                { rank: 4, us: '鸣潮（Wuthering Waves）', jp: '原神（Genshin impact）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 5, us: '噬血代码2（Code vein ll）', jp: '鸣潮（Wuthering Waves）', hk: '原神（Genshin impact）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '超级机器人大战Y（Super Robot Wars Y‌）', jp: '仁王3（NIOH 3）', hk: '仁王3（NIOH 3）' },
                { rank: 2, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: 'PS5最精彩瞬间', hk: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', jpNonGame: true },
                { rank: 3, us: '晶核（Crystal of Atlan）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '铁拳8（Tekken 8）' },
                { rank: 4, us: '航海王:海贼无双4（One Piece: Pirate Warriors 4）', jp: '孤山独影（CAIRN）', hk: '孤山独影（CAIRN）' },
                { rank: 5, us: '逆转裁判123 成步堂精选集（Phoenix Wright: Ace Attorney Trilogy）', jp: '赛博朋克2077（Cyberpunk 2077）', hk: '航海王:海贼无双4（One Piece: Pirate Warriors 4）' },
                { rank: 6, us: 'Roguelike游戏专题', jp: '寂静岭2（Silent Hill 2）', hk: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）', usNonGame: true },
            ] },
        } },
        { date: '2026-01-29', slots: {
            'Must See': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '无限传说复刻版（Tales of Xillia Remastered）', hk: '月度优惠', hkNonGame: true },
                { rank: 2, us: '明日方舟:终末地（Arknights: Endfield）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 3, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: '流星洛克人:完美专题（Mega Man Star Force: Legacy Collection）', hk: '命运2（Destiny 2）', jpNonGame: true },
                { rank: 4, us: '巅峰守卫（Highguard）', jp: '歧路旅人0（Octopath Traveler 0）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 5, us: '暗黑破坏神4（Diablo IV）', jp: '武士题材游戏专题', hk: '每月精选游戏', jpNonGame: true, hkNonGame: true },
                { rank: 6, us: '侠盗猎车手在线模式（Grand Theft Auto Online）', jp: '人中之龙0:誓约的场所（Yakuza 0）', hk: '侠盗猎车手在线模式（Grand Theft Auto Online）' },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '明日方舟:终末地（Arknights: Endfield）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '2XKO', jp: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '堡垒之夜（Fortnite）', jp: '罗布乐思（Roblox）', hk: '明日方舟:终末地（Arknights: Endfield）' },
                { rank: 4, us: '原神（Genshin impact）', jp: '原神（Genshin impact）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 5, us: '鸣潮（Wuthering Waves）', jp: '鸣潮（Wuthering Waves）', hk: '原神（Genshin impact）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '超级机器人大战Y（Super Robot Wars Y‌）', jp: '仁王3（NIOH 3）', hk: '仁王3（NIOH 3）' },
                { rank: 2, us: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', jp: '赛博朋克2077（Cyberpunk 2077）', hk: '航海王:海贼无双4（One Piece: Pirate Warriors 4）' },
                { rank: 3, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '狩猎题材游戏专题', hk: '七大罪:起源（The Seven Deadly Sins:Origin）', jpNonGame: true },
                { rank: 4, us: '航海王:海贼无双4（One Piece: Pirate Warriors 4）', jp: 'PS5最精彩瞬间', hk: '铁拳8（Tekken 8）', jpNonGame: true },
                { rank: 5, us: '晶核（Crystal of Atlan）', jp: '铁拳8（Tekken 8）', hk: '数码宝贝物语:时空异客（Digimon Story: Time Stranger）' },
                { rank: 6, us: '逆转裁判123 成步堂精选集（Phoenix Wright: Ace Attorney Trilogy）', jp: '巨击大乱斗（GigaBash）', hk: '方舟:生存进化（‌ARK: Survival Ascended）' },
            ] },
        } },
        { date: '2026-01-28', slots: {
            'Must See': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 2, us: '明日方舟:终末地（Arknights: Endfield）', jp: '无限传说复刻版（Tales of Xillia Remastered）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 3, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: '流星洛克人:完美专题（Mega Man Star Force: Legacy Collection）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jpNonGame: true },
                { rank: 4, us: '巅峰守卫（Highguard）', jp: '007:锋芒初露（007 First Light）', hk: 'NBA 2K26' },
                { rank: 5, us: '暗黑破坏神4（Diablo IV）', jp: '人中之龙0:誓约的场所（Yakuza 0）', hk: '原神（Genshin impact）' },
                { rank: 6, us: '侠盗猎车手在线模式（Grand Theft Auto Online）', jp: '跑车浪漫旅7（Gran Turismo 7）', hk: '侠盗猎车手在线模式（Grand Theft Auto Online）' },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '明日方舟:终末地（Arknights: Endfield）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '2XKO', jp: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '堡垒之夜（Fortnite）', jp: '罗布乐思（Roblox）', hk: '绝地求生（PUBG: Battlegrounds）' },
                { rank: 4, us: '原神（Genshin impact）', jp: '原神（Genshin impact）', hk: '明日方舟:终末地（Arknights: Endfield）' },
                { rank: 5, us: '鸣潮（Wuthering Waves）', jp: '鸣潮（Wuthering Waves）', hk: '鸣潮（Wuthering Waves）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '超级机器人大战Y（Super Robot Wars Y‌）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: '数码宝贝物语:时空异客（Digimon Story: Time Stranger）' },
                { rank: 2, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '航海王:海贼无双4（One Piece: Pirate Warriors 4）' },
                { rank: 3, us: '晶核（Crystal of Atlan）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '超级机器人大战Y（Super Robot Wars Y‌）' },
                { rank: 4, us: '航海王:海贼无双4（One Piece: Pirate Warriors 4）', jp: '多样性游戏专题（DIVERSITY）', hk: '真·三国无双:起源（Dynasty Warriors: Origins）', jpNonGame: true },
                { rank: 5, us: '逆转裁判123 成步堂精选集（Phoenix Wright: Ace Attorney Trilogy）', jp: '帝国时代4（Age of Empires IV）', hk: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）' },
                { rank: 6, us: 'Roguelike游戏专题', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '艾尔登法环:黑夜君临（Elden Ring: Nightreign）', usNonGame: true },
            ] },
        } },
        { date: '2026-01-27', slots: {
            'Must See': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 2, us: '明日方舟:终末地（Arknights: Endfield）', jp: '暗黑破坏神4（Diablo IV）', hk: 'NBA 2K26' },
                { rank: 3, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: '人中之龙游戏专题', hk: '原神（Genshin impact）', jpNonGame: true },
                { rank: 4, us: '巅峰守卫（Highguard）', jp: '脑力解谜游戏专题（BRAIN TEASERS）', hk: '侠盗猎车手在线模式（Grand Theft Auto Online）', jpNonGame: true },
                { rank: 5, us: '暗黑破坏神4（Diablo IV）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '漫威争锋（Marvel Rivals）', jpNonGame: true },
                { rank: 6, us: 'NBA 2K26', jp: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', hk: '每月精选游戏', hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '明日方舟:终末地（Arknights: Endfield）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '2XKO', jp: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '堡垒之夜（Fortnite）', jp: '罗布乐思（Roblox）', hk: '明日方舟:终末地（Arknights: Endfield）' },
                { rank: 4, us: '鸣潮（Wuthering Waves）', jp: '鸣潮（Wuthering Waves）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 5, us: '原神（Genshin impact）', jp: '原神（Genshin impact）', hk: '原神（Genshin impact）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '超级机器人大战Y（Super Robot Wars Y‌）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 2, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '跑车浪漫旅7（Gran Turismo 7）' },
                { rank: 3, us: '晶核（Crystal of Atlan）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '侠盗猎车手5（Grand Theft Auto V）' },
                { rank: 4, us: '航海王:海贼无双4（One Piece: Pirate Warriors 4）', jp: '多样性游戏专题（DIVERSITY）', hk: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）', jpNonGame: true },
                { rank: 5, us: '逆转裁判123 成步堂精选集（Phoenix Wright: Ace Attorney Trilogy）', jp: '帝国时代4（Age of Empires IV）', hk: '人中之龙0:誓约的场所（Yakuza 0）' },
                { rank: 6, us: 'Roguelike游戏专题', jp: '神界:原罪2（Divinity: Original Sin 2）', hk: '无限暖暖（Infinity Nikki）', usNonGame: true },
            ] },
        } },
        { date: '2026-01-26', slots: {
            'Must See': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 2, us: '明日方舟:终末地（Arknights: Endfield）', jp: '人中之龙游戏专题', hk: '暗黑破坏神4（Diablo IV）', jpNonGame: true },
                { rank: 3, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', hk: 'NBA 2K26' },
                { rank: 4, us: '暗黑破坏神4（Diablo IV）', jp: '脑力解谜游戏专题（BRAIN TEASERS）', hk: 'PS5必玩游戏', jpNonGame: true, hkNonGame: true },
                { rank: 5, us: 'NBA 2K26', jp: '暗黑破坏神4（Diablo IV）', hk: '合家欢游戏专题', hkNonGame: true },
                { rank: 6, us: '侠盗猎车手在线模式（Grand Theft Auto Online）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '羊蹄山之魂（Ghost of Yōtei）', jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '明日方舟:终末地（Arknights: Endfield）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '2XKO', jp: 'SEGA 新创造球会（SEGA FOOTBALL CLUB CHAMPIONS）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '堡垒之夜（Fortnite）', jp: '罗布乐思（Roblox）', hk: '绝地求生（PUBG: Battlegrounds）' },
                { rank: 4, us: '鸣潮（Wuthering Waves）', jp: '鸣潮（Wuthering Waves）', hk: '明日方舟:终末地（Arknights: Endfield）' },
                { rank: 5, us: '原神（Genshin impact）', jp: '原神（Genshin impact）', hk: '鸣潮（Wuthering Waves）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '超级机器人大战Y（Super Robot Wars Y‌）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 2, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '崩坏:星穹铁道（Honkai: Star Rail）' },
                { rank: 3, us: '晶核（Crystal of Atlan）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '跑车浪漫旅7（Gran Turismo 7）' },
                { rank: 4, us: '航海王:海贼无双4（One Piece: Pirate Warriors 4）', jp: '多样性游戏专题（DIVERSITY）', hk: '仁王3（NIOH 3）', jpNonGame: true },
                { rank: 5, us: '逆转裁判123 成步堂精选集（Phoenix Wright: Ace Attorney Trilogy）', jp: '帝国时代4（Age of Empires IV）', hk: '坦克世界:现代装甲（World of Tanks Modern Armor）' },
                { rank: 6, us: 'Roguelike游戏专题', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '结伴同游游戏专题', usNonGame: true, hkNonGame: true },
            ] },
        } },
        { date: '2026-01-23', slots: {
            'Must See': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 2, us: '明日方舟:终末地（Arknights: Endfield）', jp: '人中之龙游戏专题', hk: '暗黑破坏神4（Diablo IV）', jpNonGame: true },
                { rank: 3, us: '侠盗猎车手6（Grand Theft Auto VI）', jp: '暗黑破坏神4（Diablo IV）', hk: 'NBA 2K26' },
                { rank: 4, us: '暗黑破坏神4（Diablo IV）', jp: '脑力解谜游戏专题（BRAIN TEASERS）', hk: 'PS5必玩游戏', jpNonGame: true, hkNonGame: true },
                { rank: 5, us: 'NBA 2K26', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '合家欢游戏专题', jpNonGame: true, hkNonGame: true },
                { rank: 6, us: '侠盗猎车手在线模式（Grand Theft Auto Online）', jp: '无障碍功能游戏（Accessibility in games）', hk: '新游期待榜', jpNonGame: true, hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '2XKO', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: '罗布乐思（Roblox）', hk: '绝地求生（PUBG: Battlegrounds）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '原神（Genshin impact）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '原神（Genshin impact）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 5, us: '燕云十六声（Where Winds Meet）', jp: '我的世界（Minecraft）', hk: '实况足球（eFootball）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '超级机器人大战Y（Super Robot Wars Y‌）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 2, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '坦克世界:现代装甲（World of Tanks Modern Armor）' },
                { rank: 3, us: '晶核（Crystal of Atlan）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '崩坏:星穹铁道（Honkai: Star Rail）' },
                { rank: 4, us: '航海王:海贼无双4（One Piece: Pirate Warriors 4）', jp: '多样性游戏专题（DIVERSITY）', hk: '仁王3（NIOH 3）', jpNonGame: true },
                { rank: 5, us: '逆转裁判123 成步堂精选集（Phoenix Wright: Ace Attorney Trilogy）', jp: '帝国时代4（Age of Empires IV）', hk: '跑车浪漫旅7（Gran Turismo 7）' },
                { rank: 6, us: 'Roguelike游戏专题', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '结伴同游游戏专题', usNonGame: true, hkNonGame: true },
            ] },
        } },
        { date: '2026-01-22', slots: {
            'Must See': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 2, us: '暗黑破坏神4（Diablo IV）', jp: '暗黑破坏神4（Diablo IV）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 3, us: '明日方舟:终末地（Arknights: Endfield）', jp: '明日方舟:终末地（Arknights: Endfield）', hk: '明日方舟:终末地（Arknights: Endfield）' },
                { rank: 4, us: '脑力解谜游戏专题（BRAIN TEASERS）', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: '漫威争锋（Marvel Rivals）', usNonGame: true },
                { rank: 5, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: 'NBA 2K26', usNonGame: true, jpNonGame: true },
                { rank: 6, us: 'Team Of The Year', jp: '温馨游戏专题（COZY GAMES）', hk: '战地风云6（Battlefield 6）', usNonGame: true, jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '2XKO', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: '罗布乐思（Roblox）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '绝地求生（PUBG: Battlegrounds）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '原神（Genshin impact）', hk: '原神（Genshin impact）' },
                { rank: 5, us: '燕云十六声（Where Winds Meet）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '鸣潮（Wuthering Waves）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: '铁拳8（Tekken 8）' },
                { rank: 2, us: '多样性游戏专题（DIVERSITY）', jp: '刺客信条:幻景（Assassin\'s Creed Mirage）', hk: '刺客信条:影（Assassin\'s Creed Shadows）', usNonGame: true },
                { rank: 3, us: '人中之龙0:誓约的场所导演剪辑版（Yakuza 0 Director\'s Cut）', jp: '帝国时代4（Age of Empires IV）', hk: '航海王:海贼无双4（One Piece: Pirate Warriors 4）' },
                { rank: 4, us: '足球经理26（Football Manager 26）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '艾尔登法环:黑夜君临（Elden Ring: Nightreign）' },
                { rank: 5, us: '纪元117:罗马和平（Anno 117: Pax Romana）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '真·三国无双:起源（Dynasty Warriors: Origins）' },
                { rank: 6, us: '帝国时代4（Age of Empires IV）', jp: '动漫改编游戏专题', hk: '数码宝贝物语:时空异客（Digimon Story: Time Stranger）', jpNonGame: true },
            ] },
        } },
        { date: '2026-01-21', slots: {
            'Must See': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 2, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 3, us: '暗黑破坏神4（Diablo IV）', jp: '暗黑破坏神4（Diablo IV）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 4, us: '脑力解谜游戏专题（BRAIN TEASERS）', jp: '脑力解谜游戏专题（BRAIN TEASERS）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true, jpNonGame: true },
                { rank: 5, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '人中之龙游戏专题', hk: '热门优惠', isNonGame: true },
                { rank: 6, us: '复古经典游戏专题', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '战地风云6（Battlefield 6）', usNonGame: true, jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '模拟人生4（The Sims 4）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '绝地求生（PUBG: Battlegrounds）' },
                { rank: 4, us: '燕云十六声（Where Winds Meet）', jp: '原神（Genshin impact）', hk: '原神（Genshin impact）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '实况足球（eFootball）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: '铁拳8（Tekken 8）' },
                { rank: 2, us: '刺客信条:幻景（Assassin\'s Creed Mirage）', jp: '刺客信条:幻景（Assassin\'s Creed Mirage）', hk: '刺客信条:影（Assassin\'s Creed Shadows）' },
                { rank: 3, us: '纪元117:罗马和平（Anno 117: Pax Romana）', jp: '帝国时代4（Age of Empires IV）', hk: '真·三国无双:起源（Dynasty Warriors: Origins）' },
                { rank: 4, us: '足球经理26（Football Manager 26）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '艾尔登法环:黑夜君临（Elden Ring: Nightreign）' },
                { rank: 5, us: '帝国时代4（Age of Empires IV）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）' },
                { rank: 6, us: '人中之龙0:誓约的场所导演剪辑版（Yakuza 0 Director\'s Cut）', jp: '动漫改编游戏专题', hk: '数码宝贝物语:时空异客（Digimon Story: Time Stranger）', jpNonGame: true },
            ] },
        } },
        { date: '2026-01-20', slots: {
            'Must See': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 2, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 3, us: '暗黑破坏神4（Diablo IV）', jp: '暗黑破坏神4（Diablo IV）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 4, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: '原神（Genshin impact）' },
                { rank: 5, us: '温馨游戏专题（COZY GAMES）', jp: '人中之龙游戏专题', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true, jpNonGame: true },
                { rank: 6, us: '2026绝佳游戏（2026 GREAT GAMES）', jp: '开放世界游戏专题', hk: 'PS5必玩游戏', usNonGame: true, jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '绝地求生（PUBG: Battlegrounds）' },
                { rank: 3, us: '模拟人生4（The Sims 4）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '原神（Genshin impact）' },
                { rank: 4, us: '燕云十六声（Where Winds Meet）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 5, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '实况足球（eFootball）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '足球经理26（Football Manager 26）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: '铁拳8（Tekken 8）' },
                { rank: 2, us: '刺客信条:幻景（Assassin\'s Creed Mirage）', jp: '刺客信条:幻景（Assassin\'s Creed Mirage）', hk: '数码宝贝物语:时空异客（Digimon Story: Time Stranger）' },
                { rank: 3, us: '帝国时代4（Age of Empires IV）', jp: '帝国时代4（Age of Empires IV）', hk: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）' },
                { rank: 4, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '艾尔登法环:黑夜君临（Elden Ring: Nightreign）' },
                { rank: 5, us: '纪元117:罗马和平（Anno 117: Pax Romana）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '超级机器人大战Y（Super Robot Wars Y‌）' },
                { rank: 6, us: '动漫改编游戏专题', jp: '动漫改编游戏专题', hk: '晶核（Crystal of Atlan）', usNonGame: true, jpNonGame: true },
            ] },
        } },
        { date: '2026-01-16', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: '暗黑破坏神4（Diablo IV）', jp: '暗黑破坏神4（Diablo IV）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 3, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 4, us: '开放世界游戏专题', jp: '人中之龙游戏专题', hk: 'PS5必玩游戏', isNonGame: true },
                { rank: 5, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '开放世界游戏专题', hk: '合家欢游戏专题', isNonGame: true },
                { rank: 6, us: '2026绝佳游戏（2026 GREAT GAMES）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: 'NBA 2K26', usNonGame: true, jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '燕云十六声（Where Winds Meet）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '原神（Genshin impact）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '霍格沃茨之遗（Hogwarts Legacy）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '足球经理26（Football Manager 26）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: '铁拳8（Tekken 8）' },
                { rank: 2, us: '刺客信条:幻景（Assassin\'s Creed Mirage）', jp: '刺客信条:幻景（Assassin\'s Creed Mirage）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 3, us: '帝国时代4（Age of Empires IV）', jp: '帝国时代4（Age of Empires IV）', hk: '超级机器人大战Y（Super Robot Wars Y‌）' },
                { rank: 4, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '数码宝贝物语:时空异客（Digimon Story: Time Stranger）' },
                { rank: 5, us: '纪元117:罗马和平（Anno 117: Pax Romana）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '仁王3（NIOH 3）' },
                { rank: 6, us: '动漫改编游戏专题', jp: '动漫改编游戏专题', hk: 'Apex英雄（Apex Legends）', usNonGame: true, jpNonGame: true },
            ] },
        } },
        { date: '2026-01-15', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: '暗黑破坏神4（Diablo IV）', jp: '人中之龙游戏专题', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jpNonGame: true },
                { rank: 3, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '暗黑破坏神4（Diablo IV）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 4, us: '开放世界游戏专题', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: 'PS5必玩游戏', usNonGame: true, hkNonGame: true },
                { rank: 5, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '合家欢游戏专题', usNonGame: true, hkNonGame: true },
                { rank: 6, us: '2026绝佳游戏（2026 GREAT GAMES）', jp: '开放世界游戏专题', hk: 'NBA 2K26', usNonGame: true, jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '绝地求生（PUBG: Battlegrounds）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '燕云十六声（Where Winds Meet）', hk: '三角洲行动（Delta Force）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '霍格沃茨之遗（Hogwarts Legacy）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '原神（Genshin impact）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '足球经理26（Football Manager 26）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 2, us: '刺客信条:幻景（Assassin\'s Creed Mirage）', jp: '刺客信条:幻景（Assassin\'s Creed Mirage）', hk: 'Apex英雄（Apex Legends）' },
                { rank: 3, us: '帝国时代4（Age of Empires IV）', jp: '帝国时代4（Age of Empires IV）', hk: '新游期待榜', hkNonGame: true },
                { rank: 4, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '仁王3（NIOH 3）' },
                { rank: 5, us: '纪元117:罗马和平（Anno 117: Pax Romana）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '结伴同游游戏专题', hkNonGame: true },
                { rank: 6, us: '动漫改编游戏专题', jp: '动漫改编游戏专题', hk: '索尼一方工作室游戏推荐（Discover Playstation Studios）', isNonGame: true },
            ] },
        } },
        { date: '2026-01-14', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: '暗黑破坏神4（Diablo IV）', jp: '人中之龙游戏专题', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jpNonGame: true },
                { rank: 3, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '暗黑破坏神4（Diablo IV）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 4, us: '开放世界游戏专题', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: 'PS5必玩游戏', usNonGame: true, hkNonGame: true },
                { rank: 5, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: 'NBA 2K26', usNonGame: true },
                { rank: 6, us: '2026绝佳游戏（2026 GREAT GAMES）', jp: '开放世界游戏专题', hk: '合家欢游戏专题', isNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '燕云十六声（Where Winds Meet）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '原神（Genshin impact）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '霍格沃茨之遗（Hogwarts Legacy）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: '铁拳8（Tekken 8）' },
                { rank: 2, us: '帝国时代4（Age of Empires IV）', jp: '刺客信条:幻景（Assassin\'s Creed Mirage）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 3, us: '纪元117:罗马和平（Anno 117: Pax Romana）', jp: '帝国时代4（Age of Empires IV）', hk: '超级机器人大战Y（Super Robot Wars Y‌）' },
                { rank: 4, us: '足球经理26（Football Manager 26）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '数码宝贝物语:时空异客（Digimon Story: Time Stranger）' },
                { rank: 5, us: '人中之龙0:誓约的场所（Yakuza 0）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '仁王3（NIOH 3）' },
                { rank: 6, us: '多样性游戏专题（DIVERSITY）', jp: '动漫改编游戏专题', hk: 'Apex英雄（Apex Legends）', usNonGame: true, jpNonGame: true },
            ] },
        } },
        { date: '2026-01-13', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: '暗黑破坏神4（Diablo IV）', jp: '人中之龙游戏专题', hk: 'NBA 2K26', jpNonGame: true },
                { rank: 3, us: '2026绝佳游戏（2026 GREAT GAMES）', jp: '暗黑破坏神4（Diablo IV）', hk: '麦登橄榄球26（MaddenNFL26）', usNonGame: true },
                { rank: 4, us: '温馨游戏专题（COZY GAMES）', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: 'PS5必玩游戏', usNonGame: true, hkNonGame: true },
                { rank: 5, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '温馨游戏专题（COZY GAMES）', hk: '合家欢游戏专题', isNonGame: true },
                { rank: 6, us: '复古经典游戏专题', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '新游期待榜', isNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '霍格沃茨之遗（Hogwarts Legacy）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '燕云十六声（Where Winds Meet）', hk: '原神（Genshin impact）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '守望先锋（OVERWATCH）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '实况足球（eFootball）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '足球经理26（Football Manager 26）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 2, us: '刺客信条:幻景（Assassin\'s Creed Mirage）', jp: '刺客信条:幻景（Assassin\'s Creed Mirage）', hk: 'Apex英雄（Apex Legends）' },
                { rank: 3, us: '帝国时代4（Age of Empires IV）', jp: '帝国时代4（Age of Empires IV）', hk: '索尼一方工作室游戏推荐（Discover Playstation Studios）', hkNonGame: true },
                { rank: 4, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '仁王3（NIOH 3）' },
                { rank: 5, us: '纪元117:罗马和平（Anno 117: Pax Romana）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '新游期待榜', hkNonGame: true },
                { rank: 6, us: '动漫改编游戏专题', jp: '动漫改编游戏专题', hk: '忍者龙剑传4（Ninja Gaiden 4）', usNonGame: true, jpNonGame: true },
            ] },
        } },
        { date: '2026-01-12', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: '暗黑破坏神4（Diablo IV）', jp: '人中之龙游戏专题', hk: '麦登橄榄球26（MaddenNFL26）', jpNonGame: true },
                { rank: 3, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: 'NBA 2K26' },
                { rank: 4, us: '原神（Genshin impact）', jp: '命运2（Destiny 2）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: '开放世界游戏专题', jp: '莱莎的炼金工坊游戏专题', hk: '编辑精选-年度游戏专题', isNonGame: true },
                { rank: 6, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '失落星船:马拉松（Marathon）', hk: '羊蹄山之魂（Ghost of Yōtei）', usNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '原神（Genshin impact）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '燕云十六声（Where Winds Meet）', hk: '霍格沃茨之遗（Hogwarts Legacy）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '实况足球（eFootball）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '我的世界（Minecraft）', hk: '绝区零（Zenless Zone Zero）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '足球经理26（Football Manager 26）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 2, us: '刺客信条:幻景（Assassin\'s Creed Mirage）', jp: '刺客信条:幻景（Assassin\'s Creed Mirage）', hk: '仁王3（NIOH 3）' },
                { rank: 3, us: '帝国时代4（Age of Empires IV）', jp: '帝国时代4（Age of Empires IV）', hk: '索尼一方工作室游戏推荐（Discover Playstation Studios）', hkNonGame: true },
                { rank: 4, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '黑色沙漠（Black Desert）' },
                { rank: 5, us: '纪元117:罗马和平（Anno 117: Pax Romana）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '崩坏:星穹铁道（Honkai: Star Rail）' },
                { rank: 6, us: '动漫改编游戏专题', jp: '动漫改编游戏专题', hk: 'Apex英雄（Apex Legends）', usNonGame: true, jpNonGame: true },
            ] },
        } },
        { date: '2026-01-09', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale���', isNonGame: true },
                { rank: 2, us: '暗黑破坏神4（Diablo IV）', jp: '人中之龙游戏专题', hk: 'NBA 2K26', jpNonGame: true },
                { rank: 3, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '暗黑破坏神4（Diablo IV）', hk: '光与影:33号远征队（Clair Obscur:Expedition 33）' },
                { rank: 4, us: '原神（Genshin impact）', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: '开放世界游戏专题', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '编辑精选-年度游戏专题', usNonGame: true, hkNonGame: true },
                { rank: 6, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '原神（Genshin impact）', hk: '新游发售榜', usNonGame: true, hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '绝地求生（PUBG: Battlegrounds）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '原神（Genshin impact）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '原神（Genshin impact）' },
                { rank: 5, us: '原神（Genshin impact）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '绝区零（Zenless Zone Zero）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '足球经理26（Football Manager 26）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 2, us: '刺客信条:幻景（Assassin\'s Creed Mirage）', jp: '刺客信条:幻景（Assassin\'s Creed Mirage）', hk: '仁王3（NIOH 3）' },
                { rank: 3, us: '帝国时代4（Age of Empires IV）', jp: '帝国时代4（Age of Empires IV）', hk: '崩坏:星穹铁道（Honkai: Star Rail）' },
                { rank: 4, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '黑色沙漠（Black Desert）' },
                { rank: 5, us: '纪元117:罗马和平（Anno 117: Pax Romana）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: 'Apex英雄（Apex Legends）' },
                { rank: 6, us: '动漫改编游戏专题', jp: '动漫改编游戏专题', hk: '索尼一方工作室游戏推荐（Discover Playstation Studios）', isNonGame: true },
            ] },
        } },
        { date: '2026-01-08', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '人中之龙游戏专题', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jpNonGame: true },
                { rank: 3, us: '漫威宇宙入侵（MARVEL Cosmic Invasion）', jp: '暗黑破坏神4（Diablo IV）', hk: '绝地潜兵2（Helldivers 2）' },
                { rank: 4, us: '战地风云6（Battlefield 6）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 5, us: '跑车浪漫旅7（Gran Turismo 7）', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: 'Roguelike游戏专题', hkNonGame: true },
                { rank: 6, us: '无主之地4（Borderlands 4）', jp: '莱莎的炼金工坊游戏专题', hk: '机器人游戏专题', jpNonGame: true, hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '绝地求生（PUBG: Battlegrounds）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '我的世界（Minecraft）', hk: '绝区零（Zenless Zone Zero）' },
                { rank: 5, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '原神（Genshin impact）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '足球经理26（Football Manager 26）', jp: '无限暖暖（Infinity Nikki）', hk: '艾尔登法环:黑夜君临（Elden Ring: Nightreign）' },
                { rank: 2, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '实况足球（eFootball）', hk: '梦幻之星Online2:新起源（PSO2 New Genesis）' },
                { rank: 3, us: '刺客信条:幻景（Assassin\'s Creed Mirage）', jp: '无畏契约（VALORANT）', hk: '真·三国无双:起源（Dynasty Warriors: Origins）' },
                { rank: 4, us: '帝国时代4（Age of Empires IV）', jp: '机动战士高达 激战任务2（MOBILE SUIT GUNDAMBATTLE OPERATION 2）', hk: '铁拳8（Tekken 8）' },
                { rank: 5, us: '动漫改编游戏专题', jp: '鸣潮（Wuthering Waves）', hk: '方舟:生存进化（‌ARK: Survival Ascended）', usNonGame: true },
                { rank: 6, us: '四海兄弟:故乡（ Mafia: The Old Country）', jp: '极限国度（Riders Republic）', hk: '刺客信条:影（Assassin\'s Creed Shadows）' },
            ] },
        } },
        { date: '2026-01-07', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '人中之龙游戏专题', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jpNonGame: true },
                { rank: 3, us: '天外世界2（The Outer Worlds 2）', jp: '莱莎的炼金工坊游戏专题', hk: '绝地潜兵2（Helldivers 2）', jpNonGame: true },
                { rank: 4, us: '漫威宇宙入侵（MARVEL Cosmic Invasion）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 5, us: '跑车浪漫旅7（Gran Turismo 7）', jp: '丹生明里推荐游戏专题', hk: '机器人游戏专题', jpNonGame: true, hkNonGame: true },
                { rank: 6, us: '绝地潜兵2（Helldivers 2）', jp: '闪电十一人:英雄们的胜利之路（Inazuma Eleven: Heroes’ Victory Road）', hk: 'Roguelike游戏专题', hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '绝地求生（PUBG: Battlegrounds）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '我的世界（Minecraft）', hk: '绝区零（Zenless Zone Zero）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '鸣潮（Wuthering Waves）', hk: '原神（Genshin impact）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: '艾尔登法环:黑夜君临（Elden Ring: Nightreign）' },
                { rank: 2, us: '四海兄弟:故乡（ Mafia: The Old Country）', jp: '刺客信条:幻景（Assassin\'s Creed Mirage）', hk: '铁拳8（Tekken 8）' },
                { rank: 3, us: '荒野大镖客:救赎（Red Dead Redemption）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '方舟:生存进化（‌ARK: Survival Ascended）' },
                { rank: 4, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '帝国时代4（Age of Empires IV）', hk: '真·三国无双:起源（Dynasty Warriors: Origins）', usNonGame: true },
                { rank: 5, us: '铁拳8（Tekken 8）', jp: '足球经理26（Football Manager 26）', hk: '数码宝贝物语:时空异客（Digimon Story: Time Stranger）' },
                { rank: 6, us: '复古经典游戏专题', jp: '动漫改编游戏专题', hk: '刺客信条:影（Assassin\'s Creed Shadows）', usNonGame: true, jpNonGame: true },
            ] },
        } },
        { date: '2026-01-06', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: '暗黑破坏神4（Diablo IV）', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: '战地风云6（Battlefield 6）' },
                { rank: 3, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '暗黑破坏神4（Diablo IV）', hk: '光与影:33号远征队（Clair Obscur:Expedition 33）' },
                { rank: 4, us: '原神（Genshin impact）', jp: '人中之龙游戏专题', hk: 'PS5必玩游戏', jpNonGame: true, hkNonGame: true },
                { rank: 5, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '新游发售榜', hk: '暗黑破坏神4（Diablo IV）', usNonGame: true, jpNonGame: true },
                { rank: 6, us: '每月精选游戏', jp: '闪电十一人:英雄们的胜利之路（Inazuma Eleven: Heroes’ Victory Road）', hk: '索尼一方工作室游戏推荐（Discover Playstation Studios）', usNonGame: true, hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '绝地求生（PUBG: Battlegrounds）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '绝区零（Zenless Zone Zero）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '我的世界（Minecraft）', hk: '原神（Genshin impact）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '足球经理26（Football Manager 26）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '艾尔登法环:黑夜君临（Elden Ring: Nightreign）' },
                { rank: 2, us: '纪元117:罗马和平（Anno 117: Pax Romana）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '铁拳8（Tekken 8）' },
                { rank: 3, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: '方舟:生存进化（‌ARK: Survival Ascended）' },
                { rank: 4, us: '帝国时代4（Age of Empires IV）', jp: '帝国时代4（Age of Empires IV）', hk: '真·三国无双:起源（Dynasty Warriors: Origins）' },
                { rank: 5, us: '动漫改编游戏专题', jp: '足球经理26（Football Manager 26）', hk: '数码宝贝物语:时空异客（Digimon Story: Time Stranger）', usNonGame: true },
                { rank: 6, us: '刺客信条:幻景（Assassin\'s Creed Mirage）', jp: '四海兄弟:故乡（ Mafia: The Old Country）', hk: '刺客信条:影（Assassin\'s Creed Shadows）' },
            ] },
        } },
        { date: '2026-01-05', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'PS Plus 订阅优惠', jp: '冬季大促（Holiday Sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
                { rank: 2, us: '冬季大促（Holiday Sale）', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: '战地风云6（Battlefield 6）', usNonGame: true },
                { rank: 3, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '暗黑破坏神4（Diablo IV）', hk: '光与影:33号远征队（Clair Obscur:Expedition 33）' },
                { rank: 4, us: '跑车浪漫旅7（Gran Turismo 7）', jp: '人中之龙游戏专题', hk: 'PS5必玩游戏', jpNonGame: true, hkNonGame: true },
                { rank: 5, us: '命运2（Destiny 2）', jp: '新游发售榜', hk: '暗黑破坏神4（Diablo IV）', jpNonGame: true },
                { rank: 6, us: '暗黑破坏神4（Diablo IV）', jp: '闪电十一���:英雄们的胜利之路（Inazuma Eleven: Heroes’ Victory Road）', hk: '索尼一方工作室游戏推荐（Discover Playstation Studios）', hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '绝地求生（PUBG: Battlegrounds）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '我的世界（Minecraft）', hk: '绝区零（Zenless Zone Zero）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '足球经理26（Football Manager 26）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '铁拳8（Tekken 8）' },
                { rank: 2, us: '刺客信条:幻景（Assassin\'s Creed Mirage）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: '真·三国无双:起源（Dynasty Warriors: Origins）' },
                { rank: 3, us: '纪元117:罗马和平（Anno 117: Pax Romana）', jp: '真·三国无双:起源（Dynasty Warriors: Origins）', hk: '刺客信条:影（Assassin\'s Creed Shadows）' },
                { rank: 4, us: '帝国时代4（Age of Empires IV）', jp: '帝国时代4（Age of Empires IV）', hk: '艾尔登法环:黑夜君临（Elden Ring: Nightreign）' },
                { rank: 5, us: '温馨游戏专题（COZY GAMES）', jp: '足球经理26（Football Manager 26）', hk: '方舟:生存进化（‌ARK: Survival Ascended）', usNonGame: true },
                { rank: 6, us: '四海兄弟:故乡（ Mafia: The Old Country）', jp: '四海兄弟:故乡（ Mafia: The Old Country）', hk: '数码宝贝物语:时空异客（Digimon Story: Time Stranger）' },
            ] },
        } },
        { date: '2026-01-04', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: 'PS Plus 订阅优惠', jp: '人中之龙游戏专题', hk: '战地风云6（Battlefield 6）', usNonGame: true, jpNonGame: true },
                { rank: 3, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '暗黑破坏神4（Diablo IV）' },
                { rank: 4, us: '暗黑破坏神4（Diablo IV）', jp: '闪电十一人:英雄们的胜利之路（Inazuma Eleven: Heroes’ Victory Road）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: '跑车浪漫旅7（Gran Turismo 7）', jp: '莱莎的炼金工坊游戏专题', hk: '光与影:33号远征队（Clair Obscur:Expedition 33）', jpNonGame: true },
                { rank: 6, us: 'EA Sports FC 26', jp: 'PS5周年活动', hk: '索尼一方工作室游戏推荐（Discover Playstation Studios）', jpNonGame: true, hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '绝地求生（PUBG: Battlegrounds）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '我的世界（Minecraft）', hk: '实况足球（eFootball）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', jp: '侠盗猎车手6（Grand Theft Auto VI）', hk: '艾尔登法环:黑夜君临（Elden Ring: Nightreign）' },
                { rank: 2, us: '四海兄弟:故乡（ Mafia: The Old Country）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '数码宝贝物语:时空异客（Digimon Story: Time Stranger）', jpNonGame: true },
                { rank: 3, us: '荒野大镖客:救赎（Red Dead Redemption）', jp: '四海兄弟:故乡（ Mafia: The Old Country）', hk: '超级机器人大战Y（Super Robot Wars Y‌）' },
                { rank: 4, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', hk: '铁拳8（Tekken 8）', usNonGame: true },
                { rank: 5, us: '铁拳8（Tekken 8）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '碧蓝幻想Versus:崛起（Granblue Fantasy Versus: Rising）' },
                { rank: 6, us: '复古经典游戏专题', jp: '复古经典游戏专题', hk: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）', usNonGame: true, jpNonGame: true },
            ] },
        } },
        { date: '2025-12-31', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: 'PS Plus 订阅优惠', jp: '漫威宇宙入侵（MARVEL Cosmic Invasion）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true },
                { rank: 3, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '原神（Genshin impact）', hk: '命运2（Destiny 2）' },
                { rank: 4, us: '暗黑破坏神4（Diablo IV）', jp: '战地风云6（Battlefield 6）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 5, us: 'EA Sports FC 26', jp: '漫威争锋（Marvel Rivals）', hk: '每月精选游戏', hkNonGame: true },
                { rank: 6, us: '跑车浪漫旅7（Gran Turismo 7）', jp: '索尼一方工作室游戏推荐（Discover Playstation Studios）', hk: 'PS5必玩游戏', jpNonGame: true, hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '燕云十六声（Where Winds Meet）', hk: '卧龙:苍天陨落（Wo Long: Fallen Dynasty）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '侠盗猎车手5（Grand Theft Auto V）', hk: '只狼:影逝二度（Sekiro:Shadows Die Twice）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '足球经理26（Football Manager 26）', jp: '侠盗猎车手6（Grand Theft Auto VI）', hk: '铁拳8（Tekken 8）' },
                { rank: 2, us: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', jp: '勇者斗恶龙游戏专题', hk: '艾尔登法环:黑夜君临（Elden Ring: Nightreign）', jpNonGame: true },
                { rank: 3, us: '纪元117:罗马和平（Anno 117: Pax Romana）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '刺客信条:影（Assassin\'s Creed Shadows）', jpNonGame: true },
                { rank: 4, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', hk: '真·三国无双:起源（Dynasty Warriors: Origins）' },
                { rank: 5, us: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', jp: '四海兄弟:故乡（ Mafia: The Old Country）', hk: '方舟:生存进化（‌ARK: Survival Ascended）' },
                { rank: 6, us: '天国:拯救2（Kingdom Come:Deliverance Il）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '数码宝贝物语:时空异客（Digimon Story: Time Stranger）' },
            ] },
        } },
        { date: '2025-12-30', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'PS Plus 订阅优惠', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: '冬季大促（Holiday Sale）', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: '羊蹄山之魂（Ghost of Yōtei）', usNonGame: true },
                { rank: 3, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '2026年新作专题', hk: '侏罗纪世界:进化3（Jurassic World Evolution 3）', jpNonGame: true },
                { rank: 4, us: '漫威争锋（Marvel Rivals）', jp: '无主之地4（Borderlands 4）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: '战地风云6（Battlefield 6）', jp: '漫威争锋（Marvel Rivals）', hk: '原神（Genshin impact）' },
                { rank: 6, us: '无主之地4（Borderlands 4）', jp: '战地风云6（Battlefield 6）', hk: '编辑精选-年度游戏专题', hkNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '卧龙:苍天陨落（Wo Long: Fallen Dynasty）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '燕云十六声（Where Winds Meet）', hk: '三角洲行动（Delta Force）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '古墓丽影:崛起（Rise of The Tomb Raider）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '侠盗猎车手5（Grand Theft Auto V）', hk: '只狼:影逝二度（Sekiro:Shadows Die Twice）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '足球经理26（Football Manager 26）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 2, us: '纪元117:罗马和平（Anno 117: Pax Romana）', jp: '四海兄弟:故乡（ Mafia: The Old Country）', hk: '铁拳8（Tekken 8）' },
                { rank: 3, us: '四海兄弟:故乡（ Mafia: The Old Country）', jp: '足球经理26（Football Manager 26）', hk: '绝区零（Zenless Zone Zero）' },
                { rank: 4, us: '帝国时代4（Age of Empires IV）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '真·三国无双:起源（Dynasty Warriors: Origins）' },
                { rank: 5, us: '刺客信条:幻景（Assassin\'s Creed Mirage）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '女性角色游戏专题', hkNonGame: true },
                { rank: 6, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '帝国时代4（Age of Empires IV）', hk: '编辑精选-年度游戏专题', hkNonGame: true },
            ] },
        } },
        { date: '2025-12-29', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'PS Plus 订阅优惠', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: '冬季大促（Holiday Sale）', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: '羊蹄山之魂（Ghost of Yōtei）', usNonGame: true },
                { rank: 3, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '漫威争锋（Marvel Rivals）', hk: '侏罗纪世界:进化3（Jurassic World Evolution 3）' },
                { rank: 4, us: '漫威争锋（Marvel Rivals）', jp: '战地风云6（Battlefield 6）', hk: '编辑精选-年度游戏专题', hkNonGame: true },
                { rank: 5, us: '战地风云6（Battlefield 6）', jp: '漫威宇宙入侵（MARVEL Cosmic Invasion）', hk: '漫威争锋（Marvel Rivals）' },
                { rank: 6, us: '跑车浪漫旅7（Gran Turismo 7）', jp: '侏罗纪世界:进化3（Jurassic World Evolution 3）', hk: '漫威争锋（Marvel Rivals）' },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '卧龙:苍天陨落（Wo Long: Fallen Dynasty）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '燕云十六声（Where Winds Meet）', hk: '古墓丽影:崛起（Rise of The Tomb Raider）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '只狼:影逝二度（Sekiro:Shadows Die Twice）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '侠盗猎车手5（Grand Theft Auto V）', hk: '鸣潮（Wuthering Waves）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '足球经理26（Football Manager 26）', jp: '崩坏:星穹铁道（Honkai: Star Rail）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 2, us: '纪元117:罗马和平（Anno 117: Pax Romana）', jp: '足球经理26（Football Manager 26）', hk: '索尼一方工作室游戏推荐（Discover Playstation Studios）', hkNonGame: true },
                { rank: 3, us: '帝国时代4（Age of Empires IV）', jp: '帝国时代4（Age of Empires IV）', hk: '仁王3（NIOH 3）' },
                { rank: 4, us: '四海兄弟:故乡（ Mafia: The Old Country）', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 5, us: '刺客信条:幻景（Assassin\'s Creed Mirage）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '幻灵降世录:女巫的面纱（Lost Eidolons: Veil of the Witch）' },
                { rank: 6, us: '真·三国无双:起源（Dynasty Warriors: Origins）', jp: '刺客信条:幻景（Assassin\'s Creed Mirage）', hk: '怪物猎人:荒野（Monster Hunter Wilds）' },
            ] },
        } },
        { date: '2025-12-26', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'PS Plus 订阅优惠', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: '冬季大促（Holiday Sale）', jp: '人中之龙游戏专题', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true, jpNonGame: true },
                { rank: 3, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 4, us: '漫威争锋（Marvel Rivals）', jp: '暗黑破坏神4（Diablo IV）', hk: 'EA Sports FC 26' },
                { rank: 5, us: '战地风云6（Battlefield 6）', jp: 'EA Sports FC 26', hk: '光与影:33号远征队（Clair Obscur:Expedition 33��' },
                { rank: 6, us: '无主之地4（Borderlands 4）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '侏罗纪世界:进化3（Jurassic World Evolution 3）' },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '卧龙:苍天陨落（Wo Long: Fallen Dynasty）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '燕云十六声（Where Winds Meet）', hk: '只狼:影逝二度（Sekiro:Shadows Die Twice）' },
                { rank: 4, us: '火箭联盟（Rocket League）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 5, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '潜水员戴夫（Dave the Diver）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', jp: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', hk: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）' },
                { rank: 2, us: '四海兄弟:故乡（ Mafia: The Old Country）', jp: '勇者斗恶龙游戏专题', hk: '幻想生活i:转圈圈龙和偷取时间的少女（FANTASY LIFE i: The Girl Who Steals Time）', jpNonGame: true },
                { rank: 3, us: '荒野大镖客:救赎（Red Dead Redemption）', jp: '四海兄弟:故乡（ Mafia: The Old Country）', hk: '怪物猎人:荒野（Monster Hunter Wilds）' },
                { rank: 4, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '铁拳8（Tekken 8）', usNonGame: true, jpNonGame: true },
                { rank: 5, us: '铁拳8（Tekken 8）', jp: '复古经典游戏专题', hk: '幻兽帕鲁（Palworld）', jpNonGame: true },
                { rank: 6, us: '复古经典游戏专题', jp: '热门动画游戏专题', hk: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', usNonGame: true, jpNonGame: true },
            ] },
        } },
        { date: '2025-12-25', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: 'PS Plus 订阅优惠', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: '漫威争锋（Marvel Rivals）', usNonGame: true },
                { rank: 3, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '漫威争锋（Marvel Rivals）', hk: '侏罗纪世界:进化3（Jurassic World Evolution 3）' },
                { rank: 4, us: '跑车浪漫旅7（Gran Turismo 7）', jp: '战地风云6（Battlefield 6）', hk: 'PS5必玩游戏', hkNonGame: true },
                { rank: 5, us: '暗黑破坏神4（Diablo IV）', jp: '漫威宇宙入侵（MARVEL Cosmic Invasion）', hk: '羊蹄山之魂（Ghost of Yōtei）' },
                { rank: 6, us: '命运2（Destiny 2）', jp: '侏罗纪世界:进化3（Jurassic World Evolution 3）', hk: '原神（Genshin impact）' },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '卧龙:苍天陨落（Wo Long: Fallen Dynasty）' },
                { rank: 3, us: '燕云十六声（Where Winds Meet）', jp: '燕云十六声（Where Winds Meet）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 4, us: '模拟人生4（The Sims 4）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '只狼:影逝二度（Sekiro:Shadows Die Twice）' },
                { rank: 5, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '勇者斗恶龙10（Dragon Warrior X）', hk: '战神:诸神黄昏（God of War:Ragnarok）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', jp: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', hk: '铁拳8（Tekken 8）' },
                { rank: 2, us: '四海兄弟:故乡（ Mafia: The Old Country）', jp: '四海兄弟:故乡（ Mafia: The Old Country）', hk: '数码宝贝物语:时空异客（Digimon Story: Time Stranger）' },
                { rank: 3, us: '荒野大镖客:救赎（Red Dead Redemption）', jp: '复古经典游戏专题', hk: '超级机器人大战Y（Super Robot Wars Y‌）', jpNonGame: true },
                { rank: 4, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '艾尔登法环:黑夜君临（Elden Ring: Nightreign）', usNonGame: true, jpNonGame: true },
                { rank: 5, us: '铁拳8（Tekken 8）', jp: '纪元117:罗马和平（Anno 117: Pax Romana）', hk: '幻兽帕鲁（Palworld）' },
                { rank: 6, us: '复古经典游戏专题', jp: '新游期待榜', hk: '机动战士高达 激战任务2（MOBILE SUIT GUNDAMBATTLE OPERATION 2）', usNonGame: true, jpNonGame: true },
            ] },
        } },
        { date: '2025-12-24', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促（Holiday Sale）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: 'PS Plus 订阅优惠', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true },
                { rank: 3, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '漫威争锋（Marvel Rivals）', hk: 'EA Sports FC 26' },
                { rank: 4, us: '跑车浪漫旅7（Gran Turismo 7）', jp: '战地风云6（Battlefield 6）', hk: '光与影:33号远征队（Clair Obscur:Expedition 33）' },
                { rank: 5, us: '暗黑破坏神4（Diablo IV）', jp: '漫威宇宙入侵（MARVEL Cosmic Invasion）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 6, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '侏罗纪世界:进化3（Jurassic World Evolution 3）', hk: '侏罗纪世界:进化3（Jurassic World Evolution 3）' },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '燕云十六声（Where Winds Meet）', jp: '燕云十六声（Where Winds Meet）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '原神（Genshin impact）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '侠盗猎车手5（Grand Theft Auto V）', hk: '战神:诸神黄昏（God of War:Ragnarok）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', jp: '侠盗猎车手6（Grand Theft Auto VI）', hk: '彩虹六号:围攻X（Tom Clancy\'s Rainbow Six Siege X）' },
                { rank: 2, us: '四海兄弟:故乡（ Mafia: The Old Country）', jp: '勇者斗恶龙游戏专题', hk: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）', jpNonGame: true },
                { rank: 3, us: '荒野大镖客:救赎（Red Dead Redemption）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '植物大战僵尸:重植版（Plants vs. Zombies: Replanted）', jpNonGame: true },
                { rank: 4, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', hk: 'PS5必玩游戏', usNonGame: true, hkNonGame: true },
                { rank: 5, us: '铁拳8（Tekken 8）', jp: '四海兄弟:故乡（ Mafia: The Old Country）', hk: '索尼一方工作室游戏推荐（Discover Playstation Studios）', hkNonGame: true },
                { rank: 6, us: '复古经典游戏专题', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '幻想生活i:转圈圈龙和偷取时间的少女（FANTASY LIFE i: The Girl Who Steals Time）', usNonGame: true },
            ] },
        } },
        { date: '2025-12-23', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促-全部（Holiday Sale-see all）', jp: '冬季大促（Holiday Sale）', hk: '冬季大促（Holiday Sale）', isNonGame: true },
                { rank: 2, us: '冬季大促-畅销（Holiday Sale-best sellers）', jp: '原神（Genshin impact）', hk: '原神（Genshin impact）', usNonGame: true },
                { rank: 3, us: '冬季大促-PS5游戏（Holiday Sale-PS5 games）', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true },
                { rank: 4, us: '死亡搁浅2:冥滩之上（Death Stranding 2:On the Beach）', jp: '漫威争锋（Marvel Rivals）', hk: 'EA Sports FC 26' },
                { rank: 5, us: '冬季大促-多人游戏（Holiday Sale-multiplay games）', jp: '战地风云6（Battlefield 6）', hk: '光与影:33号远征队（Clair Obscur:Expedition 33）', usNonGame: true },
                { rank: 6, us: '冬季大促-20美元以下（Holiday Sale-games under $20）', jp: '漫威宇宙入侵（MARVEL Cosmic Invasion）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '燕云十六声（Where Winds Meet）', jp: '燕云十六声（Where Winds Meet）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '赛博朋克2077（Cyberpunk 2077）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '侠盗猎车手5（Grand Theft Auto V）', hk: '对马岛之魂（Ghost of Tsushima）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', jp: '侠盗猎车手6（Grand Theft Auto VI）', hk: '幻兽帕鲁（Palworld）' },
                { rank: 2, us: '四海兄弟:故乡（ Mafia: The Old Country）', jp: '勇者斗恶龙游戏专题', hk: '幻想生活i:转圈圈龙和偷取时间的少女（FANTASY LIFE i: The Girl Who Steals Time）', jpNonGame: true },
                { rank: 3, us: '荒野大镖客:救赎（Red Dead Redemption）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '最终幻想14（Final Fantasy XIV）', jpNonGame: true },
                { rank: 4, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', hk: '机动战士高达 激战任务2（MOBILE SUIT GUNDAMBATTLE OPERATION 2）', usNonGame: true },
                { rank: 5, us: '铁拳8（Tekken 8）', jp: '四海兄弟:故乡（ Mafia: The Old Country）', hk: '铁拳8（Tekken 8）' },
                { rank: 6, us: '复古经典游戏专题', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', usNonGame: true },
            ] },
        } },
        { date: '2025-12-22', slots: {
            'Must See': { positions: [
                { rank: 1, us: '冬季大促-全部（Holiday Sale-see all）', jp: '冬季大促-全部（Holiday Sale-see all）', hk: '战地风云6（Battlefield 6）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: '冬季大促-畅销（Holiday Sale-best sellers）', jp: '冬季大促-畅销（Holiday Sale-best sellers）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true, jpNonGame: true },
                { rank: 3, us: '冬季大促-PS5游戏（Holiday Sale-PS5 games）', jp: '冬季大促-PS5游戏（Holiday Sale-PS5 games）', hk: 'EA Sports FC 26', usNonGame: true, jpNonGame: true },
                { rank: 4, us: '死亡搁浅2:冥滩之上（Death Stranding 2:On the Beach）', jp: '死亡搁浅2:冥滩之上（Death Stranding 2:On the Beach）', hk: '羊蹄山之魂（Ghost of Yōtei）' },
                { rank: 5, us: '冬季大促-多人游戏（Holiday Sale-multiplay games）', jp: '冬季大促-多人游戏（Holiday Sale-multiplay games）', hk: 'ARC Raiders', usNonGame: true, jpNonGame: true },
                { rank: 6, us: '冬季大促-20美元以下（Holiday Sale-games under $20）', jp: '冬季大促-2000日元以下（Holiday Sale-games under 円2000）', hk: '跑车浪漫旅7（Gran Turismo 7）', usNonGame: true, jpNonGame: true },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '燕云十六声（Where Winds Meet）', jp: '燕云十六声（Where Winds Meet）', hk: '三角洲行动（Delta Force）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '原神（Genshin impact）' },
                { rank: 5, us: '漫威争锋（Marvel Rivals）', jp: '侠盗猎车手5（Grand Theft Auto V）', hk: '我的世界（Minecraft）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', jp: '侠盗猎车手6（Grand Theft Auto VI）', hk: '幻兽帕鲁（Palworld）' },
                { rank: 2, us: '四海兄弟:故乡（ Mafia: The Old Country）', jp: '勇者斗恶龙游戏专题', hk: '最终幻想14（Final Fantasy XIV）', jpNonGame: true },
                { rank: 3, us: '���野大镖客:救赎（Red Dead Redemption）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '刺客信条:影（Assassin\'s Creed Shadows）', jpNonGame: true },
                { rank: 4, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', hk: '机动战士高达 激战任务2（MOBILE SUIT GUNDAMBATTLE OPERATION 2）', usNonGame: true },
                { rank: 5, us: '铁拳8（Tekken 8）', jp: '四海兄弟:故乡（ Mafia: The Old Country）', hk: '铁拳8（Tekken 8）' },
                { rank: 6, us: '复古经典游戏专题', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '真·三国无双:起源（Dynasty Warriors: Origins）', usNonGame: true },
            ] },
        } },
        { date: '2025-12-19', slots: {
            'Must See': { positions: [
                { rank: 1, us: 'PS Plus 订阅优惠', jp: '1500日元以下促销活动（GAMES UNDER 円15）', hk: '战地风云6（Battlefield 6）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: '15美元以下促销活动（GAMES UNDER $15）', jp: '年终特惠（END OF YEAR DEALS）', hk: '鬼灭之刃:火之神血风谭2（Demon Slayer: Kimetsu no Yaiba – The Hinokami Chronicles 2）', usNonGame: true, jpNonGame: true },
                { rank: 3, us: '年终特惠（END OF YEAR DEALS）', jp: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', hk: '绝区零（Zenless Zone Zero）', usNonGame: true },
                { rank: 4, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '漫威争锋（Marvel Rivals）', hk: '格斗游戏专题（FIGHTING GAMES）', hkNonGame: true },
                { rank: 5, us: '漫威争锋（Marvel Rivals）', jp: '战地风云6（Battlefield 6）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 6, us: '战地风云6（Battlefield 6）', jp: '漫威宇宙入侵（MARVEL Cosmic Invasion）', hk: '非生物因素（Abiotic Factor）' },
            ] },
            'Top games in your country': { positions: [
                { rank: 1, us: '燕云十六声（Where Winds Meet）', jp: '燕云十六声（Where Winds Meet）', hk: '燕云十六声（Where Winds Meet）' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '鸣潮（Wuthering Waves）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '双人成行（It Takes Two）' },
                { rank: 4, us: '终结者2D:NO FATE（Terminator2D:NO FATE）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '原神（Genshin impact）' },
                { rank: 5, us: '漫威争锋（Marvel Rivals）', jp: '侠盗猎车手5（Grand Theft Auto V）', hk: '霍格沃茨之遗（Hogwarts Legacy）' },
            ] },
            "What's hot": { positions: [
                { rank: 1, us: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', jp: '侠盗猎车手6（Grand Theft Auto VI）', hk: '麦登橄榄球26（Madden NFL 26）' },
                { rank: 2, us: '四海兄弟:故乡（ Mafia: The Old Country）', jp: '勇者斗恶龙游戏专题', hk: '最终幻想14（Final Fantasy XIV）', jpNonGame: true },
                { rank: 3, us: '荒野大镖客:救赎（Red Dead Redemption）', jp: '生化危机游戏专题（RESIDENT EVIL）', hk: '机动战士高达 激战任务2（MOBILE SUIT GUNDAMBATTLE OPERATION 2）', jpNonGame: true },
                { rank: 4, us: '生化危机游戏专题（RESIDENT EVIL）', jp: '潜龙谍影3:食蛇者（Metal Gear Solid 3:Snake Eater）', hk: '幻兽帕鲁（Palworld）', usNonGame: true },
                { rank: 5, us: '铁拳8（Tekken 8）', jp: '四海兄弟:故乡（ Mafia: The Old Country）', hk: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）' },
                { rank: 6, us: '复古经典游戏专题', jp: '三国志8重制版（Romance of the Three Kingdoms 8 Remake）', hk: '彩虹六号:围攻X（Tom Clancy\'s Rainbow Six Siege X）', usNonGame: true },
            ] },
        } },
    ],
    Xbox: [
        { date: '2026-03-16', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '新发行游戏', hkNonGame: true },
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: 'Game Pass 会员优惠' },
                { rank: 2, us: 'This Week on Xbox', jp: '棋牌卡牌游戏', hk: '失落星船:马拉松（Marathon）' },
                { rank: 2, us: 'WWE 2K26', jp: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', hk: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）' },
                { rank: 3, us: '无障碍功能游戏（Accessibility in games）', jp: '零红蝶', hk: '无障碍功能游戏（Accessibility in games）', usNonGame: true, hkNonGame: true },
                { rank: 3, us: '平台游戏（Platformer games）', jp: '动视发行商特卖（Activision）', hk: 'WWE 2K26' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '刺客信条:影（Assassin\'s Creed Shadows）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: 'The Outlast Trials' },
                { rank: 1, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '暗黑破坏神4（Diablo IV）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 2, us: '刺客信条:影（Assassin\'s Creed Shadows）', jp: '失落星船:马拉松（Marathon）', hk: 'Maneater Apex' },
                { rank: 2, us: '死亡岛2（Dead Island 2）', jp: 'Tony Hawk’s™ Pro Skater™', hk: 'EA Sports FC 26' },
                { rank: 3, us: '阿凡达:潘多拉边境（Avatar: Frontiers of Pandora）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: 'Descenders' },
                { rank: 3, us: '失落星船:马拉松（Marathon）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '我的世界（Minecraft）' },
                { rank: 4, us: '星球大战：亡命之徒（Star Wars Outlaws）', jp: 'ARC Raiders', hk: 'High On Life' },
                { rank: 4, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '使命召唤:黑色行动2（Call of Duty:Black Ops2）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 5, us: '彩虹六号:围攻X（Tom Clancy\'s Rainbow Six Siege X）', jp: 'NBA 2K26', hk: 'Car Mechanic Simulator 2021' },
                { rank: 5, us: 'ARC Raiders', jp: '使命召唤:黑色行动3（Call of Duty:Black Ops3）', hk: '赛博朋克2077（Cyberpunk 2077）' },
                { rank: 6, us: '全境封锁（Tom Clancy\'s The Division）', jp: 'EA Sports FC 26', hk: 'ON THE ROAD' },
                { rank: 6, us: 'NBA 2K26', jp: '只狼:影逝二度（Sekiro:Shadows Die Twice）', hk: '双人成行（It Takes Two）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: 'WWE 2K26', jp: '使命召唤:战区（Call of Duty:Warzone）', hk: '使命召唤:战区（Call of Duty:Warzone）' },
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '使命召唤:战区（Call of Duty:Warzone）', hk: '使命召唤:战区（Call of Duty:Warzone）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '毒液突击队（John Carpenter\'s Toxic Commando）', jp: 'WWE 2K26', hk: 'WWE 2K26' },
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: 'WWE 2K26', hk: 'WWE 2K26' },
                { rank: 2, us: '使命召唤:战区（Call of Duty:Warzone）', jp: '毒液突击队（John Carpenter\'s Toxic Commando）', hk: '毒液突击队（John Carpenter\'s Toxic Commando）' },
                { rank: 2, us: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', jp: '毒液突击队（John Carpenter\'s Toxic Commando）', hk: '毒液突击队（John Carpenter\'s Toxic Commando）' },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', hk: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）' },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', hk: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '上古卷轴OL（The Elder Scrolls Online）', usNonGame: true, jpNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '上古卷轴OL（The Elder Scrolls Online）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '勇气默示录 FLYING FAIRY（Bravely Default Flying Fairy）', jp: '勇气默示录 FLYING FAIRY（Bravely Default Flying Fairy）', hk: '勇气默示录 FLYING FAIRY（Bravely Default Flying Fairy）' },
                { rank: 1, us: '使命召唤:战区（Call of Duty:Warzone）', jp: '使命召唤:战区（Call of Duty:Warzone）', hk: '使命召唤:战区（Call of Duty:Warzone）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '极限竞速:地平线6（Forza Horizon 6）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '极限竞速:地平线6（Forza Horizon 6）' },
                { rank: 1, us: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', jp: 'WWE 2K26', hk: 'WWE 2K26' },
                { rank: 2, us: 'WWE 2K26', jp: 'WWE 2K26', hk: 'WWE 2K26' },
                { rank: 2, us: '勇气默示录 FLYING FAIRY（Bravely Default Flying Fairy）', jp: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', hk: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）' },
            ] },
        } },
        { date: '2026-03-13', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '策略游戏专题（Strategy games）', jp: 'Game Pass 会员优惠', hk: '平台游戏（Platformer games）' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '育碧发行商特卖（Ubisoft）' },
                { rank: 3, us: '育碧发行商特卖（Ubisoft）', jp: '失落星船:马拉松（Marathon）', hk: '动视发行商特卖（Activision）', hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: 'The Outlast Trials', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 2, us: 'Maneater Apex', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '死亡岛2（Dead Island 2）' },
                { rank: 3, us: 'Descenders', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 4, us: 'High On Life', jp: 'ARC Raiders', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 5, us: 'Car Mechanic Simulator 2021', jp: '地铁:离去（Metro Exodus）', hk: 'ARC Raiders' },
                { rank: 6, us: 'ON THE ROAD', jp: '我的世界（Minecraft）', hk: 'NBA 2K26' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '使命召唤:战区（Call of Duty:Warzone）', jp: '使命召唤:战区（Call of Duty:Warzone）', hk: '使命召唤:战区（Call of Duty:Warzone）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: 'WWE 2K26', jp: 'WWE 2K26', hk: 'WWE 2K26' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: '毒液突击队（John Carpenter\'s Toxic Commando）', hk: '毒液突击队（John Carpenter\'s Toxic Commando）' },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', hk: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '上古卷轴OL（The Elder Scrolls Online）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', jp: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', hk: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '暗黑破坏神4（Diablo IV）', jp: '暗黑破坏神4（Diablo IV）', hk: '暗黑破坏神4（Diablo IV）' },
                { rank: 2, us: '零红蝶', jp: '零红蝶', hk: '零红蝶' },
            ] },
        } },
        { date: '2026-03-12', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '艾恩葛朗特 回荡新声（Echoes of Aincrad）' },
                { rank: 2, us: '暗黑破坏神4（Diablo IV）', jp: '无障碍功能游戏（Accessibility in games）', hk: '游戏优惠', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '失落星船:马拉松（Marathon）', jp: '艾恩葛朗特 回荡新声（Echoes of Aincrad）', hk: '育碧发行商特卖（Ubisoft）', hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: 'Planet of Lana II', jp: 'The Outlast Trials', hk: '暗黑破坏神4（Diablo IV）' },
                { rank: 2, us: 'Hidden Cats in Spooky Village', jp: '星光卡丁车竞赛（Starlit Kart Racing）', hk: 'Tony Hawk’s™ Pro Skater™' },
                { rank: 3, us: '1 CatLine', jp: '精灵与萤火意志（Ori and the Will of the Wisps）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 4, us: 'Temari Trials: Dojo\'s Test', jp: '我的世界（Minecraft）', hk: '使命召唤:黑色行动2（Call of Duty:Black Ops2）' },
                { rank: 5, us: 'Temari Trials: Dojo\'s Test', jp: '狂野飙车9:竞速传奇（Asphalt Legends）', hk: '使命召唤:黑色行动3（Call of Duty:Black Ops3）' },
                { rank: 6, us: 'SwitchBlasters', jp: '原神（Genshin impact）', hk: '只狼:影逝二度（Sekiro:Shadows Die Twice）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: 'WWE 2K26', hk: 'WWE 2K26' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '动视发行商特卖（Activision）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）', usNonGame: true },
                { rank: 2, us: 'WWE 2K26', jp: '动视发行商特卖（Activision）', hk: '动视发行商特卖（Activision）', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 4, us: '趋势游戏（Trending���', jp: '趋势游戏（Trending）', hk: '艾恩葛朗特 回荡新声（Echoes of Aincrad）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: 'NBA 2K26', jp: 'NBA 2K26', hk: 'NBA 2K26' },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
            ] },
        } },
        { date: '2026-03-11', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '角色扮演游戏专题（Role-playing games）', jp: '艾恩葛朗特 回荡新声（Echoes of Aincrad）', hk: 'Planet of Lana II', usNonGame: true },
                { rank: 2, us: 'Women\'s History Month', jp: '育碧发行商特卖（Ubisoft）', hk: '育碧发行商特卖（Ubisoft）', isNonGame: true },
                { rank: 3, us: '艾恩葛朗特 回荡新声（Echoes of Aincrad）', jp: '失落星船:马拉松（Marathon）', hk: '无障碍功能游戏（Accessibility in games）', hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '暗黑破坏神4（Diablo IV）', jp: '赛博朋克2077（Cyberpunk 2077）', hk: '战地风云6（Battlefield 6）' },
                { rank: 2, us: 'Tony Hawk’s™ Pro Skater™', jp: '星光卡丁车竞赛（Starlit Kart Racing）', hk: '严阵以待（Ready or Not）' },
                { rank: 3, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '精灵与萤火意志（Ori and the Will of the Wisps）', hk: '刺客信条:影（Assassin\'s Creed Shadows）' },
                { rank: 4, us: '使命召唤:黑色行动2（Call of Duty:Black Ops2）', jp: '我的世界（Minecraft）', hk: '索尼克赛车:交叉世界（Sonic Racing: CrossWorlds‌）' },
                { rank: 5, us: '使命召唤:黑色行动3（Call of Duty:Black Ops3）', jp: '狂野飙车9:竞速传奇（Asphalt Legends）', hk: '霍格沃茨之遗（Hogwarts Legacy）' },
                { rank: 6, us: '只狼:影逝二度（Sekiro:Shadows Die Twice）', jp: '崩解（Unravel）', hk: '灾后修复师（RoadCraft）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '育碧发行商特卖（Ubisoft）', jp: 'WWE 2K26', hk: 'WWE 2K26', usNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '动视发行商特卖（Activision）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）', usNonGame: true },
                { rank: 2, us: 'WWE 2K26', jp: '动视发行商特卖（Activision）', hk: '动视发行商特卖（Activision）', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '艾恩葛朗特 回荡新声（Echoes of Aincrad）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '失落星船:马拉松（Marathon）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: 'NBA 2K26', jp: '堡垒之夜（Fortnite）', hk: 'NBA 2K26' },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '失落星船:马拉松（Marathon）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
            ] },
        } },
        { date: '2026-03-10', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '无障碍功能游戏（Accessibility in games）', isNonGame: true },
                { rank: 2, us: '赛车飞行游戏专题（Racing and flying games）', jp: '射击游戏专题', hk: '动视发行商特卖（Activision）', isNonGame: true },
                { rank: 3, us: '动视发行商特卖（Activision）', jp: 'Xbox Play Anywhere', hk: '新发行游戏', isNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '星光卡丁车竞赛（Starlit Kart Racing）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 2, us: '使命召唤:战区（Call of Duty:Warzone）', jp: '我的世界（Minecraft）', hk: 'EA Sports FC 26' },
                { rank: 3, us: '狂野飙车9:竞速传奇（Asphalt Legends）', jp: '原神（Genshin impact）', hk: '我的世界（Minecraft）' },
                { rank: 4, us: '彩虹六号:围攻X（Tom Clancy\'s Rainbow Six Siege X）', jp: '精灵与萤火意志（Ori and the Will of the Wisps）', hk: '双人成行（It Takes Two）' },
                { rank: 5, us: '实况足球（eFootball）', jp: '实况足球（eFootball）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 6, us: '罗布乐思（Roblox）', jp: '极限竞速:地平线5（Forza Horizon 5）', hk: '黑神话:悟空（Black Myth: Wukong）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '育碧发行商特卖（Ubisoft）', jp: 'WWE 2K26', hk: 'WWE 2K26', usNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 2, us: 'Women\'s History Month', jp: '动视发行商特卖（Activision）', hk: '动视发行商特卖（Activision）', isNonGame: true },
                { rank: 3, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '艾恩葛朗特 回荡新声（Echoes of Aincrad）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '极限竞速:地平线6（Forza Horizon 6）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '极限竞速:地平线6（Forza Horizon 6）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '堡垒之夜（Fortnite）' },
                { rank: 2, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
            ] },
        } },
        { date: '2026-03-09', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '最佳评选游戏特卖（Best rated sale）', jp: 'Game Pass 会员优惠', hk: '最佳评选游戏特卖（Best rated sale）', isNonGame: true },
                { rank: 2, us: '游戏小样（Game demos）', jp: 'Deep Silver与好友特卖', hk: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', usNonGame: true, jpNonGame: true },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: 'Planet of Lana II', hk: '动视发行商特卖（Activision）', hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '天国:拯救2（Kingdom Come:Deliverance Il）', jp: '暗黑破坏神4（Diablo IV）', hk: '战地风云6（Battlefield 6）' },
                { rank: 2, us: '死亡岛2（Dead Island 2）', jp: 'Tony Hawk’s™ Pro Skater™', hk: '严阵以待（Ready or Not）' },
                { rank: 3, us: 'Undisputed', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '刺客信条:影（Assassin\'s Creed Shadows）' },
                { rank: 4, us: '地铁:离去（Metro Exodus）', jp: '使命召唤:黑色行动2（Call of Duty:Black Ops2）', hk: '索尼克赛车:交叉世界（Sonic Racing: CrossWorlds‌）' },
                { rank: 5, us: 'RIDE 5', jp: '使命召唤:黑色行动3（Call of Duty:Black Ops3）', hk: '霍格沃茨之遗（Hogwarts Legacy）' },
                { rank: 6, us: 'Agents of Mayhem', jp: '只狼:影逝二度（Sekiro:Shadows Die Twice）', hk: '灾后修复师（RoadCraft）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '动视发行商特卖（Activision）', jp: '动视发行商特卖（Activision）', hk: '动视发行商特卖（Activision）', isNonGame: true },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '艾恩葛朗特 回荡新声（Echoes of Aincrad）', hk: '艾恩葛朗特 回荡新声（Echoes of Aincrad）' },
                { rank: 3, us: 'WWE 2K26', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '最佳评选游戏特卖（Best rated sale）', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '堡垒之夜（Fortnite）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
            ] },
        } },
        { date: '2026-03-06', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '战地风云6（Battlefield 6）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: 'Women\'s History Month', jp: '无障碍功能游戏（Accessibility in games）', hk: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', usNonGame: true, jpNonGame: true },
                { rank: 3, us: '无障碍功能游戏（Accessibility in games）', jp: '动视发行商特卖（Activision）', hk: '失落星船:马拉松（Marathon）', usNonGame: true, jpNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '天国:拯救2（Kingdom Come:Deliverance Il）', hk: '暗黑破坏神4（Diablo IV）' },
                { rank: 2, us: '使命召唤:战区（Call of Duty:Warzone）', jp: '实况足球（eFootball）', hk: 'Tony Hawk’s™ Pro Skater™' },
                { rank: 3, us: '狂野飙车9:竞速传奇（Asphalt Legends）', jp: '星光卡丁车竞赛（Starlit Kart Racing）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 4, us: '实况足球（eFootball）', jp: '我的世界（Minecraft）', hk: '使命召唤:黑色行动2（Call of Duty:Black Ops2）' },
                { rank: 5, us: '彩虹六号:围攻X（Tom Clancy\'s Rainbow Six Siege X）', jp: '狂野飙车9:竞速传奇（Asphalt Legends）', hk: '使命召唤:黑色行动3（Call of Duty:Black Ops3）' },
                { rank: 6, us: '罗布乐思（Roblox）', jp: '极限竞速:地平线5（Forza Horizon 5）', hk: '只狼:影逝二度（Sekiro:Shadows Die Twice）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '动视发行商特卖（Activision）', hk: '动视发行商特卖（Activision）', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: '动视发行商特卖（Activision）', jp: '艾恩葛朗特 回荡新声（Echoes of Aincrad）', hk: '艾恩葛朗特 回荡新声（Echoes of Aincrad）', usNonGame: true },
                { rank: 3, us: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '最佳评选游戏特卖（Best rated sale）', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '艾恩葛朗特 回荡新声（Echoes of Aincrad）', jp: '艾恩葛朗特 回荡新声（Echoes of Aincrad）', hk: '艾恩葛朗特 回荡新声（Echoes of Aincrad）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '动视发行商特卖（Activision）', jp: '动视发行商特卖（Activision）', hk: '动视发行商特卖（Activision）', isNonGame: true },
                { rank: 2, us: '2K发行商特卖（2K Publisher Sale）', jp: '2K发行商特卖（2K Publisher Sale）', hk: '2K发行商特卖（2K Publisher Sale）', isNonGame: true },
            ] },
        } },
        { date: '2026-03-05', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Women\'s History Month', jp: 'Game Pass 会员优惠', hk: '最佳评选游戏特卖（Best rated sale）', isNonGame: true },
                { rank: 2, us: '热门免费游戏（Top free games）', jp: '无障碍功能游戏（Accessibility in games）', hk: '战地风云6（Battlefield 6）', usNonGame: true, jpNonGame: true },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: 'Xbox Play Anywhere', hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '天国:拯救2（Kingdom Come:Deliverance Il）', jp: '天国:拯救2（Kingdom Come:Deliverance Il）', hk: '天国:拯救2（Kingdom Come:Deliverance Il）' },
                { rank: 2, us: '死亡岛2（Dead Island 2）', jp: 'Undisputed', hk: '实况足球（eFootball）' },
                { rank: 3, us: 'Undisputed', jp: '地铁:离去（Metro Exodus）', hk: '星光卡丁车竞赛（Starlit Kart Racing）' },
                { rank: 4, us: '地铁:离去（Metro Exodus）', jp: 'RIDE 5', hk: '我的世界（Minecraft）' },
                { rank: 5, us: 'RIDE 5', jp: 'Akimbot', hk: '狂野飙车9:竞速传奇（Asphalt Legends）' },
                { rank: 6, us: 'Agents of Mayhem', jp: 'Chorus', hk: '极限竞速:地平线5（Forza Horizon 5）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）', hk: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: 'WWE 2K26', jp: 'Deep Silver与好友特卖', hk: 'Deep Silver与好友特卖', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: '毒液突击队（John Carpenter\'s Toxic Commando）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: 'Towerborne', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '极限竞速:地平线6（Forza Horizon 6）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '辐射76（Fallout 76）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: 'WWE 2K26', jp: '动视发行商特卖（Activision）', hk: '动视发行商特卖（Activision）', jpNonGame: true, hkNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: 'Women\'s History Month', jp: 'WWE 2K26', hk: 'WWE 2K26', usNonGame: true },
                { rank: 2, us: '毒液突击队（John Carpenter\'s Toxic Commando）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
            ] },
        } },
        { date: '2026-03-04', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: 'DLC Sale', isNonGame: true },
                { rank: 2, us: 'Women\'s History Month', jp: '无障碍功能游戏（Accessibility in games）', hk: '游戏示范', isNonGame: true },
                { rank: 3, us: 'Game deals', jp: '热门精选（Hits You Can\'t Miss）', hk: '怪物猎人物语3:命运双龙（Monster Hunter Stories 3: TWISTED REFLECTION）', usNonGame: true, jpNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '天国:拯救2���Kingdom Come:Deliverance Il）', jp: '天国:拯救2（Kingdom Come:Deliverance Il）', hk: '天国:拯救2（Kingdom Come:Deliverance Il）' },
                { rank: 2, us: '星光卡丁车竞赛（Starlit Kart Racing）', jp: 'Undisputed', hk: '星光卡丁车竞赛（Starlit Kart Racing）' },
                { rank: 3, us: '我的世界（Minecraft）', jp: '地铁:离去（Metro Exodus）', hk: '我的世界（Minecraft）' },
                { rank: 4, us: '崩解（Unravel）', jp: 'RIDE 5', hk: '崩解（Unravel）' },
                { rank: 5, us: '狂野飙车9:竞速传奇（Asphalt Legends）', jp: 'Akimbot', hk: '狂野飙车9:竞速传奇（Asphalt Legends）' },
                { rank: 6, us: '精灵与萤火意志（Ori and the Will of the Wisps）', jp: 'Chorus', hk: '精灵与萤火意志（Ori and the Will of the Wisps）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）', hk: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: 'Deep Silver与好友特卖', hk: 'Deep Silver与好友特卖', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: '毒液突击队（John Carpenter\'s Toxic Commando）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 3, us: 'Towerborne', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '极限竞速:地平线6（Forza Horizon 6）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '辐射76（Fallout 76）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: 'Deep Silver与好友特卖', jp: 'Deep Silver与好友特卖', hk: 'Deep Silver与好友特卖', isNonGame: true },
                { rank: 2, us: 'DLC Sale', jp: 'DLC Sale', hk: 'DLC Sale', isNonGame: true },
            ] },
        } },
        { date: '2026-03-03', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'DLC Sale', jp: '生化危机:安魂曲（Resident Evil: Requiem��', hk: 'DLC Sale', usNonGame: true, hkNonGame: true },
                { rank: 2, us: '战地风云6（Battlefield 6）', jp: 'Deep Silver与好友特卖', hk: '热门精选（Hits You Can\'t Miss）', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '热门精选（Hits You Can\'t Miss）', jp: 'WWE 2K26', hk: '生化危机:安魂曲（Resident Evil: Requiem）', usNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '超自然车旅（Pacific Drive）', jp: '堡垒之夜（Fortnite）', hk: '星光卡丁车竞赛（Starlit Kart Racing）' },
                { rank: 2, us: '消逝的光芒：困兽（Dying Light: The Beast）', jp: '使命召唤:战区（Call of Duty:Warzone）', hk: '我的世界（Minecraft）' },
                { rank: 3, us: '深岩银河：幸存者（Deep Rock Galactic:Survivor）', jp: '狂野飙车9:竞速传奇（Asphalt Legends）', hk: '实况足球（eFootball）' },
                { rank: 4, us: '侏罗纪世界:进化3（Jurassic World Evolution 3）', jp: '实况足球（eFootball）', hk: '原神（Genshin impact）' },
                { rank: 5, us: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）', jp: '彩虹六号:围攻X（Tom Clancy\'s Rainbow Six Siege X）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 6, us: '1000xRESIST', jp: '罗布乐思（Roblox）', hk: '狂野飙车9:竞速传奇（Asphalt Legends）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: 'Towerborne', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '热门精选（Hits You Can\'t Miss）', jp: 'Towerborne', hk: 'Towerborne', usNonGame: true },
                { rank: 2, us: 'WWE 2K26', jp: 'DLC Sale', hk: 'DLC Sale', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '嗨嗨人生2（High On Life 2）', jp: '热门精选（Hits You Can\'t Miss）', hk: '热门精选（Hits You Can\'t Miss）', jpNonGame: true, hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '卡牌店模拟器（TCG Card Shop Simulator）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: 'Xbox Play Anywhere', jp: 'Xbox Play Anywhere', hk: 'Xbox Play Anywhere', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 2, us: '奇异人生:重聚（Life is Strange: Reunion）', jp: '奇异人生:重聚（Life is Strange: Reunion）', hk: '奇异人生:重聚（Life is Strange: Reunion）' },
            ] },
        } },
        { date: '2026-03-02', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '生灵重塑（Reanimal）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: 'WWE 2K26', jp: '战地风云6（Battlefield 6）', hk: '热门付费游戏（Top paid games）', hkNonGame: true },
                { rank: 3, us: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）', jp: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）', hk: 'WWE 2K26' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: 'Alex the Rabbit', hk: '超自然车旅（Pacific Drive）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: 'Alex the Rabbit', hk: '消逝的光芒：困兽（Dying Light: The Beast）' },
                { rank: 3, us: '我的世界（Minecraft）', jp: 'Musical Vibes RX', hk: '深岩银河：幸存者（Deep Rock Galactic:Survivor）' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: 'Outbreak: Shades of Horror', hk: '侏罗纪世界:进化3（Jurassic World Evolution 3）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '肋萨拉：顶峰王国（Laysara: Summit Kingdom）', hk: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）' },
                { rank: 6, us: '彩虹六号:围攻X（Tom Clancy\'s Rainbow Six Siege X）', jp: '10 Casual Games', hk: '1000xRESIST' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: 'Towerborne', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: 'Towerborne', hk: 'Towerborne' },
                { rank: 2, us: 'WWE 2K26', jp: 'DLC Sale', hk: 'DLC Sale', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '嗨嗨人生2（High On Life 2）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '热门精选（Hits You Can\'t Miss）', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: 'Xbox Play Anywhere', jp: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）', hk: 'Xbox Play Anywhere', usNonGame: true, hkNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 2, us: '失落星船:马拉松（Marathon）', jp: '奇异人生:重聚（Life is Strange: Reunion）', hk: '失落星船:马拉松（Marathon）' },
            ] },
        } },
        { date: '2026-02-27', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: 'DLC Sale', isNonGame: true },
                { rank: 2, us: '天国:拯救2（Kingdom Come:Deliverance Il）', jp: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）', hk: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）' },
                { rank: 3, us: 'DLC Sale', jp: '天国:拯救2（Kingdom Come:Deliverance Il）', hk: '热门精选（Hits You Can\'t Miss）', usNonGame: true, hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '我的世界（Minecraft）', jp: 'Emoji Battlefield', hk: '超自然车旅（Pacific Drive）' },
                { rank: 2, us: '狂野飙车9:竞速传奇（Asphalt Legends）', jp: '数独Relax（Suduko Relax）', hk: '消逝的光芒：困兽（Dying Light: The Beast）' },
                { rank: 3, us: '星光卡丁车竞赛（Starlit Kart Racing）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '深岩银河：幸存者（Deep Rock Galactic:Survivor）' },
                { rank: 4, us: '实况足球（eFootball）', jp: 'Solar Machina', hk: '侏罗纪世界:进化3（Jurassic World Evolution 3）' },
                { rank: 5, us: '精灵与萤火意志（Ori and the Will of the Wisps）', jp: 'Wild West Tycoon', hk: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）' },
                { rank: 6, us: '原神（Genshin impact）', jp: 'Solar Machina', hk: '1000xRESIST' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: 'Towerborne', hk: 'Towerborne' },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: 'DLC Sale', hk: 'DLC Sale', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: 'Towerborne', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '热门精选（Hits You Can\'t Miss）', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: 'Deep Silver与好友特卖', jp: '失落星船:马拉松（Marathon）', hk: 'Deep Silver与好友特卖', usNonGame: true, hkNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '热门精选（Hits You Can\'t Miss）', jp: '战地风云6（Battlefield 6）', hk: '热门精选（Hits You Can\'t Miss）', usNonGame: true, hkNonGame: true },
                { rank: 2, us: 'WWE 2K26', jp: '卡牌店模拟器（TCG Card Shop Simulator）', hk: 'WWE 2K26' },
            ] },
        } },
        { date: '2026-02-26', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: '战地风云6（Battlefield 6）', hk: '战地风云6（Battlefield 6）', usNonGame: true },
                { rank: 2, us: '罗布乐思（Roblox）', jp: 'Deep Silver与好友特卖', hk: 'WWE 2K26', jpNonGame: true },
                { rank: 3, us: 'Black History Month', jp: '堡垒之夜（Fortnite）', hk: 'Deep Silver与好友特卖', usNonGame: true, hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '精灵与萤火意志（Ori and the Will of the Wisps）', hk: '使命召唤:战区（Call of Duty:Warzone）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '茶杯头（Cuphead）', hk: '狂野飙车9:竞速传奇（Asphalt Legends）' },
                { rank: 3, us: '我的世界（Minecraft）', jp: '我的世界（Minecraft）', hk: '实况足球（eFootball）' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '黑神话:悟空（Black Myth: Wukong）', hk: '罗布乐思（Roblox）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '实况足球（eFootball）', hk: '彩虹六号:围攻X（Tom Clancy\'s Rainbow Six Siege X）' },
                { rank: 6, us: '彩虹六号:围攻X（Tom Clancy\'s Rainbow Six Siege X）', jp: '空洞骑士:丝之歌（Hollow Knight: Song of Silk）', hk: 'EA Sports FC 26' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）', jp: 'Deep Silver与好友特卖', hk: 'Deep Silver与好友特卖', jpNonGame: true, hkNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '战地风云6（Battlefield 6）', jp: '热门精选（Hits You Can\'t Miss）', hk: '热门精选（Hits You Can\'t Miss）', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: '嗨嗨人生2（High On Life 2）', jp: '奇异人生:重聚（Life is Strange: Reunion）', hk: '奇异人生:重聚（Life is Strange: Reunion）' },
                { rank: 3, us: '2XKO', jp: '卡牌店模拟器（TCG Card Shop Simulator）', hk: '卡牌店模拟器（TCG Card Shop Simulator）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: 'EA Sports FC 26', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: 'WWE 2K26', jp: 'WWE 2K26', hk: 'WWE 2K26' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: '战地风云6（Battlefield 6）' },
                { rank: 2, us: '卡牌店模拟器（TCG Card Shop Simulator）', jp: '卡牌店模拟器（TCG Card Shop Simulator）', hk: '卡牌店模拟器（TCG Card Shop Simulator）' },
            ] },
        } },
        { date: '2026-02-25', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: '农历新年促销（Lunar New Year sale）', hk: '热门付费游戏（Top paid games）', isNonGame: true },
                { rank: 2, us: 'WWE 2K26', jp: '新游发售榜', hk: 'Deep Silver与好友特卖', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '农历新年促销（Lunar New Year sale）', jp: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）', hk: 'WWE 2K26', usNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '天国:拯救2（Kingdom Come:Deliverance Il）', jp: 'REMATCH', hk: '精灵与萤火意志（Ori and the Will of the Wisps）' },
                { rank: 2, us: '死亡岛2（Dead Island 2）', jp: '恐鬼症（Phasmophobia）', hk: '实况足球（eFootball）' },
                { rank: 3, us: 'Undisputed', jp: '生死相依（Deadside）', hk: '铁拳8（Tekken 8）' },
                { rank: 4, us: '地铁:离去（Metro Exodus）', jp: '猎人:荒野的召唤（theHunter: Call of the Wild）', hk: '黑神话:悟空（Black Myth: Wukong）' },
                { rank: 5, us: 'RIDE 5', jp: '7 Days to Die', hk: '崩解（Unravel）' },
                { rank: 6, us: 'Agents of Mayhem', jp: '幸福工厂（Satisfactory）', hk: '航海王:海贼无双4（One Piece: Pirate Warriors 4）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '战地风云6（Battlefield 6）', jp: 'Deep Silver与好友特卖', hk: 'Deep Silver与好友特卖', jpNonGame: true, hkNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '发行商精品聚焦系列（Publisher Spotlight Series）', jp: '农历新年促销（Lunar New Year sale）', hk: '农历新年促销（Lunar New Year sale）', isNonGame: true },
                { rank: 2, us: '农历新年促销（Lunar New Year sale）', jp: '奇异人生:重聚（Life is Strange: Reunion）', hk: '奇异人生:重聚（Life is Strange: Reunion）', usNonGame: true },
                { rank: 3, us: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）', jp: '/', hk: '卡牌店模拟器（TCG Card Shop Simulator）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: 'EA Sports FC 26', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: 'WWE 2K26', jp: 'WWE 2K26', hk: 'WWE 2K26' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '守望先锋（OVERWATCH）', jp: '守望先锋（OVERWATCH）', hk: '守望先锋（OVERWATCH）' },
                { rank: 2, us: 'Deep Silver与好友特卖', jp: 'Deep Silver与好友特卖', hk: 'Deep Silver与好友特卖', isNonGame: true },
            ] },
        } },
        { date: '2026-02-24', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: '嗨嗨人生2（High On Life 2）', hk: '农历新年促销（Lunar New Year sale）', usNonGame: true, hkNonGame: true },
                { rank: 2, us: '战地风云6（Battlefield 6）', jp: '发行商精品聚焦系列（Publisher Spotlight Series）', hk: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）', jpNonGame: true },
                { rank: 3, us: '多人游戏促销（multiplayer sale）', jp: '生灵重塑（Reanimal）', hk: '极速滑板（skate）', usNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '黑神话:悟空（Black Myth: Wukong）', jp: 'REMATCH', hk: '战地风云6（Battlefield 6）' },
                { rank: 2, us: '实况足球（eFootball）', jp: '恐鬼症（Phasmophobia）', hk: '赛博朋克2077（Cyberpunk 2077）' },
                { rank: 3, us: '精灵与萤火意志（Ori and the Will of the Wisps）', jp: '生死相依（Deadside）', hk: '荒野大镖客:救赎2（Red Dead Redemption2）' },
                { rank: 4, us: '崩解（Unravel）', jp: '猎人:荒野的召唤（theHunter: Call of the Wild）', hk: '天外世界2（The Outer Worlds 2）' },
                { rank: 5, us: '死或生6（DEAD OR ALIVE 6）', jp: '7 Days to Die', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 6, us: '随动回旋镖（Boomerang Fu）', jp: '幸福工厂（Satisfactory）', hk: '死亡搁浅:导演剪辑版（DEATH STRANDING DIRECTOR’S CUT）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '守望先锋（OVERWATCH）', jp: 'Deep Silver与好友特卖', hk: 'Deep Silver与好友特卖', jpNonGame: true, hkNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '农历新年促销（Lunar New Year sale）', hk: '农历新年促销（Lunar New Year sale）', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: '罗密欧是个绝命侠（ROMEO IS A DEAD MAN）', jp: '奇异人生:重聚（Life is Strange: Reunion）', hk: '奇异人生:重聚（Life is Strange: Reunion）' },
                { rank: 3, us: '嗨嗨人生2（High On Life 2）', jp: '卡牌店模拟器（TCG Card Shop Simulator）', hk: '卡牌店模拟器（TCG Card Shop Simulator）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: 'EA Sports FC 26', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: '战地风云6（Battlefield 6）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '生灵重塑（Reanimal）', jp: '生灵重塑（Reanimal）', hk: '生灵重塑（Reanimal）' },
                { rank: 2, us: '发行商精品聚焦系列（Publisher Spotlight Series）', jp: '发行商精品聚焦系列（Publisher Spotlight Series）', hk: '发行商精品聚焦系列（Publisher Spotlight Series）', isNonGame: true },
            ] },
        } },
        { date: '2026-02-13', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Xbox Play Anywhere', jp: '热门付费游戏（Top paid games）', hk: '合作放松游戏特卖', isNonGame: true },
                { rank: 2, us: '热门免费游戏（Top free games）', jp: '失落星船:马拉松（Marathon）', hk: '新发行游戏', usNonGame: true, hkNonGame: true },
                { rank: 3, us: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', jp: '2K发行商特卖（2K Publisher Sale）', hk: '奇异人生:重聚（Life is Strange: Reunion）', jpNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '绝地潜兵2（Helldivers 2）', jp: '堡垒之夜（Fortnite）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 2, us: '双影奇境（Split Fiction）', jp: '巅峰守卫（Highguard）', hk: '我的世界（Minecraft）' },
                { rank: 3, us: 'LEGO® Marvel Collection', jp: '使命召唤:战区（Call of Duty:Warzone）', hk: 'EA Sports FC 26' },
                { rank: 4, us: '人间地狱（Hell Let Loose）', jp: '狂野飙车9:竞速传奇（Asphalt Legends）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 5, us: '战锤40K:星际战士2（Warhammer 40,000: Space Marine 2）', jp: '实况足球（eFootball）', hk: '双人成行（It Takes Two）' },
                { rank: 6, us: 'New MONOPOLYR', jp: '罗布乐思（Roblox）', hk: 'EA Sports FC 25' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '农历新年促销（Lunar New Year sale）', jp: '合作放松游戏特卖', hk: '极限竞速:地平线6（Forza Horizon 6）', usNonGame: true, jpNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '人中之龙:极3（Yakuza 3 Remastere）', hk: '农历新年促销（Lunar New Year sale）', hkNonGame: true },
                { rank: 2, us: '人中之龙:极3（Yakuza 3 Remastere）', jp: '农历新年促销（Lunar New Year sale）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jpNonGame: true },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: 'Focus发行商特卖（Focus Publisher Sale）', hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '人中之龙:极3（Yakuza 3 Remastere）', jp: '人中之龙:极3（Yakuza 3 Remastere）', hk: '人中之龙:极3（Yakuza 3 Remastere）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '极限竞速:地平线6（Forza Horizon 6）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '极限竞速:地平线6（Forza Horizon 6）' },
                { rank: 2, us: '2K发行商特卖（2K Publisher Sale）', jp: '2K发行商特卖（2K Publisher Sale）', hk: '2K发行商特卖（2K Publisher Sale）', isNonGame: true },
            ] },
        } },
        { date: '2026-02-12', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', isNonGame: true },
                { rank: 2, us: 'WWE 2K26', jp: 'Focus发行商特卖（Focus Publisher Sale）', hk: '动漫改编游戏专题', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '堡垒之夜（Fortnite）', jp: '巅峰守卫（Highguard）', hk: '辐射4（Fallout 4）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '黑神话:悟空（Black Myth: Wukong）', jp: 'EA Sports FC 26', hk: '战锤40K:星际战士2（Warhammer 40,000: Space Marine 2）' },
                { rank: 2, us: '极限竞速:地平线5（Forza Horizon 5）', jp: 'NBA 2K26', hk: '忍者神龟:施莱德的复仇（Teenage Mutant Ninja Turtles: Shredder\'s Revenge）' },
                { rank: 3, us: '星光卡丁车竞赛（Starlit Kart Racing）', jp: '美国职业棒球大联盟25（MLB The Show 25）', hk: '模拟火车世界6（Train Sim World® 6）' },
                { rank: 4, us: '原神（Genshin impact）', jp: '麦登橄榄球26（MaddenNFL26）', hk: '伊松佐河（Isonzo）' },
                { rank: 5, us: '实况足球（eFootball）', jp: 'EA Sports College Football 26', hk: '困兽之国（Drova）' },
                { rank: 6, us: '精灵与萤火意志（Ori and the Will of the Wisps）', jp: 'NHL 26', hk: '灾后修复师（RoadCraft）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: 'Focus发行商特卖（Focus Publisher Sale）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '极限竞速:地平线6（Forza Horizon 6）', usNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '热门体育游戏专题', jp: '动漫改编游戏专题', hk: '动漫改编游戏专题', isNonGame: true },
                { rank: 2, us: '2K发行商特卖（2K Publisher Sale）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true },
                { rank: 3, us: '动漫改编游戏专题', jp: 'Focus发行商特卖（Focus Publisher Sale）', hk: 'Focus发行商特卖（Focus Publisher Sale）', isNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', jp: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', hk: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '热门体育游戏专题', jp: '热门体育游戏专题', hk: '热门体育游戏专题', isNonGame: true },
                { rank: 2, us: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', jp: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', hk: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）' },
            ] },
        } },
        { date: '2026-02-11', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', isNonGame: true },
                { rank: 2, us: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', jp: '动漫改编游戏专题', hk: '辐射4（Fallout 4）', usNonGame: true, jpNonGame: true },
                { rank: 3, us: '堡垒之夜（Fortnite）', jp: '热门付费游戏（Top paid games）', hk: 'Game Pass 会员优惠', jpNonGame: true, hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '最终幻想14（Final Fantasy XIV）', jp: '堡垒之夜（Fortnite）', hk: 'NBA 2K26' },
                { rank: 2, us: '铁拳8（Tekken 8）', jp: 'Apex英雄（Apex Legends）', hk: '无主之地4（Borderlands 4）' },
                { rank: 3, us: '王国之心HD1.5+2.5 Remix（KINGDOM.HEARTS.HD.1.5.Plus.2.5.ReMIX）', jp: '我的世界（Minecraft）', hk: 'PGA TOUR 2K25' },
                { rank: 4, us: '鬼灭之刃:火之神血风谭2（Demon Slayer: Kimetsu no Yaiba – The Hinokami Chronicles 2）', jp: '罗布乐思（Roblox）', hk: '四海兄弟:故乡（ Mafia: The Old Country）' },
                { rank: 5, us: 'Daemon X Machina', jp: '极限竞速:地平线5（Forza Horizon 5）', hk: '文明7（Sid Meier\'s Civilization VII）' },
                { rank: 6, us: '伊甸星原（EDENS ZERO）', jp: '原神（Genshin impact）', hk: '雨中冒险2（Risk of Rain 2）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: 'Focus发行商特卖（Focus Publisher Sale）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '极限竞速:地平线6（Forza Horizon 6）', usNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '热门免费游戏（Top free games）', jp: '动漫改编游戏专题', hk: '动漫改编游戏专题', isNonGame: true },
                { rank: 2, us: '2K发行商特卖（2K Publisher Sale）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true },
                { rank: 3, us: '动漫改编游戏专题', jp: 'Focus发行商特卖（Focus Publisher Sale）', hk: 'Focus发行商特卖（Focus Publisher Sale）', isNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', jp: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', hk: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '动漫改编游戏专题', jp: '动漫改编游戏专题', hk: '热门体育游戏专题', isNonGame: true },
                { rank: 2, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', hk: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）' },
            ] },
        } },
        { date: '2026-02-10', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '嗨嗨人生2（High On Life 2）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', jp: '热门免费游戏（Top free games）', hk: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '美国职业棒球大联盟26（MLB The Show 26）', hk: '独立游戏周年促销（Indie Selects Anniversary Sale）', hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '星光卡丁车竞赛（Starlit Kart Racing）', jp: 'EA Sports FC 26', hk: '星光卡丁车竞赛（Starlit Kart Racing）' },
                { rank: 2, us: '黑神话:悟空（Black Myth: Wukong）', jp: 'NBA 2K26', hk: '黑神话:悟空（Black Myth: Wukong）' },
                { rank: 3, us: '精灵与萤火意志（Ori and the Will of the Wisps）', jp: '美国职业棒球大联盟25（MLB The Show 25）', hk: '精灵与萤火意志（Ori and the Will of the Wisps）' },
                { rank: 4, us: '狂野飙车9:竞速传奇（Asphalt Legends）', jp: '麦登橄榄球26（MaddenNFL26）', hk: '狂野飙车9:竞速传奇（Asphalt Legends）' },
                { rank: 5, us: '茶杯头（Cuphead）', jp: 'EA Sports College Football 26', hk: '茶杯头（Cuphead）' },
                { rank: 6, us: '实况足球（eFootball）', jp: 'NHL 26', hk: '实况足球（eFootball）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '轮回之兽（Beast of Reincarnation）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '热门体育游戏专题', jp: '动漫改编游戏专题', hk: '动漫改编游戏专题', isNonGame: true },
                { rank: 2, us: '极限竞速:地平线6（Forza Horizon 6）', jp: '噬血代码2（Code vein ll）', hk: '噬血代码2（Code vein ll）' },
                { rank: 3, us: '2K发行商特卖（2K Publisher Sale）', jp: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', hk: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', isNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '2K发行商特卖（2K Publisher Sale）', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '2K发行商特卖（2K Publisher Sale）', jp: '2K发行商特卖（2K Publisher Sale）', hk: '2K发行商特卖（2K Publisher Sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', jp: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', hk: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）' },
                { rank: 2, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '失落星船:马拉松（Marathon）', hk: '美国职业棒球大联盟26（MLB The Show 26）' },
            ] },
        } },
        { date: '2026-02-09', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', jp: 'Game Pass 会员优惠', hk: '嗨嗨人生2（High On Life 2）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: '2K发行商特卖（2K Publisher Sale）', jp: '辐射4（Fallout 4）', hk: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', usNonGame: true },
                { rank: 3, us: '奇异人生:重聚（Life is Strange: Reunion）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: 'Jump Space', hk: '巅峰守卫（Highguard）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: 'Rooftops & Alleys: The Parkour Game', hk: '2XKO' },
                { rank: 3, us: '我的世界（Minecraft）', jp: '沉没之城（The Sinking City Remastered）', hk: '使命召唤:战区（Call of Duty:Warzone）' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: 'Killing Floor 3', hk: '狂野飙车9:竞速传奇（Asphalt Legends）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '忍者外传:怒之羁绊（NINJA GAIDEN:Ragebound）', hk: '罗布乐思（Roblox）' },
                { rank: 6, us: 'NBA 2K26', jp: 'I Am Your Beast', hk: 'EA Sports FC 26' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: 'WWE 2K26', jp: '动漫改编游戏专题', hk: '动漫改编游戏专题', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: 'Black History Month', jp: '噬血代码2（Code vein ll）', hk: '噬血代码2（Code vein ll）', usNonGame: true },
                { rank: 3, us: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', jp: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', hk: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', isNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '2K发行商特卖（2K Publisher Sale）', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '美国职业棒球大联盟26（MLB The Show 26）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '热门体育游戏专题', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jpNonGame: true },
                { rank: 2, us: '热门体育游戏专题', jp: '失落星船:马拉松（Marathon）', hk: '热门体育游戏专题', usNonGame: true, hkNonGame: true },
            ] },
        } },
        { date: '2026-02-06', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '嗨嗨人生2（High On Life 2）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 3, us: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: 'Jump Space', jp: 'NBA 2K26', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 2, us: 'Rooftops & Alleys: The Parkour Game', jp: '辐射4（Fallout 4）', hk: 'EA Sports FC 26' },
                { rank: 3, us: '沉没之城（The Sinking City Remastered）', jp: 'PGA TOUR 2K25', hk: '我的世界（Minecraft）' },
                { rank: 4, us: 'Killing Floor 3', jp: '四海兄弟:故乡（ Mafia: The Old Country）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 5, us: '忍者外传:怒之羁绊（NINJA GAIDEN:Ragebound）', jp: '文明7（Sid Meier\'s Civilization VII）', hk: '双人成行（It Takes Two）' },
                { rank: 6, us: 'I Am Your Beast', jp: '雨中冒险2（Risk of Rain 2）', hk: 'EA Sports FC 25' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '极限竞速:地平线6（Forza Horizon 6）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '动漫改编游戏专题', hk: '动漫改编游戏专题', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: '2K发行商特卖（2K Publisher Sale）', jp: '噬血代码2（Code vein ll）', hk: '噬血代码2（Code vein ll）', usNonGame: true },
                { rank: 3, us: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', jp: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', hk: '霍格华兹周年特卖（Hogwarts Anniversary Sale）', jpNonGame: true, hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '2K发行商特卖（2K Publisher Sale）', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '美国职业棒球大联盟26（MLB The Show 26）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '噬血代码2（Code vein ll）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '极限竞速:地平线6（Forza Horizon 6）', jp: '动漫改编游戏专题', hk: '极限竞速:地平线6（Forza Horizon 6）', jpNonGame: true },
            ] },
        } },
        { date: '2026-02-05', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Black community games', jp: 'Game Pass 会员优惠', hk: '嗨嗨人生2（High On Life 2）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: 'Xbox Play Anywhere', jp: '辐射4（Fallout 4）', hk: 'Focus发行商特卖（Focus Publisher Sale）', usNonGame: true, hkNonGame: true },
                { rank: 3, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '巅峰守卫（Highguard）', hk: '辐射4（Fallout 4）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: '星光卡丁车竞赛（Starlit Kart Racing）' },
                { rank: 2, us: 'NBA 2K26', jp: 'NBA 2K26', hk: '精灵与萤火意志（Ori and the Will of the Wisps）' },
                { rank: 3, us: '美国职业棒球大联盟25（MLB The Show 25）', jp: '美国职业棒球大联盟25（MLB The Show 25）', hk: '实况足球（eFootball）' },
                { rank: 4, us: '麦登橄榄球26（MaddenNFL26）', jp: '麦登橄榄球26（MaddenNFL26）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 5, us: 'EA Sports College Football 26', jp: 'EA Sports College Football 26', hk: '皇牌空战7:未知空域（Ace Combat 7: Skies Unknown）' },
                { rank: 6, us: 'NHL 26', jp: 'NHL 26', hk: '狂野飙车9:竞速传奇（Asphalt Legends）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '热门体育游戏专题', jp: '热门体育游戏专题', hk: '美国职业棒球大联盟26（MLB The Show 26）', usNonGame: true, jpNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '动漫改编游戏专题', jp: '噬血代码2（Code vein ll）', hk: '热门体育游戏专题', usNonGame: true, hkNonGame: true },
                { rank: 2, us: '噬血代码2（Code vein ll）', jp: 'Focus发行商特卖（Focus Publisher Sale）', hk: '噬血代码2（Code vein ll）', jpNonGame: true },
                { rank: 3, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: 'Focus发行商特卖（Focus Publisher Sale）', hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '极限竞速:地平线6（Forza Horizon 6）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '极限竞速:地平线6（Forza Horizon 6）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '极限竞速:地平线6（Forza Horizon 6）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '噬血代码2（Code vein ll）', jp: '噬血代码2（Code vein ll）', hk: '噬血代码2（Code vein ll）' },
                { rank: 2, us: '动漫改编游戏专题', jp: '动漫改编游戏专题', hk: '动漫改编游戏专题', isNonGame: true },
            ] },
        } },
        { date: '2026-02-04', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '热门免费游戏（Top free games）', jp: 'Xbox Play Anywhere', hk: '嗨嗨人生2（High On Life 2）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: 'Game Pass 会员优惠', jp: 'Focus发行商特卖（Focus Publisher Sale）', hk: 'Focus发行商特卖（Focus Publisher Sale）', isNonGame: true },
                { rank: 3, us: 'Kiln', jp: '神鬼寓言（Fable）', hk: '神鬼寓言（Fable）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: 'Jump Space', jp: '全境封锁（Tom Clancy\'s The Division）', hk: '战锤40K:星际战士2（Warhammer 40,000: Space Marine 2）' },
                { rank: 2, us: 'Rooftops & Alleys: The Parkour Game', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '忍者神龟:施莱德的复仇（Teenage Mutant Ninja Turtles: Shredder\'s Revenge）' },
                { rank: 3, us: '沉没之城（The Sinking City Remastered）', jp: '主权辛迪加:雾都疑案（Soverelgn Syndicate）', hk: '模拟火车世界6（Train Sim World® 6）' },
                { rank: 4, us: 'Killing Floor 3', jp: 'Horror Bundle Vol 3', hk: '伊松佐河（Isonzo）', jpNonGame: true },
                { rank: 5, us: '忍者外传:怒之羁绊（NINJA GAIDEN:Ragebound）', jp: '逃出生天:恐怖阴影（Outbreak: Shades of Horror）', hk: '困兽之国（Drova）' },
                { rank: 6, us: 'I Am Your Beast', jp: '前线任务3:重制版（FRONT MISSION 3: Remake）', hk: '灾后修复师（RoadCraft）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '美国职业棒球大联盟26（MLB The Show 26）', jp: '热门体育游戏专题', hk: '美国职业棒球大联盟26（MLB The Show 26）', jpNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '热门体育游戏专题', jp: '噬血代码2（Code vein ll）', hk: '热门体育游戏专题', usNonGame: true, hkNonGame: true },
                { rank: 2, us: 'WWE 2K26', jp: 'Focus发行商特卖（Focus Publisher Sale）', hk: '噬血代码2（Code vein ll）', jpNonGame: true },
                { rank: 3, us: '极限竞速:地平线6（Forza Horizon 6）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: 'Focus发行商特卖（Focus Publisher Sale）', hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '极限竞速:地平线6（Forza Horizon 6）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '奇异人生:重聚（Life is Strange: Reunion）', jp: '奇异人生:重聚（Life is Strange: Reunion）', hk: '奇异人生:重聚（Life is Strange: Reunion）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '极限竞速:地平线6（Forza Horizon 6）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '极限竞速:地平线6（Forza Horizon 6）' },
                { rank: 2, us: '热门体育游戏专题', jp: '热门体育游戏专题', hk: '热门体育游戏专题', isNonGame: true },
            ] },
        } },
        { date: '2026-02-03', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '嗨嗨人生2（High On Life 2）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: 'Kiln', jp: 'Kiln', hk: '轮回之兽（Beast of Reincarnation）' },
                { rank: 3, us: '极限竞速:地平线6（Forza Horizon 6）', jp: '堡垒之夜（Fortnite）', hk: '2XKO' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '2XKO', jp: '海绵宝宝:潮汐巨神（SpongeBob SquarePants: Titans of the Tide）', hk: '星光卡丁车竞赛（Starlit Kart Racing）' },
                { rank: 2, us: '堡垒之夜（Fortnite）', jp: '猎人之路（Way of the Hunter）', hk: '实况足球（eFootball）' },
                { rank: 3, us: '使命召唤:战区（Call of Duty:Warzone）', jp: 'MX vs ATV Legends', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 4, us: 'EA Sports FC 26', jp: '撞车嘉年华（Wreckfest）', hk: '黑神话:悟空（Black Myth: Wukong）' },
                { rank: 5, us: '狂野飙车9:竞速传奇（Asphalt Legends）', jp: '暗黑血统3（Darksiders III）', hk: '茶杯头（Cuphead）' },
                { rank: 6, us: '罗布乐思（Roblox）', jp: '南方公园:雪假（South Park: Snow Day）', hk: '原神（Genshin impact）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: 'WWE 2K26', jp: '噬血代码2（Code vein ll）', hk: '噬血代码2（Code vein ll）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '噬血代码2（Code vein ll）', jp: '独立游戏周年促销（Indie Selects Anniversary Sale）', hk: '独立游戏周年促销（Indie Selects Anniversary Sale）', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: '独立游戏周年促销（Indie Selects Anniversary Sale）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', isNonGame: true },
                { rank: 3, us: 'EA Sports FC 26', jp: '嗨嗨人生2（High On Life 2）', hk: '嗨嗨人生2（High On Life 2）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '堡垒之夜（Fortnite）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '堡垒之夜（Fortnite）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: 'Xbox开发者直面会（Xbox Developer_Direct）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', isNonGame: true },
                { rank: 2, us: '2XKO', jp: '2XKO', hk: '2XKO' },
            ] },
        } },
        { date: '2026-02-02', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '嗨嗨人生2（High On Life 2）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: '独立游戏周年促销（Indie Selects Anniversary Sale）', jp: '热门免费游戏（Top free games）', hk: '极限竞速:地平线6（Forza Horizon 6）', usNonGame: true, jpNonGame: true },
                { rank: 3, us: '堡垒之夜（Fortnite）', jp: '神鬼寓言（Fable）', hk: '神鬼寓言（Fable）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '原神（Genshin impact）', jp: '堡垒之夜（Fortnite）', hk: 'Jump Space' },
                { rank: 2, us: '实况足球（eFootball）', jp: 'Apex英雄（Apex Legends）', hk: 'Rooftops & Alleys: The Parkour Game' },
                { rank: 3, us: '星光卡丁车竞赛（Starlit Kart Racing）', jp: '我的世界（Minecraft）', hk: '沉没之城（The Sinking City Remastered���' },
                { rank: 4, us: '精灵与萤火意志（Ori and the Will of the Wisps）', jp: '罗布乐思（Roblox）', hk: 'Killing Floor 3' },
                { rank: 5, us: '黑神话:悟空（Black Myth: Wukong）', jp: '极限竞速:地平线5（Forza Horizon 5）', hk: '忍者外传:怒之羁绊（NINJA GAIDEN:Ragebound）' },
                { rank: 6, us: '狂野飙车9:竞速传奇（Asphalt Legends）', jp: '原神（Genshin impact）', hk: 'I Am Your Beast' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', jp: '噬血代码2（Code vein ll）', hk: '噬血代码2（Code vein ll）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '独立游戏周年促销（Indie Selects Anniversary Sale）', hk: '独立游戏周年促销（Indie Selects Anniversary Sale）', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: 'Xbox开发者直面会（Xbox Developer_Direct）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', isNonGame: true },
                { rank: 3, us: '嗨嗨人生2（High On Life 2）', jp: '嗨嗨人生2（High On Life 2）', hk: '嗨嗨人生2（High On Life 2）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '堡垒之夜（Fortnite）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '噬血代码2（Code vein ll）', jp: '噬血代码2（Code vein ll）', hk: '噬血代码2（Code vein ll）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '2XKO', jp: '2XKO', hk: '2XKO' },
                { rank: 2, us: '独立游戏周年促销（Indie Selects Anniversary Sale）', jp: '独立游戏周年促销（Indie Selects Anniversary Sale）', hk: '独立游戏周年促销（Indie Selects Anniversary Sale）', isNonGame: true },
            ] },
        } },
        { date: '2026-01-30', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: '独立游戏周年促销（Indie Selects Anniversary Sale）', hk: '热门免费游戏（Top free games）', isNonGame: true },
                { rank: 2, us: '独立游戏周年促销（Indie Selects Anniversary Sale）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: '2XKO', usNonGame: true, jpNonGame: true },
                { rank: 3, us: '神鬼寓言（Fable）', jp: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', hk: '独立游戏周年促销（Indie Selects Anniversary Sale）', hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '极限竞速:地平线5（Forza Horizon 5）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '精灵与萤火意志（Ori and the Will of the Wisps）', hk: '神鬼寓言2（Fable II）' },
                { rank: 3, us: '我的世界（Minecraft）', jp: '奥日与黑暗森林（Ori and the Blind Forest）', hk: 'Keeper' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '咩咩启示录（Cult of the Lamb‌）', hk: '神鬼寓言3（Fable III）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: 'Rush: A Disney-Pixar Adventure', hk: '忍者龙剑传4（Ninja Gaiden 4）' },
                { rank: 6, us: 'NBA 2K26', jp: '/', hk: '极限竞速:地平线5（Forza Horizon 5）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '嗨嗨人生2（High On Life 2）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', jpNonGame: true, hkNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '神鬼寓言（Fable）', jp: '轮回之兽（Beast of Reincarnation）', hk: '轮回之兽（Beast of Reincarnation）' },
                { rank: 2, us: '极限竞速:地平线6（Forza Horizon 6）', jp: '独立游戏周年促销（Indie Selects Anniversary Sale）', hk: '独立游戏周年促销（Indie Selects Anniversary Sale）', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '轮回之兽（Beast of Reincarnation）', jp: 'Kiln', hk: 'Kiln' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '神鬼寓言（Fable）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '2XKO', jp: '2XKO', hk: '2XKO' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', jp: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）', hk: '勇者斗恶龙Ⅶ Reimagined（Dragon Quest VII: Reimagined）' },
                { rank: 2, us: '巅峰守卫（Highguard）', jp: '巅峰守卫（Highguard）', hk: '巅峰守卫（Highguard）' },
            ] },
        } },
        { date: '2026-01-29', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: '极限竞速:地平线6（Forza Horizon 6）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: 'Xbox开发者直面会（Xbox Developer_Direct）', jp: 'Game Pass 会员优惠', hk: 'Kiln', usNonGame: true, jpNonGame: true },
                { rank: 3, us: '2XKO', jp: '堡垒之夜（Fortnite）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '海绵宝宝:潮汐巨神（SpongeBob SquarePants: Titans of the Tide）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: 'Apex英雄（Apex Legends）', hk: '猎人之路（Way of the Hunter）' },
                { rank: 3, us: '我的世界（Minecraft）', jp: '我的世界（Minecraft）', hk: 'MX vs ATV Legends' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '罗布乐思（Roblox）', hk: '撞车嘉年华（Wreckfest）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '极限竞速:地平线5（Forza Horizon 5）', hk: '暗黑血统3（Darksiders III）' },
                { rank: 6, us: 'NBA 2K26', jp: '原神（Genshin impact）', hk: '南方公园:雪假（South Park: Snow Day）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: 'EA Sports FC 26', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', jpNonGame: true, hkNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）', jp: '轮回之兽（Beast of Reincarnation）', hk: '轮回之兽（Beast of Reincarnation）' },
                { rank: 2, us: '巅峰守卫（Highguard）', jp: '独立游戏周年促销（Indie Selects Anniversary Sale）', hk: '独立游戏周年促销（Indie Selects Anniversary Sale）', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '买一送二活动（Buy one, get two free）', jp: 'Kiln', hk: 'Kiln', usNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '神鬼寓言（Fable）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: 'Xbox开发者直面会（Xbox Developer_Direct）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '堡垒之夜（Fortnite）' },
                { rank: 2, us: 'Kiln', jp: 'Kiln', hk: 'Kiln' },
            ] },
        } },
        { date: '2026-01-28', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '极限竞速:地平线6（Forza Horizon 6）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: '独立游戏周年促销（Indie Selects Anniversary Sale）', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '极限竞速:地平线6（Forza Horizon 6）', usNonGame: true, jpNonGame: true },
                { rank: 3, us: '独立游戏周年促销（Indie Selects Anniversary Sale）', jp: '神鬼寓言（Fable）', hk: '神鬼寓言（Fable）', usNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '海绵宝宝:潮汐巨神（SpongeBob SquarePants: Titans of the Tide）', jp: 'Jump Space', hk: '星光卡丁车竞赛（Starlit Kart Racing）' },
                { rank: 2, us: '猎人之路（Way of the Hunter）', jp: 'Rooftops & Alleys: The Parkour Game', hk: '终极角逐（THE FINALS）' },
                { rank: 3, us: 'MX vs ATV Legends', jp: '沉没之城（The Sinking City Remastered）', hk: '我的英雄学院 无尽正义（MY HERO ACADEMIA: All\'s Justice）' },
                { rank: 4, us: '撞车嘉年华（Wreckfest）', jp: 'Killing Floor 3', hk: 'Stumble Guys' },
                { rank: 5, us: '暗黑血统3（Darksiders III）', jp: '忍者外传:怒之羁绊（NINJA GAIDEN:Ragebound）', hk: '英灵乱战（BrawIhalla）' },
                { rank: 6, us: '南方公园:雪假（South Park: Snow Day）', jp: 'I Am Your Beast', hk: 'Apex英雄（Apex Legends）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '2XKO', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', jpNonGame: true, hkNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '独立游戏周年促销（Indie Selects Anniversary Sale）', jp: '轮回之兽（Beast of Reincarnation）', hk: '轮回之兽（Beast of Reincarnation）', usNonGame: true },
                { rank: 2, us: '轮回之兽（Beast of Reincarnation）', jp: '独立游戏周年促销（Indie Selects Anniversary Sale）', hk: '独立游戏周年促销（Indie Selects Anniversary Sale）', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: 'Xbox开发者直面会（Xbox Developer_Direct）', jp: 'Kiln', hk: 'Kiln', usNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '神鬼寓言（Fable）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '轮回之兽（Beast of Reincarnation）', jp: '轮回之兽（Beast of Reincarnation）', hk: '轮回之兽（Beast of Reincarnation）' },
                { rank: 2, us: '独立游戏周年促销（Indie Selects Anniversary Sale）', jp: '独立游戏周年促销（Indie Selects Anniversary Sale）', hk: '独立游戏周年促销（Indie Selects Anniversary Sale）', isNonGame: true },
            ] },
        } },
        { date: '2026-01-27', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '极限竞速:地平线6（Forza Horizon 6）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: 'Game Pass 会员优惠', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26', usNonGame: true },
                { rank: 3, us: '噬血代码2（Code vein ll）', jp: '新游期待榜', hk: '神鬼寓言（Fable）', jpNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '星光卡丁车竞赛（Starlit Kart Racing）', hk: '2XKO' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '实况足球（eFootball）', hk: '使命召唤:战区（Call of Duty:Warzone）' },
                { rank: 3, us: '我的世界（Minecraft）', jp: '狂野飙车9:竞速传奇（Asphalt Legends）', hk: 'EA Sports FC 26' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '精灵与萤火意志（Ori and the Will of the Wisps）', hk: '狂野飙车9:竞速传奇（Asphalt Legends）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '黑神话:悟空（Black Myth: Wukong）', hk: '罗布乐思（Roblox）' },
                { rank: 6, us: 'NBA 2K26', jp: '茶杯头（Cuphead）', hk: '实况足球（eFootball）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '神鬼寓言（Fable）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', jpNonGame: true, hkNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '奇异人生:重聚（Life is Strange: Reunion）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '极限竞速:地平线6（Forza Horizon 6）' },
                { rank: 2, us: 'EA体育游戏周（EA Sports Week）', jp: '最终幻想 7 重制版 Intergrade（FFVll Remake Intergrade）', hk: '最终幻想 7 重制版 Intergrade（FFVll Remake Intergrade）' },
                { rank: 3, us: '极限竞速:地平线6（Forza Horizon 6）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', jpNonGame: true, hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: 'THQ Nordic 和 HandyGames厂商游戏专题', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: 'Xbox开发者直面会（Xbox Developer_Direct）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: 'THQ Nordic 和 HandyGames厂商游戏专题', jp: 'THQ Nordic 和 HandyGames厂商游戏专题', hk: 'THQ Nordic 和 HandyGames厂商游戏专题', isNonGame: true },
                { rank: 2, us: '最终幻想 7 重制版 Intergrade（FFVll Remake Intergrade）', jp: '最终幻想 7 重制版 Intergrade（FFVll Remake Intergrade）', hk: '最终幻想 7 重制版 Intergrade（FFVll Remake Intergrade）' },
            ] },
        } },
        { date: '2026-01-26', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '极限竞速:地平线6（Forza Horizon 6）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '极限竞速:地平线6（Forza Horizon 6）' },
                { rank: 2, us: 'Xbox开发者直面会（Xbox Developer_Direct）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', isNonGame: true },
                { rank: 3, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: 'EA Sports FC 26', usNonGame: true, jpNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 2, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: '神鬼寓言2（Fable II）' },
                { rank: 3, us: '使命召唤:战区（Call of Duty:Warzone）', jp: '使命召唤:战区（Call of Duty:Warzone）', hk: 'Keeper' },
                { rank: 4, us: '狂野飙车9:竞速传奇（Asphalt Legends）', jp: '狂野飙车9:竞速传奇（Asphalt Legends）', hk: '神鬼寓言3（Fable III）' },
                { rank: 5, us: '罗布乐思（Roblox）', jp: '罗布乐思（Roblox）', hk: '忍者龙剑传4（Ninja Gaiden 4）' },
                { rank: 6, us: '实况足球（eFootball）', jp: '实况足球（eFootball）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: 'Xbox开发者直面会（Xbox Developer_Direct）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '最终幻想 7 重制版 Intergrade（FFVll Remake Intergrade）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '极限竞速:地平线6（Forza Horizon 6）' },
                { rank: 2, us: '奇异人生:重聚（Life is Strange: Reunion）', jp: '最终幻想 7 重制版 Intergrade（FFVll Remake Intergrade）', hk: '最终幻想 7 重制版 Intergrade（FFVll Remake Intergrade）' },
                { rank: 3, us: '极限竞速:地平线6（Forza Horizon 6）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', jpNonGame: true, hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: 'THQ Nordic 和 HandyGames厂商游戏专题', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '极限竞速:地平线6（Forza Horizon 6）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '极限竞速:地平线6（Forza Horizon 6）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '噬血代码2（Code vein ll）', jp: '噬血代码2（Code vein ll）', hk: '噬血代码2（Code vein ll）' },
                { rank: 2, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
            ] },
        } },
        { date: '2026-01-23', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '极限竞速:地平线6（Forza Horizon 6）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: 'Xbox开发者直面会（Xbox Developer_Direct）', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '2XKO', usNonGame: true },
                { rank: 3, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: 'Kiln', usNonGame: true, jpNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '死亡搁浅:导演剪辑版（DEATH STRANDING DIRECTOR’S CUT）', jp: 'EA Sports FC 26', hk: '地狱即我们（Hell is US）' },
                { rank: 2, us: '星光卡丁车竞赛（Starlit Kart Racing）', jp: 'EA Sports FC 26', hk: '黑猫侦探:深入本质（Blacksad: Under the Skin）' },
                { rank: 3, us: '实况足球（eFootball）', jp: 'EA Sports College Football 26', hk: '黑暗世界:因与果（The Dark World: KARMA）' },
                { rank: 4, us: '狂野飙车9:竞速传奇（Asphalt Legends）', jp: '麦登橄榄球26（MaddenNFL26）', hk: '一起开火车！（Unrailed!）' },
                { rank: 5, us: '精灵与萤火意志（Ori and the Will of the Wisps）', jp: '麦登橄榄球26（MaddenNFL26）', hk: '贪婪大地（Greedland）' },
                { rank: 6, us: '黑神话:悟空（Black Myth: Wukong）', jp: 'NHL 26', hk: 'Aaero' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', jpNonGame: true, hkNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '2XKO', jp: '极限竞速:地平线6（Forza Horizon 6）', hk: '极限竞速:地平线6（Forza Horizon 6）' },
                { rank: 2, us: '最终幻想 7 重制版 Intergrade（FFVll Remake Intergrade）', jp: '最终幻想 7 重制版 Intergrade（FFVll Remake Intergrade）', hk: '最终幻想 7 重制版 Intergrade（FFVll Remake Intergrade）' },
                { rank: 3, us: 'Xbox开发者直面会（Xbox Developer_Direct）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', isNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: 'THQ Nordic 和 HandyGames厂商游戏专题', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: 'Xbox开发者直面会（Xbox Developer_Direct）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: 'THQ Nordic 和 HandyGames厂商游戏专题', jp: 'THQ Nordic 和 HandyGames厂商游戏专题', hk: 'THQ Nordic 和 HandyGames厂商游戏专题', isNonGame: true },
                { rank: 2, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26' },
            ] },
        } },
        { date: '2026-01-22', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: 'EA Sports FC 26', usNonGame: true, jpNonGame: true },
                { rank: 2, us: '热门付费游戏（Top paid games）', jp: 'EA体育游戏周（EA Sports Week）', hk: 'EA体育游戏周（EA Sports Week）', isNonGame: true },
                { rank: 3, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '堡垒之夜（Fortnite）', hk: 'EA Sports FC 26' },
                { rank: 2, us: '龙珠Z:卡卡洛特（DRAGON BALL Z: KAKAROT）', jp: 'EA Sports FC 26', hk: '使命召唤:战区（Call of Duty:Warzone）' },
                { rank: 3, us: '航海王:海贼无双4（One Piece: Pirate Warriors 4）', jp: '使命召唤:战区（Call of Duty:Warzone）', hk: '狂野飙车9:竞速传奇（Asphalt Legends）' },
                { rank: 4, us: '地铁:离去（Metro Exodus）', jp: '狂野飙车9:竞速传奇（Asphalt Legends）', hk: '罗布乐思（Roblox）' },
                { rank: 5, us: '/', jp: '罗布乐思（Roblox）', hk: '实况足球（eFootball）' },
                { rank: 6, us: '/', jp: '实况足球（eFootball）', hk: '极速滑板（skate）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '最终幻想 7 重制版 Intergrade（FFVll Remake Intergrade）', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '噬血代码2（Code vein ll）', jp: 'THQ Nordic 和 HandyGames厂商游戏专题', hk: 'THQ Nordic 和 HandyGames厂商游戏专题', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: 'Xbox开发者直面会（Xbox Developer_Direct）', jp: '最终幻想 7 重制版 Intergrade（FFVll Remake Intergrade）', hk: '最终幻想 7 重制版 Intergrade（FFVll Remake Intergrade）', usNonGame: true },
                { rank: 3, us: '2XKO', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', jpNonGame: true, hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: 'EA体育游戏周（EA Sports Week）', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: 'THQ Nordic 和 HandyGames厂商游戏专题', jp: 'THQ Nordic 和 HandyGames厂商游戏专题', hk: 'EA Sports FC 26', usNonGame: true, jpNonGame: true },
                { rank: 2, us: '失落星船:马拉松（Marathon）', jp: '失落星船:马拉松（Marathon）', hk: 'THQ Nordic 和 HandyGames厂商游戏专题', hkNonGame: true },
            ] },
        } },
        { date: '2026-01-21', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', isNonGame: true },
                { rank: 2, us: 'EA Sports FC 26', jp: 'Game Pass 会员优惠', hk: '发行商精品聚焦系列（Publisher Spotlight Series）', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '失落星船:马拉松（Marathon）', jp: '噬血代码2（Code vein ll）', hk: '噬血代码2（Code vein ll）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '海绵宝宝:潮汐巨神（SpongeBob SquarePants: Titans of the Tide）', jp: 'EA Sports FC 26', hk: '原神（Genshin impact）' },
                { rank: 2, us: '猎人之路（Way of the Hunter）', jp: 'EA Sports FC 26', hk: '星光卡丁车竞赛（Starlit Kart Racing）' },
                { rank: 3, us: 'MX vs ATV Legends', jp: 'EA Sports College Football 26', hk: '我的世界（Minecraft）' },
                { rank: 4, us: '撞车嘉年华（Wreckfest）', jp: '麦登橄榄球26（MaddenNFL26）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 5, us: '暗黑血统3（Darksiders III）', jp: '麦登橄榄球26（MaddenNFL26）', hk: '实况足球（eFootball）' },
                { rank: 6, us: '南方公园:雪假（South Park: Snow Day）', jp: 'NHL 26', hk: '精灵与萤火意志（Ori and the Will of the Wisps）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: 'EA Sports FC 26', jp: '失落星船:马拉松（Marathon）', hk: '失落星船:马拉松（Marathon）' },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '2XKO', jp: 'THQ Nordic 和 HandyGames厂商游戏专题', hk: 'THQ Nordic 和 HandyGames厂商游戏专题', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: 'Xbox开发者直面会（Xbox Developer_Direct）', jp: 'F1 25', hk: 'F1 25', usNonGame: true },
                { rank: 3, us: 'THQ Nordic 和 HandyGames厂商游戏专题', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', isNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: 'EA体育游戏周（EA Sports Week）', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', jp: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', hk: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）' },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26' },
                { rank: 2, us: 'THQ Nordic 和 HandyGames厂商游戏专题', jp: 'THQ Nordic 和 HandyGames厂商游戏专题', hk: 'THQ Nordic 和 HandyGames厂商游戏专题', isNonGame: true },
            ] },
        } },
        { date: '2026-01-20', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Xbox开发者直面会（Xbox Developer_Direct）', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', isNonGame: true },
                { rank: 2, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '发行商精品聚焦系列（Publisher Spotlight Series）', isNonGame: true },
                { rank: 3, us: '发行商精品聚焦系列（Publisher Spotlight Series）', jp: '发行商精品聚焦系列（Publisher Spotlight Series）', hk: 'EA Sports FC 26', usNonGame: true, jpNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: 'EA Sports FC 26', jp: '刺客信条:影（Assassin\'s Creed Shadows）', hk: 'Neverwinter' },
                { rank: 2, us: 'EA Sports FC 26', jp: 'WWE 2K25', hk: '战争雷霆（War Thunder）' },
                { rank: 3, us: 'EA Sports College Football 26', jp: '辐射4（Fallout 4）', hk: '战争雷霆（War Thunder）' },
                { rank: 4, us: '麦登橄榄球26（MaddenNFL26）', jp: '全境封锁（Tom Clancy\'s The Division）', hk: '战争雷霆（War Thunder）' },
                { rank: 5, us: '麦登橄榄球26（MaddenNFL26）', jp: '夺宝奇兵:古老之圈（Indiana Jones and the Great Circle）', hk: '战争雷霆（War Thunder）' },
                { rank: 6, us: 'NHL 26', jp: '火箭联盟（Rocket League）', hk: '战争雷霆（War Thunder）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '倒数之外（Beyond Countdown）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '失落星船:马拉松（Marathon）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: 'EA体育游戏周（EA Sports Week）', jp: '发行商精品聚焦系列（Publisher Spotlight Series）', hk: '发行商精品聚焦系列（Publisher Spotlight Series）', isNonGame: true },
                { rank: 3, us: '免费游戏和DLC优惠专题（Free games and DLC deals）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', isNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '真人快打:遗产收藏（Mortal Kombat: Legacy Kollection）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '真人快打:遗产收藏（Mortal Kombat: Legacy Kollection）', jpNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '免费游戏和DLC优惠专题（Free games and DLC deals）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', usNonGame: true, hkNonGame: true },
                { rank: 2, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
            ] },
        } },
        { date: '2026-01-16', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '发行商精品聚焦系列（Publisher Spotlight Series）', jp: 'Game Pass 会员优惠', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', isNonGame: true },
                { rank: 2, us: 'Game Pass 会员优惠', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '发行商精品聚焦系列（Publisher Spotlight Series）', isNonGame: true },
                { rank: 3, us: '省电宣传（Use less power, help the Earth）', jp: 'EA Sports FC 26', hk: '即将上线', usNonGame: true, hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: 'EA Sports FC 26', jp: '刺客信条:影（Assassin\'s Creed Shadows）', hk: '地狱即我们（Hell is US）' },
                { rank: 2, us: 'EA Sports FC 26', jp: 'WWE 2K25', hk: '黑猫侦探:深入本质（Blacksad: Under the Skin）' },
                { rank: 3, us: 'EA Sports College Football 26', jp: '辐射4（Fallout 4）', hk: '黑暗世界:因与果（The Dark World: KARMA）' },
                { rank: 4, us: '麦登橄榄球26（MaddenNFL26）', jp: '全境封锁（Tom Clancy\'s The Division）', hk: '一起开火车！（Unrailed!）' },
                { rank: 5, us: '麦登橄榄球26（MaddenNFL26）', jp: '夺宝奇兵:古老之圈（Indiana Jones and the Great Circle）', hk: '贪婪大地（Greedland）' },
                { rank: 6, us: 'NHL 26', jp: '火箭联盟（Rocket League）', hk: 'Aaero' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '倒数之外（Beyond Countdown）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '发行商精品聚焦系列（Publisher Spotlight Series）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', isNonGame: true },
                { rank: 2, us: 'EA体育游戏周（EA Sports Week）', jp: '发行商精品聚焦系列（Publisher Spotlight Series）', hk: '发行商精品聚焦系列（Publisher Spotlight Series）', isNonGame: true },
                { rank: 3, us: '真人快打:遗产收藏（Mortal Kombat: Legacy Kollection）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', jpNonGame: true, hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', hk: '乐��蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', usNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: 'EA体育游戏周（EA Sports Week）', jp: 'EA体育游戏周（EA Sports Week）', hk: 'EA体育游戏周（EA Sports Week）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '倒数之外（Beyond Countdown）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', isNonGame: true },
                { rank: 2, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
            ] },
        } },
        { date: '2026-01-15', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Xbox开发者直面会（Xbox Developer_Direct）', hk: 'Xbox开发者直面会（Xbox Developer_Direct）', isNonGame: true },
                { rank: 2, us: '发行商精品聚焦系列（Publisher Spotlight Series）', jp: 'Game Pass 会员优惠', hk: '热门免费游戏（Top free games）', isNonGame: true },
                { rank: 3, us: 'EA Sports FC 26', jp: 'Xbox Play Anywhere', hk: '新发行游戏', jpNonGame: true, hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: 'Neverwinter', hk: '地狱即我们（Hell is US）' },
                { rank: 2, us: '罗布乐思（Roblox）', jp: '战争雷霆（War Thunder）', hk: '黑猫侦探:深入本质（Blacksad: Under the Skin）' },
                { rank: 3, us: '我的世界（Minecraft）', jp: '战争雷霆（War Thunder）', hk: '黑暗世界:因与果（The Dark World: KARMA）' },
                { rank: 4, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '战争雷霆（War Thunder）', hk: '一起开火车！（Unrailed!）' },
                { rank: 5, us: '火箭联盟（Rocket League）', jp: '战争雷霆（War Thunder）', hk: '贪婪大地（Greedland）' },
                { rank: 6, us: 'NBA 2K26', jp: '战争雷霆（War Thunder）', hk: 'Aaero' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '倒数之外（Beyond Countdown）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '发行商精品聚焦系列（Publisher Spotlight Series）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', isNonGame: true },
                { rank: 2, us: 'EA体育游戏周（EA Sports Week）', jp: '发行商精品聚焦系列（Publisher Spotlight Series）', hk: '发行商精品聚焦系列（Publisher Spotlight Series）', isNonGame: true },
                { rank: 3, us: '真人快打:遗产收藏（Mortal Kombat: Legacy Kollection）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', jpNonGame: true, hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: 'EA体育游戏周（EA Sports Week）', jp: 'EA体育游戏周（EA Sports Week）', hk: 'EA体育游戏周（EA Sports Week）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '倒数之外（Beyond Countdown）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', isNonGame: true },
                { rank: 2, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', jpNonGame: true, hkNonGame: true },
            ] },
        } },
        { date: '2026-01-14', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '发行商精品聚焦系列（Publisher Spotlight Series）', jp: '发行商精品聚焦系列（Publisher Spotlight Series）', hk: '发行商精品聚焦系列（Publisher Spotlight Series）', isNonGame: true },
                { rank: 2, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: 'Game Pass 会员优惠', isNonGame: true },
                { rank: 3, us: '热门免费游戏（Top free games）', jp: '即将上线', hk: 'XBOX性能最佳化', isNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: 'EA Sports FC 26', jp: '堡垒之夜（Fortnite）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: 'EA Sports FC 26', jp: 'Apex英雄（Apex Legends）', hk: 'EA Sports FC 26' },
                { rank: 3, us: 'EA Sports College Football 26', jp: '我的世界（Minecraft）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 4, us: '麦登橄榄球26（MaddenNFL26）', jp: '罗布乐思（Roblox）', hk: '我的世界（Minecraft）' },
                { rank: 5, us: '麦登橄榄球26（MaddenNFL26）', jp: '怪物猎人:荒野（Monster Hunter Wilds）', hk: '双人成行（It Takes Two）' },
                { rank: 6, us: 'NHL 26', jp: '极限竞速:地平线5（Forza Horizon 5）', hk: 'EA Sports FC 25' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '倒数之外（Beyond Countdown）', jp: 'EA体育游戏周（EA Sports Week）', hk: 'EA体育游戏周（EA Sports Week）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '发行商精品聚焦系列（Publisher Spotlight Series）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', isNonGame: true },
                { rank: 2, us: 'Apex英雄（Apex Legends）', jp: '发行商精品聚焦系列（Publisher Spotlight Series）', hk: '发行商精品聚焦系列（Publisher Spotlight Series）', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '免费游戏和DLC优惠专题（Free games and DLC deals）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', isNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '倒数之外（Beyond Countdown）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '免费游戏和DLC优惠专题（Free games and DLC deals）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', isNonGame: true },
                { rank: 2, us: 'EA体育游戏周（EA Sports Week）', jp: 'EA体育游戏周（EA Sports Week）', hk: 'EA体育游戏周（EA Sports Week）', isNonGame: true },
            ] },
        } },
        { date: '2026-01-13', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', isNonGame: true },
                { rank: 2, us: '倒数之外（Beyond Countdown）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '热门付费游戏（Top paid games）', isNonGame: true },
                { rank: 3, us: '热门免费游戏（Top free games）', jp: '热门付费游戏（Top paid games）', hk: 'EA Sports FC 26', usNonGame: true, jpNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '星光卡丁车竞赛（Starlit Kart Racing）', jp: '堡垒之夜（Fortnite）', hk: '刺客信条:影（Assassin\'s Creed Shadows）' },
                { rank: 2, us: '我的世界（Minecraft）', jp: 'Apex英雄（Apex Legends）', hk: 'WWE 2K25' },
                { rank: 3, us: '实况足球（eFootball）', jp: '我的世界（Minecraft）', hk: '真人快打1（Mortal Kombat 1）' },
                { rank: 4, us: '精灵与萤火意志（Ori and the Will of the Wisps）', jp: '罗布乐思（Roblox）', hk: 'DayZ' },
                { rank: 5, us: '极限竞速:地平线5（Forza Horizon 5）', jp: '怪物猎人:荒野（Monster Hunter Wilds）', hk: '辐射4（Fallout 4）' },
                { rank: 6, us: '雷曼:传奇（Rayman Legends）', jp: '极限竞速:地平线5（Forza Horizon 5）', hk: '全境封锁（Tom Clancy\'s The Division）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: 'EA体育游戏周（EA Sports Week）', jp: 'EA体育游戏周（EA Sports Week）', hk: 'EA体育游戏周（EA Sports Week）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '发行商精品聚焦系列（Publisher Spotlight Series）', hk: '发行商精品聚焦系列（Publisher Spotlight Series）', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: '倒数之外（Beyond Countdown）', jp: 'Apex英雄（Apex Legends）', hk: 'Apex英雄（Apex Legends）', usNonGame: true },
                { rank: 3, us: '免费游戏和DLC优惠专题（Free games and DLC deals）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', isNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '倒数之外（Beyond Countdown）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '免费游戏和DLC优惠专题（Free games and DLC deals）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', isNonGame: true },
            ] },
        } },
        { date: '2026-01-12', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '游戏优惠', isNonGame: true },
                { rank: 2, us: '倒数之外（Beyond Countdown）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '倒数之外（Beyond Countdown）', isNonGame: true },
                { rank: 3, us: '热门免费游戏（Top free games）', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26', usNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '刺客信条:影（Assassin\'s Creed Shadows）', jp: '堡垒之夜（Fortnite）', hk: '刺客信条:影（Assassin\'s Creed Shadows）' },
                { rank: 2, us: 'WWE 2K25', jp: 'EA Sports FC 26', hk: 'WWE 2K25' },
                { rank: 3, us: '真人快打1（Mortal Kombat 1）', jp: '使命召唤:战区（Call of Duty:Warzone）', hk: '真人快打1（Mortal Kombat 1）' },
                { rank: 4, us: 'DayZ', jp: '罗布乐思（Roblox）', hk: 'DayZ' },
                { rank: 5, us: '辐射4（Fallout 4）', jp: '狂野飙车9:竞速传奇（Asphalt Legends）', hk: '辐射4（Fallout 4）' },
                { rank: 6, us: '全境封锁（Tom Clancy\'s The Division）', jp: '极速滑板（skate）', hk: '全境封锁（Tom Clancy\'s The Division）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: 'EA体育游戏周（EA Sports Week）', jp: 'EA体育游戏周（EA Sports Week）', hk: 'EA体育游戏周（EA Sports Week）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '发行商精品聚焦系列（Publisher Spotlight Series）', hk: '发行商精品聚焦系列（Publisher Spotlight Series）', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: '倒数之外（Beyond Countdown）', jp: 'Apex英雄（Apex Legends）', hk: 'Apex英雄（Apex Legends）', usNonGame: true },
                { rank: 3, us: '免费游戏和DLC优惠专题（Free games and DLC deals）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', isNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '倒数之外（Beyond Countdown）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 2, us: '免费游戏和DLC优惠专题（Free games and DLC deals）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', isNonGame: true },
            ] },
        } },
        { date: '2026-01-09', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '免费游戏和DLC优惠专题（Free games and DLC deals）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '天外世界2（The Outer Worlds 2）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: 'Game Pass 会员优惠', jp: '夺宝奇兵:古老之圈（Indiana Jones and the Great Circle）', hk: '倒数之外（Beyond Countdown）', usNonGame: true, hkNonGame: true },
                { rank: 3, us: '彩虹六号:围攻X（Tom Clancy\'s Rainbow Six Siege X）', jp: 'Xbox 狂欢季', hk: 'Xbox 狂欢季' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '汪汪队立大功:世界（PAW Patrol）', jp: '刺客信条:影（Assassin\'s Creed Shadows）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '星光卡丁车竞赛（Starlit Kart Racing）', jp: 'WWE 2K25', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 3, us: '实况足球（eFootball）', jp: '辐射4（Fallout 4）', hk: 'EA Sports FC 26' },
                { rank: 4, us: '微软模拟飞行2024（Microsoft Flight Simulator 2024）', jp: '全境封锁（Tom Clancy\'s The Division）', hk: '我的世界（Minecraft）' },
                { rank: 5, us: '只狼:影逝二度（Sekiro:Shadows Die Twice）', jp: '夺宝奇兵:古老之圈（Indiana Jones and the Great Circle）', hk: '双人成行（It Takes Two）' },
                { rank: 6, us: '精灵与萤火意志（Ori and the Will of the Wisps）', jp: '火箭联盟（Rocket League）', hk: 'EA Sports FC 25' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '倒数之外（Beyond Countdown）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '免费游戏和DLC优惠专题（Free games and DLC deals）', jp: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', hk: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', usNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '倒数之外（Beyond Countdown）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '免费游戏和DLC优惠专题（Free games and DLC deals）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', isNonGame: true },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
            ] },
        } },
        { date: '2026-01-08', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: 'EA Sports FC 26', usNonGame: true, jpNonGame: true },
                { rank: 2, us: 'DayZ', jp: 'EA Sports FC 26', hk: '古墓丽影:亚特兰蒂斯遗迹（Tomb Raider: Legacy of Atlantis）' },
                { rank: 3, us: '使命召唤手游（‌Call of Duty Mobile）', jp: '古墓丽影:��特兰蒂斯遗迹（Tomb Raider: Legacy of Atlantis）', hk: '毁灭战士:黑暗时代（DOOM: The Dark Ages）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '汪汪队立大功:世界（PAW Patrol）', jp: '堡垒之夜（Fortnite）', hk: '汪汪队立大功:世界（PAW Patrol）' },
                { rank: 2, us: '实况足球（eFootball）', jp: 'EA Sports FC 26', hk: '实况足球（eFootball）' },
                { rank: 3, us: '星光卡丁车竞赛（Starlit Kart Racing）', jp: '罗布乐思（Roblox）', hk: '星光卡丁车竞赛（Starlit Kart Racing）' },
                { rank: 4, us: '精灵与萤火意志（Ori and the Will of the Wisps）', jp: '使命召唤:战区（Call of Duty:Warzone）', hk: '精灵与萤火意志（Ori and the Will of the Wisps）' },
                { rank: 5, us: '黑神话:悟空（Black Myth: Wukong）', jp: '狂野飙车9:竞速传奇（Asphalt Legends）', hk: '黑神话:悟空（Black Myth: Wukong）' },
                { rank: 6, us: '狂野飙车9:竞速传奇（Asphalt Legends）', jp: '极速滑板（skate）', hk: '狂野飙车9:竞速传奇（Asphalt Legends）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', jpNonGame: true, hkNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '古墓丽影:亚特兰蒂斯遗迹（Tomb Raider: Legacy of Atlantis）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '免费游戏和DLC优惠专题（Free games and DLC deals）', hk: '免费游戏和DLC优惠专题（Free games and DLC deals）', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '免费游戏和DLC优惠专题（Free games and DLC deals）', jp: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', hk: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', usNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '倒数之外（Beyond Countdown）', jp: '倒数之外（Beyond Countdown）', hk: '倒数之外（Beyond Countdown）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 2, us: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', jp: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', hk: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）' },
            ] },
        } },
        { date: '2026-01-07', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '天外世界2（The Outer Worlds 2）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: '双影奇境（Split Fiction）', jp: '忍者龙剑传4（Ninja Gaiden 4）', hk: 'ARC Raiders' },
                { rank: 3, us: '我的世界（Minecraft）', jp: '暗黑破坏神4（Diablo IV）', hk: '我的世界（Minecraft）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: '严阵以待（Ready or Not）', hk: '严阵以待（Ready or Not）' },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: '战地风云6（Battlefield 6）' },
                { rank: 4, us: '无主之地4（Borderlands 4）', jp: '无主之地4（Borderlands 4）', hk: '无主之地4（Borderlands 4）' },
                { rank: 5, us: '辐射4（Fallout 4）', jp: '辐射4（Fallout 4）', hk: '辐射4（Fallout 4）' },
                { rank: 6, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26' },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 3, us: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '我的世界（Minecraft）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '体育游戏专题', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26', usNonGame: true },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
            ] },
        } },
        { date: '2026-01-06', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '天外世界2（The Outer Worlds 2）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: '忍者龙剑传4（Ninja Gaiden 4）', jp: '暗黑破坏神4（Diablo IV）', hk: 'ARC Raiders' },
                { rank: 3, us: '严阵以待（Ready or Not）', jp: '天外世界2（The Outer Worlds 2）', hk: '我的世界（Minecraft）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: '严阵以待（Ready or Not）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: 'EA Sports FC 26' },
                { rank: 4, us: '无主之地4（Borderlands 4）', jp: '无主之地4（Borderlands 4）', hk: '我的世界（Minecraft）' },
                { rank: 5, us: '辐射4（Fallout 4）', jp: '辐射4（Fallout 4）', hk: '双人成行（It Takes Two）' },
                { rank: 6, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26' },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 3, us: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '我的世界（Minecraft）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '体育游戏专题', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26', usNonGame: true },
                { rank: 2, us: '生化危机:安魂曲（Resident Evil: Requiem）', jp: '生化危机:安魂曲（Resident Evil: Requiem）', hk: '生化危机:安魂曲（Resident Evil: Requiem）' },
            ] },
        } },
        { date: '2026-01-05', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: '双影奇境（Split Fiction）', hk: '特卖倒计时（countdown sale）', usNonGame: true, hkNonGame: true },
                { rank: 2, us: 'ARC Raiders', jp: 'ARC Raiders', hk: '暗黑破坏神4（Diablo IV）' },
                { rank: 3, us: '我的世界（Minecraft）', jp: '辐射4（Fallout 4）', hk: '天外世界2（The Outer Worlds 2）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: '严阵以待（Ready or Not）', hk: '严阵以待（Ready or Not）' },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: '战地风云6（Battlefield 6）' },
                { rank: 4, us: '无主之地4（Borderlands 4）', jp: '无主之地4（Borderlands 4）', hk: '无主之地4（Borderlands 4）' },
                { rank: 5, us: '辐射4（Fallout 4）', jp: '辐射4（Fallout 4）', hk: '辐射4（Fallout 4）' },
                { rank: 6, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '我的世界（Minecraft）', jp: 'Xbox 狂欢季', hk: 'Xbox 狂欢季', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: 'Xbox 狂欢季', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true },
                { rank: 3, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: 'The Game Awards', hk: 'The Game Awards', jpNonGame: true, hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '堡垒之夜（Fortnite）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: '战地风云6（Battlefield 6）' },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: '严阵以待（Ready or Not）', hk: '严阵以待（Ready or Not）' },
            ] },
        } },
        { date: '2026-01-04', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
                { rank: 2, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '暗黑破坏神4（Diablo IV）', hk: '暗黑破坏神4（Diablo IV）' },
                { rank: 3, us: '忍者龙剑传4（Ninja Gaiden 4）', jp: '天外世界2（The Outer Worlds 2）', hk: '天外世界2（The Outer Worlds 2）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: '严阵以待（Ready or Not）', hk: '严阵以待（Ready or Not）' },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: '战地风云6（Battlefield 6）' },
                { rank: 4, us: '无主之地4（Borderlands 4）', jp: '无主之地4（Borderlands 4）', hk: '无主之地4（Borderlands 4）' },
                { rank: 5, us: '辐射4（Fallout 4）', jp: '辐射4（Fallout 4）', hk: '辐射4（Fallout 4）' },
                { rank: 6, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '我的世界（Minecraft）', jp: 'Xbox 狂欢季', hk: 'Xbox 狂欢季', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: 'Xbox 狂欢季', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true },
                { rank: 3, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: 'The Game Awards', hk: 'The Game Awards', jpNonGame: true, hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '堡垒之夜（Fortnite）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: '战地风云6（Battlefield 6）' },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: '严阵以待（Ready or Not）', hk: '严阵以待（Ready or Not）' },
            ] },
        } },
        { date: '2025-12-31', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
                { rank: 2, us: '特卖倒计时（countdown sale）', jp: '天外世界2（The Outer Worlds 2）', hk: '天外世界2（The Outer Worlds 2）', usNonGame: true },
                { rank: 3, us: '极限竞速:地平线5（Forza Horizon 5）', jp: 'ARC Raiders', hk: 'ARC Raiders' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: '严阵以待（Ready or Not）', hk: '严阵以待（Ready or Not）' },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: '战地风云6（Battlefield 6）' },
                { rank: 4, us: '无主之地4（Borderlands 4）', jp: '无主之地4（Borderlands 4）', hk: '无主之地4（Borderlands 4）' },
                { rank: 5, us: '辐射4（Fallout 4）', jp: '辐射4（Fallout 4）', hk: '辐射4（Fallout 4）' },
                { rank: 6, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '体育游戏专题', jp: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', hk: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', usNonGame: true },
                { rank: 2, us: '我的世界（Minecraft）', jp: 'The Game Awards', hk: 'The Game Awards', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: 'Xbox 狂欢季', hk: 'Xbox 狂欢季', jpNonGame: true, hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '堡垒之夜（Fortnite）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: 'The Game Awards', jp: 'Xbox 狂欢季', hk: 'Xbox 狂欢季', isNonGame: true },
            ] },
        } },
        { date: '2025-12-30', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '我的世界（Minecraft）', jp: '双影奇境（Split Fiction）', hk: '严阵以待（Ready or Not）' },
                { rank: 2, us: 'Game Pass 会员优惠', jp: '严阵以待（Ready or Not）', hk: '忍者龙剑传4（Ninja Gaiden 4）', usNonGame: true },
                { rank: 3, us: '暗黑破坏神4（Diablo IV）', jp: '辐射4（Fallout 4）', hk: '特卖倒计时（countdown sale）', hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '堡垒之夜（Fortnite）', jp: '堡垒之夜（Fortnite）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: '严阵以待（Ready or Not）' },
                { rank: 3, us: '罗布乐思（Roblox）', jp: '罗布乐���（Roblox）', hk: '战地风云6（Battlefield 6）' },
                { rank: 4, us: '使命召唤:战区（Call of Duty:Warzone）', jp: '使命召唤:战区（Call of Duty:Warzone）', hk: '无主之地4（Borderlands 4）' },
                { rank: 5, us: '狂野飙车9:竞速传奇（Asphalt Legends）', jp: '狂野飙车9:竞速传奇（Asphalt Legends）', hk: '辐射4（Fallout 4���' },
                { rank: 6, us: '极速滑板（skate）', jp: '极速滑板（skate）', hk: 'EA Sports FC 26' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '体育游戏专题', jp: 'The Game Awards', hk: 'The Game Awards', isNonGame: true },
                { rank: 2, us: '我的世界（Minecraft）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: 'Xbox 狂欢季', hk: 'Xbox 狂欢季', jpNonGame: true, hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '潜水员戴夫（Dave the Diver）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: 'The Game Awards', jp: 'The Game Awards', hk: 'Xbox 狂欢季', isNonGame: true },
            ] },
        } },
        { date: '2025-12-29', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
                { rank: 2, us: 'ARC Raiders', jp: 'Game Pass 会员优惠', hk: '天外世界2（The Outer Worlds 2）', jpNonGame: true },
                { rank: 3, us: '我的世界（Minecraft）', jp: '天外世界2（The Outer Worlds 2）', hk: 'ARC Raiders' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: '严阵以待（Ready or Not）', hk: '严阵以待（Ready or Not）' },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: '战地风云6（Battlefield 6）' },
                { rank: 4, us: '无主之地4（Borderlands 4）', jp: '无主之地4（Borderlands 4）', hk: '无主之地4（Borderlands 4）' },
                { rank: 5, us: '辐射4（Fallout 4）', jp: '辐射4（Fallout 4）', hk: '辐射4（Fallout 4）' },
                { rank: 6, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '体育游戏专题', jp: 'The Game Awards', hk: 'The Game Awards', isNonGame: true },
                { rank: 2, us: '我的世界（Minecraft）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 3, us: '严阵以待（Ready or Not）', jp: 'Xbox 狂欢季', hk: 'Xbox 狂欢季', jpNonGame: true, hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '潜水员戴夫（Dave the Diver）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '辐射游戏专题', jp: 'Xbox 狂欢季', hk: 'Xbox 狂欢季', isNonGame: true },
            ] },
        } },
        { date: '2025-12-26', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: 'ARC Raiders', usNonGame: true, jpNonGame: true },
                { rank: 2, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: 'The Game Awards', hk: '我的世界（Minecraft）', jpNonGame: true },
                { rank: 3, us: '忍者龙剑传4（Ninja Gaiden 4）', jp: '天外世界2（The Outer Worlds 2）', hk: '辐射4（Fallout 4）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: '严阵以待（Ready or Not）', hk: 'EA Sports FC 26' },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 4, us: '无主之地4（Borderlands 4）', jp: '无主之地4（Borderlands 4）', hk: '我的世界（Minecraft）' },
                { rank: 5, us: '辐射4（Fallout 4）', jp: '辐射4（Fallout 4）', hk: 'EA Sports FC 25' },
                { rank: 6, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: '双人成行（It Takes Two）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: 'The Game Awards', hk: 'The Game Awards', jpNonGame: true, hkNonGame: true },
                { rank: 2, us: '双影奇境（Split Fiction）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 3, us: 'Game Pass 会员优惠', jp: 'Xbox 狂欢季', hk: 'Xbox 狂欢季', isNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '潜水员戴夫（Dave the Diver）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: 'Xbox 狂欢季', jp: 'Xbox 狂欢季', hk: 'Xbox 狂欢季', isNonGame: true },
                { rank: 2, us: 'The Game Awards', jp: 'The Game Awards', hk: 'The Game Awards', isNonGame: true },
            ] },
        } },
        { date: '2025-12-25', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'ARC Raiders', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '特卖倒计时（countdown sale）', hkNonGame: true },
                { rank: 2, us: '我的世界（Minecraft）', jp: 'ARC Raiders', hk: '天外世界2（The Outer Worlds 2）' },
                { rank: 3, us: '辐射4（Fallout 4）', jp: '我的世界（Minecraft）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '堡垒之夜（Fortnite）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: 'Apex英雄（Apex Legends）', hk: '严阵以待（Ready or Not）' },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: '罗布乐思（Roblox）', hk: '战地风云6（Battlefield 6）' },
                { rank: 4, us: '无主之地4（Borderlands 4）', jp: '我的世界（Minecraft）', hk: '无主之地4（Borderlands 4）' },
                { rank: 5, us: '辐射4（Fallout 4）', jp: '怪物猎人:荒野（Monster Hunter Wilds）', hk: '辐射4（Fallout 4）' },
                { rank: 6, us: 'EA Sports FC 26', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: 'EA Sports FC 26' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: 'The Game Awards', jp: 'The Game Awards', hk: 'The Game Awards', isNonGame: true },
                { rank: 2, us: 'Game Pass 会员优惠', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true },
                { rank: 3, us: 'Xbox 狂欢季', jp: 'Xbox 狂欢季', hk: 'Xbox 狂欢季', isNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '潜水员戴夫（Dave the Diver）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: 'The Game Awards', jp: 'The Game Awards', hk: 'The Game Awards', isNonGame: true },
                { rank: 2, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
            ] },
        } },
        { date: '2025-12-24', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: '忍者龙剑传4（Ninja Gaiden 4）', hk: '忍者龙剑传4（Ninja Gaiden 4）', usNonGame: true },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: 'Game Pass 会员优惠', hk: 'The Game Awards', jpNonGame: true, hkNonGame: true },
                { rank: 3, us: '辐射4（Fallout 4）', jp: 'The Game Awards', hk: 'Xbox 狂欢季', jpNonGame: true, hkNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: '严阵以待（Ready or Not）', hk: 'EA Sports FC 26' },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 4, us: '无主之地4（Borderlands 4）', jp: '无主之地4（Borderlands 4）', hk: '我的世界（Minecraft）' },
                { rank: 5, us: '辐射4（Fallout 4）', jp: '���射4（Fallout 4）', hk: 'EA Sports FC 25' },
                { rank: 6, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: '双人成行（It Takes Two）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: 'The Game Awards', jp: 'The Game Awards', hk: 'The Game Awards', isNonGame: true },
                { rank: 2, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 3, us: 'ARC Raiders', jp: 'Xbox 狂欢季', hk: 'Xbox 狂欢季', jpNonGame: true, hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: '潜水员戴夫（Dave the Diver）', usNonGame: true, jpNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '模拟人生4（The Sims 4）', jp: '模拟人生4（The Sims 4）', hk: '模拟人生4（The Sims 4）' },
                { rank: 2, us: 'The Game Awards', jp: 'The Game Awards', hk: 'The Game Awards', isNonGame: true },
            ] },
        } },
        { date: '2025-12-23', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: 'ARC Raiders', usNonGame: true },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: '辐射4（Fallout 4）', hk: '我的世界（Minecraft）' },
                { rank: 3, us: '双影奇境（Split Fiction）', jp: '双影奇境（Split Fiction）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '堡垒之夜（Fortnite）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: 'Apex英雄（Apex Legends）', hk: 'EA Sports FC 26' },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: '罗布乐思（Roblox）', hk: '极限竞速:地平线5（Forza Horizon 5）' },
                { rank: 4, us: '无主之地4（Borderlands 4）', jp: '我的世界（Minecraft）', hk: '我的世界（Minecraft）' },
                { rank: 5, us: '辐射4（Fallout 4）', jp: '怪物猎人:荒野（Monster Hunter Wilds）', hk: 'EA Sports FC 25' },
                { rank: 6, us: 'EA Sports FC 26', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '双人成行（It Takes Two）' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: 'The Game Awards', jp: 'The Game Awards', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', usNonGame: true, jpNonGame: true },
                { rank: 2, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: 'Apex英雄（Apex Legends）' },
                { rank: 3, us: 'ARC Raiders', jp: 'Xbox 狂欢季', hk: '我的世界（Minecraft）', jpNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: 'The Game Awards', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '极速滑板（skate）', jp: '战地风云6（Battlefield 6）', hk: 'The Game Awards', hkNonGame: true },
                { rank: 2, us: '光与影:33号远征队（Clair Obscur:Expedition 33）', jp: '光与影:33号远征队（Clair Obscur:Expedition 33）', hk: '光与影:33号远征队（Clair Obscur:Expedition 33）' },
            ] },
        } },
        { date: '2025-12-22', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
                { rank: 2, us: '辐射4（Fallout 4）', jp: '暗黑破坏神4（Diablo IV）', hk: '暗黑破坏神4（Diablo IV）' },
                { rank: 3, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '无主之地4（Borderlands 4）', hk: '无主之地4（Borderlands 4）' },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: '严阵以待（Ready or Not）', hk: '严阵以待（Ready or Not）' },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: '战地风云6（Battlefield 6）' },
                { rank: 4, us: '无主之地4（Borderlands 4）', jp: '无主之地4（Borderlands 4）', hk: '无主之地4（Borderlands 4）' },
                { rank: 5, us: '辐射4（Fallout 4）', jp: '辐射4（Fallout 4）', hk: '辐射4（Fallout 4）' },
                { rank: 6, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '双影奇境（Split Fiction）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: 'Game Pass 会员优惠', jp: 'Apex英雄（Apex Legends）', hk: 'Apex英雄（Apex Legends）', usNonGame: true },
                { rank: 3, us: 'The Game Awards', jp: '我的世界（Minecraft）', hk: '我的世界（Minecraft）', usNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: 'The Game Awards', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: '战地风云6（Battlefield 6）' },
                { rank: 2, us: '光与影:33号远征队（Clair Obscur:Expedition 33）', jp: '光与影:33号远征队（Clair Obscur:Expedition 33）', hk: '光与影:33号远征队（Clair Obscur:Expedition 33）' },
            ] },
        } },
        { date: '2025-12-19', slots: {
            'Dash home-banner': { positions: [
                { rank: 1, us: 'Game Pass 会员优惠', jp: 'Game Pass 会员优惠', hk: '特卖倒计时（countdown sale）', isNonGame: true },
                { rank: 2, us: 'Xbox手柄 优惠', jp: '乐高蝙蝠侠:黑暗骑士的遗产（LEGO Batman: Legacy of the Dark Knight）', hk: '新发行游戏', usNonGame: true, hkNonGame: true },
                { rank: 3, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '毁灭战士:黑暗时代（DOOM: The Dark Ages）', usNonGame: true, jpNonGame: true },
            ] },
            'Dash home-banner2': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）' },
                { rank: 2, us: '严阵以待（Ready or Not）', jp: '严阵以待（Ready or Not）', hk: '严阵以待（Ready or Not）' },
                { rank: 3, us: '战地风云6（Battlefield 6）', jp: '战地风云6（Battlefield 6）', hk: '战地风云6（Battlefield 6）' },
                { rank: 4, us: '无主之地4（Borderlands 4）', jp: '无主之地4（Borderlands 4）', hk: '无主之地4（Borderlands 4）' },
                { rank: 5, us: '辐射4（Fallout 4）', jp: '辐射4（Fallout 4）', hk: '辐射4（Fallout 4）' },
                { rank: 6, us: 'EA Sports FC 26', jp: 'EA Sports FC 26', hk: 'EA Sports FC 26' },
            ] },
            'Store Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Store Home-banner': { positions: [
                { rank: 1, us: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', jp: '使命召唤:黑色行动7（Call of Duty: Black Ops 7）', hk: 'The Game Awards', hkNonGame: true },
                { rank: 2, us: 'The Game Awards', jp: 'Apex英雄（Apex Legends）', hk: 'Xbox 狂欢季', usNonGame: true, hkNonGame: true },
                { rank: 3, us: 'Game Pass 会员优惠', jp: '我的世界（Minecraft）', hk: '独立游戏试玩盛宴', usNonGame: true, hkNonGame: true },
                { rank: 4, us: '趋势游戏（Trending）', jp: '趋势游戏（Trending）', hk: 'The Game Awards 特卖', isNonGame: true },
            ] },
            'Game Home-hero banner': { positions: [
                { rank: 1, us: '特卖倒计时（countdown sale）', jp: '特卖倒计时（countdown sale）', hk: '特卖倒计时（countdown sale）', isNonGame: true },
            ] },
            'Game Home-banner': { positions: [
                { rank: 1, us: '天外世界2（The Outer Worlds 2）', jp: '天外世界2（The Outer Worlds 2）', hk: '天外世界2（The Outer Worlds 2）' },
                { rank: 2, us: '光与影:33号远征队（Clair Obscur:Expedition 33）', jp: '光与影:33号远征队（Clair Obscur:Expedition 33）', hk: '光与影:33号远征队（Clair Obscur:Expedition 33）' },
            ] },
        } },
    ],
};

// ============ Xbox 资源位归并工具 ============

function mergeXboxSlots(daySlots) {
    const merged = {};
    const groupOrder = ['Dash home-banner', 'Store Home-banner', 'Game Home-banner'];

    groupOrder.forEach(groupName => {
        merged[groupName] = { positions: [], subSlotData: {} };
    });

    Object.entries(daySlots).forEach(([slotName, slotData]) => {
        const group = xboxSlotGroupMap[slotName];
        if (group && merged[group]) {
            merged[group].subSlotData[slotName] = slotData;
            slotData.positions.forEach(pos => {
                merged[group].positions.push({ ...pos, sourceSlot: slotName });
            });
        }
    });

    groupOrder.forEach(g => {
        merged[g].positions.sort((a, b) => a.rank - b.rank);
    });

    return merged;
}

// ============ 游戏名双语显示工具 ============

function getGameDisplayName(name, isNonGame) {
    if (isNonGame || !name) return { primary: name || '-', secondary: '' };
    
    const mapped = storewatchGameNameMap[name];
    // 检测原始名称是否主要为中文字符
    const isChinese = /[\u4e00-\u9fff]/.test(name) && !/^[A-Za-z0-9\s]/.test(name);
    
    if (isChinese) {
        // 原始是中文名：中文为主，英文为副
        return { primary: name, secondary: mapped || '' };
    } else {
        // 原始是英文名：英文为主，中文为副
        return { primary: name, secondary: mapped || '' };
    }
}

function renderGameCell(gameName, isNonGame) {
    if (isNonGame) return `<div class="sw2-game-cell non-game"><span class="sw2-game-promo">${gameName}</span></div>`;
    
    const display = getGameDisplayName(gameName, isNonGame);
    const vendor = storewatchVendorMap[gameName];
    const vendorHtml = vendor ? `<span class="sw2-vendor-micro">${vendor}</span>` : '';
    
    return `
        <div class="sw2-game-cell">
            <div class="sw2-game-primary">${display.primary}</div>
            ${display.secondary ? `<div class="sw2-game-secondary">${display.secondary}</div>` : ''}
            ${vendorHtml}
        </div>
    `;
}

// ============ 统计计算（全平台合并） ============

function getCombinedWeeklyStats(days = 7) {
    const allGameCount = {};
    const vendorSlotCoverage = {};
    let totalPositions = 0;

    ['PS5', 'Xbox'].forEach(platform => {
        const data = (storewatchData[platform] || []).slice(0, days);
        data.forEach(day => {
            Object.entries(day.slots).forEach(([slotName, slotData]) => {
                slotData.positions.forEach(pos => {
                    if (pos.isNonGame) return;
                    totalPositions++;

                    [pos.us, pos.jp, pos.hk].forEach(gameName => {
                        if (gameName && !pos.isNonGame) {
                            allGameCount[gameName] = (allGameCount[gameName] || 0) + 1;
                        }
                    });

                    if (pos.vendor) {
                        if (!vendorSlotCoverage[pos.vendor]) {
                            vendorSlotCoverage[pos.vendor] = { total: 0, platforms: new Set(), slots: new Set() };
                        }
                        vendorSlotCoverage[pos.vendor].total++;
                        vendorSlotCoverage[pos.vendor].platforms.add(platform);
                        vendorSlotCoverage[pos.vendor].slots.add(platform === 'Xbox' ? (xboxSlotGroupMap[slotName] || slotName) : slotName);
                    }
                });
            });
        });
    });

    const topGames = Object.entries(allGameCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count], idx) => ({
            rank: idx + 1,
            name,
            count,
            vendor: storewatchVendorMap[name] || '其他',
            display: getGameDisplayName(name, false),
        }));

    const vendorCoverage = Object.entries(vendorSlotCoverage)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 10)
        .map(([name, data]) => ({
            name,
            total: data.total,
            platforms: [...data.platforms].join(' / '),
            slotCount: data.slots.size,
            slots: [...data.slots],
        }));

    return { topGames, vendorCoverage, totalPositions };
}

function getStorewatchStats(platform) {
    const data = storewatchData[platform] || [];
    if (data.length === 0) return { totalDays: 0, totalSlots: 0, topVendors: [], latestDate: '-' };

    const vendorCount = {};
    let totalSlots = 0;

    data.forEach(day => {
        Object.values(day.slots).forEach(slot => {
            slot.positions.forEach(pos => {
                if (!pos.isNonGame && pos.vendor) {
                    vendorCount[pos.vendor] = (vendorCount[pos.vendor] || 0) + 1;
                }
                totalSlots++;
            });
        });
    });

    const topVendors = Object.entries(vendorCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count, pct: ((count / totalSlots) * 100).toFixed(1) }));

    return {
        totalDays: data.length,
        totalSlots,
        topVendors,
        latestDate: data[0]?.date || '-',
        totalGames: Object.keys(vendorCount).length,
    };
}

// ============ 渲染主函数 ============

function updateStorewatchTab() {
    const container = document.getElementById('tab-storewatch');
    if (!container) return;

    const currentPlatform = container.dataset.platform || 'overview';
    const statsPS5 = getStorewatchStats('PS5');
    const statsXbox = getStorewatchStats('Xbox');

    container.innerHTML = `
        <!-- 顶部区域 -->
        <div class="sw2-top-area">
            <div class="sw2-title-bar">
                <div class="sw2-title-left">
                    <h2 class="sw2-main-title">🏪 PS & Xbox 商店资源位监控</h2>
                    <span class="agent-badge" id="storewatchAgentBadge">🤖 StoreWatch Agent</span>
                </div>
                <div class="sw2-meta-info">
                    <span class="sw2-meta-chip">📅 ${storewatchMeta.dataRange}</span>
                    <span class="sw2-meta-chip">🔄 ${storewatchMeta.schedule}</span>
                </div>
            </div>
            <div class="sw2-source-bar">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3M8 10v.5"/></svg>
                数据来源：人工监控 美国、日本、香港三区域商店资源，仅包含 PlayStation — Must See、Top games in your country、What's hot，Xbox — Dash home-banner、Store Home-banner、Game Home-banner 资源
            </div>
        </div>

        <!-- 平台切换 -->
        <div class="sw2-nav">
            <button class="sw2-nav-btn ${currentPlatform === 'overview' ? 'active sw2-nav-summary' : ''}" data-platform="overview">
                📊 近期汇总
            </button>
            <button class="sw2-nav-btn ${currentPlatform === 'PS5' ? 'active sw2-nav-ps' : ''}" data-platform="PS5">
                <span class="sw2-ps-icon">▶</span> PlayStation
            </button>
            <button class="sw2-nav-btn ${currentPlatform === 'Xbox' ? 'active sw2-nav-xbox' : ''}" data-platform="Xbox">
                <span class="sw2-xbox-icon">✖</span> Xbox
            </button>
        </div>

        <!-- 内容区 -->
        <div class="sw2-content">
            ${currentPlatform === 'overview' ? renderOverviewSection(statsPS5, statsXbox) : renderPlatformSection(currentPlatform, currentPlatform === 'PS5' ? statsPS5 : statsXbox)}
        </div>
    `;

    // 绑定平台切换事件
    container.querySelectorAll('.sw2-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.dataset.platform = btn.dataset.platform;
            updateStorewatchTab();
        });
    });
}

// ============ 汇总分析区域（overview） ============

function renderOverviewSection(statsPS5, statsXbox) {
    const weeklyStats = getCombinedWeeklyStats(7);
    const ps5Days = (storewatchData.PS5 || []).length;
    const xboxDays = (storewatchData.Xbox || []).length;

    return `
        <!-- 汇总 KPI 横条 -->
        <div class="sw2-kpi-strip">
            <div class="sw2-kpi-item sw2-kpi-ps-accent">
                <div class="sw2-kpi-num">${ps5Days}</div>
                <div class="sw2-kpi-desc">PlayStation<br>监控天数</div>
            </div>
            <div class="sw2-kpi-item sw2-kpi-xbox-accent">
                <div class="sw2-kpi-num">${xboxDays}</div>
                <div class="sw2-kpi-desc">Xbox<br>监控天数</div>
            </div>
            <div class="sw2-kpi-item">
                <div class="sw2-kpi-num">${weeklyStats.totalPositions}</div>
                <div class="sw2-kpi-desc">近一周<br>总资源位</div>
            </div>
            <div class="sw2-kpi-item sw2-kpi-highlight">
                <div class="sw2-kpi-num">${statsPS5.latestDate}</div>
                <div class="sw2-kpi-desc">最新数据<br>日期</div>
            </div>
        </div>

        <!-- Top 10 曝光游戏 -->
        <div class="sw2-panel">
            <div class="sw2-panel-header">
                <h3>🔥 近一周 Top 10 曝光游戏<span class="sw2-panel-sub">双平台合计 · 三区域累计</span></h3>
            </div>
            <table class="sw2-exec-table">
                <thead>
                    <tr>
                        <th style="width:50px">排名</th>
                        <th>游戏名称</th>
                        <th style="width:80px">发行商</th>
                        <th style="width:80px">曝光次数</th>
                        <th style="width:140px">曝光强度</th>
                    </tr>
                </thead>
                <tbody>
                    ${weeklyStats.topGames.map((g, i) => `
                        <tr class="${i < 3 ? 'sw2-row-top3' : ''}">
                            <td><span class="sw2-rank ${i < 3 ? 'gold' : ''}">${g.rank}</span></td>
                            <td>
                                <div class="sw2-game-primary">${g.display.primary}</div>
                                ${g.display.secondary ? `<div class="sw2-game-secondary">${g.display.secondary}</div>` : ''}
                            </td>
                            <td class="sw2-vendor-quiet">${g.vendor}</td>
                            <td class="sw2-count-bold">${g.count}</td>
                            <td>
                                <div class="sw2-bar-bg">
                                    <div class="sw2-bar-fg" style="width:${Math.min((g.count / weeklyStats.topGames[0].count * 100), 100).toFixed(0)}%"></div>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- 发行商资源位覆盖 -->
        <div class="sw2-panel">
            <div class="sw2-panel-header">
                <h3>🏢 发行商资源位覆盖分析<span class="sw2-panel-sub">近一周 · 跨平台统计</span></h3>
            </div>
            <table class="sw2-exec-table">
                <thead>
                    <tr>
                        <th>发行商</th>
                        <th style="width:80px">占位次数</th>
                        <th style="width:120px">覆盖平台</th>
                        <th style="width:80px">资源位数</th>
                        <th>覆盖资源位</th>
                    </tr>
                </thead>
                <tbody>
                    ${weeklyStats.vendorCoverage.map(v => `
                        <tr>
                            <td class="sw2-vendor-name">${v.name}</td>
                            <td class="sw2-count-bold">${v.total}</td>
                            <td>${v.platforms.split(' / ').map(p => `<span class="sw2-platform-pill ${p === 'PS5' ? 'ps' : 'xbox'}">${p}</span>`).join(' ')}</td>
                            <td>${v.slotCount}</td>
                            <td class="sw2-slot-chips">${v.slots.map(s => `<span class="sw2-slot-chip">${s}</span>`).join('')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ============ 平台详情区域 ============

function renderPlatformSection(platform, stats) {
    const data = storewatchData[platform] || [];
    const slotPriority = storewatchSlotPriority[platform] || [];
    const cls = platform === 'PS5' ? 'ps' : 'xbox';

    return `
        <!-- 平台 KPI -->
        <div class="sw2-kpi-strip sw2-kpi-${cls}">
            <div class="sw2-kpi-item">
                <div class="sw2-kpi-num">${stats.totalDays}</div>
                <div class="sw2-kpi-desc">监控<br>天数</div>
            </div>
            <div class="sw2-kpi-item">
                <div class="sw2-kpi-num">${stats.topVendors[0]?.name || '-'}</div>
                <div class="sw2-kpi-desc">占位最多<br>厂商</div>
            </div>
            <div class="sw2-kpi-item">
                <div class="sw2-kpi-num">${stats.topVendors[0]?.pct || 0}%</div>
                <div class="sw2-kpi-desc">头部<br>占比</div>
            </div>
            <div class="sw2-kpi-item">
                <div class="sw2-kpi-num">${stats.latestDate}</div>
                <div class="sw2-kpi-desc">最新数据<br>日期</div>
            </div>
        </div>

        <!-- 资源位说明 -->
        <div class="sw2-slot-legend sw2-legend-${cls}">
            <div class="sw2-legend-title">📌 资源位价值排序</div>
            <div class="sw2-legend-items">
                ${slotPriority.map((s, i) => `
                    <div class="sw2-legend-item sw2-tier-${s.tier} sw2-${cls}">
                        <span class="sw2-legend-rank">#${i + 1}</span>
                        <span class="sw2-legend-label">${s.label}</span>
                        <span class="sw2-legend-name">${s.name}</span>
                        ${s.subSlots ? `<span class="sw2-legend-sub">含 ${s.subSlots.filter(n => n !== s.name).join('、')}</span>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- 30天厂商曝光 -->
        <div class="sw2-panel">
            <div class="sw2-panel-header">
                <h3>📊 30天厂商商店资源占位分析</h3>
            </div>
            <div class="sw2-bar-chart-area">
                ${renderVendorBarChart(stats.topVendors, platform)}
            </div>
        </div>

        <!-- 近7天资源位详情 -->
        <div class="sw2-panel">
            <div class="sw2-panel-header">
                <h3>📋 近7天资源位详情</h3>
            </div>
            ${renderSevenDayDetail(data.slice(0, 7), slotPriority, platform)}
        </div>

        <!-- 最新1天 -->
        <div class="sw2-panel">
            <div class="sw2-panel-header">
                <h3>🔍 最新数据详细 · ${data[0]?.date || '-'}</h3>
            </div>
            ${renderLatestDayDetail(data[0], slotPriority, platform)}
        </div>
    `;
}

// ============ 厂商柱状图渲染 ============

function renderVendorBarChart(topVendors, platform) {
    if (!topVendors || topVendors.length === 0) return '<div class="sw2-empty">暂无数据</div>';

    const maxCount = topVendors[0]?.count || 1;
    const cls = platform === 'PS5' ? 'ps' : 'xbox';

    return `
        <div class="sw2-h-bars">
            ${topVendors.map((v, i) => {
                const pct = (v.count / maxCount * 100).toFixed(1);
                return `
                <div class="sw2-h-bar-row">
                    <div class="sw2-h-bar-label">${v.name}</div>
                    <div class="sw2-h-bar-track">
                        <div class="sw2-h-bar-fill sw2-fill-${cls}" style="width:${pct}%;animation-delay:${i * 60}ms">
                            <span class="sw2-h-bar-val">${v.count}次 (${v.pct}%)</span>
                        </div>
                    </div>
                </div>`;
            }).join('')}
        </div>
    `;
}

// ============ 7天详情渲染 ============

function renderSevenDayDetail(days, slotPriority, platform) {
    if (!days || days.length === 0) return '<div class="sw2-empty">暂无近7天数据</div>';
    const cls = platform === 'PS5' ? 'ps' : 'xbox';

    return `<div class="sw2-days-stack">
        ${days.map(day => {
            const processedSlots = platform === 'Xbox' ? mergeXboxSlots(day.slots) : day.slots;
            return `
            <div class="sw2-day-block sw2-day-${cls}">
                <div class="sw2-day-head sw2-head-${cls}">
                    <span class="sw2-day-date-label">${day.date}</span>
                    <span class="sw2-day-weekday-label">${getWeekday(day.date)}</span>
                </div>
                <div class="sw2-day-body">
                    ${slotPriority.map(slotDef => {
                        const slotData = processedSlots[slotDef.name];
                        if (!slotData || slotData.positions.length === 0) return '';
                        return `
                        <div class="sw2-slot-section sw2-tier-${slotDef.tier}-${cls}">
                            <div class="sw2-slot-title-bar">
                                <span class="sw2-slot-tier-dot sw2-dot-${cls}-${slotDef.tier}"></span>
                                <span class="sw2-slot-label">${slotDef.label}</span>
                                <span class="sw2-slot-name">${slotDef.name}</span>
                                ${slotDef.subSlots ? `<span class="sw2-slot-sub">含 ${slotDef.subSlots.filter(n => n !== slotDef.name).join('、')}</span>` : ''}
                            </div>
                            <table class="sw2-region-table">
                                <thead>
                                    <tr>
                                        <th style="width:40px">#</th>
                                        <th>🇺🇸 美国</th>
                                        <th>🇯🇵 日本</th>
                                        <th>🇭🇰 香港</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${slotData.positions.map(pos => {
                                        const rowCls = pos.isNonGame ? 'sw2-non-game' : '';
                                        const src = pos.sourceSlot && pos.sourceSlot !== slotDef.name ? `<span class="sw2-src-tag">${pos.sourceSlot}</span>` : '';
                                        return `
                                        <tr class="${rowCls}">
                                            <td class="sw2-rank-cell"><span class="sw2-pos-num">${pos.rank}</span>${src}</td>
                                            <td>${renderGameCell(pos.us, pos.isNonGame)}</td>
                                            <td>${renderGameCell(pos.jp, pos.isNonGame)}</td>
                                            <td>${renderGameCell(pos.hk, pos.isNonGame)}</td>
                                        </tr>`;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>`;
                    }).join('')}
                </div>
            </div>`;
        }).join('')}
    </div>`;
}

// ============ 最新1天详细渲染 ============

function renderLatestDayDetail(dayData, slotPriority, platform) {
    if (!dayData) return '<div class="sw2-empty">暂无最新数据</div>';
    const cls = platform === 'PS5' ? 'ps' : 'xbox';
    const processedSlots = platform === 'Xbox' ? mergeXboxSlots(dayData.slots) : dayData.slots;

    return `
        <div class="sw2-latest-stack">
            ${slotPriority.map(slotDef => {
                const slotData = processedSlots[slotDef.name];
                if (!slotData || slotData.positions.length === 0) return '';
                return `
                <div class="sw2-latest-block sw2-latest-${cls} sw2-latest-tier-${slotDef.tier}">
                    <div class="sw2-latest-head sw2-head-${cls}">
                        <span class="sw2-tier-pill sw2-pill-${cls}-${slotDef.tier}">${slotDef.label}</span>
                        <span class="sw2-latest-slot-name">${slotDef.name}</span>
                        ${slotDef.subSlots ? `<span class="sw2-legend-sub">含 ${slotDef.subSlots.filter(n => n !== slotDef.name).join('、')}</span>` : ''}
                    </div>
                    <table class="sw2-region-table sw2-latest-table">
                        <thead>
                            <tr>
                                <th style="width:50px">排位</th>
                                <th>🇺🇸 美国</th>
                                <th>🇯🇵 日本</th>
                                <th>🇭🇰 香港</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${slotData.positions.map(pos => {
                                const rowCls = pos.isNonGame ? 'sw2-non-game' : '';
                                const src = pos.sourceSlot && pos.sourceSlot !== slotDef.name ? `<span class="sw2-src-tag">${pos.sourceSlot}</span>` : '';
                                return `
                                <tr class="${rowCls}">
                                    <td class="sw2-rank-cell"><strong>#${pos.rank}</strong>${src}</td>
                                    <td>${renderGameCell(pos.us, pos.isNonGame)}</td>
                                    <td>${renderGameCell(pos.jp, pos.isNonGame)}</td>
                                    <td>${renderGameCell(pos.hk, pos.isNonGame)}</td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>`;
            }).join('')}
        </div>
    `;
}

// ============ 工具函数 ============

function getWeekday(dateStr) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[new Date(dateStr).getDay()];
}
