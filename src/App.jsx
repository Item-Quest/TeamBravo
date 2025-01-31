import { useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css'

import Home from './components/Home.jsx'

function App() {

  return (
    <main className='main'>
      <div className='component-container'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/home' element={<Home/>}/>
        </Routes>
      </div>
    </main>
  )
}

export default App
