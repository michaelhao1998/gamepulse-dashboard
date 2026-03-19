// ============================================
// 应用主逻辑模块 V2
// 融合V4战略分析 + Tab系统 + 增强交互
// ============================================

let currentPage = 1;
const PAGE_SIZE = 20;
let currentMonthlyChartType = 'bar';
let currentMonthlyDailyChartType = 'bar';
let currentTab = 'strategy';
let validationSortKey = 'dailyCalc';
let validationSortDir = 'desc';
let validationPage = 1;
const VALIDATION_PAGE_SIZE = 30;

// ============ 初始化 ============

document.addEventListener('DOMContentLoaded', async () => {
    const games = await loadCSVData();

    if (games.length === 0) {
        console.error('No data loaded');
        return;
    }

    document.getElementById('gameCount').textContent = games.length;

    // 加载数据文件信息
    loadDataFileInfo();

    // 填充筛选选项
    populateFilters();

    // 初始化UI增强功能
    initSidebarCollapse();
    initDataBannerCollapse();
    initCommandPalette();
    initNotificationSystem();
    initPresentationMode();

    // 初始渲染
    updateAll(filteredGames);

    // 绑定事件
    bindEvents();

    // 更新导航角标
    updateNavBadges();

    // 更新数据新鲜度指示器
    updateDataFreshness();

    // 检查Agent状态
    checkAgentStatus();
});

// ============ 数据文件信息 ============

async function loadDataFileInfo() {
    try {
        const resp = await fetch('/api/data/info');
        if (resp.ok) {
            const info = await resp.json();
            const el = document.getElementById('dataFileInfo');
            if (el) {
                const date = new Date(info.lastModified);
                el.innerHTML = `🗂️ <strong>数据文件：</strong>${info.fileName} · 更新于 ${date.toLocaleDateString('zh-CN')}`;
            }
        }
    } catch (e) { /* ignore */ }
}

// ============ 全局更新 ============

function updateAll(games) {
    updateStrategyTab(games);
    updateValidationTab(games);
    updateFilterMatch(games.length);

    // 预初始化 Agent 维护的 Tab（确保切换时数据已就绪）
    if (typeof pipelineData !== 'undefined' && pipelineData.length > 0) {
        setTimeout(() => updatePipelineTab(), 100);
    }
    if (typeof newsData !== 'undefined' && newsData.length > 0) {
        setTimeout(() => updateNewsTab(), 150);
    }
    if (typeof earningsCompanies !== 'undefined' && earningsCompanies.length > 0) {
        setTimeout(() => updateEarningsTab(), 200);
    }
    if (typeof storewatchData !== 'undefined') {
        setTimeout(() => updateStorewatchTab(), 250);
    }
}

function updateFilterMatch(count) {
    const el = document.getElementById('matchCount');
    if (el) el.textContent = count;
}

// ============ Tab: 已上线新游全局概览 ============

function updateStrategyTab(games) {
    // 总览 KPI 卡片（原总览仪表盘）
    updateOverviewKPI(games);

    // 战略 KPI 卡片
    const flow = getFlowNodes(games);
    countUpValue('kpiTotal', flow.total);
    countUpValue('kpiConsole', flow.consoleY);
    document.getElementById('kpiConsolePct').textContent = pct(flow.consoleY, flow.total) + '%';
    countUpValue('kpiXbox', flow.xboxY);
    document.getElementById('kpiXboxPct').textContent = pct(flow.xboxY, flow.consoleY) + '%';
    const xgpTotal = flow.sim + flow.aft;
    countUpValue('kpiXGP', xgpTotal);
    document.getElementById('kpiXGPPct').textContent = pct(xgpTotal, flow.xboxY) + '%';

    // Executive Summary 一句话洞察
    updateExecSummary(games, flow);

    // 战略漏斗流程图
    renderFlowChart(flow, games);

    // 三个新看板（放在XGP分析之上）
    renderPublisherDailyRevChart(getPublisherDailyRevenue(games));
    renderGenreDailyRevChart(getGenreDailyRevenue(games));
    renderMonthlyDailyRevChart(getMonthlyDailyRevenue(games), currentMonthlyDailyChartType);

    // XGP交叉分析
    renderXGPCrossTable(games);
    renderTierBars(games);
    renderStrategyBars(games);

    // 发行商背景分析
    renderPublisherAnalysis(games);

    // AI 洞察
    generateAIInsight(games);
}

// ============ 战略漏斗流程图 ============

function renderFlowChart(flow, games) {
    const container = document.getElementById('flowChart');
    if (!container) return;

    // 洞察文本
    const insightEl = document.getElementById('flowInsight');
    if (insightEl) {
        const consolePct = pct(flow.consoleY, flow.total);
        const xboxPct = pct(flow.xboxY, flow.consoleY);
        const noXgpPct = pct(flow.noXgp, flow.xboxY);
        const simPct = pct(flow.sim, flow.xboxY);
        insightEl.innerHTML = `<b>流向洞察：</b>端主新游Top ${flow.total} 中约 ${consolePct}% 上线主机平台，其中 ${xboxPct}% 上线Xbox；上线Xbox的游戏中，约 ${noXgpPct}% 并未加入XGP，仅约 ${simPct}% 首发入库，少数游戏后发单独入库。`;
    }

    // 流程图节点定义
    const nodes = [
        { id: 'total', label: '全部端主游戏', value: flow.total, x: 20, y: 270, w: 190, h: 86, cls: 'blue', desc: '总计基数', filter: () => games },
        { id: 'no-console', label: '未上线主机', value: flow.consoleN, x: 290, y: 100, w: 190, h: 86, cls: 'muted', desc: `占总数 ${pct(flow.consoleN, flow.total)}%`, filter: () => games.filter(g => g.isConsole === 'N') },
        { id: 'console', label: '已上线主机', value: flow.consoleY, x: 290, y: 440, w: 190, h: 86, cls: 'purple', desc: `占总数 ${pct(flow.consoleY, flow.total)}%`, filter: () => games.filter(g => g.isConsole === 'Y') },
        { id: 'no-xbox', label: '未上线Xbox', value: flow.xboxN, x: 560, y: 270, w: 190, h: 86, cls: 'muted', desc: `占主机 ${pct(flow.xboxN, flow.consoleY)}%`, filter: () => games.filter(g => g.isConsole === 'Y' && g.isXbox === 'N') },
        { id: 'xbox', label: '已登陆Xbox', value: flow.xboxY, x: 560, y: 440, w: 190, h: 86, cls: 'green', desc: `转化率 ${pct(flow.xboxY, flow.consoleY)}%`, filter: () => games.filter(g => g.isXbox === 'Y') },
        { id: 'xgp-after', label: '后发入库XGP', value: flow.aft, x: 840, y: 270, w: 190, h: 86, cls: 'sky', desc: `占Xbox ${pct(flow.aft, flow.xboxY)}%`, filter: () => games.filter(g => g.isXbox === 'Y' && g.xgpType === '后发入库XGP') },
        { id: 'xgp-sim', label: '首发入库XGP', value: flow.sim, x: 840, y: 440, w: 190, h: 86, cls: 'teal', desc: `占Xbox ${pct(flow.sim, flow.xboxY)}%`, filter: () => games.filter(g => g.isXbox === 'Y' && g.xgpType === '首发入库XGP') },
        { id: 'xgp-no', label: '未加入订阅', value: flow.noXgp, x: 840, y: 610, w: 190, h: 86, cls: 'muted', desc: `占Xbox ${pct(flow.noXgp, flow.xboxY)}%`, filter: () => games.filter(g => g.isXbox === 'Y' && g.xgpType === '未加入') },
    ];

    // SVG连接线
    const svgPaths = `
        <path d="M 210 313 C 250 313, 250 143, 290 143" fill="none" stroke="#64748b" stroke-width="3" opacity="0.4"/>
        <path d="M 210 313 C 250 313, 250 483, 290 483" fill="none" stroke="#a855f7" stroke-width="8" opacity="0.6"/>
        <path d="M 480 483 C 520 483, 520 313, 560 313" fill="none" stroke="#64748b" stroke-width="3" opacity="0.4"/>
        <path d="M 480 483 C 520 483, 520 483, 560 483" fill="none" stroke="#22c55e" stroke-width="8" opacity="0.6"/>
        <path d="M 750 483 C 795 483, 795 313, 840 313" fill="none" stroke="#0ea5e9" stroke-width="4" opacity="0.5"/>
        <path d="M 750 483 C 795 483, 795 483, 840 483" fill="none" stroke="#14b8a6" stroke-width="6" opacity="0.6"/>
        <path d="M 750 483 C 795 483, 795 653, 840 653" fill="none" stroke="#64748b" stroke-width="4" opacity="0.4"/>
    `;

    let html = `<div class="flow-svg-wrapper">`;
    html += `<svg class="flow-svg">${svgPaths}</svg>`;

    nodes.forEach(n => {
        html += `
            <div class="flow-node ${n.cls} clickable" style="left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h}px;" data-node-id="${n.id}">
                <span class="node-label">${n.label}</span>
                <span class="node-value">${n.value}</span>
                <span class="node-desc">${n.desc}</span>
            </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;

    // 绑定节点点击事件
    nodes.forEach(n => {
        const nodeEl = container.querySelector(`[data-node-id="${n.id}"]`);
        if (nodeEl && n.filter) {
            nodeEl.addEventListener('click', () => {
                const filteredList = n.filter();
                if (filteredList.length > 0) {
                    showDrilldown(`${n.label} (${n.value} 款)`, filteredList);
                }
            });
        }
    });
}

// ============ XGP 交叉分析表 ============

function renderXGPCrossTable(games) {
    const tbody = document.getElementById('xgpCrossBody');
    if (!tbody) return;

    const crossData = getTierXGPCross(games);
    const xboxGames = games.filter(d => d.isXbox === 'Y');
    let html = '';

    crossData.forEach(row => {
        const xgpTotal = row.cAft + row.cSim;
        html += `<tr>
            <td class="text-left" style="font-weight:700;color:var(--text-primary);">${row.range}</td>
            <td class="cross-highlight clickable-cell" data-tier="${row.range}" data-xgp="all">${xgpTotal}</td>
            <td class="clickable-cell" data-tier="${row.range}" data-xgp="首发入库XGP">${row.cSim}</td>
            <td class="clickable-cell" data-tier="${row.range}" data-xgp="后发入库XGP">${row.cAft}</td>
            <td style="color:var(--text-muted);" class="clickable-cell" data-tier="${row.range}" data-xgp="未加入">${row.cNone}</td>
        </tr>`;
    });

    tbody.innerHTML = html;

    // 绑定单元格点击事件
    tbody.querySelectorAll('.clickable-cell').forEach(cell => {
        cell.addEventListener('click', () => {
            const tier = cell.dataset.tier;
            const xgp = cell.dataset.xgp;
            let matched;
            if (xgp === 'all') {
                matched = xboxGames.filter(g => g.revenueTier === tier && (g.xgpType === '首发入库XGP' || g.xgpType === '后发入库XGP'));
            } else {
                matched = xboxGames.filter(g => g.revenueTier === tier && g.xgpType === xgp);
            }
            if (matched.length > 0) {
                showDrilldown(`${tier} · ${xgp === 'all' ? '加入XGP' : xgp} (${matched.length} 款)`, matched);
            }
        });
    });
}

// ============ 堆叠条形图 - 横向 (各流水段的XGP策略) ============

function renderTierBars(games) {
    const container = document.getElementById('tierBarsContainer');
    const legendEl = document.getElementById('barLegend1');
    const insightEl = document.getElementById('tierBarInsight');
    if (!container) return;

    const crossData = getTierXGPCross(games);

    // 洞察
    if (insightEl) {
        insightEl.innerHTML = `<b>中腰部游戏更偏好首发入库：</b>日流水在5万~15万美元区间首发入库XGP占比明显更高，多为微软旗下工作室产品或高质量独立游戏。`;
    }

    // 图例
    if (legendEl) {
        legendEl.innerHTML = `
            <div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span>后发入库XGP</div>
            <div class="legend-item"><span class="legend-dot" style="background:#14b8a6;"></span>首发入库XGP</div>
            <div class="legend-item"><span class="legend-dot" style="background:#64748b;"></span>未加入</div>`;
    }

    let html = '';
    crossData.forEach(row => {
        html += `<div class="stacked-bar-row">
            <div class="stacked-bar-label">${row.range}</div>
            <div class="stacked-bar-track">`;

        if (row.pAft > 0) html += `<div class="stacked-bar-seg blue" style="width:${row.pAft}%;" title="后发入库XGP: ${row.pAft}%">${row.pAft >= 5 ? row.pAft + '%' : ''}</div>`;
        if (row.pSim > 0) html += `<div class="stacked-bar-seg teal" style="width:${row.pSim}%;" title="首发入库XGP: ${row.pSim}%">${row.pSim >= 5 ? row.pSim + '%' : ''}</div>`;
        if (row.pNone > 0) html += `<div class="stacked-bar-seg slate" style="width:${row.pNone}%;" title="未加入: ${row.pNone}%">${row.pNone >= 5 ? row.pNone + '%' : ''}</div>`;

        html += `</div>
            <div class="stacked-bar-count">共 ${row.rowTotal} 款</div>
        </div>`;
    });

    container.innerHTML = html;
}

// ============ 堆叠条形图 - 纵向 (不同XGP策略的流水画像) ============

function renderStrategyBars(games) {
    const container = document.getElementById('stratBarsContainer');
    const legendEl = document.getElementById('barLegend2');
    const insightEl = document.getElementById('stratBarInsight');
    if (!container) return;

    const stratData = getStrategyBreakdown(games);

    // 洞察
    if (insightEl) {
        insightEl.innerHTML = `<b>头部大作首发入库更为谨慎：</b>头部3A大作（日流水超25万美元）首发入库XGP占比仅为少数，明显较中腰部2A/精品独立游戏占比更低。`;
    }

    // 图例
    const tierColors = {
        '> $250k': { color: '#6366f1', label: '> $250k' },
        '$200k - $250k': { color: '#3b82f6', label: '$200k-$250k' },
        '$150k - $200k': { color: '#0ea5e9', label: '$150k-$200k' },
        '$100k - $150k': { color: '#14b8a6', label: '$100k-$150k' },
        '$50k - $100k': { color: '#10b981', label: '$50k-$100k' },
        '< $50k': { color: '#64748b', label: '< $50k' }
    };

    if (legendEl) {
        let lgHtml = '';
        Object.entries(tierColors).forEach(([tier, info]) => {
            lgHtml += `<div class="legend-item"><span class="legend-dot" style="background:${info.color};"></span>${info.label}</div>`;
        });
        legendEl.innerHTML = lgHtml;
    }

    const tierColorMap = {
        '> $250k': 'tier-1',
        '$200k - $250k': 'tier-2',
        '$150k - $200k': 'tier-3',
        '$100k - $150k': 'tier-4',
        '$50k - $100k': 'tier-5',
        '< $50k': 'tier-6'
    };

    let html = '';
    stratData.forEach(strat => {
        html += `<div class="stacked-bar-row">
            <div class="stacked-bar-label">${strat.label}</div>
            <div class="stacked-bar-track">`;

        strat.segments.forEach(seg => {
            if (seg.pct > 0) {
                html += `<div class="stacked-bar-seg ${tierColorMap[seg.tier]}" style="width:${seg.pct}%;" title="${strat.label} - ${seg.tier}: ${seg.pct}%">${seg.pct >= 8 ? seg.pct + '%' : ''}</div>`;
            }
        });

        html += `</div>
            <div class="stacked-bar-count">共 ${strat.total} 款</div>
        </div>`;
    });

    container.innerHTML = html;
}

// ============ 发行商背景分析 ============

function renderPublisherAnalysis(games) {
    const barsContainer = document.getElementById('publisherBars');
    const tableBody = document.getElementById('publisherTableBody');
    const insightEl = document.getElementById('publisherInsight');

    const pubData = getPublisherBgData(games);

    // 洞察
    if (insightEl) {
        const msRow = pubData.find(r => r.label === '微软第一方游戏');
        const bigRow = pubData.find(r => r.label === '第三方大厂');
        const indieRow = pubData.find(r => r.label === '中小独立团队');

        let insightHtml = '';
        if (msRow && msRow.total > 0) {
            insightHtml += `<div class="insight-block" style="background:rgba(20,184,166,0.06);"><b>1、微软第一方游戏坚定护航：</b>属于微软旗下大厂的游戏 ${msRow.pSim}% 采取首发入库XGP策略，作为XGP生态的核心基盘。</div>`;
        }
        if (bigRow && bigRow.total > 0) {
            insightHtml += `<div class="insight-block" style="background:rgba(100,116,139,0.06);"><b>2、第三方大厂极度抗拒首发：</b>非微软的第三方大厂产品中，高达 ${bigRow.pNone}% 未加入XGP，仅 ${bigRow.pSim}% 选择了首发入库。</div>`;
        }
        if (indieRow && indieRow.total > 0) {
            insightHtml += `<div class="insight-block" style="background:rgba(59,130,246,0.06);"><b>3、中小团队态度开放：</b>非大厂发行的游戏中，有 ${indieRow.pSim}% 选择了首发入库XGP，更愿意通过XGP获取保底收入。</div>`;
        }
        insightEl.innerHTML = insightHtml;
    }

    // 堆叠条形图
    if (barsContainer) {
        let legendHtml = `<div class="bar-legend">
            <div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span>后发入库XGP</div>
            <div class="legend-item"><span class="legend-dot" style="background:#14b8a6;"></span>首发入库XGP</div>
            <div class="legend-item"><span class="legend-dot" style="background:#64748b;"></span>未加入</div>
        </div>`;

        let barsHtml = legendHtml;
        pubData.forEach(row => {
            barsHtml += `<div class="publisher-bar-row">
                <div class="publisher-bar-header">
                    <span class="bar-name">${row.label}</span>
                    <span class="bar-count">共 ${row.total} 款</span>
                </div>
                <div class="publisher-bar-track">`;

            if (row.pAft > 0) barsHtml += `<div class="stacked-bar-seg blue" style="width:${row.pAft}%;" title="后发入库XGP: ${row.pAft}%">${row.pAft >= 5 ? row.pAft + '%' : ''}</div>`;
            if (row.pSim > 0) barsHtml += `<div class="stacked-bar-seg teal" style="width:${row.pSim}%;" title="首发入库XGP: ${row.pSim}%">${row.pSim >= 5 ? row.pSim + '%' : ''}</div>`;
            if (row.pNone > 0) barsHtml += `<div class="stacked-bar-seg slate" style="width:${row.pNone}%;" title="未加入: ${row.pNone}%">${row.pNone >= 5 ? row.pNone + '%' : ''}</div>`;

            barsHtml += `</div></div>`;
        });

        barsContainer.innerHTML = barsHtml;
    }

    // 明细表
    if (tableBody) {
        let tblHtml = '';
        pubData.forEach(row => {
            tblHtml += `<tr>
                <td class="text-left" style="font-weight:700;">${row.label}</td>
                <td><span class="num">${row.cAft}</span><span class="pct">(${row.pAft}%)</span></td>
                <td><span class="num">${row.cSim}</span><span class="pct">(${row.pSim}%)</span></td>
                <td><span class="num">${row.cNone}</span><span class="pct">(${row.pNone}%)</span></td>
            </tr>`;
        });
        tableBody.innerHTML = tblHtml;
    }
}

// ============ Tab: 总览KPI卡片（嵌入战略流向分析） ============

function updateOverviewKPI(games) {
    // 使用Mscience数据
    const totalRevenue = games.reduce((sum, g) => sum + g.lifetimeRevenue, 0);
    const totalUnits = games.reduce((sum, g) => sum + g.lifetimeUnits, 0);
    const avgRevenue = games.length ? totalRevenue / games.length : 0;
    const revenues = games.map(g => g.lifetimeRevenue);
    const medianRevenue = getMedian(revenues);

    setText('kpiTotalRevenue', formatRevenue(totalRevenue));
    setText('kpiTotalGames', games.length);
    setText('kpiGamesChange', `款已上线新游`);
    setText('kpiTotalUnits', formatNumber(totalUnits));
    setText('kpiAvgRevenue', formatRevenue(avgRevenue));
    setText('kpiMedian', `中位数: ${formatRevenue(medianRevenue)}`);
}

// ============ 数据表格 (已合并到校验Tab) ============
// renderTable 已移除 - 数据底表功能已合并到底表数据校验Tab

// ============ Drill-down 面板 ============

function showDrilldown(title, games) {
    const overlay = document.getElementById('drilldownOverlay');
    const titleEl = document.getElementById('drilldownTitle');
    const content = document.getElementById('drilldownContent');

    titleEl.textContent = title;

    const sorted = [...games].sort((a, b) => (b.mscienceDailyRev || b.dailyRevenue) - (a.mscienceDailyRev || a.dailyRevenue));
    const totalRev = games.reduce((s, g) => s + g.lifetimeRevenue, 0);
    const totalDailyRev = games.reduce((s, g) => s + (g.mscienceDailyRev || 0), 0);

    let html = `<p style="color:var(--text-muted);margin-bottom:16px;font-size:0.85rem;">共 ${games.length} 款游戏，Mscience总收入 ${formatRevenue(totalRev)}，合计日均流水 ${formatRevenue(totalDailyRev)}</p>`;
    html += `<table><thead><tr>
        <th>#</th><th class="text-left">游戏名称</th><th>发行商</th><th>类型</th><th>XGP策略</th><th class="num">日均流水(Msc)</th><th class="num">Mscience总收入</th><th class="num">上线天数</th>
    </tr></thead><tbody>`;

    sorted.forEach((g, i) => {
        let xgpCls = 'none';
        if (g.xgpType === '首发入库XGP') xgpCls = 'sim';
        else if (g.xgpType === '后发入库XGP') xgpCls = 'aft';

        html += `<tr class="drilldown-game-row" style="cursor:pointer;">
            <td>${i + 1}</td>
            <td class="game-name text-left">${g.name}</td>
            <td>${g.publisher}</td>
            <td>${g.mainGenre || '-'}</td>
            <td><span class="xgp-tag ${xgpCls}">${g.xgpType}</span></td>
            <td class="num" style="color:var(--accent-primary);font-weight:700;">${formatRevenue(g.mscienceDailyRev || g.dailyRevenue)}</td>
            <td class="num">${formatRevenue(g.lifetimeRevenue)}</td>
            <td class="num">${g.daysOnline || '-'}</td>
        </tr>`;
    });

    html += '</tbody></table>';
    content.innerHTML = html;
    overlay.classList.add('active');

    // 允许点击行查看详情
    content.querySelectorAll('.drilldown-game-row').forEach((row, i) => {
        row.addEventListener('click', () => {
            showGameDetail(sorted[i]);
        });
    });
}

function showGameDetail(game) {
    const overlay = document.getElementById('drilldownOverlay');
    const titleEl = document.getElementById('drilldownTitle');
    const content = document.getElementById('drilldownContent');

    titleEl.textContent = game.name;

    const steamRatio = game.lifetimeRevenue > 0 ? ((game.steamRevenue / game.lifetimeRevenue) * 100).toFixed(1) : 'N/A';
    const check = (val) => val && val !== '未上线' && val !== '' ? `<span style="color:var(--success);font-weight:600;">${val}</span>` : '<span style="color:var(--text-muted);">未上线</span>';

    let xgpCls = 'none';
    if (game.xgpType === '首发入库XGP') xgpCls = 'sim';
    else if (game.xgpType === '后发入库XGP') xgpCls = 'aft';

    content.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
            <div>
                <h4 style="color:var(--text-muted);font-size:0.78rem;text-transform:uppercase;margin-bottom:12px;">基础信息</h4>
                <div style="display:flex;flex-direction:column;gap:8px;font-size:0.9rem;">
                    <div><strong>发行商:</strong> ${game.publisher} ${game.publisherParent ? `(${game.publisherParent})` : ''}</div>
                    <div><strong>开发商:</strong> ${game.developer}</div>
                    <div><strong>主要类型:</strong> ${game.mainGenre || '-'}</div>
                    <div><strong>子类型:</strong> ${game.subGenre || '-'}</div>
                    <div><strong>上线日期:</strong> ${game.releaseDate}</div>
                    <div><strong>厂商标签:</strong> ${game.majorLabel || (game.isMajor ? '大厂' : '独立')}</div>
                    <div><strong>XGP策略:</strong> <span class="xgp-tag ${xgpCls}">${game.xgpType}</span></div>
                    <div><strong>收入层级:</strong> ${game.revenueTier}</div>
                </div>
            </div>
            <div>
                <h4 style="color:var(--text-muted);font-size:0.78rem;text-transform:uppercase;margin-bottom:12px;">收入数据</h4>
                <div style="display:flex;flex-direction:column;gap:8px;font-size:0.9rem;">
                    <div><strong>日均流水(Msc):</strong> <span style="color:var(--accent-primary);font-weight:700;">${formatRevenue(game.mscienceDailyRev || 0)}</span></div>
                    <div><strong>日均流水(原始):</strong> ${formatRevenue(game.dailyRevenue)}</div>
                    <div><strong>总数字收入:</strong> ${formatRevenue(game.lifetimeRevenue)}</div>
                    <div><strong>上线天数:</strong> ${game.daysOnline || '-'} 天 (截止2026-02-28)</div>
                    <div><strong>总数字销量:</strong> ${formatNumber(game.lifetimeUnits)}</div>
                    <div><strong>Steam 价格:</strong> $${(game.steamPrice || 0).toFixed(2)}</div>
                    <div><strong>Steam 收入:</strong> ${formatRevenue(game.steamRevenue)}</div>
                    <div><strong>Steam 占比:</strong> ${steamRatio}%</div>
                </div>
            </div>
        </div>
        <div style="margin-top:20px;">
            <h4 style="color:var(--text-muted);font-size:0.78rem;text-transform:uppercase;margin-bottom:12px;">平台上线详情</h4>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
                <div style="padding:12px;background:var(--bg-input);border-radius:8px;text-align:center;"><div style="font-size:0.75rem;color:var(--text-muted);">PC / Steam</div><div style="font-weight:600;margin-top:4px;">${check(game.pcDate)}</div></div>
                <div style="padding:12px;background:var(--bg-input);border-radius:8px;text-align:center;"><div style="font-size:0.75rem;color:var(--text-muted);">PlayStation</div><div style="font-weight:600;margin-top:4px;">${check(game.psDate)}</div></div>
                <div style="padding:12px;background:var(--bg-input);border-radius:8px;text-align:center;"><div style="font-size:0.75rem;color:var(--text-muted);">Xbox</div><div style="font-weight:600;margin-top:4px;">${check(game.xboxDate)}</div></div>
                <div style="padding:12px;background:var(--bg-input);border-radius:8px;text-align:center;"><div style="font-size:0.75rem;color:var(--text-muted);">Nintendo</div><div style="font-weight:600;margin-top:4px;">${check(game.nintendo)}</div></div>
            </div>
        </div>
    `;

    overlay.classList.add('active');
}

// ============ AI 洞察生成 ============

function generateAIInsight(games) {
    const contentEl = document.getElementById('aiInsightContent');
    if (!contentEl) return;

    contentEl.innerHTML = '<div class="typing-indicator">分析中<span class="dots"><span>.</span><span>.</span><span>.</span></span></div>';

    const flow = getFlowNodes(games);
    const kpi = getKPISummary(games);
    const genreData = getGenreDistribution(games);
    const pubBg = getPublisherBgData(games);

    const xgpTotal = flow.sim + flow.aft;
    const consolePct = pct(flow.consoleY, flow.total);
    const xboxPct = pct(flow.xboxY, flow.consoleY);
    const xgpPct = pct(xgpTotal, flow.xboxY);

    const insights = [
        `📊 <strong>漏斗全景：</strong>当前切片内共 <span class="highlight">${flow.total}</span> 款游戏，<span class="highlight">${consolePct}%</span> 上线主机（${flow.consoleY} 款），其中 <span class="highlight">${xboxPct}%</span> 登陆Xbox（${flow.xboxY} 款），仅 <span class="highlight">${xgpPct}%</span> 加入XGP（${xgpTotal} 款，首发 ${flow.sim} + 后发 ${flow.aft}）。`,

        `🎯 <strong>XGP策略拆解：</strong>首发入库XGP占Xbox游戏的 <span class="highlight">${pct(flow.sim, flow.xboxY)}%</span>，后发入库占 <span class="highlight">${pct(flow.aft, flow.xboxY)}%</span>，高达 <span class="highlight">${pct(flow.noXgp, flow.xboxY)}%</span> 上Xbox但未加入XGP，表明多数开发者仍以传统买断为主。`,

        `🏢 <strong>厂商画像：</strong>${pubBg[0] ? `微软第一方 ${pubBg[0].total} 款中首发率 ${pubBg[0].pSim}%；` : ''}${pubBg[1] ? `第三方大厂 ${pubBg[1].total} 款仅 ${pubBg[1].pSim}% 首发；` : ''}${pubBg[2] ? `中小独立 ${pubBg[2].total} 款首发率 ${pubBg[2].pSim}%，态度更开放。` : ''}`,

        `🎮 <strong>品类洞察：</strong>${genreData[0] ? `<span class="highlight">${genreData[0].name}</span> 以 ${formatRevenue(genreData[0].revenue)} 领跑（${genreData[0].count} 款），` : ''}${genreData[1] ? `其次是 ${genreData[1].name}（${formatRevenue(genreData[1].revenue)}）` : ''}。射击与动作RPG品类仍为核心驱动力。`,

        `<div class="ai-feedback">
            <button onclick="this.textContent='✓ 感谢反馈'; this.style.color='var(--success)'">👍 有用</button>
            <button onclick="this.textContent='✓ 已记录'; this.style.color='var(--warning)'">👎 需改进</button>
            <button onclick="this.textContent='✓ 已标记'; this.style.color='var(--info)'">📝 补充意见</button>
        </div>`
    ];

    let idx = 0;
    let html = '';
    function typeNext() {
        if (idx < insights.length) {
            html += `<p>${insights[idx]}</p>`;
            contentEl.innerHTML = html;
            idx++;
            setTimeout(typeNext, 250);
        }
    }
    setTimeout(typeNext, 500);
}

// ============ Tab: 底表数据校验 ============

function updateValidationTab(games) {
    const tbody = document.getElementById('validationBody');
    const countEl = document.getElementById('validationCount');
    if (!tbody) return;

    const searchVal = (document.getElementById('validationSearch')?.value || '').toLowerCase();
    const filtered = searchVal
        ? games.filter(g => g.name.toLowerCase().includes(searchVal) || g.publisher.toLowerCase().includes(searchVal) || g.developer.toLowerCase().includes(searchVal))
        : games;

    if (countEl) countEl.textContent = `(${filtered.length} 条记录)`;

    // 排序
    const sorted = [...filtered].sort((a, b) => {
        let cmp = 0;
        switch (validationSortKey) {
            case 'name': cmp = a.name.localeCompare(b.name); break;
            case 'publisher': cmp = a.publisher.localeCompare(b.publisher); break;
            case 'genre': cmp = (a.mainGenre || '').localeCompare(b.mainGenre || ''); break;
            case 'date': cmp = (a.releaseDateObj || 0) - (b.releaseDateObj || 0); break;
            case 'lifetime': cmp = a.lifetimeRevenue - b.lifetimeRevenue; break;
            case 'dailyCalc': cmp = (a.mscienceDailyRev || 0) - (b.mscienceDailyRev || 0); break;
            case 'dailyOrig': cmp = (a.originalDailyRevenue || a.dailyRevenue || 0) - (b.originalDailyRevenue || b.dailyRevenue || 0); break;
            case 'days': cmp = (a.daysOnline || 0) - (b.daysOnline || 0); break;
            case 'check': {
                const diffA = getValidationDiff(a);
                const diffB = getValidationDiff(b);
                const matchA = diffA < 10 ? 1 : 0;
                const matchB = diffB < 10 ? 1 : 0;
                cmp = matchA - matchB;
                break;
            }
            default: cmp = (a.mscienceDailyRev || 0) - (b.mscienceDailyRev || 0);
        }
        return validationSortDir === 'asc' ? cmp : -cmp;
    });

    // 分页
    const totalPages = Math.ceil(sorted.length / VALIDATION_PAGE_SIZE);
    if (validationPage > totalPages) validationPage = Math.max(totalPages, 1);
    const start = (validationPage - 1) * VALIDATION_PAGE_SIZE;
    const pageData = sorted.slice(start, start + VALIDATION_PAGE_SIZE);

    const check = (val) => val === 'Y' ? '<span class="check-y">✓</span>' : '<span class="check-n">-</span>';

    let html = '';
    pageData.forEach(g => {
        const calcDailyRev = g.mscienceDailyRev || 0;
        const origDailyRev = g.originalDailyRevenue || g.dailyRevenue || 0;
        const diff = getValidationDiff(g);
        const isMatch = diff < 10;

        let xgpCls = 'none';
        if (g.xgpType === '首发入库XGP') xgpCls = 'sim';
        else if (g.xgpType === '后发入库XGP') xgpCls = 'aft';

        html += `<tr class="clickable-row" data-game-idx="${allGames.indexOf(g)}">
            <td class="game-name text-left">${g.name}</td>
            <td>${g.publisher} ${g.isMajor ? '<span class="major-badge">大厂</span>' : ''}</td>
            <td>${g.mainGenre || '-'}</td>
            <td>${g.releaseDate || '-'}</td>
            <td class="num">${formatRevenue(g.lifetimeRevenue)}</td>
            <td class="num" style="color:var(--accent-primary);font-weight:700;">$${Math.round(calcDailyRev).toLocaleString()}</td>
            <td class="num" style="color:var(--text-muted);">$${Math.round(origDailyRev).toLocaleString()}</td>
            <td class="num">${g.daysOnline || '-'}</td>
            <td class="text-center">${check(g.isPC)}</td>
            <td class="text-center">${check(g.isPS)}</td>
            <td class="text-center">${check(g.isConsole)}</td>
            <td class="text-center">${check(g.isXbox)}</td>
            <td><span class="xgp-tag ${xgpCls}">${g.xgpType}</span></td>
            <td class="text-center">${isMatch ? '<span class="check-y">✓</span>' : '<span class="check-warn">△</span>'}</td>
        </tr>`;
    });
    tbody.innerHTML = html;

    // 更新分页
    updateValidationPagination(totalPages);

    // 更新排序图标
    updateValidationSortIcons();

    // 行点击
    tbody.querySelectorAll('.clickable-row').forEach(row => {
        row.addEventListener('click', () => {
            const idx = parseInt(row.dataset.gameIdx);
            if (idx >= 0 && allGames[idx]) showGameDetail(allGames[idx]);
        });
    });
}

function getValidationDiff(g) {
    const calcDailyRev = g.mscienceDailyRev || 0;
    const origDailyRev = g.originalDailyRevenue || g.dailyRevenue || 0;
    return origDailyRev > 0 ? Math.abs(calcDailyRev - origDailyRev) / origDailyRev * 100 : 0;
}

function updateValidationPagination(totalPages) {
    const pageInfo = document.getElementById('validationPageInfo');
    const prevBtn = document.getElementById('validationPrevPage');
    const nextBtn = document.getElementById('validationNextPage');
    if (pageInfo) pageInfo.textContent = `第 ${validationPage} / ${Math.max(totalPages, 1)} 页`;
    if (prevBtn) prevBtn.disabled = validationPage <= 1;
    if (nextBtn) nextBtn.disabled = validationPage >= totalPages;
}

function updateValidationSortIcons() {
    document.querySelectorAll('#validationTable .sortable-th').forEach(th => {
        const icon = th.querySelector('.sort-icon');
        if (!icon) return;
        if (th.dataset.sortKey === validationSortKey) {
            icon.textContent = validationSortDir === 'asc' ? '↑' : '↓';
            th.classList.add('sort-active');
        } else {
            icon.textContent = '⇅';
            th.classList.remove('sort-active');
        }
    });
}

// ============ KPI卡片点击 ============

function bindKPIClicks() {
    // 战略Tab的KPI卡片
    const stratKPI = document.getElementById('strategyKPI');
    if (stratKPI) {
        const cards = stratKPI.querySelectorAll('.kpi-card');
        const filters_fn = [
            () => filteredGames, // 全部
            () => filteredGames.filter(g => g.isConsole === 'Y'), // 跨平台
            () => filteredGames.filter(g => g.isXbox === 'Y'), // Xbox
            () => filteredGames.filter(g => g.isXbox === 'Y' && g.xgpType !== '未加入'), // XGP
        ];
        const labels = ['全部端主游戏', '已上线主机的游戏', '已登陆Xbox的游戏', '加入XGP的游戏'];
        cards.forEach((card, i) => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                const gamesList = filters_fn[i]();
                showDrilldown(labels[i] + ` (${gamesList.length} 款)`, gamesList);
            });
        });
    }
}

// ============ 筛选器 ============

function populateFilters() {
    // 品类
    const genreSelect = document.getElementById('filterGenre');
    if (genreSelect) {
        getAllGenres().forEach(g => {
            const opt = document.createElement('option');
            opt.value = g;
            opt.textContent = g;
            genreSelect.appendChild(opt);
        });
    }

    // 月份
    const monthSelect = document.getElementById('filterMonth');
    if (monthSelect) {
        getAllMonths().forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = formatMonthLabel(m);
            monthSelect.appendChild(opt);
        });
    }
}

function getFilterValues() {
    return {
        bigCorp: document.getElementById('filterBigCorp')?.value || 'all',
        console: document.getElementById('filterConsole')?.value || 'all',
        xgpType: document.getElementById('filterXGP')?.value || 'all',
        genre: document.getElementById('filterGenre')?.value || 'all',
        month: document.getElementById('filterMonth')?.value || 'all',
        revTier: document.getElementById('filterRevTier')?.value || 'all',
        search: ''
    };
}

function onFilterChange() {
    const filters = getFilterValues();
    const games = applyFilters(filters);
    currentPage = 1;
    updateAll(games);
}

// ============ 事件绑定 ============

function bindEvents() {
    // 筛选器
    ['filterBigCorp', 'filterConsole', 'filterXGP', 'filterGenre', 'filterMonth', 'filterRevTier'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', onFilterChange);
    });

    // 重置筛选
    document.getElementById('filterReset')?.addEventListener('click', () => {
        ['filterBigCorp', 'filterConsole', 'filterXGP', 'filterGenre', 'filterMonth', 'filterRevTier'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = 'all';
        });
        const vs = document.getElementById('validationSearch');
        if (vs) vs.value = '';
        onFilterChange();
    });

    // Drilldown
    document.getElementById('drilldownClose')?.addEventListener('click', () => {
        document.getElementById('drilldownOverlay').classList.remove('active');
    });

    document.getElementById('drilldownOverlay')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) e.currentTarget.classList.remove('active');
    });

    // 主题切换
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        const html = document.documentElement;
        const current = html.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);

        if (next === 'light') {
            Chart.defaults.color = '#64687a';
            Chart.defaults.borderColor = '#e2e4ea';
        } else {
            Chart.defaults.color = '#8b8fa3';
            Chart.defaults.borderColor = '#2a2d3e';
        }

        renderAdditionalCharts(filteredGames);
        updateStrategyTab(filteredGames);
    });

    // 月度日均流水图表类型切换
    document.querySelectorAll('.chart-view-btn[data-chart="monthlyDaily"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.parentElement.querySelectorAll('.chart-view-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentMonthlyDailyChartType = e.target.dataset.view;
            renderMonthlyDailyRevChart(getMonthlyDailyRevenue(filteredGames), currentMonthlyDailyChartType);
        });
    });

    // AI刷新
    document.getElementById('aiRefreshBtn')?.addEventListener('click', () => {
        generateAIInsight(filteredGames);
    });

    // Tab切换
    document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // 更新导航高亮
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // 切换Tab内容
            const tab = item.dataset.tab;
            currentTab = tab;
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            const target = document.getElementById(`tab-${tab}`);
            if (target) target.classList.add('active');

            // 仅CSV相关Tab显示筛选栏和数据声明条
            const csvTabs = ['strategy'];
            const filterBar = document.getElementById('filterBar');
            const dataBanner = document.getElementById('dataBanner');
            if (filterBar) filterBar.style.display = csvTabs.includes(tab) ? '' : 'none';
            if (dataBanner) dataBanner.style.display = csvTabs.includes(tab) ? '' : 'none';

            // 切换后重绘图表
            if (tab === 'strategy') {
                setTimeout(() => {
                    renderPublisherDailyRevChart(getPublisherDailyRevenue(filteredGames));
                    renderGenreDailyRevChart(getGenreDailyRevenue(filteredGames));
                    renderMonthlyDailyRevChart(getMonthlyDailyRevenue(filteredGames), currentMonthlyDailyChartType);
                }, 50);
            } else if (tab === 'charts') {
                setTimeout(() => renderAdditionalCharts(filteredGames), 50);
            } else if (tab === 'recent') {
                setTimeout(() => updateRecentTab(filteredGames), 50);
            } else if (tab === 'pipeline') {
                setTimeout(() => updatePipelineTab(), 50);
            } else if (tab === 'news') {
                setTimeout(() => updateNewsTab(), 50);
            } else if (tab === 'earnings') {
                setTimeout(() => updateEarningsTab(), 50);
            } else if (tab === 'storewatch') {
                setTimeout(() => updateStorewatchTab(), 50);
            }

            // 关闭移动端菜单
            document.getElementById('sidebar')?.classList.remove('open');
        });
    });

    // 移动端菜单
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
        document.getElementById('sidebar')?.classList.toggle('open');
    });

    // 导出
    document.getElementById('exportBtn')?.addEventListener('click', exportData);

    // ESC关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('drilldownOverlay')?.classList.remove('active');
            closeCmdPalette();
            closeNotificationPanel();
        }
    });

    // 数据校验搜索
    document.getElementById('validationSearch')?.addEventListener('input', () => {
        validationPage = 1;
        updateValidationTab(filteredGames);
    });

    // 数据校验列头排序
    document.querySelectorAll('#validationTable .sortable-th').forEach(th => {
        th.addEventListener('click', () => {
            const key = th.dataset.sortKey;
            if (validationSortKey === key) {
                validationSortDir = validationSortDir === 'asc' ? 'desc' : 'asc';
            } else {
                validationSortKey = key;
                validationSortDir = (key === 'name' || key === 'publisher' || key === 'genre') ? 'asc' : 'desc';
            }
            validationPage = 1;
            updateValidationTab(filteredGames);
        });
    });

    // 数据校验分页
    document.getElementById('validationPrevPage')?.addEventListener('click', () => {
        if (validationPage > 1) { validationPage--; updateValidationTab(filteredGames); }
    });
    document.getElementById('validationNextPage')?.addEventListener('click', () => {
        validationPage++;
        updateValidationTab(filteredGames);
    });

    // KPI卡片点击
    bindKPIClicks();

    // 堆叠条形图色块点击
    bindStackedBarClicks();

    // Pipeline 筛选器
    document.getElementById('pipelineTimeFilter')?.addEventListener('change', () => updatePipelineTab());
    document.getElementById('pipelineHeatFilter')?.addEventListener('change', () => updatePipelineTab());

    // News 筛选器
    document.getElementById('newsFeaturedFilter')?.addEventListener('change', () => updateNewsTab());
    document.getElementById('newsCategoryFilter')?.addEventListener('change', () => updateNewsTab());
    document.getElementById('newsSourceFilter')?.addEventListener('change', () => updateNewsTab());
    document.getElementById('newsRefreshBtn')?.addEventListener('click', () => updateNewsTab());

    // Earnings 筛选器
    document.getElementById('earningsRegionFilter')?.addEventListener('change', () => updateEarningsTab());
    document.getElementById('earningsSortFilter')?.addEventListener('change', () => updateEarningsTab());

    // Earnings 搜索
    let earningsSearchTimer = null;
    document.getElementById('earningsSearchInput')?.addEventListener('input', () => {
        clearTimeout(earningsSearchTimer);
        earningsSearchTimer = setTimeout(() => updateEarningsTab(), 250);
    });

    // Earnings 搜索按 ESC 清空
    document.getElementById('earningsSearchInput')?.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.target.value = '';
            updateEarningsTab();
        }
    });
}

// ============ 堆叠条形图色块点击 ============

function bindStackedBarClicks() {
    // 使用事件委托：为所有堆叠条形图的色块绑定点击
    document.addEventListener('click', (e) => {
        const seg = e.target.closest('.stacked-bar-seg');
        if (!seg) return;

        const title = seg.getAttribute('title');
        if (!title) return;

        // 解析色块信息来触发drilldown
        // title 格式如 "后发入库XGP: 30%" 或 "首发入库XGP - > $250k: 15%"
        // 尝试从周围上下文找到对应的游戏
        const row = seg.closest('.stacked-bar-row');
        const section = seg.closest('.xgp-bar-section, .publisher-bar-row, .publisher-bars');

        if (row) {
            const labelEl = row.querySelector('.stacked-bar-label');
            const label = labelEl ? labelEl.textContent.trim() : '';

            // 从堆叠条色块确定策略类型
            let strategyType = '';
            if (seg.classList.contains('blue')) strategyType = '后发入库XGP';
            else if (seg.classList.contains('teal')) strategyType = '首发入库XGP';
            else if (seg.classList.contains('slate')) strategyType = '未加入';

            const xboxGames = filteredGames.filter(g => g.isXbox === 'Y');

            // 判断是横向条形图(tier label)还是纵向(策略label)
            if (['> $250k', '$200k - $250k', '$150k - $200k', '$100k - $150k', '$50k - $100k', '< $50k'].includes(label)) {
                // 横向: label是流水段, seg是策略
                const matched = xboxGames.filter(g => g.revenueTier === label && (strategyType ? g.xgpType === strategyType : true));
                if (matched.length > 0) {
                    showDrilldown(`${label} · ${strategyType || '全部'} (${matched.length} 款)`, matched);
                }
            } else if (['后发入库XGP', '首发入库XGP', '上Xbox未入库'].includes(label)) {
                // 纵向: label是策略, seg是流水段
                const stratId = label === '上Xbox未入库' ? '未加入' : label;
                // 从seg的class判断tier
                let tierFromClass = '';
                if (seg.classList.contains('tier-1')) tierFromClass = '> $250k';
                else if (seg.classList.contains('tier-2')) tierFromClass = '$200k - $250k';
                else if (seg.classList.contains('tier-3')) tierFromClass = '$150k - $200k';
                else if (seg.classList.contains('tier-4')) tierFromClass = '$100k - $150k';
                else if (seg.classList.contains('tier-5')) tierFromClass = '$50k - $100k';
                else if (seg.classList.contains('tier-6')) tierFromClass = '< $50k';

                const matched = xboxGames.filter(g => g.xgpType === stratId && (tierFromClass ? g.revenueTier === tierFromClass : true));
                if (matched.length > 0) {
                    showDrilldown(`${label} · ${tierFromClass || '全部流水段'} (${matched.length} 款)`, matched);
                }
            }
        }

        // 发行商背景堆叠条
        const pubBarRow = seg.closest('.publisher-bar-row');
        if (pubBarRow) {
            const nameEl = pubBarRow.querySelector('.bar-name');
            const bgLabel = nameEl ? nameEl.textContent.trim() : '';

            let strategyType = '';
            if (seg.classList.contains('blue')) strategyType = '后发入库XGP';
            else if (seg.classList.contains('teal')) strategyType = '首发入库XGP';
            else if (seg.classList.contains('slate')) strategyType = '未加入';

            const xboxGames = filteredGames.filter(g => g.isXbox === 'Y');
            const msKeywords = ['Microsoft', 'Xbox', 'Bethesda', 'Turn 10', 'Playground', 'Ninja Theory', 'Obsidian', 'Double Fine', 'inXile', 'Compulsion', 'Undead Labs', 'Mojang', '343', 'The Coalition', 'Rare', 'MachineGames', 'Tango', 'id Software', 'Arkane', 'ZeniMax', 'Activision', 'Blizzard'];
            const isMs = (pub) => msKeywords.some(k => pub.toLowerCase().includes(k.toLowerCase()));

            let bgGames;
            if (bgLabel === '微软第一方游戏') {
                bgGames = xboxGames.filter(g => isMs(g.publisher) || isMs(g.name));
            } else if (bgLabel === '第三方大厂') {
                bgGames = xboxGames.filter(g => g.isBigCorp === 1 && !isMs(g.publisher) && !isMs(g.name));
            } else if (bgLabel === '中小独立团队') {
                bgGames = xboxGames.filter(g => g.isBigCorp === 0 && !isMs(g.publisher) && !isMs(g.name));
            }

            if (bgGames && strategyType) {
                const matched = bgGames.filter(g => g.xgpType === strategyType);
                if (matched.length > 0) {
                    showDrilldown(`${bgLabel} · ${strategyType} (${matched.length} 款)`, matched);
                }
            }
        }
    });
}

// ============ Tab: 待上线 Pipeline ============

function updatePipelineTab() {
    const timeFilter = document.getElementById('pipelineTimeFilter')?.value || 'all';
    const heatFilter = document.getElementById('pipelineHeatFilter')?.value || 'all';

    let filtered = [...pipelineData];

    // 时间筛选
    if (timeFilter !== 'all') {
        filtered = filtered.filter(g => getPipelineQuarter(g.releaseDate) === timeFilter);
    }

    // 关注度筛选
    if (heatFilter !== 'all') {
        filtered = filtered.filter(g => g.heat === heatFilter);
    }

    // 排序：按发售日期
    filtered.sort((a, b) => getPipelineSortDate(a.releaseDate) - getPipelineSortDate(b.releaseDate));

    // KPI
    setText('pipelineTotalCount', filtered.length);

    // 近3月即将上线
    const now = new Date();
    const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const upcoming = filtered.filter(g => {
        const match = g.releaseDate.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
        if (match) {
            const d = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
            return d >= now && d <= threeMonthsLater;
        }
        return false;
    });
    setText('pipelineUpcomingCount', upcoming.length);

    // 高/中高关注度
    const highHeat = filtered.filter(g => g.heat === '高' || g.heat === '中高');
    setText('pipelineHighHeatCount', highHeat.length);

    // Xbox平台
    const xboxCount = filtered.filter(g => hasPlatform(g.platforms, 'xbox')).length;
    setText('pipelineXboxCount', xboxCount);
    setText('pipelineXboxPct', filtered.length > 0 ? Math.round(xboxCount / filtered.length * 100) + '%' : '0%');

    // 渲染时间轴
    renderPipelineTimeline(filtered);

    // 渲染表格
    renderPipelineTable(filtered);
}

function renderPipelineTimeline(games) {
    const container = document.getElementById('pipelineTimeline');
    if (!container) return;

    // 按季度分组
    const quarters = {
        'q1': { label: '2026 Q1 (1-3月)', games: [], color: '#6366f1' },
        'q2': { label: '2026 Q2 (4-6月)', games: [], color: '#3b82f6' },
        'q3': { label: '2026 Q3 (7-9月)', games: [], color: '#0ea5e9' },
        'q4': { label: '2026 Q4 (10-12月)', games: [], color: '#14b8a6' },
        'tbd': { label: '待定/2027+', games: [], color: '#64748b' }
    };

    games.forEach(g => {
        const q = getPipelineQuarter(g.releaseDate);
        if (quarters[q]) quarters[q].games.push(g);
    });

    let html = '<div class="pipeline-timeline-grid">';

    Object.entries(quarters).forEach(([key, q]) => {
        if (q.games.length === 0) return;

        html += `<div class="timeline-quarter">
            <div class="timeline-quarter-header" style="border-left:4px solid ${q.color};">
                <span class="timeline-quarter-label">${q.label}</span>
                <span class="timeline-quarter-count">${q.games.length} 款</span>
            </div>
            <div class="timeline-quarter-games">`;

        q.games.forEach(g => {
            const heatClass = getHeatClass(g.heat);
            html += `<div class="timeline-game-card ${heatClass}">
                <div class="timeline-game-name">${g.name}</div>
                <div class="timeline-game-meta">
                    <span class="timeline-game-publisher">${g.publisher}</span>
                    <span class="timeline-game-date">${g.releaseDate}</span>
                </div>
                <div class="timeline-game-tags">
                    <span class="heat-tag ${heatClass}">${getHeatIcon(g.heat)} ${g.heat}</span>
                    ${g.platforms ? `<span class="platform-tag">${g.platforms}</span>` : ''}
                </div>
            </div>`;
        });

        html += '</div></div>';
    });

    html += '</div>';
    container.innerHTML = html;
}

function getHeatClass(heat) {
    switch(heat) {
        case '高': return 'heat-high';
        case '中高': return 'heat-mid-high';
        case '中': return 'heat-mid';
        case '中低': return 'heat-mid-low';
        default: return 'heat-low';
    }
}

function getHeatIcon(heat) {
    switch(heat) {
        case '高': return '🔥';
        case '中高': return '⚡';
        case '中': return '📊';
        case '中低': return '📉';
        default: return '⬜';
    }
}

function renderPipelineTable(games) {
    const tbody = document.getElementById('pipelineTableBody');
    if (!tbody) return;

    let html = '';
    games.forEach(g => {
        const heatClass = getHeatClass(g.heat);
        const releasedTag = g.released ? ' <span class="released-badge-sm">✅已发售</span>' : '';
        const rowClass = g.released ? ' class="row-released"' : '';
        html += `<tr${rowClass}>
            <td class="game-name text-left">${g.name}${releasedTag}</td>
            <td>${g.publisher}</td>
            <td>${g.studio}</td>
            <td>${g.releaseDate}</td>
            <td><span class="platform-tag-sm">${g.platforms}</span></td>
            <td class="text-center"><span class="heat-tag ${heatClass}">${getHeatIcon(g.heat)} ${g.heat}</span></td>
            <td style="max-width:200px;white-space:normal;font-size:0.78rem;color:var(--text-secondary);">${g.gameplay || '-'}</td>
            <td style="max-width:180px;white-space:normal;font-size:0.78rem;color:var(--text-muted);">${g.heatNote || '-'}</td>
        </tr>`;
    });

    tbody.innerHTML = html;
}

// ============ Tab: 行业热点新闻 ============

function updateNewsTab() {
    const catFilter = document.getElementById('newsCategoryFilter')?.value || 'all';
    const srcFilter = document.getElementById('newsSourceFilter')?.value || 'all';
    const featuredFilter = document.getElementById('newsFeaturedFilter')?.value || 'all';

    let filtered = [...newsData];

    // 分类筛选
    if (catFilter !== 'all') {
        filtered = filtered.filter(n => n.category === catFilter);
    }

    // 来源筛选
    if (srcFilter !== 'all') {
        const srcCat = newsSources.filter(s => s.category === srcFilter).map(s => s.name);
        filtered = filtered.filter(n => srcCat.includes(n.source));
    }

    // 重点新闻筛选
    if (featuredFilter === 'featured') {
        filtered = filtered.filter(n => n.featured === true);
    } else if (featuredFilter === 'normal') {
        filtered = filtered.filter(n => !n.featured);
    }

    // 按日期排序（最新在前）
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    // KPI
    setText('newsTotalCount', newsData.length);
    const featuredCount = newsData.filter(n => n.featured === true).length;
    setText('newsImportantCount', featuredCount);
    const featuredPct = newsData.length > 0 ? Math.round(featuredCount / newsData.length * 100) : 0;
    setText('newsFeaturedRatio', `占比 ${featuredPct}%`);
    setText('newsSourceCount', newsSources.length);
    const weeklyCount = newsData.filter(n => isThisWeek(n.date)).length;
    setText('newsWeeklyCount', weeklyCount);

    if (newsData.length > 0) {
        setText('newsUpdateTime', `最近更新：${newsData[0].date}`);
    }

    // 重点关注区（使用 featured 字段）
    renderNewsSpotlight(filtered.filter(n => n.featured === true));

    // 新闻列表
    renderNewsFeed(filtered);

    // 信息源
    renderNewsSources();
}

function renderNewsSpotlight(importantNews) {
    const container = document.getElementById('newsSpotlight');
    if (!container) return;

    if (importantNews.length === 0) {
        container.innerHTML = '';
        return;
    }

    let html = `<div class="spotlight-header">
        <h4>⭐ 重点新闻</h4>
        <span class="spotlight-count">${importantNews.length} 条重点新闻</span>
    </div>
    <div class="spotlight-grid">`;

    importantNews.slice(0, 4).forEach(n => {
        const featuredReason = getFeaturedReason(n);
        html += `<div class="spotlight-card" style="position:relative;">
            <div class="spotlight-card-header">
                <span class="spotlight-category">${getNewsCategory(n.category)}</span>
                <div style="display:flex;align-items:center;gap:6px;">
                    <span class="featured-reason-tag">${featuredReason}</span>
                    <a href="${n.sourceUrl}" target="_blank" class="spotlight-link" title="查看原文">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2h8v8M14 2L6 10"/></svg>
                    </a>
                </div>
            </div>
            <a href="${n.sourceUrl}" target="_blank" class="spotlight-title-link">
                <h5 class="spotlight-title">${n.title}</h5>
            </a>
            <p class="spotlight-summary">${n.summary}</p>
            <div class="spotlight-footer">
                <span class="spotlight-source">${n.source}</span>
                <span class="spotlight-date">${n.date}</span>
            </div>
            <div class="spotlight-tags">
                ${n.tags.map(t => `<span class="news-tag">${t}</span>`).join('')}
            </div>
        </div>`;
    });

    html += '</div>';
    container.innerHTML = html;
}

// 根据新闻内容推断重点新闻归类原因
function getFeaturedReason(n) {
    const title = (n.title || '').toLowerCase();
    const tags = (n.tags || []).join(' ').toLowerCase();
    const combined = title + ' ' + tags;

    if (combined.match(/并购|收购|投资|股份|持股|pif|egdc|合并|整合/)) return '💰 格局变动';
    if (combined.match(/退休|辞职|接任|ceo|管理层|人事|重组|裁员/)) return '👤 高管变动';
    if (combined.match(/销量|突破.*万|里程碑|历史|最快|创纪录|百万/)) return '📊 里程碑';
    if (combined.match(/ps6|helix|次世代|switch 2|新主机|掌机/)) return '🎮 硬件格局';
    if (combined.match(/涨价|降价|分成|定价|关税|供应链/)) return '💵 价格冲击';
    if (combined.match(/gta|发售|定档|首发|上线|确认/)) return '🚀 重要发售';
    if (combined.match(/欧盟|dma|pegi|评级|监管|法案|诉讼|反垄断/)) return '⚖️ 政策监管';
    if (combined.match(/newzoo|市场.*超|预测|趋势|报告|$\d+.*亿/)) return '📈 市场洞察';
    if (combined.match(/steam machine|验证|平台.*战略|开放|第三方/)) return '🌐 平台战略';
    if (combined.match(/dlss|nvidia|amd|gpu|芯片|显卡/)) return '🔧 技术突破';
    return '⭐ 重点';
}

function renderNewsFeed(allNews) {
    const container = document.getElementById('newsFeed');
    if (!container) return;

    // 将新闻分为"近期"（7天内）和"历史"（7天以上）
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentNews = allNews.filter(n => new Date(n.date) >= sevenDaysAgo);
    const historyNews = allNews.filter(n => new Date(n.date) < sevenDaysAgo);

    let html = '';

    // ── 近期新闻区 ──
    html += `<div class="news-feed-header">
        <h4>📋 近期动态</h4>
        <span class="news-feed-count">${recentNews.length} 条（近7天）</span>
    </div>
    <div class="news-list">`;

    if (recentNews.length === 0) {
        html += `<div class="news-empty-hint">暂无近7天的新闻，请查看下方历史新闻归档</div>`;
    }

    recentNews.forEach(n => {
        html += renderNewsItemHTML(n);
    });

    html += '</div>';

    // ── 历史新闻折叠区 ──
    if (historyNews.length > 0) {
        // 按月份分组
        const monthGroups = {};
        historyNews.forEach(n => {
            const monthKey = n.date.substring(0, 7); // YYYY-MM
            if (!monthGroups[monthKey]) monthGroups[monthKey] = [];
            monthGroups[monthKey].push(n);
        });
        const sortedMonths = Object.keys(monthGroups).sort((a, b) => b.localeCompare(a));

        html += `<div class="news-history-section">
            <div class="news-history-toggle" id="newsHistoryToggle">
                <div class="news-history-toggle-left">
                    <svg class="news-history-chevron" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 7l3 3 3-3"/></svg>
                    <h4>📁 历史新闻归档</h4>
                    <span class="news-history-count">${historyNews.length} 条</span>
                </div>
                <span class="news-history-hint">点击展开，回顾与串联分析行业动向</span>
            </div>
            <div class="news-history-body" id="newsHistoryBody" style="display:none;">`;

        sortedMonths.forEach(month => {
            const items = monthGroups[month];
            const [y, m] = month.split('-');
            const monthLabel = `${y}年${parseInt(m)}月`;
            html += `<div class="news-month-group">
                <div class="news-month-header" data-month="${month}">
                    <svg class="news-month-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5.5l2.5 2.5L10 5.5"/></svg>
                    <span class="news-month-label">${monthLabel}</span>
                    <span class="news-month-count">${items.length} 条</span>
                </div>
                <div class="news-month-body" style="display:none;">
                    <div class="news-list news-list-history">`;

            items.forEach(n => {
                html += renderNewsItemHTML(n, true);
            });

            html += `</div></div></div>`;
        });

        html += `</div></div>`;
    }

    container.innerHTML = html;

    // 绑定折叠交互
    const historyToggle = document.getElementById('newsHistoryToggle');
    const historyBody = document.getElementById('newsHistoryBody');
    if (historyToggle && historyBody) {
        historyToggle.addEventListener('click', () => {
            const isOpen = historyBody.style.display !== 'none';
            historyBody.style.display = isOpen ? 'none' : 'block';
            historyToggle.classList.toggle('expanded', !isOpen);
        });
    }

    // 月份折叠
    container.querySelectorAll('.news-month-header').forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            const isOpen = body.style.display !== 'none';
            body.style.display = isOpen ? 'none' : 'block';
            header.classList.toggle('expanded', !isOpen);
        });
    });
}

function renderNewsItemHTML(n, isHistory = false) {
    const impLabel = n.featured ? '⭐ 重点' : getImportanceLabel(n.importance);
    const historyClass = isHistory ? ' news-item-history' : '';
    const featuredClass = n.featured ? ' news-featured' : '';
    const importantClass = n.importance === 'high' ? ' news-important' : '';
    return `<div class="news-item${importantClass}${featuredClass}${historyClass}">
        <div class="news-item-left">
            <span class="news-item-importance${n.featured ? ' news-item-featured-badge' : ''}">${impLabel}</span>
            <span class="news-item-category">${getNewsCategory(n.category)}</span>
        </div>
        <div class="news-item-content">
            <div class="news-item-title">${n.featured ? '<span class="featured-star">⭐</span> ' : ''}${n.title}</div>
            <div class="news-item-summary">${n.summary}</div>
            <div class="news-item-meta">
                <span class="news-item-source">${n.source}</span>
                <span class="news-item-date">${n.date}</span>
                ${n.tags.map(t => `<span class="news-tag-sm">${t}</span>`).join('')}
            </div>
        </div>
        <a href="${n.sourceUrl}" target="_blank" class="news-item-link" title="查看原文">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2h8v8M14 2L6 10"/></svg>
        </a>
    </div>`;
}

function renderNewsSources() {
    const container = document.getElementById('newsSources');
    if (!container) return;

    const categories = {
        'official': { label: '🏛️ 官方渠道', sources: [] },
        'media': { label: '📰 游戏媒体', sources: [] },
        'data': { label: '📊 数据平台', sources: [] }
    };

    newsSources.forEach(s => {
        if (categories[s.category]) {
            categories[s.category].sources.push(s);
        }
    });

    let html = `<div class="sources-header">
        <h4>🔗 信息源参考</h4>
        <span class="sources-hint">以下媒体/平台为行业新闻的主要监测对象</span>
    </div>
    <div class="sources-grid">`;

    Object.values(categories).forEach(cat => {
        html += `<div class="source-category">
            <div class="source-category-label">${cat.label}</div>
            <div class="source-list">`;

        cat.sources.forEach(s => {
            html += `<a href="${s.url}" target="_blank" class="source-item">
                <span class="source-name">${s.name}</span>
                <span class="source-platform">${s.platform}</span>
                <span class="source-type">${s.type}</span>
            </a>`;
        });

        html += '</div></div>';
    });

    html += '</div>';
    container.innerHTML = html;
}

// ============ Tab: 重点公司财报分析 ============

// Earnings tooltip element
let earningsTooltipEl = null;

function getOrCreateEarningsTooltip() {
    if (!earningsTooltipEl) {
        earningsTooltipEl = document.createElement('div');
        earningsTooltipEl.className = 'earnings-tooltip';
        document.body.appendChild(earningsTooltipEl);
    }
    return earningsTooltipEl;
}

function showEarningsTooltip(e, html) {
    const tip = getOrCreateEarningsTooltip();
    tip.innerHTML = html;
    tip.classList.add('visible');
    const rect = tip.getBoundingClientRect();
    let x = e.clientX + 14;
    let y = e.clientY - 10;
    if (x + rect.width > window.innerWidth - 20) x = e.clientX - rect.width - 14;
    if (y + rect.height > window.innerHeight - 20) y = e.clientY - rect.height + 10;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
}

function hideEarningsTooltip() {
    const tip = getOrCreateEarningsTooltip();
    tip.classList.remove('visible');
}

function getRegionLabel(region) {
    const map = { us: '🇺🇸 北美', jp: '🇯🇵 日本', cn: '🇨🇳 中国', eu: '🇪🇺 欧洲', kr: '🇰🇷 韩国' };
    return map[region] || region;
}

function getRegionFlag(region) {
    const map = { us: '🇺🇸', jp: '🇯🇵', cn: '🇨🇳', eu: '🇪🇺', kr: '🇰🇷' };
    return map[region] || '';
}

function formatUSDEquiv(usdEquiv) {
    if (!usdEquiv) return '';
    return `<span class="usd-equiv">${usdEquiv}</span>`;
}

function filterEarningsCompanies() {
    const regionFilter = document.getElementById('earningsRegionFilter')?.value || 'all';
    const sortFilter = document.getElementById('earningsSortFilter')?.value || 'margin';
    const searchVal = (document.getElementById('earningsSearchInput')?.value || '').toLowerCase().trim();

    let filtered = [...earningsCompanies];

    // 搜索过滤
    if (searchVal) {
        filtered = filtered.filter(c => {
            const searchFields = [
                c.name, c.nameEn, c.ticker, c.segment,
                ...c.keyProducts,
                c.analysis?.performance || '',
                c.analysis?.newProducts || ''
            ].join(' ').toLowerCase();
            return searchFields.includes(searchVal);
        });
    }

    // 地区筛选
    if (regionFilter !== 'all') {
        const regionMap = {
            'us': ['us'],
            'jp': ['jp'],
            'cn': ['cn'],
            'eu': ['eu', 'kr'],
        };
        const regions = regionMap[regionFilter] || [];
        filtered = filtered.filter(c => regions.includes(c.region));
    }

    // 排序
    if (sortFilter === 'margin') {
        filtered.sort((a, b) => (b.financials.operatingMargin.value || -999) - (a.financials.operatingMargin.value || -999));
    } else if (sortFilter === 'growth') {
        filtered.sort((a, b) => (b.financials.revenue.yoy || -999) - (a.financials.revenue.yoy || -999));
    } else {
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    }

    return filtered;
}

function updateEarningsTab() {
    const filtered = filterEarningsCompanies();

    // KPI
    setText('earningsCompanyCount', filtered.length);

    const margins = filtered.map(c => c.financials.operatingMargin.value).filter(v => v !== null && v > 0);
    if (margins.length > 0) {
        const topMarginIdx = filtered.findIndex(c => c.financials.operatingMargin.value === Math.max(...margins));
        setText('earningsTopMargin', Math.max(...margins).toFixed(1) + '%');
        setText('earningsTopMarginName', filtered[topMarginIdx]?.name || '--');
    }

    const growths = filtered.filter(c => c.financials.revenue.yoy !== null).map(c => c.financials.revenue.yoy);
    if (growths.length > 0) {
        const maxGrowth = Math.max(...growths);
        const topGrowthCompany = filtered.find(c => c.financials.revenue.yoy === maxGrowth);
        setText('earningsTopGrowth', '+' + maxGrowth.toFixed(1) + '%');
        setText('earningsTopGrowthName', topGrowthCompany?.name || '--');
    }

    const dates = filtered.map(c => c.filingDate).sort().reverse();
    if (dates.length > 0) {
        setText('earningsLatestDate', dates[0]);
        const latestCompany = filtered.find(c => c.filingDate === dates[0]);
        setText('earningsLatestCompany', latestCompany?.name || '--');
    }

    // 图表（收入图前置，利润率/增速在后）
    renderEarningsRevenueCompareChart();
    renderEarningsFullYearChart();
    renderEarningsEstimationLegend();
    renderEarningsMarginChart(filtered);
    renderEarningsGrowthChart(filtered);

    // 公司卡片
    renderEarningsCompanyGrid(filtered);

    // 非上市公司
    renderEarningsPrivateGrid();
}

function renderEarningsMarginChart(companies) {
    const container = document.getElementById('earningsMarginChart');
    if (!container) return;

    // V8: 补齐利润率数据 — 官方数据优先，未披露的使用集团利润率或合理估算
    const data = companies.map(c => {
        let margin = c.financials.operatingMargin.value;
        let isEstimated = false;
        let estimateNote = '';
        if (margin === null || margin === undefined) {
            // 尝试从 companyOverall 获取集团利润率
            if (c.companyOverall?.totalOperatingMargin?.value) {
                margin = c.companyOverall.totalOperatingMargin.value;
                isEstimated = true;
                estimateNote = '使用集团整体利润率(游戏业务利润率未单独披露)';
            } else if (c.companyOverall?.totalOperatingProfit?.value && c.companyOverall?.totalRevenue?.value) {
                margin = +(c.companyOverall.totalOperatingProfit.value / c.companyOverall.totalRevenue.value * 100).toFixed(1);
                isEstimated = true;
                estimateNote = '基于集团营收和营业利润推算(游戏板块未单独披露)';
            } else if (c.companyOverall?.nonIfrsOp?.value && c.companyOverall?.totalRevenue?.value) {
                margin = +(c.companyOverall.nonIfrsOp.value / c.companyOverall.totalRevenue.value * 100).toFixed(1);
                isEstimated = true;
                estimateNote = '基于Non-IFRS经营利润/总营收推算(游戏利润未单独披露)';
            }
        }
        return { company: c, margin, isEstimated, estimateNote };
    }).filter(d => d.margin !== null && d.margin !== undefined)
      .sort((a, b) => b.margin - a.margin);

    let html = '<div class="earnings-bars">';
    const maxVal = Math.max(...data.map(d => Math.abs(d.margin)), 1);

    data.forEach(d => {
        const val = d.margin;
        const c = d.company;
        const width = Math.abs(val) / maxVal * 80;
        const isNegative = val < 0;
        const barColor = isNegative ? '#ef4444' : (val >= 30 ? '#22c55e' : val >= 20 ? '#3b82f6' : val >= 10 ? '#f59e0b' : '#64748b');
        const estTag = d.isEstimated ? `<span style="display:inline-block;font-size:0.58rem;padding:1px 4px;border-radius:3px;background:rgba(245,158,11,0.15);color:#f59e0b;margin-left:4px;font-weight:600;" title="${d.estimateNote}">推算</span>` : '';

        html += `<div class="earnings-bar-row clickable" data-company-id="${c.id}" data-estimated="${d.isEstimated}" data-estimate-note="${d.estimateNote}">
            <div class="earnings-bar-name">${c.logo} ${c.name}${estTag}</div>
            <div class="earnings-bar-track-wrapper">
                <div class="earnings-bar-fill" style="width:${width}%;background:${barColor};${d.isEstimated ? 'opacity:0.7;background-image:repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(255,255,255,0.15) 3px,rgba(255,255,255,0.15) 6px);' : ''}"></div>
            </div>
            <div class="earnings-bar-value" style="color:${barColor};">${val.toFixed(1)}%</div>
        </div>`;
    });

    // 估算说明
    const estimatedCount = data.filter(d => d.isEstimated).length;
    if (estimatedCount > 0) {
        html += `<div style="font-size:0.7rem;color:var(--text-muted);padding:8px 0 2px;border-top:1px dashed var(--border-color);margin-top:6px;">
            <span style="display:inline-block;width:12px;height:8px;background:repeating-linear-gradient(45deg,#f59e0b33,#f59e0b33 3px,transparent 3px,transparent 6px);border-radius:2px;margin-right:4px;vertical-align:middle;"></span>
            斜线填充 = 推算值 (${estimatedCount}家) · 游戏业务利润率未单独披露，使用集团数据推算
        </div>`;
    }

    html += '</div>';
    container.innerHTML = html;

    // Bind click + hover for chart bars
    container.querySelectorAll('.earnings-bar-row.clickable').forEach(row => {
        const companyId = row.dataset.companyId;
        const company = earningsCompanies.find(c => c.id === companyId);
        if (!company) return;

        row.addEventListener('click', () => {
            scrollToCompanyCard(companyId);
        });

        row.addEventListener('mouseenter', (e) => {
            const rev = company.financials.revenue;
            const op = company.financials.operatingProfit;
            const margin = company.financials.operatingMargin;
            const isEst = row.dataset.estimated === 'true';
            const estNote = row.dataset.estimateNote || '';
            let tipHtml = `<div class="earnings-tooltip-title">${company.logo} ${company.name} <span class="earnings-region-tag ${company.region}">${getRegionFlag(company.region)}</span></div>`;
            tipHtml += `<div class="earnings-tooltip-row"><span class="earnings-tooltip-label">${rev.label}:</span><span class="earnings-tooltip-value">${rev.value !== null ? rev.value.toLocaleString() + ' ' + rev.unit : 'N/A'}${rev.usdEquiv ? ' ' + formatUSDEquiv(rev.usdEquiv) : ''}</span></div>`;
            if (op.value !== null) {
                tipHtml += `<div class="earnings-tooltip-row"><span class="earnings-tooltip-label">${op.label}:</span><span class="earnings-tooltip-value">${op.value.toLocaleString()} ${op.unit}${op.usdEquiv ? ' ' + formatUSDEquiv(op.usdEquiv) : ''}</span></div>`;
            }
            const marginVal = margin.value !== null ? margin.value : (isEst ? parseFloat(row.querySelector('.earnings-bar-value').textContent) : null);
            tipHtml += `<div class="earnings-tooltip-row"><span class="earnings-tooltip-label">营业利润率:</span><span class="earnings-tooltip-value" style="color:${marginVal >= 30 ? '#22c55e' : marginVal >= 15 ? '#3b82f6' : '#f59e0b'};">${marginVal !== null ? marginVal.toFixed(1) + '%' : 'N/A'}${isEst ? ' <span style="color:#f59e0b;font-size:0.72rem;">(推算)</span>' : ''}</span></div>`;
            if (isEst && estNote) {
                tipHtml += `<div style="font-size:0.7rem;color:#f59e0b;margin-top:3px;padding:3px 6px;background:rgba(245,158,11,0.08);border-radius:4px;">⚠ ${estNote}</div>`;
            }
            tipHtml += `<div class="earnings-tooltip-source">📅 ${company.fiscalPeriod} · ${company.filingDate}</div>`;
            showEarningsTooltip(e, tipHtml);
        });

        row.addEventListener('mousemove', (e) => {
            const tip = getOrCreateEarningsTooltip();
            let x = e.clientX + 14;
            let y = e.clientY - 10;
            if (x + 340 > window.innerWidth - 20) x = e.clientX - 340 - 14;
            tip.style.left = x + 'px';
            tip.style.top = y + 'px';
        });

        row.addEventListener('mouseleave', hideEarningsTooltip);
    });
}

function renderEarningsGrowthChart(companies) {
    const container = document.getElementById('earningsGrowthChart');
    if (!container) return;

    const data = companies
        .filter(c => c.financials.revenue.yoy !== null)
        .sort((a, b) => b.financials.revenue.yoy - a.financials.revenue.yoy);

    let html = '<div class="earnings-bars">';
    const maxVal = Math.max(...data.map(c => Math.abs(c.financials.revenue.yoy)), 1);

    data.forEach(c => {
        const val = c.financials.revenue.yoy;
        const width = Math.abs(val) / maxVal * 80;
        const isNegative = val < 0;
        const barColor = isNegative ? '#ef4444' : (val >= 30 ? '#22c55e' : val >= 15 ? '#3b82f6' : val >= 0 ? '#f59e0b' : '#ef4444');

        html += `<div class="earnings-bar-row clickable" data-company-id="${c.id}">
            <div class="earnings-bar-name">${c.logo} ${c.name}</div>
            <div class="earnings-bar-track-wrapper">
                ${isNegative ? `<div class="earnings-bar-fill negative" style="width:${width}%;background:${barColor};"></div>` :
                    `<div class="earnings-bar-fill" style="width:${width}%;background:${barColor};"></div>`}
            </div>
            <div class="earnings-bar-value" style="color:${barColor};">${val > 0 ? '+' : ''}${val.toFixed(1)}%</div>
        </div>`;
    });

    html += '</div>';
    container.innerHTML = html;

    // Bind click + hover for growth chart bars
    container.querySelectorAll('.earnings-bar-row.clickable').forEach(row => {
        const companyId = row.dataset.companyId;
        const company = earningsCompanies.find(c => c.id === companyId);
        if (!company) return;

        row.addEventListener('click', () => scrollToCompanyCard(companyId));

        row.addEventListener('mouseenter', (e) => {
            const rev = company.financials.revenue;
            let tipHtml = `<div class="earnings-tooltip-title">${company.logo} ${company.name}</div>`;
            tipHtml += `<div class="earnings-tooltip-row"><span class="earnings-tooltip-label">${rev.label}:</span><span class="earnings-tooltip-value">${rev.value !== null ? rev.value.toLocaleString() + ' ' + rev.unit : 'N/A'}${rev.usdEquiv ? ' ' + formatUSDEquiv(rev.usdEquiv) : ''}</span></div>`;
            if (rev.yoy !== null) {
                tipHtml += `<div class="earnings-tooltip-row"><span class="earnings-tooltip-label">同比变化:</span><span class="earnings-tooltip-value" style="color:${rev.yoy >= 0 ? '#22c55e' : '#ef4444'};">${rev.yoy > 0 ? '+' : ''}${rev.yoy.toFixed(1)}%</span></div>`;
            }
            tipHtml += `<div class="earnings-tooltip-source">📅 ${company.fiscalPeriod}</div>`;
            showEarningsTooltip(e, tipHtml);
        });

        row.addEventListener('mousemove', (e) => {
            const tip = getOrCreateEarningsTooltip();
            let x = e.clientX + 14;
            let y = e.clientY - 10;
            if (x + 340 > window.innerWidth - 20) x = e.clientX - 340 - 14;
            tip.style.left = x + 'px';
            tip.style.top = y + 'px';
        });

        row.addEventListener('mouseleave', hideEarningsTooltip);
    });
}

// 图表公司名称 → earningsCompanies.id 映射（处理简称/带后缀的情况）
function findCompanyIdByChartName(chartName) {
    if (!chartName || typeof earningsCompanies === 'undefined') return null;
    const nameMap = {
        '腾讯': 'tencent', '索尼(G&NS)': 'sony', '索尼': 'sony',
        '微软(MPC)': 'microsoft', '微软(Gaming)': 'microsoft', '微软': 'microsoft',
        '任天堂': 'nintendo', 'EA': 'ea', '网易': 'netease',
        'Take-Two': 'take-two', 'Roblox': 'roblox', '育碧': 'ubisoft',
        'Nexon': 'nexon', 'Krafton': 'krafton', 'Embracer': 'embracer',
        'Unity': 'unity', '卡普空': 'capcom', '卡普空(DC)': 'capcom',
        '万代南梦宫': 'bandai-namco', '万代南梦宫(DE)': 'bandai-namco',
        'Square Enix': 'square-enix', 'Square Enix(DE)': 'square-enix',
        '科乐美': 'konami', '科乐美(DE)': 'konami',
        '世嘉萨米': 'sega', '世嘉萨米(EC)': 'sega'
    };
    // 精确匹配
    if (nameMap[chartName]) return nameMap[chartName];
    // 模糊匹配：遍历 earningsCompanies 查找
    const match = earningsCompanies.find(c =>
        chartName.includes(c.name) || chartName.includes(c.nameEn) ||
        c.name.includes(chartName) || c.nameEn.includes(chartName)
    );
    return match ? match.id : null;
}

function renderEarningsRevenueCompareChart() {
    const container = document.getElementById('earningsRevenueCompareChart');
    if (!container) return;
    const rawData = (typeof quarterlyRevenueComparison !== 'undefined') ? quarterlyRevenueComparison : [];
    // V7: 只展示revenue不为null的条目（有真实单季度数据的公司）
    const data = rawData.filter(d => d.revenue !== null && d.revenue > 0);
    const nullCount = rawData.length - data.length;
    if (data.length === 0) { container.innerHTML = '<p style="color:var(--text-muted);padding:20px;">暂无数据</p>'; return; }
    const sorted = [...data].sort((a, b) => b.revenue - a.revenue);
    const maxVal = Math.max(...sorted.map(d => d.revenue), 1);
    // dataGrade 颜色映射
    const gradeColors = { A: '#10b981', B: '#f59e0b', C: '#ef4444', X: '#6b7280' };
    const gradeLabels = { A: '官方', B: '推算', C: '估算', X: '暂无' };
    let html = '<div class="earnings-bars">';
    sorted.forEach(d => {
        const width = (d.revenue / maxVal * 75);
        const valStr = d.revenue >= 10000 ? '$' + (d.revenue/1000).toFixed(1) + 'B' : '$' + (d.revenue/1000).toFixed(2) + 'B';
        const grade = d.dataGrade || 'A';
        const gradeColor = gradeColors[grade] || '#6b7280';
        const gradeTag = `<span style="display:inline-block;font-size:0.6rem;padding:1px 4px;border-radius:3px;background:${gradeColor}22;color:${gradeColor};margin-left:4px;font-weight:600;">${gradeLabels[grade] || grade}</span>`;
        const yoyStr = d.yoy !== null && d.yoy !== undefined ? `<span style="color:${d.yoy >= 0 ? '#10b981' : '#ef4444'};font-size:0.7rem;margin-left:3px;">${d.yoy >= 0 ? '+' : ''}${d.yoy}%</span>` : '';
        const periodStr = d.period ? `<span style="font-size:0.65rem;color:var(--text-muted);margin-left:3px;">${d.period}</span>` : '';
        const companyId = findCompanyIdByChartName(d.name);
        html += `<div class="earnings-bar-row clickable" title="${d.note || ''}" data-period="${d.period || ''}" data-grade="${grade}" data-caveat="${d.caveat || ''}" data-company-id="${companyId || ''}" style="cursor:${companyId ? 'pointer' : 'default'};">
            <div class="earnings-bar-name">${d.name}${gradeTag}</div>
            <div class="earnings-bar-track-wrapper">
                <div class="earnings-bar-fill" style="width:${width}%;background:${d.color};"></div>
            </div>
            <div class="earnings-bar-value" style="color:${d.color};">${valStr}${yoyStr}</div>
        </div>`;
    });
    // 如果有null条目（数据不可靠的公司），显示提示
    if (nullCount > 0) {
        html += `<div style="font-size:0.72rem;color:var(--text-muted);padding:8px 0 2px;border-top:1px dashed var(--border-color);margin-top:8px;">⚠ ${nullCount}家公司因数据不可靠/暂无已排除（万代南梦宫、Square Enix、科乐美、世嘉萨米）</div>`;
    }
    html += '</div>';
    container.innerHTML = html;

    // Click + Hover for revenue compare bars
    container.querySelectorAll('.earnings-bar-row.clickable').forEach(row => {
        // V11: 点击跳转到对应公司卡片
        const companyId = row.dataset.companyId;
        if (companyId) {
            row.addEventListener('click', () => scrollToCompanyCard(companyId));
        }

        row.addEventListener('mouseenter', (e) => {
            const note = row.getAttribute('title');
            const period = row.dataset.period || '';
            const grade = row.dataset.grade || '';
            const caveat = row.dataset.caveat || '';
            if (note) {
                let tipHtml = `<div class="earnings-tooltip-title">${row.querySelector('.earnings-bar-name').textContent}</div>`;
                tipHtml += `<div style="font-size:0.78rem;color:var(--text-secondary);">${note}</div>`;
                if (period) tipHtml += `<div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;">📅 ${period}</div>`;
                if (caveat) tipHtml += `<div style="font-size:0.72rem;color:var(--accent-warning);margin-top:2px;">⚠ ${caveat}</div>`;
                tipHtml += `<div class="earnings-tooltip-source">统一单季度USD等值对比 · 点击查看详情</div>`;
                showEarningsTooltip(e, tipHtml);
                row.removeAttribute('title');
                row.dataset.note = note;
            }
        });
        row.addEventListener('mousemove', (e) => {
            const tip = getOrCreateEarningsTooltip();
            tip.style.left = (e.clientX + 14) + 'px';
            tip.style.top = (e.clientY - 10) + 'px';
        });
        row.addEventListener('mouseleave', (e) => {
            hideEarningsTooltip();
            if (row.dataset.note) row.setAttribute('title', row.dataset.note);
        });
    });
}

// V7: 全年/年化游戏收入对比图表
function renderEarningsFullYearChart() {
    const container = document.getElementById('earningsFullYearChart');
    if (!container) return;
    const rawData = (typeof fullYearRevenueComparison !== 'undefined') ? fullYearRevenueComparison : [];
    const data = rawData.filter(d => d.revenue !== null && d.revenue > 0);
    if (data.length === 0) { container.innerHTML = '<p style="color:var(--text-muted);padding:20px;">暂无数据</p>'; return; }
    const sorted = [...data].sort((a, b) => b.revenue - a.revenue);
    const maxVal = Math.max(...sorted.map(d => d.revenue), 1);
    const gradeColors = { A: '#10b981', B: '#f59e0b', C: '#ef4444', X: '#6b7280' };
    const gradeLabels = { A: '官方', B: '推算/指引', C: '估算', X: '暂无' };
    let html = '<div class="earnings-bars">';
    sorted.forEach(d => {
        const width = (d.revenue / maxVal * 75);
        const valStr = d.revenue >= 10000 ? '$' + (d.revenue/1000).toFixed(1) + 'B' : '$' + (d.revenue/1000).toFixed(2) + 'B';
        const grade = d.dataGrade || 'A';
        const gradeColor = gradeColors[grade] || '#6b7280';
        const gradeTag = `<span style="display:inline-block;font-size:0.6rem;padding:1px 4px;border-radius:3px;background:${gradeColor}22;color:${gradeColor};margin-left:4px;font-weight:600;">${gradeLabels[grade] || grade}</span>`;
        const yoyStr = d.yoy !== null && d.yoy !== undefined ? `<span style="color:${d.yoy >= 0 ? '#10b981' : '#ef4444'};font-size:0.7rem;margin-left:3px;">${d.yoy >= 0 ? '+' : ''}${d.yoy}%</span>` : '';
        const companyId = findCompanyIdByChartName(d.name);
        html += `<div class="earnings-bar-row clickable" title="${d.note || ''}" data-period="${d.period || ''}" data-grade="${grade}" data-caveat="${d.caveat || ''}" data-breakdown="${d.breakdown || ''}" data-company-id="${companyId || ''}" style="cursor:${companyId ? 'pointer' : 'default'};">
            <div class="earnings-bar-name">${d.name}${gradeTag}</div>
            <div class="earnings-bar-track-wrapper">
                <div class="earnings-bar-fill" style="width:${width}%;background:${d.color};"></div>
            </div>
            <div class="earnings-bar-value" style="color:${d.color};">${valStr}${yoyStr}</div>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;

    // Click + Hover tooltip for full year bars
    container.querySelectorAll('.earnings-bar-row.clickable').forEach(row => {
        // V11: 点击跳转到对应公司卡片
        const companyId = row.dataset.companyId;
        if (companyId) {
            row.addEventListener('click', () => scrollToCompanyCard(companyId));
        }

        row.addEventListener('mouseenter', (e) => {
            const note = row.getAttribute('title');
            const period = row.dataset.period || '';
            const caveat = row.dataset.caveat || '';
            const breakdown = row.dataset.breakdown || '';
            if (note) {
                let tipHtml = `<div class="earnings-tooltip-title">${row.querySelector('.earnings-bar-name').textContent}</div>`;
                tipHtml += `<div style="font-size:0.78rem;color:var(--text-secondary);">${note}</div>`;
                if (period) tipHtml += `<div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;">📅 ${period}</div>`;
                if (breakdown) tipHtml += `<div style="font-size:0.72rem;color:var(--accent-primary);margin-top:2px;">📊 ${breakdown}</div>`;
                if (caveat) tipHtml += `<div style="font-size:0.72rem;color:var(--accent-warning);margin-top:2px;">⚠ ${caveat}</div>`;
                tipHtml += `<div class="earnings-tooltip-source">全年/年化USD等值对比 · 点击查看详情</div>`;
                showEarningsTooltip(e, tipHtml);
                row.removeAttribute('title');
                row.dataset.note = note;
            }
        });
        row.addEventListener('mousemove', (e) => {
            const tip = getOrCreateEarningsTooltip();
            tip.style.left = (e.clientX + 14) + 'px';
            tip.style.top = (e.clientY - 10) + 'px';
        });
        row.addEventListener('mouseleave', (e) => {
            hideEarningsTooltip();
            if (row.dataset.note) row.setAttribute('title', row.dataset.note);
        });
    });
}

// V8: 估算/推算方法说明面板 — 显眼标注为什么需要估算、缺什么、怎么算
function renderEarningsEstimationLegend() {
    const container = document.getElementById('earningsEstimationLegend');
    if (!container) return;

    // 收集所有图表中用到的非A级数据
    const qData = (typeof quarterlyRevenueComparison !== 'undefined') ? quarterlyRevenueComparison : [];
    const fyData = (typeof fullYearRevenueComparison !== 'undefined') ? fullYearRevenueComparison : [];

    const estimations = [];

    // 单季度图中的推算/估算
    qData.filter(d => d.dataGrade && d.dataGrade !== 'A' && d.revenue !== null).forEach(d => {
        estimations.push({
            company: d.name, grade: d.dataGrade, chart: '单季度',
            note: d.note || '', caveat: d.caveat || '', period: d.period || ''
        });
    });
    // 全年图中的推算/估算
    fyData.filter(d => d.dataGrade && d.dataGrade !== 'A' && d.revenue !== null).forEach(d => {
        estimations.push({
            company: d.name, grade: d.dataGrade, chart: '全年',
            note: d.note || '', caveat: d.caveat || '', period: d.period || ''
        });
    });
    // 排除的公司（dataGrade X 或 revenue null）
    const excluded = qData.filter(d => d.revenue === null || d.dataGrade === 'X');

    if (estimations.length === 0 && excluded.length === 0) { container.innerHTML = ''; return; }

    const gradeColors = { A: '#10b981', B: '#f59e0b', C: '#ef4444', X: '#6b7280' };
    const gradeLabels = { A: '官方数据', B: '推算(基于官方数据推导)', C: '估算(基于行业共识/指引)', X: '暂无可靠数据' };
    const gradeExplain = {
        B: '公司仅发布九月累计或半年报数据，通过 "九月累计 − 上半年" 推算出单季度数据，或基于管理层全年指引',
        C: '公司未单独披露游戏业务数据，或数据为行业共识估算值，参考多家分析师报告交叉验证',
        X: '财报数据过时或为幻觉估算，已主动排除等待更新'
    };

    let html = `<div style="padding:14px 18px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:10px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
            <span style="font-size:0.82rem;font-weight:700;color:var(--text-primary);">📋 数据质量标注说明</span>
            <span style="font-size:0.68rem;padding:2px 6px;border-radius:4px;background:rgba(99,102,241,0.1);color:#6366f1;">为什么有些数据是推算/估算？</span>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:10px;">`;

    ['A', 'B', 'C', 'X'].forEach(g => {
        html += `<div style="display:flex;align-items:center;gap:5px;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${gradeColors[g]};"></span>
            <span style="font-size:0.72rem;font-weight:600;color:${gradeColors[g]};">${gradeLabels[g]}</span>
        </div>`;
    });
    html += `</div>`;

    // 详细列表
    if (estimations.length > 0) {
        html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:8px;">`;
        estimations.forEach(e => {
            const gc = gradeColors[e.grade] || '#6b7280';
            const gl = gradeLabels[e.grade] || e.grade;
            html += `<div style="padding:8px 10px;background:var(--bg-primary);border-radius:6px;border-left:3px solid ${gc};">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
                    <span style="font-weight:600;font-size:0.76rem;color:var(--text-primary);">${e.company}</span>
                    <span style="font-size:0.6rem;padding:1px 4px;border-radius:3px;background:${gc}22;color:${gc};font-weight:600;">${gl}</span>
                    <span style="font-size:0.62rem;color:var(--text-muted);">${e.chart}图 · ${e.period}</span>
                </div>
                <div style="font-size:0.68rem;color:var(--text-secondary);">${e.caveat || e.note}</div>
            </div>`;
        });
        html += `</div>`;
    }

    // 排除公司
    if (excluded.length > 0) {
        html += `<div style="margin-top:8px;font-size:0.7rem;color:var(--text-muted);padding:6px 8px;background:rgba(107,114,128,0.06);border-radius:4px;">
            ⚠ 已排除(数据不可靠)：${excluded.map(e => `<span style="font-weight:600;">${e.name}</span>`).join('、')} — 等待最新财报数据更新后重新纳入
        </div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
}

function scrollToCompanyCard(companyId) {
    const card = document.querySelector(`.earnings-company-card[data-company-id="${companyId}"]`);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Flash highlight
        card.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.5), var(--shadow-lg)';
        card.style.borderColor = 'var(--accent-primary)';
        setTimeout(() => {
            card.style.boxShadow = '';
            card.style.borderColor = '';
        }, 2000);
        // Auto-expand detail
        const detailEl = document.getElementById(`earningsDetail-${companyId}`);
        const expandBtn = card.querySelector('.earnings-card-expand');
        if (detailEl && detailEl.style.display === 'none') {
            detailEl.style.display = 'block';
            if (expandBtn) {
                expandBtn.classList.add('expanded');
                expandBtn.querySelector('span').textContent = '收起详细分析';
            }
        }
    }
}

// V8: 构建双模块（最近单季度 + 最近全年）HTML — 所有公司通用
// 数据来源优先级：latestQuarter/fullYear > quarterlyRevenueComparison/fullYearRevenueComparison > financials
function buildDualModuleHtml(c) {
    const yoyBadge = (yoy) => {
        if (yoy === null || yoy === undefined) return '';
        return `<span style="display:inline-block;font-size:0.68rem;padding:1px 6px;border-radius:10px;background:${yoy>=0?'rgba(16,185,129,0.12)':'rgba(239,68,68,0.12)'};color:${yoy>=0?'#10b981':'#ef4444'};margin-left:5px;font-weight:600;">${yoy>=0?'+':''}${yoy}%</span>`;
    };

    // === 提取单季度数据 ===
    let qPeriod = '', qRevStr = '', qRevYoyBadge = '', qBreakdown = '', qSource = '';
    if (c.latestQuarter) {
        const lq = c.latestQuarter;
        qPeriod = lq.period || '';
        const qRev = lq.revenue?.value;
        const qUnit = c.currency === 'CNY' ? '百万¥' : c.currency === 'JPY' ? '百万¥' : c.currency === 'USD' ? '$M' : '';
        const qUsd = lq.revenue?.usdEquiv || '';
        qRevStr = qRev !== null && qRev !== undefined
            ? `<span style="font-weight:700;font-size:0.85rem;">${(qRev/10000 >= 1 ? (qRev/10000).toFixed(1) + '万' : qRev.toLocaleString())} ${c.financials.revenue.unit?.split('(')[0] || ''}</span>
               ${qUsd ? `<span style="color:#10b981;font-size:0.72rem;margin-left:3px;">${qUsd}</span>` : ''}`
            : '<span style="color:var(--text-muted);font-size:0.78rem;">未单独披露</span>';
        qRevYoyBadge = yoyBadge(lq.revenue?.yoy);
        if (lq.gameMetrics?.domesticGames && lq.gameMetrics?.internationalGames) {
            const dg = lq.gameMetrics.domesticGames;
            const ig = lq.gameMetrics.internationalGames;
            qBreakdown = `<div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">
                国内 ¥${dg.value}${dg.unit||'亿'}${yoyBadge(dg.yoy)} · 国际 ¥${ig.value}${ig.unit||'亿'}${yoyBadge(ig.yoy)}
            </div>`;
        }
        qSource = lq.filingDate ? `发布 ${lq.filingDate}` : '';
    } else {
        // 从 quarterlyRevenueComparison 获取
        const qrc = (typeof quarterlyRevenueComparison !== 'undefined') ? quarterlyRevenueComparison : [];
        const match = qrc.find(d => d.name && (d.name.includes(c.name) || d.name.includes(c.nameEn)));
        if (match && match.revenue) {
            qPeriod = match.period || c.fiscalPeriod;
            const valStr = match.revenue >= 10000 ? '$' + (match.revenue/1000).toFixed(1) + 'B' : '$' + (match.revenue/1000).toFixed(2) + 'B';
            qRevStr = `<span style="font-weight:700;font-size:0.85rem;">${valStr}</span>`;
            qRevYoyBadge = yoyBadge(match.yoy);
            const grade = match.dataGrade || 'A';
            const gradeColors = { A: '#10b981', B: '#f59e0b', C: '#ef4444' };
            const gradeLabels = { A: '官方', B: '推算', C: '估算' };
            if (grade !== 'A') {
                qRevStr += ` <span style="font-size:0.6rem;padding:1px 4px;border-radius:3px;background:${(gradeColors[grade]||'#6b7280')}22;color:${gradeColors[grade]||'#6b7280'};font-weight:600;">${gradeLabels[grade]||grade}</span>`;
            }
            if (match.caveat) qBreakdown = `<div style="font-size:0.66rem;color:var(--text-muted);margin-top:3px;">📝 ${match.caveat}</div>`;
        } else {
            // 从 financials 中获取
            qPeriod = c.fiscalPeriod || '';
            const rev = c.financials.revenue;
            if (rev.value !== null) {
                qRevStr = `<span style="font-weight:700;font-size:0.85rem;">${rev.value.toLocaleString()} ${rev.unit}</span>`;
                if (rev.usdEquiv) qRevStr += ` <span style="color:#10b981;font-size:0.72rem;">${rev.usdEquiv}</span>`;
                qRevYoyBadge = yoyBadge(rev.yoy);
            } else {
                qRevStr = '<span style="color:var(--text-muted);font-size:0.78rem;">未单独披露</span>';
            }
        }
    }

    // === 提取全年数据 ===
    let fyPeriod = '', fyRevStr = '', fyRevYoyBadge = '', fyBreakdown = '', fySource = '';
    if (c.fullYear) {
        const fy = c.fullYear;
        fyPeriod = fy.period || '';
        const fyRev = fy.revenue?.value;
        const fyUsd = fy.revenue?.usdEquiv || '';
        fyRevStr = fyRev !== null && fyRev !== undefined
            ? `<span style="font-weight:700;font-size:0.85rem;">${(fyRev/10000 >= 1 ? (fyRev/10000).toFixed(1) + '万' : fyRev.toLocaleString())} ${c.financials.revenue.unit?.split('(')[0] || ''}</span>
               ${fyUsd ? `<span style="color:#8b5cf6;font-size:0.72rem;margin-left:3px;">${fyUsd}</span>` : ''}`
            : '<span style="color:var(--text-muted);font-size:0.78rem;">暂无全年数据</span>';
        fyRevYoyBadge = yoyBadge(fy.revenue?.yoy);
        if (fy.gameBreakdown?.domestic && fy.gameBreakdown?.international) {
            const dg = fy.gameBreakdown.domestic;
            const ig = fy.gameBreakdown.international;
            fyBreakdown = `<div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">
                国内 ¥${dg.value}${dg.unit||'亿'}${yoyBadge(dg.yoy)} · 国际 ¥${ig.value}${ig.unit||'亿'}${yoyBadge(ig.yoy)}
            </div>`;
        }
    } else {
        // 从 fullYearRevenueComparison 获取
        const fyrc = (typeof fullYearRevenueComparison !== 'undefined') ? fullYearRevenueComparison : [];
        const matchFy = fyrc.find(d => d.name && (d.name.includes(c.name) || d.name.includes(c.nameEn)));
        if (matchFy && matchFy.revenue) {
            fyPeriod = matchFy.period || '';
            const valStr = matchFy.revenue >= 10000 ? '$' + (matchFy.revenue/1000).toFixed(1) + 'B' : '$' + (matchFy.revenue/1000).toFixed(2) + 'B';
            fyRevStr = `<span style="font-weight:700;font-size:0.85rem;">${valStr}</span>`;
            fyRevYoyBadge = yoyBadge(matchFy.yoy);
            const grade = matchFy.dataGrade || 'A';
            const gradeColors = { A: '#10b981', B: '#f59e0b', C: '#ef4444' };
            const gradeLabels = { A: '官方', B: '推算/指引', C: '估算' };
            if (grade !== 'A') {
                fyRevStr += ` <span style="font-size:0.6rem;padding:1px 4px;border-radius:3px;background:${(gradeColors[grade]||'#6b7280')}22;color:${gradeColors[grade]||'#6b7280'};font-weight:600;">${gradeLabels[grade]||grade}</span>`;
            }
            if (matchFy.breakdown) fyBreakdown = `<div style="font-size:0.66rem;color:var(--text-muted);margin-top:3px;">📊 ${matchFy.breakdown}</div>`;
            if (matchFy.caveat) fyBreakdown += `<div style="font-size:0.66rem;color:var(--text-muted);margin-top:2px;">📝 ${matchFy.caveat}</div>`;
        } else {
            fyPeriod = '';
            fyRevStr = '<span style="color:var(--text-muted);font-size:0.76rem;">暂无全年数据</span>';
        }
    }

    return `
        <div class="earnings-dual-module" style="margin:8px 12px;padding:12px 14px;background:var(--bg-secondary);border-radius:10px;border:1px solid var(--border-color);">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
                <span style="font-size:0.75rem;font-weight:700;color:var(--text-primary);">📊 数据双视图</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <!-- 单季度模块 -->
                <div style="padding:10px 12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid #10b981;">
                    <div style="font-size:0.68rem;color:var(--text-muted);margin-bottom:5px;">
                        📅 ${qPeriod || '最新季度'}
                        <span style="background:rgba(16,185,129,0.12);color:#10b981;padding:1px 5px;border-radius:3px;font-size:0.6rem;font-weight:600;margin-left:3px;">单季度</span>
                    </div>
                    <div>${qRevStr}${qRevYoyBadge}</div>
                    ${qBreakdown}
                </div>
                <!-- 全年模块 -->
                <div style="padding:10px 12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid #8b5cf6;">
                    <div style="font-size:0.68rem;color:var(--text-muted);margin-bottom:5px;">
                        📅 ${fyPeriod || '全年/年化'}
                        <span style="background:rgba(139,92,246,0.12);color:#8b5cf6;padding:1px 5px;border-radius:3px;font-size:0.6rem;font-weight:600;margin-left:3px;">全年</span>
                    </div>
                    <div>${fyRevStr}${fyRevYoyBadge}</div>
                    ${fyBreakdown}
                </div>
            </div>
        </div>`;
}

function renderEarningsCompanyGrid(companies) {
    const container = document.getElementById('earningsCompanyGrid');
    if (!container) return;

    if (companies.length === 0) {
        container.innerHTML = `<div class="earnings-no-result">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="24" cy="24" r="20"/><path d="M16 16l16 16M32 16L16 32"/></svg>
            <p>未找到匹配的公司</p>
            <p style="font-size:0.78rem;margin-top:4px;">尝试调整搜索词或筛选条件</p>
        </div>`;
        return;
    }

    let html = '';
    companies.forEach(c => {
        const marginVal = c.financials.operatingMargin.value;
        const marginClass = marginVal === null ? 'margin-ok' : marginVal >= 30 ? 'margin-excellent' :
            marginVal >= 15 ? 'margin-good' :
            marginVal >= 0 ? 'margin-ok' : 'margin-loss';

        const yoyLabel = c.financials.revenue.yoy !== null ?
            `<span class="earnings-yoy ${c.financials.revenue.yoy >= 0 ? 'positive' : 'negative'}">${c.financials.revenue.yoy > 0 ? '↑' : '↓'} ${Math.abs(c.financials.revenue.yoy).toFixed(1)}% YoY</span>` :
            '';

        const revUsdHtml = c.financials.revenue.usdEquiv && c.currency !== 'USD'
            ? formatUSDEquiv(c.financials.revenue.usdEquiv) : '';
        const opUsdHtml = c.financials.operatingProfit.usdEquiv && c.currency !== 'USD'
            ? formatUSDEquiv(c.financials.operatingProfit.usdEquiv) : '';
        const currencyBadge = c.currency !== 'USD'
            ? `<span class="currency-badge">${c.currency}</span>` : '';
        const exchangeRateNote = c.currency !== 'USD' && earningsExchangeRates[c.currency]
            ? `<span class="exchange-rate-note">汇率: 1 USD ≈ ${earningsExchangeRates[c.currency].rate} ${c.currency} · ${earningsExchangeRates[c.currency].source}</span>` : '';
        const regionTag = `<span class="earnings-region-tag ${c.region}">${getRegionFlag(c.region)} ${getRegionLabel(c.region)}</span>`;

        // 核心运营指标（取前3个）
        const metricsEntries = Object.entries(c.gameMetrics).filter(([k, m]) => m && m.label).slice(0, 3);
        let metricsHtml = metricsEntries.map(([key, m]) => {
            let yoyStr = '';
            if (m.yoy !== undefined && m.yoy !== null) {
                yoyStr = `<span class="metric-yoy ${m.yoy >= 0 ? 'positive' : 'negative'}">${m.yoy > 0 ? '+' : ''}${m.yoy}%</span>`;
            }
            return `<div class="earnings-metric">
                <span class="metric-label">${m.label}</span>
                <span class="metric-value">${m.value !== null && m.value !== undefined ? m.value : 'N/A'}${m.unit ? ' ' + m.unit : ''}</span>
                ${yoyStr}
            </div>`;
        }).join('');

        // Data sources
        let sourcesHtml = '';
        if (c.dataSources && c.dataSources.length > 0) {
            sourcesHtml = `<div class="earnings-card-sources">
                <div class="earnings-sources-header">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 2h8v8H2z"/><path d="M4 5h4M4 7h3"/></svg>
                    数据来源 (${c.dataSources.length})
                </div>
                ${c.dataSources.map(ds => `<a href="${ds.url}" target="_blank" class="earnings-source-item">
                    <span class="earnings-source-type">${ds.type}</span>
                    <span class="earnings-source-name">${ds.name}</span>
                    <span class="earnings-source-date">${ds.date}</span>
                    <svg class="earnings-source-link-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4.5 1.5h6v6M10.5 1.5L4.5 7.5"/></svg>
                </a>`).join('')}
            </div>`;
        }

        // V8: 双模块 — 最近单季度 + 最近全年（所有公司通用，从已有数据中提取）
        const dualModuleHtml = buildDualModuleHtml(c);

        // 公司整体数据（安全处理 — 防止缺少 totalOperatingProfit 的情况）
        let companyOverallHtml = '';
        if (c.companyOverall) {
            const co = c.companyOverall;
            let overallRows = '';
            if (co.totalRevenue) {
                overallRows += `<div class="earnings-overall-row">
                    <span class="overall-label">${co.totalRevenue.label}</span>
                    <span><span class="overall-value">${co.totalRevenue.value ? co.totalRevenue.value.toLocaleString() + ' ' + co.totalRevenue.unit : 'N/A'}</span>${c.currency !== 'USD' && co.totalRevenue.value ? ' ' + formatUSDEquiv(getUSDLabel(co.totalRevenue.value, c.currency, co.totalRevenue.unit)) : ''}${co.totalRevenue.yoy !== null && co.totalRevenue.yoy !== undefined ? `<span class="overall-yoy ${co.totalRevenue.yoy >= 0 ? 'positive' : 'negative'}">${co.totalRevenue.yoy > 0 ? '+' : ''}${co.totalRevenue.yoy}%</span>` : ''}</span>
                </div>`;
            }
            if (co.totalOperatingProfit) {
                overallRows += `<div class="earnings-overall-row">
                    <span class="overall-label">${co.totalOperatingProfit.label}</span>
                    <span><span class="overall-value">${co.totalOperatingProfit.value ? co.totalOperatingProfit.value.toLocaleString() + ' ' + co.totalOperatingProfit.unit : 'N/A'}</span>${c.currency !== 'USD' && co.totalOperatingProfit.value ? ' ' + formatUSDEquiv(getUSDLabel(co.totalOperatingProfit.value, c.currency, co.totalOperatingProfit.unit)) : ''}</span>
                </div>`;
            }
            if (co.nonIfrsOp) {
                overallRows += `<div class="earnings-overall-row">
                    <span class="overall-label">${co.nonIfrsOp.label}</span>
                    <span><span class="overall-value">${co.nonIfrsOp.value ? co.nonIfrsOp.value.toLocaleString() + ' ' + co.nonIfrsOp.unit : 'N/A'}</span>${c.currency !== 'USD' && co.nonIfrsOp.value ? ' ' + formatUSDEquiv(getUSDLabel(co.nonIfrsOp.value, c.currency, co.nonIfrsOp.unit)) : ''}</span>
                </div>`;
            }
            if (co.totalOperatingMargin) {
                overallRows += `<div class="earnings-overall-row">
                    <span class="overall-label">${co.totalOperatingMargin.label || '营业利润率'}</span>
                    <span><span class="overall-value">${co.totalOperatingMargin.value}%</span></span>
                </div>`;
            }
            companyOverallHtml = `<div class="earnings-card-overall">
                <div class="earnings-overall-header"><span>📋 公司整体数据参考</span></div>
                <div class="earnings-overall-rows">${overallRows}</div>
                ${co.note ? `<div class="earnings-overall-note">${co.note}</div>` : ''}
            </div>`;
        }

        html += `<div class="earnings-company-card" data-company-id="${c.id}">
            <div class="earnings-card-top">
                <div class="earnings-card-header">
                    <div class="earnings-card-identity">
                        <span class="earnings-card-logo">${c.logo}</span>
                        <div>
                            <div class="earnings-card-name">${c.name} ${regionTag}</div>
                            <div class="earnings-card-ticker">${c.ticker}</div>
                        </div>
                    </div>
                    <a href="${c.irUrl}" target="_blank" class="earnings-ir-link" title="查看IR页面">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2h8v8M14 2L6 10"/></svg>
                        IR
                    </a>
                </div>
                <div class="earnings-card-segment">${c.segment}</div>
                <div class="earnings-card-period">${c.fiscalPeriod} · ${c.filingType} ${currencyBadge}</div>
            </div>
            ${dualModuleHtml}
            <div class="earnings-card-financials">
                <div class="earnings-financial-row clickable-fin" data-fin-type="revenue" data-company-id="${c.id}">
                    <span class="fin-label">${c.financials.revenue.label}</span>
                    <span class="fin-value">${c.financials.revenue.value !== null ? c.financials.revenue.value.toLocaleString() + ' ' + c.financials.revenue.unit : '未单独披露'} ${revUsdHtml}</span>
                    ${yoyLabel}
                </div>
                <div class="earnings-financial-row clickable-fin" data-fin-type="profit" data-company-id="${c.id}">
                    <span class="fin-label">${c.financials.operatingProfit.label}</span>
                    <span class="fin-value ${c.financials.operatingProfit.value !== null && c.financials.operatingProfit.value < 0 ? 'negative' : ''}">${c.financials.operatingProfit.value !== null ? c.financials.operatingProfit.value.toLocaleString() + ' ' + c.financials.operatingProfit.unit : '未单独披露'} ${opUsdHtml}</span>
                </div>
                <div class="earnings-financial-row highlight">
                    <span class="fin-label">营业利润率</span>
                    <span class="fin-margin ${marginClass}">${marginVal !== null ? marginVal.toFixed(1) + '%' : 'N/A'}</span>
                </div>
                ${exchangeRateNote}
            </div>
            ${companyOverallHtml}
            <div class="earnings-card-metrics">
                ${metricsHtml}
            </div>
            <div class="earnings-card-products">
                ${c.keyProducts.map(p => `<span class="earnings-product-tag">${p}</span>`).join('')}
            </div>
            ${sourcesHtml}
            <div class="earnings-card-expand" data-company-id="${c.id}">
                <span>展开详细分析</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 5l4 4 4-4"/></svg>
            </div>
            <div class="earnings-card-detail" id="earningsDetail-${c.id}" style="display:none;">
                <div class="earnings-detail-section">
                    <h5>📊 业绩分析</h5>
                    <p>${c.analysis.performance}</p>
                </div>
                <div class="earnings-detail-section">
                    <h5>🎯 业务战略</h5>
                    <p>${c.analysis.strategy}</p>
                </div>
                <div class="earnings-detail-section">
                    <h5>🔮 展望与指引</h5>
                    <p>${c.analysis.outlook}</p>
                </div>
                <div class="earnings-detail-section">
                    <h5>🆕 新品与预告</h5>
                    <p>${c.analysis.newProducts}</p>
                </div>
                <div class="earnings-detail-footer">
                    <span class="earnings-filing-info">📄 ${c.filingType} · 发布日期：${c.filingDate}</span>
                    <a href="${c.filingUrl}" target="_blank" class="earnings-filing-link">查看原始财报 →</a>
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;

    // 绑定展开/收起
    container.querySelectorAll('.earnings-card-expand').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const companyId = btn.dataset.companyId;
            const detailEl = document.getElementById(`earningsDetail-${companyId}`);
            const isOpen = detailEl.style.display !== 'none';

            // 关闭所有已展开的
            container.querySelectorAll('.earnings-card-detail').forEach(d => d.style.display = 'none');
            container.querySelectorAll('.earnings-card-expand').forEach(b => {
                b.classList.remove('expanded');
                b.querySelector('span').textContent = '展开详细分析';
            });

            if (!isOpen) {
                detailEl.style.display = 'block';
                btn.classList.add('expanded');
                btn.querySelector('span').textContent = '收起详细分析';
            }
        });
    });

    // 绑定财务行点击 — 显示tooltip with source
    container.querySelectorAll('.clickable-fin').forEach(row => {
        row.addEventListener('click', (e) => {
            const companyId = row.dataset.companyId;
            const finType = row.dataset.finType;
            const company = earningsCompanies.find(c => c.id === companyId);
            if (!company) return;

            const fin = finType === 'revenue' ? company.financials.revenue : company.financials.operatingProfit;
            let tipHtml = `<div class="earnings-tooltip-title">${company.logo} ${company.name} — ${fin.label}</div>`;
            tipHtml += `<div class="earnings-tooltip-row"><span class="earnings-tooltip-label">数值:</span><span class="earnings-tooltip-value">${fin.value !== null ? fin.value.toLocaleString() + ' ' + fin.unit : '未披露'}</span></div>`;
            if (fin.usdEquiv) {
                tipHtml += `<div class="earnings-tooltip-row"><span class="earnings-tooltip-label">USD折算:</span><span class="earnings-tooltip-value" style="color:var(--teal);">${fin.usdEquiv}</span></div>`;
            }
            if (fin.yoy !== null && fin.yoy !== undefined) {
                tipHtml += `<div class="earnings-tooltip-row"><span class="earnings-tooltip-label">同比:</span><span class="earnings-tooltip-value">${fin.yoy > 0 ? '+' : ''}${fin.yoy}%</span></div>`;
            }
            if (fin.source) {
                tipHtml += `<div class="earnings-tooltip-source">📑 来源: ${fin.source}</div>`;
            }
            if (company.currency !== 'USD' && earningsExchangeRates[company.currency]) {
                tipHtml += `<div class="earnings-tooltip-source">💱 汇率: 1 USD ≈ ${earningsExchangeRates[company.currency].rate} ${company.currency} (${earningsExchangeRates[company.currency].source})</div>`;
            }
            showEarningsTooltip(e, tipHtml);

            // Auto-hide after 4 seconds
            setTimeout(hideEarningsTooltip, 4000);
        });
    });
}

function renderEarningsPrivateGrid() {
    const container = document.getElementById('earningsPrivateGrid');
    if (!container) return;

    let html = '';
    earningsComparisonData.privateCompanies.forEach(c => {
        html += `<div class="earnings-private-card">
            <div class="earnings-private-header">
                <span class="earnings-private-icon">${c.icon}</span>
                <span class="earnings-private-name">${c.name}</span>
                <span class="earnings-private-status">${c.status}</span>
            </div>
            <p class="earnings-private-note">${c.note}</p>
        </div>`;
    });

    container.innerHTML = html;
}

// ============ 导出 ============

function exportData() {
    const games = filteredGames;
    const headers = ['游戏名称', '发行商', '类型', '上线日期', 'PC', 'PS', 'Xbox', '主机', 'XGP策略', '收入层级', '日均流水($)', 'Mscience总收入($)', 'Steam收入($)'];

    let csv = '\uFEFF' + headers.join(',') + '\n';
    games.forEach(g => {
        csv += [
            `"${g.name}"`,
            `"${g.publisher}"`,
            `"${g.mainGenre}"`,
            `"${g.releaseDate}"`,
            g.isPC,
            g.isPS,
            g.isXbox,
            g.isConsole,
            `"${g.xgpType}"`,
            `"${g.revenueTier}"`,
            Math.round(g.dailyRevenue),
            Math.round(g.lifetimeRevenue),
            Math.round(g.steamRevenue || 0)
        ].join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `游戏行业分析数据_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ============ 工具函数 ============

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ============ KPI CountUp 动画 ============

function countUpValue(elementId, endValue, duration = 800) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const start = 0;
    const end = parseInt(endValue) || 0;
    if (end === 0) { el.textContent = '0'; return; }

    el.classList.add('counting');
    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (end - start) * eased);
        el.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = end.toLocaleString();
            setTimeout(() => el.classList.remove('counting'), 300);
        }
    }

    requestAnimationFrame(step);
}

// ============ 侧边栏折叠 ============

function initSidebarCollapse() {
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    const expandBtn = document.getElementById('sidebarExpandBtn');
    if (!sidebar || !collapseBtn) return;

    // 读取本地存储的折叠状态
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
        sidebar.classList.add('collapsed');
        if (expandBtn) expandBtn.style.display = '';
    }

    collapseBtn.addEventListener('click', () => {
        sidebar.classList.add('collapsed');
        localStorage.setItem('sidebarCollapsed', 'true');
        if (expandBtn) expandBtn.style.display = '';
    });

    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            sidebar.classList.remove('collapsed');
            localStorage.setItem('sidebarCollapsed', 'false');
            expandBtn.style.display = 'none';
        });
    }
}

// ============ 数据声明Banner折叠 ============

function initDataBannerCollapse() {
    const banner = document.getElementById('dataBanner');
    const toggle = document.getElementById('dataBannerToggle');
    if (!banner || !toggle) return;

    // 默认折叠以减少视觉噪音
    banner.classList.add('collapsed');

    toggle.addEventListener('click', () => {
        banner.classList.toggle('collapsed');
    });
}

// ============ Executive Summary 一句话洞察 ============

function updateExecSummary(games, flow) {
    const el = document.getElementById('execSummaryText');
    if (!el) return;

    const consolePct = pct(flow.consoleY, flow.total);
    const xboxPct = pct(flow.xboxY, flow.consoleY);
    const xgpTotal = flow.sim + flow.aft;
    const xgpPct = pct(xgpTotal, flow.xboxY);

    // 计算平均日均流水
    const avgRev = games.length > 0
        ? Math.round(games.reduce((s, g) => s + (g.dailyRevenue || 0), 0) / games.length)
        : 0;

    // 找出最热品类
    const genreCount = {};
    games.forEach(g => { if (g.mainGenre) genreCount[g.mainGenre] = (genreCount[g.mainGenre] || 0) + 1; });
    const topGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0];

    el.innerHTML = `共监测 <strong class="highlight">${flow.total}</strong> 款新游，其中 <strong>${consolePct}%</strong> 登陆主机平台，Xbox转化率 <strong>${xboxPct}%</strong>，XGP入库率 <strong>${xgpPct}%</strong>。平均日均流水 <strong>$${avgRev.toLocaleString()}</strong>${topGenre ? `，最热品类为 <strong class="highlight">${topGenre[0]}</strong>（${topGenre[1]}款）` : ''}。`;
}

// ============ Command Palette (Cmd+K / Ctrl+K) ============

function initCommandPalette() {
    const overlay = document.getElementById('cmdPaletteOverlay');
    const input = document.getElementById('cmdPaletteInput');
    const resultsContainer = document.getElementById('cmdPaletteResults');
    const cmdKBtn = document.getElementById('cmdKBtn');
    if (!overlay || !input) return;

    // Ctrl+K / Cmd+K 快捷键
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openCmdPalette();
        }
    });

    // 搜索按钮点击
    cmdKBtn?.addEventListener('click', () => openCmdPalette());

    // 点击遮罩关闭
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeCmdPalette();
    });

    // 输入搜索
    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        filterCmdResults(query, resultsContainer);
    });

    // 结果项点击
    resultsContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.cmd-item');
        if (!item) return;
        const action = item.dataset.action;
        if (action && action.startsWith('tab:')) {
            const tabName = action.split(':')[1];
            switchTab(tabName);
        }
        closeCmdPalette();
    });

    // Enter 选择第一个结果
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const firstItem = resultsContainer.querySelector('.cmd-item');
            if (firstItem) firstItem.click();
        }
    });
}

function openCmdPalette() {
    const overlay = document.getElementById('cmdPaletteOverlay');
    const input = document.getElementById('cmdPaletteInput');
    if (!overlay) return;
    overlay.classList.add('open');
    if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
    }
    filterCmdResults('', document.getElementById('cmdPaletteResults'));
}

function closeCmdPalette() {
    const overlay = document.getElementById('cmdPaletteOverlay');
    if (overlay) overlay.classList.remove('open');
}

function filterCmdResults(query, container) {
    if (!container) return;

    // Tab快速跳转数据
    const tabs = [
        { icon: '📊', name: '已上线新游全局概览', action: 'tab:strategy', keywords: ['概览', 'strategy', '全局', '战略'] },
        { icon: '🎯', name: '待上线Pipeline', action: 'tab:pipeline', keywords: ['pipeline', '待上线', '管线'] },
        { icon: '📰', name: '行业热点新闻', action: 'tab:news', keywords: ['新闻', 'news', '热点', '行业'] },
        { icon: '💰', name: '重点公司财报分析', action: 'tab:earnings', keywords: ['财报', 'earnings', '公司', '收入'] },
        { icon: '🏪', name: 'PS&Xbox商店监控', action: 'tab:storewatch', keywords: ['商店', 'storewatch', 'ps', 'xbox', '资源位'] },
    ];

    let html = '';
    const filtered = query
        ? tabs.filter(t => t.name.toLowerCase().includes(query) || t.keywords.some(k => k.includes(query)))
        : tabs;

    if (filtered.length > 0) {
        html += `<div class="cmd-section"><div class="cmd-section-label">快速跳转</div>`;
        filtered.forEach(t => {
            html += `<div class="cmd-item" data-action="${t.action}"><span class="cmd-icon">${t.icon}</span>${t.name}</div>`;
        });
        html += `</div>`;
    }

    // 搜索游戏（仅当有查询时）
    if (query && query.length >= 1 && typeof filteredGames !== 'undefined') {
        const gameMatches = filteredGames.filter(g =>
            g.name?.toLowerCase().includes(query) ||
            g.publisher?.toLowerCase().includes(query)
        ).slice(0, 8);

        if (gameMatches.length > 0) {
            html += `<div class="cmd-section"><div class="cmd-section-label">游戏 / 发行商</div>`;
            gameMatches.forEach(g => {
                html += `<div class="cmd-item" data-action="tab:strategy"><span class="cmd-icon">🎮</span>${g.name}<span class="cmd-item-subtitle">${g.publisher || ''}</span></div>`;
            });
            html += `</div>`;
        }
    }

    if (!html) {
        html = `<div class="cmd-no-result">未找到匹配结果</div>`;
    }

    container.innerHTML = html;
}

function switchTab(tabName) {
    const navItem = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
    if (navItem) navItem.click();
}

// ============ 通知系统 ============

function initNotificationSystem() {
    const btn = document.getElementById('notificationBtn');
    const panel = document.getElementById('notificationPanel');
    const clearBtn = document.getElementById('notificationClear');
    const dot = document.getElementById('notificationDot');
    if (!btn || !panel) return;

    // 生成模拟通知
    generateMockNotifications();

    // 显示通知红点
    if (dot) dot.classList.add('active');

    // 点击铃铛切换面板
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('open');
    });

    // 点击面板外关闭
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
            panel.classList.remove('open');
        }
    });

    // 全部已读
    clearBtn?.addEventListener('click', () => {
        if (dot) dot.classList.remove('active');
        const list = document.getElementById('notificationList');
        if (list) list.innerHTML = '<div class="cmd-no-result">暂无新通知</div>';
    });
}

function closeNotificationPanel() {
    document.getElementById('notificationPanel')?.classList.remove('open');
}

function generateMockNotifications() {
    const list = document.getElementById('notificationList');
    if (!list) return;

    const notifications = [
        { icon: '📊', title: '数据已更新', desc: 'CSV数据已加载最新版本，包含300+款新游', time: '刚刚' },
        { icon: '🎮', title: '新游上线提醒', desc: '本月有12款新游登陆PC&主机平台', time: '1小时前' },
        { icon: '💰', title: '财报季更新', desc: '2025Q3主要游戏公司财报数据已入库', time: '3小时前' },
        { icon: '📰', title: '行业热点', desc: 'XGP订阅模式新动态：微软宣布新战略', time: '今日' },
        { icon: '🎯', title: 'Pipeline更新', desc: '2026年Q2待上线游戏列表已更新', time: '昨日' },
    ];

    list.innerHTML = notifications.map(n => `
        <div class="notification-item">
            <span class="noti-icon">${n.icon}</span>
            <div class="noti-content">
                <div class="noti-title">${n.title}</div>
                <div class="noti-desc">${n.desc}</div>
            </div>
            <span class="noti-time">${n.time}</span>
        </div>
    `).join('');
}

// ============ 演示模式 ============

function initPresentationMode() {
    const btn = document.getElementById('presentationBtn');
    if (!btn) return;

    // 创建演示模式退出指示器
    let indicator = document.querySelector('.presentation-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'presentation-indicator';
        indicator.innerHTML = '⛶ 退出演示模式';
        document.body.appendChild(indicator);
    }

    btn.addEventListener('click', () => {
        document.body.classList.toggle('presentation-mode');
    });

    indicator.addEventListener('click', () => {
        document.body.classList.remove('presentation-mode');
    });

    // F11 也可切换演示模式
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F11') {
            e.preventDefault();
            document.body.classList.toggle('presentation-mode');
        }
    });
}

// ============ 导航角标更新 ============

function updateNavBadges() {
    // Pipeline角标
    const badgePipeline = document.getElementById('badgePipeline');
    if (badgePipeline && typeof pipelineGames !== 'undefined') {
        const count = pipelineGames.length || 0;
        if (count > 0) {
            badgePipeline.textContent = count > 99 ? '99+' : count;
            badgePipeline.classList.add('visible');
        }
    }

    // News角标
    const badgeNews = document.getElementById('badgeNews');
    if (badgeNews && typeof newsItems !== 'undefined') {
        const count = newsItems.length || 0;
        if (count > 0) {
            badgeNews.textContent = count > 99 ? '99+' : count;
            badgeNews.classList.add('visible');
        }
    }

    // Earnings角标
    const badgeEarnings = document.getElementById('badgeEarnings');
    if (badgeEarnings && typeof earningsCompanies !== 'undefined') {
        const count = earningsCompanies.length || 0;
        if (count > 0) {
            badgeEarnings.textContent = count;
            badgeEarnings.classList.add('visible');
        }
    }

    // StoreWatch角标
    const badgeStorewatch = document.getElementById('badgeStorewatch');
    if (badgeStorewatch && typeof storewatchData !== 'undefined') {
        const ps5Days = (storewatchData.PS5 || []).length;
        const xboxDays = (storewatchData.Xbox || []).length;
        const totalDays = Math.max(ps5Days, xboxDays);
        if (totalDays > 0) {
            badgeStorewatch.textContent = totalDays + 'd';
            badgeStorewatch.classList.add('visible');
        }
    }
}

// ============ 数据新鲜度指示器 ============

function updateDataFreshness() {
    const container = document.getElementById('freshnessItems');
    if (!container) return;

    const now = new Date();
    const modules = [];

    // Pipeline 新鲜度 - 基于最新 releaseDate 的游戏是否标记了 released
    if (typeof pipelineData !== 'undefined') {
        // 没有内嵌更新时间，用文件中数据的特征判断
        const unreleased = pipelineData.filter(g => {
            const m = g.releaseDate.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
            if (m) {
                const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
                return d < now && !g.released;
            }
            return false;
        });
        modules.push({
            name: 'Pipeline',
            icon: '🎮',
            status: unreleased.length === 0 ? 'fresh' : 'stale',
            detail: unreleased.length === 0 ? '数据已更新' : `${unreleased.length}款已过期未标记`,
            threshold: '7天'
        });
    }

    // News 新鲜度 - 基于最新文章日期
    if (typeof newsData !== 'undefined' && newsData.length > 0) {
        const latestDate = newsData.reduce((max, n) => {
            const d = new Date(n.date);
            return d > max ? d : max;
        }, new Date(0));
        const daysAgo = Math.floor((now - latestDate) / (1000 * 60 * 60 * 24));
        modules.push({
            name: '新闻',
            icon: '📰',
            status: daysAgo <= 1 ? 'fresh' : daysAgo <= 3 ? 'warn' : 'stale',
            detail: daysAgo === 0 ? '今日更新' : `${daysAgo}天前`,
            threshold: '1天'
        });
    }

    // Earnings 新鲜度 - 基于公司 filingDate
    if (typeof earningsCompanies !== 'undefined') {
        const staleCompanies = earningsCompanies.filter(c => {
            const fd = new Date(c.filingDate);
            return (now - fd) / (1000 * 60 * 60 * 24) > 120;
        });
        const estimatedCompanies = earningsCompanies.filter(c =>
            c.filingType && c.filingType.includes('估算')
        );
        const issues = staleCompanies.length + estimatedCompanies.length;
        modules.push({
            name: '财报',
            icon: '💰',
            status: issues === 0 ? 'fresh' : issues <= 3 ? 'warn' : 'stale',
            detail: issues === 0 ? '数据正常' : `${staleCompanies.length}过期/${estimatedCompanies.length}估算`,
            threshold: '120天'
        });
    }

    // StoreWatch 新鲜度
    if (typeof storewatchMeta !== 'undefined') {
        const lastUpdate = new Date(storewatchMeta.lastUpdated);
        const daysAgo = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
        modules.push({
            name: '商店监控',
            icon: '🏪',
            status: daysAgo <= 1 ? 'fresh' : daysAgo <= 3 ? 'warn' : 'stale',
            detail: `${daysAgo}天前`,
            threshold: '1天'
        });
    }

    const statusColors = { fresh: '#22c55e', warn: '#f59e0b', stale: '#ef4444' };
    const statusIcons = { fresh: '🟢', warn: '🟡', stale: '🔴' };

    container.innerHTML = modules.map(m => `
        <div class="freshness-item" title="${m.name}: ${m.detail} (阈值: ${m.threshold})">
            <span class="freshness-dot" style="background:${statusColors[m.status]}"></span>
            <span class="freshness-label">${m.icon} ${m.name}</span>
            <span class="freshness-detail" style="color:${statusColors[m.status]}">${m.detail}</span>
        </div>
    `).join('');
}

// ============ Agent状态检查 ============

async function checkAgentStatus() {
    try {
        const resp = await fetch('/api/agent/status');
        if (!resp.ok) return;
        const status = await resp.json();

        const now = new Date();
        const STALE_HOURS = 48; // 超过48小时未更新标记为stale

        ['pipeline', 'news', 'earnings', 'storewatch'].forEach(name => {
            const badge = document.getElementById(`${name}AgentBadge`);
            if (!badge) return;

            const info = status[name];
            if (!info) return;

            const lastMod = info.jsonLastModified || info.jsLastModified;
            if (lastMod) {
                const modDate = new Date(lastMod);
                const hoursAgo = (now - modDate) / (1000 * 60 * 60);
                const timeStr = modDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                if (hoursAgo > STALE_HOURS) {
                    badge.classList.add('stale');
                    badge.textContent = `⚠️ ${timeStr} 更新`;
                    badge.title = `数据已${Math.floor(hoursAgo)}小时未更新，建议触发Agent刷新`;
                } else {
                    badge.classList.remove('stale');
                    badge.textContent = `🤖 ${timeStr} 更新`;
                    badge.title = `由 Claw Agent 维护 · 最后更新: ${timeStr}`;
                }
            }
        });
    } catch (e) {
        // Agent API不可用时静默处理
        console.log('[Agent] Status check failed (this is normal if API not available)');
    }
}
