export const FILTERS = [
  { id: 'original', label: 'Asli', css: 'none' },
  { id: 'halftone', label: 'Halftone Komik', css: 'contrast(1.3) saturate(1.4)' },
  { id: 'noir', label: 'Noir', css: 'grayscale(1) contrast(1.2)' },
  { id: 'neon', label: 'Neon Glitch', css: 'saturate(2) hue-rotate(-10deg) contrast(1.15)' },
  { id: 'retro', label: 'Grain Retro', css: 'sepia(0.35) contrast(1.05) brightness(1.02)' },
]

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Capture a single frame from a <video> element into a dataURL, baking in the CSS filter.
export function captureFrame(videoEl, filterCss) {
  const canvas = document.createElement('canvas')
  const w = videoEl.videoWidth || 640
  const h = videoEl.videoHeight || 480
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.filter = filterCss || 'none'
  // Mirror horizontally so it feels like a "selfie" mirror, matching the live preview.
  ctx.translate(w, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(videoEl, 0, 0, w, h)
  return canvas.toDataURL('image/png')
}

// Build the final downloadable strip: header, 4 photos (each with placed stickers), colored frame, footer.
export async function renderStrip({ photos, placements, frameColor, title = 'COBWEB BOOTH' }) {
  const cellW = 640
  const cellH = 480
  const pad = 28
  const headerH = 90
  const footerH = 60
  const gap = 18

  const canvas = document.createElement('canvas')
  canvas.width = cellW + pad * 2
  canvas.height = headerH + photos.length * cellH + (photos.length - 1) * gap + footerH + pad * 2
  const ctx = canvas.getContext('2d')

  // frame background
  ctx.fillStyle = frameColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // header
  ctx.fillStyle = '#F5F3EE'
  ctx.font = "700 40px Bangers, cursive"
  ctx.textAlign = 'center'
  ctx.fillText(title, canvas.width / 2, pad + 55)

  let y = headerH + pad
  for (let i = 0; i < photos.length; i++) {
    const img = await loadImage(photos[i])
    ctx.drawImage(img, pad, y, cellW, cellH)

    const stickersForCell = placements[i] || []
    for (const p of stickersForCell) {
      const stImg = await loadImage(p.src)
      const size = p.size
      ctx.save()
      const cx = pad + p.x * cellW
      const cy = y + p.y * cellH
      ctx.translate(cx, cy)
      ctx.rotate((p.rotation || 0) * Math.PI / 180)
      ctx.drawImage(stImg, -size / 2, -size / 2, size, size)
      ctx.restore()
    }

    y += cellH + gap
  }

  // footer
  ctx.fillStyle = '#F5F3EE'
  ctx.font = "500 18px Manrope, sans-serif"
  ctx.fillText(new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }), canvas.width / 2, canvas.height - pad - 15)

  return canvas.toDataURL('image/png')
}
