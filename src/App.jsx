import { useState } from 'react'
import ComicToggle from './components/ComicToggle'
import FilterRail from './components/FilterRail'
import Viewfinder from './components/Viewfinder'
import StickerBelt from './components/StickerBelt'
import StripPreview from './components/StripPreview'
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

  const filterCss = FILTERS.find((f) => f.id === filterId)?.css || 'none'

  function handleRetakePhoto(index, dataUrl) {
    setPhotos((prev) => prev.map((p, i) => (i === index ? dataUrl : p)))
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__brand-mark" aria-hidden>◈</span>
          <h1>COBWEB BOOTH</h1>
          <button
            className="app__muteBtn"
            onClick={() => setMuted((m) => !m)}
            aria-pressed={muted}
            title={muted ? 'Nyalakan suara' : 'Matikan suara'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
        <p className="app__tagline">Photo booth pahlawan laba-laba — versi orisinal, bebas tempel stiker.</p>
      </header>

      <div className="app__crackbg" aria-hidden />

      <main className="app__stage">
        {stage === 'setup' && (
          <section className="panel panel--setup">
            <h2 className="panel__title">Siapkan Sesi</h2>
            <FilterRail activeId={filterId} onSelect={setFilterId} />
            <ComicToggle mode={mode} onChange={setMode} />

            <div className="countdownPicker">
              <span className="countdownPicker__label">DURASI HITUNG MUNDUR</span>
              <div className="webshooter__track">
                {COUNTDOWN_OPTIONS.map((n) => (
                  <button
                    key={n}
                    className={`webshooter__btn ${countdownFrom === n ? 'is-active' : ''}`}
                    onClick={() => setCountdownFrom(n)}
                  >
                    {n}D
                  </button>
                ))}
              </div>
            </div>

            <p className="panel__note">
              Filter berlaku saat kamera dijalankan. Gaya stiker & layout bisa kamu ganti kapan pun di layar edit.
            </p>
            <button className="btn btn--primary btn--lg" onClick={() => setStage('capture')}>
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
            <button className="btn btn--ghost" onClick={() => setStage('setup')}>← Ganti filter</button>
          </section>
        )}

        {stage === 'edit' && (
          <section className="panel panel--edit">
            <StickerBelt mode={mode} armedId={armedId} onArm={setArmedId} />
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
            />
          </section>
        )}
      </main>

      <footer className="app__footer">
        Karakter Nightweb, Glitchback &amp; Lantern-Fly adalah desain orisinal COBWEB BOOTH — bukan afiliasi Marvel/Sony.
      </footer>
    </div>
  )
}
