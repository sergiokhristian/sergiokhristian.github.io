import { useState } from 'react'
import Home from './pages/Home'
import TripPlanner from './pages/TripPlanner'

function App() {
  const [page, setPage] = useState('tripPlanner')

  return page === 'home' ? (
    <Home onPlay={() => setPage('tripPlanner')} />
  ) : (
    <TripPlanner onBack={() => setPage('home')} />
  )
}

export default App
