// ============================================================
// StoreWatch — PS & Xbox 商店资源监控 Tab
// 数据来源：腾讯文档 LXXdrpHEWcSr (sheet BB08J2 + xsejuk)
// 更新频率：工作日每天中午 12:00
// ============================================================

// ============ 元数据 ============
const storewatchMeta = {
    lastUpdated: '2026-03-13',
    dataRange: '2025-12-19 ~ 2026-03-10',
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
// ⚠️ 注意：当前使用基于腾讯文档真实结构的模板数据
// 完整真实数据需通过腾讯文档 API (sheet BB08J2) 拉取后替换
// 数据结构已与腾讯文档完全对齐：platform → date → slot → rank → 三区域游戏名
const storewatchData = {
    PS5: generateSamplePlatformData('PS5'),
    Xbox: generateSamplePlatformData('Xbox'),
};

function generateSamplePlatformData(platform) {
    const slotNames = platform === 'PS5'
        ? ['Must See', 'Top games in your country', "What's hot"]
        : ['Dash home-banner', 'Dash home-banner2', 'Store Home-hero banner', 'Store Home-banner', 'Game Home-hero banner', 'Game Home-banner'];

    const days = [];
    const baseDate = new Date('2026-03-10');

    const sampleGamesPS5 = [
        ['DEATH STRANDING 2: ON THE BEACH', 'Monster Hunter Wilds', 'Split Fiction', 'Gran Turismo 7', 'Stellar Blade', 'Helldivers 2'],
        ['生化危机:安魂曲', "Assassin's Creed Shadows", 'NBA 2K25', 'FC 25', 'GTA Online', 'Fortnite'],
        ['Marvel Rivals', 'Overwatch 2', 'Apex Legends', 'Call of Duty: Black Ops 6', 'Diablo IV', 'Destiny 2'],
    ];
    const sampleGamesXbox = [
        ['战地风云6', 'Avowed', 'Indiana Jones and the Great Circle', 'Call of Duty: Black Ops 6', 'Minecraft', 'Fortnite'],
        ['WWE 2K26', "Sid Meier's Civilization VII", 'Path of Exile 2', 'Hades II', 'Palworld', 'Elden Ring'],
        ['失落星船:马拉松', 'S.T.A.L.K.E.R. 2', 'Hogwarts Legacy', "Baldur's Gate 3", "Dragon Ball: Sparking! Zero", 'Tekken 8'],
        ['Marvel Rivals', 'Dead by Daylight', 'Roblox', 'Apex Legends', 'Overwatch 2', 'NBA 2K25'],
        ['GTA Online', 'The Sims 4', 'FC 25', 'Destiny 2', 'Diablo IV', 'Dragon Age: The Veilguard'],
        ['Black Myth: Wukong', 'Silent Hill 2', 'Star Wars Outlaws', 'Kingdom Come: Deliverance II', 'Sniper Elite: Resistance', 'Lies of P'],
    ];
    const sampleGames = platform === 'PS5' ? sampleGamesPS5 : sampleGamesXbox;

    for (let d = 0; d < 30; d++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() - d);
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        const dateStr = date.toISOString().split('T')[0];
        const dayData = { date: dateStr, slots: {} };

        slotNames.forEach((slotName, si) => {
            const games = sampleGames[si % sampleGames.length];
            dayData.slots[slotName] = {
                positions: games.map((game, idx) => {
                    const shuffled = [...games].sort(() => Math.random() * 0.3 - 0.15);
                    const isNonGame = Math.random() < 0.08;
                    return {
                        rank: idx + 1,
                        us: isNonGame ? '🎮 春季促销' : game,
                        jp: isNonGame ? '🎮 春季促销' : (shuffled[idx] || game),
                        hk: isNonGame ? '🎮 春季促销' : (shuffled[(idx + 1) % shuffled.length] || game),
                        isNonGame: isNonGame,
                        vendor: isNonGame ? null : (storewatchVendorMap[game] || '其他'),
                    };
                }),
            };
        });

        days.push(dayData);
    }

    return days;
}

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
