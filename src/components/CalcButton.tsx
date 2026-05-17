import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface CalcButtonProps {
  label: React.ReactNode;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'action' | 'utility-rose' | 'utility-indigo' | 'scientific';
  className?: string;
  isWide?: boolean;
}

export function CalcButton({ 
  label, 
  onClick, 
  variant = 'number', 
  className,
  isWide = false
}: CalcButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'operator':
        return 'bg-primary text-on-primary shadow-lg shadow-primary/20 active:scale-95';
      case 'action':
        return 'bg-secondary text-on-secondary shadow-lg shadow-secondary/20 active:scale-95';
      case 'utility-rose':
        return 'bg-accent-rose text-on-accent-rose font-black active:scale-95';
      case 'utility-indigo':
        return 'bg-accent-indigo text-on-accent-indigo font-black active:scale-95';
      case 'scientific':
        return 'bg-accent-indigo/40 text-on-accent-indigo/70 text-base font-bold hover:bg-accent-indigo active:scale-95';
      case 'number':
      default:
        return 'bg-surface text-on-surface shadow-sm border border-slate-100 font-black active:scale-95';
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-3xl text-2xl transition-all cursor-pointer',
        'h-11 md:h-14 min-w-[56px]',
        isWide ? 'col-span-2 aspect-auto px-10 justify-start' : 'aspect-square',
        getVariantStyles(),
        className
      )}
      id={`btn-${label?.toString().replace(/\s/g, '-') || Math.random().toString(36).substring(7)}`}
    >
      {label}
    </motion.button>
  );
}
