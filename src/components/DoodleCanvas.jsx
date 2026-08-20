import { useEffect, useRef, useState } from 'react'

const COLOR_PALETTE = [
  { id: 'white', name: 'Web White', hex: '#F5F3EE' },
  { id: 'red', name: 'Electric Red', hex: '#E63946' },
  { id: 'cyan', name: 'Neon Cyan', hex: '#00E5FF' },
  { id: 'pink', name: 'Gwen Pink', hex: '#FF007F' },
  { id: 'gold', name: 'Gold', hex: '#FFE600' },
  { id: 'green', name: 'Slime Green', hex: '#10B981' },
]

const BRUSH_TYPES = [
  { id: 'neon', name: '🖍️ Neon Marker' },
  { id: 'web', name: '🕸️ Spider-Web' },
  { id: 'spray', name: '🎨 Graffiti Spray' },
  { id: 'spark', name: '⚡ Electric Spark' },
]

export default function DoodleCanvas({ enabled, onCanvasReady }) {
  const canvasRef = useRef(null)
  const [color, setColor] = useState(COLOR_PALETTE[0].hex)
  const [brushSize, setBrushSize] = useState(6)
  const [brushType, setBrushType] = useState('neon')
  const [isEraser, setIsEraser] = useState(false)
  const [history, setHistory] = useState([])
  const isDrawing = useRef(false)
  const lastPoint = useRef(null)
  const webPoints = useRef([])

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
    webPoints.current = []
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
    const pt = getCanvasCoords(e)
    lastPoint.current = pt
    webPoints.current = [pt]
    saveState()
  }

  const draw = (e) => {
    if (!enabled || !isDrawing.current || !lastPoint.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const currentPoint = getCanvasCoords(e)

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(currentPoint.x, currentPoint.y, brushSize * 2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.globalCompositeOperation = 'source-over'

      if (brushType === 'neon') {
        ctx.beginPath()
        ctx.moveTo(lastPoint.current.x, lastPoint.current.y)
        ctx.lineTo(currentPoint.x, currentPoint.y)
        ctx.lineWidth = brushSize
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = color
        ctx.shadowBlur = brushSize * 2
        ctx.shadowColor = color
        ctx.stroke()
      } else if (brushType === 'spray') {
        // Spray Paint Mist
        const density = 25
        const radius = brushSize * 3
        ctx.shadowBlur = 0
        ctx.fillStyle = color
        for (let i = 0; i < density; i++) {
          const offsetX = (Math.random() - 0.5) * radius * 2
          const offsetY = (Math.random() - 0.5) * radius * 2
          if (offsetX * offsetX + offsetY * offsetY <= radius * radius) {
            ctx.fillRect(currentPoint.x + offsetX, currentPoint.y + offsetY, 1.5, 1.5)
          }
        }
      } else if (brushType === 'spark') {
        // Bio-Electric Spark Lightning
        ctx.beginPath()
        ctx.moveTo(lastPoint.current.x, lastPoint.current.y)
        const midX = (lastPoint.current.x + currentPoint.x) / 2 + (Math.random() - 0.5) * 14
        const midY = (lastPoint.current.y + currentPoint.y) / 2 + (Math.random() - 0.5) * 14
        ctx.lineTo(midX, midY)
        ctx.lineTo(currentPoint.x, currentPoint.y)
        ctx.lineWidth = brushSize * 0.8
        ctx.strokeStyle = color
        ctx.shadowBlur = 10
        ctx.shadowColor = '#00E5FF'
        ctx.stroke()
      } else if (brushType === 'web') {
        // Geometric Spider Web Connector
        ctx.beginPath()
        ctx.moveTo(lastPoint.current.x, lastPoint.current.y)
        ctx.lineTo(currentPoint.x, currentPoint.y)
        ctx.lineWidth = 1.5
        ctx.strokeStyle = color
        ctx.stroke()

        webPoints.current.push(currentPoint)
        // Connect nearby points like a web
        for (let i = 0; i < webPoints.current.length; i += 2) {
          const pt = webPoints.current[i]
          const dx = currentPoint.x - pt.x
          const dy = currentPoint.y - pt.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 15 && dist < 70) {
            ctx.beginPath()
            ctx.moveTo(currentPoint.x, currentPoint.y)
            ctx.lineTo(pt.x, pt.y)
            ctx.strokeStyle = `rgba(245, 243, 238, 0.4)`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }
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
            <span className="doodleToolbar__label">TIPE KUAS:</span>
            <div className="doodleBrushTypes">
              {BRUSH_TYPES.map((bt) => (
                <button
                  key={bt.id}
                  className={`btn-tag btn-tag--sm ${brushType === bt.id && !isEraser ? 'is-active' : ''}`}
                  onClick={() => {
                    setBrushType(bt.id)
                    setIsEraser(false)
                  }}
                >
                  {bt.name}
                </button>
              ))}
              <button
                className={`btn-tag btn-tag--sm ${isEraser ? 'is-active' : ''}`}
                onClick={() => setIsEraser(true)}
              >
                🧹 Penghapus
              </button>
            </div>
          </div>

          <div className="doodleToolbar__section">
            <span className="doodleToolbar__label">WARNA NEON:</span>
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
            </div>
          </div>

          <div className="doodleToolbar__section" style={{ display: 'flex', gap: '6px' }}>
            <button className="btn btn--ghost btn--sm" onClick={handleUndo} disabled={history.length === 0}>
              ↩️ Undo
            </button>
            <button className="btn btn--ghost btn--sm" onClick={handleClear}>
              🗑️ Hapus Semua
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
