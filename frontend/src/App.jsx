import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Header from './components/Header'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Dashboard />
    </div>
  )
}

export default App
