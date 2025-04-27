import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { Box, Typography, Slider, FormControl, InputLabel, Select, MenuItem, Paper, Button } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import HomeIcon from '@mui/icons-material/Home';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import InfoIcon from '@mui/icons-material/Info';
import PaletteIcon from '@mui/icons-material/Palette';

// Get the audio volume from localStorage or use default
const getStoredVolume = () => {
  const storedVolume = localStorage.getItem('musicVolume');
  return storedVolume !== null ? parseFloat(storedVolume) : 0.5;
};

const getStoredUiVolume = () => {
  const storedUiVolume = localStorage.getItem('uiVolume');
  return storedUiVolume !== null ? parseFloat(storedUiVolume) : 0.5;
};

// Get the muted state from localStorage or use default
const getStoredMuted = () => {
  const storedMuted = localStorage.getItem('musicMuted');
  return storedMuted === 'true';
};

// Get the background config from localStorage or use default
const getStoredBackgroundConfig = () => {
  const storedConfig = localStorage.getItem('backgroundConfig');
  return storedConfig !== null ? storedConfig : 'GrowingConfig.json';
};

// Get the custom background color from localStorage or use default
const getStoredBackgroundColor = () => {
  const storedColor = localStorage.getItem('customBackgroundColor');
  return storedColor || '';
};

const MenuSettings = () => {
  const navigate = useNavigate();
  const [uiVolume, setUiVolume] = useState(getStoredUiVolume() * 100);
  const [musicVolume, setMusicVolume] = useState(getStoredVolume() * 100);
  const [accessibility, setAccessibility] = useState('none');
  const [backgroundConfig, setBackgroundConfig] = useState(getStoredBackgroundConfig());
  const [backgroundColor, setBackgroundColor] = useState(getStoredBackgroundColor());
  const { theme, setTheme, themes } = useTheme();
  const isMobile = window.innerWidth < 600;

  // Update actual audio element when volume changes
  useEffect(() => {
    // Convert from percentage (0-100) to decimal (0-1)
    const volumeDecimal = musicVolume / 100;
    
    // Store in localStorage for persistence
    localStorage.setItem('musicVolume', volumeDecimal.toString());
    
    // Find audio element created in App.jsx
    const audioElements = document.getElementsByTagName('audio');
    if (audioElements.length > 0) {
      for (let i = 0; i < audioElements.length; i++) {
        audioElements[i].volume = volumeDecimal;
      }
    }
  }, [musicVolume]);

  useEffect(() => {
    const uiVolumeDecimal = uiVolume / 100;
    localStorage.setItem('uiVolume', uiVolumeDecimal.toString());
  }, [uiVolume]);

  // Save background config to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('backgroundConfig', backgroundConfig);
  }, [backgroundConfig]);

  const handleMusicVolumeChange = (event, newValue) => {
    setMusicVolume(newValue);
  };

  const handleUicVolumeChange = (event, newValue) => {
    setUiVolume(newValue);
  };

  const handleBackgroundConfigChange = (event) => {
    setBackgroundConfig(event.target.value);
  };

  const handleBackgroundColorChange = (event) => {
    const newValue = event.target.value;
    console.log("Background color change - selected value:", newValue);
    setBackgroundColor(newValue); // Update local state for the dropdown

    // Get the main element
    const mainElement = document.querySelector('.main');

    if (newValue === 'theme-default-solid') {
      console.log("Setting theme default background");
      localStorage.removeItem('customBackgroundColor');
      
      // Clear inline styles from both body and main
      document.body.style.background = '';
      if (mainElement) {
        mainElement.style.background = '';
      }
      
      console.log("Body style after clearing:", document.body.style.background);
    } else {
      console.log("Setting custom background:", newValue);
      
      // Apply background to both body and main
      document.body.style.background = newValue;
      if (mainElement) {
        mainElement.style.background = newValue;
      }
      
      localStorage.setItem('customBackgroundColor', newValue);
      console.log("Body style after setting:", document.body.style.background);
      console.log("Main element style:", mainElement ? mainElement.style.background : "Main element not found");
    }

    // Trigger update event (optional, if needed elsewhere)
    const updateEvent = new Event('backgroundColorChanged');
    window.dispatchEvent(updateEvent);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Predefined color options
  const colorOptions = [
    { value: 'theme-default-solid', label: 'Theme Default (Solid)' },
    { value: '#121212', label: 'Dark Gray' },
    { value: '#000000', label: 'Black' },
    { value: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)', label: 'Deep Indigo Gradient' },
    { value: 'linear-gradient(135deg, #311b92 0%, #4527a0 50%, #512da8 100%)', label: 'Deep Purple Gradient' },
    { value: 'linear-gradient(135deg, #880e4f 0%, #ad1457 50%, #c2185b 100%)', label: 'Deep Pink Gradient' },
    { value: 'linear-gradient(135deg, #004d40 0%, #00695c 50%, #00796b 100%)', label: 'Deep Teal Gradient' },
    { value: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)', label: 'Deep Blue Gradient' },
    { value: 'linear-gradient(135deg, #263238 0%, #37474f 50%, #455a64 100%)', label: 'Blue Gray Gradient' },
    { value: 'linear-gradient(135deg, #212121 0%, #424242 50%, #616161 100%)', label: 'Dark Gray Gradient' }
  ];

  // Get the current theme's text color
  const textColor = 'var(--text-color)';

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      padding: { xs: 2, md: 4 }
    }}>
      <Paper elevation={6} sx={{ 
        p: { xs: 3, md: 4 }, 
        width: '100%', 
        maxWidth: '800px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '3px solid var(--text-color)',
        position: 'relative',
        overflow: 'auto'
      }}>
        {/* Decorative elements */}
        <div className="nav-decoration nav-decoration-1"></div>
        <div className="nav-decoration nav-decoration-2"></div>
        <div className="nav-decoration nav-decoration-3"></div>
        
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: 'center', 
              fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
              color: textColor,
              textShadow: '0px 2px 4px rgba(0,0,0,0.3)',
              textTransform: 'uppercase',
              position: 'relative',
              zIndex: 1
            }}
          >
            Settings
          </Typography>
        </Box>
        
        {/* Audio Settings */}
        <Box 
          sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: '16px', 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid var(--accent-color)',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <MusicNoteIcon sx={{ mr: 1, color: textColor }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                color: textColor,
                textTransform: 'uppercase'
              }}
            >
              Audio
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <VolumeDownIcon sx={{ mr: 1, color: textColor }} />
            <Box sx={{ width: '100%', mx: 2 }}>
              <Typography 
                id="music-volume-slider" 
                sx={{ 
                  fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                  color: textColor,
                  mb: 1
                }}
              >
                Music Volume
              </Typography>
              <Slider
                value={musicVolume}
                onChange={handleMusicVolumeChange}
                aria-labelledby="music-volume-slider"
                valueLabelDisplay="auto"
                step={1}
                min={0}
                max={100}
                sx={{
                  color: 'var(--accent-color)',
                  '& .MuiSlider-thumb': {
                    height: 24,
                    width: 24,
                    backgroundColor: 'var(--accent-color)',
                    border: '2px solid var(--text-color)',
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(var(--accent-color-rgb), 0.16)'
                    }
                  }
                }}
              />
            </Box>
            <VolumeUpIcon sx={{ ml: 1, color: textColor }} />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VolumeDownIcon sx={{ mr: 1, color: textColor }} />
            <Box sx={{ width: '100%', mx: 2 }}>
              <Typography 
                id="ui-volume-slider" 
                sx={{ 
                  fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                  color: textColor,
                  mb: 1
                }}
              >
                UI Sound Effects
              </Typography>
              <Slider
                value={uiVolume}
                onChange={handleUicVolumeChange}
                aria-labelledby="ui-volume-slider"
                valueLabelDisplay="auto"
                step={1}
                min={0}
                max={100}
                sx={{
                  color: 'var(--accent-color)',
                  '& .MuiSlider-thumb': {
                    height: 24,
                    width: 24,
                    backgroundColor: 'var(--accent-color)',
                    border: '2px solid var(--text-color)',
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(var(--accent-color-rgb), 0.16)'
                    }
                  }
                }}
              />
            </Box>
            <VolumeUpIcon sx={{ ml: 1, color: textColor }} />
          </Box>
        </Box>
        
        {/* Appearance Settings */}
        <Box 
          sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: '16px', 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid var(--accent-color)',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ColorLensIcon sx={{ mr: 1, color: textColor }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                color: textColor,
                textTransform: 'uppercase'
              }}
            >
              Appearance
            </Typography>
          </Box>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel 
              id="theme-select-label"
              sx={{ 
                color: textColor,
                '&.Mui-focused': {
                  color: 'var(--accent-color)'
                }
              }}
            >
              Theme
            </InputLabel>
            <Select
              labelId="theme-select-label"
              value={theme}
              label="Theme"
              onChange={(e) => {
                setTheme(e.target.value);
                // Reset custom background color when theme changes
                setBackgroundColor('');
                localStorage.removeItem('customBackgroundColor');
                
                // Apply the theme's gradient background
                setTimeout(() => {
                  const computedStyle = getComputedStyle(document.documentElement);
                  const gradient = computedStyle.getPropertyValue('--background-gradient').trim();
                  document.body.style.background = gradient;
                  
                  // Trigger background color change event
                  const event = new Event('backgroundColorChanged');
                  window.dispatchEvent(event);
                }, 50); // Small delay to ensure theme is applied first
              }}
              sx={{
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '.MuiSvgIcon-root': {
                  color: textColor,
                },
                color: textColor,
                fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(30, 30, 30, 0.95)',
                    color: textColor,
                    '& .MuiMenuItem-root': {
                      color: textColor,
                      fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                      '&:hover': {
                        backgroundColor: 'rgba(var(--accent-color-rgb), 0.2)'
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(var(--accent-color-rgb), 0.3)',
                        color: 'var(--accent-color)',
                        '&:hover': {
                          backgroundColor: 'rgba(var(--accent-color-rgb), 0.4)'
                        }
                      }
                    }
                  }
                }
              }}
            >
              {themes.map((t) => (
                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel 
              id="background-color-select-label"
              sx={{ 
                color: textColor,
                '&.Mui-focused': {
                  color: 'var(--accent-color)'
                }
              }}
            >
              Background Color
            </InputLabel>
            <Select
              labelId="background-color-select-label"
              value={backgroundColor}
              label="Background Color"
              onChange={handleBackgroundColorChange}
              sx={{
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '.MuiSvgIcon-root': {
                  color: textColor,
                },
                color: textColor,
                fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(30, 30, 30, 0.95)',
                    color: textColor,
                    '& .MuiMenuItem-root': {
                      color: textColor,
                      fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                      '&:hover': {
                        backgroundColor: 'rgba(var(--accent-color-rgb), 0.2)'
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(var(--accent-color-rgb), 0.3)',
                        color: 'var(--accent-color)',
                        '&:hover': {
                          backgroundColor: 'rgba(var(--accent-color-rgb), 0.4)'
                        }
                      }
                    }
                  }
                }
              }}
            >
              {colorOptions.map((option) => (
                <MenuItem 
                  key={option.value} 
                  value={option.value}
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {option.value && (
                    <Box 
                      component="span" 
                      sx={{ 
                        display: 'inline-block', 
                        width: 16, 
                        height: 16, 
                        backgroundColor: option.value,
                        marginRight: 1,
                        border: '1px solid white',
                        borderRadius: '3px'
                      }}
                    />
                  )}
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel 
              id="background-select-label"
              sx={{ 
                color: textColor,
                '&.Mui-focused': {
                  color: 'var(--accent-color)'
                }
              }}
            >
              Background Particles 
            </InputLabel>
            <Select
              labelId="background-select-label"
              value={backgroundConfig}
              label="Background Particles"
              onChange={handleBackgroundConfigChange}
              sx={{
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '.MuiSvgIcon-root': {
                  color: textColor,
                },
                color: textColor,
                fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(30, 30, 30, 0.95)',
                    color: textColor,
                    '& .MuiMenuItem-root': {
                      color: textColor,
                      fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                      '&:hover': {
                        backgroundColor: 'rgba(var(--accent-color-rgb), 0.2)'
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(var(--accent-color-rgb), 0.3)',
                        color: 'var(--accent-color)',
                        '&:hover': {
                          backgroundColor: 'rgba(var(--accent-color-rgb), 0.4)'
                        }
                      }
                    }
                  }
                }
              }}
            >
              <MenuItem value="GrowingConfig.json">Growing Particles</MenuItem>
              <MenuItem value="WorkingConfig.json">Network Particles</MenuItem>
              <MenuItem value="ConfettiConfig.json">Confetti Particles</MenuItem>
              <MenuItem value="HexegonConfig.json">Hexegon Particles</MenuItem>
              <MenuItem value="FireworksConfig.json">Fireworks Particles</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {/* Accessibility Settings */}
        <Box 
          sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: '16px', 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid var(--accent-color)',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessibilityNewIcon sx={{ mr: 1, color: textColor }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                color: textColor,
                textTransform: 'uppercase'
              }}
            >
              Accessibility
            </Typography>
          </Box>
          
          <FormControl fullWidth>
            <InputLabel 
              id="accessibility-select-label"
              sx={{ 
                color: textColor,
                '&.Mui-focused': {
                  color: 'var(--accent-color)'
                }
              }}
            >
              Accessibility Options
            </InputLabel>
            <Select
              labelId="accessibility-select-label"
              value={accessibility}
              label="Accessibility Options"
              onChange={(e) => setAccessibility(e.target.value)}
              sx={{
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '.MuiSvgIcon-root': {
                  color: textColor,
                },
                color: textColor,
                fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(30, 30, 30, 0.95)',
                    color: textColor,
                    '& .MuiMenuItem-root': {
                      color: textColor,
                      fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                      '&:hover': {
                        backgroundColor: 'rgba(var(--accent-color-rgb), 0.2)'
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(var(--accent-color-rgb), 0.3)',
                        color: 'var(--accent-color)',
                        '&:hover': {
                          backgroundColor: 'rgba(var(--accent-color-rgb), 0.4)'
                        }
                      }
                    }
                  }
                }
              }}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="high-contrast">High Contrast</MenuItem>
              <MenuItem value="text-to-speech">Text to Speech</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {/* Credits */}
        <Box 
          sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: '16px', 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid var(--accent-color)',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <InfoIcon sx={{ mr: 1, color: textColor }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                color: textColor,
                textTransform: 'uppercase'
              }}
            >
            </Typography>
              Credits
          </Box>
          
          <Typography 
            variant="body1"
            sx={{ 
              fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
              color: textColor,
              textAlign: 'center'
            }}
          >
            Created by Team Bravo
          </Typography>
        </Box>

        {/* Back Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <button 
            className="fun-button fun-button-home"
            onClick={handleBackToHome}
            style={{ 
              padding: '12px 24px',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '200px'
            }}
          >
            <HomeIcon sx={{ mr: 1 }} /> BACK HOME
          </button>
        </Box>
      </Paper>
    </Box>
  );
};

export default MenuSettings;
