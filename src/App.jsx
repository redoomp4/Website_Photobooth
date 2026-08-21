import { useState, useEffect } from 'react'
import AppHeader from './components/AppHeader'
import WebParticleEffect from './components/WebParticleEffect'
import WebShooterGame from './components/WebShooterGame'
import MobileDock from './components/MobileDock'
import ComicToggle from './components/ComicToggle'
import FilterRail from './components/FilterRail'
import Viewfinder from './components/Viewfinder'
import StickerBelt from './components/StickerBelt'
import StripPreview from './components/StripPreview'
import SpeechBubbleModal from './components/SpeechBubbleModal'
import { FILTERS } from './utils/compositor'

const COUNTDOWN_OPTIONS = [3, 5, 10]

export default function App() {
  const [stage, setStage] = useState('setup') // setup | capture | edit
  const [filterId, setFilterId] = useState('original')
  const [mode, setMode] = useState('anime')
  const [armedId, setArmedId] = useState(null)
  const [photos, setPhotos] = useState([])
  const [countdownFrom, setCountdownFrom] = useState(3)
  const [muted, setMuted] = useState(false)
  const [customBubbles, setCustomBubbles] = useState([])
  const [bubbleModalOpen, setBubbleModalOpen] = useState(false)
  const [activeDimension, setActiveDimension] = useState('earth616')
  const [webShooterActive, setWebShooterActive] = useState(false)

  // Set CSS class on root container according to active dimension
  useEffect(() => {
    document.documentElement.setAttribute('data-dimension', activeDimension)
  }, [activeDimension])

  const filterCss = FILTERS.find((f) => f.id === filterId)?.css || 'none'

  function handleRetakePhoto(index, dataUrl) {
    setPhotos((prev) => prev.map((p, i) => (i === index ? dataUrl : p)))
  }

  function handleAddCustomBubble(bubble) {
    const bubbleId = `bubble-${Date.now()}`
    const newBubble = {
      id: bubbleId,
      name: bubble.name,
      text: bubble.text,
      dataUri: bubble.dataUri,
    }
    setCustomBubbles((prev) => [...prev, newBubble])
    setArmedId(bubbleId)
  }

  return (
    <div className={`app dimension--${activeDimension}`}>
      {/* Interactive Web Particle Canvas */}
      <WebParticleEffect dimension={activeDimension} />

      {/* Interactive Arcade Web-Shooter Overlay & Easter Egg */}
      <WebShooterGame
        active={webShooterActive}
        muted={muted}
        onToggle={() => setWebShooterActive((v) => !v)}
      />

      {/* Spider-Verse Brand Header & Audio Engine */}
      <AppHeader
        stage={stage}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        activeDimension={activeDimension}
        onSelectDimension={setActiveDimension}
      />

      <div className="app__crackbg" aria-hidden />

      <main className="app__stage">
        {stage === 'setup' && (
          <section className="panel panel--setup">
            <div className="panel__banner">
              <h2 className="panel__title">⚡ Siapkan Sesi Spider-Verse</h2>
              <p className="panel__subtitle">
                Pilih filter visual komik &amp; durasi hitung mundur sebelum memasuki studio kamera.
              </p>
            </div>

            <FilterRail activeId={filterId} onSelect={setFilterId} />
            <ComicToggle mode={mode} onChange={setMode} />

            <div className="countdownPicker">
              <span className="countdownPicker__label">⏱️ DURASI HITUNG MUNDUR</span>
              <div className="webshooter__track">
                {COUNTDOWN_OPTIONS.map((n) => (
                  <button
                    key={n}
                    className={`webshooter__btn ${countdownFrom === n ? 'is-active' : ''}`}
                    onClick={() => setCountdownFrom(n)}
                  >
                    {n} Detik
                  </button>
                ))}
              </div>
            </div>

            <div className="panel__tips">
              <div className="tip-card">
                <span className="tip-icon">🕷️</span>
                <div className="tip-text">
                  <strong>3 Pose Heroik:</strong> Kamera akan mengambil 3 jepretan foto berurutan dengan panduan pose Spider-Man.
                </div>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🪪</span>
                <div className="tip-text">
                  <strong>Multiverse ID &amp; Cover:</strong> Di layar edit, buat Kartu Anggota Spider-Society &amp; Sampul Majalah Komik Marvel!
                </div>
              </div>
            </div>

            <button
              className="btn btn--primary btn--lg btn--glow"
              onClick={() => setStage('capture')}
            >
              LANJUT KE KAMERA →
            </button>
          </section>
        )}

        {stage === 'capture' && (
          <section className="panel panel--capture">
            <Viewfinder
              filterCss={filterCss}
              countdownFrom={countdownFrom}
              muted={muted}
              onComplete={(shots) => {
                setPhotos(shots)
                setStage('edit')
              }}
            />
            <button className="btn btn--ghost" onClick={() => setStage('setup')}>
              ← Ganti Filter &amp; Pengaturan
            </button>
          </section>
        )}

        {stage === 'edit' && (
          <section className="panel panel--edit">
            <StickerBelt
              mode={mode}
              armedId={armedId}
              onArm={setArmedId}
              onOpenBubbleModal={() => setBubbleModalOpen(true)}
              customBubbles={customBubbles}
            />

            <ComicToggle mode={mode} onChange={setMode} />

            <StripPreview
              photos={photos}
              mode={mode}
              armedId={armedId}
              onArm={setArmedId}
              onRestart={() => {
                setPhotos([])
                setArmedId(null)
                setStage('capture')
              }}
              onRetakePhoto={handleRetakePhoto}
              filterCss={filterCss}
              countdownFrom={countdownFrom}
              muted={muted}
              customBubbles={customBubbles}
              onAddCustomBubble={handleAddCustomBubble}
            />
          </section>
        )}
      </main>

      {/* Global Speech Bubble Modal */}
      <SpeechBubbleModal
        isOpen={bubbleModalOpen}
        onClose={() => setBubbleModalOpen(false)}
        onAddBubble={handleAddCustomBubble}
      />

      {/* Mobile Floating Action Dock */}
      <MobileDock
        stage={stage}
        onSetStage={setStage}
        onOpenIdCard={() => {
          const btn = document.querySelector('.btn-feature-item')
          btn?.click()
        }}
        onOpenComicCover={() => {
          const btns = document.querySelectorAll('.btn-feature-item')
          btns[1]?.click()
        }}
        onOpenCanonEvent={() => {
          const btns = document.querySelectorAll('.btn-feature-item')
          btns[2]?.click()
        }}
        onToggleDoodle={() => {
          const dBtn = document.querySelector('.editor__doodleToggle .btn')
          dBtn?.click()
        }}
        onDownload={() => {
          const dBtn = document.querySelector('.editor__actions .btn--primary')
          dBtn?.click()
        }}
      />

      <footer className="app__footer">
        COBWEB BOOTH // SPIDER-VERSE MULTIVERSE PHOTOSTUDIO — Didesain secara orisinal dengan Web Audio Synth &amp; Canvas Rendering.
      </footer>
    </div>
  )
}
