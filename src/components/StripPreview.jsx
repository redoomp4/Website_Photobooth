import { useRef, useState } from 'react'
import { STICKERS, svgToDataUri } from '../stickers/stickerData'
import { renderStrip, SPIDER_THEMES } from '../utils/compositor'
import RetakeModal from './RetakeModal'
import DoodleCanvas from './DoodleCanvas'
import ShareModal from './ShareModal'

const REF_W = 640
const REF_H = 480

let uidCounter = 0
const nextUid = () => `st-${uidCounter++}`

export default function StripPreview({
  photos,
  mode,
  armedId,
  onArm,
  onRestart,
  onRetakePhoto,
  filterCss,
  countdownFrom,
  muted,
}) {
  const [placements, setPlacements] = useState(() => photos.map(() => []))
  const [captions, setCaptions] = useState(() => photos.map(() => ''))
  const [themeId, setThemeId] = useState('spidey')
  const [layout, setLayout] = useState('strip') // 'strip' | 'grid'
  const [selected, setSelected] = useState(null) // { cellIndex, uid }
  const [busy, setBusy] = useState(false)
  const [retakeIndex, setRetakeIndex] = useState(null)
  const [doodleEnabled, setDoodleEnabled] = useState(false)
  const [shareDataUrl, setShareDataUrl] = useState(null)
  const [adjustments, setAdjustments] = useState(() =>
    photos.map(() => ({ zoom: 1, x: 0, y: 0, mirrored: false, rotation: 0 }))
  )
  const [adjustingIndex, setAdjustingIndex] = useState(null)
  const doodleCanvasRef = useRef(null)
  const cellRefs = useRef([])
  const dragRef = useRef(null)

  const stickerById = (id) => STICKERS.find((s) => s.id === id)
  const activeTheme = SPIDER_THEMES.find((t) => t.id === themeId) || SPIDER_THEMES[0]

  function handleCellClick(cellIndex, e) {
    if (adjustingIndex !== null) return
    if (!armedId || doodleEnabled) return
    if (dragRef.current) return
    const rect = cellRefs.current[cellIndex].getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const uid = nextUid()
    setPlacements((prev) => {
      const copy = prev.map((arr) => [...arr])
      copy[cellIndex].push({ uid, stickerId: armedId, mode, x, y, size: 130, rotation: 0 })
      return copy
    })
    setSelected({ cellIndex, uid })
  }

  function updatePlacement(cellIndex, uid, patch) {
    setPlacements((prev) => {
      const copy = prev.map((arr) => [...arr])
      copy[cellIndex] = copy[cellIndex].map((p) => (p.uid === uid ? { ...p, ...patch } : p))
      return copy
    })
  }

  function updateAdjustment(index, patch) {
    setAdjustments((prev) =>
      prev.map((adj, idx) => (idx === index ? { ...adj, ...patch } : adj))
    )
  }

  function removeSelected() {
    if (!selected) return
    setPlacements((prev) => {
      const copy = prev.map((arr) => [...arr])
      copy[selected.cellIndex] = copy[selected.cellIndex].filter((p) => p.uid !== selected.uid)
      return copy
    })
    setSelected(null)
  }

  function onStickerPointerDown(cellIndex, uid, e) {
    if (doodleEnabled || adjustingIndex !== null) return
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { cellIndex, uid, pointerId: e.pointerId }
    setSelected({ cellIndex, uid })
  }

  function onStickerPointerMove(cellIndex, e) {
    if (doodleEnabled || adjustingIndex !== null || !dragRef.current || dragRef.current.cellIndex !== cellIndex) return
    const rect = cellRefs.current[cellIndex].getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))
    updatePlacement(cellIndex, dragRef.current.uid, { x, y })
  }

  function onStickerPointerUp() {
    dragRef.current = null
  }

  const selectedPlacement =
    selected && placements[selected.cellIndex]?.find((p) => p.uid === selected.uid)

  async function handleDownload() {
    setBusy(true)
    try {
      const stickerPlacements = placements.map((cellArr) =>
        cellArr.map((p) => ({
          x: p.x,
          y: p.y,
          rotation: p.rotation,
          size: (p.size / 200) * REF_W * 0.55,
          src: svgToDataUri(stickerById(p.stickerId)[p.mode]),
        }))
      )
      const dataUrl = await renderStrip({
        photos,
        placements: stickerPlacements,
        themeId,
        title: 'COBWEB BOOTH',
        layout,
        captions,
        doodleCanvas: doodleCanvasRef.current,
        adjustments,
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `cobweb-${themeId}-strip.png`
      a.click()

      // Open Digital Photobooth Receipt Share Modal
      setShareDataUrl(dataUrl)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="editor" onClick={() => setSelected(null)}>
      <div
        className={`editor__strip ${layout === 'grid' ? 'editor__strip--grid' : ''} editor__strip--${themeId}`}
        style={{
          background: activeTheme.bg,
          borderColor: activeTheme.borderColor,
          color: activeTheme.textColor,
        }}
      >
        {/* Spiderman Frame Overlay Graphic when Spidey theme is selected */}
        {activeTheme.useTemplate && layout === 'strip' && (
          <img
            src="/Spidey Strip Photobooth 1.png"
            className="editor__spideyOverlay"
            alt="Spiderman Frame Overlay"
          />
        )}

        <h2 className="editor__title" style={{ color: activeTheme.textColor }}>
          {activeTheme.badge} COBWEB BOOTH {activeTheme.badge}
        </h2>

        {photos.map((src, i) => {
          const adj = adjustments[i]
          const isAdjusting = adjustingIndex === i
          return (
            <div key={i} className="editor__cellWrap">
              <div
                ref={(el) => (cellRefs.current[i] = el)}
                className={`editor__cell ${isAdjusting ? 'is-adjusting' : ''}`}
                style={{
                  aspectRatio: `${REF_W}/${REF_H}`,
                  borderColor: activeTheme.accentColor || 'rgba(0,0,0,0.3)',
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCellClick(i, e)
                }}
                onPointerMove={(e) => onStickerPointerMove(i, e)}
              >
                <img
                  src={src}
                  className="editor__photo"
                  alt={`Jepretan ${i + 1}`}
                  style={{
                    transform: `scaleX(${adj.mirrored ? -1 : 1}) scale(${adj.zoom}) translate(${adj.x * 100}%, ${adj.y * 100}%) rotate(${adj.rotation}deg)`,
                    transition: 'none',
                  }}
                />
                {placements[i].map((p) => {
                  const st = stickerById(p.stickerId)
                  const isSel = selected && selected.uid === p.uid
                  return (
                    <img
                      key={p.uid}
                      src={svgToDataUri(st[p.mode])}
                      alt={st.name}
                      className={`editor__sticker ${isSel ? 'is-selected' : ''}`}
                      style={{
                        left: `${p.x * 100}%`,
                        top: `${p.y * 100}%`,
                        width: p.size,
                        height: p.size,
                        transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
                      }}
                      onPointerDown={(e) => onStickerPointerDown(i, p.uid, e)}
                      onPointerUp={onStickerPointerUp}
                      onClick={(e) => e.stopPropagation()}
                      draggable={false}
                    />
                  )
                })}
                <button
                  className="editor__retakeBtn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setRetakeIndex(i)
                  }}
                >
                  ⟲ Ambil ulang
                </button>
                <button
                  className={`editor__adjustBtn ${isAdjusting ? 'is-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setAdjustingIndex(isAdjusting ? null : i)
                  }}
                >
                  ⚙️ Sesuaikan
                </button>
              </div>
              {captions[i] && <div className="editor__captionPreview">{captions[i]}</div>}
            </div>
          )
        })}

        <div className="editor__footer" style={{ color: activeTheme.textColor }}>
          {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
        </div>

        {/* Doodle Drawing Layer Overlay */}
        <DoodleCanvas
          enabled={doodleEnabled}
          onCanvasReady={(cvs) => (doodleCanvasRef.current = cvs)}
        />
      </div>

      <div className="editor__controls" onClick={(e) => e.stopPropagation()}>
        <div className="editor__doodleToggle">
          <span>MODE CORET-CORET / DOODLE</span>
          <button
            className={`btn ${doodleEnabled ? 'btn--primary' : 'btn--ghost'}`}
            style={{ width: '100%' }}
            onClick={() => setDoodleEnabled((d) => !d)}
          >
            {doodleEnabled ? '✏️ MATIKAN CORETAN' : '🎨 CORET-CORET JARING (PEN)'}
          </button>
        </div>

        <div className="editor__themePicker">
          <span className="editor__pickerLabel">TEMA SPIDER-VERSE</span>
          <div className="themeSelector">
            {SPIDER_THEMES.map((t) => (
              <button
                key={t.id}
                className={`themeBtn ${themeId === t.id ? 'is-active' : ''}`}
                onClick={() => setThemeId(t.id)}
                style={{
                  '--theme-bg': t.bg,
                  '--theme-border': t.borderColor,
                }}
              >
                <span className="themeBtn__badge">{t.badge}</span>
                <span className="themeBtn__name">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="editor__layoutToggle">
          <span>LAYOUT</span>
          <div className="webshooter__track">
            <button
              className={`webshooter__btn ${layout === 'strip' ? 'is-active' : ''}`}
              onClick={() => setLayout('strip')}
            >
              STRIP
            </button>
            <button
              className={`webshooter__btn ${layout === 'grid' ? 'is-active' : ''}`}
              onClick={() => setLayout('grid')}
            >
              GRID 2×2
            </button>
          </div>
        </div>

        <div className="editor__captions">
          <span>CAPTION PER FOTO</span>
          {photos.map((_, i) => (
            <input
              key={i}
              className="editor__captionInput"
              type="text"
              maxLength={28}
              placeholder={`Caption foto ${i + 1}…`}
              value={captions[i]}
              onChange={(e) => {
                const val = e.target.value
                setCaptions((prev) => prev.map((c, idx) => (idx === i ? val : c)))
              }}
            />
          ))}
        </div>

        {selectedPlacement && (
          <div className="editor__stickerControls">
            <span>STIKER TERPILIH</span>
            <label>
              Ukuran
              <input
                type="range"
                min="60"
                max="260"
                value={selectedPlacement.size}
                onChange={(e) =>
                  updatePlacement(selected.cellIndex, selected.uid, { size: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Putar
              <input
                type="range"
                min="-45"
                max="45"
                value={selectedPlacement.rotation}
                onChange={(e) =>
                  updatePlacement(selected.cellIndex, selected.uid, { rotation: Number(e.target.value) })
                }
              />
            </label>
            <button className="btn btn--ghost" onClick={removeSelected}>Hapus stiker</button>
          </div>
        )}

        <div className="editor__actions">
          <button className="btn btn--ghost" onClick={onRestart}>Ulangi Sesi</button>
          <button className="btn btn--primary" onClick={handleDownload} disabled={busy}>
            {busy ? 'MENYUSUN…' : 'UNDUH STRIP'}
          </button>
        </div>
      </div>

      {retakeIndex !== null && (
        <div className="retakeOverlay" onClick={(e) => e.stopPropagation()}>
          <RetakeModal
            filterCss={filterCss}
            countdownFrom={countdownFrom}
            muted={muted}
            onCancel={() => setRetakeIndex(null)}
            onDone={(dataUrl) => {
              onRetakePhoto(retakeIndex, dataUrl)
              setRetakeIndex(null)
            }}
          />
        </div>
      )}

      {shareDataUrl && (
        <ShareModal
          stripDataUrl={shareDataUrl}
          themeName={activeTheme.name}
          onClose={() => setShareDataUrl(null)}
        />
      )}
    </div>
  )
}
