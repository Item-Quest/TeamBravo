import { useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css'

import Home from './components/Home.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import PlayCreate from './components/PlayCreate.jsx';
import JoinRoom from './components/JoinRoom.jsx';

function App() {

  return (
    <main className='main'>
      <div className='component-container'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/leaderboard' element={<Leaderboard/>}/>
          <Route path='/PlayCreate' element={<PlayCreate/>}/>
          <Route path='/JoinRoom' element={<JoinRoom/>}/>
          
        </Routes>
      </div>
    </main>
  )
}

export default App
