import { useState } from 'react'
import LawnCareScheduler from './components/LawnCareScheduler'
import AnimatedLawnTractor from './components/AnimatedLawnTractor'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <h1 className="text-2xl font-bold text-center mb-2">Lawn Care Scheduler</h1>
      <div className="container mx-auto px-4 max-w-lg">
        <LawnCareScheduler />
        <AnimatedLawnTractor />
      </div>
    </div>
  )
}

export default App