import React, { useState, useEffect } from 'react';
import { 
  EVENT_TYPES, EVENT_PROBABILITY, 
  SMALL_DEALS, BIG_DEALS, DOODADS, MARKET_EVENTS 
} from '../data/cashflowEvents';
import { PROFESSIONS } from '../data/professions';

const CashflowGame = ({ onBack }) => {
  const [gameState, setGameState] = useState(() => {
    const randomProf = PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)];
    return {
      profession: randomProf.profession,
      salary: randomProf.salary,
      cash: randomProf.savings,
      childrenCount: 0,
      perChildExpense: randomProf.perChildExpense,
      expenses: { ...randomProf.expenses },
      liabilities: { ...randomProf.liabilities },
      assets: {
        stocks: [],
        realEstate: [],
        businesses: []
      }
    };
  });
  
  const [currentEvent, setCurrentEvent] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isVictor, setIsVictor] = useState(false);
  
  // Special Rule States
  const [downsizedTurns, setDownsizedTurns] = useState(0);
  const [charityTurns, setCharityTurns] = useState(0);
  const [charityOptions, setCharityOptions] = useState(null);
  
  // Drag and Drop States
  const [dragTokens, setDragTokens] = useState([]);
  const [dragOverZone, setDragOverZone] = useState(null);

  // Derived Financials
  const passiveIncome = 
    gameState.assets.realEstate.reduce((sum, item) => sum + item.cashflow, 0) +
    gameState.assets.businesses.reduce((sum, item) => sum + item.cashflow, 0);
  
  const totalIncome = gameState.salary + passiveIncome;
  
  const totalExpenses = Object.values(gameState.expenses).reduce((a, b) => a + b, 0);
  const monthlyCashflow = totalIncome - totalExpenses;

  // Check victory condition
  useEffect(() => {
    // Only check victory when not in the middle of a transaction
    if (dragTokens.length === 0) {
      if (passiveIncome > totalExpenses && !isVictor) {
        setIsVictor(true);
        addLog('🎉 恭喜！你的被动收入已经超过了总支出！你成功跳出了“老鼠赛跑”，实现了财务自由！');
      } else if (passiveIncome <= totalExpenses && isVictor) {
        setIsVictor(false); // 跌回老鼠赛跑
      }
    }
  }, [passiveIncome, totalExpenses, isVictor, dragTokens.length]);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const generateRandomEvent = () => {
    const eventCategory = EVENT_PROBABILITY[Math.floor(Math.random() * EVENT_PROBABILITY.length)];
    let ev = { category: eventCategory };
    
    if (eventCategory === EVENT_TYPES.PAYCHECK) {
      ev.title = '发工资啦！ (Paycheck)';
      ev.description = `你经过了一个月的辛苦工作，结算了财务报表。工资结余现金流：+$${monthlyCashflow}`;
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
    } else if (eventCategory === EVENT_TYPES.BABY) {
      ev.title = '恭喜！喜得贵子 (Baby)';
      ev.description = `你迎来了一个新生命！但这同样意味着一笔不小的开支。\n每个孩子的额外开支：$${gameState.perChildExpense}/月。\n（最多拥有3个孩子，超过3个则不再增加费用）`;
    } else if (eventCategory === EVENT_TYPES.DOWNSIZED) {
      ev.title = '公司裁员！失业了 (Downsized)';
      ev.description = `经济不景气，你被公司裁员了。\n1. 你必须支付等同于【当前总支出】的现金（$${totalExpenses}）。\n2. 你将强制停赛 2 轮（跳过接下来的2个月）。`;
      ev.cost = totalExpenses;
    } else if (eventCategory === EVENT_TYPES.CHARITY) {
      ev.title = '做慈善 (Charity)';
      const charityCost = Math.ceil(totalIncome * 0.1);
      ev.description = `捐赠总收入的 10%（$${charityCost}）给需要帮助的人。\n好人有好报：在接下来的 3 个月里，你可以每次抽取 2 张机会卡并任选其一！`;
      ev.cost = charityCost;
    }
    return ev;
  };

  const rollDice = () => {
    if (isVictor) return;

    if (downsizedTurns > 0) {
       setDownsizedTurns(prev => prev - 1);
       addLog(`你因为失业正在停赛，本月跳过。剩余停赛期: ${downsizedTurns - 1}个月`);
       alert(`由于失业，你本月无法进行任何行动！停赛还剩 ${downsizedTurns - 1} 个月。`);
       return;
    }

    if (charityTurns > 0) {
       const ev1 = generateRandomEvent();
       const ev2 = generateRandomEvent();
       setCharityOptions([ev1, ev2]);
       setCharityTurns(prev => prev - 1);
       addLog(`【慈善庇护】剩余 ${charityTurns - 1} 个月，你获得了抽两张卡二选一的特权！`);
       return;
    }

    const ev = generateRandomEvent();
    setCurrentEvent(ev);
    setDragTokens([]);
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

  // --- Initiation Handlers (Generates Drag Tokens) ---
  const handleInitiatePaycheck = () => {
    setDragTokens([{ id: `t_paycheck_${Date.now()}`, label: `领工资净现金流 +$${monthlyCashflow}`, targetZone: 'zone-cash', value: monthlyCashflow }]);
  };

  const handleInitiateDoodad = () => {
    setDragTokens([{ id: `t_doodad_${Date.now()}`, label: `支付开销 -$${currentEvent.cost}`, targetZone: 'zone-cash', value: -currentEvent.cost }]);
  };

  const handleInitiateBaby = () => {
    if (gameState.childrenCount >= 3) {
      alert("您已经有 3 个孩子了！符合原版游戏设定，超过 3 个孩子不再增加支出。");
      setCurrentEvent(null);
      return;
    }
    setDragTokens([{ id: `t_baby_${Date.now()}`, label: `新增抚养费支出 +$${gameState.perChildExpense}`, targetZone: 'zone-expenses', field: 'childExpense', value: gameState.perChildExpense }]);
  };

  const handleInitiateDownsized = () => {
    setDragTokens([{ id: `t_downsized_${Date.now()}`, label: `支付失业遣散期生活费 -$${totalExpenses}`, targetZone: 'zone-cash', value: -totalExpenses }]);
  };

  const handleInitiateCharity = () => {
    setDragTokens([{ id: `t_charity_${Date.now()}`, label: `慈善捐赠 -$${currentEvent.cost}`, targetZone: 'zone-cash', value: -currentEvent.cost }]);
  };

  const handleInitiateBuyAsset = () => {
    if (currentEvent.type === 'stock') {
      const qty = parseInt(prompt(`你要买多少股？(每股 $${currentEvent.price})`, "100") || "0", 10);
      if (qty <= 0) return;
      const totalCost = qty * currentEvent.price;
      
      setDragTokens([
        { id: `t_stock_cost_${Date.now()}`, label: `买股票扣款 -$${totalCost}`, targetZone: 'zone-cash', value: -totalCost },
        { id: `t_stock_asset_${Date.now()}`, label: `新增股票 [${qty}股 ${currentEvent.symbol}]`, targetZone: 'zone-assets', item: { type: 'stock', symbol: currentEvent.symbol, qty, costBasis: currentEvent.price } }
      ]);
    } else {
      const cost = currentEvent.downPayment || currentEvent.cost || 0;
      const mortgage = currentEvent.cost - currentEvent.downPayment;
      const tokens = [];
      tokens.push({ id: `t_downPayment_${Date.now()}`, label: `支付首付 -$${cost}`, targetZone: 'zone-cash', value: -cost });
      tokens.push({ id: `t_asset_${Date.now()}`, label: `增加资产 [${currentEvent.symbol}]`, targetZone: 'zone-assets', item: currentEvent });
      if (mortgage > 0) {
        tokens.push({ id: `t_mortgage_${Date.now()}`, label: `背负贷款 +$${mortgage}`, targetZone: 'zone-liabilities', field: 'mortgage', value: mortgage });
      }
      if (currentEvent.cashflow !== 0) {
        tokens.push({ id: `t_cashflow_${Date.now()}`, label: `增加被动收入 +$${currentEvent.cashflow}`, targetZone: 'zone-income', value: currentEvent.cashflow });
      }
      setDragTokens(tokens);
    }
  };

  const handleInitiateMarket = () => {
    if (currentEvent.type === 'info_only') {
      addLog(`市场消息: ${currentEvent.title}`);
      setCurrentEvent(null);
    } else if (currentEvent.type === 'sell_stock') {
      let totalGain = 0;
      const stocksToSell = gameState.assets.stocks.filter(s => s.symbol === currentEvent.symbol);
      stocksToSell.forEach(s => { totalGain += s.qty * currentEvent.sellPrice; });

      if (totalGain > 0) {
        setDragTokens([
          { id: `t_sell_stock_cash_${Date.now()}`, label: `卖出股票套现 +$${totalGain}`, targetZone: 'zone-cash', value: totalGain },
          { id: `t_remove_stock_asset_${Date.now()}`, label: `注销股票资产 [${currentEvent.symbol}]`, targetZone: 'zone-assets', removeType: 'stock', removeSymbol: currentEvent.symbol }
        ]);
      } else {
        alert("你没有该股票！");
        setCurrentEvent(null);
      }
    } else if (currentEvent.type === 'sell_real_estate') {
      const reToSell = gameState.assets.realEstate.find(r => r.symbol === currentEvent.symbol) || 
                       gameState.assets.businesses.find(b => b.symbol === currentEvent.symbol);
      if (reToSell) {
        const mortgage = reToSell.cost - reToSell.downPayment;
        const gain = currentEvent.sellPrice - mortgage;
        const tokens = [];
        tokens.push({ id: `t_sell_re_cash_${Date.now()}`, label: `房产净收入 +$${gain}`, targetZone: 'zone-cash', value: gain });
        tokens.push({ id: `t_remove_re_asset_${Date.now()}`, label: `注销房产 [${currentEvent.symbol}]`, targetZone: 'zone-assets', removeType: 'real_estate', removeSymbol: currentEvent.symbol });
        if (mortgage > 0) {
          tokens.push({ id: `t_remove_mortgage_${Date.now()}`, label: `结清房贷 -$${mortgage}`, targetZone: 'zone-liabilities', field: 'mortgage', value: -mortgage });
        }
        if (reToSell.cashflow !== 0) {
          tokens.push({ id: `t_remove_cashflow_${Date.now()}`, label: `减去原现金流 -$${reToSell.cashflow}`, targetZone: 'zone-income', value: -reToSell.cashflow });
        }
        setDragTokens(tokens);
      } else {
        alert("你没有符合条件的房产！");
        setCurrentEvent(null);
      }
    }
  };

  const handlePass = () => {
    addLog("你放弃了这次机会。");
    setCurrentEvent(null);
  };

  // --- Drag & Drop Core Logic ---
  const handleDrop = (e, dropZone) => {
    e.preventDefault();
    setDragOverZone(null);
    
    const tokenId = e.dataTransfer.getData("text/plain");
    const token = dragTokens.find(t => t.id === tokenId);
    
    if (!token) return;
    
    if (token.targetZone !== dropZone) {
      alert(`错了！【${token.label}】不能放在这里，请阅读原版游戏规则仔细思考！`);
      return;
    }
    
    let newTokens = [];
    
    setGameState(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      
      if (dropZone === 'zone-cash') {
         newState.cash += token.value;
         if (newState.cash < 0) {
             const shortfall = Math.abs(newState.cash);
             const forcedLoan = Math.ceil(shortfall / 1000) * 1000;
             const ts = Date.now();
             newTokens.push({ id: `t_loan_${ts}`, label: `填补窟窿借款 +$${forcedLoan}`, targetZone: 'zone-cash', value: forcedLoan });
             newTokens.push({ id: `t_loan_liab_${ts}`, label: `新增银行贷款 +$${forcedLoan}`, targetZone: 'zone-liabilities', field: 'bankLoan', value: forcedLoan });
             newTokens.push({ id: `t_loan_exp_${ts}`, label: `新增利息支出 +$${forcedLoan * 0.1}`, targetZone: 'zone-expenses', field: 'bankLoanInterest', value: forcedLoan * 0.1 });
             setTimeout(() => alert(`现金不足！系统已为你生成了银行贷款账单，请继续将贷款代币拖入对应报表！`), 100);
         }
      } else if (dropZone === 'zone-assets') {
         if (token.item) {
            if (token.item.type === 'stock') {
               const existing = newState.assets.stocks.find(s => s.symbol === token.item.symbol);
               if (existing) existing.qty += token.item.qty;
               else newState.assets.stocks.push(token.item);
            } else if (token.item.type === 'business') {
               newState.assets.businesses.push(token.item);
            } else {
               newState.assets.realEstate.push(token.item);
            }
         } else if (token.removeSymbol) {
            if (token.removeType === 'stock') {
               newState.assets.stocks = newState.assets.stocks.filter(r => r.symbol !== token.removeSymbol);
            } else {
               let removed = false;
               newState.assets.realEstate = newState.assets.realEstate.filter(r => {
                 if (!removed && r.symbol === token.removeSymbol) {
                   removed = true;
                   return false; 
                 }
                 return true;
               });
               if (!removed) {
                 newState.assets.businesses = newState.assets.businesses.filter(r => {
                   if (!removed && r.symbol === token.removeSymbol) {
                     removed = true;
                     return false;
                   }
                   return true;
                 });
               }
            }
         }
      } else if (dropZone === 'zone-liabilities') {
         if (token.field) {
            newState.liabilities[token.field] = (newState.liabilities[token.field] || 0) + token.value;
         }
      } else if (dropZone === 'zone-income') {
         // Passive income is derived dynamically. No state mutation needed.
      } else if (dropZone === 'zone-expenses') {
         if (token.field) {
            newState.expenses[token.field] = (newState.expenses[token.field] || 0) + token.value;
            if (token.field === 'childExpense') {
              newState.childrenCount += 1;
            }
         }
      }
      return newState;
    });
    
    setDragTokens(prev => {
      const remaining = prev.filter(t => t.id !== token.id);
      const finalTokens = [...remaining, ...newTokens];
      if (finalTokens.length === 0) {
         addLog(`账单处理完成: ${currentEvent.title}`);
         
         if (currentEvent.category === EVENT_TYPES.DOWNSIZED) {
            setDownsizedTurns(2);
            setTimeout(() => alert("由于失业，接下来的 2 个月你将被强制跳过！"), 500);
         } else if (currentEvent.category === EVENT_TYPES.CHARITY) {
            setCharityTurns(3);
            setTimeout(() => alert("感谢你的善举！接下来的 3 个月，你每次都能获得抽两张卡并二选一的特权！"), 500);
         }

         setTimeout(() => setCurrentEvent(null), 500);
      }
      return finalTokens;
    });
  };

  const DropZone = ({ zoneId, title, children }) => (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOverZone(zoneId); }}
      onDragLeave={() => setDragOverZone(null)}
      onDrop={(e) => handleDrop(e, zoneId)}
      style={{
        border: `2px dashed ${dragOverZone === zoneId ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
        backgroundColor: dragOverZone === zoneId ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        transition: 'all 0.2s',
        minHeight: '100px'
      }}
    >
      <h3 style={{ borderBottom: '1px solid var(--secondary-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{title}</h3>
      {children}
    </div>
  );

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
            {charityOptions ? (
              <div className="animate-fade-in" style={{ width: '100%' }}>
                <h2 style={{ marginBottom: '1rem', color: '#10b981' }}>【慈善特权】抽卡二选一</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {charityOptions.map((ev, i) => (
                     <div key={i} className="glass-card" style={{ cursor: 'pointer', border: '2px solid rgba(255,255,255,0.2)' }} onClick={() => { setCurrentEvent(ev); setCharityOptions(null); setDragTokens([]); }}>
                       <div style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '0.5rem' }}>{ev.title}</div>
                       <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-line', margin: 0 }}>{ev.description}</p>
                     </div>
                   ))}
                </div>
              </div>
            ) : !currentEvent ? (
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
                    currentEvent.category === EVENT_TYPES.DOWNSIZED ? '#ef4444' :
                    currentEvent.category === EVENT_TYPES.BABY ? '#ef4444' :
                    currentEvent.category === EVENT_TYPES.CHARITY ? '#10b981' :
                    currentEvent.category === EVENT_TYPES.MARKET ? '#3b82f6' : '#f59e0b',
                  color: 'white'
                }}>
                  {
                    currentEvent.category === EVENT_TYPES.PAYCHECK ? '发薪日' :
                    currentEvent.category === EVENT_TYPES.DOODAD ? '额外支出' :
                    currentEvent.category === EVENT_TYPES.DOWNSIZED ? '失业' :
                    currentEvent.category === EVENT_TYPES.BABY ? '生孩子' :
                    currentEvent.category === EVENT_TYPES.CHARITY ? '做慈善' :
                    currentEvent.category === EVENT_TYPES.MARKET ? '市场风云' : '投资机会'
                  }
                </div>
                
                <h2 style={{ marginBottom: '1rem' }}>{currentEvent.title}</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem', whiteSpace: 'pre-line' }}>{currentEvent.description}</p>
                
                {/* Decision Buttons (Hidden once dragging starts) */}
                {dragTokens.length === 0 ? (
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {currentEvent.category === EVENT_TYPES.PAYCHECK && (
                      <button className="btn btn-primary" onClick={handleInitiatePaycheck}>准备领钱</button>
                    )}
                    {currentEvent.category === EVENT_TYPES.DOODAD && (
                      <button className="btn btn-secondary" style={{ backgroundColor: 'var(--danger-color)' }} onClick={handleInitiateDoodad}>准备支付开销</button>
                    )}
                    {currentEvent.category === EVENT_TYPES.BABY && (
                      <button className="btn btn-secondary" style={{ backgroundColor: 'var(--danger-color)' }} onClick={handleInitiateBaby}>准备迎接新生命</button>
                    )}
                    {currentEvent.category === EVENT_TYPES.DOWNSIZED && (
                      <button className="btn btn-secondary" style={{ backgroundColor: 'var(--danger-color)' }} onClick={handleInitiateDownsized}>准备支付生活费</button>
                    )}
                    {currentEvent.category === EVENT_TYPES.CHARITY && (
                      <>
                        <button className="btn btn-primary" onClick={handleInitiateCharity}>我想做慈善</button>
                        <button className="btn btn-outline" onClick={handlePass}>放弃机会</button>
                      </>
                    )}
                    {(currentEvent.category === EVENT_TYPES.SMALL_DEAL || currentEvent.category === EVENT_TYPES.BIG_DEAL) && (
                      <>
                        <button className="btn btn-primary" onClick={handleInitiateBuyAsset}>我想投资买入</button>
                        <button className="btn btn-outline" onClick={handlePass}>放弃机会</button>
                      </>
                    )}
                    {currentEvent.category === EVENT_TYPES.MARKET && (
                      <button className="btn btn-primary" onClick={handleInitiateMarket}>查看结算</button>
                    )}
                  </div>
                ) : (
                  <div className="animate-fade-in" style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--accent-color)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>请将以下账单记录拖入右侧对应的财务报表区域：</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                      {dragTokens.map(token => (
                        <div
                          key={token.id}
                          draggable
                          onDragStart={(e) => { e.dataTransfer.setData('text/plain', token.id); }}
                          style={{
                            background: 'var(--accent-color)', color: 'white', padding: '0.75rem 1.5rem', 
                            borderRadius: '8px', cursor: 'grab', display: 'flex', alignItems: 'center',
                            fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)'
                          }}
                        >
                          <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>≡</span> {token.label}
                        </div>
                      ))}
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>💡 提示：如果放错区域，代币会被弹回。</p>
                  </div>
                )}
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

        {/* Right Panel: Financial Statement with Drop Zones */}
        <div style={{ flex: '1 1 500px' }}>
          <div className="glass-card">
            <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--accent-color)' }}>个人财务报表 (填写区)</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>职业</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>{gameState.profession}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>小孩开销: ${gameState.perChildExpense}/人 (目前 {gameState.childrenCount} 个)</div>
              </div>
              <DropZone zoneId="zone-cash" title="手中现金 (Cash)">
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)', textAlign: 'right' }}>${gameState.cash}</div>
              </DropZone>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
              {/* Income / Expense */}
              <div style={{ flex: 1 }}>
                <DropZone zoneId="zone-income" title="收入 (Income)">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>工资:</span> <span>${gameState.salary}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-color)', fontWeight: 'bold' }}><span>被动收入:</span> <span>${passiveIncome}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.2)', fontWeight: 'bold' }}><span>总收入:</span> <span>${totalIncome}</span></div>
                </DropZone>

                <DropZone zoneId="zone-expenses" title="支出 (Expenses)">
                  {Object.entries(gameState.expenses).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>{k === 'childExpense' ? 'childExpense(小孩)' : k}:</span> <span>${v}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.2)', fontWeight: 'bold' }}><span>总支出:</span> <span>${totalExpenses}</span></div>
                </DropZone>

                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>月度净现金流 (Payday)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: monthlyCashflow > 0 ? 'var(--secondary-color)' : 'var(--danger-color)' }}>
                    ${monthlyCashflow}
                  </div>
                </div>
              </div>

              {/* Assets / Liabilities */}
              <div style={{ flex: 1 }}>
                <DropZone zoneId="zone-assets" title="资产 (Assets)">
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
                </DropZone>

                <DropZone zoneId="zone-liabilities" title="负债 (Liabilities)">
                  {Object.entries(gameState.liabilities).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}><span>{k}:</span> <span>${v}</span></div>
                  ))}
                </DropZone>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CashflowGame;
