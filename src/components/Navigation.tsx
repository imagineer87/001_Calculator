import { Calculator, History, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { AppMode } from '../types';
import { cn } from '../lib/utils';

interface NavigationProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export function Navigation({ activeMode, onModeChange }: NavigationProps) {
  const tabs: { id: AppMode; icon: typeof Calculator; label: string }[] = [
    { id: 'calculator', icon: Calculator, label: 'Calculator' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex items-center justify-around w-full bg-white/80 backdrop-blur-md pt-2 pb-6 px-8 border-t border-slate-100" id="bottom-nav">
      {tabs.map((tab) => {
        const isActive = activeMode === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onModeChange(tab.id)}
            className="relative flex flex-col items-center group flex-1"
            id={`nav-${tab.id}`}
          >
            <div className={cn(
              "p-3 rounded-2xl transition-all duration-300 relative z-10",
              isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
            )}>
              <tab.icon size={24} strokeWidth={isActive ? 3 : 2} />
            </div>
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 bg-indigo-50 rounded-2xl w-14 h-12 self-center top-1"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
