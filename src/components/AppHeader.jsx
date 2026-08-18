import { useState } from 'react'
import { playThwip, playShutter, playSpiderSense, playBoom } from '../utils/sound'

export default function AppHeader({ stage, muted, onToggleMute }) {
  const [sfxOpen, setSfxOpen] = useState(false)

  return (
    <header className="app__header">
      <div className="app__header-top">
        <div className="app__brand">
          <span className="app__brand-mark" aria-hidden>🕸️</span>
          <h1>COBWEB BOOTH</h1>
          <span className="app__universe-badge">EARTH-616 // ACTIVE</span>
        </div>

        <div className="app__header-actions">
          <button
            className={`btn-sfx-toggle ${sfxOpen ? 'is-active' : ''}`}
            onClick={() => setSfxOpen((v) => !v)}
            title="Buka Soundboard SFX"
          >
            🔊 Sound FX
          </button>
          <button
            className={`soundboard__mute ${muted ? 'is-muted' : ''}`}
            onClick={onToggleMute}
            aria-label={muted ? 'Nyalakan suara' : 'Bisukan suara'}
            title={muted ? 'Nyalakan audio' : 'Bisukan audio'}
          >
            {muted ? '🔇' : '🔉'}
          </button>
        </div>
      </div>

      <p className="app__tagline">
        Photo Booth Spider-Verse interaktif — Ciptakan strip foto komik, stiker orisinal, kartu anggota, dan efek live action!
      </p>

      {/* Mini Soundboard Dropdown Tray */}
      {sfxOpen && (
        <div className="app__sfx-tray">
          <span className="sfx-tray-label">⚡ TEST SOUND EFFECTS:</span>
          <div className="sfx-button-row">
            <button className="btn-sfx-item" onClick={() => !muted && playThwip()}>
              🕸️ Thwip!
            </button>
            <button className="btn-sfx-item" onClick={() => !muted && playSpiderSense()}>
              ⚡ Spider-Sense
            </button>
            <button className="btn-sfx-item" onClick={() => !muted && playBoom()}>
              💥 Boom!
            </button>
            <button className="btn-sfx-item" onClick={() => !muted && playShutter()}>
              📸 Shutter
            </button>
          </div>
        </div>
      )}

      {/* Interactive Step / Stage Tracker */}
      <nav className="app__stepper">
        <div className={`step-node ${stage === 'setup' ? 'is-current' : stage === 'capture' || stage === 'edit' ? 'is-done' : ''}`}>
          <span className="step-num">1</span>
          <span className="step-label">Pilih Filter</span>
        </div>
        <div className="step-line" />
        <div className={`step-node ${stage === 'capture' ? 'is-current' : stage === 'edit' ? 'is-done' : ''}`}>
          <span className="step-num">2</span>
          <span className="step-label">Foto Pose (3x)</span>
        </div>
        <div className="step-line" />
        <div className={`step-node ${stage === 'edit' ? 'is-current' : ''}`}>
          <span className="step-num">3</span>
          <span className="step-label">Studio Edit & Export</span>
        </div>
      </nav>
    </header>
  )
}
