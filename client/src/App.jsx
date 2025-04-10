import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './App.css';

import Home from './components/Home.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Login from './components/login.jsx';
import PlayScreen from './components/PlayScreen.jsx';
import Game from './components/Game.jsx';
import Test from './components/Test.jsx';
import MenuSettings from './components/MenuSettings.jsx';
import { getAllPlayers } from './dataProvider.js';
import ParticlesBackground from './components/ParticlesBackground.jsx'; // <-- import
import { ThemeProvider, useTheme } from './ThemeContext'; // Import ThemeProvider
import './themes.css';
import CreateGameModal from './components/CreateGameModal.jsx';

// Import audio assets
import lobbyMusic from './assets/LobbyMusic1.mp3';

// Import audio control icons
import { Box, IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

function App() {
  const [game, setGame] = useState({
    gameCode: null,
    allPlayers: [],
    gameOwnerIdx: -1,
  });

  const updateGame = (uName, rCode, sid) => {
    var g = {...game};
    if (sid) 
      g.userSid = sid;
    if (rCode) 
      g.roomCode = rCode;
    g.username = uName ? uName : "Anonymous";
    console.log("successfully updated the game");
    setGame(g);
    console.log("successfully updated the game");
   }

  useEffect(() => {
    // var allPlayers = getAllPlayers(); //retrieve list of all players from server
    // var g = { ...game }; //temporary copy game object
    // g.allPlayers = allPlayers;
    // setGame(g);
  }, []);

  return (
    <ThemeProvider>
      <AppContent game={game} updateGame={updateGame} />
    </ThemeProvider>
  );
}

function AppContent({ game, updateGame }) {
  const { theme } = useTheme();
  const location = useLocation();
  const [isMuted, setIsMuted] = useState(() => {
    const storedMuted = localStorage.getItem('musicMuted');
    return storedMuted === 'true';
  });
  const [volume, setVolume] = useState(() => {
    const storedVolume = localStorage.getItem('musicVolume');
    return storedVolume !== null ? parseFloat(storedVolume) : 0.5;
  });
  const audioRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(lobbyMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = isMuted ? 0 : volume;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Control audio based on route
  useEffect(() => {
    // Play music on all screens except PlayScreen
    if (location.pathname !== '/play') {
      if (audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Audio playback failed:", error);
          });
        }
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [location.pathname]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Check for volume changes from MenuSettings
  useEffect(() => {
    const checkVolumeChanges = () => {
      const storedVolume = localStorage.getItem('musicVolume');
      if (storedVolume !== null && parseFloat(storedVolume) !== volume) {
        setVolume(parseFloat(storedVolume));
      }
    };

    // Check every second for changes
    const intervalId = setInterval(checkVolumeChanges, 1000);
    
    return () => clearInterval(intervalId);
  }, [volume]);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem('musicMuted', newMutedState.toString());
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    localStorage.setItem('musicVolume', newValue.toString());
  };

  return (
    <main className={`main ${theme}`}>
      <ParticlesBackground />
      {/* Audio Controls - Mute Button Only */}
      <Box 
        sx={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '50%',
          padding: '8px',
          visibility: (location.pathname !== '/play') ? 'visible' : 'hidden'
        }}
      >
        <IconButton color="inherit" onClick={toggleMute} size="small" sx={{ color: 'white' }}>
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
      </Box>
      <div className='component-container'>
        <Routes>
          <Route path='/' element={<Home updateGame={updateGame}/>} />
          <Route path='/home' element={<Home updateGame={updateGame}/>} />
          <Route path='/play' element={<Game game={game}/>}/>
          <Route path='/leaderboard'
                 element={<Leaderboard players={game.allPlayers} />}
          />
          <Route path='/MenuSettings' element={<MenuSettings />} />
          <Route path='/Test' element={<Test />} />
          <Route path='/TestLogin' element={<Login />} />
          <Route path='/create' element={<CreateGameModal game={game} />} />
        </Routes>
      </div>
    </main>
  );
}

AppContent.propTypes = {
  game: PropTypes.shape({
    allPlayers: PropTypes.array,
  }),
};

export default App;
