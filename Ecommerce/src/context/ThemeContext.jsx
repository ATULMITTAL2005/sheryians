import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [storedTheme, setStoredTheme] = useLocalStorage('verve-theme', 'dark');
  const [theme, setTheme] = useState(storedTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setStoredTheme(theme);
  }, [setStoredTheme, theme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
      setTheme,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}