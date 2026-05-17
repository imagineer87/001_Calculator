export type AppMode = 'calculator' | 'history' | 'settings';
export type CalcMode = 'standard' | 'scientific';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}
