import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import socket from '../socket';
import { connectGame, getGameMode } from '../dataProvider.js';
import { setModelMode } from "../utils/imagePredict.js";

// Material-UI imports
import {
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Import logo
import logo from '../assets/logo2.png';
import defaultpfp from '../assets/defaultpfp.png';

import click from "../assets/SFX/click.wav"
import pointGained from "../assets/SFX/pointgained.wav"
import skipUsed from "../assets/SFX/skipused.wav"
import skipCharged from "../assets/SFX/skipcharged.wav"

const PlayScreen = (props) => {
  console.log(props.gameState, "Gamestate");
  const [usersInRoom, updateUsersInRoom] = useState([]);
  const [time, updateTime] = useState(0);
  const [item, updateItem] = useState([]);
  const [input, updateInput] = useState("");
  const [yourScore, setYourScore] = useState(0);
  const intervalRef = useRef(null);
  const [roomCode, updateRoomCode] = useState("");
  const [gameMode, setGameMode] = useState("Item Race");
  const navigate = useNavigate();
  const [firstTime, setFirstTime] = useState(true); //for count down timer
  const [showPopUp, updatePopUp] = useState(false);
  const [winner, updateWinner] = useState("");
  const [winnerTime, updateWinnerTime] = useState("");
  
  // New state variables for enhanced UI
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  const [opponent, setOpponent] = useState({ score: 0 });
  const [skips, setSkips] = useState(3);
  const [isResetTimerActive, setIsResetTimerActive] = useState(false);
  const [formattedResetTime, setFormattedResetTime] = useState("00:00");
  const [showCorrectBanner, setShowCorrectBanner] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

    const [uiVolume] = useState(() => {
      const storedVolume = localStorage.getItem('uiVolume');
      return storedVolume !== null ? parseFloat(storedVolume) : 0.5;
    });
    const clickSound = new Audio(click);
    clickSound.volume = uiVolume
    const pointSound = new Audio(pointGained);
    pointSound.volume = uiVolume
    const skipUsedSound = new Audio(skipUsed);
    skipUsedSound.volume = uiVolume
    const skipChargedSound = new Audio(skipCharged);
    skipChargedSound.volume = uiVolume
  
  // Item selection state
  const [indoorItems, setIndoorItems] = useState([
    { name: 'mug', selected: true },
    { name: 'phone', selected: true },
    { name: 'water_bottle', selected: true },
    { name: 'plant', selected: true },
    { name: 'book_bag', selected: true },
    { name: 'tv', selected: true },
    { name: 'laptop', selected: true },
    { name: 'frisbee', selected: true },
    { name: 'baseball_bat', selected: true },
    { name: 'banana', selected: true },
    { name: 'apple', selected: true },
    { name: 'orange', selected: true },
    { name: 'carrot', selected: true },
    { name: 'sandwich', selected: true },
    { name: 'tie', selected: true },
    { name: 'wine_glass', selected: true },
    { name: 'knife', selected: true },
    { name: 'bowl', selected: true },
    { name: 'scissors', selected: true },
    { name: 'toothbrush', selected: true },
    { name: 'football', selected: true },
    { name: 'book', selected: true }
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
  
  const [showItemSelection, setShowItemSelection] = useState(false);

  useEffect(() => {
    connectGame((data) => {
      console.log("data received", data);
      console.log(socket.id);
      // Extract current item
      if(data.items){
        console.log("Game mode received from server:", data.gameMode);
        updateItem(data.items);
        console.log(data.items);
        //Grab client's score for the purposes of only displaying item associated with score
      }
      if(data.game_mode) {
        setGameMode(data.game_mode);
        setModelMode(data.game_mode);
      }
      // Extract game state
      if(data.game_state){
        props.updateGameState(data.game_state);
        if(props.gameState === "waiting"){
          if(props.AIOutput !== ""){
            props.updateAIOutput("");
          }
        }
      }
      // Extract Room code
      if(data.room_code){
        updateRoomCode(data.room_code);
      }

      // Extract user data
      const users = {};
      Object.entries(data).forEach(([key,value]) => {
        if(key.startsWith("user:")) {
          const [, socketID, field] = key.split(":");
          if(!users[socketID]){
            users[socketID] = {};
          }
          users[socketID][field] = value;
        }
      });

      //convert user data to array
      const usersArray = Object.values(users);
      updateUsersInRoom(usersArray);
      //set player score
      if (users[socket.id]) {
        setYourScore(users[socket.id].score);
      }
      
      // Set opponent (first user that's not you)
      const otherUsers = usersArray.filter(user => user.id !== socket.id);
      if (otherUsers.length > 0) {
        setOpponent(otherUsers[0]);
      }
    });

    socket.on('start game', () => {
      updateTime(0);
      setFirstTime(true);
      updatePopUp(false);
      // Reset skips when game starts
      setSkips(3);
      setIsResetTimerActive(false);

      getGameMode((gameMode) => {
        if (gameMode) {
            console.log("Game mode received:", gameMode);
            setModelMode(gameMode);
            setGameMode(gameMode);
        } else {
            console.error("Failed to retrieve game mode.");
        }
    });

    });

    socket.on('point', () => {
      setShowCorrectBanner(true);
      setTimeout(() => setShowCorrectBanner(false), 2000);
    });

    socket.on('winner', (data) => {
      updatePopUp(true);
      updateWinner(data.message);
      updateWinnerTime(data.time);
    });

    return () => {
      socket.emit('leave game');
    };
  }, []);

  //timer effect for both game modes
  useEffect(() => {
    let interval;
    if (props.gameState === "running") {
      if (gameMode === "Item Race") {
        interval = setInterval(() => {
          updateTime((prev) => prev + 1);
        }, 1000);
      }
  
      if (gameMode === "Item Blitz") {
        if (time === 0 && firstTime) {
          // Set the initial time only once when countdown starts
          updateTime(120);
          setFirstTime(false);
        } else if (!firstTime) {
          interval = setInterval(() => {
            updateTime((prev) => {
              if (prev > 0) {
                return prev - 1;
              } else {
                endGame(); 
                return 0; 
              }
            });
          }, 1000);
        }
      }
      
      intervalRef.current = interval;
    }
    
    return () => clearInterval(intervalRef.current);
  
  }, [props.gameState, gameMode, time, firstTime]);

  // Auto-submit when AI detects the correct item
  useEffect(() => {
    if (props.AIOutput && props.AIOutput === item[yourScore % item.length]) {
      submit();
    }
  }, [props.AIOutput, item, yourScore]);

  function startGame(){
    clickSound.play();
    // Get the selected items based on game mode
    const selectedItems = getSelectedItems();
    
    // Only start the game if at least one item is selected
    if (selectedItems.length === 0) {
      alert("Please select at least one item to start the game.");
      return;
    }
    
    // Send selected items and game mode to server
    socket.emit('start game', { 
      mode: gameMode,
      items: selectedItems
    });
  }

  function endGame(){
    socket.emit('end game');
  }

  function changeInput(event){
    updateInput(event.target.value);
  }

  function submit(){
    console.log("submit attempt: ", input, " ", item[yourScore%item.length]);
    if(input === item[yourScore%item.length]){
      socket.emit('submit', {submit:input, mode: gameMode});
      setShowCorrectBanner(true);
      setTimeout(() => setShowCorrectBanner(false), 2000);
    } else if(props.AIOutput === item[yourScore%item.length]){
      socket.emit('submit',{submit:props.AIOutput, mode: gameMode});
      setShowCorrectBanner(true);
      setTimeout(() => setShowCorrectBanner(false), 2000);
    }
    updateInput("");
  }
  //debug
  useEffect(() => {
    console.log("showCorrectBanner changed to:", showCorrectBanner);
  }, [showCorrectBanner]);
  
  // Handle Enter key press for item submission
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && props.gameState === "running") {
      event.preventDefault();
      submit();
    }
  };

  // New functions for enhanced UI
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSkip = () => {
    if (skips > 0 && props.gameState === "running") {
      skipUsedSound.play();
      setSkips(prev => prev - 1);
      
      // Emit skip item event to server
      socket.emit('skip item');
      
      // Locally advance to the next item immediately for better UX
      // This assumes the server will confirm this change
      setYourScore(prev => prev + 1);
      
      // Clear any current AI detection
      if (props.updateAIOutput) {
        props.updateAIOutput("");
      }
      
      // Start reset timer
      setIsResetTimerActive(true);
      let resetTime = 30; // 30 second cooldown
      const resetInterval = setInterval(() => {
        resetTime -= 1;
        setFormattedResetTime(`${Math.floor(resetTime / 60)}:${(resetTime % 60).toString().padStart(2, '0')}`);
        
        if (resetTime <= 0) {
          skipChargedSound.play();
          clearInterval(resetInterval);
          setIsResetTimerActive(false);
          setSkips(prev => prev + 1);
        }
      }, 1000);
    }
  };
  
  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };
  
  const handleQuit = () => {
    socket.emit('leave game');
    navigate('/');
  };

  function setModes(givenMode) {
    console.log("game mode set to: ", givenMode);
    setGameMode(givenMode); //for display purposes
    setModelMode(givenMode); //for AI model

    //for server
    socket.emit('set gamemode', givenMode);
  }

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

  // Select styling for game mode dropdown
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
    <div style={{display: 'flex', justifyContent: 'center', width: '100%', boxSizing: 'border-box'}}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh', 
        width: '100%',
        overflow: 'auto',
        position: 'relative',
        boxSizing: 'border-box',
        maxWidth: '100%'
      }}>
        <Grid container spacing={0} sx={{ 
          p: 2, 
          flexGrow: 0,
          justifyContent: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          <Grid item xs={12} sx={{ boxSizing: 'border-box', maxWidth: '100%' }}>
            <Grid container spacing={2} alignItems="center" sx={{ boxSizing: 'border-box', maxWidth: '100%' }}>
              <Grid item xs={4}>
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: '200px', cursor: 'pointer' }}
                  onClick={() => setIsMenuOpen(true)}
                />
              </Grid>
              <Grid item xs={4} align="center">
                <Paper sx={{
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  border: '2px solid var(--accent-color)'
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                    {props.gameState === "waiting" ? "Waiting for game to start" : "Game in progress"}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={4} align="right">
                {roomCode && (
                  <Tooltip title="Click to copy">
                    <Typography
                      variant="h5"
                      onClick={() => {
                        navigator.clipboard.writeText(roomCode);
                        setShowCopyToast(true);
                        clickSound.play();
                      }}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'var(--accent-color)',
                          textDecoration: 'underline'
                        },
                        transition: 'color 0.2s'
                      }}
                    >
                      Room Code: {roomCode}
                    </Typography>
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            overflow: 'auto',
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: '100%',
            padding: { xs: '8px', md: '16px' }
          }}>
            <Box sx={{ 
              maxWidth: '1200px', 
              width: '100%',
              boxSizing: 'border-box',
              //maxWidth: '100%'
            }}>
              <Grid container spacing={2} sx={{ 
                maxWidth: '1200px', 
                margin: '0 auto',
                boxSizing: 'border-box',
                width: '100%'
              }}>
                <Grid item xs={12} md={8}>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 'auto', 
                      maxHeight: '480px', 
                      overflow: 'auto',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '12px',
                    }}
                  >
                    {/* Camera Container */}
                    <Box
                      sx={{
                        width: "90%",
                        flex: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "12px",
                        padding: 0,
                        overflow: "hidden",
                        position: "relative",
                        border: "12px solid var(--text-color)",
                        borderColor: showCorrectBanner ? 'green' : 'black',
                        boxShadow: "0 4px 0 rgba(0, 0, 0, 0.2)",
                        zIndex: 1,
                        mb: { xs: 1, sm: 1 },
                        minHeight: { xs: "300px", sm: "400px" }
                      }}
                    >
                      {props.camera ? props.camera : <div>Camera not available</div>}
                      
                      {/* Camera overlay with instructions */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: { xs: 1, sm: 2 },
                          background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                          display: "flex",
                          alignItems: "center",
                          zIndex: 2
                        }}
                      >
                        <InfoOutlinedIcon sx={{ mr: 1, color: "var(--accent-color)", fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: "white",
                            fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
                            fontSize: { xs: "0.7rem", sm: "0.9rem" },
                            textTransform: "uppercase"
                          }}
                        >
                          Position items clearly in frame for best results
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">
                      Detected Item: {props.AIOutput || "Nothing detected"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
                    <Typography variant="h6" gutterBottom>Game Info</Typography>
                    
                    <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                      <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="subtitle1">Timer</Typography>
                        <Typography variant="h6">
                          {time > 0 ? formatTime(time) : "00:00"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="subtitle1">Current Item</Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%'
                        }}>
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            {props.gameState === "running" && item.length > 0 
                              ? item[yourScore % item.length] 
                              : "None"}
                          </Typography>
                          <img 
                            src={defaultpfp} 
                            alt="Item" 
                            style={{ 
                              width: '60px', 
                              height: '60px', 
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '2px solid var(--accent-color)'
                            }} 
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>Scores</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">Your Score</Typography>
                        <Typography variant="h6">{yourScore}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">Opponent Score</Typography>
                        <Typography variant="h6">{opponent.score || 0}</Typography>
                      </Grid>
                    </Grid>
                  </Paper> */}


                  <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                    <Typography variant="h6" gutterBottom>Connected Players</Typography>
                    <List dense>
                      {usersInRoom.map((user, index) => (
                        <ListItem key={index}>
                          <ListItemText 
                            primary={user.username || "Anonymous"} 
                            secondary={`${user.score || 0} points`} 
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    {props.gameState === "waiting" && ( 
                      <Box mt={2}>
                        <Typography variant="subtitle1" gutterBottom>Game Mode</Typography>
                        <FormControl fullWidth sx={{ mb: 1 }}>
                          <InputLabel id="game-mode-label">Select Mode</InputLabel>
                          <Select
                            labelId="game-mode-label"
                            id="game-mode-select"
                            value={gameMode}
                            label="Select Mode"
                            onChange={(e) => {
                              //handles display, Ai model, and server modes
                              setModes(e.target.value);
                            }}
                            sx={selectStyle}
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
                        
                        <Button 
                          variant="outlined" 
                          color="info" 
                          onClick={() => setShowItemSelection(!showItemSelection)}
                          fullWidth
                          sx={{ mb: 1 }}
                        >
                          {showItemSelection ? "Hide Item Selection" : "Show Item Selection"}
                        </Button>
                        
                        {showItemSelection && (
                          <Paper sx={{ p: 2, mb: 2, maxHeight: '300px', overflow: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
                            <Typography variant="subtitle1" gutterBottom>
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
                            
                            <Grid container spacing={1}>
                              {(gameMode === "Item Race" || gameMode === "Item Blitz" ? indoorItems : outdoorItems).map((item, index) => (
                                <Grid item xs={6} sm={4} key={index}>
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
                                        borderColor: item.selected ? 'var(--accent-color)' : 'rgba(0,0,0,0.4)',
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
                                </Grid>
                              ))}
                            </Grid>
                            
                            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                              Selected items: {(gameMode === "Item Race" || gameMode === "Item Blitz" 
                                ? indoorItems 
                                : outdoorItems).filter(item => item.selected).length}
                            </Typography>
                          </Paper>
                        )}
                        
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={startGame}
                          fullWidth
                          sx={{ mb: 1 }}
                        >
                          Start Game
                        </Button>
                      </Box>
                    )}
                    
                    {props.gameState === "running" && (
                      <Box mt={2}>
                        <Button 
                          variant="contained" 
                          color="error" 
                          onClick={endGame}
                          fullWidth
                          sx={{ mb: 1 }}
                        >
                          End Game
                        </Button>
                      </Box>
                    )}
                    
                   
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* Winner Dialog */}
        <Dialog 
          open={showPopUp} 
          onClose={() => updatePopUp(false)}
          PaperProps={{
            style: {
              backgroundColor: 'white',
              color: '#333',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
            }
          }}
        >
          <DialogTitle style={{ color: '#333' }}>Game Over!</DialogTitle>
          <DialogContent>
            <Typography variant="h6" style={{ color: '#333' }}>
              {winner} wins with a time of {winnerTime} seconds
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => updatePopUp(false)}
              sx={{ 
                color: 'var(--primary-color)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        Debug Info Dialog
        <Dialog 
          open={showDebugInfo} 
          onClose={() => setShowDebugInfo(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: 'white',
              color: '#333',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <DialogTitle style={{ color: '#333' }}>Debug Information</DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom style={{ color: '#333' }}>Game State</Typography>
            <Box sx={{ p: 1, border: '1px solid #ccc', mb: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', color: '#333' }}>
                {`Current Game State: ${props.gameState || 'undefined'}`}
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom style={{ color: '#333' }}>Socket Info</Typography>
            <Box sx={{ p: 1, border: '1px solid #ccc', mb: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', color: '#333' }}>
                {`Socket ID: ${socket.id || 'Not connected'}`}
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom style={{ color: '#333' }}>Current Item</Typography>
            <Box sx={{ p: 1, border: '1px solid #ccc', mb: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', color: '#333' }}>
                {`Current Item: ${item.length > 0 ? item[yourScore % item.length] : 'No items'}`}
                {`\nAll Items: ${JSON.stringify(item)}`}
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom style={{ color: '#333' }}>Timer Info</Typography>
            <Box sx={{ p: 1, border: '1px solid #ccc', mb: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', color: '#333' }}>
                {`Time: ${time}`}
                {`\nGame Mode: ${gameMode}`}
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom style={{ color: '#333' }}>AI Detection</Typography>
            <Box sx={{ p: 1, border: '1px solid #ccc', mb: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', color: '#333' }}>
                {`Detected Output: ${props.AIOutput || 'Nothing detected'}`}
                {`\nMatches Current Item: ${props.AIOutput === (item.length > 0 ? item[yourScore % item.length] : '') ? 'true' : 'false'}`}
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom style={{ color: '#333' }}>Players</Typography>
            <Box sx={{ p: 1, border: '1px solid #ccc', mb: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', color: '#333' }}>
                {JSON.stringify(usersInRoom, null, 2)}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setShowDebugInfo(false)}
              sx={{ 
                color: 'var(--primary-color)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Menu Dialog */}
        <Dialog 
          open={isMenuOpen} 
          onClose={handleMenuClose}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: 'white',
              color: '#333',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <DialogTitle style={{ color: '#333' }}>Quit Game?</DialogTitle>
          <DialogContent>
            <Typography style={{ color: '#333' }}>Are you sure you want to quit?</Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleMenuClose}
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
              onClick={handleQuit} 
              variant="contained"
              sx={{ 
                backgroundColor: 'var(--primary-color)',
                '&:hover': {
                  backgroundColor: 'var(--button-hover-color)'
                }
              }}
            >
              Quit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Copy Toast */}
        <Snackbar
          open={showCopyToast}
          autoHideDuration={2000}
          onClose={() => setShowCopyToast(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setShowCopyToast(false)}
            severity="success"
            sx={{ width: '100%', bgcolor: 'var(--accent-color)', color: 'white' }}
          >
            Room code copied to clipboard!
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
};

// Add PropTypes validation
PlayScreen.propTypes = {
  updateGameState: PropTypes.func,
  AIOutput: PropTypes.string,
  updateAIOutput: PropTypes.func,
  game: PropTypes.object,
  camera: PropTypes.node,
  getAIOutput: PropTypes.func,
  gameState: PropTypes.string
};

export default PlayScreen;