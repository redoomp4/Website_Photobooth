import { useState, useRef } from 'react'
import { loadImage } from '../utils/compositor'
import { playBoom } from '../utils/sound'

const HEADLINES = [
  'IN THIS SENSATIONAL ISSUE: THE MULTIVERSE AWAKENS!',
  'WHO IS THE MYSTERIOUS MASKED ARACHNID?!',
  'NO ONE ESCAPES THE TANGLED WEB OF DESTINY!',
  'BATTLE ACROSS THE DIMENSIONAL NEXUS!',
  'ENTER: THE NEW SPIDER-WARRIOR OF JAKARTA!',
]

export default function ComicCoverModal({ isOpen, onClose, photos, muted }) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [comicTitle, setComicTitle] = useState('THE AMAZING SPIDER-HERO')
  const [issueNumber, setIssueNumber] = useState('ISSUE #01 // 25¢')
  const [monthYear, setMonthYear] = useState('AUG · INDONESIA EDITION')
  const [headline, setHeadline] = useState(HEADLINES[0])
  const [subHeadline, setSubHeadline] = useState('AN ALL-NEW DIMENSIONAL SAGA BEGINS!')
  const [cornerBox, setCornerBox] = useState('🕷️')
  const [coverDataUrl, setCoverDataUrl] = useState(null)
  const [busy, setBusy] = useState(false)

  if (!isOpen) return null

  const handleGenerateCover = async () => {
    setBusy(true)
    if (!muted) playBoom()

    try {
      const canvas = document.createElement('canvas')
      const w = 800
      const h = 1200
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')

      // 1. Background Vintage Comic Paper
      ctx.fillStyle = '#FFE600'
      ctx.fillRect(0, 0, w, h)

      // Halftone dot pattern on background
      ctx.fillStyle = 'rgba(230, 57, 70, 0.12)'
      for (let x = 0; x < w; x += 12) {
        for (let y = 0; y < h; y += 12) {
          ctx.beginPath()
          ctx.arc(x, y, 2.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Outer heavy black border
      ctx.strokeStyle = '#0A0C14'
      ctx.lineWidth = 16
      ctx.strokeRect(8, 8, w - 16, h - 16)

      // 2. Photo Area (Dramatic Centerpiece)
      const photoX = 30
      const photoY = 190
      const photoW = w - 60
      const photoH = 750

      ctx.fillStyle = '#000'
      ctx.fillRect(photoX, photoY, photoW, photoH)

      if (photos[photoIndex]) {
        const img = await loadImage(photos[photoIndex])
        ctx.drawImage(img, photoX, photoY, photoW, photoH)
      }

      ctx.strokeStyle = '#0A0C14'
      ctx.lineWidth = 8
      ctx.strokeRect(photoX, photoY, photoW, photoH)

      // 3. Top Banner Box (Marvel-style bar)
      ctx.fillStyle = '#E63946'
      ctx.fillRect(30, 30, w - 60, 140)
      ctx.strokeStyle = '#0A0C14'
      ctx.lineWidth = 6
      ctx.strokeRect(30, 30, w - 60, 140)

      // Top corner badge: Price / Issue
      ctx.fillStyle = '#0A0C14'
      ctx.fillRect(36, 36, 120, 128)
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '900 13px Manrope, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(monthYear, 96, 60)
      ctx.fillStyle = '#FFE600'
      ctx.font = '900 20px Bangers, cursive'
      ctx.fillText(issueNumber, 96, 95)
      ctx.font = '36px sans-serif'
      ctx.fillText(cornerBox, 96, 145)

      // Comics Code Authority Stamp (Top Right)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(w - 150, 36, 114, 128)
      ctx.strokeStyle = '#0A0C14'
      ctx.lineWidth = 3
      ctx.strokeRect(w - 150, 36, 114, 128)

      ctx.fillStyle = '#0A0C14'
      ctx.font = '800 10px Manrope, sans-serif'
      ctx.fillText('APPROVED', w - 93, 56)
      ctx.fillText('BY THE', w - 93, 72)
      ctx.font = '900 11px Bangers, cursive'
      ctx.fillText('COMICS CODE', w - 93, 94)
      ctx.font = '800 10px Manrope, sans-serif'
      ctx.fillText('AUTHORITY', w - 93, 114)
      ctx.font = '18px sans-serif'
      ctx.fillText('★ ◈ ★', w - 93, 142)

      // Main Comic Title
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '900 56px Bangers, Impact, cursive'
      ctx.textAlign = 'center'
      ctx.strokeStyle = '#0A0C14'
      ctx.lineWidth = 10
      ctx.strokeText(comicTitle, w / 2 + 10, 125)
      ctx.fillText(comicTitle, w / 2 + 10, 125)

      // 4. Dramatic Comic Action Burst & Headlines (Bottom Section)
      // Burst banner
      ctx.fillStyle = '#E63946'
      ctx.beginPath()
      ctx.moveTo(20, 960)
      ctx.lineTo(w - 20, 930)
      ctx.lineTo(w - 10, 1070)
      ctx.lineTo(10, 1090)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#0A0C14'
      ctx.lineWidth = 6
      ctx.stroke()

      ctx.fillStyle = '#FFE600'
      ctx.font = '900 38px Bangers, Impact, cursive'
      ctx.textAlign = 'center'
      ctx.strokeStyle = '#0A0C14'
      ctx.lineWidth = 6
      ctx.strokeText(headline, w / 2, 1010)
      ctx.fillText(headline, w / 2, 1010)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = '800 24px Bangers, cursive'
      ctx.strokeText(subHeadline, w / 2, 1055)
      ctx.fillText(subHeadline, w / 2, 1055)

      // Footer Publisher Line
      ctx.fillStyle = '#0A0C14'
      ctx.font = '800 14px Manrope, sans-serif'
      ctx.fillText('COBWEB COMICS GROUP · PRINTED IN THE MULTIVERSE · ALL RIGHTS RESERVED', w / 2, h - 30)

      const url = canvas.toDataURL('image/png')
      setCoverDataUrl(url)
    } finally {
      setBusy(false)
    }
  }

  const handleDownload = () => {
    if (!coverDataUrl) return
    const a = document.createElement('a')
    a.href = coverDataUrl
    a.download = `comic-cover-${comicTitle.toLowerCase().replace(/\s+/g, '-')}.png`
    a.click()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--comic-cover" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>📖 Comic Book Cover Poster Maker</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          {!coverDataUrl ? (
            <div className="comic-cover-form">
              <p className="modal__subtitle">
                Ubah jepretan fotomu menjadi poster Sampul Majalah Komik Marvel Vintage yang dramatis!
              </p>

              <div className="form-group">
                <label>Pilih Foto Utama untuk Cover:</label>
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
                <label>Judul Komik Utama:</label>
                <input
                  type="text"
                  className="input-text"
                  maxLength={30}
                  value={comicTitle}
                  onChange={(e) => setComicTitle(e.target.value)}
                  placeholder="Contoh: THE AMAZING SPIDER-HERO"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Nomor Edisi &amp; Harga:</label>
                  <input
                    type="text"
                    className="input-text"
                    value={issueNumber}
                    onChange={(e) => setIssueNumber(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Bulan / Edisi Wilayah:</label>
                  <input
                    type="text"
                    className="input-text"
                    value={monthYear}
                    onChange={(e) => setMonthYear(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Headline Aksi Komik:</label>
                <input
                  type="text"
                  className="input-text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
                <div className="headline-quick-pick">
                  {HEADLINES.map((h, i) => (
                    <button
                      key={i}
                      type="button"
                      className="btn-quick-tag"
                      onClick={() => setHeadline(h)}
                    >
                      {h.slice(0, 24)}...
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Sub-Headline / Slogan:</label>
                <input
                  type="text"
                  className="input-text"
                  value={subHeadline}
                  onChange={(e) => setSubHeadline(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="comic-cover-result">
              <img src={coverDataUrl} alt="Comic Cover Result" className="comic-cover-preview-img" />
            </div>
          )}
        </div>

        <div className="modal__actions">
          {!coverDataUrl ? (
            <>
              <button className="btn btn--ghost" onClick={onClose}>Batal</button>
              <button className="btn btn--primary" onClick={handleGenerateCover} disabled={busy}>
                {busy ? 'Mencetak Sampul...' : '💥 Cetak Poster Komik'}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn--ghost" onClick={() => setCoverDataUrl(null)}>← Edit Kembali</button>
              <button className="btn btn--primary" onClick={handleDownload}>
                📥 Unduh Poster Komik (PNG)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
