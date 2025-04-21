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

import { createGame, updateUsername } from '../dataProvider.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import defaultpfp from '../assets/defaultpfp.png';

const CreateGameModal = ({ isOpen, onClose, updateGame, navigate }) => {
  const [username, setUsername] = useState("");

  const [gameMode, setGameMode] = useState("ItemRace");

  // Item selection state
  const [indoorItems, setIndoorItems] = useState([
    { name: 'shoe', selected: true },
    { name: 'mug', selected: true },
    { name: 'notebook', selected: true },
    { name: 'phone', selected: true },
    { name: 'water_bottle', selected: true },
    { name: 'plant', selected: true }
  ]);
  
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

    // Get the selected items based on game mode
    const selectedItems = getSelectedItems();
    
    // Only start the game if at least one item is selected
    if (selectedItems.length === 0) {
      alert("Please select at least one item to start the game.");
      return;
    }

    console.log("Creating game with mode:", gameMode, "and items:", selectedItems);
    createGame(gameMode, (result) => {
      updateGame(username, result.roomCode, result.sid, selectedItems);
      updateUsername(username);
    navigate("/play");
  };

  // Toggle individual item selection
  const toggleItem = (itemName, isIndoor) => {
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
            onChange={(e) => setGameMode(e.target.value)}
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

            <MenuItem value="ItemRace">Item Race</MenuItem>
            <MenuItem value="ItemBlitz">Item Blitz</MenuItem>
            <MenuItem value="GeoQuest">Geo</MenuItem>

          </Select>
        </FormControl>
        
        <Accordion 
          expanded={expanded} 
          onChange={() => setExpanded(!expanded)}
          sx={{ 
            mt: 2, 
            boxShadow: 'none', 
            border: '1px solid rgba(0, 0, 0, 0.12)',
            '&:before': {
              display: 'none',
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderBottom: expanded ? '1px solid rgba(0, 0, 0, 0.12)' : 'none'
            }}
          >
            <Typography>
              Select Game Items ({getSelectedItems().length} selected)
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {gameMode === "Item Race" || gameMode === "Item Blitz" ? "Indoor Items" : "Outdoor Items"}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => toggleAllItems(
                    gameMode === "Item Race" || gameMode === "Item Blitz", 
                    true
                  )}
                >
                  Select All
                </Button>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => toggleAllItems(
                    gameMode === "Item Race" || gameMode === "Item Blitz", 
                    false
                  )}
                >
                  Deselect All
                </Button>
              </Box>
              
              <Box sx={{ maxHeight: '200px', overflow: 'auto', mt: 1 }}>
                <Grid container spacing={1}>
                  {(gameMode === "Item Race" || gameMode === "Item Blitz" ? indoorItems : outdoorItems).map((item, index) => (
                    <Grid item xs={6} key={index}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          p: 1,
                          border: '1px solid',
                          borderColor: item.selected ? 'var(--accent-color)' : 'rgba(0,0,0,0.12)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          backgroundColor: item.selected ? 'rgba(var(--accent-color-rgb), 0.1)' : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: item.selected 
                              ? 'rgba(var(--accent-color-rgb), 0.2)' 
                              : 'rgba(0,0,0,0.04)'
                          }
                        }}
                        onClick={() => toggleItem(
                          item.name, 
                          gameMode === "Item Race" || gameMode === "Item Blitz"
                        )}
                      >
                        <Box 
                          sx={{ 
                            width: '20px', 
                            height: '20px', 
                            borderRadius: '4px',
                            border: '2px solid',
                            borderColor: item.selected ? 'var(--accent-color)' : 'rgba(0,0,0,0.38)',
                            mr: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-color)',
                            fontSize: '16px'
                          }}
                        >
                          {item.selected && '✓'}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img 
                            src={defaultpfp} 
                            alt={item.name}
                            style={{ 
                              width: '24px', 
                              height: '24px', 
                              borderRadius: '4px',
                              marginRight: '8px',
                              border: '1px solid rgba(0,0,0,0.12)'
                            }} 
                          />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              textTransform: 'capitalize',
                              fontWeight: item.selected ? 'bold' : 'normal'
                            }}
                          >
                            {item.name.replace('_', ' ')}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose}
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
