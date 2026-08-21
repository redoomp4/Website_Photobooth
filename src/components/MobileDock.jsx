import { useState, useEffect } from 'react'

export default function MobileDock({
  stage,
  muted,
  onOpenTrivia,
  onOpenMemory,
  onToggleMute,
}) {
  const [showLabel, setShowLabel] = useState(true)

  // Hide tooltip labels after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowLabel(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <nav className="mobile-dock" role="navigation" aria-label="Quick Actions">
      <button className="mobile-dock__btn" onClick={onOpenTrivia} title="Spider-Verse Trivia Quiz">
        <span className="dock-icon">🧠</span>
        <span className="dock-label">Trivia</span>
      </button>

      <button className="mobile-dock__btn" onClick={onOpenMemory} title="Memory Match Game">
        <span className="dock-icon">🃏</span>
        <span className="dock-label">Memory</span>
      </button>

      <button
        className={`mobile-dock__btn ${muted ? '' : 'is-active'}`}
        onClick={onToggleMute}
        title={muted ? 'Nyalakan Suara' : 'Bisukan Suara'}
      >
        <span className="dock-icon">{muted ? '🔇' : '🔊'}</span>
        <span className="dock-label">{muted ? 'Mute' : 'Sound'}</span>
      </button>
    </nav>
  )
}
