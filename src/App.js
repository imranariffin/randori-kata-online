import React from 'react'

import Writer from './code-sync/screens/writer'

import './App.css'

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          {'Randori Kata Online'}
        </h1>
      </header>
      <Writer />
    </div>
  )
}

export default App
