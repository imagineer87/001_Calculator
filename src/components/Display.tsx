import { motion, AnimatePresence } from 'motion/react';

interface DisplayProps {
  expression: string;
  result: string;
}

export function Display({ expression, result }: DisplayProps) {
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
    <div className="flex-1 flex flex-col items-end justify-end p-6 w-full" id="display-container">
      <div className="text-on-surface-variant font-medium text-lg h-7 mb-2 overflow-hidden text-right w-full tracking-tight" id="calc-expression">
        {expression}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={result}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-on-surface text-5xl md:text-6xl font-black tracking-tighter break-all text-right w-full leading-none"
          id="calc-result"
        >
          {renderResult(result || '0')}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
