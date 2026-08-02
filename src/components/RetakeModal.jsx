import { useEffect, useRef, useState } from 'react'
import { captureFrame } from '../utils/compositor'
import { playBeep, playShutter } from '../utils/sound'

export default function RetakeModal({ filterCss, countdownFrom = 3, muted = false, onDone, onCancel }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)
  const [count, setCount] = useState(null)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    let cancelled = false
    navigator.mediaDevices
      ?.getUserMedia({ video: { width: 1280, height: 960, facingMode: 'user' }, audio: false })
      .then((stream) => {
        if (cancelled) return
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
        setReady(true)
      })
      .catch((err) => setError(err.message || 'Tidak bisa mengakses kamera'))

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function startCountdown() {
    let n = countdownFrom
    setCount(n)
    if (!muted) playBeep(520, 0.1, 'sine', 0.12)
    const tick = setInterval(() => {
      n -= 1
      if (n === 0) {
        clearInterval(tick)
        setCount('•')
        setFlash(true)
        if (!muted) playShutter()
        const frame = captureFrame(videoRef.current, filterCss)
        setTimeout(() => setFlash(false), 150)
        streamRef.current?.getTracks().forEach((t) => t.stop())
        onDone(frame)
      } else {
        if (!muted) playBeep(520, 0.1, 'sine', 0.12)
        setCount(n)
      }
    }, 1000)
  }

  return (
    <div className="retakeModal">
      <div className={`viewfinder__panel retakeModal__panel ${flash ? 'is-flash' : ''}`}>
        {error && <div className="viewfinder__error">Kamera tidak dapat diakses: {error}</div>}
        <video ref={videoRef} className="viewfinder__video" style={{ filter: filterCss }} muted playsInline />
        {count !== null && <div className="viewfinder__count">{count}</div>}
      </div>
      <div className="retakeModal__actions">
        <button className="btn btn--ghost" onClick={onCancel}>Batal</button>
        <button className="btn btn--primary" disabled={!ready || count !== null} onClick={startCountdown}>
          AMBIL ULANG
        </button>
      </div>
    </div>
  )
}
