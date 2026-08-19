import { useState } from 'react'
import { generateQrCodeSvg } from '../utils/qrCode'

export default function ShareModal({ stripDataUrl, themeName, onClose }) {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const sessionCode = `SPIDEY-${Math.floor(1000 + Math.random() * 9000)}`
  const dateStr = new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const qrSvg = generateQrCodeSvg(window.location.href, 140)
  const qrDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Spider-Verse Photostrip — COBWEB BOOTH',
          text: 'Lihat jepretan strip foto Spider-Verse saya!',
          url: window.location.href,
        })
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } catch (err) {
        // user cancelled or share failed
      }
    } else {
      handleCopyLink()
    }
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak Photostrip — COBWEB BOOTH</title>
          <style>
            @page { size: auto; margin: 10mm; }
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
            img { max-height: 95vh; max-width: 95vw; object-fit: contain; box-shadow: 0 0 10px rgba(0,0,0,0.2); }
          </style>
        </head>
        <body>
          <img src="${stripDataUrl}" onload="window.print();window.close();" />
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--receipt" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div className="receipt-title-box">
            <span className="receipt-badge">🎟️ DIGITAL RECEIPT</span>
            <h3>STRIP FOTO BERHASIL DIUNDUH!</h3>
          </div>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="receipt-body">
          <div className="receipt-card">
            <div className="receipt-card__top">
              <div className="receipt-card__brand">🕷️ COBWEB BOOTH // SPIDER-SOCIETY</div>
              <div className="receipt-card__code">SESI: {sessionCode}</div>
              <div className="receipt-card__date">{dateStr}</div>
            </div>

            <div className="receipt-card__preview">
              <img src={stripDataUrl} alt="Photostrip preview" />
            </div>

            <div className="receipt-card__bottom">
              <div className="receipt-card__qr">
                <img src={qrDataUri} alt="QR Code Share" />
                <span>SCAN UNTUK BUKA</span>
              </div>
              <div className="receipt-card__info">
                <p><strong>TEMA:</strong> {themeName}</p>
                <p><strong>LOKASI:</strong> SEKTOR JAKARTA METRO HQ</p>
                <p><strong>STATUS:</strong> RESMI TERSIMPAN</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal__actions">
          <button className="btn btn--secondary" onClick={handlePrint}>
            🖨️ Cetak Photostrip
          </button>
          <button className="btn btn--primary" onClick={handleNativeShare}>
            {shared ? '✅ DIBAGIKAN!' : copied ? '✅ LINK DISALIN!' : '📲 Bagikan / Salin Link'}
          </button>
          <button className="btn btn--ghost" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  )
}
