import { createContext, useState, useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { themes } from './themes';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'dark-theme'
    const savedTheme = localStorage.getItem('appTheme');
    return savedTheme || 'dark-theme';
  });

  // Helper: Remove all theme classes from body
  const removeThemeClasses = () => {
    document.body.classList.forEach(cls => {
      if (cls.endsWith('-theme')) document.body.classList.remove(cls);
    });
  };

  // Effect: Apply initial background on mount
  useEffect(() => {
    const initialCustomColor = localStorage.getItem('customBackgroundColor');
    const mainElement = document.querySelector('.main');
    
    if (initialCustomColor) {
      // Apply stored custom color if it exists
      document.body.style.background = initialCustomColor;
      if (mainElement) {
        mainElement.style.background = initialCustomColor;
      }
    } else {
      // Otherwise, apply the initial theme's default background
      const initialTheme = localStorage.getItem('appTheme') || 'light';
      removeThemeClasses(); // Ensure clean slate
      if (initialTheme !== 'light') {
        document.body.classList.add(initialTheme);
      }
      // Let the CSS rule apply the background by ensuring no inline style exists initially
      document.body.style.background = ''; 
      if (mainElement) {
        mainElement.style.background = '';
      }
    }
  }, []); // Empty dependency array means run once on mount

  // Effect: Apply theme changes
  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    localStorage.removeItem('customBackgroundColor'); // Clear custom setting
    const mainElement = document.querySelector('.main');

    removeThemeClasses(); // Remove previous theme classes
    if (theme !== 'light') { // Apply new theme class
      document.body.classList.add(theme);
    }

    // Remove any inline background style to let the theme's CSS rule apply
    document.body.style.background = ''; 
    if (mainElement) {
      mainElement.style.background = '';
    }
    
    // Trigger background color change event (might still be useful for other components)
    const event = new Event('backgroundColorChanged');
    window.dispatchEvent(event);

  }, [theme]); // Runs only when theme state changes

  // Create Material UI theme based on current theme and CSS variables
  const muiTheme = useMemo(() => {
    // Get CSS variables after theme class is applied
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue('--primary-color').trim();
    const secondaryColor = computedStyle.getPropertyValue('--secondary-color').trim();
    const backgroundColor = computedStyle.getPropertyValue('--background-gradient').trim();
    const textColor = computedStyle.getPropertyValue('--text-color').trim();
    const accentColor = computedStyle.getPropertyValue('--accent-color').trim();

    return createTheme({
      palette: {
        mode: theme === 'light' ? 'light' : 'dark',
        primary: {
          main: primaryColor || '#21527b',
        },
        secondary: {
          main: secondaryColor || '#e3eff6',
        },
        background: {
          default: backgroundColor || '#ffffff',
          paper: backgroundColor || '#ffffff',
        },
        text: {
          primary: textColor || '#333333',
        },
        accent: {
          main: accentColor || '#ff4081',
        },
      },
      typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        h1: {
          fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
        },
        h2: {
          fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
        },
        h3: {
          fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
        },
        h4: {
          fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
        },
        h5: {
          fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
        },
        h6: {
          fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
        },
      },
    });
  }, [theme]);

  const contextValue = {
    theme,
    setTheme,
    themes,
  };

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