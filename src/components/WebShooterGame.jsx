import { useState, useEffect, useRef, useCallback } from 'react'
import { playThwip, playBoom, playSpiderSense } from '../utils/sound'

const VILLAINS = [
  { emoji: '🎃', name: 'Green Goblin', points: 150, speed: 2.5, size: 48 },
  { emoji: '🤖', name: 'Electro Drone', points: 100, speed: 3.2, size: 42 },
  { emoji: '🐙', name: 'Doc Ock Arm', points: 200, speed: 1.8, size: 54 },
  { emoji: '🦅', name: 'Vulture Wing', points: 120, speed: 4, size: 38 },
  { emoji: '👾', name: 'Glitch Bot 2099', points: 180, speed: 2, size: 46 },
]

export default function WebShooterGame({ active, muted, onToggle }) {
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [targets, setTargets] = useState([])
  const [splats, setSplats] = useState([])
  const [misses, setMisses] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameState, setGameState] = useState('idle') // idle | playing | gameover
  const lastShotTime = useRef(0)
  const areaRef = useRef(null)

  // Countdown timer
  useEffect(() => {
    if (gameState !== 'playing') return
    if (timeLeft <= 0) {
      setGameState('gameover')
      if (!muted) playSpiderSense()
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, gameState, muted])

  // Spawn targets
  useEffect(() => {
    if (gameState !== 'playing') return
    const spawnInterval = Math.max(800, 2200 - score * 2)

    const spawn = () => {
      const villain = VILLAINS[Math.floor(Math.random() * VILLAINS.length)]
      const area = areaRef.current
      if (!area) return

      const rect = area.getBoundingClientRect()
      const fromLeft = Math.random() > 0.5
      const startX = fromLeft ? -60 : rect.width + 60
      const startY = 40 + Math.random() * (rect.height - 100)
      const vx = fromLeft ? villain.speed : -villain.speed
      const vy = (Math.random() - 0.5) * 1.2

      setTargets((prev) => [
        ...prev.slice(-8),
        {
          id: Date.now() + Math.random(),
          ...villain,
          x: startX,
          y: startY,
          vx,
          vy,
          born: Date.now(),
        },
      ])
    }

    const interval = setInterval(spawn, spawnInterval)
    spawn()
    return () => clearInterval(interval)
  }, [gameState, score])

  // Animate targets
  useEffect(() => {
    if (gameState !== 'playing' || targets.length === 0) return
    let animId

    const tick = () => {
      const area = areaRef.current
      if (!area) return

      const rect = area.getBoundingClientRect()
      setTargets((prev) =>
        prev
          .map((t) => ({
            ...t,
            x: t.x + t.vx,
            y: t.y + t.vy,
          }))
          .filter((t) => {
            if (t.x < -100 || t.x > rect.width + 100 || t.y < -80 || t.y > rect.height + 80) {
              setCombo(0)
              setMisses((m) => m + 1)
              return false
            }
            return true
          })
      )
      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [gameState, targets.length])

  // Clear old splats
  useEffect(() => {
    if (splats.length === 0) return
    const timer = setTimeout(() => setSplats((prev) => prev.slice(1)), 1200)
    return () => clearTimeout(timer)
  }, [splats])

  const startGame = () => {
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setTargets([])
    setSplats([])
    setMisses(0)
    setTimeLeft(30)
    setGameState('playing')
    if (!muted) playSpiderSense()
  }

  const handleShoot = useCallback(
    (e) => {
      if (gameState !== 'playing') return
      const now = Date.now()
      if (now - lastShotTime.current < 100) return
      lastShotTime.current = now

      const area = areaRef.current
      if (!area) return
      const rect = area.getBoundingClientRect()
      const clickX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
      const clickY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top

      if (!muted) playThwip()

      // Web splat
      setSplats((prev) => [
        ...prev.slice(-8),
        { id: now, x: clickX, y: clickY },
      ])

      // Hit detection
      let hitFound = false
      setTargets((prev) =>
        prev.filter((t) => {
          const dx = clickX - t.x
          const dy = clickY - t.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < t.size + 20 && !hitFound) {
            hitFound = true
            const newCombo = combo + 1
            const multiplier = Math.min(newCombo, 5)
            setScore((s) => s + t.points * multiplier)
            setCombo(newCombo)
            setMaxCombo((mc) => Math.max(mc, newCombo))
            if (!muted) playBoom()
            return false
          }
          return true
        })
      )

      if (!hitFound) {
        setCombo(0)
      }
    },
    [gameState, combo, muted]
  )

  const getRank = () => {
    if (score >= 5000) return { rank: 'S — SPIDER-SUPREME', color: '#FFE600' }
    if (score >= 3000) return { rank: 'A — WEB WARRIOR', color: '#00E5FF' }
    if (score >= 1500) return { rank: 'B — FRIENDLY NEIGHBOR', color: '#00F5D4' }
    if (score >= 500) return { rank: 'C — TRAINEE', color: '#F59E0B' }
    return { rank: 'D — BITTEN YESTERDAY', color: '#E63946' }
  }

  return (
    <>
      {/* Floating Toggle Button — always visible */}
      <button
        className={`web-blaster-toggle ${active ? 'is-active' : ''}`}
        onClick={onToggle}
        title="Nyalakan Mode Web-Shooter Arcade"
      >
        <span className="blaster-icon">🕹️</span>
        <span className="blaster-label">{active ? 'TUTUP ARCADE' : 'THWIP ARCADE'}</span>
      </button>

      {/* Fullscreen Arcade Overlay */}
      {active && (
        <div className="arcade-overlay">
          <div className="arcade-container">
            {/* Title & Close */}
            <div className="arcade-header">
              <h2 className="arcade-title">🕸️ WEB-SHOOTER ARCADE</h2>
              <button className="btn-close" onClick={onToggle}>✕</button>
            </div>

            {gameState === 'idle' && (
              <div className="arcade-splash">
                <div className="arcade-splash__logo">🕷️</div>
                <h3>Tembak semua musuh Spider-Man!</h3>
                <p>Klik atau tap musuh yang terbang melintas untuk mendapat poin. Combo berturut-turut = multiplier skor lebih tinggi!</p>
                <div className="arcade-splash__rules">
                  <div className="rule-item">🎯 <strong>Klik tepat</strong> pada musuh</div>
                  <div className="rule-item">🔥 <strong>Combo chain</strong> = skor ×2 s/d ×5</div>
                  <div className="rule-item">⏱️ <strong>30 detik</strong> per ronde</div>
                </div>
                <button className="btn btn--primary btn--lg" onClick={startGame}>
                  MULAI MISI! →
                </button>
              </div>
            )}

            {gameState === 'playing' && (
              <>
                {/* HUD */}
                <div className="arcade-hud">
                  <div className="hud-stat">
                    <span className="hud-stat__label">SKOR</span>
                    <span className="hud-stat__value hud-stat__value--score">{score}</span>
                  </div>
                  <div className="hud-stat">
                    <span className="hud-stat__label">COMBO</span>
                    <span className="hud-stat__value" style={{ color: combo >= 3 ? '#FFE600' : '#00E5FF' }}>
                      ×{combo}
                    </span>
                  </div>
                  <div className="hud-stat">
                    <span className="hud-stat__label">WAKTU</span>
                    <span className={`hud-stat__value ${timeLeft <= 5 ? 'hud-stat__value--danger' : ''}`}>
                      {timeLeft}s
                    </span>
                  </div>
                </div>

                {/* Timer Bar */}
                <div className="arcade-timer-bar">
                  <div className="arcade-timer-fill" style={{ width: `${(timeLeft / 30) * 100}%` }} />
                </div>

                {/* Game Area */}
                <div
                  ref={areaRef}
                  className="arcade-field"
                  onClick={handleShoot}
                  onTouchStart={handleShoot}
                >
                  {/* Flying Targets */}
                  {targets.map((t) => (
                    <div
                      key={t.id}
                      className="arcade-target"
                      style={{
                        left: t.x,
                        top: t.y,
                        width: t.size * 2,
                        height: t.size * 2,
                      }}
                    >
                      <span className="arcade-target__emoji">{t.emoji}</span>
                      <span className="arcade-target__pts">+{t.points}</span>
                    </div>
                  ))}

                  {/* Web Splats */}
                  {splats.map((s) => (
                    <div
                      key={s.id}
                      className="arcade-splat"
                      style={{ left: s.x, top: s.y }}
                    />
                  ))}

                  {/* Combo Flash */}
                  {combo >= 3 && (
                    <div className="arcade-combo-flash">
                      🔥 COMBO ×{combo}!
                    </div>
                  )}
                </div>
              </>
            )}

            {gameState === 'gameover' && (
              <div className="arcade-results">
                <h3 className="arcade-results__title">⏱️ WAKTU HABIS!</h3>

                <div className="arcade-results__rank" style={{ color: getRank().color }}>
                  {getRank().rank}
                </div>

                <div className="arcade-results__stats">
                  <div className="result-stat">
                    <span className="result-stat__num">{score}</span>
                    <span className="result-stat__label">TOTAL SKOR</span>
                  </div>
                  <div className="result-stat">
                    <span className="result-stat__num">×{maxCombo}</span>
                    <span className="result-stat__label">MAX COMBO</span>
                  </div>
                  <div className="result-stat">
                    <span className="result-stat__num">{misses}</span>
                    <span className="result-stat__label">LOLOS</span>
                  </div>
                </div>

                <div className="arcade-results__actions">
                  <button className="btn btn--primary" onClick={startGame}>🔄 MAIN LAGI</button>
                  <button className="btn btn--ghost" onClick={onToggle}>KEMBALI</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
