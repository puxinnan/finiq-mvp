// 现金流游戏卡牌事件池

export const EVENT_TYPES = {
  PAYCHECK: 'paycheck',
  DOODAD: 'doodad',
  SMALL_DEAL: 'small_deal',
  BIG_DEAL: 'big_deal',
  MARKET: 'market',
};

// 抽卡概率权重
export const EVENT_PROBABILITY = [
  ...Array(3).fill(EVENT_TYPES.PAYCHECK),    // 30% 发工资
  ...Array(3).fill(EVENT_TYPES.SMALL_DEAL),  // 30% 小生意
  ...Array(2).fill(EVENT_TYPES.DOODAD),      // 20% 额外支出
  ...Array(1).fill(EVENT_TYPES.MARKET),      // 10% 市场风云
  ...Array(1).fill(EVENT_TYPES.BIG_DEAL),    // 10% 大买卖
];

export const SMALL_DEALS = [
  {
    id: 'sd1',
    title: '股票大跌 (MYT4U)',
    description: '电子公司股票 MYT4U 今日大跌，仅售 $10/股。历史交易区间 $10 - $30。可以买入任意数量。',
    type: 'stock',
    symbol: 'MYT4U',
    price: 10,
    cashflow: 0
  },
  {
    id: 'sd2',
    title: '共同基金 (GRO4US)',
    description: '表现稳定的共同基金，现价 $20/股。历史交易区间 $10 - $30。',
    type: 'stock',
    symbol: 'GRO4US',
    price: 20,
    cashflow: 0
  },
  {
    id: 'sd3',
    title: '便宜的2室1厅公寓',
    description: '银行法拍屋。售价 $45,000，首付需要 $5,000。这套房子每月能产生 $150 的正向现金流。',
    type: 'real_estate',
    symbol: '2/1 房产',
    cost: 45000,
    downPayment: 5000,
    cashflow: 150
  },
  {
    id: 'sd4',
    title: '低价3室2厅首付',
    description: '房东急售！这套房子首付仅需 $3,000，虽然每月只产生 $100 现金流，但有很大的升值空间。',
    type: 'real_estate',
    symbol: '3/2 房产',
    cost: 50000,
    downPayment: 3000,
    cashflow: 100
  }
];

export const BIG_DEALS = [
  {
    id: 'bd1',
    title: '8户型公寓楼',
    description: '由于房东管理不善，这栋8户型公寓折价出售。总价 $120,000，首付需 $24,000。每月可产生 $800 现金流。',
    type: 'real_estate',
    symbol: '8户型公寓',
    cost: 120000,
    downPayment: 24000,
    cashflow: 800
  },
  {
    id: 'bd2',
    title: '自动洗车店待售',
    description: '一家成熟的自动洗车店寻找买家。要价 $150,000，首付需 $40,000。这门生意每月能带来稳定的 $1,500 现金流。',
    type: 'business',
    symbol: '洗车店',
    cost: 150000,
    downPayment: 40000,
    cashflow: 1500
  }
];

export const DOODADS = [
  { id: 'dd1', title: '换新手机', description: '抵挡不住诱惑，你买了一部最新款的智能手机。', cost: 1000 },
  { id: 'dd2', title: '朋友婚礼', description: '好朋友在外地结婚，你需要支付机票和份子钱。', cost: 800 },
  { id: 'dd3', title: '汽车维修', description: '你的车抛锚了，拖车和维修费让你大出血。', cost: 1500 },
  { id: 'dd4', title: '购买名牌包', description: '为了犒劳自己，你买了一个名牌包。', cost: 2000 },
  { id: 'dd5', title: '游艇派对', description: '你被邀请参加游艇派对，并为此购置了昂贵的行头。', cost: 500 }
];

export const MARKET_EVENTS = [
  {
    id: 'mk1',
    title: '股市大涨！MYT4U 暴涨',
    description: '由于财报超预期，MYT4U 股票价格暴涨至 $30/股。如果你持有，可以全部卖出！',
    type: 'sell_stock',
    symbol: 'MYT4U',
    sellPrice: 30
  },
  {
    id: 'mk2',
    title: '房地产繁荣',
    description: '随着大量人口涌入城市，房地产价格飙升！市场愿意以 $65,000 的价格收购任何 3室2厅 (3/2 房产)。',
    type: 'sell_real_estate',
    symbol: '3/2 房产',
    sellPrice: 65000
  },
  {
    id: 'mk3',
    title: '股市抛售！GRO4US 大跌',
    description: '共同基金 GRO4US 的经理被查，价格暴跌至 $10/股。你不能卖，但如果你有现金可以便宜买入（作为特殊事件，此处仅影响价格，本回合无操作）。',
    type: 'info_only',
  }
];
