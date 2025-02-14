import { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import socket from './socket';

import Home from './components/Home.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import PlayScreen from './components/PlayScreen.jsx';
import Test from './components/Test.jsx';
import Login from './components/login.jsx'




function App() {

  return (
    <main className='main'>
      <div className='component-container'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/play' element={<PlayScreen/>}/>
          <Route path='/leaderboard' element={<Leaderboard/>}/>
          <Route path='/Test' element={<Test/>}/>
          <Route path='/TestLogin' element={<Login/>}/>
        </Routes>
      </div>
    </main>
  )
}

export default App
