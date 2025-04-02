import { createContext, useState, useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('appTheme');
    return savedTheme || 'light';
  });

  // Create Material UI theme based on current theme
  const muiTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: theme === 'light' ? 'light' : 'dark',
        primary: {
          main: theme === 'light' ? '#21527b' : theme === 'dark' ? '#bb86fc' : '#ffff00',
        },
        secondary: {
          main: theme === 'light' ? '#e3eff6' : theme === 'dark' ? '#373737' : '#000000',
        },
        background: {
          default: theme === 'light' ? '#ffffff' : theme === 'dark' ? '#121212' : '#000000',
          paper: theme === 'light' ? '#ffffff' : theme === 'dark' ? '#1e1e1e' : '#000000',
        },
        text: {
          primary: theme === 'light' ? '#000000' : '#ffffff',
          secondary: theme === 'light' ? '#555555' : '#cccccc',
        },
      },
    });
  }, [theme]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    // Apply theme class to body
    document.body.className = theme === 'dark' ? 'dark-theme' : 
                             theme === 'high-contrast' ? 'high-contrast-theme' : '';
  }, [theme]);

  const contextValue = useMemo(() => {
    return {
      theme,
      setTheme,
    };
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};