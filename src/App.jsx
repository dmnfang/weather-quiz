import { useState } from 'react'
import SetupScreen from './screens/SetupScreen'
import QuizScreen from './screens/QuizScreen'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function App() {
  const [screen, setScreen] = useState('setup')
  const [slots, setSlots] = useState({})
  const [quizOrder, setQuizOrder] = useState([])

  const handleStart = (slots) => {
    const weatherIds = Object.keys(slots).filter(k => slots[k] !== null)
    setSlots(slots)
    setQuizOrder(shuffle(weatherIds))
    setScreen('quiz')
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {screen === 'setup' && (
        <SetupScreen onStart={handleStart} />
      )}
      {screen === 'quiz' && (
        <QuizScreen
          slots={slots}
          quizOrder={quizOrder}
          onBack={() => setScreen('setup')}
        />
      )}
    </div>
  )
}

export default App