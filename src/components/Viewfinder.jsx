import { useEffect, useRef, useState } from 'react'
import { captureFrame } from '../utils/compositor'
import { playBeep, playShutter, startAmbient, stopAmbient } from '../utils/sound'

const SHOTS_NEEDED = 3

export default function Viewfinder({ filterCss, countdownFrom = 3, muted = false, onComplete }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)
  const [running, setRunning] = useState(false)
  const [count, setCount] = useState(null)
  const [shots, setShots] = useState([])
  const [flash, setFlash] = useState(false)
  const [clock, setClock] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

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
      stopAmbient()
    }
  }, [])

  useEffect(() => {
    if (!running) return
    if (shots.length >= SHOTS_NEEDED) {
      stopAmbient()
      onComplete(shots)
      return
    }

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
        setShots((prev) => [...prev, frame])
        setCount(null)
      } else {
        if (!muted) playBeep(520, 0.1, 'sine', 0.12)
        setCount(n)
      }
    }, 1000)

    return () => clearInterval(tick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, shots.length])

  return (
    <div className="viewfinder">
      <div className={`viewfinder__panel ${flash ? 'is-flash' : ''}`}>
        {error && (
          <div className="viewfinder__error">
            Kamera tidak dapat diakses: {error}. Izinkan akses kamera di browser lalu muat ulang halaman.
          </div>
        )}
        <video
          ref={videoRef}
          className="viewfinder__video"
          style={{ filter: filterCss }}
          muted
          playsInline
        />
        <div className="viewfinder__clock">
          {clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        {count !== null && <div className="viewfinder__count">{count}</div>}
        <div className="viewfinder__shotdots">
          {Array.from({ length: SHOTS_NEEDED }).map((_, i) => (
            <span key={i} className={`viewfinder__dot ${i < shots.length ? 'is-done' : ''}`} />
          ))}
        </div>
      </div>

      <button
        className="btn btn--primary"
        disabled={!ready || running}
        onClick={() => {
          setShots([])
          setRunning(true)
          startAmbient(muted)
        }}
      >
        {running ? 'SEDANG MEMOTRET…' : 'MULAI SESI · 4 JEPRETAN'}
      </button>
      <p className="viewfinder__hint">Bersiap pose — tiap jepretan punya hitung mundur {countdownFrom} detik.</p>
    </div>
  )
}
