import { useState } from 'react'
import { WEATHER, ACTIVITIES } from '../data.js'
import './SetupScreen.css'

function SetupScreen({ onStart }) {
  const [slots, setSlots] = useState({
    sunny: null, cloudy: null, rainy: null, snowy: null,
  })
  const [selectedActivity, setSelectedActivity] = useState(null)

  const handleActivityDragStart = (e, activityId) => {
    e.dataTransfer.setData('activityId', activityId)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e, weatherId) => {
    e.preventDefault()
    const activityId = e.dataTransfer.getData('activityId')
    if (!activityId) return
    setSlots(prev => ({ ...prev, [weatherId]: activityId }))
  }

  const handleSlotClick = (weatherId) => {
    if (selectedActivity) {
      setSlots(prev => ({ ...prev, [weatherId]: selectedActivity }))
    } else if (slots[weatherId]) {
      setSlots(prev => ({ ...prev, [weatherId]: null }))
    }
  }

  const getActivity = (id) => ACTIVITIES.find(a => a.id === id)

  const canStart = Object.values(slots).some(s => s !== null)

  return (
    <div className="setup-screen">
      <div className="setup-topbar">
        <div className="setup-breadcrumb">
          <a className="bc-home" href="https://dmnfang.github.io">Home</a>
          <span className="bc-sep">›</span>
          <a className="bc-mid" href="https://dmnfang.github.io/quiz-hub/">Quiz Hub</a>
          <span className="bc-sep">›</span>
          <span className="bc-current">Weather Quiz</span>
        </div>
        <button
          className="start-btn"
          disabled={!canStart}
          onClick={() => onStart(slots)}
        >
          Start Quiz
        </button>
      </div>

      <div className="setup-body">
        <div className="weather-slots">
          {WEATHER.map(w => {
            const activityId = slots[w.id]
            const activity = activityId ? getActivity(activityId) : null
            return (
              <div
                key={w.id}
                className={`weather-slot ${activity ? 'filled' : ''} ${selectedActivity && !activity ? 'paintable' : ''}`}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, w.id)}
                onClick={() => handleSlotClick(w.id)}
              >
                <div className="weather-slot-header">
                  <img className="weather-icon" src={w.image} alt={w.en} />
                  <span className="weather-label">{w.en}</span>
                </div>
                {activity ? (
                  <div className="weather-slot-content">
                    <div className="slot-activity-img">
                      <img src={activity.image} alt={activity.en} />
                    </div>
                    <div className="slot-activity-text">{activity.sentence}</div>
                  </div>
                ) : (
                  <div className="weather-slot-empty">+</div>
                )}
              </div>
            )
          })}
        </div>

        <div className="activity-palette">
          <div className="palette-title">
            {selectedActivity
              ? `${getActivity(selectedActivity)?.en} selected — tap a weather slot`
              : 'Tap an activity then tap a slot, or drag and drop'}
          </div>
          <div className="activity-grid">
            {ACTIVITIES.map(activity => (
              <div
                key={activity.id}
                className={`activity-tile ${selectedActivity === activity.id ? 'selected' : ''}`}
                draggable
                onDragStart={e => handleActivityDragStart(e, activity.id)}
                onClick={() => setSelectedActivity(prev => prev === activity.id ? null : activity.id)}
              >
                <img src={activity.image} alt={activity.en} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetupScreen