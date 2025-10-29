import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

const defaultColors = {
  primary: '#003D7A',
  secondary: '#FFA500',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [colors, setColors] = useState(() => {
    const savedColors = localStorage.getItem('customColors');
    return savedColors ? JSON.parse(savedColors) : defaultColors;
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;

    // Aplicar tema
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Aplicar cores customizadas
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-error', colors.error);

    // Salvar no localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('customColors', JSON.stringify(colors));
  }, [theme, colors]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setThemeMode = (mode) => {
    if (['light', 'dark'].includes(mode)) {
      setTheme(mode);
    }
  };

  const updateColor = (colorKey, value) => {
    setColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const resetColors = () => {
    setColors(defaultColors);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const value = {
    theme,
    colors,
    sidebarCollapsed,
    toggleTheme,
    setThemeMode,
    updateColor,
    resetColors,
    toggleSidebar,
    setSidebarCollapsed,
    isDark: theme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

export default ThemeContext;
