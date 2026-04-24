import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { Collection } from '@/data/products';

export type ThemeCollection = Collection | null;

interface ThemeContextType {
  activeTheme: ThemeCollection;
  pendingTheme: ThemeCollection;
  setTheme: (collection: ThemeCollection) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState<ThemeCollection>(null);
  const [pendingTheme, setPendingTheme] = useState<ThemeCollection>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setTheme = useCallback((collection: ThemeCollection) => {
    setPendingTheme(collection);
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTheme(collection);
      if (collection) {
        document.documentElement.setAttribute('data-theme', collection);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }, 500);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
  }, []);

  return (
    <ThemeContext.Provider value={{ activeTheme, pendingTheme, setTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
};