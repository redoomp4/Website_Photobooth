import { useState, useRef, useEffect } from 'react'

const SPIDEY_FACTS = [
  { q: 'Siapa pencipta Spider-Man?', a: ['Stan Lee & Steve Ditko', 'Jack Kirby', 'Bob Kane', 'Todd McFarlane'], correct: 0 },
  { q: 'Di universitas mana Peter Parker kuliah?', a: ['Empire State University', 'MIT', 'Columbia University', 'NYU'], correct: 0 },
  { q: 'Siapa nama asli Miles Morales?', a: ['Miles Gonzalo Morales', 'Miles James Morales', 'Miles Thomas Morales', 'Miles Benjamin Morales'], correct: 0 },
  { q: 'Spider-Man pertama kali muncul di komik apa?', a: ['Amazing Fantasy #15', 'Amazing Spider-Man #1', 'Web of Spider-Man #1', 'The Spectacular Spider-Man #1'], correct: 0 },
  { q: 'Siapa Spider-Man di Earth-65?', a: ['Gwen Stacy', 'Mary Jane Watson', 'Jessica Drew', 'Cindy Moon'], correct: 0 },
  { q: 'Apa nama senjata khas Spider-Man 2099?', a: ['Talons (Cakar Retractable)', 'Web Shooters Organik', 'Energy Blasters', 'Vibranium Shield'], correct: 0 },
  { q: 'Laba-laba apa yang menggigit Peter Parker?', a: ['Laba-laba radioaktif', 'Laba-laba genetik', 'Black Widow Spider', 'Tarantula biasa'], correct: 0 },
  { q: 'Siapa villain pertama Spider-Man?', a: ['The Chameleon', 'Green Goblin', 'Doctor Octopus', 'Vulture'], correct: 0 },
  { q: 'Apa nama koran tempat Peter Parker bekerja?', a: ['Daily Bugle', 'Daily Planet', 'New York Times', 'The Gazette'], correct: 0 },
  { q: 'Siapa pemimpin Spider-Society di Spider-Verse?', a: ['Miguel O\'Hara (Spider-Man 2099)', 'Peter B. Parker', 'Miles Morales', 'Spider-Punk'], correct: 0 },
]

export default function SpiderTrivia({ isOpen, onClose, muted }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [results, setResults] = useState([])
  const [phase, setPhase] = useState('playing') // playing | results
  const [shuffledFacts, setShuffledFacts] = useState([])
  const [timer, setTimer] = useState(12)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    // Shuffle and pick 5 questions
    const shuffled = [...SPIDEY_FACTS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
    setShuffledFacts(shuffled)
    setCurrentQ(0)
    setSelected(null)
    setResults([])
    setPhase('playing')
    setTimer(12)
  }, [isOpen])

  // Countdown per question
  useEffect(() => {
    if (!isOpen || phase !== 'playing' || selected !== null) return
    if (timer <= 0) {
      handleAnswer(-1) // timeout = wrong
      return
    }
    timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [timer, isOpen, phase, selected])

  const handleAnswer = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    clearTimeout(timerRef.current)

    const isCorrect = idx === shuffledFacts[currentQ].correct
    setResults((prev) => [...prev, isCorrect])

    setTimeout(() => {
      if (currentQ + 1 >= shuffledFacts.length) {
        setPhase('results')
      } else {
        setCurrentQ((c) => c + 1)
        setSelected(null)
        setTimer(12)
      }
    }, 1500)
  }

  if (!isOpen) return null

  const question = shuffledFacts[currentQ]
  const correctCount = results.filter(Boolean).length
  const totalAsked = results.length

  const getGrade = () => {
    if (correctCount === 5) return { text: '🕷️ TRUE BELIEVER — Stan Lee bangga padamu!', color: '#FFE600' }
    if (correctCount >= 4) return { text: '⚡ WEB WARRIOR — Pengetahuanmu tingkat elite!', color: '#00E5FF' }
    if (correctCount >= 3) return { text: '🕸️ TRAINEE — Lumayan, terus belajar!', color: '#00F5D4' }
    return { text: '🤷 CIVILIAN — Baca lebih banyak komik dulu ya!', color: '#E63946' }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--trivia" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>🧠 SPIDER-VERSE TRIVIA CHALLENGE</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {phase === 'playing' && question && (
          <div className="trivia-game">
            {/* Progress Dots */}
            <div className="trivia-progress">
              {shuffledFacts.map((_, i) => (
                <div
                  key={i}
                  className={`trivia-dot ${
                    i < currentQ ? (results[i] ? 'is-correct' : 'is-wrong') : ''
                  } ${i === currentQ ? 'is-current' : ''}`}
                />
              ))}
            </div>

            {/* Timer Ring */}
            <div className="trivia-timer-row">
              <div className={`trivia-timer-ring ${timer <= 4 ? 'is-danger' : ''}`}>
                <svg viewBox="0 0 40 40" className="trivia-timer-svg">
                  <circle
                    cx="20" cy="20" r="17"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="20" cy="20" r="17"
                    fill="none"
                    stroke={timer <= 4 ? '#E63946' : '#00E5FF'}
                    strokeWidth="3"
                    strokeDasharray={`${(timer / 12) * 106.8} 106.8`}
                    strokeLinecap="round"
                    transform="rotate(-90 20 20)"
                    style={{ transition: 'stroke-dasharray 0.9s linear' }}
                  />
                </svg>
                <span className="trivia-timer-num">{timer}</span>
              </div>
              <span className="trivia-q-label">PERTANYAAN {currentQ + 1}/{shuffledFacts.length}</span>
            </div>

            {/* Question */}
            <p className="trivia-question">{question.q}</p>

            {/* Answer Grid */}
            <div className="trivia-answers">
              {question.a.map((answer, i) => {
                let btnClass = 'trivia-answer-btn'
                if (selected !== null) {
                  if (i === question.correct) btnClass += ' is-correct'
                  else if (i === selected && selected !== question.correct) btnClass += ' is-wrong'
                }
                return (
                  <button
                    key={i}
                    className={btnClass}
                    onClick={() => handleAnswer(i)}
                    disabled={selected !== null}
                  >
                    <span className="answer-letter">{String.fromCharCode(65 + i)}</span>
                    <span className="answer-text">{answer}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {phase === 'results' && (
          <div className="trivia-results">
            <div className="trivia-results__score-ring">
              <svg viewBox="0 0 100 100" className="score-ring-svg">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke={getGrade().color}
                  strokeWidth="8"
                  strokeDasharray={`${(correctCount / 5) * 264} 264`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="score-ring-text">
                <span className="score-ring-num">{correctCount}</span>
                <span className="score-ring-of">/ 5</span>
              </div>
            </div>

            <p className="trivia-results__grade" style={{ color: getGrade().color }}>
              {getGrade().text}
            </p>

            {/* Answer Review */}
            <div className="trivia-review">
              {shuffledFacts.map((fact, i) => (
                <div key={i} className={`review-row ${results[i] ? 'is-correct' : 'is-wrong'}`}>
                  <span className="review-marker">{results[i] ? '✅' : '❌'}</span>
                  <span className="review-q">{fact.q}</span>
                </div>
              ))}
            </div>

            <div className="modal__actions">
              <button className="btn btn--secondary" onClick={() => {
                setPhase('playing')
                setCurrentQ(0)
                setSelected(null)
                setResults([])
                setTimer(12)
                const shuffled = [...SPIDEY_FACTS].sort(() => Math.random() - 0.5).slice(0, 5)
                setShuffledFacts(shuffled)
              }}>
                🔄 MAIN LAGI
              </button>
              <button className="btn btn--ghost" onClick={onClose}>TUTUP</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
