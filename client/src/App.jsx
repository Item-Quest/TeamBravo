import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import './App.css';
import Home from './components/Home.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Login from './components/login.jsx';
import PlayScreen from './components/PlayScreen.jsx';
import Test from './components/Test.jsx';
import CreateGame from './components/CreateGame.jsx';
import MenuSettings from './components/MenuSettings.jsx';
import { getAllPlayers } from './dataProvider.js';
import ParticlesBackground from './components/ParticlesBackground.jsx'; // <-- import
import { ThemeProvider, useTheme } from './ThemeContext'; // Import ThemeProvider
import './themes.css';
import Game from './components/Game.jsx';
import TestHome from './components/testcomponents/TestHome.jsx';
import TestJoin from './components/testcomponents/TestJoinRoom.jsx';
import TestCreateGame from './components/testcomponents/TestCreateGame.jsx';
import TestLeaderboard from './components/testcomponents/TestLeaderboard.jsx';
import TestGame from './components/testcomponents/TestGame.jsx';

function App() {
  const [game, setGame] = useState({
    gameCode: null,
    allPlayers: [],
    gameOwnerIdx: -1,
  });

  useEffect(() => {
    var allPlayers = getAllPlayers(); //retrieve list of all players from server
    var g = { ...game }; //temporary copy game object
    g.allPlayers = allPlayers;
    setGame(g);
  }, []);

  return (
    <ThemeProvider>
      <AppContent game={game} />
    </ThemeProvider>
  );
}

function AppContent({ game }) {
  const { theme } = useTheme();
  return (
    <main className={`main ${theme}`}>
      <ParticlesBackground />
      <div className='component-container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/play' element={<PlayScreen />} />
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
