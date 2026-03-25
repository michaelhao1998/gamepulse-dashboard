// ============================================
// 数据处理模块 - 从API动态加载CSV, 增强数据维度
// ============================================

let allGames = [];
let filteredGames = [];

/** 解析CSV行（处理引号内逗号） */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

/** 加载CSV数据 - 优先使用内嵌数据，回退到API */
async function loadCSVData() {
    try {
        let text = '';
        
        // 优先使用内嵌的CSV数据
        if (typeof EMBEDDED_CSV_DATA !== 'undefined' && EMBEDDED_CSV_DATA) {
            text = EMBEDDED_CSV_DATA;
        } else {
            // 回退到API加载
            let response;
            try {
                response = await fetch('/api/data');
            } catch(e) {
                const csvFiles = ['【260228】产品List.csv'];
                for (const f of csvFiles) {
                    try { response = await fetch(f); if (response.ok) break; } catch(e2) {}
                }
            }
            if (!response || !response.ok) {
                console.error('Failed to load CSV data');
                return [];
            }
            text = await response.text();
        }
        const lines = text.split('\n').filter(l => l.trim());
        const headers = parseCSVLine(lines[0]);

        allGames = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            if (values.length < 10 || !values[0]) continue;

            // 基础字段
            const game = {
                name: values[0] || '',
                publisher: values[1] || '',
                publisherParent: values[2] || '',
                developer: values[3] || '',
                developerParent: values[4] || '',
                mainGenre: values[5] || '',
                subGenre: values[6] || '',
                releaseDate: values[7] || '',
                platform: values[8] || '',
                pc: values[9] || '',
                playstation: values[10] || '',
                xbox: values[11] || '',
                nintendo: values[12] || '',
                lifetimeRevenue: parseFloat(values[13]) || 0,
                lifetimeUnits: parseFloat(values[14]) || 0,
                steamPrice: parseFloat(values[15]) || 0,
                steamRevenue: parseFloat(values[16]) || 0,
                steamUnits: parseFloat(values[17]) || 0,
                vgiSteamRevenue: parseFloat(values[18]) || 0,
                vgiSteamUnits: parseFloat(values[19]) || 0,
                pcDate: values[20] || '',
                psDate: values[21] || '',
                xboxDate: values[22] || '',
                xpgDate: values[23] || '',
                psPlusDate: values[24] || '',
                steamDate: values[25] || '',
                xgpDateTag: values[26] || '',
                dailyRevenue: parseFloat(String(values[27] || '0').replace(/[^0-9.\-]/g, '')) || 0,
                consoleTagRaw: values[28] || '',
                xboxTagRaw: values[29] || '',
                isMajorRaw: values[30] || '0',
                majorLabel: values[31] || '',
                parentCompanyExtra: values[32] || ''
            };

            // 解析日期
            if (game.releaseDate) {
                game.releaseDateObj = new Date(game.releaseDate);
                game.releaseYear = game.releaseDateObj.getFullYear();
                game.releaseMonth = game.releaseDateObj.getMonth() + 1;
                game.releaseQuarter = Math.ceil(game.releaseMonth / 3);
                game.yearMonth = `${game.releaseYear}-${String(game.releaseMonth).padStart(2, '0')}`;
            }

            // ====== V4版增强维度 ======
            
            // console tag / xbox tag (数值型标记)
            const consoleTag = String(game.consoleTagRaw).trim();
            const xboxTag = String(game.xboxTagRaw).trim();
            game.isConsole = consoleTag === '1' ? 'Y' : 'N';
            game.isXbox = xboxTag === '1' ? 'Y' : 'N';
            game.isMajor = String(game.isMajorRaw).trim() === '1';
            game.isBigCorp = game.isMajor ? 1 : 0;
            
            // PC/PS 独立解析
            const rawPc = String(game.pc).trim();
            game.isPC = (rawPc !== '未上线' && rawPc !== '') ? 'Y' : 'N';
            const rawPs = String(game.playstation).trim();
            game.isPS = (rawPs !== '未上线' && rawPs !== '') ? 'Y' : 'N';

            // XGP 策略类型
            const xgpTag = String(game.xgpDateTag).trim();
            if (xgpTag === '首发入库' || xgpTag === 'SimShip' || xgpTag === '1') {
                game.xgpType = '首发入库XGP';
            } else if (xgpTag && xgpTag !== '未上线' && xgpTag !== '0' && xgpTag !== '') {
                game.xgpType = '后发入库XGP';
            } else {
                game.xgpType = '未加入';
            }

            // 收入层级 (基于日均流水)
            if (game.dailyRevenue >= 250000) game.revenueTier = '> $250k';
            else if (game.dailyRevenue >= 200000) game.revenueTier = '$200k - $250k';
            else if (game.dailyRevenue >= 150000) game.revenueTier = '$150k - $200k';
            else if (game.dailyRevenue >= 100000) game.revenueTier = '$100k - $150k';
            else if (game.dailyRevenue >= 50000) game.revenueTier = '$50k - $100k';
            else game.revenueTier = '< $50k';

            // 平台数组（兼容旧逻辑）
            game.platforms = [];
            if (game.isPC === 'Y') game.platforms.push('PC');
            if (game.isPS === 'Y') game.platforms.push('PS');
            if (game.isXbox === 'Y') game.platforms.push('Xbox');
            if (game.nintendo && game.nintendo !== '未上线' && game.nintendo !== '') game.platforms.push('Nintendo');
            game.platformCount = game.platforms.length;
            game.hasConsole = game.isConsole === 'Y';
            game.isMultiPlatform = game.platformCount > 1;

            // 补充品类（V4逻辑 - 空品类推断）
            if (!game.mainGenre || game.mainGenre === 'Unknown') {
                const aiInferred = {
                    "College Football": "Sports", "Madden": "Sports", "FIFA": "Sports", "FC": "Sports",
                    "Call of Duty": "Shooter", "Battlefield": "Shooter", "Monster Hunter": "Action",
                    "Mario": "Action/Adventure", "Pokémon": "RPG", "Zelda": "Action/Adventure"
                };
                let inferred = "Action/Adventure";
                for (const [key, val] of Object.entries(aiInferred)) {
                    if (game.name.toLowerCase().includes(key.toLowerCase())) { inferred = val; break; }
                }
                game.mainGenre = inferred;
                game.isGenreInferred = true;
            }

            // 计算基于Mscience的日均流水（基于数据截止日期2026-02-28）
            if (game.releaseDateObj && game.lifetimeRevenue > 0) {
                const diffMs = DATA_CUTOFF_DATE - game.releaseDateObj;
                game.daysOnline = Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 1);
                game.mscienceDailyRev = game.lifetimeRevenue / game.daysOnline;
            } else {
                game.daysOnline = 0;
                game.mscienceDailyRev = 0;
            }
            // 保留原始CSV中的dailyRevenue作为对比
            game.originalDailyRevenue = game.dailyRevenue;

            allGames.push(game);
        }

        filteredGames = [...allGames];
        return allGames;
    } catch (error) {
        console.error('Failed to load CSV:', error);
        return [];
    }
}

// ============ 战略分析函数 (V4新增) ============

/** 战略漏斗节点计算 */
function getFlowNodes(games) {
    const total = games.length;
    const consoleY = games.filter(d => d.isConsole === 'Y').length;
    const consoleN = total - consoleY;
    const xboxY = games.filter(d => d.isConsole === 'Y' && d.isXbox === 'Y').length;
    const psY = games.filter(d => d.isConsole === 'Y' && d.isPS === 'Y').length;
    const bothPlatform = games.filter(d => d.isConsole === 'Y' && d.isXbox === 'Y' && d.isPS === 'Y').length;

    // SimShip: 双平台同步发行（PS日期和Xbox日期相同且均非空）
    const normDate = (s) => { if (!s) return ''; return s.replace(/[\/\-\.]/g, '').trim(); };
    const simship = games.filter(d => {
        if (d.isConsole !== 'Y' || d.isXbox !== 'Y' || d.isPS !== 'Y') return false;
        const ps = normDate(d.psDate), xb = normDate(d.xboxDate);
        return ps !== '' && xb !== '' && ps === xb;
    }).length;

    const sim = games.filter(d => d.isXbox === 'Y' && d.xgpType === '首发入库XGP').length;
    const aft = games.filter(d => d.isXbox === 'Y' && d.xgpType === '后发入库XGP').length;
    const noXgp = xboxY - sim - aft;
    return { total, consoleN, consoleY, xboxY, psY, bothPlatform, simship, sim, aft, noXgp };
}

/** 收入层级 × XGP策略交叉表 */
function getTierXGPCross(games) {
    const tiers = ['> $250k', '$200k - $250k', '$150k - $200k', '$100k - $150k', '$50k - $100k', '< $50k'];
    const xboxGames = games.filter(d => d.isXbox === 'Y');
    const totalAft = xboxGames.filter(d => d.xgpType === '后发入库XGP').length || 1;
    const totalSim = xboxGames.filter(d => d.xgpType === '首发入库XGP').length || 1;
    const totalNone = xboxGames.filter(d => d.xgpType === '未加入').length || 1;

    return tiers.map(tier => {
        const group = xboxGames.filter(d => d.revenueTier === tier);
        const rowTotal = group.length;
        const cAft = group.filter(d => d.xgpType === '后发入库XGP').length;
        const cSim = group.filter(d => d.xgpType === '首发入库XGP').length;
        const cNone = group.filter(d => d.xgpType === '未加入').length;
        return {
            range: tier, rowTotal, cAft, cSim, cNone,
            pAft: rowTotal ? Math.round((cAft / rowTotal) * 100) : 0,
            pSim: rowTotal ? Math.round((cSim / rowTotal) * 100) : 0,
            pNone: rowTotal ? Math.round((cNone / rowTotal) * 100) : 0,
            pAftV: Math.round((cAft / totalAft) * 100),
            pSimV: Math.round((cSim / totalSim) * 100),
            pNoneV: Math.round((cNone / totalNone) * 100),
        };
    });
}

/** XGP策略 × 收入层级分布 (纵向) */
function getStrategyBreakdown(games) {
    const xboxGames = games.filter(d => d.isXbox === 'Y');
    const tiers = ['> $250k', '$200k - $250k', '$150k - $200k', '$100k - $150k', '$50k - $100k', '< $50k'];
    const strats = [
        { id: '后发入库XGP', label: '后发入库XGP' },
        { id: '首发入库XGP', label: '首发入库XGP' },
        { id: '未加入', label: '上Xbox未入库' }
    ];
    return strats.map(strat => {
        const stratGames = xboxGames.filter(d => d.xgpType === strat.id);
        const total = stratGames.length;
        const segments = tiers.map(tier => {
            const count = stratGames.filter(d => d.revenueTier === tier).length;
            return { tier, count, pct: total ? Math.round((count / total) * 100) : 0 };
        });
        return { ...strat, total, segments };
    });
}

/** 发行商背景XGP分析 */
function getPublisherBgData(games) {
    const msKeywords = ['Microsoft', 'Xbox', 'Bethesda', 'Turn 10', 'Playground', 'Ninja Theory', 'Obsidian', 'Double Fine', 'inXile', 'Compulsion', 'Undead Labs', 'Mojang', '343', 'The Coalition', 'Rare', 'MachineGames', 'Tango', 'id Software', 'Arkane', 'ZeniMax', 'Activision', 'Blizzard'];
    const isMs = (pub) => msKeywords.some(k => pub.toLowerCase().includes(k.toLowerCase()));
    
    const xboxGames = games.filter(d => d.isXbox === 'Y');
    const ms = xboxGames.filter(d => isMs(d.publisher) || isMs(d.name));
    const thirdPartyBig = xboxGames.filter(d => d.isBigCorp === 1 && !isMs(d.publisher) && !isMs(d.name));
    const indies = xboxGames.filter(d => d.isBigCorp === 0 && !isMs(d.publisher) && !isMs(d.name));

    const calc = (arr, label) => {
        const total = arr.length;
        const sim = arr.filter(d => d.xgpType === '首发入库XGP').length;
        const aft = arr.filter(d => d.xgpType === '后发入库XGP').length;
        const none = arr.filter(d => d.xgpType === '未加入').length;
        return {
            label, total,
            cAft: aft, cSim: sim, cNone: none,
            pSim: total ? Math.round((sim / total) * 100) : 0,
            pAft: total ? Math.round((aft / total) * 100) : 0,
            pNone: total ? Math.round((none / total) * 100) : 0,
        };
    };
    return [
        calc(ms, '微软第一方游戏'),
        calc(thirdPartyBig, '第三方大厂'),
        calc(indies, '中小独立团队')
    ];
}

// ============ 原有分析函数 ============

function getKPISummary(games) {
    const totalRevenue = games.reduce((sum, g) => sum + g.lifetimeRevenue, 0);
    const totalUnits = games.reduce((sum, g) => sum + g.lifetimeUnits, 0);
    const avgRevenue = games.length ? totalRevenue / games.length : 0;
    const medianRevenue = getMedian(games.map(g => g.lifetimeRevenue));
    return { totalRevenue, totalUnits, avgRevenue, medianRevenue, totalGames: games.length };
}

function getMonthlyRevenue(games) {
    const monthly = {};
    games.forEach(g => {
        if (g.yearMonth) {
            if (!monthly[g.yearMonth]) monthly[g.yearMonth] = { revenue: 0, count: 0, games: [] };
            monthly[g.yearMonth].revenue += g.lifetimeRevenue;
            monthly[g.yearMonth].count++;
            monthly[g.yearMonth].games.push(g);
        }
    });
    return Object.entries(monthly)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({ month, label: formatMonthLabel(month), ...data }));
}

function getGenreDistribution(games) {
    const genres = {};
    games.forEach(g => {
        const genre = g.mainGenre || '未分类';
        if (!genres[genre]) genres[genre] = { revenue: 0, count: 0, units: 0 };
        genres[genre].revenue += g.lifetimeRevenue;
        genres[genre].count++;
        genres[genre].units += g.lifetimeUnits;
    });
    return Object.entries(genres).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.revenue - a.revenue);
}

function getPlatformDistribution(games) {
    const platforms = { 'PC': { count: 0, revenue: 0 }, 'PlayStation': { count: 0, revenue: 0 }, 'Xbox': { count: 0, revenue: 0 }, 'Nintendo': { count: 0, revenue: 0 } };
    games.forEach(g => {
        if (g.platforms.includes('PC')) { platforms['PC'].count++; platforms['PC'].revenue += g.lifetimeRevenue; }
        if (g.platforms.includes('PS')) { platforms['PlayStation'].count++; platforms['PlayStation'].revenue += g.lifetimeRevenue; }
        if (g.platforms.includes('Xbox')) { platforms['Xbox'].count++; platforms['Xbox'].revenue += g.lifetimeRevenue; }
        if (g.platforms.includes('Nintendo')) { platforms['Nintendo'].count++; platforms['Nintendo'].revenue += g.lifetimeRevenue; }
    });
    return platforms;
}

function getTopPublishers(games, n = 15) {
    const publishers = {};
    games.forEach(g => {
        const pub = g.parentCompanyExtra || g.publisherParent || g.publisher || '未知';
        if (!publishers[pub]) publishers[pub] = { revenue: 0, count: 0, games: [] };
        publishers[pub].revenue += g.lifetimeRevenue;
        publishers[pub].count++;
        publishers[pub].games.push(g.name);
    });
    return Object.entries(publishers).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.revenue - a.revenue).slice(0, n);
}

function getMajorVsIndie(games) {
    const result = { major: { count: 0, revenue: 0, units: 0 }, indie: { count: 0, revenue: 0, units: 0 } };
    games.forEach(g => {
        const target = g.isMajor ? result.major : result.indie;
        target.count++;
        target.revenue += g.lifetimeRevenue;
        target.units += g.lifetimeUnits;
    });
    return result;
}

function getSteamVsTotal(games) {
    let totalRevenue = 0, steamRevenue = 0, gamesWithSteam = 0;
    games.forEach(g => {
        totalRevenue += g.lifetimeRevenue;
        if (g.steamRevenue > 0) { steamRevenue += g.steamRevenue; gamesWithSteam++; }
    });
    return {
        totalRevenue, steamRevenue,
        otherRevenue: totalRevenue - steamRevenue,
        steamRatio: totalRevenue > 0 ? (steamRevenue / totalRevenue * 100).toFixed(1) : 0,
        gamesWithSteam
    };
}

// ============ 筛选函数 (增强版) ============

function applyFilters(filters) {
    filteredGames = allGames.filter(g => {
        if (filters.bigCorp && filters.bigCorp !== 'all') {
            if (filters.bigCorp === '1' && !g.isMajor) return false;
            if (filters.bigCorp === '0' && g.isMajor) return false;
        }
        if (filters.console && filters.console !== 'all') {
            if (g.isConsole !== filters.console) return false;
        }
        if (filters.xgpType && filters.xgpType !== 'all') {
            if (g.xgpType !== filters.xgpType) return false;
        }
        if (filters.genre && filters.genre !== 'all') {
            if (g.mainGenre !== filters.genre) return false;
        }
        if (filters.month && filters.month !== 'all') {
            if (g.yearMonth !== filters.month) return false;
        }
        if (filters.revTier && filters.revTier !== 'all') {
            if (g.revenueTier !== filters.revTier) return false;
        }
        if (filters.search) {
            const s = filters.search.toLowerCase();
            if (!g.name.toLowerCase().includes(s) && !g.publisher.toLowerCase().includes(s) && !g.developer.toLowerCase().includes(s)) return false;
        }
        return true;
    });
    return filteredGames;
}

function getAllGenres() {
    return Array.from(new Set(allGames.map(g => g.mainGenre).filter(Boolean))).sort();
}

function getAllMonths() {
    return Array.from(new Set(allGames.map(g => g.yearMonth).filter(Boolean))).sort().reverse();
}

// ============ 工具函数 ============

function formatRevenue(value) {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
}

function formatNumber(value) {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(0);
}

function formatMonthLabel(yearMonth) {
    const [year, month] = yearMonth.split('-');
    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month)]} ${year.slice(2)}`;
}

function getMedian(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function pct(val, total) { return total ? Math.round((val / total) * 100) : 0; }

// ============ 数据截止日期常量 ============
const DATA_CUTOFF_DATE = new Date('2026-02-28');

/** 计算基于Mscience的日均流水 (Mscience Lifetime Digital Revenue / 上线天数) */
function calcMscienceDailyRevenue(game) {
    if (!game.releaseDateObj || !game.lifetimeRevenue) return 0;
    const diffMs = DATA_CUTOFF_DATE - game.releaseDateObj;
    const days = Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 1);
    game.daysOnline = days;
    return game.lifetimeRevenue / days;
}

/** 获取近期2个月的新游 */
function getRecentGames(games) {
    const allMonths = Array.from(new Set(games.map(g => g.yearMonth).filter(Boolean))).sort().reverse();
    const recentMonths = allMonths.slice(0, 2);
    return games.filter(g => recentMonths.includes(g.yearMonth))
                .sort((a, b) => (b.releaseDateObj || 0) - (a.releaseDateObj || 0));
}

/** 近期新游平台分布 */
function getRecentPlatformDist(recentGames) {
    let pcOnly = 0, pcPs = 0, pcXbox = 0;
    recentGames.forEach(g => {
        if (g.isConsole === 'N') pcOnly++;
        else if (g.isXbox === 'N') pcPs++;
        else pcXbox++;
    });
    return { pcOnly, pcPs, pcXbox };
}

/** 近期新游XGP分布 */
function getRecentXgpDist(recentGames) {
    let sim = 0, aft = 0, none = 0;
    recentGames.filter(g => g.isXbox === 'Y').forEach(g => {
        if (g.xgpType === '首发入库XGP') sim++;
        else if (g.xgpType === '后发入库XGP') aft++;
        else none++;
    });
    return { sim, aft, none };
}

/** 发行商收入统计 - 按Mscience日均流水（取Top 20） */
function getPublisherDailyRevenue(games, n = 20) {
    const publishers = {};
    games.forEach(g => {
        const pub = g.parentCompanyExtra || g.publisherParent || g.publisher || '未知';
        if (!publishers[pub]) publishers[pub] = { totalDailyRev: 0, totalLifetimeRev: 0, count: 0, games: [] };
        const dailyRev = calcMscienceDailyRevenue(g);
        publishers[pub].totalDailyRev += dailyRev;
        publishers[pub].totalLifetimeRev += g.lifetimeRevenue;
        publishers[pub].count++;
        publishers[pub].games.push(g);
    });
    return Object.entries(publishers)
        .map(([name, data]) => ({
            name,
            avgDailyRev: data.count ? data.totalDailyRev / data.count : 0,
            totalDailyRev: data.totalDailyRev,
            totalLifetimeRev: data.totalLifetimeRev,
            count: data.count,
            games: data.games
        }))
        .sort((a, b) => b.totalDailyRev - a.totalDailyRev)
        .slice(0, n);
}

/** 游戏类型收入分布 - 按Mscience日均流水 */
function getGenreDailyRevenue(games) {
    const genres = {};
    games.forEach(g => {
        const genre = g.mainGenre || '未分类';
        if (!genres[genre]) genres[genre] = { totalDailyRev: 0, count: 0, games: [] };
        const dailyRev = calcMscienceDailyRevenue(g);
        genres[genre].totalDailyRev += dailyRev;
        genres[genre].count++;
        genres[genre].games.push(g);
    });
    return Object.entries(genres)
        .map(([name, data]) => ({ name, totalDailyRev: data.totalDailyRev, count: data.count, games: data.games }))
        .sort((a, b) => b.totalDailyRev - a.totalDailyRev);
}

/** 月度上线游戏收入趋势 - 按Mscience日均流水 */
function getMonthlyDailyRevenue(games) {
    const monthly = {};
    games.forEach(g => {
        if (g.yearMonth) {
            if (!monthly[g.yearMonth]) monthly[g.yearMonth] = { totalDailyRev: 0, count: 0, games: [] };
            const dailyRev = calcMscienceDailyRevenue(g);
            monthly[g.yearMonth].totalDailyRev += dailyRev;
            monthly[g.yearMonth].count++;
            monthly[g.yearMonth].games.push(g);
        }
    });
    return Object.entries(monthly)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({
            month,
            label: formatMonthLabel(month),
            avgDailyRev: data.count ? data.totalDailyRev / data.count : 0,
            totalDailyRev: data.totalDailyRev,
            count: data.count,
            games: data.games
        }));
}
