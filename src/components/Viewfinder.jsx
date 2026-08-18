import { useEffect, useRef, useState } from 'react'
import { captureFrame } from '../utils/compositor'
import { playBeep, playShutter, playThwip, playSpiderSense, startAmbient, stopAmbient } from '../utils/sound'

const SHOTS_NEEDED = 3

const POSE_GUIDES = [
  { emoji: '🕷️', pose: 'Web Shooter!', hint: 'Arahkan tangan ke kamera seperti menembak jaring!' },
  { emoji: '🦸', pose: 'Hero Landing!', hint: 'Pose setengah jongkok, satu tangan ke tanah!' },
  { emoji: '🤟', pose: 'Hang Loose!', hint: 'Pose santai, buat tanda rock atau peace!' },
]

const AR_PREVIEWS = [
  { id: 'none', label: 'Polos' },
  { id: 'sense', label: '⚡ Spider-Sense' },
  { id: 'web', label: '🕸️ Web Reticle' },
]

export default function Viewfinder({ filterCss, countdownFrom = 3, muted = false, onComplete }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const fileInputRef = useRef(null)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)
  const [running, setRunning] = useState(false)
  const [count, setCount] = useState(null)
  const [shots, setShots] = useState([])
  const [flash, setFlash] = useState(false)
  const [clock, setClock] = useState(() => new Date())
  const [getReady, setGetReady] = useState(false)
  const [currentPose, setCurrentPose] = useState(0)
  const [showPose, setShowPose] = useState(false)
  const [arOverlay, setArOverlay] = useState('none')

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
      .catch((err) => {
        setError(err.message || 'Tidak bisa mengakses kamera')
      })

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

    // Show "GET READY" and pose guide before countdown starts
    setCurrentPose(shots.length % POSE_GUIDES.length)
    setGetReady(true)
    setShowPose(true)
    if (!muted) playSpiderSense()

    const readyTimeout = setTimeout(() => {
      setGetReady(false)
      // Start actual countdown after the "get ready" phase
      let n = countdownFrom
      setCount(n)
      if (!muted) playBeep(520, 0.1, 'sine', 0.12)

      const tick = setInterval(() => {
        n -= 1
        if (n === 0) {
          clearInterval(tick)
          setCount('📸')
          setShowPose(false)
          setFlash(true)
          if (!muted) {
            playShutter()
            playThwip()
          }
          const frame = captureFrame(videoRef.current, filterCss)
          setTimeout(() => setFlash(false), 280)
          setShots((prev) => [...prev, frame])
          setCount(null)
        } else {
          if (!muted) playBeep(520 + (countdownFrom - n) * 80, 0.1, 'sine', 0.12)
          setCount(n)
        }
      }, 1000)

      return () => clearInterval(tick)
    }, 1500)

    return () => {
      clearTimeout(readyTimeout)
      setGetReady(false)
      setShowPose(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, shots.length])

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    const readers = files.slice(0, SHOTS_NEEDED).map((file) => {
      return new Promise((res) => {
        const reader = new FileReader()
        reader.onload = (evt) => res(evt.target.result)
        reader.readAsDataURL(file)
      })
    })
    Promise.all(readers).then((uploadedPhotos) => {
      while (uploadedPhotos.length < SHOTS_NEEDED) {
        uploadedPhotos.push(uploadedPhotos[0])
      }
      onComplete(uploadedPhotos)
    })
  }

  const poseData = POSE_GUIDES[currentPose]

  return (
    <div className="viewfinder">
      <div className={`viewfinder__panel ${flash ? 'is-flash' : ''}`}>
        {error && (
          <div className="viewfinder__error">
            <p>⚠️ Kamera tidak dapat diakses ({error}).</p>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>
              Kamu bisa mengunggah 3 foto langsung dari galeri / perangkat:
            </p>
            <button
              className="btn btn--secondary btn--sm"
              style={{ marginTop: '10px' }}
              onClick={() => fileInputRef.current?.click()}
            >
              📁 Unggah 3 Foto dari Perangkat
            </button>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
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

        {/* Live AR Overlay Preview */}
        {arOverlay === 'sense' && (
          <div className="viewfinder__arSense">
            <div className="sense-wave wave-1" />
            <div className="sense-wave wave-2" />
            <div className="sense-wave wave-3" />
          </div>
        )}

        {arOverlay === 'web' && (
          <div className="viewfinder__arWeb">
            <div className="web-circle c-1" />
            <div className="web-circle c-2" />
            <div className="web-cross-h" />
            <div className="web-cross-v" />
          </div>
        )}

        {/* GET READY overlay between shots */}
        {getReady && (
          <div className="viewfinder__getReady">
            <span className="viewfinder__readyLabel">BERSIAP!</span>
            <span className="viewfinder__readyShot">FOTO {shots.length + 1} DARI {SHOTS_NEEDED}</span>
          </div>
        )}

        {/* Pose Guide silhouette overlay */}
        {showPose && poseData && (
          <div className="viewfinder__poseGuide">
            <span className="viewfinder__poseEmoji">{poseData.emoji}</span>
            <span className="viewfinder__poseName">{poseData.pose}</span>
            <span className="viewfinder__poseHint">{poseData.hint}</span>
          </div>
        )}

        {/* Countdown number */}
        {count !== null && !getReady && (
          <div className="viewfinder__count">{count}</div>
        )}

        {/* Shot progress dots */}
        <div className="viewfinder__shotdots">
          {Array.from({ length: SHOTS_NEEDED }).map((_, i) => (
            <span
              key={i}
              className={`viewfinder__dot ${i < shots.length ? 'is-done' : ''} ${i === shots.length && running ? 'is-current' : ''}`}
            />
          ))}
        </div>

        {/* Viewfinder corner brackets */}
        <div className="viewfinder__bracket viewfinder__bracket--tl" />
        <div className="viewfinder__bracket viewfinder__bracket--tr" />
        <div className="viewfinder__bracket viewfinder__bracket--bl" />
        <div className="viewfinder__bracket viewfinder__bracket--br" />

        {/* REC indicator when running */}
        {running && (
          <div className="viewfinder__rec">
            <span className="viewfinder__recDot" />
            REC
          </div>
        )}
      </div>

      {/* AR Overlay Switcher */}
      <div className="viewfinder__arToolbar">
        <span className="arToolbar__label">Efek Kamera:</span>
        <div className="arToolbar__options">
          {AR_PREVIEWS.map((ar) => (
            <button
              key={ar.id}
              className={`btn-ar ${arOverlay === ar.id ? 'is-active' : ''}`}
              onClick={() => setArOverlay(ar.id)}
            >
              {ar.label}
            </button>
          ))}
        </div>
      </div>

      <button
        className="btn btn--primary btn--lg"
        disabled={!ready || running}
        onClick={() => {
          setShots([])
          setRunning(true)
          startAmbient(muted)
        }}
      >
        {running ? `📸 MEMOTRET… ${shots.length}/${SHOTS_NEEDED}` : `🕷️ MULAI SESI · ${SHOTS_NEEDED} JEPRETAN`}
      </button>

      <div className="viewfinder__footerRow">
        <p className="viewfinder__hint">
          {running
            ? 'Ikuti panduan pose! Tiap jepretan punya hitung mundur.'
            : `Tiap jepretan punya hitung mundur ${countdownFrom} detik.`}
        </p>
        <button
          className="btn-upload-link"
          onClick={() => fileInputRef.current?.click()}
        >
          📁 Upload foto sendiri
        </button>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </div>
    </div>
  )
}
