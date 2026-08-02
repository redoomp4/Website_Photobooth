import { useRef, useState } from 'react'
import { STICKERS, svgToDataUri } from '../stickers/stickerData'
import { renderStrip } from '../utils/compositor'

const REF_W = 640
const REF_H = 480

const FRAME_COLORS = [
  { id: 'ink', label: 'Midnight Ink', hex: '#0B1330' },
  { id: 'crimson', label: 'Signal Red', hex: '#8C1220' },
  { id: 'violet', label: 'Toxic Violet', hex: '#3B0764' },
  { id: 'teal', label: 'Lantern Teal', hex: '#0F4C4C' },
  { id: 'cream', label: 'Comic Cream', hex: '#F5F3EE' },
]

let uidCounter = 0
const nextUid = () => `st-${uidCounter++}`

export default function StripPreview({ photos, mode, armedId, onArm, onRestart }) {
  const [placements, setPlacements] = useState(() => photos.map(() => []))
  const [frameColor, setFrameColor] = useState(FRAME_COLORS[0].hex)
  const [selected, setSelected] = useState(null) // { cellIndex, uid }
  const [busy, setBusy] = useState(false)
  const cellRefs = useRef([])
  const dragRef = useRef(null) // { cellIndex, uid, pointerId }

  const stickerById = (id) => STICKERS.find((s) => s.id === id)

  function handleCellClick(cellIndex, e) {
    if (!armedId) return
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
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { cellIndex, uid, pointerId: e.pointerId }
    setSelected({ cellIndex, uid })
  }

  function onStickerPointerMove(cellIndex, e) {
    if (!dragRef.current || dragRef.current.cellIndex !== cellIndex) return
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
          size: (p.size / 200) * REF_W * 0.55, // convert on-screen scale to canvas px
          src: svgToDataUri(stickerById(p.stickerId)[p.mode]),
        }))
      )
      const dataUrl = await renderStrip({
        photos,
        placements: stickerPlacements,
        frameColor,
        title: 'COBWEB BOOTH',
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'cobweb-booth-strip.png'
      a.click()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="editor" onClick={() => setSelected(null)}>
      <div className="editor__strip" style={{ background: frameColor }}>
        <h2 className="editor__title">COBWEB BOOTH</h2>
        {photos.map((src, i) => (
          <div
            key={i}
            ref={(el) => (cellRefs.current[i] = el)}
            className="editor__cell"
            style={{ aspectRatio: `${REF_W}/${REF_H}` }}
            onClick={(e) => {
              e.stopPropagation()
              handleCellClick(i, e)
            }}
            onPointerMove={(e) => onStickerPointerMove(i, e)}
          >
            <img src={src} className="editor__photo" alt={`Jepretan ${i + 1}`} />
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
          </div>
        ))}
        <div className="editor__footer">{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
      </div>

      <div className="editor__controls" onClick={(e) => e.stopPropagation()}>
        <div className="editor__frameColors">
          <span>WARNA BINGKAI</span>
          <div className="editor__swatches">
            {FRAME_COLORS.map((c) => (
              <button
                key={c.id}
                className={`swatch ${frameColor === c.hex ? 'is-active' : ''}`}
                style={{ background: c.hex }}
                title={c.label}
                onClick={() => setFrameColor(c.hex)}
              />
            ))}
          </div>
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
    </div>
  )
}
