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

// Capture a single frame from a <video> element into a dataURL, baking in the CSS filter
// and a small live timestamp stamp in the corner.
export function captureFrame(videoEl, filterCss, { stampTime = true } = {}) {
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
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.filter = 'none'

  if (stampTime) {
    const label = new Date().toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
    })
    const fontSize = Math.round(w * 0.028)
    ctx.font = `600 ${fontSize}px Manrope, sans-serif`
    const padX = 14
    const textW = ctx.measureText(label).width
    ctx.fillStyle = 'rgba(11,19,48,0.55)'
    ctx.fillRect(0, h - fontSize - 20, textW + padX * 2, fontSize + 20)
    ctx.fillStyle = '#F5F3EE'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, padX, h - fontSize / 2 - 10)
  }

  return canvas.toDataURL('image/png')
}

// Build the final downloadable strip: header, N photos (each with placed stickers + optional
// caption), colored frame, footer. Supports 'strip' (vertical stack) or 'grid' (2 columns) layout.
export async function renderStrip({ photos, placements, frameColor, title = 'COBWEB BOOTH', layout = 'strip', captions = [] }) {
  const cellW = 640
  const cellH = 480
  const pad = 28
  const headerH = 90
  const footerH = 60
  const gap = 18
  const captionH = 42

  const cols = layout === 'grid' ? 2 : 1
  const rows = Math.ceil(photos.length / cols)

  const canvas = document.createElement('canvas')
  canvas.width = cols * cellW + (cols - 1) * gap + pad * 2
  canvas.height = headerH + rows * (cellH + captionH) + (rows - 1) * gap + footerH + pad * 2
  const ctx = canvas.getContext('2d')

  // frame background
  ctx.fillStyle = frameColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // header
  ctx.fillStyle = '#F5F3EE'
  ctx.font = "700 40px Bangers, cursive"
  ctx.textAlign = 'center'
  ctx.fillText(title, canvas.width / 2, pad + 55)

  for (let i = 0; i < photos.length; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = pad + col * (cellW + gap)
    const y = headerH + pad + row * (cellH + captionH + gap)

    const img = await loadImage(photos[i])
    ctx.drawImage(img, x, y, cellW, cellH)

    const stickersForCell = placements[i] || []
    for (const p of stickersForCell) {
      const stImg = await loadImage(p.src)
      const size = p.size
      ctx.save()
      const cx = x + p.x * cellW
      const cy = y + p.y * cellH
      ctx.translate(cx, cy)
      ctx.rotate((p.rotation || 0) * Math.PI / 180)
      ctx.drawImage(stImg, -size / 2, -size / 2, size, size)
      ctx.restore()
    }

    const caption = captions[i]
    if (caption) {
      ctx.fillStyle = '#F5F3EE'
      ctx.font = "600 22px Manrope, sans-serif"
      ctx.textAlign = 'center'
      ctx.fillText(caption, x + cellW / 2, y + cellH + captionH / 2 + 8)
    }
  }

  // footer
  ctx.fillStyle = '#F5F3EE'
  ctx.font = "500 18px Manrope, sans-serif"
  ctx.textAlign = 'center'
  ctx.fillText(
    new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
    canvas.width / 2,
    canvas.height - pad - 15
  )

  return canvas.toDataURL('image/png')
}
