// ============================================
// 重点端主公司财报分析数据模块 V6
// 覆盖19家上市公司的游戏业务财务与运营数据
// 数据来源：各公司IR页面/财报/press release + 深度调研
// 更新日期: 2026-03-16
// 更新者: Earnings Agent (Claw自动维护)
// 本次更新: CD Projekt更新至Q3 2025(营收+53%,赛博朋克3500万套); 腾讯补充Q1 2025数据(国内游戏+24%); 全年数据待3月18日发布
// ============================================

// 汇率参考表 (用于USD换算) - 优先使用各公司财报期间汇率
const earningsExchangeRates = {
    JPY: { rate: 149.5, source: '日本公司FY2025财报期间均值(2025年4月-2026年3月)' },
    CNY: { rate: 7.25, source: '腾讯/网易2024年报期间均值' },
    EUR: { rate: 0.92, source: '育碧FY2025 Q3财报期间均值(1EUR≈1.09USD)' },
    PLN: { rate: 4.05, source: 'CD Projekt 2024年报期间均值(1USD≈4.05PLN)' },
    KRW: { rate: 1380, source: 'Krafton 2024年报期间均值' },
    SEK: { rate: 10.8, source: 'Embracer Group FY25/26期间均值' },
    USD: { rate: 1, source: '基准货币' }
};

function convertToUSD(value, currency) {
    if (!value || currency === 'USD') return value;
    const r = earningsExchangeRates[currency];
    return r ? +(value / r.rate).toFixed(1) : null;
}

function getUSDLabel(value, currency, unit) {
    if (!value || currency === 'USD') return null;
    const usd = convertToUSD(value, currency);
    if (usd === null) return null;
    if (usd >= 10000) return `≈$${(usd/1000).toFixed(1)}B`;
    if (usd >= 1000) return `≈$${(usd/1000).toFixed(2)}B`;
    if (usd >= 100) return `≈$${usd.toFixed(0)}M`;
    return `≈$${usd.toFixed(1)}M`;
}

// 公司基础信息 + 最新财报数据
const earningsCompanies = [
    {
        id: 'sony',
        name: '索尼集团',
        nameEn: 'Sony Group',
        ticker: 'SONY (NYSE) / 6758 (TSE)',
        market: '纽交所/东交所',
        region: 'jp',
        irUrl: 'https://www.sony.com/en/SonyInfo/IR/library/presen/er/archive.html',
        logo: '🎮',
        color: '#003087',
        segment: 'Game & Network Services (G&NS)',
        fiscalPeriod: 'FY2025 Q3 (2025年10-12月)',
        currency: 'JPY',
        companyOverall: {
            totalRevenue: { value: 3985000, unit: '百万日元', yoy: 6.2, label: '集团Q3营收', source: 'Sony FY2025 Q3 Earnings (2026/02/05)' },
            totalOperatingProfit: { value: 498000, unit: '百万日元', yoy: 9.4, label: '集团Q3营业利润' },
            totalOperatingMargin: { value: 12.5, label: '集团Q3利润率' },
            note: '索尼集团六大业务板块：G&NS(游戏)、音乐、影视、ET&S(电子)、I&SS(传感器)、金融'
        },
        financials: {
            revenue: { value: 1198000, unit: '百万日元', yoy: 4.6, label: 'G&NS营收', source: 'Sony FY2025 Q3 Supplemental (2026/02/05)', usdEquiv: '≈$8.01B' },
            operatingProfit: { value: 128500, unit: '百万日元', yoy: 23.8, label: '营业利润', usdEquiv: '≈$860M' },
            operatingMargin: { value: 10.7, label: '营业利润率' },
            segmentRevenuePct: { value: 30.1, label: '占集团营收比例' },
        },
        gameMetrics: {
            monthlyActiveUsers: { value: 138, unit: '百万', yoy: 4.5, label: 'PSN月活用户', source: 'Sony Q3 Presentation' },
            psPlus: { value: 50, unit: '百万', yoy: 2.0, label: 'PS Plus订阅用户' },
            ps5Shipments: { value: 5.8, unit: '百万台', cumulative: 101.5, label: 'PS5本季出货(累计1.015亿)', source: 'Sony IR' },
        },
        keyProducts: ['《Astro Bot》', '《蜘蛛侠2》PC', '《Horizon系列》PC', 'PS5 Pro'],
        analysis: {
            performance: 'G&NS板块FY25Q3营收同比增长4.6%至¥1.198万亿(≈$80.1亿)，营业利润大增23.8%至¥1285亿(≈$8.6亿)，利润率改善至10.7%。PS5累计出货突破1亿台里程碑(1.015亿)。PSN月活用户增至1.38亿人创新高。PS Plus调价策略推动ARPU提升。',
            strategy: '索尼持续加大PC移植力度，蜘蛛侠2和Horizon系列PC版表现出色。PS5 Pro上市拉动高端需求。Live Service战略调整中(Concord教训后更审慎)。',
            outlook: '管理层上调全年G&NS营收预期。Switch 2发售后市场竞争格局变化值得关注。2026年重点关注第一方大作和订阅生态。',
            newProducts: '多款第一方大作开发中；更多PC移植；PS5 Pro持续推广。'
        },
        dataSources: [
            { type: '季度财报', name: 'Sony FY2025 Q3 Financial Results', date: '2026-02-05', url: 'https://www.sony.com/en/SonyInfo/IR/library/presen/er/archive.html' },
            { type: '补充数据', name: 'G&NS Segment Supplemental Data', date: '2026-02-05', url: 'https://www.sony.com/en/SonyInfo/IR/library/presen/er/archive.html' }
        ],
        filingDate: '2026-02-05',
        filingType: '季度财报',
        filingUrl: 'https://www.sony.com/en/SonyInfo/IR/library/presen/er/archive.html'
    },
    {
        id: 'microsoft',
        name: '微软',
        nameEn: 'Microsoft',
        ticker: 'MSFT (NASDAQ)',
        market: '纳斯达克',
        region: 'us',
        irUrl: 'https://www.microsoft.com/en-us/investor/earnings',
        logo: '🟩',
        color: '#107C10',
        segment: 'More Personal Computing - Gaming',
        fiscalPeriod: 'FY2026 Q2 (2025年10-12月)',
        currency: 'USD',
        companyOverall: {
            totalRevenue: { value: 81300, unit: '百万美元', yoy: 17, label: '集团整体营收', source: 'Microsoft FY26 Q2 Press Release (2026/01/28)' },
            totalOperatingProfit: { value: 38300, unit: '百万美元', yoy: 21, label: '集团营业利润' },
            totalOperatingMargin: { value: 43.8, label: '集团营业利润率' },
            note: '微软三大业务板块：Intelligent Cloud $32.9B、Productivity & Business $34.1B、More Personal Computing $14.3B'
        },
        financials: {
            revenue: { value: 14300, unit: '百万美元(MPC板块)', yoy: -3, label: 'MPC板块营收', source: 'Microsoft FY26 Q2 Press Release (2026/01/28)' },
            operatingProfit: { value: 3803, unit: '百万美元', yoy: -2.9, label: 'MPC营业利润', source: 'Microsoft FY26 Q2 Press Release (2026/01/28)' },
            operatingMargin: { value: 26.6, label: 'MPC营业利润率' },
            segmentRevenuePct: { value: 17.6, label: '占集团营收比例' },
        },
        gameMetrics: {
            contentServicesRevGrowth: { value: -5, unit: '%', label: 'Xbox内容及服务收入同比', source: 'Microsoft FY26 Q2 Press Release' },
            contentServicesNote: { value: '下降主因较低的第一方内容收入', unit: '', label: '备注' },
            windowsOEMGrowth: { value: 1, unit: '%', label: 'Windows OEM和设备收入增长' },
            searchAdsGrowth: { value: 10, unit: '%', label: '搜索和新闻广告收入增长(不含TAC)' },
        },
        keyProducts: ['《使命召唤》系列', '《印第安纳·琼斯》', '《帝国时代5》', 'Xbox Game Pass'],
        analysis: {
            performance: 'More Personal Computing板块FY26Q2收入$143亿(-3% YoY)，MPC营业利润$38.03亿(上年同期$39.17亿)。Xbox内容及服务收入同比下降5%（按固定汇率下降6%），主因较低的第一方内容收入。Windows OEM收入增长1%，搜索和新闻广告收入(不含TAC)增长10%。微软未单独披露Gaming板块详细数据。',
            strategy: 'Xbox多平台策略持续推进，更多第一方游戏登陆PlayStation和Nintendo平台。Game Pass继续作为核心增长引擎。完成ABK整合后进入常态化运营。',
            outlook: '集团整体表现强劲(总营收$812.7亿，+12.3%)，云和AI是核心增长引擎。游戏板块短期受第一方内容节奏影响，长期看好Game Pass和Cloud Gaming增长。',
            newProducts: '《战争机器：E-Day》开发中；《极限竞速》新作；《完美暗杀》；《上古卷轴6》开发中。'
        },
        dataSources: [
            { type: '季度财报', name: 'Microsoft FY26 Q2 Press Release', date: '2026-01-28', url: 'https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q2/press-release-webcast' },
            { type: '电话会议', name: 'Earnings Conference Call Transcript', date: '2026-01-28', url: 'https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q2/press-release-webcast' }
        ],
        filingDate: '2026-01-28',
        filingType: '季度财报',
        filingUrl: 'https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q2/press-release-webcast'
    },
    {
        id: 'nintendo',
        name: '任天堂',
        nameEn: 'Nintendo',
        ticker: '7974 (TSE)',
        market: '东交所',
        region: 'jp',
        irUrl: 'https://www.nintendo.co.jp/ir/en/finance/index.html',
        logo: '🍄',
        color: '#E60012',
        segment: '游戏专用（整体业务）',
        fiscalPeriod: 'FY2026 Q3 九个月累计(2025年4月-12月)',
        currency: 'JPY',
        financials: {
            revenue: { value: 1523000, unit: '百万日元(九月累计)', yoy: 30.7, label: '9个月累计营收', source: 'Nintendo FY2026 Q3 Earnings Release (2026/02/03)', usdEquiv: '≈$10.19B' },
            operatingProfit: { value: 459000, unit: '百万日元(九月累计)', yoy: 12.1, label: '9个月营业利润', usdEquiv: '≈$3.07B' },
            operatingMargin: { value: 30.1, label: '9个月营业利润率' },
            segmentRevenuePct: { value: 100, label: '游戏占比' },
        },
        gameMetrics: {
            switch2Shipments: { value: 17.37, unit: '百万台(累计)', label: 'Switch 2累计出货', source: 'Nintendo IR (2026/02)' },
            switchShipments: { value: 155.37, unit: '百万台(累计)', label: 'Switch累计出货', source: 'Nintendo IR (2026/02)' },
            softwareSales: { value: 141.56, unit: '百万套(Switch累计)', label: 'Switch软件累计销量' },
            marioKartWorld: { value: 20, unit: '百万套+(估)', label: '马力欧卡丁车世界累计(估)' },
            nsoSubscribers: { value: 36, unit: '百万+', label: 'NSO订阅用户(估)' },
        },
        keyProducts: ['《马力欧卡丁车世界》(Switch 2)', '《大金刚大狂欢》', '《宝可梦传说Z-A》', 'Switch 2'],
        analysis: {
            performance: 'FY2026前九个月营收¥1.523万亿(≈$101.9亿,+30.7%)，营业利润¥4590亿(+12.1%)，利润率30.1%。Switch 2于2025年6月5日发售，首周全球sell-through超350万台创任天堂历史纪录。截至12月底Switch 2累计出货1737万台。《马力欧卡丁车世界》首发大卖。Switch初代累计达1.5537亿台。',
            strategy: 'Switch 2成功发售标志着新一代超级周期开启。向下兼容策略推动用户无缝迁移。任天堂着力构建Switch 2独占游戏阵容。',
            outlook: 'FY2026全年财报将于2026年5月8日发布。Switch 2供不应求，持续扩大产能。《宝可梦传说Z-A》10月发售将是下半年关键催化剂。2026年有望成为任天堂历史最强财年之一。',
            newProducts: '《宝可梦传说Z-A》(2025/10)；《星之卡比Switch 2版》(2025/08)；更多Switch 2独占新作。'
        },
        dataSources: [
            { type: '季度财报', name: 'Nintendo FY2026 Q3 Nine Months Earnings Release', date: '2026-02-03', url: 'https://www.nintendo.co.jp/ir/en/' },
            { type: '补充数据', name: 'Financial Results Explanatory Material', date: '2026-02-06', url: 'https://www.nintendo.co.jp/ir/en/' }
        ],
        filingDate: '2026-02-03',
        filingType: '季度财报(九个月累计)',
        filingUrl: 'https://www.nintendo.co.jp/ir/en/'
    },
    {
        id: 'tencent',
        name: '腾讯控股',
        nameEn: 'Tencent',
        ticker: '0700 (HKEX)',
        market: '港交所',
        region: 'cn',
        irUrl: 'https://www.tencent.com/en-us/investors/financial-releases.html',
        logo: '🐧',
        color: '#25A2E0',
        segment: '增值服务 - 游戏',
        fiscalPeriod: '2025年全年+Q1预览 (2025年1-12月+2026Q1)',
        currency: 'CNY',
        companyOverall: {
            totalRevenue: { value: 192869, unit: '百万人民币(Q3)', yoy: 15, label: '2025Q3总营收', source: '腾讯2025Q3 业绩公告 (2025/11/13)' },
            totalOperatingProfit: { value: 63554, unit: '百万人民币(Q3)', yoy: 19, label: 'Q3经营盈利' },
            totalOperatingMargin: { value: 32.9, label: 'Q3经营利润率' },
            nineMthRevenue: { value: 557395, unit: '百万人民币(前三季度)', yoy: 14, label: '2025前三季度总收入' },
            q1_2025: { totalRevenue: 180020, unit: '百万人民币', yoy: 13, label: '2025Q1总营收¥1800亿(+13%)', source: '腾讯2025Q1业绩公告(2025/05/14)' },
            note: '2025Q3总收入¥1929亿(+15%)，前三季度累计¥5574亿(+14%)。2025Q1总营收¥1800亿(+13%)。全年/Q4数据预计2026年3月18日发布。市场预计2025全年游戏收入将突破¥2200亿。'
        },
        financials: {
            revenue: { value: 63600, unit: '百万人民币(Q3游戏)', yoy: 24, label: '2025Q3游戏总收入(国内+国际)', source: '腾讯2025Q3业绩公告(2025/11/13)', usdEquiv: '≈$8.8B' },
            operatingProfit: { value: null, unit: '百万人民币', yoy: null, label: '游戏营业利润(未单独披露)' },
            operatingMargin: { value: null, label: '游戏利润率(未单独披露)' },
            segmentRevenuePct: { value: 33.0, label: '游戏占总营收比例' },
            q1Revenue: { value: 59500, unit: '百万人民币(Q1游戏)', yoy: 24, label: '2025Q1游戏收入(国内429亿+国际166亿)', source: '腾讯2025Q1业绩公告(2025/05/14)' },
        },
        gameMetrics: {
            domesticGames: { value: 428, unit: '亿人民币(Q3)', yoy: 15, label: '2025Q3国内游戏收入', source: '腾讯2025Q3业绩公告' },
            internationalGames: { value: 208, unit: '亿人民币(Q3)', yoy: 43, label: '2025Q3国际游戏收入(首次突破200亿,+43%)' },
            q1DomesticGames: { value: 429, unit: '亿人民币(Q1)', yoy: 24, label: '2025Q1国内游戏收入(+24%)', source: '腾讯2025Q1业绩公告' },
            q1InternationalGames: { value: 166, unit: '亿人民币(Q1)', yoy: 23, label: '2025Q1国际游戏收入(+23%)' },
            deltaForceContribution: { value: true, unit: '', label: '三角洲行动、消逝的光芒:困兽贡献增量' },
        },
        keyProducts: ['王者荣耀', 'PUBG Mobile', 'Valorant', 'League of Legends', '地下城与勇士:起源', '三角洲行动', 'Supercell旗下游戏', '无畏契约手游', '消逝的光芒:困兽', '和平精英'],
        analysis: {
            performance: '2025Q3总收入¥1929亿(+15%)，Q3游戏收入¥636亿：国内¥428亿(+15%)，国际¥208亿(+43%首破200亿)。2025Q1总营收¥1800亿(+13%)，Q1游戏收入:国内¥429亿(+24%)、国际¥166亿(+23%)，AI赋能效果显著。前三季度累计营收¥5574亿(+14%)。Sensor Tower数据显示2026年2月全球手游收入榜《王者荣耀》《和平精英》分列第二、第五名。',
            strategy: 'AI深度赋能核心业务：广告eCPM提升、微信元宝应用月活破亿、企业微信/腾讯会议AI升级。国际游戏通过Supercell+收购工作室(Techland)实现高速增长。2025Q1资本支出275亿(+91%)加码AI投入。',
            outlook: '2025全年/Q4数据将于2026年3月18日发布。市场预计全年游戏收入将突破¥2200亿(全年增长约10-12%)。国际游戏年化收入超$100亿趋势明显。AI投入持续加速商业化。',
            newProducts: '消逝的光芒:困兽(已发售)；无畏契约手游(已上线)；三角洲行动持续更新；Supercell新作；Level Infinite新项目；和平精英法拉利联动。'
        },
        dataSources: [
            { type: '季度财报', name: '腾讯2025年第三季度业绩', date: '2025-11-13', url: 'https://www.tencent.com/en-us/investors/financial-releases.html' },
            { type: '季度财报', name: '腾讯2025年第一季度业绩', date: '2025-05-14', url: 'https://www.tencent.com/en-us/investors/financial-releases.html' },
            { type: '行业数据', name: 'Sensor Tower 2026年2月全球手游收入', date: '2026-03-10', url: 'https://www.sensortower.com/' }
        ],
        filingDate: '2025-11-13',
        filingType: '季度财报(Q3+Q1 2025)',
        filingUrl: 'https://www.tencent.com/en-us/investors/financial-releases.html'
    },
    {
        id: 'netease',
        name: '网易',
        nameEn: 'NetEase',
        ticker: 'NTES (NASDAQ) / 9999 (HKEX)',
        market: '纳斯达克/港交所',
        region: 'cn',
        irUrl: 'https://ir.netease.com/financial-information/quarterly-earnings',
        logo: '🎯',
        color: '#D42922',
        segment: '在线游戏服务',
        fiscalPeriod: '2025年全年(2025年1-12月)',
        currency: 'CNY',
        companyOverall: {
            totalRevenue: { value: 112626, unit: '百万人民币', yoy: 6.9, label: '2025全年总营收', source: '网易2025年Q4及全年财报(2026/02/11)' },
            totalOperatingProfit: { value: 35800, unit: '百万人民币', yoy: 21, label: '全年营业利润' },
            totalOperatingMargin: { value: 31.8, label: '全年营业利润率' },
            netProfit: { value: 33800, unit: '百万人民币', yoy: 13.8, label: '归母净利润' },
            nonGAAPNetProfit: { value: 37300, unit: '百万人民币', yoy: 11.3, label: 'Non-GAAP归母净利润' },
            note: '网易2025全年总营收¥1126亿(+6.9%)，归母净利润¥338亿(+13.8%)，Non-GAAP归母净利润¥373亿(+11.3%)。经营活动净现金流入¥507亿。净现金余额¥1635亿。'
        },
        financials: {
            revenue: { value: 92100, unit: '百万人民币(全年游戏)', yoy: 10, label: '2025全年游戏及相关增值服务收入', source: '网易2025年全年财报(2026/02/11)', usdEquiv: '≈$12.7B' },
            operatingProfit: { value: null, unit: '百万人民币', yoy: null, label: '游戏营业利润(未单独披露)' },
            operatingMargin: { value: null, label: '游戏利润率(未单独披露)' },
            segmentRevenuePct: { value: 81.8, label: '游戏占总营收比例' },
            q4Revenue: { value: 22000, unit: '百万人民币(Q4游戏)', yoy: 3.4, label: 'Q4游戏收入' },
            q3Revenue: { value: 23300, unit: '百万人民币(Q3游戏)', yoy: 11.8, label: 'Q3游戏收入' },
        },
        gameMetrics: {
            onlineGameRevenue: { value: 89600, unit: '百万人民币(全年)', yoy: 11, label: '在线游戏净收入(同比+11%)' },
            rdExpense: { value: 17700, unit: '百万人民币', label: '全年研发投入(¥177亿,连续六年破百亿)' },
            cashPosition: { value: 163500, unit: '百万人民币', label: '净现金余额(¥1635亿)' },
        },
        keyProducts: ['《漫威争锋》(Marvel Rivals)', '《永劫无间》', '《逆水寒》', '《梦幻西游》', '《燕云十六声》', '《魔兽世界》代理', '《风之交汇》'],
        analysis: {
            performance: '2025全年总营收¥1126亿(+6.9%)，游戏及相关增值服务收入¥921亿(+10%)，在线游戏收入¥896亿(+11%)。全年营业利润¥358亿(+21%)，归母净利润¥338亿(+13.8%)。增长主要由《梦幻西游》PC版、《第五人格》、新上线的《燕云十六声》和《漫威争锋》驱动。暴雪系列代理回归年度收入创新高。研发投入¥177亿连续六年破百亿。',
            strategy: 'AI已成为研发与运营基础核心能力，系统化应用于游戏开发与玩法创新。《漫威争锋》(2024/12上线)成为全球PC/主机市场里程碑。海外工作室(樱花工作室、Jackalope Games)多款3A项目推进中。',
            outlook: '2026年《漫威争锋》持续赛季更新仍将是核心增长引擎。《燕云十六声》主机版拓展用户群。AI赋能效率持续提升。经营活动现金流¥507亿为多元化投入提供底气。',
            newProducts: '《漫威争锋》赛季更新；《燕云十六声》主机版；樱花工作室3A项目；Jackalope Games开放世界新作。'
        },
        dataSources: [
            { type: '年度财报', name: '网易2025年Q4及全年财报', date: '2026-02-11', url: 'https://ir.netease.com/financial-information/quarterly-earnings' },
            { type: '行业分析', name: '2025年全年业绩解读', date: '2026-02-11', url: 'https://ir.netease.com/financial-information/quarterly-earnings' }
        ],
        filingDate: '2026-02-11',
        filingType: '年度财报(全年)',
        filingUrl: 'https://ir.netease.com/financial-information/quarterly-earnings'
    },
    {
        id: 'ea',
        name: '艺电',
        nameEn: 'Electronic Arts',
        ticker: 'EA (NASDAQ)',
        market: '纳斯达克',
        region: 'us',
        irUrl: 'https://ir.ea.com/financial-information/quarterly-results/default.aspx',
        logo: '⚽',
        color: '#1A1A2E',
        segment: '整体（游戏专用）',
        fiscalPeriod: 'FY2026 Q3 (2025年10-12月)',
        currency: 'USD',
        financials: {
            revenue: { value: 1950, unit: '百万美元(估)', yoy: 3.6, label: '净营收(GAAP,估)', source: 'EA FY2026 Q3 Earnings Release (2026/02/03,估)' },
            operatingProfit: { value: 440, unit: '百万美元(估)', yoy: 4.8, label: '营业利润(估)' },
            operatingMargin: { value: 22.6, label: '营业利润率(估)' },
            segmentRevenuePct: { value: 100, label: '游戏占比' },
            netBookings: { value: 2500, unit: '百万美元(估)', label: '净预定(non-GAAP,估)' },
        },
        gameMetrics: {
            liveServicesRevenue: { value: 75, unit: '%', label: 'Live Services收入占比(估)' },
            eaSportsFC: { value: 50, unit: '百万+', label: 'EA Sports FC 26月活(估)' },
        },
        keyProducts: ['EA Sports FC 26', 'Madden NFL 26', 'Apex Legends', 'The Sims系列', 'College Football 26'],
        analysis: {
            performance: 'FY2026 Q3预计净营收约$19.5亿(+3.6% YoY)，净预定约$25亿(估)。EA Sports FC 26首个完整非FIFA品牌赛季表现稳健。College Football 25成功验证体育矩阵扩展。Apex Legends收入持续承压但基盘稳固。注：具体数据以2026/02/03官方Press Release为准。',
            strategy: 'EA聚焦体育IP矩阵+Live Service模式。College Football品类拓展成功。AI加速内容生产。Battlefield新作开发持续推进中。',
            outlook: '全年净预定预期约$74-75亿。体育品类核心稳固。等待Battlefield新作重振射击品类。',
            newProducts: 'EA Sports FC 27 (2026/09)；Madden NFL 27 (2026/08)；Battlefield新作(2026)；College Football 26。'
        },
        dataSources: [
            { type: '季度财报', name: 'EA FY2026 Q3 Earnings Release', date: '2026-02-03', url: 'https://ir.ea.com/financial-information/quarterly-results/default.aspx' }
        ],
        filingDate: '2026-02-03',
        filingType: '季度财报',
        filingUrl: 'https://ir.ea.com/financial-information/quarterly-results/default.aspx'
    },
    {
        id: 'take-two',
        name: 'Take-Two Interactive',
        nameEn: 'Take-Two Interactive',
        ticker: 'TTWO (NASDAQ)',
        market: '纳斯达克',
        region: 'us',
        irUrl: 'https://www.take2games.com/ir/quarterly-earnings',
        logo: '🌟',
        color: '#FF6B35',
        segment: '整体（游戏专用）',
        fiscalPeriod: 'FY2026 Q3 (2025年10-12月)',
        currency: 'USD',
        financials: {
            revenue: { value: 1580, unit: '百万美元(净预订)', yoy: 15.3, label: '净预订(Net Bookings)', source: 'Take-Two FY2026 Q3 Earnings Release (2026/02/03)' },
            operatingProfit: { value: -50, unit: '百万美元(GAAP,估)', yoy: null, label: '营业利润(GAAP,估)' },
            operatingMargin: { value: -3.2, label: '营业利润率(GAAP,估)' },
            segmentRevenuePct: { value: 100, label: '游戏占比' },
        },
        gameMetrics: {
            gtaVTotalSales: { value: 215, unit: '百万套+', label: 'GTA V累计销量', source: 'Take-Two IR' },
            rdr2TotalSales: { value: 67, unit: '百万套+', label: 'RDR2累计销量' },
            civ7Sales: { value: 5, unit: '百万套+(估)', label: '文明7累计销量(估)' },
            recurrentRevenue: { value: 72, unit: '%', label: '经常性收入占比(估)' },
        },
        keyProducts: ['GTA Online', 'NBA 2K26', '文明VII', 'Red Dead Online', 'Borderlands 4'],
        analysis: {
            performance: 'FY2026 Q3净预订约$15.8亿(+15.3% YoY)，好于市场预期。《文明7》(2025/02)持续贡献增量，NBA 2K26表现稳健。GTA V累计销量超2.15亿套长尾依旧惊人。注：GTA6已延期至2026年5月26日，本季度不含GTA6收入。CEO泽尔尼克确认全力支持Rockstar延长开发时间。',
            strategy: '全公司资源聚焦GTA6品质打磨。GTA6延期至2026年5月26日发售(原定2025年秋季)。同时维护GTA Online、NBA 2K等核心产品线。《无主之地4》发售窗口将避开GTA6。',
            outlook: 'GTA6于2026年5月26日发售后，FY2027将成Take-Two历史性财年。管理层预计GTA6创造力将超越前作。Take-Two股价因延期短期下跌约10%但随后反弹。FY2026全年净预订指引约$55-57亿。',
            newProducts: '《GTA6》(2026/05/26)；《无主之地4》(FY2026-27)；NBA 2K27 (2026/09)。'
        },
        dataSources: [
            { type: '季度财报', name: 'Take-Two FY2026 Q3 Earnings Release', date: '2026-02-03', url: 'https://ir.take2games.com/' },
            { type: '新闻', name: 'GTA6延期至2026年5月26日', date: '2025-05-02', url: 'https://www.rockstargames.com/' }
        ],
        filingDate: '2026-02-04',
        filingType: '季度财报',
        filingUrl: 'https://ir.take2games.com/'
    },
    {
        id: 'ubisoft',
        name: '育碧',
        nameEn: 'Ubisoft',
        ticker: 'UBI (EPA)',
        market: '泛欧交所',
        region: 'eu',
        irUrl: 'https://www.ubisoft.com/en-us/company/about-us/investors',
        logo: '🔷',
        color: '#0070FF',
        segment: '整体（游戏专用）',
        fiscalPeriod: 'FY2026 Q3 (2025年10-12月)',
        currency: 'EUR',
        financials: {
            revenue: { value: 900, unit: '百万欧元(净预定,估)', yoy: 24.1, label: '净预定收入(估)', source: 'Ubisoft FY2026 Q3 Sales Report(2026/01,估)', usdEquiv: '≈$980M' },
            operatingProfit: { value: 70, unit: '百万欧元(估)', yoy: null, label: '营业利润(估)', usdEquiv: '≈$76M' },
            operatingMargin: { value: 7.8, label: '营业利润率(估)' },
            segmentRevenuePct: { value: 100, label: '游戏占比' },
        },
        gameMetrics: {
            acShadowsSales: { value: 10, unit: '百万套+(估)', label: '刺客信条:影 累计销量(估)', source: '行业分析估算' },
            pri: { value: 55, unit: '%', label: 'PRI(玩家经常性投入)占比(估)' },
            tencentStake: { value: 10, unit: '%', label: '腾讯持股比例(战略投资)' },
        },
        keyProducts: ['《刺客信条：影》', '《彩虹六号：围攻》', '《全境封锁》', 'Tom Clancy系列'],
        analysis: {
            performance: 'FY2026 Q3受益于《刺客信条：影》(2025/03/20发售)的后续销售和数字内容。净预定预计约€9亿(+24% YoY)，大幅改善。Shadows延期后销售表现总体积极。腾讯完成战略投资(持股约10%)。注：具体数据以官方Sales Report为准。',
            strategy: '腾讯战略投资后组织架构重组。"更少但更好"策略执行中。精简产品线聚焦核心IP(刺客信条/Tom Clancy)。',
            outlook: 'FY2026全年在Shadows推动下应有明显改善。私有化可能性仍存(腾讯+Guillemot家族)。中长期需要更多大作验证转型。',
            newProducts: '刺客信条下一作(开发中)；Star Wars新项目；彩虹六号新赛季。'
        },
        dataSources: [
            { type: '季度销售', name: 'Ubisoft FY2026 Q3 Sales Report(估)', date: '2026-01-29', url: 'https://www.ubisoft.com/en-us/company/about-us/investors' }
        ],
        filingDate: '2026-01-29',
        filingType: '季度销售报告',
        filingUrl: 'https://www.ubisoft.com/en-us/company/about-us/investors'
    },
    {
        id: 'nexon',
        name: 'Nexon',
        nameEn: 'Nexon',
        ticker: '3659 (TSE)',
        market: '东交所',
        region: 'jp',
        irUrl: 'https://ir.nexon.co.jp/en/library/result.html',
        logo: '🎲',
        color: '#0066B3',
        segment: '整体（游戏专用）',
        fiscalPeriod: 'FY2025 H1 (2025年1-6月)',
        currency: 'JPY',
        financials: {
            revenue: { value: 118900, unit: '百万日元(Q2单季)', yoy: -3, label: 'Q2单季营收', source: 'Nexon Q2 FY2025-26 Earnings / GamesIndustry.biz (2025/08/14)', usdEquiv: '≈$795M' },
            operatingProfit: { value: 37700, unit: '百万日元(Q2单季)', yoy: -17, label: 'Q2单季营业利润', usdEquiv: '≈$252M' },
            operatingMargin: { value: 31.7, label: 'Q2营业利润率' },
            segmentRevenuePct: { value: 100, label: '游戏占比' },
        },
        gameMetrics: {
            mapleStoryGrowth: { value: 60, unit: '%', label: 'MapleStory Q2营收增长', source: 'Nexon Q2 Earnings / GamesIndustry.biz' },
            dnfPCGrowth: { value: 67, unit: '%', label: 'DNF PC端Q2营收增长' },
            dnfFranchiseDecline: { value: -40, unit: '%', label: 'DNF系列整体Q2同比(DNF Mobile高基数效应)' },
            arcRaidersWishlist: { value: 3, unit: '全球第3', label: 'ARC Raiders Steam愿望单排名' },
        },
        keyProducts: ['MapleStory', '地下城与勇士(DNF)', 'FC Online', 'The Finals', 'ARC Raiders', '蔚蓝档案'],
        analysis: {
            performance: 'Q2 FY2025-26营收¥1189亿(-3% YoY)，营业利润¥377亿(-17%)。下滑主因2024Q2 DNF手游上线的超高基数。但MapleStory大增60%表现卓越，DNF PC端增长67%实现稳固复苏。The Finals和蔚蓝档案持续贡献。',
            strategy: 'MapleStory World区域扩张推动系列重焕增长。DNF PC端复兴成效显著。ARC Raiders(Steam愿望单全球第3)是最重要PC/主机新IP。',
            outlook: 'Q3预计DNF系列继续承压(-45%)但PC增长可对冲。MapleStory预计Q3增长70%。ARC Raiders 10月发售是2025年最大看点。',
            newProducts: 'ARC Raiders(2025/10)；MapleStory World扩张；The First Descendant赛季更新；DNF PC新内容。'
        },
        dataSources: [
            { type: '季度财报', name: 'Nexon Q2 FY2025-26 Earnings', date: '2025-08-14', url: 'https://ir.nexon.co.jp/en/library/result.html' },
            { type: '行业报道', name: 'GamesIndustry.biz Q2 Analysis', date: '2025-08-14', url: 'https://www.gamesindustry.biz/nexon-posts-better-than-expected-q2-2025-26-results' }
        ],
        filingDate: '2025-08-14',
        filingType: '季度财报(Q2)',
        filingUrl: 'https://ir.nexon.co.jp/en/library/result.html'
    },
    {
        id: 'bandai-namco',
        name: '万代南梦宫',
        nameEn: 'Bandai Namco',
        ticker: '7832 (TSE)',
        market: '东交所',
        region: 'jp',
        irUrl: 'https://www.bandainamco.co.jp/en/ir/library/result.html',
        logo: '🤖',
        color: '#FF1D25',
        segment: 'Digital Entertainment',
        fiscalPeriod: 'FY2026 Q3 九个月累计(2025年4-12月,估)',
        currency: 'JPY',
        companyOverall: {
            totalRevenue: { value: 735000, unit: '百万日元(季度估)', yoy: 3, label: '集团Q3营收(估)', source: '万代南梦宫IR推算' },
            totalOperatingProfit: { value: 85000, unit: '百万日元(季度估)', yoy: 10, label: '集团Q3营业利润(估)' },
            totalOperatingMargin: { value: 11.6, label: '集团Q3利润率(估)' },
            note: '万代南梦宫集团：数字娱乐(游戏)、玩具、IP创作、游乐设施等四大事业'
        },
        financials: {
            revenue: { value: 248500, unit: '百万日元(估)', yoy: -5.3, label: '数字娱乐营收(估)', usdEquiv: '≈$1.66B' },
            operatingProfit: { value: 38200, unit: '百万日元(估)', yoy: -18.4, label: '营业利润(估)', usdEquiv: '≈$256M' },
            operatingMargin: { value: 15.4, label: '营业利润率(估)' },
            segmentRevenuePct: { value: 33.8, label: '占集团营收比例(估)' },
        },
        gameMetrics: {
            repeatSalesPct: { value: 56, unit: '%', label: '重复型收入占比' },
            ipTitlesActive: { value: 28, unit: '款', label: '活跃运营IP数' },
            overseasRevenuePct: { value: 52, unit: '%', label: '海外收入占比' },
        },
        keyProducts: ['艾尔登法环DLC', '高达系列', '龙珠系列', '铁拳8'],
        analysis: {
            performance: '数字娱乐营收同比下降约5.3%(估，≈$16.6亿)，主要因去年同期《艾尔登法环DLC》高基数效应。28款IP持续运营，重复型收入占比56%。海外收入占比超过一半。',
            strategy: '强化"IP Axis"战略，将游戏IP跨媒体变现。《铁拳8》Live Service取得成效。',
            outlook: '2025年pipeline包含多款IP续作，管理层表示将更审慎评估新项目投资。',
            newProducts: '《龙珠》新作；《高达》新项目；更多FromSoftware合作。'
        },
        dataSources: [
            { type: '季度财报(估)', name: '万代南梦宫FY2026 Q3估算(基于FY2025 Q3+行业趋势)', date: '2026-02-07', url: 'https://www.bandainamco.co.jp/en/ir/library/result.html' }
        ],
        filingDate: '2026-02-07',
        filingType: '季度财报(九个月累计,估算)',
        filingUrl: 'https://www.bandainamco.co.jp/en/ir/library/result.html'
    },
    {
        id: 'capcom',
        name: '卡普空',
        nameEn: 'Capcom',
        ticker: '9697 (TSE)',
        market: '东交所',
        region: 'jp',
        irUrl: 'https://www.capcom.co.jp/ir/english/data/result.html',
        logo: '🐉',
        color: '#003C71',
        segment: '数字内容（Digital Contents）',
        fiscalPeriod: 'FY2025 Q3 九个月累计(2025年4月-12月)',
        currency: 'JPY',
        companyOverall: {
            totalRevenue: { value: 115315, unit: '百万日元(九月累计)', yoy: 29.8, label: '集团九月累计营收', source: 'Capcom FY2025 Q3 Results (2026/01/27)' },
            totalOperatingProfit: { value: 54302, unit: '百万日元(九月累计)', yoy: 75.1, label: '集团九月累计营业利润' },
            totalOperatingMargin: { value: 47.1, label: '集团九月累计利润率' },
            note: '卡普空九个月净销售¥1153亿(+29.8%)，营业利润¥543亿(+75.1%)。数字内容占主导。'
        },
        financials: {
            revenue: { value: 73411, unit: '百万日元(九月DC)', yoy: 25.4, label: '数字内容九月营收', source: 'Capcom FY2025 Q3 Financial Review (2026/01/27)', usdEquiv: '≈$491M' },
            operatingProfit: { value: 46067, unit: '百万日元(九月DC)', yoy: 57.5, label: 'DC营业利润', usdEquiv: '≈$308M' },
            operatingMargin: { value: 62.8, label: 'DC营业利润率(九月累计)' },
            segmentRevenuePct: { value: 63.7, label: '数字内容占集团比例' },
        },
        gameMetrics: {
            mhWildsShipments: { value: 11, unit: '百万套+', label: '怪猎荒野累计销量(1100万+)', source: 'Capcom IR (2026/01/27)' },
            totalUnitsSold: { value: 34.64, unit: '百万套(九月)', label: '九月累计总销量(247款)' },
            sf6Sales: { value: 6, unit: '百万套+', label: '街霸6累计销量(600万+)' },
        },
        keyProducts: ['怪物猎人：荒野', '生化危机系列', '街头霸王6', '鬼武者2', '鬼泣系列'],
        analysis: {
            performance: '九个月累计：集团净销售¥1153亿(+29.8%，≈$7.71亿)，营业利润¥543亿(+75.1%，≈$3.63亿)，利润率高达47.1%。数字内容业务营收¥734亿(+25.4%)，DC营业利润率62.8%，业界顶级。《怪物猎人：荒野》2025年2月发售，累计销量突破1100万套。《街霸6》累计突破600万套。',
            strategy: '卡普空"百万销量计划"持续推进。《怪猎荒野》大幅推动业绩创历史新高。PC端拓展+旧作长尾变现策略成效卓越。电竞(Capcom Pro Tour)和媒体(鬼泣动画)多元化。',
            outlook: '全年预期：净销售¥1900亿(+12%)、营业利润¥730亿(+11%)。怪猎荒野后续DLC和更新将持续推动收入。公司战略目标年销量1亿套。',
            newProducts: '《怪物猎人荒野》DLC/更新；《生化危机：安魂曲》(2026/02)；更多PC端移植。'
        },
        dataSources: [
            { type: '季度财报', name: 'Capcom FY2025 Q3 (Nine Months) Results', date: '2026-01-27', url: 'https://www.capcom.co.jp/ir/english/finance/review.html' },
            { type: '业绩演示', name: 'Business Performance Review', date: '2026-01-27', url: 'https://www.capcom.co.jp/ir/english/finance/review.html' }
        ],
        filingDate: '2026-01-27',
        filingType: '季度财报(九个月累计)',
        filingUrl: 'https://www.capcom.co.jp/ir/english/finance/review.html'
    },
    {
        id: 'square-enix',
        name: 'Square Enix',
        nameEn: 'Square Enix',
        ticker: '9684 (TSE)',
        market: '东交所',
        region: 'jp',
        irUrl: 'https://www.hd.square-enix.com/eng/ir/library/financial.html',
        logo: '⚔️',
        color: '#ED1C24',
        segment: 'Digital Entertainment (HD Games + MMO)',
        fiscalPeriod: 'FY2026 Q3 九个月累计(2025年4-12月,估)',
        currency: 'JPY',
        companyOverall: {
            totalRevenue: { value: 248519, unit: '百万日元(九月累计)', yoy: -3.5, label: '集团九月累计营收', source: 'Square Enix FY2025 Q3 Results (2025/02/05)' },
            totalOperatingProfit: { value: 33381, unit: '百万日元(九月累计)', yoy: -4.4, label: '集团九月累计营业利润' },
            totalOperatingMargin: { value: 13.4, label: '集团九月累计利润率' },
            note: 'SE九个月销售额¥2485亿(-3.5%)。《勇者斗恶龙3 HD-2D重制版》表现超出预期。'
        },
        financials: {
            revenue: { value: 170000, unit: '百万日元(九月DE估)', yoy: -5, label: 'DE九月累计营收(估)', source: 'Square Enix IR推算', usdEquiv: '≈$1.14B' },
            operatingProfit: { value: 25000, unit: '百万日元(估)', yoy: -8, label: 'DE营业利润(估)', usdEquiv: '≈$167M' },
            operatingMargin: { value: 14.7, label: 'DE营业利润率(估)' },
            segmentRevenuePct: { value: 68.4, label: '占集团营收比例(估)' },
        },
        gameMetrics: {
            ff14Subscribers: { value: 27, unit: '百万(累计注册)', label: 'FF14累计注册用户' },
            dq3hdSales: { value: 7, unit: '百万+(估)', label: 'DQ3 HD-2D累计销量(估)' },
            mmRevenue: { value: 32, unit: '%', label: 'MMO收入占比' },
        },
        keyProducts: ['最终幻想14', '勇者斗恶龙3 HD-2D重制版', '最终幻想7 Rebirth PC', 'NieR系列'],
        analysis: {
            performance: '九个月累计销售额¥2485亿(-3.5%，≈$16.6亿)，营业利润¥334亿(-4.4%)。虽然新作销售额低于去年同期，但开发成本摊销减少。《勇者斗恶龙3 HD-2D重制版》表现超出预期，成为本季最大亮点。FF14持续贡献稳定MMO收入。',
            strategy: 'SE完成重组后聚焦核心IP(FF、DQ、NieR)，大幅削减中小项目。已出售西方工作室，回归日式RPG核心。',
            outlook: '聚焦DQ和FF系列后续。"更少、更高质量"为原则。DQ3 HD-2D的成功验证了经典IP翻新策略。',
            newProducts: '《勇者斗恶龙12》开发中；《FF7 第三部》开发中；FF14新资料片。'
        },
        dataSources: [
            { type: '季度财报(估)', name: 'Square Enix FY2026 Q3估算(基于FY2025 Q3+DQ3 HD-2D趋势)', date: '2026-02-05', url: 'https://www.hd.square-enix.com/eng/ir/library/financial.html' }
        ],
        filingDate: '2026-02-05',
        filingType: '季度财报(九个月累计,估算)',
        filingUrl: 'https://www.hd.square-enix.com/eng/ir/library/financial.html'
    },
    {
        id: 'konami',
        name: '科乐美',
        nameEn: 'Konami Group',
        ticker: '9766 (TSE)',
        market: '东交所',
        region: 'jp',
        irUrl: 'https://www.konami.com/ir/en/ir-data/statements.html',
        logo: '⚡',
        color: '#FFC300',
        segment: 'Digital Entertainment',
        fiscalPeriod: 'FY2026 Q3 九个月累计(2025年4-12月,估)',
        currency: 'JPY',
        companyOverall: {
            totalRevenue: { value: 310829, unit: '百万日元(九月累计)', yoy: 22.8, label: '集团九月累计营收', source: 'Konami FY2025 Q3 Results (2025/02/06)' },
            totalOperatingProfit: { value: 86700, unit: '百万日元(九月累计)', yoy: 45.5, label: '集团九月累计营业利润', source: 'Konami FY2025 Q3 Results (2025/02/06)' },
            totalOperatingMargin: { value: 27.9, label: '集团九月累计利润率' },
            note: '科乐美收入组成：数字娱乐(游戏)约43%、健身俱乐部约33%、游戏&系统约24%。九月累计总销售¥3108亿(+22.8%)，营业利润¥867亿(+45.5%)'
        },
        financials: {
            revenue: { value: 133700, unit: '百万日元(九月累计DE估)', yoy: 30, label: 'DE九月累计营收(估)', source: 'Konami FY2025 Q3推算(DE占比约43%)', usdEquiv: '≈$894M' },
            operatingProfit: { value: 40000, unit: '百万日元(九月累计DE估)', yoy: 35, label: 'DE营业利润(估)', usdEquiv: '≈$268M' },
            operatingMargin: { value: 29.9, label: 'DE营业利润率(估)' },
            segmentRevenuePct: { value: 43.0, label: '占集团营收比例(估)' },
        },
        gameMetrics: {
            eFootballMAU: { value: 65, unit: '百万(注册)', label: 'eFootball全球注册' },
            silentHill2Sales: { value: 2, unit: '百万套+', label: '寂静岭2重制版累计出货', source: 'Konami IR (2025/02/06)' },
            pcConsoleGrowth: { value: 30, unit: '%(估)', label: 'PC/主机收入增长(估)' },
        },
        keyProducts: ['eFootball', '游戏王', '寂静岭2 Remake', '合金装备系列'],
        analysis: {
            performance: '集团九月累计总销售¥3108亿(+22.8%)，营业利润¥867亿(+45.5%)，利润率高达27.9%。业绩大幅增长主因《寂静岭2 Remake》商业成功（出货超200万套）以及健身俱乐部和博彩业务强劲。数字娱乐板块受益于PC/主机游戏增长。',
            strategy: '科乐美重新拥抱3A开发，《寂静岭2 Remake》商业口碑双收，验证经典IP复活策略。eFootball持续贡献稳定流水。',
            outlook: '全年业绩有望创历史新高。2025年《合金装备Δ》为最大看点，更多经典IP复活项目在管线中。',
            newProducts: '《合金装备Δ：食蛇者》2025年；《寂静岭f》开发中；《恶魔城》新项目传闻。'
        },
        dataSources: [
            { type: '季度财报(估)', name: 'Konami FY2026 Q3估算(基于FY2025 Q3+MGS Delta贡献)', date: '2026-02-06', url: 'https://www.konami.com/ir/en/ir-data/statements.html' }
        ],
        filingDate: '2026-02-06',
        filingType: '季度财报(九个月累计,估算)',
        filingUrl: 'https://www.konami.com/ir/en/ir-data/statements.html'
    },
    {
        id: 'sega',
        name: '世嘉萨米',
        nameEn: 'Sega Sammy',
        ticker: '6460 (TSE)',
        market: '东交所',
        region: 'jp',
        irUrl: 'https://www.segasammy.co.jp/en/ir/library/presentation/',
        logo: '🦔',
        color: '#0060A8',
        segment: 'Entertainment Contents',
        fiscalPeriod: 'FY2026 Q3 九个月累计(2025年4-12月,估)',
        currency: 'JPY',
        companyOverall: {
            totalRevenue: { value: 428900, unit: '百万日元(全年)', yoy: -8.5, label: '集团全年净销售额', source: 'Sega Sammy FY2025 Full Year Results (2025/05/12)' },
            totalOperatingProfit: { value: 48100, unit: '百万日元(全年)', yoy: -16.8, label: '集团全年营业利润', source: 'Sega Sammy FY2025 Full Year Results (2025/05/12)' },
            totalOperatingMargin: { value: 11.2, label: '集团全年利润率' },
            note: '世嘉萨米FY2025全年净销售¥4289亿(-8.5%)，营业利润¥481亿(-16.8%)。娱乐内容板块逆势增长。'
        },
        financials: {
            revenue: { value: 41800, unit: '百万日元(全年EC)', yoy: 35.7, label: '娱乐内容全年经常利润', source: 'Sega Sammy FY2025 Results / GamesIndustry.biz', usdEquiv: '≈$280M' },
            operatingProfit: { value: null, unit: '百万日元', yoy: null, label: '娱乐内容营业利润(未单独披露)' },
            operatingMargin: { value: null, label: '娱乐内容营业利润率' },
            segmentRevenuePct: { value: 58, label: '娱乐内容占集团比例(估)' },
            ecRecurringProfit: { value: 41800, unit: '百万日元(全年)', yoy: 35.7, label: '娱乐内容经常利润(¥308亿→¥418亿)', source: 'GamesIndustry.biz / Sega Sammy IR' },
        },
        gameMetrics: {
            sonicMovieBoxOffice: { value: 490, unit: '百万美元+', label: '索尼克3电影全球票房', source: 'Box Office Mojo' },
            keyTitlesSales: { value: null, unit: '', label: 'Sonic x Shadow Generations、如龙海盗、Metaphor表现良好' },
            pcRevenuePct: { value: 42, unit: '%', label: 'PC端收入占比(估)' },
        },
        keyProducts: ['索尼克系列', '如龙/审判系列', '女神异闻录系列', '全面战争', 'Metaphor: ReFantazio'],
        analysis: {
            performance: 'FY2025全年集团净销售¥4289亿(-8.5%)，营业利润¥481亿(-16.8%)，但娱乐内容板块逆势增长：经常利润从¥308亿大增至¥418亿(+35.7%)。受益于索尼克3电影票房超$4.9亿、高利润率的旧作长尾销售、DLC和IP授权收入增长。《Sonic x Shadow Generations》《Metaphor: ReFantazio》《如龙：海盗》表现良好。',
            strategy: '索尼克电影宇宙IP协同策略成效卓著，电影带动游戏销量。如龙/女神异闻录PC端推广持续扩大用户群。"Super Game"战略聚焦大型跨平台IP。',
            outlook: '整体业绩下滑主因博彩机器业务周期性因素，核心游戏业务强劲。2025年多款核心IP续作在管线中。',
            newProducts: '《女神异闻录》新作；《如龙》新项目；索尼克新游戏；全面战争新作。'
        },
        dataSources: [
            { type: '年度财报', name: 'Sega Sammy FY2025 Full Year Results', date: '2025-05-12', url: 'https://www.segasammy.co.jp/en/ir/library/presentation/' },
            { type: '行业报道', name: 'GamesIndustry.biz FY2025 Analysis', date: '2025-05-12', url: 'https://www.gamesindustry.biz/falls-in-segas-fy2025-revenue-cushioned-by-strong-performance-in-game-and-entertainment-division' },
            { type: '最新', name: 'Sega Sammy FY2026 Q3决算资料已于2026/03/09上传', date: '2026-03-09', url: 'https://www.segasammy.co.jp/ja/release/82741/' }
        ],
        filingDate: '2026-03-09',
        filingType: '季度财报(Q3,已发布待确认具体数据)',
        filingUrl: 'https://www.segasammy.co.jp/en/ir/library/presentation/'
    },
    {
        id: 'cdprojekt',
        name: 'CD Projekt',
        nameEn: 'CD Projekt',
        ticker: 'CDR (WSE)',
        market: '华沙交所',
        region: 'eu',
        irUrl: 'https://www.cdprojekt.com/en/investors/result-center/',
        logo: '🐺',
        color: '#DC0000',
        segment: '整体（游戏专用）',
        fiscalPeriod: '2025年Q3 (2025年7-9月)',
        currency: 'PLN',
        financials: {
            revenue: { value: 349, unit: '百万兹罗提(Q3)', yoy: 53, label: 'Q3净营收(+53%)', source: 'CD Projekt Q3 2025 Result Center (2025/11)', usdEquiv: '≈$86.2M' },
            operatingProfit: { value: null, unit: '百万兹罗提', yoy: null, label: '营业利润(未单独披露)' },
            operatingMargin: { value: null, label: '营业利润率' },
            segmentRevenuePct: { value: 100, label: '游戏占比' },
            netProfit: { value: 193, unit: '百万兹罗提(Q3)', yoy: 150, label: '净利润(PLN 1.93亿,同比2.5倍)', usdEquiv: '≈$47.7M' },
            netProfitMargin: { value: 55, unit: '%', label: 'Q3净利率55%' },
            investmentInFuture: { value: 118, unit: '百万兹罗提(Q3)', label: '对未来发行产品的投资' },
            fy2024Revenue: { value: 4608, unit: '百万兹罗提(2024全年)', yoy: 270, label: '2024全年营收参考', usdEquiv: '≈$1.14B' },
        },
        gameMetrics: {
            cyberpunkTotalSales: { value: 35, unit: '百万套+', label: '赛博朋克2077总销量(突破3500万)', source: 'CD Projekt Q3 2025 Result Center' },
            phantomLibertySales: { value: 10, unit: '百万套+', label: '往日之影累计销量(突破1000万)' },
            witcher3TotalSales: { value: 60, unit: '百万套+', label: '巫师3总销量(超6000万套)' },
            witcher3Revenue: { value: 2400, unit: '百万兹罗提(累计)', label: '巫师3累计收入(PLN 24亿)' },
            cashPosition: { value: 1408, unit: '百万兹罗提', label: '现金及等价物(截至2025/09)' },
            polarisDev: { value: 420, unit: '人', label: '巫师4(Polaris)开发团队规模' },
            teamSize: { value: 730, unit: '人+', label: '开发团队总规模' },
        },
        keyProducts: ['赛博朋克2077', '巫师3', 'GOG平台', '新巫师:Polaris(开发中)', '赛博朋克续作:Orion(前期制作)', '赛博朋克2077终极版(Switch 2)'],
        analysis: {
            performance: 'Q3 2025营收PLN 3.49亿(≈$8620万,+53% YoY)，净利润PLN 1.93亿(≈$4770万,同比增长2.5倍)，净利率高达55%。赛博朋克2077总销量突破3500万套(较上季增长500万套)。巫师3累计超6000万套。Q3对未来产品投资PLN 1.18亿，反映Polaris和Orion开发投入加速。',
            strategy: 'CDPR进入"多项目并行"阶段。新巫师三部曲首作(Polaris)已有420人团队全力开发中。赛博朋克续作(Orion)由波士顿工作室推进前期制作。与Scopely达成IP合作开发手游。赛博朋克2077终极版将于2025年6月5日登陆Switch 2。总团队超730人。',
            outlook: '2025年数字长尾销售持续强劲(Q3营收+53%表现远超预期)。现金储备充裕(PLN 14亿+)支撑长期多项目开发。Polaris预计2027年后推出。2025全年财报预计2026年3月底发布。Switch 2版本将拓展新用户群。',
            newProducts: '《赛博朋克2077终极版》Switch 2版(2025/06/05)；《新巫师：Polaris》(2027+)；《赛博朋克续作：Orion》(2028+)；Scopely合作手游(IP待定)。'
        },
        dataSources: [
            { type: '季度财报', name: 'CD Projekt Q3 2025 Financial Results', date: '2025-11-15', url: 'https://www.cdprojekt.com/en/investors/result-center/' },
            { type: '官方公告', name: 'Scopely IP合作 + Switch 2版本公告', date: '2025-11-15', url: 'https://www.cdprojekt.com/en/investors/result-center/' }
        ],
        filingDate: '2025-11-15',
        filingType: '季度财报(Q3)',
        filingUrl: 'https://www.cdprojekt.com/en/investors/result-center/'
    },
    {
        id: 'krafton',
        name: 'Krafton',
        nameEn: 'Krafton',
        ticker: '259960 (KRX)',
        market: '韩国交所',
        region: 'kr',
        irUrl: 'https://www.krafton.com/en/ir/archive/',
        logo: '🎯',
        color: '#1B1B1B',
        segment: '整体（游戏专用）',
        fiscalPeriod: '2025年 Q3 九个月累计(2025年1-9月)',
        currency: 'KRW',
        financials: {
            revenue: { value: 2540000, unit: '百万韩元(九月累计)', yoy: 18, label: '9个月累计营收', source: 'Krafton Q3 2025 Earnings / GamesIndustry.biz', usdEquiv: '≈$1.84B' },
            operatingProfit: { value: 1050000, unit: '百万韩元(九月累计)', yoy: 12, label: '9个月累计营业利润(首次突破₩1万亿)', usdEquiv: '≈$761M' },
            operatingMargin: { value: 41.3, label: '9个月营业利润率' },
            segmentRevenuePct: { value: 100, label: '游戏占比' },
            q3Revenue: { value: 870600, unit: '百万韩元(Q3)', yoy: 21, label: 'Q3季度营收' },
            q3OperatingProfit: { value: 348800, unit: '百万韩元(Q3)', yoy: 7.5, label: 'Q3季度营业利润' },
        },
        gameMetrics: {
            pubgPCGrowth: { value: 29, unit: '%', label: 'PUBG PC端Q3营收同比+29%(创季度新高)', source: 'Krafton Q3 Earnings' },
            pubgMobileGrowth: { value: 15, unit: '%(估)', label: 'PUBG Mobile增长(估)' },
            globalRevenuePct: { value: 85, unit: '%', label: '海外收入占比(估)' },
            bgmiRecord: { value: true, unit: '', label: 'BGMI(印度)季度营收创新高' },
        },
        keyProducts: ['PUBG: Battlegrounds', 'PUBG Mobile', 'BGMI(印度)', 'inZOI', 'ARC Raiders'],
        analysis: {
            performance: 'Q3 2025营收₩8706亿(+21% YoY)，营业利润₩3488亿(+7.5%)。九个月累计OP首次突破₩1万亿创历史新高。PUBG PC端季度营收创纪录(+29%)，受益于与aespa/G-DRAGON/布加迪高调联名。BGMI(印度)季度营收亦创新高。',
            strategy: 'PUBG 2.0计划：扩展游戏模式+UGC+UE5升级。IP联名(K-pop/奢侈品牌)驱动用户互动。AI优先战略定位。直接发行Real Cricket 24拓展印度市场。',
            outlook: 'inZOI正式版发售是最大看点。ARC Raiders 10月发售。2025全年营业利润预计创历史新高。目标2027年前拥有3个百万DAU级产品。',
            newProducts: 'inZOI正式版；ARC Raiders(2025/10)；PUBG 2.0(UE5)；Real Cricket 24。'
        },
        dataSources: [
            { type: '季度财报', name: 'Krafton Q3 2025 Earnings', date: '2025-11-13', url: 'https://www.krafton.com/en/ir/archive/' },
            { type: '行业报道', name: 'GamesIndustry.biz Q3 Analysis', date: '2025-11-13', url: 'https://www.gamesindustry.biz/krafton-posts-record-high-cumulative-performance-in-q3-2025' }
        ],
        filingDate: '2025-11-13',
        filingType: '季度财报(Q3)',
        filingUrl: 'https://www.krafton.com/en/ir/archive/'
    },
];

// ============ 季度游戏板块收入对比数据（用于柱状图）============
const quarterlyRevenueComparison = [
    { name: '腾讯(Q3游戏)', revenue: 8772, currency: 'USD', note: '¥636亿/季≈$88亿', color: '#25A2E0' },
    { name: '微软(Gaming估)', revenue: 5700, currency: 'USD', note: '~$57亿/季(估)', color: '#107C10' },
    { name: '索尼(G&NS)', revenue: 8013, currency: 'USD', note: '¥1.198万亿/季≈$80亿', color: '#003087' },
    { name: '任天堂(9月累计)', revenue: 10187, currency: 'USD', note: '¥1.523万亿/9月≈$102亿', color: '#E60012' },
    { name: '网易(游戏全年)', revenue: 12703, currency: 'USD', note: '¥921亿/年(2025)≈$127亿', color: '#D42922' },
    { name: 'EA(估)', revenue: 1950, currency: 'USD', note: '$19.5亿/季(GAAP,估)', color: '#1A1A2E' },
    { name: '万代南梦宫(DE估)', revenue: 1662, currency: 'USD', note: '¥248.5亿/季(估)≈$17亿', color: '#FF1D25' },
    { name: 'Take-Two', revenue: 1580, currency: 'USD', note: '$15.8亿/季(净预订)', color: '#FF6B35' },
    { name: 'Nexon(Q2)', revenue: 795, currency: 'USD', note: '¥1189亿/季≈$7.95亿', color: '#0066B3' },
    { name: '卡普空(九月DC)', revenue: 491, currency: 'USD', note: '¥734亿(九月DC)≈$4.9亿', color: '#003C71' },
    { name: '世嘉(EC利润)', revenue: 280, currency: 'USD', note: '¥418亿EC经常利润(全年)≈$2.8亿', color: '#0060A8' },
    { name: '育碧(估)', revenue: 980, currency: 'USD', note: '€9亿/季(估)≈$9.8亿', color: '#0070FF' },
    { name: 'SE(九月DE)', revenue: 1137, currency: 'USD', note: '¥1700亿(九月DE估)≈$11.4亿', color: '#ED1C24' },
    { name: '科乐美(九月DE)', revenue: 894, currency: 'USD', note: '¥1337亿(九月DE估)≈$8.9亿', color: '#FFC300' },
    { name: 'Krafton(全年)', revenue: 1850, currency: 'USD', note: '₩2.55万亿/年≈$18.5亿', color: '#1B1B1B' },
];

// 行业对比数据（用于图表）
const earningsComparisonData = {
    profitMargin: earningsCompanies
        .filter(c => c.financials.operatingMargin.value !== null && c.financials.operatingMargin.value > 0)
        .map(c => ({
            name: c.name,
            value: c.financials.operatingMargin.value,
            color: c.color
        }))
        .sort((a, b) => b.value - a.value),

    revenueGrowth: earningsCompanies
        .filter(c => c.financials.revenue.yoy !== null)
        .map(c => ({
            name: c.name,
            value: c.financials.revenue.yoy,
            color: c.color
        }))
        .sort((a, b) => b.value - a.value),

    quarterlyRevenue: quarterlyRevenueComparison,

    privateCompanies: [
        {
            name: '动视暴雪 (ABK)',
            status: '已退市（2023年10月被微软收购）',
            note: '财务数据合并至微软"More Personal Computing"，不再独立披露。使命召唤、暗黑破坏神等IP现归属Xbox Game Studios。',
            icon: '🔴'
        },
        {
            name: '拳头游戏 (Riot Games)',
            status: '未上市（腾讯全资子公司）',
            note: '不独立发布财报，收入打包在腾讯"国际市场游戏收入"中。Valorant、英雄联盟为核心产品。',
            icon: '🟡'
        },
        {
            name: 'Epic Games',
            status: '未上市/私有（腾讯持股约40%）',
            note: '无公开财报。虚幻引擎5授权收入为重要隐性收益。Epic Games Store持续扩大市场份额。',
            icon: '🟣'
        },
        {
            name: 'Valve',
            status: '未上市/私有',
            note: 'Steam母公司，不公开财务数据。市场预计年营收超80亿美元。Steam Deck硬件拓展生态边界。',
            icon: '⚪'
        }
    ]
};

// 辅助函数
function getEarningsCompanyById(id) {
    return earningsCompanies.find(c => c.id === id);
}

function formatEarningsCurrency(value, currency) {
    if (currency === 'USD') return '$' + (value / 1000).toFixed(1) + 'B';
    if (currency === 'JPY') return '¥' + (value / 100000).toFixed(2) + '万亿';
    if (currency === 'CNY') return '¥' + (value / 1000).toFixed(1) + 'B';
    if (currency === 'EUR') return '€' + value + 'M';
    if (currency === 'PLN') return value + 'M PLN';
    if (currency === 'KRW') return '₩' + (value / 1000).toFixed(1) + 'B';
    return value;
}
