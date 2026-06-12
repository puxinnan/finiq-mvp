// 现金流游戏卡牌事件池 (完美还原 Cashflow 101 经典卡牌)

export const EVENT_TYPES = {
  PAYCHECK: 'paycheck',
  SMALL_DEAL: 'small_deal',
  BIG_DEAL: 'big_deal',
  DOODAD: 'doodad',
  MARKET: 'market',
  BABY: 'baby',
  DOWNSIZED: 'downsized',
  CHARITY: 'charity'
};

// 抽卡概率权重
export const EVENT_PROBABILITY = [
  ...Array(15).fill(EVENT_TYPES.PAYCHECK),
  ...Array(15).fill(EVENT_TYPES.SMALL_DEAL),
  ...Array(10).fill(EVENT_TYPES.BIG_DEAL),
  ...Array(15).fill(EVENT_TYPES.DOODAD),
  ...Array(10).fill(EVENT_TYPES.MARKET),
  ...Array(4).fill(EVENT_TYPES.BABY),
  ...Array(3).fill(EVENT_TYPES.DOWNSIZED),
  ...Array(4).fill(EVENT_TYPES.CHARITY)
];

export const SMALL_DEALS = [
  { id: 'sd_myt_1', title: '电子公司股票大跌 (MYT4U)', description: '电子公司面临技术更新危机，股票 MYT4U 今日大跌，仅售 $10/股。历史交易区间 $10 - $30。可以买入任意数量。', type: 'stock', symbol: 'MYT4U', price: 10, cashflow: 0 },
  { id: 'sd_myt_2', title: '电子公司股票上涨 (MYT4U)', description: 'MYT4U 发布新产品线，股票受到追捧，现价 $30/股。历史交易区间 $10 - $30。', type: 'stock', symbol: 'MYT4U', price: 30, cashflow: 0 },
  { id: 'sd_myt_3', title: '电子公司股票平稳 (MYT4U)', description: 'MYT4U 业绩稳定，现价 $20/股。历史交易区间 $10 - $30。', type: 'stock', symbol: 'MYT4U', price: 20, cashflow: 0 },
  { id: 'sd_myt_4', title: '电子公司股票极度低迷 (MYT4U)', description: '极度恐慌！MYT4U 暴跌至 $5/股。历史交易区间 $10 - $30。这是难得的抄底机会！', type: 'stock', symbol: 'MYT4U', price: 5, cashflow: 0 },
  { id: 'sd_myt_5', title: '电子公司股票狂热 (MYT4U)', description: '市场狂热！MYT4U 被炒高至 $40/股。如果你手里有货，这可能是个卖点。', type: 'stock', symbol: 'MYT4U', price: 40, cashflow: 0 },
  { id: 'sd_ok_1', title: '医疗公司股票暴跌 (OK4U)', description: '新药研发受挫，OK4U 股票跌至 $5/股。历史交易区间 $5 - $40。', type: 'stock', symbol: 'OK4U', price: 5, cashflow: 0 },
  { id: 'sd_ok_2', title: '医疗公司股票大涨 (OK4U)', description: 'OK4U 获得专利批准，现价 $40/股。历史交易区间 $5 - $40。', type: 'stock', symbol: 'OK4U', price: 40, cashflow: 0 },
  { id: 'sd_ok_3', title: '医疗公司股票稳定 (OK4U)', description: 'OK4U 股价稳定在 $20/股。历史交易区间 $5 - $40。', type: 'stock', symbol: 'OK4U', price: 20, cashflow: 0 },
  { id: 'sd_gro_1', title: '稳健共同基金 (GRO4US)', description: '表现稳定的共同基金，现价 $10/股。历史交易区间 $10 - $30。适合保守型投资者。', type: 'stock', symbol: 'GRO4US', price: 10, cashflow: 0 },
  { id: 'sd_gro_2', title: '稳健共同基金 (GRO4US)', description: '表现稳定的共同基金，现价 $30/股。历史交易区间 $10 - $30。', type: 'stock', symbol: 'GRO4US', price: 30, cashflow: 0 },
  { id: 'sd_on_1', title: '创业公司股票 (ON2U)', description: '这家新公司被大肆炒作，目前价格 $10/股。历史交易区间 $10 - $30。', type: 'stock', symbol: 'ON2U', price: 10, cashflow: 0 },
  { id: 'sd_on_2', title: '创业公司股票 (ON2U)', description: '公司产品上市成功，现价 $30/股。历史交易区间 $10 - $30。', type: 'stock', symbol: 'ON2U', price: 30, cashflow: 0 },

  { id: 'sd_re_1', title: '便宜的 2室1厅 公寓', description: '银行法拍屋。售价 $45,000，首付仅需 $5,000。每月能产生 $150 的正向现金流。', type: 'real_estate', symbol: '2/1 房产', cost: 45000, downPayment: 5000, cashflow: 150 },
  { id: 'sd_re_2', title: '低价 3室2厅 首付', description: '房东急售！售价 $50,000，首付仅需 $3,000。每月产生 $100 现金流，升值潜力大。', type: 'real_estate', symbol: '3/2 房产', cost: 50000, downPayment: 3000, cashflow: 100 },
  { id: 'sd_re_3', title: '法拍 3室2厅', description: '被抵押的房子。售价 $35,000，首付需 $2,000。每月产生 $200 现金流。非常划算！', type: 'real_estate', symbol: '3/2 房产', cost: 35000, downPayment: 2000, cashflow: 200 },
  { id: 'sd_re_4', title: '破旧的 2室1厅', description: '房子需要大修。售价 $30,000，首付 $2,000。但目前租客不好，每月倒贴 -$100 现金流！', type: 'real_estate', symbol: '2/1 房产', cost: 30000, downPayment: 2000, cashflow: -100 },
  
  { id: 'sd_coin_1', title: '稀有金币', description: '一位老者急需用钱，想以 $500 的价格卖出他珍藏的稀有金币（市场估值 $2000）。没有任何现金流，纯博资本利得。', type: 'real_estate', symbol: '稀有金币', cost: 500, downPayment: 500, cashflow: 0 },
  { id: 'sd_land_1', title: '城市边缘的 10英亩 荒地', description: '城市正在向外扩建，这块荒地售价 $5,000，首付全款 $5,000。无现金流。', type: 'real_estate', symbol: '10英亩土地', cost: 5000, downPayment: 5000, cashflow: 0 },
];

export const BIG_DEALS = [
  { id: 'bd_apt_1', title: '破产的 8户型 公寓楼', description: '房东管理不善导致被银行清算。总价 $120,000，首付需 $24,000。接手后整理好租客，每月可产生 $800 正现金流。', type: 'real_estate', symbol: '8户型公寓', cost: 120000, downPayment: 24000, cashflow: 800 },
  { id: 'bd_apt_2', title: '豪华 8户型 公寓楼', description: '位于高档社区的精装公寓楼。总价 $200,000，首付需 $40,000。每月可产生 $1,200 现金流。', type: 'real_estate', symbol: '8户型公寓', cost: 200000, downPayment: 40000, cashflow: 1200 },
  { id: 'bd_apt_3', title: '4户型 公寓楼', description: '稳定的中产阶级住宅区公寓。总价 $100,000，首付需 $20,000。每月可产生 $600 现金流。', type: 'real_estate', symbol: '4户型公寓', cost: 100000, downPayment: 20000, cashflow: 600 },
  { id: 'bd_apt_4', title: '老旧的 12户型 公寓楼', description: '市中心边缘的老房子。总价 $180,000，首付需 $30,000。租金偏低，每月产生 $900 现金流。', type: 'real_estate', symbol: '12户型公寓', cost: 180000, downPayment: 30000, cashflow: 900 },
  { id: 'bd_apt_5', title: '大型 24户型 住宅群', description: '开发商急缺资金抛售资产。总价 $350,000，首付需 $50,000。这是一只现金牛，每月产生 $2,200 现金流。', type: 'real_estate', symbol: '24户型公寓', cost: 350000, downPayment: 50000, cashflow: 2200 },
  
  { id: 'bd_biz_1', title: '自动洗车店待售', description: '成熟的自动洗车店寻找买家，老板要退休了。要价 $150,000，首付需 $40,000。这门生意每月能带来稳定的 $1,500 现金流。', type: 'business', symbol: '洗车店', cost: 150000, downPayment: 40000, cashflow: 1500 },
  { id: 'bd_biz_2', title: '披萨加盟店', description: '知名的披萨连锁品牌加盟权转让。要价 $300,000，首付需 $50,000。每月现金流 $2,500。', type: 'business', symbol: '披萨店', cost: 300000, downPayment: 50000, cashflow: 2500 },
  { id: 'bd_biz_3', title: '自助洗衣房', description: '大学城附近的硬币自助洗衣房。要价 $250,000，首付需 $30,000。每月现金流 $1,200。', type: 'business', symbol: '洗衣房', cost: 250000, downPayment: 30000, cashflow: 1200 },
  { id: 'bd_biz_4', title: '私人诊所合伙人', description: '需要入股一家盈利的牙科诊所。总价 $150,000，首付需 $30,000。作为有限合伙人，每月分红 $1,000。', type: 'business', symbol: '诊所股份', cost: 150000, downPayment: 30000, cashflow: 1000 },
  { id: 'bd_biz_5', title: '小型仓储中心', description: '现代城市人杂物多，仓储中心生意火爆。总价 $500,000，首付 $100,000。每月带来惊人的 $4,000 现金流。', type: 'business', symbol: '仓储中心', cost: 500000, downPayment: 100000, cashflow: 4000 }
];

export const DOODADS = [
  { id: 'dd_1', title: '换新手机', description: '抵挡不住诱惑，你买了一部最新款的顶配智能手机。', cost: 1000 },
  { id: 'dd_2', title: '朋友婚礼', description: '好朋友在外地结婚，你需要支付高昂的机票、酒店住宿和份子钱。', cost: 800 },
  { id: 'dd_3', title: '汽车大修', description: '你的车在高速上抛锚了，拖车和更换发动机总成让你大出血。', cost: 1500 },
  { id: 'dd_4', title: '购买名牌包', description: '为了犒劳自己一年的辛苦，你刷信用卡买了一个限量版名牌包。', cost: 2000 },
  { id: 'dd_5', title: '游艇派对', description: '你被邀请参加富豪圈的游艇派对，并为此购置了极其昂贵的行头。', cost: 500 },
  { id: 'dd_6', title: '看牙医', description: '牙痛难忍！去做了两颗根管治疗加上烤瓷牙冠，保险居然不报销。', cost: 1200 },
  { id: 'dd_7', title: '换大屏幕电视', description: '为了看球赛，你买了一台 85寸 8K 索尼大电视。', cost: 1800 },
  { id: 'dd_8', title: '咖啡机发烧友', description: '为了在家喝上一口地道的意式浓缩，你花重金买了一台高端半自动咖啡机。', cost: 600 },
  { id: 'dd_9', title: '疯狂购物季', description: '双十一到了，你没控制住自己，清空了购物车。', cost: 1300 },
  { id: 'dd_10', title: '子女夏令营', description: '你的孩子非要参加为期一个月的欧洲游学夏令营。这笔钱你不得不出。', cost: 3000 },
  { id: 'dd_11', title: '高尔夫球具', description: '你认为打高尔夫能拓展人脉，于是花大价钱买了一套专业球杆。', cost: 1500 },
  { id: 'dd_12', title: '房屋漏水修缮', description: '你自住的房屋水管爆裂，淹了地板，维修费极其高昂。', cost: 2500 }
];

export const MARKET_EVENTS = [
  { id: 'mk_1', title: '股市大涨！MYT4U 暴涨', description: '由于财报超预期，MYT4U 股票价格暴涨至 $40/股。如果你持有，可以全部卖出大赚一笔！', type: 'sell_stock', symbol: 'MYT4U', sellPrice: 40 },
  { id: 'mk_2', title: '股市大涨！OK4U 暴涨', description: '医疗公司新药研发取得重大突破！OK4U 股票价格暴涨至 $50/股。如果你持有，赶紧抛售！', type: 'sell_stock', symbol: 'OK4U', sellPrice: 50 },
  { id: 'mk_3', title: '股市大涨！ON2U 暴涨', description: '创业公司被科技巨头收购！ON2U 股票价格暴涨至 $40/股。套现的时机到了！', type: 'sell_stock', symbol: 'ON2U', sellPrice: 40 },
  
  { id: 'mk_4', title: '房地产繁荣：求购 3/2 房产', description: '随着大量外来人口涌入，房地产价格飙升！市场上有买家愿意以 $65,000 的价格收购任何 3室2厅 (3/2 房产)。如果你手里有，并且愿意卖，你可以用 $65k 减去你的贷款(cost - downPayment)，获得大量现金。', type: 'sell_real_estate', symbol: '3/2 房产', sellPrice: 65000 },
  { id: 'mk_5', title: '房地产繁荣：求购 2/1 房产', description: '年轻人开始热衷于购买小型公寓。买家出价 $55,000 收购任何 2室1厅 (2/1 房产)。', type: 'sell_real_estate', symbol: '2/1 房产', sellPrice: 55000 },
  { id: 'mk_6', title: '房地产繁荣：求购 4户型公寓', description: '大型基金正在收购多户型住宅。买家出价 $140,000 收购 4户型公寓。', type: 'sell_real_estate', symbol: '4户型公寓', sellPrice: 140000 },
  { id: 'mk_7', title: '房地产繁荣：求购 8户型公寓', description: '市场对多户型公寓需求旺盛。买家出价 $240,000 收购 8户型公寓。这可能是一笔巨额回报！', type: 'sell_real_estate', symbol: '8户型公寓', sellPrice: 240000 },
  
  { id: 'mk_8', title: '股票拆分：MYT4U 1拆2', description: 'MYT4U 股票宣布 1拆2。如果你持有该股票，你的股数将翻倍！（此为特殊市场事件，暂不支持自动拆分计算，你可以将此视为利好新闻）', type: 'info_only' },
  { id: 'mk_9', title: '房地产崩盘！', description: '利率飙升，房地产泡沫破裂！大量房产沦为负资产。银行收紧贷款。（此为环境新闻，你无需操作）', type: 'info_only' },
  { id: 'mk_10', title: '通货膨胀加剧', description: '央行疯狂印钞，物价飞涨。持有现金的人正在隐性亏损，而拥有房产和企业的人正在暗中获利。（此为环境新闻，你无需操作）', type: 'info_only' }
];
