import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { Box, Typography, Slider, FormControl, InputLabel, Select, MenuItem, Paper, Button } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import HomeIcon from '@mui/icons-material/Home';

// Get the audio volume from localStorage or use default
const getStoredVolume = () => {
  const storedVolume = localStorage.getItem('musicVolume');
  return storedVolume !== null ? parseFloat(storedVolume) : 0.5;
};

// Get the muted state from localStorage or use default
const getStoredMuted = () => {
  const storedMuted = localStorage.getItem('musicMuted');
  return storedMuted === 'true';
};

const MenuSettings = () => {
  const navigate = useNavigate();
  const [uiVolume, setUiVolume] = useState(50);
  const [musicVolume, setMusicVolume] = useState(getStoredVolume() * 100);
  const [accessibility, setAccessibility] = useState('none');
  const { theme, setTheme } = useTheme();

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

  const handleMusicVolumeChange = (event, newValue) => {
    setMusicVolume(newValue);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh' 
    }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        width: '100%', 
        maxWidth: '600px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Settings
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Audio</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <VolumeDownIcon sx={{ mr: 1 }} />
            <Box sx={{ width: '100%', mx: 2 }}>
              <Typography id="music-volume-slider" gutterBottom>
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
              />
            </Box>
            <VolumeUpIcon sx={{ ml: 1 }} />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VolumeDownIcon sx={{ mr: 1 }} />
            <Box sx={{ width: '100%', mx: 2 }}>
              <Typography id="ui-volume-slider" gutterBottom>
                UI Sound Effects
              </Typography>
              <Slider
                value={uiVolume}
                onChange={(e, val) => setUiVolume(val)}
                aria-labelledby="ui-volume-slider"
                valueLabelDisplay="auto"
                step={1}
                min={0}
                max={100}
              />
            </Box>
            <VolumeUpIcon sx={{ ml: 1 }} />
          </Box>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Appearance</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="theme-select-label">Theme</InputLabel>
            <Select
              labelId="theme-select-label"
              value={theme}
              label="Theme"
              onChange={(e) => setTheme(e.target.value)}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark-theme">Dark</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Accessibility</Typography>
          <FormControl fullWidth>
            <InputLabel id="accessibility-select-label">Accessibility Options</InputLabel>
            <Select
              labelId="accessibility-select-label"
              value={accessibility}
              label="Accessibility Options"
              onChange={(e) => setAccessibility(e.target.value)}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="high-contrast">High Contrast</MenuItem>
              <MenuItem value="text-to-speech">Text to Speech</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Credits</Typography>
          <Typography variant="body1">
            Created by Team Bravo
          </Typography>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<HomeIcon />}
            onClick={handleBackToHome}
            size="large"
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default MenuSettings;
