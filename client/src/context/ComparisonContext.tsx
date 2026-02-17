import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import toast from 'react-hot-toast';

interface ComparisonContextType {
  selectedIds: string[];
  addToComparison: (id: string) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  isSelected: (id: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | null>(null);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const addToComparison = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= 4) {
        toast.error('You can compare up to 4 creatives at a time');
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const removeFromComparison = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  }, []);

  const clearComparison = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  return (
    <ComparisonContext.Provider
      value={{ selectedIds, addToComparison, removeFromComparison, clearComparison, isSelected }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) throw new Error('useComparison must be used within ComparisonProvider');
  return context;
}
