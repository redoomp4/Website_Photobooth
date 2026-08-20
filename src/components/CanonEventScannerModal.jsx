import { useState, useEffect } from 'react'
import { playSpiderSense, playGlitch, playBoom } from '../utils/sound'
import { loadImage } from '../utils/compositor'

const ANOMALY_TYPES = [
  { type: 'CANON EVENT THREAT LEVEL: MINIMAL', color: '#10B981', note: 'Timeline stabilized. No dimensional rift detected.' },
  { type: 'CANON EVENT THREAT LEVEL: CRITICAL', color: '#EF4444', note: 'ANOMALY DETECTED! Miguel O’Hara has dispatched an extraction strike team.' },
  { type: 'DIMENSIONAL GLITCH OSCILLATION: HIGH', color: '#00E5FF', note: 'Molecular decay imminent. Multiverse Daypass required.' },
  { type: 'HERO RESONANCE: 99.8% SYNCHRONIZED', color: '#FFE600', note: 'Prime Spider-DNA resonance confirmed. Ready for Multiverse Patrol.' },
]

const MISSION_OBJECTIVES = [
  'Patrol the Brooklyn Metro Sector and contain stray Symbiotes.',
  'Assist Earth-65 in neutralizing dimensional glitch anomalies.',
  'Investigate suspicious Alchemax laboratory energy signatures in Nueva York 2099.',
  'Deliver pizza on time while dodging Green Goblin glider attacks.',
]

export default function CanonEventScannerModal({ isOpen, onClose, photos, muted }) {
  const [scanning, setScanning] = useState(true)
  const [scanProgress, setScanProgress] = useState(0)
  const [dossierUrl, setDossierUrl] = useState(null)
  const [selectedAnomaly, setSelectedAnomaly] = useState(ANOMALY_TYPES[0])
  const [mission, setMission] = useState(MISSION_OBJECTIVES[0])
  const [agentCode, setAgentCode] = useState(() => `SECTOR-${Math.floor(100 + Math.random() * 900)}-HQ`)

  useEffect(() => {
    if (!isOpen) {
      setScanning(true)
      setScanProgress(0)
      setDossierUrl(null)
      return
    }

    if (!muted) playSpiderSense()

    // Randomize result
    const pickedAnomaly = ANOMALY_TYPES[Math.floor(Math.random() * ANOMALY_TYPES.length)]
    const pickedMission = MISSION_OBJECTIVES[Math.floor(Math.random() * MISSION_OBJECTIVES.length)]
    setSelectedAnomaly(pickedAnomaly)
    setMission(pickedMission)

    // Simulate scan animation
    let p = 0
    const interval = setInterval(() => {
      p += 5
      setScanProgress(p)
      if (p >= 100) {
        clearInterval(interval)
        setScanning(false)
        if (!muted) {
          playGlitch()
          setTimeout(playBoom, 200)
        }
      }
    }, 60)

    return () => clearInterval(interval)
  }, [isOpen, muted])

  const handleGenerateDossier = async () => {
    const canvas = document.createElement('canvas')
    const w = 800
    const h = 1000
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')

    // 1. Dark Classified Dossier Background
    ctx.fillStyle = '#0B0F19'
    ctx.fillRect(0, 0, w, h)

    // Hologram grid background
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)'
    ctx.lineWidth = 1
    for (let x = 0; x < w; x += 25) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y < h; y += 25) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    // Outer Cyber Border
    ctx.strokeStyle = '#00E5FF'
    ctx.lineWidth = 4
    ctx.strokeRect(16, 16, w - 32, h - 32)

    // Top Header Banner
    ctx.fillStyle = '#E63946'
    ctx.fillRect(20, 20, w - 40, 70)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '900 32px Bangers, cursive'
    ctx.textAlign = 'left'
    ctx.fillText('🕷️ SPIDER-SOCIETY CLASSIFIED INCIDENT DOSSIER', 40, 65)

    // Agent ID Stamp
    ctx.fillStyle = '#00E5FF'
    ctx.font = '700 14px "Press Start 2P", monospace'
    ctx.textAlign = 'right'
    ctx.fillText(agentCode, w - 40, 120)

    // 3 Photos Grid Preview
    const photoW = 220
    const photoH = 220
    const startX = 50
    const startY = 150

    for (let i = 0; i < Math.min(photos.length, 3); i++) {
      const px = startX + i * (photoW + 20)
      ctx.fillStyle = '#000'
      ctx.fillRect(px - 4, startY - 4, photoW + 8, photoH + 8)

      if (photos[i]) {
        const img = await loadImage(photos[i])
        ctx.drawImage(img, px, startY, photoW, photoH)
      }

      ctx.strokeStyle = selectedAnomaly.color
      ctx.lineWidth = 3
      ctx.strokeRect(px, startY, photoW, photoH)

      // Photo index badge
      ctx.fillStyle = 'rgba(0,0,0,0.75)'
      ctx.fillRect(px + 6, startY + 6, 80, 24)
      ctx.fillStyle = '#FFE600'
      ctx.font = '900 12px Manrope, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`TARGET 0${i + 1}`, px + 12, startY + 22)
    }

    // Threat Analysis Box
    ctx.fillStyle = 'rgba(18, 21, 36, 0.95)'
    ctx.fillRect(50, 410, w - 100, 160)
    ctx.strokeStyle = selectedAnomaly.color
    ctx.lineWidth = 2
    ctx.strokeRect(50, 410, w - 100, 160)

    ctx.fillStyle = selectedAnomaly.color
    ctx.font = '900 24px Bangers, Impact, sans-serif'
    ctx.fillText(`STATUS: ${selectedAnomaly.type}`, 70, 450)

    ctx.fillStyle = '#F8F9FA'
    ctx.font = '500 18px Manrope, sans-serif'
    ctx.fillText(`EVALUATION: ${selectedAnomaly.note}`, 70, 490)
    ctx.fillText(`MOLECULAR STABILITY: ${(94 + Math.random() * 5).toFixed(2)}%`, 70, 525)

    // Assigned Mission Brief
    ctx.fillStyle = 'rgba(18, 21, 36, 0.95)'
    ctx.fillRect(50, 600, w - 100, 180)
    ctx.strokeStyle = '#FFE600'
    ctx.lineWidth = 2
    ctx.strokeRect(50, 600, w - 100, 180)

    ctx.fillStyle = '#FFE600'
    ctx.font = '900 24px Bangers, Impact, sans-serif'
    ctx.fillText('DIRECTIVE & MISSION OBJECTIVE:', 70, 640)

    ctx.fillStyle = '#F8F9FA'
    ctx.font = '600 18px Manrope, sans-serif'
    ctx.fillText(`▶ ${mission}`, 70, 680)
    ctx.fillText('▶ Maintain Spider-Protocol 104-B. Avoid dimension bleed.', 70, 720)

    // Authorization Signature Box
    ctx.fillStyle = 'rgba(0, 229, 255, 0.1)'
    ctx.fillRect(50, 810, w - 100, 120)
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)'
    ctx.strokeRect(50, 810, w - 100, 120)

    ctx.fillStyle = '#00E5FF'
    ctx.font = '700 14px "Press Start 2P", monospace'
    ctx.fillText('AUTHORIZED BY: MIGUEL O\'HARA (SPIDER-MAN 2099)', 70, 850)
    ctx.fillText('NUEVA YORK SECTOR-01 // COBWEB INCIDENT DATABASE', 70, 885)

    const url = canvas.toDataURL('image/png')
    setDossierUrl(url)
  }

  const handleDownload = () => {
    if (!dossierUrl) return
    const a = document.createElement('a')
    a.href = dossierUrl
    a.download = `spider-incident-dossier-${agentCode.toLowerCase()}.png`
    a.click()
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--dossier" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>⚡ Canon Event Scanner &amp; Incident Dossier</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          {scanning ? (
            <div className="scanner-animation-box">
              <div className="scanner-radar">
                <div className="radar-sweep" />
                <span className="radar-center-spider">🕷️</span>
              </div>
              <p className="scanner-status-text">
                MENYELIDIKI KESELARASAN CANON EVENT... ({scanProgress}%)
              </p>
              <div className="scanner-progress-bar">
                <div className="scanner-progress-fill" style={{ width: `${scanProgress}%` }} />
              </div>
            </div>
          ) : !dossierUrl ? (
            <div className="dossier-results-box">
              <div className="anomaly-alert-card" style={{ borderColor: selectedAnomaly.color }}>
                <span className="alert-badge" style={{ background: selectedAnomaly.color }}>
                  ANALISIS SELESAI
                </span>
                <h4>{selectedAnomaly.type}</h4>
                <p>{selectedAnomaly.note}</p>
              </div>

              <div className="mission-brief-card">
                <span className="mission-label">🎯 MISI MULTIVERSE ANDA:</span>
                <p className="mission-text">{mission}</p>
                <small className="agent-code-tag">KODE AGEN: {agentCode}</small>
              </div>
            </div>
          ) : (
            <div className="dossier-preview-box">
              <img src={dossierUrl} alt="Classified Dossier Result" className="dossier-img" />
            </div>
          )}
        </div>

        <div className="modal__actions">
          {scanning ? (
            <button className="btn btn--ghost" onClick={onClose}>Batal</button>
          ) : !dossierUrl ? (
            <>
              <button className="btn btn--ghost" onClick={onClose}>Tutup</button>
              <button className="btn btn--primary" onClick={handleGenerateDossier}>
                📄 Cetak Berkas Rahasia (Dossier PNG)
              </button>
            </>
          ) : (
            <>
              <button className="btn btn--ghost" onClick={() => setDossierUrl(null)}>← Kembali</button>
              <button className="btn btn--primary" onClick={handleDownload}>
                📥 Unduh Berkas Dossier (PNG)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
