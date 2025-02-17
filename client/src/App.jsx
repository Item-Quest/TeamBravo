import { useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css'

import Home from './components/Home.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import PlayScreen from './components/PlayScreen.jsx';
import MenuSettings from './components/MenuSettings.jsx';

function App() {

  return (
    <main className='main'>
      <div className='component-container'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/play' element={<PlayScreen/>}/>
          <Route path='/leaderboard' element={<Leaderboard/>}/>
          <Route path='/MenuSettings' element={<MenuSettings/>}/>
        </Routes>
      </div>
    </main>
  )
}

export default App
