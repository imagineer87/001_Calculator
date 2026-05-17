/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { create, all } from 'mathjs';
import { History as HistoryIcon, Menu, Delete, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppMode, CalcMode, HistoryItem } from './types';
import { Display } from './components/Display';
import { CalcButton } from './components/CalcButton';
import { Navigation } from './components/Navigation';
import { cn } from './lib/utils';

// Math JS initialization
const math = create(all);

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('calculator');
  const [calcMode, setCalcMode] = useState<CalcMode>('standard');
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isEquationFinal, setIsEquationFinal] = useState(false);
  const [isDegree, setIsDegree] = useState(true);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('calc_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const saveHistory = useCallback((expr: string, res: string) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      expression: expr,
      result: res,
      timestamp: Date.now(),
    };
    const updated = [newItem, ...history].slice(0, 50);
    setHistory(updated);
    localStorage.setItem('calc_history', JSON.stringify(updated));
  }, [history]);

  const handleInput = (val: string) => {
    if (isEquationFinal) {
      if (['+', '-', '*', '/', '^'].includes(val)) {
        setExpression(result + val);
      } else {
        setExpression(val);
      }
      setIsEquationFinal(false);
      return;
    }
    setExpression((prev) => prev + val);
  };

  const clear = () => {
    setExpression('');
    setResult('');
    setIsEquationFinal(false);
  };

  const backspace = () => {
    if (isEquationFinal) {
      clear();
      return;
    }
    setExpression((prev) => prev.slice(0, -1));
  };

  const calculate = useCallback(() => {
    if (!expression) return;
    try {
      // Replace symbols for mathjs
      let cleanExpr = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi')
        .replace(/pow/g, '^');

      // If in degree mode, we ensure trig functions use degrees
      if (isDegree) {
        const trigFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];
        trigFunctions.forEach(fn => {
          // Replace sin(x) with sin(x deg) to force degree calculation in mathjs
          const regex = new RegExp(`${fn}\\(([^\\)]+)\\)`, 'g');
          cleanExpr = cleanExpr.replace(regex, (match, group) => {
            if (group.includes('deg') || group.includes('rad')) return match;
            return `${fn}((${group}) deg)`;
          });
        });
      }
      
      const evalResult = math.evaluate(cleanExpr);
      const formattedResult = typeof evalResult === 'number' 
        ? (Number.isInteger(evalResult) 
          ? evalResult.toString() 
          : evalResult.toFixed(4).replace(/\.?0+$/, ''))
        : evalResult.toString();
      
      setResult(formattedResult);
      saveHistory(expression, formattedResult);
      setIsEquationFinal(true);
    } catch (error) {
      setResult('Error');
    }
  }, [expression, isDegree, saveHistory]);

  const toggleCalcMode = () => {
    setCalcMode(prev => prev === 'standard' ? 'scientific' : 'standard');
  };

  // Helper for rendering scientific buttons
  const scientificButtons = [
    { label: 'sin', action: () => handleInput('sin(') },
    { label: 'cos', action: () => handleInput('cos(') },
    { label: 'tan', action: () => handleInput('tan(') },
    { label: 'log', action: () => handleInput('log10(') },
    { label: 'ln', action: () => handleInput('log(') },
    { label: '√', action: () => handleInput('sqrt(') },
    { label: 'π', action: () => handleInput('π') },
    { label: 'e', action: () => handleInput('e') },
    { label: 'xⁿ', action: () => handleInput('^') },
    { label: '(', action: () => handleInput('(') },
    { label: ')', action: () => handleInput(')') },
    { label: isDegree ? 'deg' : 'rad', action: () => setIsDegree(!isDegree) },
  ];

  return (
    <div className="flex flex-col h-full w-full relative bg-surface overflow-hidden" id="app-root">
      
      <header className="flex items-center justify-between px-6 pb-2" style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }} id="main-header">
        <div className="flex items-center gap-3">
          <button className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-xl transition-colors" id="menu-btn">
            <Menu size={18} />
          </button>
          <span className="text-on-surface-variant font-black text-[10px] tracking-widest uppercase">CALCULATOR</span>
        </div>

        <div className="bg-slate-100 rounded-2xl p-1 flex relative w-36" id="mode-toggle">
          <motion.div 
            layoutId="mode-highlight"
            className="absolute top-1 bottom-1 rounded-xl bg-white shadow-sm z-0"
            animate={{ 
              left: calcMode === 'standard' ? '5px' : '73px',
              width: '66px'
            }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
          />
          <button 
            onClick={() => setCalcMode('standard')}
            className={cn(
              "relative z-10 flex-1 py-1.5 text-[11px] font-black transition-colors rounded-xl",
              calcMode === 'standard' ? "text-indigo-600" : "text-slate-400"
            )}
            id="std-mode-btn"
          >
            일반용
          </button>
          <button 
            onClick={() => setCalcMode('scientific')}
            className={cn(
              "relative z-10 flex-1 py-1.5 text-[11px] font-black transition-colors rounded-xl",
              calcMode === 'scientific' ? "text-indigo-600" : "text-slate-400"
            )}
            id="sci-mode-btn"
          >
            공학용
          </button>
        </div>

        <div className="flex gap-1.5" id="status-dots">
          <div className="w-2 h-2 bg-rose-400/80 rounded-full" />
          <div className="w-2 h-2 bg-amber-400/80 rounded-full" />
          <div className="w-2 h-2 bg-emerald-400/80 rounded-full" />
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        {appMode === 'calculator' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <Display expression={expression} result={result} history={history} />

            <div className="bg-surface-dim px-6 pt-2 pb-6 grid gap-4 select-none shrink-0" id="keypad">
              <AnimatePresence initial={false} mode="wait">
                {calcMode === 'scientific' ? (
                  <motion.div 
                    key="sci-grid"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="grid grid-cols-6 gap-1.5 overflow-hidden mb-2"
                    id="scientific-grid"
                  >
                    {scientificButtons.map((btn) => (
                      <CalcButton 
                        key={btn.label} 
                        label={btn.label} 
                        onClick={btn.action} 
                        variant="scientific" 
                        className="h-8 !text-[10px] !rounded-lg"
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="spacer"
                    initial={{ height: 0 }}
                    animate={{ height: 0 }}
                    exit={{ height: 0 }}
                    id="scientific-spacer"
                  />
                )}
              </AnimatePresence>

              <div className="grid grid-cols-4 gap-4" id="standard-grid">
                <CalcButton label="AC" onClick={clear} variant="utility-rose" />
                <CalcButton label="±" onClick={() => setExpression(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev)} variant="utility-indigo" />
                <CalcButton label="%" onClick={() => handleInput('%')} variant="utility-indigo" />
                <CalcButton label="÷" onClick={() => handleInput('÷')} variant="operator" />

                <CalcButton label="7" onClick={() => handleInput('7')} />
                <CalcButton label="8" onClick={() => handleInput('8')} />
                <CalcButton label="9" onClick={() => handleInput('9')} />
                <CalcButton label="×" onClick={() => handleInput('×')} variant="operator" />

                <CalcButton label="4" onClick={() => handleInput('4')} />
                <CalcButton label="5" onClick={() => handleInput('5')} />
                <CalcButton label="6" onClick={() => handleInput('6')} />
                <CalcButton label="−" onClick={() => handleInput('-')} variant="operator" />

                <CalcButton label="1" onClick={() => handleInput('1')} />
                <CalcButton label="2" onClick={() => handleInput('2')} />
                <CalcButton label="3" onClick={() => handleInput('3')} />
                <CalcButton label="+" onClick={() => handleInput('+')} variant="operator" />

                <CalcButton label="0" onClick={() => handleInput('0')} isWide />
                <CalcButton label="." onClick={() => handleInput('.')} />
                <CalcButton label="=" onClick={calculate} variant="action" />
              </div>
            </div>
          </div>
        )}

        {appMode === 'history' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4"
            id="history-view"
          >
            <h2 className="text-2xl font-medium mb-4">Calculation History</h2>
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-on-surface-variant opacity-50">
                <HistoryIcon size={48} className="mb-4" />
                <p>No history yet</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-xl bg-surface-bright/10 border border-outline/5 hover:border-outline/20 cursor-pointer transition-all"
                  onClick={() => {
                    setExpression(item.expression);
                    setResult(item.result);
                    setAppMode('calculator');
                  }}
                  id={`history-${item.id}`}
                >
                  <div className="text-on-surface-variant text-sm mb-1">{item.expression}</div>
                  <div className="text-primary text-xl font-medium">= {item.result}</div>
                  <div className="text-on-surface-variant/30 text-xs mt-2 text-right">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
            {history.length > 0 && (
              <button 
                onClick={() => { setHistory([]); localStorage.removeItem('calc_history'); }}
                className="text-secondary text-sm font-medium hover:underline p-2 self-center mt-4"
                id="clear-history-btn"
              >
                Clear all history
              </button>
            )}
          </motion.div>
        )}

        {appMode === 'settings' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 p-4"
            id="settings-view"
          >
            <h2 className="text-2xl font-medium mb-8">Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-bright/10">
                <div>
                  <div className="font-medium">Precision</div>
                  <div className="text-sm text-on-surface-variant">Decimal points for results</div>
                </div>
                <div className="text-primary">4</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-bright/10 opacity-50 cursor-not-allowed">
                <div>
                  <div className="font-medium">Sound Effects</div>
                  <div className="text-sm text-on-surface-variant">Taptic feedback on keys</div>
                </div>
                <div className="w-10 h-5 bg-outline/20 rounded-full relative">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-on-surface/30 rounded-full" />
                </div>
              </div>
              <div className="p-4 text-center text-xs text-on-surface-variant mt-20">
                Precision Minimalist v1.0.0
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <Navigation activeMode={appMode} onModeChange={setAppMode} />
    </div>
  );
}
