import { useEffect, useRef, useState } from 'react'

const COLOR_PALETTE = [
  { id: 'white', name: 'Web White', hex: '#F5F3EE' },
  { id: 'red', name: 'Electric Red', hex: '#E63946' },
  { id: 'cyan', name: 'Neon Cyan', hex: '#00E5FF' },
  { id: 'pink', name: 'Gwen Pink', hex: '#FF007F' },
  { id: 'gold', name: 'Gold', hex: '#FFC857' },
  { id: 'green', name: 'Slime Green', hex: '#10B981' },
]

const BRUSH_SIZES = [
  { id: 'thin', name: 'Tipis', size: 3 },
  { id: 'med', name: 'Sedang', size: 8 },
  { id: 'bold', name: 'Tebal', size: 16 },
]

export default function DoodleCanvas({ enabled, onCanvasReady }) {
  const canvasRef = useRef(null)
  const [color, setColor] = useState(COLOR_PALETTE[0].hex)
  const [brushSize, setBrushSize] = useState(8)
  const [isGlow, setIsGlow] = useState(true)
  const [isEraser, setIsEraser] = useState(false)
  const [history, setHistory] = useState([])
  const isDrawing = useRef(false)
  const lastPoint = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.parentElement.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    if (onCanvasReady) {
      onCanvasReady(canvas)
    }
  }, [onCanvasReady])

  const saveState = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setHistory((prev) => [...prev, imgData])
  }

  const handleUndo = () => {
    const canvas = canvasRef.current
    if (!canvas || history.length === 0) return
    const ctx = canvas.getContext('2d')
    const newHistory = [...history]
    newHistory.pop()
    const lastState = newHistory[newHistory.length - 1]
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (lastState) {
      ctx.putImageData(lastState, 0, 0)
    }
    setHistory(newHistory)
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHistory([])
  }

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const startDrawing = (e) => {
    if (!enabled) return
    isDrawing.current = true
    lastPoint.current = getCanvasCoords(e)
    saveState()
  }

  const draw = (e) => {
    if (!enabled || !isDrawing.current || !lastPoint.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const currentPoint = getCanvasCoords(e)

    ctx.beginPath()
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y)
    ctx.lineTo(currentPoint.x, currentPoint.y)

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = brushSize * 2
      ctx.lineCap = 'round'
      ctx.stroke()
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = color

      if (isGlow) {
        ctx.shadowBlur = brushSize * 1.5
        ctx.shadowColor = color
      } else {
        ctx.shadowBlur = 0
      }
      ctx.stroke()
    }

    lastPoint.current = currentPoint
  }

  const stopDrawing = () => {
    isDrawing.current = false
    lastPoint.current = null
  }

  return (
    <div className={`doodleWrapper ${enabled ? 'is-enabled' : ''}`}>
      <canvas
        ref={canvasRef}
        className="doodleCanvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {enabled && (
        <div className="doodleToolbar" onClick={(e) => e.stopPropagation()}>
          <div className="doodleToolbar__section">
            <span className="doodleToolbar__label">WARNA</span>
            <div className="doodleColors">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.id}
                  className={`doodleColorBtn ${color === c.hex && !isEraser ? 'is-active' : ''}`}
                  style={{ background: c.hex }}
                  title={c.name}
                  onClick={() => {
                    setColor(c.hex)
                    setIsEraser(false)
                  }}
                />
              ))}
              <button
                className={`doodleEraserBtn ${isEraser ? 'is-active' : ''}`}
                onClick={() => setIsEraser(true)}
                title="Penghapus"
              >
                🧹
              </button>
            </div>
          </div>

          <div className="doodleToolbar__section">
            <span className="doodleToolbar__label">UKURAN</span>
            <div className="doodleSizes">
              {BRUSH_SIZES.map((b) => (
                <button
                  key={b.id}
                  className={`doodleSizeBtn ${brushSize === b.size ? 'is-active' : ''}`}
                  onClick={() => setBrushSize(b.size)}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <div className="doodleToolbar__section">
            <button
              className={`doodleGlowBtn ${isGlow ? 'is-active' : ''}`}
              onClick={() => setIsGlow((g) => !g)}
            >
              ✨ Glow Neon
            </button>
            <button className="btn btn--ghost btn--sm" onClick={handleUndo} disabled={history.length === 0}>
              ↩️ Undo
            </button>
            <button className="btn btn--ghost btn--sm" onClick={handleClear}>
              🗑️ Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
