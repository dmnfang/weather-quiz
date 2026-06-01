import { useState } from 'react'
import confetti from 'canvas-confetti'
import { WEATHER, ACTIVITIES } from '../data.js'
import './QuizScreen.css'

function QuizScreen({ slots, quizOrder, onBack }) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answered, setAnswered] = useState(null)
  const [shaking, setShaking] = useState(false)

  const currentWeatherId = quizOrder[questionIndex]
  const currentWeather = WEATHER.find(w => w.id === currentWeatherId)
  const correctActivityId = slots[currentWeatherId]
  const correctActivity = ACTIVITIES.find(a => a.id === correctActivityId)

  const handleAnswer = (activityId) => {
    if (answered) return
    if (activityId === correctActivityId) {
      setAnswered('correct')
      confetti({
        particleCount: 200, spread: 100,
        origin: { y: 0.5 }, scalar: 2,
        shapes: ['square'],
        colors: ['#F5C842','#A8BFCC','#6B9EC4','#B8D4E8','#4AA875','#E8443A','#9B7FD4'],
      })
      setTimeout(() => {
        confetti({
          particleCount: 100, spread: 120,
          origin: { x: 0.1, y: 0.6 }, scalar: 2,
          shapes: ['square'],
          colors: ['#F5C842','#A8BFCC','#6B9EC4','#B8D4E8','#4AA875','#E8443A','#9B7FD4'],
        })
        confetti({
          particleCount: 100, spread: 120,
          origin: { x: 0.9, y: 0.6 }, scalar: 2,
          shapes: ['square'],
          colors: ['#F5C842','#A8BFCC','#6B9EC4','#B8D4E8','#4AA875','#E8443A','#9B7FD4'],
        })
      }, 300)
    } else {
      setShaking(true)
      setAnswered('wrong')
      setTimeout(() => setShaking(false), 600)
    }
  }

  const handleTryAgain = () => {
    setAnswered(null)
    setShaking(false)
  }

  const handleNext = () => {
    if (questionIndex < quizOrder.length - 1) {
      setQuestionIndex(i => i + 1)
      setAnswered(null)
      setShaking(false)
    }
  }

  const isLast = questionIndex === quizOrder.length - 1

  return (
    <div className={`quiz-screen ${shaking ? 'shake' : ''}`}>
      {/* Top — weather display */}
      <div className="quiz-top">
        <div className="quiz-weather-row">
  <img className="quiz-weather-icon" src={currentWeather?.image} alt={currentWeather?.en} />
  <span className="quiz-weather-label">It's {currentWeather?.en}! Let's...</span>
</div>
      </div>

      {/* Bottom — activity buttons or answer */}
      <div className="quiz-bottom">
        {answered === 'correct' && (
          <div className="answer-reveal">
            <div className="answer-text">{correctActivity?.sentence}</div>
          </div>
        )}

        {answered === 'wrong' && (
          <div className="wrong-overlay">
            <div className="wrong-x">✕</div>
            <button className="try-again-btn" onClick={handleTryAgain}>
              Try Again
            </button>
          </div>
        )}

        {!answered && (
          <div className="activity-buttons">
            {ACTIVITIES.map(activity => (
              <button
                key={activity.id}
                className="activity-btn"
                onClick={() => handleAnswer(activity.id)}
              >
                <div className="activity-btn-img">
                  <img src={activity.image} alt={activity.en} />
                </div>
                <span className="activity-btn-text">{activity.sentence}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="quiz-controls">
        <button className="ctrl-btn" onClick={onBack}>Setup</button>
        {answered === 'correct' && !isLast && (
          <button className="ctrl-btn ctrl-btn-next" onClick={handleNext}>
            Next Question
          </button>
        )}
        {answered === 'correct' && isLast && (
          <button className="ctrl-btn ctrl-btn-next" onClick={onBack}>
            Done
          </button>
        )}
        <div className="quiz-progress">{questionIndex + 1} / {quizOrder.length}</div>
      </div>
    </div>
  )
}

export default QuizScreen