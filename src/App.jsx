import { useState } from 'react'
import ComicToggle from './components/ComicToggle'
import FilterRail from './components/FilterRail'
import Viewfinder from './components/Viewfinder'
import StickerBelt from './components/StickerBelt'
import StripPreview from './components/StripPreview'
import { FILTERS } from './utils/compositor'

export default function App() {
  const [stage, setStage] = useState('setup') // setup | capture | edit
  const [filterId, setFilterId] = useState('original')
  const [mode, setMode] = useState('anime')
  const [armedId, setArmedId] = useState(null)
  const [photos, setPhotos] = useState([])

  const filterCss = FILTERS.find((f) => f.id === filterId)?.css || 'none'

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__brand-mark" aria-hidden>◈</span>
          <h1>COBWEB BOOTH</h1>
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
            <p className="panel__note">
              Filter berlaku saat kamera dijalankan. Gaya stiker bisa kamu ganti kapan pun di layar edit.
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
