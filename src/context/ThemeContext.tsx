import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Collection } from '@/data/products';

export type ThemeCollection = Collection | string | null;

interface ThemeContextType {
  activeTheme: ThemeCollection;
  pendingTheme: ThemeCollection;
  setTheme: (collection: ThemeCollection) => void;
  isTransitioning: boolean;
  lightMode: boolean;
  toggleLightMode: () => void;
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
  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem('thaem-light-mode') === 'true';
  });

  useEffect(() => {
    if (lightMode && !activeTheme) {
      document.documentElement.setAttribute('data-mode', 'light');
    } else {
      document.documentElement.removeAttribute('data-mode');
    }
  }, [lightMode, activeTheme]);

  const toggleLightMode = useCallback(() => {
    setLightMode(prev => {
      const next = !prev;
      localStorage.setItem('thaem-light-mode', String(next));
      return next;
    });
  }, []);

  const setTheme = useCallback((collection: ThemeCollection) => {
    setActiveTheme(prev => {
      if (prev === collection) return prev;

      setPendingTheme(collection);
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTheme(collection);
        if (collection) {
          document.documentElement.setAttribute('data-theme', collection);
          document.documentElement.removeAttribute('data-mode');
        } else {
          document.documentElement.removeAttribute('data-theme');
          if (lightMode) document.documentElement.setAttribute('data-mode', 'light');
        }
      }, 500);
      setTimeout(() => setIsTransitioning(false), 1200);

      return prev;
    });
  }, [lightMode]);

  return (
    <ThemeContext.Provider value={{ activeTheme, pendingTheme, setTheme, isTransitioning, lightMode, toggleLightMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
