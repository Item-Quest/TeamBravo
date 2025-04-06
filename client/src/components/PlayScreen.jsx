import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import socket from '../socket';
import { connectGame } from '../dataProvider.js';

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
  MenuItem
} from '@mui/material';
import SkipNextIcon from '@mui/icons-material/SkipNext';

// Import logo
import logo from '../assets/logo2.png';

const PlayScreen = (props) => {
  console.log(props.gameState, "Gamestate");
  const [usersInRoom, updateUsersInRoom] = useState([]);
  const [time, updateTime] = useState(0);
  const [item, updateItem] = useState([]);
  const [input, updateInput] = useState("");
  const [yourScore, setYourScore] = useState(0);
  const intervalRef = useRef(null);
  const [roomCode, updateRoomCode] = useState("");
  const [gameMode, setGameMode] = useState("ItemRace");
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

  useEffect(() => {
    connectGame((data) => {
      console.log("data received", data);
      console.log(socket.id);
      // Extract current item
      if(data.items){
        updateItem(data.items);
        console.log(data.items);
        //Grab client's score for the purposes of only displaying item associated with score
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
      if (gameMode === "ItemRace") {
        interval = setInterval(() => {
          updateTime((prev) => prev + 1);
        }, 1000);
      }
  
      if (gameMode === "ItemBlitz") {
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
    socket.emit('start game', { mode: gameMode });
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
      socket.emit('submit', {submit:input});
    } else if(props.AIOutput === item[yourScore%item.length]){
      socket.emit('submit',{submit:props.AIOutput});
    }
    updateInput("");
  }
  
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

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <img
                src={logo}
                alt="Logo"
                style={{ width: '200px', cursor: 'pointer' }}
                onClick={() => setIsMenuOpen(true)}
              />
            </Grid>
            <Grid item xs={4} align="center">
              <Typography variant="h5">
                {props.gameState === "waiting" ? "Waiting for game to start" : "Game in progress"}
              </Typography>
            </Grid>
            <Grid item xs={4} align="right">
              {roomCode && (
                <Typography variant="h6">
                  Room Code: {roomCode}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box 
                sx={{ 
                  width: '100%', 
                  height: 'auto', 
                  maxHeight: '480px', 
                  overflow: 'hidden',
                  borderRadius: '8px',
                  backgroundColor: '#000'
                }}
              >
                {props.camera ? props.camera : <div>Camera not available</div>}
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                  Detected Item: {props.AIOutput || "Nothing detected"}
                </Typography>
                <Box sx={{ display: 'flex', mt: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={input}
                    onChange={changeInput}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter Item"
                    size="small"
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={submit}
                    sx={{ ml: 1 }}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>Game Info</Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">Timer</Typography>
                    <Typography variant="h6">
                      {time > 0 ? formatTime(time) : "00:00"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">Current Item</Typography>
                    <Typography variant="h6">
                      {props.gameState === "running" && item.length > 0 
                        ? item[yourScore % item.length] 
                        : "None"}
                    </Typography>
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

              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>Skips</Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  {Array.from({ length: skips }, (_, i) => (
                    <SkipNextIcon key={i} color="primary" />
                  ))}
                </Box>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={handleSkip}
                  disabled={skips === 0 || props.gameState !== "running"}
                  fullWidth
                >
                  Skip Item
                </Button>
                {isResetTimerActive && (
                  <Box mt={1}>
                    <Typography variant="subtitle2">Recharge: {formattedResetTime}</Typography>
                  </Box>
                )}
              </Paper>

              <Paper sx={{ p: 2 }}>
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
                    <Select
                      value={gameMode}
                      onChange={(e) => setGameMode(e.target.value)}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                    >
                      <MenuItem value="ItemRace">Item Race</MenuItem>
                      <MenuItem value="ItemBlitz">Item Blitz</MenuItem>
                    </Select>
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
                
                <Button 
                  variant="outlined" 
                  color="info" 
                  onClick={() => setShowDebugInfo(true)}
                  fullWidth
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Debug Info
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Winner Dialog */}
      <Dialog 
        open={showPopUp} 
        onClose={() => updatePopUp(false)}
      >
        <DialogTitle>Game Over!</DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            {winner} wins with a time of {winnerTime} seconds
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => updatePopUp(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Debug Info Dialog */}
      <Dialog 
        open={showDebugInfo} 
        onClose={() => setShowDebugInfo(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Debug Information</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>Game State</Typography>
          <Box sx={{ p: 1, border: '1px solid #ccc', mb: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
              {`Current Game State: ${props.gameState || 'undefined'}`}
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>Socket Info</Typography>
          <Box sx={{ p: 1, border: '1px solid #ccc', mb: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
              {`Socket ID: ${socket.id || 'Not connected'}`}
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>Current Item</Typography>
          <Box sx={{ p: 1, border: '1px solid #ccc', mb: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
              {`Current Item: ${item.length > 0 ? item[yourScore % item.length] : 'No items'}`}
              {`\nAll Items: ${JSON.stringify(item)}`}
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>Timer Info</Typography>
          <Box sx={{ p: 1, border: '1px solid #ccc', mb: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
              {`Time: ${time}`}
              {`\nGame Mode: ${gameMode}`}
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>AI Detection</Typography>
          <Box sx={{ p: 1, border: '1px solid #ccc', mb: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
              {`Detected Output: ${props.AIOutput || 'Nothing detected'}`}
              {`\nMatches Current Item: ${props.AIOutput === (item.length > 0 ? item[yourScore % item.length] : '') ? 'true' : 'false'}`}
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>Players</Typography>
          <Box sx={{ p: 1, border: '1px solid #ccc', mb: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
              {JSON.stringify(usersInRoom, null, 2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDebugInfo(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Menu Dialog */}
      <Dialog open={isMenuOpen} onClose={handleMenuClose}>
        <DialogTitle>Quit Game?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to quit?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMenuClose}>Cancel</Button>
          <Button 
            onClick={handleQuit} 
            color="error"
          >
            Quit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
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