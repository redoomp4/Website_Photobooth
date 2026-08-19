import { useState } from 'react'
import { playThwip, playShutter, playSpiderSense, playBoom } from '../utils/sound'

const MULTIVERSE_DIMENSIONS = [
  { id: 'earth616', name: 'EARTH-616', alias: 'Prime Spidey', color: '#E63946', glow: 'rgba(230,57,70,0.5)' },
  { id: 'earth1610', name: 'EARTH-1610', alias: 'Miles 2099 Glitch', color: '#00E5FF', glow: 'rgba(0,229,255,0.5)' },
  { id: 'earth65', name: 'EARTH-65', alias: 'Ghost-Spider Gwen', color: '#FF007F', glow: 'rgba(255,0,127,0.5)' },
  { id: 'earth90214', name: 'EARTH-90214', alias: 'Spider-Noir 1930', color: '#A1A1AA', glow: 'rgba(161,161,170,0.5)' },
  { id: 'earth138', name: 'EARTH-138', alias: 'Spider-Punk Zine', color: '#FFE600', glow: 'rgba(255,230,0,0.5)' },
]

export default function AppHeader({ stage, muted, onToggleMute, activeDimension = 'earth616', onSelectDimension }) {
  const [sfxOpen, setSfxOpen] = useState(false)
  const [dimensionPickerOpen, setDimensionPickerOpen] = useState(false)

  const currentDim = MULTIVERSE_DIMENSIONS.find((d) => d.id === activeDimension) || MULTIVERSE_DIMENSIONS[0]

  return (
    <header className="app__header">
      <div className="app__header-top">
        <div className="app__brand">
          <span className="app__brand-mark" aria-hidden>🕸️</span>
          <h1>COBWEB BOOTH</h1>
          <button
            className="app__universe-badge"
            onClick={() => setDimensionPickerOpen((v) => !v)}
            title="Klik untuk pindah universe!"
          >
            {currentDim.name} // {currentDim.alias} ▾
          </button>
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

      {/* Multiverse Dimension Switcher Tray */}
      {dimensionPickerOpen && (
        <div className="app__dimension-tray">
          <span className="dimension-tray-label">🌌 PILIH DIMENSI SPIDER-VERSE:</span>
          <div className="dimension-buttons-row">
            {MULTIVERSE_DIMENSIONS.map((dim) => (
              <button
                key={dim.id}
                className={`btn-dim-item ${activeDimension === dim.id ? 'is-active' : ''}`}
                style={{ '--dim-color': dim.color }}
                onClick={() => {
                  onSelectDimension(dim.id)
                  setDimensionPickerOpen(false)
                  if (!muted) playSpiderSense()
                }}
              >
                <strong>{dim.name}</strong>
                <span>{dim.alias}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="app__tagline">
        Spider-Verse Photobooth Interaktif — Buat strip foto komik, sampul majalah Marvel, kartu pahlawan, dan efek live action!
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
          <span className="step-label">Studio Edit &amp; Export</span>
        </div>
      </nav>
    </header>
  )
}
