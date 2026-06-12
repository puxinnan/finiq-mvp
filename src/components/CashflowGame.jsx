import React, { useState, useEffect } from 'react';
import { 
  EVENT_TYPES, EVENT_PROBABILITY, 
  SMALL_DEALS, BIG_DEALS, DOODADS, MARKET_EVENTS 
} from '../data/cashflowEvents';

const INITIAL_STATE = {
  profession: '程序员 (白领)',
  salary: 5000,
  cash: 2000,
  expenses: {
    taxes: 1000,
    mortgage: 800,
    carLoan: 200,
    creditCard: 150,
    bankLoanInterest: 0,
    other: 850
  },
  liabilities: {
    mortgage: 75000,
    carLoan: 6000,
    creditCard: 4000,
    bankLoan: 0
  },
  assets: {
    stocks: [],
    realEstate: [],
    businesses: []
  }
};

const CashflowGame = ({ onBack }) => {
  const [gameState, setGameState] = useState(JSON.parse(JSON.stringify(INITIAL_STATE)));
  const [currentEvent, setCurrentEvent] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isVictor, setIsVictor] = useState(false);

  // Derived Financials
  const passiveIncome = 
    gameState.assets.realEstate.reduce((sum, item) => sum + item.cashflow, 0) +
    gameState.assets.businesses.reduce((sum, item) => sum + item.cashflow, 0);
  
  const totalIncome = gameState.salary + passiveIncome;
  
  const totalExpenses = Object.values(gameState.expenses).reduce((a, b) => a + b, 0);
  const monthlyCashflow = totalIncome - totalExpenses;

  // Check victory condition
  useEffect(() => {
    if (passiveIncome > totalExpenses && !isVictor) {
      setIsVictor(true);
      addLog('🎉 恭喜！你的被动收入已经超过了总支出！你成功跳出了“老鼠赛跑”，实现了财务自由！');
    }
  }, [passiveIncome, totalExpenses, isVictor]);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const rollDice = () => {
    if (isVictor) return;
    
    // Pick random event type based on probability array
    const eventCategory = EVENT_PROBABILITY[Math.floor(Math.random() * EVENT_PROBABILITY.length)];
    
    let ev = { category: eventCategory };
    
    if (eventCategory === EVENT_TYPES.PAYCHECK) {
      ev.title = '发工资啦！ (Paycheck)';
      ev.description = `你经过了一个月的辛苦工作，结算了财务报表。现金 +$${monthlyCashflow}`;
    } else if (eventCategory === EVENT_TYPES.DOODAD) {
      const dd = DOODADS[Math.floor(Math.random() * DOODADS.length)];
      ev = { ...ev, ...dd };
    } else if (eventCategory === EVENT_TYPES.SMALL_DEAL) {
      const sd = SMALL_DEALS[Math.floor(Math.random() * SMALL_DEALS.length)];
      ev = { ...ev, ...sd };
    } else if (eventCategory === EVENT_TYPES.BIG_DEAL) {
      const bd = BIG_DEALS[Math.floor(Math.random() * BIG_DEALS.length)];
      ev = { ...ev, ...bd };
    } else if (eventCategory === EVENT_TYPES.MARKET) {
      const mk = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
      ev = { ...ev, ...mk };
    }

    setCurrentEvent(ev);
  };

  // --- Action Handlers ---
  const handleManualBankLoan = () => {
    const input = prompt("【银行贷款】\n输入正数借款，输入负数还款。\n要求：必须是 1000 的倍数，月利率为 10%！", "1000");
    if (!input) return;
    const amount = parseInt(input, 10);
    if (isNaN(amount) || amount % 1000 !== 0) {
      alert("借款或还款金额必须是 1000 的倍数！");
      return;
    }
    
    if (amount < 0 && gameState.cash < Math.abs(amount)) {
      alert("你手中的现金不够还款！");
      return;
    }
    if (amount < 0 && Math.abs(amount) > gameState.liabilities.bankLoan) {
      alert("还款金额不能大于你的银行欠款！");
      return;
    }

    setGameState(prev => {
      const newState = { ...prev, cash: prev.cash + amount };
      newState.liabilities = { ...prev.liabilities, bankLoan: prev.liabilities.bankLoan + amount };
      newState.expenses = { ...prev.expenses, bankLoanInterest: prev.expenses.bankLoanInterest + (amount * 0.1) };
      return newState;
    });

    if (amount > 0) {
      addLog(`主动向银行借款 $${amount}，每月利息支出增加 $${amount * 0.1}`);
    } else {
      addLog(`偿还银行贷款 $${Math.abs(amount)}，每月利息支出减少 $${Math.abs(amount) * 0.1}`);
    }
  };

  const handleAcceptPaycheck = () => {
    setGameState(prev => ({ ...prev, cash: prev.cash + monthlyCashflow }));
    addLog(`收到月度现金流: +$${monthlyCashflow}`);
    setCurrentEvent(null);
  };

  const handlePayDoodad = () => {
    setGameState(prev => {
      let newCash = prev.cash - currentEvent.cost;
      let newState = { ...prev, cash: newCash };
      
      // Auto-borrow if cash drops below zero
      if (newCash < 0) {
        const forcedLoan = Math.ceil(Math.abs(newCash) / 1000) * 1000;
        newState.cash += forcedLoan;
        newState.liabilities = { ...prev.liabilities, bankLoan: prev.liabilities.bankLoan + forcedLoan };
        newState.expenses = { ...prev.expenses, bankLoanInterest: prev.expenses.bankLoanInterest + (forcedLoan * 0.1) };
        alert(`警告！你的现金不足以支付这笔开销！系统已强制为你向银行借款 $${forcedLoan}，请注意下个月的利息支出！`);
        addLog(`资金不足，强制借款 $${forcedLoan} 支付额外开销`);
      }
      return newState;
    });
    addLog(`额外支出 [${currentEvent.title}]: -$${currentEvent.cost}`);
    setCurrentEvent(null);
  };

  const handleBuyAsset = () => {
    const cost = currentEvent.downPayment || currentEvent.cost || 0;
    if (gameState.cash < cost && currentEvent.type !== 'stock') {
      alert("现金不足！现实世界中你可以向银行借款，但 MVP 版本暂不支持高利贷。");
      return;
    }

    if (currentEvent.type === 'stock') {
      const qty = parseInt(prompt(`你要买多少股？(每股 $${currentEvent.price})`, "100") || "0", 10);
      const totalCost = qty * currentEvent.price;
      
      if (qty <= 0) return; // Cancelled or 0
      
      if (gameState.cash < totalCost) {
        alert("现金不足，无法买入这么多股票！");
        return;
      }

      setGameState(prev => {
        const newState = { ...prev, cash: prev.cash - totalCost };
        // Deep copy the stocks array to avoid mutating state directly
        newState.assets = { ...prev.assets, stocks: [...prev.assets.stocks] };
        
        // Find if already own this stock
        const existingStockIdx = newState.assets.stocks.findIndex(s => s.symbol === currentEvent.symbol);
        if (existingStockIdx >= 0) {
          newState.assets.stocks[existingStockIdx].qty += qty;
          // Weighted average cost basis could be calculated here, but for MVP we skip
        } else {
          newState.assets.stocks.push({ symbol: currentEvent.symbol, qty, costBasis: currentEvent.price });
        }
        return newState;
      });
      addLog(`买入 ${qty} 股 ${currentEvent.symbol}，花费 $${totalCost}`);
      setCurrentEvent(null);

    } else if (currentEvent.type === 'real_estate') {
      setGameState(prev => {
        const newState = { ...prev, cash: prev.cash - cost };
        newState.assets = { ...prev.assets, realEstate: [...prev.assets.realEstate] };
        newState.assets.realEstate.push({
          symbol: currentEvent.symbol,
          cost: currentEvent.cost,
          downPayment: currentEvent.downPayment,
          cashflow: currentEvent.cashflow
        });
        return newState;
      });
      addLog(`购入房地产 [${currentEvent.symbol}]，首付 $${cost}，月现金流 +$${currentEvent.cashflow}`);
      setCurrentEvent(null);

    } else if (currentEvent.type === 'business') {
      setGameState(prev => {
        const newState = { ...prev, cash: prev.cash - cost };
        newState.assets = { ...prev.assets, businesses: [...prev.assets.businesses] };
        newState.assets.businesses.push({
          symbol: currentEvent.symbol,
          cost: currentEvent.cost,
          downPayment: currentEvent.downPayment,
          cashflow: currentEvent.cashflow
        });
        return newState;
      });
      addLog(`购入企业 [${currentEvent.symbol}]，首付 $${cost}，月现金流 +$${currentEvent.cashflow}`);
      setCurrentEvent(null);
    }
  };

  const handleMarketEvent = () => {
    if (currentEvent.type === 'info_only') {
      addLog(`市场消息: ${currentEvent.title}`);
    } else if (currentEvent.type === 'sell_stock') {
      // Sell all stocks of this symbol
      setGameState(prev => {
        const newState = { ...prev };
        let totalGain = 0;
        newState.assets.stocks = prev.assets.stocks.filter(s => {
          if (s.symbol === currentEvent.symbol) {
            totalGain += s.qty * currentEvent.sellPrice;
            return false; // remove
          }
          return true; // keep
        });
        if (totalGain > 0) {
          newState.cash += totalGain;
          addLog(`卖出 ${currentEvent.symbol} 股票，获得现金 +$${totalGain}`);
        } else {
          addLog(`你没有持有 ${currentEvent.symbol} 股票，错过了一次市场机会。`);
        }
        return newState;
      });
    } else if (currentEvent.type === 'sell_real_estate') {
      // Sell all real estate of this symbol
      setGameState(prev => {
        const newState = { ...prev };
        let totalGain = 0;
        newState.assets.realEstate = prev.assets.realEstate.filter(r => {
          if (r.symbol === currentEvent.symbol) {
            // Gain = SellPrice - Mortgage (Cost - DownPayment)
            const mortgage = r.cost - r.downPayment;
            const cashReturn = currentEvent.sellPrice - mortgage;
            totalGain += cashReturn;
            return false; // remove
          }
          return true; // keep
        });
        if (totalGain > 0) {
          newState.cash += totalGain;
          addLog(`高价卖出房产 ${currentEvent.symbol}，扣除房贷后获得净现金 +$${totalGain}`);
        } else {
          addLog(`你没有符合要求的房产，错过了一次市场机会。`);
        }
        return newState;
      });
    }
    setCurrentEvent(null);
  };

  const handlePass = () => {
    addLog("你放弃了这次机会。");
    setCurrentEvent(null);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button className="btn btn-outline" onClick={onBack}>
          ← 退出模拟器
        </button>
        <button className="btn btn-outline" style={{ borderColor: '#f59e0b', color: '#f59e0b' }} onClick={handleManualBankLoan}>
          🏦 银行借贷 / 还款
        </button>
      </div>

      {isVictor && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--secondary-color)' }}>
          <h2 style={{ color: 'var(--secondary-color)', margin: 0 }}>🎉 你跳出了老鼠赛跑！进入了快车道！</h2>
          <p style={{ margin: '0.5rem 0 0 0' }}>你的被动收入 (${passiveIncome}) 已大于总支出 (${totalExpenses})。真正的财富自由！</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left Panel: Event Board */}
        <div style={{ flex: '1 1 400px' }}>
          <div className="glass-card" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {!currentEvent ? (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ marginBottom: '2rem' }}>准备好迎接下个月了吗？</h2>
                <button className="btn btn-primary" style={{ fontSize: '1.5rem', padding: '1rem 3rem' }} onClick={rollDice} disabled={isVictor}>
                  进入下个月 🎲
                </button>
              </div>
            ) : (
              <div className="animate-fade-in" style={{ width: '100%' }}>
                <div style={{
                  padding: '0.5rem 1rem', 
                  borderRadius: '4px',
                  display: 'inline-block',
                  marginBottom: '1rem',
                  fontWeight: 'bold',
                  backgroundColor: 
                    currentEvent.category === EVENT_TYPES.PAYCHECK ? '#10b981' :
                    currentEvent.category === EVENT_TYPES.DOODAD ? '#ef4444' :
                    currentEvent.category === EVENT_TYPES.MARKET ? '#3b82f6' : '#f59e0b',
                  color: 'white'
                }}>
                  {
                    currentEvent.category === EVENT_TYPES.PAYCHECK ? '发薪日' :
                    currentEvent.category === EVENT_TYPES.DOODAD ? '额外支出' :
                    currentEvent.category === EVENT_TYPES.MARKET ? '市场风云' : '投资机会'
                  }
                </div>
                
                <h2 style={{ marginBottom: '1rem' }}>{currentEvent.title}</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem', whiteSpace: 'pre-line' }}>{currentEvent.description}</p>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {currentEvent.category === EVENT_TYPES.PAYCHECK && (
                    <button className="btn btn-primary" onClick={handleAcceptPaycheck}>领取现金 +${monthlyCashflow}</button>
                  )}
                  {currentEvent.category === EVENT_TYPES.DOODAD && (
                    <button className="btn btn-secondary" style={{ backgroundColor: 'var(--danger-color)' }} onClick={handlePayDoodad}>心痛支付 -${currentEvent.cost}</button>
                  )}
                  {(currentEvent.category === EVENT_TYPES.SMALL_DEAL || currentEvent.category === EVENT_TYPES.BIG_DEAL) && (
                    <>
                      <button className="btn btn-primary" onClick={handleBuyAsset}>投资买入</button>
                      <button className="btn btn-outline" onClick={handlePass}>放弃机会</button>
                    </>
                  )}
                  {currentEvent.category === EVENT_TYPES.MARKET && (
                    <button className="btn btn-primary" onClick={handleMarketEvent}>查看我的资产并结算</button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="glass-card" style={{ marginTop: '2rem' }}>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>游戏日志</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' }}>
              {logs.map((log, i) => (
                <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {log}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Panel: Financial Statement */}
        <div style={{ flex: '1 1 500px' }}>
          <div className="glass-card">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--accent-color)' }}>个人财务报表</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>职业</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{gameState.profession}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>手中现金 (Cash)</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>${gameState.cash}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
              {/* Income / Expense */}
              <div style={{ flex: 1 }}>
                <h3 style={{ borderBottom: '1px solid var(--secondary-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>收入 (Income)</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>工资:</span> <span>${gameState.salary}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-color)', fontWeight: 'bold' }}><span>被动收入:</span> <span>${passiveIncome}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.2)', fontWeight: 'bold' }}><span>总收入:</span> <span>${totalIncome}</span></div>

                <h3 style={{ borderBottom: '1px solid var(--danger-color)', paddingBottom: '0.5rem', margin: '2rem 0 1rem 0' }}>支出 (Expenses)</h3>
                {Object.entries(gameState.expenses).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}><span>{k}:</span> <span>${v}</span></div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.2)', fontWeight: 'bold' }}><span>总支出:</span> <span>${totalExpenses}</span></div>

                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>月度净现金流 (Payday)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: monthlyCashflow > 0 ? 'var(--secondary-color)' : 'var(--danger-color)' }}>
                    ${monthlyCashflow}
                  </div>
                </div>
              </div>

              {/* Assets / Liabilities */}
              <div style={{ flex: 1 }}>
                <h3 style={{ borderBottom: '1px solid var(--secondary-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>资产 (Assets)</h3>
                {gameState.assets.stocks.length === 0 && gameState.assets.realEstate.length === 0 && gameState.assets.businesses.length === 0 && (
                  <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>暂无任何资产</div>
                )}
                {gameState.assets.stocks.map((s, i) => (
                  <div key={`s-${i}`} style={{ fontSize: '0.9rem' }}>• {s.symbol} ({s.qty}股)</div>
                ))}
                {gameState.assets.realEstate.map((r, i) => (
                  <div key={`r-${i}`} style={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>• {r.symbol}</span> <span style={{ color: 'var(--secondary-color)' }}>+${r.cashflow}</span>
                  </div>
                ))}
                {gameState.assets.businesses.map((b, i) => (
                  <div key={`b-${i}`} style={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>• {b.symbol}</span> <span style={{ color: 'var(--secondary-color)' }}>+${b.cashflow}</span>
                  </div>
                ))}

                <h3 style={{ borderBottom: '1px solid var(--danger-color)', paddingBottom: '0.5rem', margin: '2rem 0 1rem 0' }}>负债 (Liabilities)</h3>
                {Object.entries(gameState.liabilities).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}><span>{k}:</span> <span>${v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CashflowGame;
