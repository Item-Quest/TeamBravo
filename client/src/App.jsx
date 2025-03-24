import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import './App.css';

import Home from './components/Home.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Login from './components/login.jsx';
import PlayScreen from './components/PlayScreen.jsx';
import Game from './components/Game.jsx';
import Test from './components/Test.jsx';
import CreateGame from './components/CreateGame.jsx';
import MenuSettings from './components/MenuSettings.jsx';
import { getAllPlayers } from './dataProvider.js';
import ParticlesBackground from './components/ParticlesBackground.jsx'; // <-- import
import { ThemeProvider, useTheme } from './ThemeContext'; // Import ThemeProvider
import './themes.css';

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
  return (
    <main className={`main ${theme}`}>
      <ParticlesBackground />
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
          <Route path='/create' element={<CreateGame game={game} />} />
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
