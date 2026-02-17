import { createContext, useContext, useState, type ReactNode } from 'react';
import type { DateRange } from '../types';

interface DateRangeContextType {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  preset: string;
  setPreset: (preset: string) => void;
}

const DateRangeContext = createContext<DateRangeContextType | null>(null);

function getDateRange(days: number): DateRange {
  const until = new Date().toISOString().split('T')[0]!;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!;
  return { since, until };
}

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState('30');
  const [dateRange, setDateRange] = useState<DateRange>(getDateRange(30));

  const handlePreset = (newPreset: string) => {
    setPreset(newPreset);
    setDateRange(getDateRange(parseInt(newPreset)));
  };

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange, preset, setPreset: handlePreset }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (!context) throw new Error('useDateRange must be used within DateRangeProvider');
  return context;
}
