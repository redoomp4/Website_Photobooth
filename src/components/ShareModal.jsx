import { useState } from 'react'

export default function ShareModal({ stripDataUrl, themeName, onClose }) {
  const [copied, setCopied] = useState(false)
  const sessionCode = `SPIDEY-${Math.floor(1000 + Math.random() * 9000)}`
  const dateStr = new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // SVG QR Code generator string
  const qrSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#1A1025">
      <rect width="100" height="100" fill="#F5F3EE"/>
      <rect x="10" y="10" width="30" height="30" fill="#E63946"/>
      <rect x="15" y="15" width="20" height="20" fill="#F5F3EE"/>
      <rect x="20" y="20" width="10" height="10" fill="#1A1025"/>
      <rect x="60" y="10" width="30" height="30" fill="#E63946"/>
      <rect x="65" y="15" width="20" height="20" fill="#F5F3EE"/>
      <rect x="70" y="20" width="10" height="10" fill="#1A1025"/>
      <rect x="10" y="60" width="30" height="30" fill="#E63946"/>
      <rect x="15" y="65" width="20" height="20" fill="#F5F3EE"/>
      <rect x="20" y="70" width="10" height="10" fill="#1A1025"/>
      <rect x="45" y="15" width="10" height="10"/>
      <rect x="45" y="35" width="10" height="20"/>
      <rect x="15" y="45" width="20" height="10"/>
      <rect x="60" y="45" width="15" height="15"/>
      <rect x="80" y="45" width="10" height="10"/>
      <rect x="45" y="70" width="15" height="15"/>
      <rect x="70" y="70" width="20" height="20"/>
    </svg>
  `
  const qrDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="shareOverlay" onClick={onClose}>
      <div className="shareModal" onClick={(e) => e.stopPropagation()}>
        <header className="shareModal__header">
          <span className="shareModal__badge">🎟️ COBWEB DIGITAL RECEIPT</span>
          <h3 className="shareModal__title">STRIP FOTO TERDISIPLIN!</h3>
          <button className="shareModal__closeBtn" onClick={onClose}>✕</button>
        </header>

        <div className="receiptCard">
          <div className="receiptCard__top">
            <div className="receiptCard__brand">🕷️ COBWEB PHOTOBOOTH HQ</div>
            <div className="receiptCard__code">{sessionCode}</div>
            <div className="receiptCard__date">{dateStr}</div>
          </div>

          <div className="receiptCard__preview">
            <img src={stripDataUrl} alt="Photostrip preview" />
          </div>

          <div className="receiptCard__bottom">
            <div className="receiptCard__qr">
              <img src={qrDataUri} alt="QR Code Share" />
              <span>SCAN METADATA</span>
            </div>
            <div className="receiptCard__info">
              <p><strong>TEMA:</strong> {themeName}</p>
              <p><strong>LOKASI:</strong> SPIDER-VERSE JAKARTA HQ</p>
              <p><strong>STATUS:</strong> DIUNDUH & TERSIMPAN</p>
            </div>
          </div>
        </div>

        <div className="shareModal__actions">
          <button className="btn btn--primary" onClick={handleCopyLink}>
            {copied ? '✅ LINK TERSALIN!' : '🔗 SALIN LINK SESI'}
          </button>
          <button className="btn btn--ghost" onClick={onClose}>TUTUP</button>
        </div>
      </div>
    </div>
  )
}
