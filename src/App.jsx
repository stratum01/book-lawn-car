import LawnCareScheduler from './components/LawnCareScheduler'
import AnimatedLawnTractor from './components/AnimatedLawnTractor'
import SeasonalTip from './components/SeasonalTip'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <h1 className="text-2xl font-bold text-center mb-2">Lawn Care Scheduler</h1>
      <div className="container mx-auto px-4 max-w-lg">
        <LawnCareScheduler />
        <SeasonalTip />
        <div className="mt-2">
          <AnimatedLawnTractor />
        </div>
        <div className="text-center text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} Green Horizons Lawn Care • Brandon, Manitoba • (555) 123-4567
        </div>
      </div>
    </div>
  )
}

export default App