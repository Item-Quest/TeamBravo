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
import ParticlesBackground from './components/ParticlesBackground.jsx'; // <-- import

function App() {
   const [game, setGame] = useState({
    roomCode: null,
    userSid: null,
    username: null
   });

   const updateGame = (uName, rCode, sid) => {
    var g = {...game};
    if (sid) 
      g.userSid = sid;
    if (rCode) 
      g.roomCode = rCode;
    g.username = uName ? uName : "Anonymous";
    setGame(g);
   }

  useEffect(() => {
    
  }, []);

  return (
    <main className='main'>
      <ParticlesBackground />
      <div className='component-container'>
        <Routes>
          <Route path='/' element={<Home game={game} updateGame={updateGame}/>}/>
          <Route path='/home' element={<Home game={game} updateGame={updateGame}/>}/>
          <Route path='/play' element={<PlayScreen game={game}/>}/>
          <Route path='/leaderboard' element={<Leaderboard/>}/>
          <Route path='/MenuSettings' element={<MenuSettings/>}/>
          <Route path='/Test' element={<Test/>}/>
          <Route path='/TestLogin' element={<Login/>}/>
          <Route path='/create' element={<CreateGame updateGame={updateGame}/>}/>
        </Routes>
      </div>
    </main>
  )
}

export default App
