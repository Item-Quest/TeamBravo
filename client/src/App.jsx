import { useState, useEffect, useMemo,  } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import socket from './socket';

import Home from './components/Home.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import PlayScreen from './components/PlayScreen.jsx';
import CreateGame from './components/CreateGame.jsx'
import MenuSettings from './components/MenuSettings.jsx';
import ParticlesBackground from './components/ParticlesBackground.jsx'; // <-- import
import {getAllPlayers} from './dataProvider.js';

//Components used in backend for testing
import TestHome from './components/testcomponents/TestHome.jsx';
import TestJoin from './components/testcomponents/TestJoinRoom.jsx';
import TestCreateGame from './components/testcomponents/TestCreateGame.jsx';
import TestLeaderboard from './components/testcomponents/TestLeaderboard.jsx';
import TestGame from './components/testcomponents/TestGame.jsx';






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
          {/*<Route path='/Test' element={<Test/>}/>*/}
          {/*<Route path='/TestLogin' element={<Login/>}/>*/}
          <Route path='/create' element={<CreateGame updateGame={updateGame}/>}/>
          
          {/*Routes for test components for back end*/}
          <Route path='/TestHome' element={<TestHome/>}/>
          <Route path='/TestJoin' element={<TestJoin/>}/>
          <Route path='/TestCreateGame' element={<TestCreateGame/>}/>
          <Route path='/TestLeaderboard' element={<TestLeaderboard/>}/>
          <Route path='/TestGame' element={<TestGame/>}/>
        </Routes>
      </div>
    </main>
  )
}

export default App
