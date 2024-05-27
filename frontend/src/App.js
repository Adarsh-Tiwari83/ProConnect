import React from 'react'
import Main from './components/Main'
import { Route, Routes } from 'react-router-dom'
import Signin from './components/Signin'


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Signin/>}/>
        <Route path='/main' element={<Main/>}/>
      </Routes>
    </div>
  )
}

export default App
