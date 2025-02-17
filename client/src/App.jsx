import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import socket from './socket';

import Home from './components/Home.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import PlayScreen from './components/PlayScreen.jsx';
import Test from './components/Test.jsx';
import Login from './components/login.jsx';
import CreateGame from './components/CreateGame.jsx'
import MenuSettings from './components/MenuSettings.jsx';
import {getAllPlayers} from './dataProvider.js';

function App() {
   const [game, setGame] = useState({
    gameCode: null,
    allPlayers: [],
    gameOwnerIdx: -1,
   });

  useEffect(() => {
    var allPlayers = getAllPlayers();   //retrieve list of all players from server
    var g = {...game};  //temporary copy game object       
    g.allPlayers = allPlayers;
    setGame(g);
  }, []);

  return (
    <main className='main'>
      <div className='component-container'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/play' element={<PlayScreen/>}/>
          <Route path='/leaderboard' element={<Leaderboard players={game.allPlayers}/>}/>
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
