import { useState, useEffect, useRef } from 'react'
import { playThwip, playBoom, playSpiderSense } from '../utils/sound'

export default function WebShooterGame({ active, muted, onToggle }) {
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [webs, setWebs] = useState([])
  const [drone, setDrone] = useState(null)
  const [splats, setSplats] = useState([])
  const lastShotTime = useRef(0)

  // Drone target spawning
  useEffect(() => {
    if (!active) {
      setDrone(null)
      return
    }

    const spawnDrone = () => {
      const startLeft = Math.random() > 0.5
      setDrone({
        id: Date.now(),
        x: startLeft ? -80 : window.innerWidth + 80,
        y: 80 + Math.random() * (window.innerHeight * 0.35),
        vx: startLeft ? 3.5 + Math.random() * 2 : -(3.5 + Math.random() * 2),
        type: Math.random() > 0.4 ? 'glider' : 'glitch-bot',
      })
    }

    const interval = setInterval(spawnDrone, 5500)
    spawnDrone()

    return () => clearInterval(interval)
  }, [active])

  // Move drone across screen
  useEffect(() => {
    if (!active || !drone) return
    let animId

    const updateDrone = () => {
      setDrone((prev) => {
        if (!prev) return null
        const newX = prev.x + prev.vx
        if (newX < -120 || newX > window.innerWidth + 120) {
          return null
        }
        return { ...prev, x: newX }
      })
      animId = requestAnimationFrame(updateDrone)
    }

    animId = requestAnimationFrame(updateDrone)
    return () => cancelAnimationFrame(animId)
  }, [active, drone])

  // Clean old web splats
  useEffect(() => {
    if (splats.length === 0) return
    const timer = setTimeout(() => {
      setSplats((prev) => prev.slice(1))
    }, 2800)
    return () => clearTimeout(timer)
  }, [splats])

  const handleShoot = (e) => {
    if (!active) return
    const now = Date.now()
    if (now - lastShotTime.current < 120) return
    lastShotTime.current = now

    const rect = e.currentTarget.getBoundingClientRect()
    const targetX = e.clientX
    const targetY = e.clientY

    if (!muted) playThwip()

    // Add web splat at target
    const splatId = `splat-${now}`
    setSplats((prev) => [
      ...prev.slice(-6),
      { id: splatId, x: targetX, y: targetY, size: 60 + Math.random() * 30 },
    ])

    // Check hit on drone
    if (drone) {
      const dx = targetX - drone.x
      const dy = targetY - drone.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 65) {
        // Hit!
        if (!muted) playBoom()
        setScore((s) => s + (100 * (combo + 1)))
        setCombo((c) => c + 1)
        setDrone(null)
      }
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className={`web-blaster-toggle ${active ? 'is-active' : ''}`}
        onClick={onToggle}
        title="Nyalakan Mode Web-Shooter (Tembak Jaring)"
      >
        <span className="blaster-icon">🕸️</span>
        <span className="blaster-label">{active ? 'MODE JARING: ON' : 'THWIP MODE'}</span>
        {active && <span className="blaster-score">★ {score}</span>}
      </button>

      {/* Fullscreen Interactive Web Shooting Overlay */}
      {active && (
        <div
          className="web-shooter-overlay"
          onClick={handleShoot}
          style={{ cursor: 'crosshair' }}
        >
          {/* Target Drone */}
          {drone && (
            <div
              className={`flying-target target--${drone.type}`}
              style={{
                transform: `translate(${drone.x}px, ${drone.y}px)`,
              }}
            >
              <div className="target-body">
                {drone.type === 'glider' ? '🎃' : '🤖'}
              </div>
              <div className="target-reticle" />
            </div>
          )}

          {/* Sticky Web Splatters */}
          {splats.map((s) => (
            <div
              key={s.id}
              className="web-splatter"
              style={{
                left: s.x,
                top: s.y,
                width: s.size,
                height: s.size,
              }}
            >
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M82 18 L18 82 M50 25 Q75 25 75 50 Q75 75 50 75 Q25 75 25 50 Q25 25 50 25 M50 10 Q90 10 90 50 Q90 90 50 90 Q10 90 10 50 Q10 10 50 10"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  opacity="0.9"
                />
                <circle cx="50" cy="50" r="14" fill="#E63946" stroke="#000" strokeWidth="2"/>
                <text x="50" y="55" fontSize="12" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif">THWIP</text>
              </svg>
            </div>
          ))}

          {/* HUD Score & Crosshair Hint */}
          <div className="web-shooter-hud">
            <span className="hud-combo">COMBO ×{combo}</span>
            <span className="hud-tip">🎯 KLIK DI MANA SAJA UNTUK MENEMBAK JARING LABA-LABA!</span>
          </div>
        </div>
      )}
    </>
  )
}
