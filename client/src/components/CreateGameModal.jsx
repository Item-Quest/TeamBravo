import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createGame, emitSelectedItems } from '../dataProvider.js';
import PropTypes from 'prop-types';
import defaultpfp from '../assets/defaultpfp.png';
import click from "../assets/SFX/click.wav"
import backClick from "../assets/SFX/backclick.wav"


const CreateGameModal = ({ isOpen, onClose, updateGame, navigate }) => {
  const [username, setUsername] = useState("");
  const [gameMode, setGameMode] = useState("Item Race");
  const [expanded, setExpanded] = useState(false);
  const [uiVolume] = useState(() => {
  const storedVolume = localStorage.getItem('uiVolume');
  return storedVolume !== null ? parseFloat(storedVolume) : 0.5;
});

  const clickSound = new Audio(click);
  clickSound.volume = uiVolume
  const backClickSound = new Audio(backClick);
  backClickSound.volume = uiVolume
  
  const [outdoorItems, setOutdoorItems] = useState([
    { name: 'person', selected: true },
    { name: 'bicycle', selected: true },
    { name: 'car', selected: true },
    { name: 'motorcycle', selected: true },
    { name: 'bus', selected: true },
    { name: 'train', selected: true },
    { name: 'truck', selected: true },
    { name: 'boat', selected: true },
    { name: 'traffic light', selected: true },
    { name: 'fire hydrant', selected: true },
    { name: 'stop sign', selected: true },
    { name: 'parking meter', selected: true },
    { name: 'bench', selected: true },
    { name: 'bird', selected: true },
    { name: 'cat', selected: true },
    { name: 'dog', selected: true },
    { name: 'backpack', selected: true },
    { name: 'umbrella', selected: true },
    { name: 'handbag', selected: true },
    { name: 'suitcase', selected: true },
    { name: 'frisbee', selected: true },
    { name: 'skis', selected: true },
    { name: 'snowboard', selected: true },
    { name: 'sports ball', selected: true },
    { name: 'kite', selected: true },
    { name: 'baseball bat', selected: true },
    { name: 'baseball glove', selected: true },
    { name: 'skateboard', selected: true },
    { name: 'surfboard', selected: true },
    { name: 'tennis racket', selected: true },
    { name: 'banana', selected: true },
    { name: 'apple', selected: true },
    { name: 'sandwich', selected: true },
    { name: 'orange', selected: true },
    { name: 'carrot', selected: true },
    { name: 'hot dog', selected: true },
    { name: 'pizza', selected: true },
    { name: 'donut', selected: true },
    { name: 'cake', selected: true },
    { name: 'potted plant', selected: true }
  ]);

  const playClick = () => {
    if (!username.trim()) return;

    clickSound.play();
    createGame(gameMode, (result) => {
      //updateGame(username, result.roomCode, result.sid, selectedItems);
      //Emit selected items to the server
      navigate("/play");
    });
    navigate("/play");
  };

  // Toggle individual item selection
  const toggleItem = (itemName, isIndoor) => {
    clickSound.play();
    if (isIndoor) {
      setIndoorItems(prevItems => 
        prevItems.map(item => 
          item.name === itemName ? { ...item, selected: !item.selected } : item
        )
      );
    } else {
      setOutdoorItems(prevItems => 
        prevItems.map(item => 
          item.name === itemName ? { ...item, selected: !item.selected } : item
        )
      );
    }
  };

  // Toggle all items in a category
  const toggleAllItems = (isIndoor, selectAll) => {
    clickSound.play();
    if (isIndoor) {
      setIndoorItems(prevItems => 
        prevItems.map(item => ({ ...item, selected: selectAll }))
      );
    } else {
      setOutdoorItems(prevItems => 
        prevItems.map(item => ({ ...item, selected: selectAll }))
      );
    }
  };

  // Get selected items for game
  const getSelectedItems = () => {
    const selectedIndoor = indoorItems.filter(item => item.selected).map(item => item.name);
    const selectedOutdoor = outdoorItems.filter(item => item.selected).map(item => item.name);
    
    if (gameMode === "Item Race" || gameMode === "Item Blitz") {
      return selectedIndoor;
    } else {
      return selectedOutdoor;
    }
  };

  // Common text field styling
  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
        borderWidth: '1px'
      },
      '&:hover fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--primary-color)'
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'var(--primary-color)' // Keep the label color consistent with border
    },
    '& .MuiInputBase-input': {
      color: '#333' // Default text color
    }
  };

  // Select styling
  const selectStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'var(--accent-color)',
        borderWidth: '2px'
      },
      '&:hover fieldset': {
        borderColor: 'var(--accent-color)'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--accent-color)'
      },
      '.MuiSvgIcon-root': {
        color: '#333',
      },
      color: '#333',
      backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    '& .MuiInputLabel-root': {
      color: '#333',
      '&.Mui-focused': {
        color: 'var(--accent-color)'
      }
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: 'white',
          color: '#333',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle style={{ color: '#333' }}>Create a New Game</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            sx={textFieldStyle}
          />
        </FormControl>
        <FormControl fullWidth margin="normal" sx={selectStyle}>
          <InputLabel id="game-mode-label">Game Mode</InputLabel>
          <Select
            labelId="game-mode-label"
            id="game-mode-select"
            value={gameMode}
            label="Game Mode"
            onChange={(e) => { 
              clickSound.play();
              setGameMode(e.target.value);
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: 'white',
                  color: '#333',
                  '& .MuiMenuItem-root': {
                    color: '#333',
                    '&:hover': {
                      backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)'
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(var(--accent-color-rgb), 0.2)',
                      color: 'var(--accent-color)',
                      '&:hover': {
                        backgroundColor: 'rgba(var(--accent-color-rgb), 0.3)'
                      }
                    }
                  }
                }
              }
            }}
          >
            <MenuItem value="Item Race">Item Race</MenuItem>
            <MenuItem value="Item Blitz">Item Blitz</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            backClickSound.play();
            onClose();
          }}
          sx={{ 
            color: '#666',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={playClick}
          variant="contained"
          sx={{ 
            backgroundColor: 'var(--primary-color)',
            '&:hover': {
              backgroundColor: 'var(--button-hover-color)'
            }
          }}
        >
          Create Game
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CreateGameModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateGame: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired
};

export default CreateGameModal;
