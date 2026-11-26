import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
} from 'react';

import useLocalStorage from '../hooks/useLocalStorage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage(
    'ltw_bongda_theme',
    'light'
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => prev === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const value = useMemo(() => ({
    theme,
    toggleTheme,
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme phải được dùng trong ThemeProvider');
  }

  return context;
};