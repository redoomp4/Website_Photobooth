import { useState } from 'react'
import { renderHeroCard } from '../utils/compositor'
import { playPowerUp } from '../utils/sound'

const UNIVERSES = [
  'EARTH-616 // PRIME SPIDER',
  'EARTH-1610 // ULTIMATE GLITCH',
  'EARTH-65 // GHOST SPIDER REALM',
  'EARTH-50101 // PAVITR SECTOR',
  'EARTH-928 // NUEVA YORK 2099',
  'EARTH-ID-62 // JAKARTA METRO WEB',
]

const RANKS = [
  'WEB WARRIOR (TIER 1)',
  'ANOMALY HUNTER',
  'MULTIVERSE RECON AGENT',
  'SPIDER-SOCIETY ELITE',
  'VANGUARD WEB-SLINGER',
]

const TRAITS = [
  'Bio-Electric Venom Blast',
  'Dimension Glitch Teleport',
  'Supersonic Spider-Sense',
  'Acrobatic Web Cocoon',
  'Camouflage Invisibility',
  'Heavy Web Hammer Kick',
]

export default function HeroIdCardModal({ isOpen, onClose, photos, muted }) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [heroName, setHeroName] = useState('NIGHT-SPINNER')
  const [universe, setUniverse] = useState(UNIVERSES[0])
  const [rank, setRank] = useState(RANKS[0])
  const [powerRating, setPowerRating] = useState('98.5%')
  const [trait, setTrait] = useState(TRAITS[0])
  const [busy, setBusy] = useState(false)
  const [cardDataUrl, setCardDataUrl] = useState(null)

  if (!isOpen) return null

  const handleRandomizeStats = () => {
    if (!muted) playPowerUp()
    const rPower = (92 + Math.random() * 7.9).toFixed(1) + '%'
    setPowerRating(rPower)
    setRank(RANKS[Math.floor(Math.random() * RANKS.length)])
    setTrait(TRAITS[Math.floor(Math.random() * TRAITS.length)])
  }

  const handleGenerate = async () => {
    setBusy(true)
    try {
      if (!muted) playPowerUp()
      const url = await renderHeroCard({
        photo: photos[photoIndex] || photos[0],
        heroName: heroName || 'ANONYMOUS SPIDER',
        universe,
        rank,
        powerLevel: powerRating,
        specialty: trait,
      })
      setCardDataUrl(url)
    } finally {
      setBusy(false)
    }
  }

  const handleDownload = () => {
    if (!cardDataUrl) return
    const a = document.createElement('a')
    a.href = cardDataUrl
    a.download = `spider-society-id-${heroName.toLowerCase().replace(/\s+/g, '-')}.png`
    a.click()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--idcard" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>🪪 Generator Kartu Anggota Spider-Society</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          {!cardDataUrl ? (
            <div className="idcard-form">
              <p className="modal__subtitle">
                Ciptakan Kartu Identitas Resmi Multiverse untuk pahlawan laba-labamu!
              </p>

              <div className="form-group">
                <label>Pilih Foto untuk Kartu ID:</label>
                <div className="photo-picker-mini">
                  {photos.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Pilihan ${i + 1}`}
                      className={`photo-thumb ${photoIndex === i ? 'is-active' : ''}`}
                      onClick={() => setPhotoIndex(i)}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Nama Alias / Codename Pahlawan:</label>
                <input
                  type="text"
                  className="input-text"
                  maxLength={24}
                  value={heroName}
                  onChange={(e) => setHeroName(e.target.value)}
                  placeholder="Contoh: ARACHNO-KNIGHT"
                />
              </div>

              <div className="form-group">
                <label>Asal Dimensi / Universe:</label>
                <select
                  className="input-select"
                  value={universe}
                  onChange={(e) => setUniverse(e.target.value)}
                >
                  {UNIVERSES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status & Jurus Andalan:</label>
                <div className="stats-box">
                  <div><strong>Pangkat:</strong> {rank}</div>
                  <div><strong>Kekuatan:</strong> {powerRating}</div>
                  <div><strong>Spesialisasi:</strong> {trait}</div>
                </div>
                <button type="button" className="btn btn--ghost btn--sm" onClick={handleRandomizeStats} style={{ marginTop: '8px' }}>
                  🎲 Acak Statistik & Pangkat
                </button>
              </div>
            </div>
          ) : (
            <div className="idcard-result">
              <img src={cardDataUrl} alt="Spider ID Card Result" className="idcard-preview-img" />
            </div>
          )}
        </div>

        <div className="modal__actions">
          {!cardDataUrl ? (
            <>
              <button className="btn btn--ghost" onClick={onClose}>Batal</button>
              <button className="btn btn--primary" onClick={handleGenerate} disabled={busy}>
                {busy ? 'Mencetak Kartu...' : '⚡ Generate Kartu ID'}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn--ghost" onClick={() => setCardDataUrl(null)}>← Edit Kembali</button>
              <button className="btn btn--primary" onClick={handleDownload}>
                📥 Unduh Kartu ID (PNG)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
