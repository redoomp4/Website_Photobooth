import { useEffect, useRef, useState } from 'react'

export default function GifPreviewModal({ isOpen, onClose, photos, muted }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [fps, setFps] = useState(3) // 2 | 3 | 5 fps
  const [filterStyle, setFilterStyle] = useState('none') // 'none' | 'glitch' | 'comic'
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!isOpen || !photos || photos.length === 0) return

    const intervalTime = 1000 / fps
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % photos.length)
    }, intervalTime)

    return () => clearInterval(timer)
  }, [isOpen, photos, fps])

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--reel" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>🎬 Animated Spider-Loop Reel</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <p className="modal__subtitle">
            Preview animasi bergerak dari jepretan fotomu seperti rol film stop-motion komik!
          </p>

          <div className={`reel-player-box ${filterStyle === 'glitch' ? 'is-glitching' : ''}`}>
            {photos[currentIdx] && (
              <img
                src={photos[currentIdx]}
                alt={`Frame ${currentIdx + 1}`}
                className="reel-frame-img"
              />
            )}
            <div className="reel-badge">
              FRAME {currentIdx + 1} / {photos.length}
            </div>
            <div className="reel-watermark">
              SPIDER-VERSE FLIPBOOK
            </div>
          </div>

          <div className="reel-controls">
            <div className="form-group">
              <label>Kecepatan Animasi:</label>
              <div className="button-group-row">
                <button
                  className={`btn-tag ${fps === 2 ? 'is-active' : ''}`}
                  onClick={() => setFps(2)}
                >
                  Santai (2 FPS)
                </button>
                <button
                  className={`btn-tag ${fps === 3 ? 'is-active' : ''}`}
                  onClick={() => setFps(3)}
                >
                  Klasik (3 FPS)
                </button>
                <button
                  className={`btn-tag ${fps === 6 ? 'is-active' : ''}`}
                  onClick={() => setFps(6)}
                >
                  Cepat (6 FPS)
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Efek Visual Loop:</label>
              <div className="button-group-row">
                <button
                  className={`btn-tag ${filterStyle === 'none' ? 'is-active' : ''}`}
                  onClick={() => setFilterStyle('none')}
                >
                  Natural
                </button>
                <button
                  className={`btn-tag ${filterStyle === 'glitch' ? 'is-active' : ''}`}
                  onClick={() => setFilterStyle('glitch')}
                >
                  ⚡ Multiverse Glitch
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal__actions">
          <button className="btn btn--primary" onClick={onClose}>
            ✓ Tutup Preview
          </button>
        </div>
      </div>
    </div>
  )
}
