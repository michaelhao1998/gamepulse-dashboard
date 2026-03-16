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

// ============ 厂商对照表 ============
const storewatchVendorMap = {
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
    "Monster Hunter Wilds": "CAPCOM",
    "DEATH STRANDING 2: ON THE BEACH": "索尼",
    "Split Fiction": "EA",
    "Gran Turismo 7": "索尼",
    "Yu-Gi-Oh! Early Access": "KONAMI",
    "Sid Meier's Civilization VII": "2K",
    "Assassin's Creed Shadows": "育碧",
    "Like a Dragon: Pirate Yakuza in Hawaii": "世嘉",
    "Dynasty Warriors: Origins": "光荣",
    "Kingdom Come: Deliverance II": "Deep Silver",
    "Sniper Elite: Resistance": "Rebellion",
    "Citizen Sleeper 2: Starward Vector": "Fellow Traveller",
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
    "Black Myth: Wukong": "Game Science",
    "Warhammer 40,000: Space Marine 2": "Focus",
    "Silent Hill 2": "KONAMI",
    "Dragon Age: The Veilguard": "EA",
    "Indiana Jones and the Great Circle": "微软",
    "Path of Exile 2": "GGG",
    "Hades II": "Supergiant",
    "S.T.A.L.K.E.R. 2": "GSC",
    "Metaphor: ReFantazio": "Atlus",
    "原神": "米哈游",
    "崩坏:星穹铁道": "米哈游",
    "鸣潮": "库洛",
    "绝区零": "米哈游",
    "无限暖暖": "叠纸",
};

// ============ 非游戏分类标签（灰色字体内容）============
const storewatchNonGameTags = [
    '优惠活动', '游戏专题', '榜单热门', '平台服务',
    '会员订阅', '新品预告', '赛事活动', '硬件推广',
    'DLC/更新', '免费游戏推荐'
];

// ============ 示例数据结构 ============
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

    // 按 rank 排序
    groupOrder.forEach(g => {
        merged[g].positions.sort((a, b) => a.rank - b.rank);
    });

    return merged;
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

                    // 统计游戏曝光（合并三区域去重）
                    [pos.us, pos.jp, pos.hk].forEach(gameName => {
                        if (gameName && !pos.isNonGame) {
                            allGameCount[gameName] = (allGameCount[gameName] || 0) + 1;
                        }
                    });

                    // 统计厂商-资源位覆盖
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
        <!-- Agent Badge & 数据底座说明 -->
        <div class="sw-header-area">
            <div class="agent-badge-bar">
                <span class="agent-badge" id="storewatchAgentBadge">🤖 StoreWatch Agent</span>
                <span class="agent-meta">数据范围: ${storewatchMeta.dataRange} · 更新频率: ${storewatchMeta.schedule}</span>
            </div>
            <div class="sw-data-source-note">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3M8 10v.5"/></svg>
                <span>数据来源：人工监控 美国、日本、香港三区域商店资源，仅包含 PlayStation - Must See、Top games in your country、What's hot，Xbox - Dash home-banner、Store Home-banner、Game Home-banner 资源</span>
            </div>
        </div>

        <!-- 平台切换（含汇总） -->
        <div class="storewatch-platform-switch">
            <button class="sw-platform-btn sw-btn-overview ${currentPlatform === 'overview' ? 'active' : ''}" data-platform="overview">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="16" height="14" rx="2"/><path d="M6 9h8M6 12h5"/></svg>
                📊 近期汇总
            </button>
            <button class="sw-platform-btn sw-btn-ps ${currentPlatform === 'PS5' ? 'active' : ''}" data-platform="PS5">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 14l7-10v6h7l-7 10V14H3z"/></svg>
                PlayStation
            </button>
            <button class="sw-platform-btn sw-btn-xbox ${currentPlatform === 'Xbox' ? 'active' : ''}" data-platform="Xbox">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="14" height="14" rx="3"/><path d="M7 7l6 6M13 7l-6 6"/></svg>
                Xbox
            </button>
        </div>

        ${currentPlatform === 'overview' ? renderOverviewSection(statsPS5, statsXbox) : renderPlatformSection(currentPlatform, currentPlatform === 'PS5' ? statsPS5 : statsXbox)}
    `;

    // 绑定平台切换事件
    container.querySelectorAll('.sw-platform-btn').forEach(btn => {
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
        <!-- 汇总 KPI -->
        <div class="sw-kpi-row sw-kpi-4col">
            <div class="sw-kpi-card sw-kpi-ps">
                <div class="sw-kpi-value">${ps5Days}</div>
                <div class="sw-kpi-label">PlayStation 监控天数</div>
            </div>
            <div class="sw-kpi-card sw-kpi-xbox">
                <div class="sw-kpi-value">${xboxDays}</div>
                <div class="sw-kpi-label">Xbox 监控天数</div>
            </div>
            <div class="sw-kpi-card accent">
                <div class="sw-kpi-value">${statsPS5.latestDate}</div>
                <div class="sw-kpi-label">最新数据日期</div>
            </div>
            <div class="sw-kpi-card">
                <div class="sw-kpi-value">${weeklyStats.totalPositions}</div>
                <div class="sw-kpi-label">近一周总资源位</div>
            </div>
        </div>

        <!-- Top 10 曝光游戏 -->
        <div class="sw-section">
            <h3 class="sw-section-title">🔥 近一周 Top 10 曝光游戏（双平台合计）</h3>
            <div class="sw-overview-card">
                <table class="sw-overview-table">
                    <thead>
                        <tr>
                            <th>排名</th>
                            <th>游戏名称</th>
                            <th>发行商</th>
                            <th>曝光次数</th>
                            <th>曝光占比</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${weeklyStats.topGames.map((g, i) => `
                            <tr>
                                <td><span class="sw-rank-badge ${i < 3 ? 'top3' : ''}">${g.rank}</span></td>
                                <td class="sw-game-name">${g.name}</td>
                                <td><span class="sw-vendor-chip">${g.vendor}</span></td>
                                <td><strong>${g.count}</strong></td>
                                <td>
                                    <div class="sw-mini-bar">
                                        <div class="sw-mini-bar-fill" style="width:${Math.min((g.count / weeklyStats.topGames[0].count * 100), 100).toFixed(0)}%"></div>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 发行商资源位覆盖 -->
        <div class="sw-section">
            <h3 class="sw-section-title">🏢 发行商资源位覆盖（近一周）</h3>
            <div class="sw-overview-card">
                <table class="sw-overview-table">
                    <thead>
                        <tr>
                            <th>发行商</th>
                            <th>总占位数</th>
                            <th>覆盖平台</th>
                            <th>覆盖资源位数</th>
                            <th>覆盖资源位</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${weeklyStats.vendorCoverage.map(v => `
                            <tr>
                                <td><strong>${v.name}</strong></td>
                                <td><span class="sw-count-highlight">${v.total}</span></td>
                                <td>${v.platforms.split(' / ').map(p => `<span class="sw-platform-tag ${p === 'PS5' ? 'ps' : 'xbox'}">${p}</span>`).join(' ')}</td>
                                <td>${v.slotCount}</td>
                                <td class="sw-slot-list">${v.slots.map(s => `<span class="sw-mini-slot">${s}</span>`).join('')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ============ 平台详情区域 ============

function renderPlatformSection(platform, stats) {
    const data = storewatchData[platform] || [];
    const slotPriority = storewatchSlotPriority[platform] || [];

    return `
        <!-- 平台 KPI -->
        <div class="sw-kpi-row">
            <div class="sw-kpi-card ${platform === 'PS5' ? 'sw-kpi-ps' : 'sw-kpi-xbox'}">
                <div class="sw-kpi-value">${stats.totalDays}</div>
                <div class="sw-kpi-label">监控天数</div>
            </div>
            <div class="sw-kpi-card accent">
                <div class="sw-kpi-value">${stats.topVendors[0]?.name || '-'}</div>
                <div class="sw-kpi-label">占位最多厂商</div>
            </div>
            <div class="sw-kpi-card">
                <div class="sw-kpi-value">${stats.topVendors[0]?.pct || 0}%</div>
                <div class="sw-kpi-label">头部占比</div>
            </div>
            <div class="sw-kpi-card">
                <div class="sw-kpi-value">${stats.latestDate}</div>
                <div class="sw-kpi-label">最新数据日期</div>
            </div>
        </div>

        <!-- 资源位价值说明 -->
        <div class="sw-slot-legend ${platform === 'PS5' ? 'sw-legend-ps' : 'sw-legend-xbox'}">
            <h4>📌 资源位价值排序（${platform === 'PS5' ? 'PlayStation' : 'Xbox'}）</h4>
            <div class="sw-slot-tiers">
                ${slotPriority.map((s, i) => `
                    <div class="sw-slot-tier tier-${s.tier} ${platform === 'PS5' ? 'ps-tier' : 'xbox-tier'}">
                        <span class="sw-tier-rank">#${i + 1}</span>
                        <span class="sw-tier-label">${s.label}</span>
                        <span class="sw-tier-name">${s.name}</span>
                        ${s.subSlots ? `<span class="sw-tier-sub">含 ${s.subSlots.filter(n => n !== s.name).join('、')}</span>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- 30天厂商曝光分析 -->
        <div class="sw-section">
            <h3 class="sw-section-title">📊 30天厂商商店资源占位分析</h3>
            <div class="sw-vendor-chart-area">
                ${renderVendorBarChart(stats.topVendors, platform)}
            </div>
        </div>

        <!-- 7天资源位详情（分列） -->
        <div class="sw-section">
            <h3 class="sw-section-title">📋 近7天资源位详情</h3>
            <div class="sw-7day-grid">
                ${renderSevenDayDetail(data.slice(0, 7), slotPriority, platform)}
            </div>
        </div>

        <!-- 最新1天详细 -->
        <div class="sw-section">
            <h3 class="sw-section-title">🔍 最新数据详细（${data[0]?.date || '-'}）</h3>
            <div class="sw-latest-detail">
                ${renderLatestDayDetail(data[0], slotPriority, platform)}
            </div>
        </div>
    `;
}

// ============ 厂商柱状图渲染 ============

function renderVendorBarChart(topVendors, platform) {
    if (!topVendors || topVendors.length === 0) return '<div class="sw-empty">暂无数据</div>';

    const maxCount = topVendors[0]?.count || 1;
    const psColors = ['#003087', '#0050b3', '#0070d1', '#0088e0', '#00a0f0', '#22b8ff', '#55ccff', '#88ddff', '#aaeeff', '#ccf4ff'];
    const xboxColors = ['#107c10', '#1a8c1a', '#249c24', '#30ac30', '#3dbc3d', '#50cc50', '#66d966', '#80e580', '#99ee99', '#b3f5b3'];
    const colors = platform === 'PS5' ? psColors : xboxColors;

    return `
        <div class="sw-bar-chart">
            ${topVendors.map((v, i) => `
                <div class="sw-bar-row">
                    <div class="sw-bar-label">${v.name}</div>
                    <div class="sw-bar-track">
                        <div class="sw-bar-fill" style="width: ${(v.count / maxCount * 100).toFixed(1)}%; background: ${colors[i % colors.length]}">
                            <span class="sw-bar-value">${v.count}次 (${v.pct}%)</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ============ 7天详情渲染（三区域分列+厂商） ============

function renderSevenDayDetail(days, slotPriority, platform) {
    if (!days || days.length === 0) return '<div class="sw-empty">暂无近7天数据</div>';

    return days.map(day => {
        // Xbox 需要归并资源位
        const processedSlots = platform === 'Xbox' ? mergeXboxSlots(day.slots) : day.slots;

        return `
        <div class="sw-day-card ${platform === 'PS5' ? 'sw-day-ps' : 'sw-day-xbox'}">
            <div class="sw-day-header ${platform === 'PS5' ? 'sw-header-ps' : 'sw-header-xbox'}">
                <span class="sw-day-date">${day.date}</span>
                <span class="sw-day-weekday">${getWeekday(day.date)}</span>
            </div>
            <div class="sw-day-slots">
                ${slotPriority.map(slotDef => {
                    const slotData = processedSlots[slotDef.name];
                    if (!slotData || slotData.positions.length === 0) return '';
                    const tierClass = platform === 'PS5' ? `ps-tier-${slotDef.tier}` : `xbox-tier-${slotDef.tier}`;
                    return `
                        <div class="sw-slot-block ${tierClass}">
                            <div class="sw-slot-header-bar">
                                <span class="sw-slot-header-label">${slotDef.label}</span>
                                <span class="sw-slot-header-name">${slotDef.name}</span>
                                ${slotDef.subSlots ? `<span class="sw-slot-header-sub">含 ${slotDef.subSlots.filter(n => n !== slotDef.name).join('、')}</span>` : ''}
                            </div>
                            <table class="sw-7day-table">
                                <thead>
                                    <tr>
                                        <th class="col-rank">#</th>
                                        <th class="col-region">🇺🇸 美国</th>
                                        <th class="col-region">🇯🇵 日本</th>
                                        <th class="col-region">🇭🇰 香港</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${slotData.positions.map(pos => {
                                        const vendorUS = getVendorTag(pos.us, pos.isNonGame);
                                        const vendorJP = getVendorTag(pos.jp, pos.isNonGame);
                                        const vendorHK = getVendorTag(pos.hk, pos.isNonGame);
                                        const rowClass = pos.isNonGame ? 'non-game-row' : '';
                                        const sourceNote = pos.sourceSlot && pos.sourceSlot !== slotDef.name ? ` <span class="sw-source-note">${pos.sourceSlot}</span>` : '';
                                        return `
                                        <tr class="${rowClass}">
                                            <td class="col-rank"><span class="sw-pos-rank">${pos.rank}</span>${sourceNote}</td>
                                            <td class="col-region">
                                                <div class="sw-cell-game">${pos.us}</div>
                                                <div class="sw-cell-vendor">${vendorUS}</div>
                                            </td>
                                            <td class="col-region">
                                                <div class="sw-cell-game">${pos.jp}</div>
                                                <div class="sw-cell-vendor">${vendorJP}</div>
                                            </td>
                                            <td class="col-region">
                                                <div class="sw-cell-game">${pos.hk}</div>
                                                <div class="sw-cell-vendor">${vendorHK}</div>
                                            </td>
                                        </tr>`;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>`;
    }).join('');
}

// ============ 最新1天详细渲染 ============

function renderLatestDayDetail(dayData, slotPriority, platform) {
    if (!dayData) return '<div class="sw-empty">暂无最新数据</div>';

    const processedSlots = platform === 'Xbox' ? mergeXboxSlots(dayData.slots) : dayData.slots;

    return `
        <div class="sw-latest-grid">
            ${slotPriority.map(slotDef => {
                const slotData = processedSlots[slotDef.name];
                if (!slotData || slotData.positions.length === 0) return '';
                const tierClass = platform === 'PS5' ? `ps-tier-${slotDef.tier}` : `xbox-tier-${slotDef.tier}`;
                return `
                    <div class="sw-latest-slot ${tierClass}">
                        <div class="sw-latest-slot-header ${platform === 'PS5' ? 'sw-header-ps' : 'sw-header-xbox'}">
                            <span class="sw-tier-badge ${tierClass}">${slotDef.label}</span>
                            <span class="sw-slot-name">${slotDef.name}</span>
                            ${slotDef.subSlots ? `<span class="sw-tier-sub-header">含 ${slotDef.subSlots.filter(n => n !== slotDef.name).join('、')}</span>` : ''}
                        </div>
                        <table class="sw-latest-table">
                            <thead>
                                <tr>
                                    <th>排位</th>
                                    <th>🇺🇸 美国</th>
                                    <th>🇯🇵 日本</th>
                                    <th>🇭🇰 香港</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${slotData.positions.map(pos => {
                                    const rowClass = pos.isNonGame ? 'non-game-row' : '';
                                    const sourceNote = pos.sourceSlot && pos.sourceSlot !== slotDef.name ? ` <span class="sw-source-note">${pos.sourceSlot}</span>` : '';
                                    return `
                                    <tr class="${rowClass}">
                                        <td><strong>#${pos.rank}</strong>${sourceNote}</td>
                                        <td>
                                            <div>${pos.us}</div>
                                            <div class="sw-cell-vendor">${getVendorTag(pos.us, pos.isNonGame)}</div>
                                        </td>
                                        <td>
                                            <div>${pos.jp}</div>
                                            <div class="sw-cell-vendor">${getVendorTag(pos.jp, pos.isNonGame)}</div>
                                        </td>
                                        <td>
                                            <div>${pos.hk}</div>
                                            <div class="sw-cell-vendor">${getVendorTag(pos.hk, pos.isNonGame)}</div>
                                        </td>
                                    </tr>`;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// ============ 工具函数 ============

function getVendorTag(gameName, isNonGame) {
    if (isNonGame || !gameName) return '<span class="sw-tag-chip">非游戏</span>';
    const vendor = storewatchVendorMap[gameName];
    if (vendor) return `<span class="sw-vendor-chip-sm">${vendor}</span>`;
    return '';
}

function getWeekday(dateStr) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[new Date(dateStr).getDay()];
}
