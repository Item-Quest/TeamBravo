import { useState, useEffect, useMemo,  } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import socket from './socket';

import Home from './components/Home.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Login from './components/login.jsx';
import Room from './components/Room.jsx';
import PlayScreen from './components/PlayScreen.jsx';
import Test from './components/Test.jsx';
import CreateGame from './components/CreateGame.jsx'
import MenuSettings from './components/MenuSettings.jsx';
import {getAllPlayers} from './dataProvider.js';
<<<<<<< Updated upstream
import ParticlesBackground from './components/ParticlesBackground.jsx'; // <-- import
=======
>>>>>>> Stashed changes

function App() {
   const [game, setGame] = useState({
    roomCode: null,
    allPlayers: [],
    userSid: null,
    username: null
   });

  useEffect(() => {
    var allPlayers = getAllPlayers();   //retrieve list of all players from server
    var g = {...game};  //temporary copy game object       
    g.allPlayers = allPlayers;
    setGame(g);
  }, []);

  return (
    <main className='main'>
      <ParticlesBackground />
      <div className='component-container'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/play' element={<PlayScreen/>}/>
          <Route path='/leaderboard' element={<Leaderboard/>}/>
          <Route path='/MenuSettings' element={<MenuSettings/>}/>
          <Route path='/Test' element={<Test/>}/>
          <Route path='/TestLogin' element={<Login/>}/>
          <Route path='/create' element={<CreateGame game={game} setGame={setGame}/>}/>
        </Routes>
      </div>
    </main>
  )
}

export default App
