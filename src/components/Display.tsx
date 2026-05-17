import { motion, AnimatePresence } from 'motion/react';
import { HistoryItem } from '../types';

interface DisplayProps {
  expression: string;
  result: string;
  history: HistoryItem[];
}

export function Display({ expression, result, history }: DisplayProps) {
  // Split result to highlight decimal point if present
  const renderResult = (res: string) => {
    if (!res.includes('.')) return res;
    const [int, dec] = res.split('.');
    return (
      <>
        {int}<span className="text-on-accent-indigo">.</span>{dec}
      </>
    );
  };

  return (
    <div className="flex-1 flex flex-col items-end justify-end p-8 w-full overflow-hidden" id="display-container">
      {/* 상단 히스토리 영역 */}
      <div className="flex-1 w-full flex flex-col items-end justify-start space-y-2 opacity-40 mb-4 overflow-hidden mask-fade-top" id="mini-history">
        {history.slice(0, 3).reverse().map((item) => (
          <div key={item.id} className="text-right">
            <div className="text-xs font-medium text-on-surface-variant">{item.expression}</div>
            <div className="text-sm font-bold text-on-surface">={item.result}</div>
          </div>
        ))}
      </div>

      <div className="text-on-surface-variant font-medium text-xl h-8 mb-4 overflow-hidden text-right w-full tracking-tight" id="calc-expression">
        {expression}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={result}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-on-surface text-6xl md:text-8xl font-black tracking-tighter break-all text-right w-full leading-none"
          id="calc-result"
        >
          {renderResult(result || '0')}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
