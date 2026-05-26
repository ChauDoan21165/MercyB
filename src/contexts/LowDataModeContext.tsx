import React, { createContext, useContext, useState, useEffect } from 'react';

interface LowDataModeContextType {
  isLowDataMode: boolean;
  toggleLowDataMode: () => void;
}

const LowDataModeContext = createContext<LowDataModeContextType | undefined>(undefined);

const LOW_DATA_MODE_KEY = 'low-data-mode';

export function LowDataModeProvider({ children }: { children: React.ReactNode }) {
  const [isLowDataMode, setIsLowDataMode] = useState(() => {
    const saved = localStorage.getItem(LOW_DATA_MODE_KEY);
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem(LOW_DATA_MODE_KEY, String(isLowDataMode));
    
    // Apply global class for CSS optimizations
    if (isLowDataMode) {
      document.documentElement.classList.add('low-data-mode');
    } else {
      document.documentElement.classList.remove('low-data-mode');
    }
  }, [isLowDataMode]);

  const toggleLowDataMode = () => setIsLowDataMode(prev => !prev);

  return (
    <LowDataModeContext.Provider value={{ isLowDataMode, toggleLowDataMode }}>
      {children}
    </LowDataModeContext.Provider>
  );
}

export function useLowDataMode() {
  const context = useContext(LowDataModeContext);
  if (!context) {
    throw new Error('useLowDataMode must be used within LowDataModeProvider');
  }
  return context;
}
