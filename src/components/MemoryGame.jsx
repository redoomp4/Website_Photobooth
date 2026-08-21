import { useState, useRef, useEffect } from 'react'

const EMOJIS = ['🕷️', '🕸️', '⚡', '🎃', '🤖', '🐙', '💥', '🦅']

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function createBoard(pairCount) {
  const picked = EMOJIS.slice(0, pairCount)
  const doubled = [...picked, ...picked]
  return shuffleArray(doubled).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }))
}

export default function MemoryGame({ isOpen, onClose }) {
  const [difficulty, setDifficulty] = useState(null) // null | 'easy' | 'hard'
  const [cards, setCards] = useState([])
  const [flippedIds, setFlippedIds] = useState([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const lockRef = useRef(false)
  const timerRef = useRef(null)

  const pairCount = difficulty === 'easy' ? 4 : 8
  const totalPairs = difficulty ? pairCount : 0

  // Timer
  useEffect(() => {
    if (!isRunning) {
      clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [isRunning])

  // Check for win
  useEffect(() => {
    if (totalPairs > 0 && matches === totalPairs) {
      setIsRunning(false)
    }
  }, [matches, totalPairs])

  const startGame = (diff) => {
    setDifficulty(diff)
    const count = diff === 'easy' ? 4 : 8
    setCards(createBoard(count))
    setFlippedIds([])
    setMoves(0)
    setMatches(0)
    setTimer(0)
    setIsRunning(true)
    lockRef.current = false
  }

  const handleFlip = (id) => {
    if (lockRef.current) return
    const card = cards.find((c) => c.id === id)
    if (!card || card.flipped || card.matched) return

    const newFlipped = [...flippedIds, id]
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)))
    setFlippedIds(newFlipped)

    if (newFlipped.length === 2) {
      lockRef.current = true
      setMoves((m) => m + 1)

      const [firstId, secondId] = newFlipped
      const first = cards.find((c) => c.id === firstId)
      const second = cards.find((c) => c.id === secondId)

      if (first.emoji === second?.emoji) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
            )
          )
          setMatches((m) => m + 1)
          setFlippedIds([])
          lockRef.current = false
        }, 400)
      } else {
        // No match — flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c
            )
          )
          setFlippedIds([])
          lockRef.current = false
        }, 800)
      }
    }
  }

  if (!isOpen) return null

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const isWon = totalPairs > 0 && matches === totalPairs

  const getStars = () => {
    const minMoves = totalPairs
    if (moves <= minMoves + 2) return 3
    if (moves <= minMoves + 6) return 2
    return 1
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--memory" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>🃏 SPIDER-VERSE MEMORY MATCH</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {!difficulty && (
          <div className="memory-menu">
            <p className="memory-menu__desc">
              Temukan semua pasangan simbol Spider-Verse! Pilih tingkat kesulitan:
            </p>
            <div className="memory-menu__buttons">
              <button className="btn btn--secondary" onClick={() => startGame('easy')}>
                😊 MUDAH (4 Pasang)
              </button>
              <button className="btn btn--primary" onClick={() => startGame('hard')}>
                🔥 SULIT (8 Pasang)
              </button>
            </div>
          </div>
        )}

        {difficulty && !isWon && (
          <>
            <div className="memory-hud">
              <div className="memory-hud__stat">
                <span>⏱️</span> {formatTime(timer)}
              </div>
              <div className="memory-hud__stat">
                <span>🎯</span> {moves} langkah
              </div>
              <div className="memory-hud__stat">
                <span>✅</span> {matches}/{totalPairs}
              </div>
            </div>

            <div className={`memory-grid memory-grid--${difficulty}`}>
              {cards.map((card) => (
                <button
                  key={card.id}
                  className={`memory-card ${card.flipped || card.matched ? 'is-flipped' : ''} ${card.matched ? 'is-matched' : ''}`}
                  onClick={() => handleFlip(card.id)}
                  disabled={card.flipped || card.matched}
                >
                  <div className="memory-card__inner">
                    <div className="memory-card__front">
                      <span>🕸️</span>
                    </div>
                    <div className="memory-card__back">
                      <span>{card.emoji}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {isWon && (
          <div className="memory-win">
            <div className="memory-win__stars">
              {[1, 2, 3].map((s) => (
                <span key={s} className={`memory-star ${s <= getStars() ? 'is-earned' : ''}`}>★</span>
              ))}
            </div>
            <h3 className="memory-win__title">MISI SELESAI!</h3>
            <div className="memory-win__stats">
              <p>⏱️ Waktu: <strong>{formatTime(timer)}</strong></p>
              <p>🎯 Langkah: <strong>{moves}</strong></p>
            </div>
            <div className="modal__actions">
              <button className="btn btn--secondary" onClick={() => startGame(difficulty)}>🔄 MAIN LAGI</button>
              <button className="btn btn--ghost" onClick={() => { setDifficulty(null); setCards([]); }}>PILIH LEVEL</button>
              <button className="btn btn--ghost" onClick={onClose}>TUTUP</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
