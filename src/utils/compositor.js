export const FILTERS = [
  { id: 'original', label: 'Asli', css: 'none' },
  { id: 'halftone', label: 'Halftone Komik', css: 'contrast(1.35) saturate(1.4) brightness(1.05)' },
  { id: 'noir', label: 'Noir Sepia', css: 'grayscale(1) contrast(1.3) sepia(0.25)' },
  { id: 'neon', label: 'Neon Glitch', css: 'saturate(2.2) hue-rotate(-15deg) contrast(1.2)' },
  { id: 'retro', label: 'Grain Retro', css: 'sepia(0.4) contrast(1.1) brightness(1.05)' },
  { id: 'cyber', label: 'Cyber Spidey', css: 'saturate(1.8) hue-rotate(180deg) contrast(1.15)' },
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

// Capture a single frame from a <video> element into a dataURL
export function captureFrame(videoEl, filterCss, { stampTime = true } = {}) {
  const canvas = document.createElement('canvas')
  const w = videoEl.videoWidth || 640
  const h = videoEl.videoHeight || 480
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.filter = filterCss || 'none'
  // Mirror horizontally so it feels like a selfie mirror
  ctx.translate(w, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(videoEl, 0, 0, w, h)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.filter = 'none'

  if (stampTime) {
    const label = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const fontSize = Math.round(w * 0.028)
    ctx.font = `600 ${fontSize}px Manrope, sans-serif`
    const padX = 14
    const textW = ctx.measureText(label).width
    ctx.fillStyle = 'rgba(11, 19, 48, 0.7)'
    ctx.fillRect(0, h - fontSize - 20, textW + padX * 2, fontSize + 20)
    ctx.fillStyle = '#F5F3EE'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, padX, h - fontSize / 2 - 10)
  }

  return canvas.toDataURL('image/png')
}

export const SPIDER_THEMES = [
  {
    id: 'spidey',
    name: 'Classic Spidey',
    badge: '🕷️',
    bg: '#8C1220',
    borderColor: '#E63946',
    accentColor: '#FFC857',
    textColor: '#F5F3EE',
    useTemplate: true,
  },
  {
    id: 'miles',
    name: 'Miles Glitch 2099',
    badge: '⚡',
    bg: '#0A0E1A',
    borderColor: '#FF0055',
    accentColor: '#00E5FF',
    textColor: '#F5F3EE',
    useTemplate: false,
  },
  {
    id: 'gwen',
    name: 'Spider-Gwen Neon',
    badge: '🕸️',
    bg: '#1A0B2E',
    borderColor: '#FF007F',
    accentColor: '#00F5D4',
    textColor: '#F5F3EE',
    useTemplate: false,
  },
  {
    id: 'noir',
    name: 'Spider-Noir 1930s',
    badge: '🕵️',
    bg: '#18181B',
    borderColor: '#71717A',
    accentColor: '#F4F4F5',
    textColor: '#F4F4F5',
    useTemplate: false,
  },
  {
    id: 'symbiote',
    name: 'Symbiote Venom',
    badge: '👁️',
    bg: '#050508',
    borderColor: '#3B0764',
    accentColor: '#A855F7',
    textColor: '#F5F3EE',
    useTemplate: false,
  },
  {
    id: 'vintage',
    name: '1960s Comic Strip',
    badge: '💥',
    bg: '#FDF6E2',
    borderColor: '#B91C1C',
    accentColor: '#D97706',
    textColor: '#1E1B4B',
    useTemplate: false,
  },
]

function drawPhotoWithAdjustments(ctx, img, slotX, slotY, slotW, slotH, adj = {}) {
  const { zoom = 1, x: offsetX = 0, y: offsetY = 0, mirrored = false, rotation = 0 } = adj
  ctx.save()

  // Clip to slot rectangle
  ctx.beginPath()
  ctx.rect(slotX, slotY, slotW, slotH)
  ctx.clip()

  // Move origin to center of slot
  ctx.translate(slotX + slotW / 2, slotY + slotH / 2)

  // Apply rotation
  if (rotation) {
    ctx.rotate((rotation * Math.PI) / 180)
  }

  // Apply mirroring and zoom
  const scaleX = mirrored ? -zoom : zoom
  const scaleY = zoom
  ctx.scale(scaleX, scaleY)

  // Draw scaled and panned image centered
  const drawX = -slotW / 2 + offsetX * slotW
  const drawY = -slotH / 2 + offsetY * slotH

  ctx.drawImage(img, drawX, drawY, slotW, slotH)
  ctx.restore()
}

// Draw comic halftone dots onto background
function drawHalftoneDots(ctx, w, h, color = 'rgba(0,0,0,0.06)') {
  ctx.fillStyle = color
  const spacing = 14
  const radius = 2.2
  for (let x = 0; x < w; x += spacing) {
    for (let y = 0; y < h; y += spacing) {
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

// Render 35mm Film Roll Layout
async function renderFilmReel({ photos, placements, captions, adjustments, doodleCanvas }) {
  const cellW = 580
  const cellH = 420
  const pad = 40
  const sprocketW = 20
  const sprocketH = 30
  const gap = 34

  const canvas = document.createElement('canvas')
  canvas.width = cellW + pad * 2 + 60
  canvas.height = pad * 2 + photos.length * (cellH + gap) + 40
  const ctx = canvas.getContext('2d')

  // Black Film Base
  ctx.fillStyle = '#090A0F'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Sprocket Holes along left and right
  ctx.fillStyle = '#1A1D2B'
  for (let y = 20; y < canvas.height - 20; y += 45) {
    // Left sprockets
    ctx.fillRect(15, y, sprocketW, sprocketH)
    // Right sprockets
    ctx.fillRect(canvas.width - 35, y, sprocketW, sprocketH)
  }

  // Draw Film Edge Codes
  ctx.fillStyle = '#FFE600'
  ctx.font = '700 13px "Press Start 2P", monospace'
  ctx.save()
  ctx.translate(45, canvas.height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('KODAK SPIDEY 400 · MULTIVERSE NEGATIVE', 0, 0)
  ctx.restore()

  for (let i = 0; i < photos.length; i++) {
    const x = pad + 30
    const y = pad + i * (cellH + gap)

    const img = await loadImage(photos[i])
    drawPhotoWithAdjustments(ctx, img, x, y, cellW, cellH, adjustments[i])

    // Thin frame border
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 3
    ctx.strokeRect(x, y, cellW, cellH)

    // Exposure frame number
    ctx.fillStyle = '#FFE600'
    ctx.font = '800 14px Manrope, sans-serif'
    ctx.fillText(`FRAME #${i + 1}A`, x + 10, y + cellH + 20)

    // Draw stickers
    const stickersForCell = placements[i] || []
    for (const p of stickersForCell) {
      const stImg = await loadImage(p.src)
      const size = p.size
      ctx.save()
      const cx = x + p.x * cellW
      const cy = y + p.y * cellH
      ctx.translate(cx, cy)
      ctx.rotate(((p.rotation || 0) * Math.PI) / 180)
      ctx.drawImage(stImg, -size / 2, -size / 2, size, size)
      ctx.restore()
    }
  }

  if (doodleCanvas) {
    ctx.drawImage(doodleCanvas, 0, 0, canvas.width, canvas.height)
  }

  return canvas.toDataURL('image/png')
}

// Render Polaroid Trio Layout
async function renderPolaroidTrio({ photos, placements, captions, adjustments, doodleCanvas }) {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 1180
  const ctx = canvas.getContext('2d')

  // Background Wood / Desk Surface
  ctx.fillStyle = '#1A1025'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  drawHalftoneDots(ctx, canvas.width, canvas.height, 'rgba(230, 57, 70, 0.08)')

  const angles = [-3, 2.5, -1.8]
  const cardW = 540
  const cardH = 340
  const photoW = 500
  const photoH = 260

  for (let i = 0; i < Math.min(photos.length, 3); i++) {
    const cardY = 60 + i * 360
    const cardX = canvas.width / 2

    ctx.save()
    ctx.translate(cardX, cardY + cardH / 2)
    ctx.rotate((angles[i] * Math.PI) / 180)

    // Polaroid Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.fillRect(-cardW / 2 + 8, -cardH / 2 + 8, cardW, cardH)

    // Polaroid Card White Body
    ctx.fillStyle = '#FDFBF7'
    ctx.fillRect(-cardW / 2, -cardH / 2, cardW, cardH)

    // Scotch Tape at top corner
    ctx.fillStyle = 'rgba(255, 230, 0, 0.6)'
    ctx.fillRect(-cardW / 2 + 20, -cardH / 2 - 12, 70, 24)

    // Photo inside Polaroid
    const img = await loadImage(photos[i])
    const px = -photoW / 2
    const py = -cardH / 2 + 18
    drawPhotoWithAdjustments(ctx, img, px, py, photoW, photoH, adjustments[i])

    // Handwritten Caption / Date
    const captionText = captions[i] || `Jepretan Spider-Verse #${i + 1}`
    ctx.fillStyle = '#1E1B4B'
    ctx.font = '700 24px Bangers, cursive'
    ctx.textAlign = 'center'
    ctx.fillText(captionText, 0, cardH / 2 - 20)

    // Stickers
    const stickersForCell = placements[i] || []
    for (const p of stickersForCell) {
      const stImg = await loadImage(p.src)
      const size = p.size
      ctx.save()
      const cx = px + p.x * photoW
      const cy = py + p.y * photoH
      ctx.translate(cx, cy)
      ctx.rotate(((p.rotation || 0) * Math.PI) / 180)
      ctx.drawImage(stImg, -size / 2, -size / 2, size, size)
      ctx.restore()
    }

    ctx.restore()
  }

  if (doodleCanvas) {
    ctx.drawImage(doodleCanvas, 0, 0, canvas.width, canvas.height)
  }

  return canvas.toDataURL('image/png')
}

// Build the final downloadable strip
export async function renderStrip({
  photos,
  placements,
  frameColor,
  themeId = 'spidey',
  title = 'COBWEB BOOTH',
  layout = 'strip',
  captions = [],
  doodleCanvas = null,
  adjustments = [],
}) {
  if (layout === 'polaroid') {
    return renderPolaroidTrio({ photos, placements, captions, adjustments, doodleCanvas })
  }

  if (layout === 'filmreel') {
    return renderFilmReel({ photos, placements, captions, adjustments, doodleCanvas })
  }

  const selectedTheme = SPIDER_THEMES.find((t) => t.id === themeId) || SPIDER_THEMES[0]

  // If using classic Spidey PNG frame template and layout is strip with 3 photos
  if (selectedTheme.useTemplate && layout === 'strip' && photos.length === 3) {
    const frameImg = await loadImage('/Spidey Strip Photobooth 1.png')
    const canvas = document.createElement('canvas')
    canvas.width = frameImg.width
    canvas.height = frameImg.height
    const ctx = canvas.getContext('2d')

    // Draw photos in exact slot coordinates behind template
    const slots = [
      { x: 65, y: 95, w: 462, h: 373 },
      { x: 65, y: 546, w: 462, h: 374 },
      { x: 65, y: 1000, w: 462, h: 371 },
    ]

    for (let i = 0; i < Math.min(photos.length, 3); i++) {
      const slot = slots[i]
      const img = await loadImage(photos[i])

      // Draw photo with adjustments
      drawPhotoWithAdjustments(ctx, img, slot.x, slot.y, slot.w, slot.h, adjustments[i])

      // Draw stickers placed on this cell
      const stickersForCell = placements[i] || []
      for (const p of stickersForCell) {
        const stImg = await loadImage(p.src)
        const size = (p.size / 200) * slot.w * 0.55
        ctx.save()
        const cx = slot.x + p.x * slot.w
        const cy = slot.y + p.y * slot.h
        ctx.translate(cx, cy)
        ctx.rotate(((p.rotation || 0) * Math.PI) / 180)
        ctx.drawImage(stImg, -size / 2, -size / 2, size, size)
        ctx.restore()
      }

      // Draw caption if present
      const caption = captions[i]
      if (caption) {
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '700 22px Bangers, cursive'
        ctx.textAlign = 'center'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 4
        ctx.strokeText(caption, slot.x + slot.w / 2, slot.y + slot.h - 15)
        ctx.fillText(caption, slot.x + slot.w / 2, slot.y + slot.h - 15)
      }
    }

    // Draw Spiderman Frame Template on top
    ctx.drawImage(frameImg, 0, 0)

    // Draw Doodle Layer on top if present
    if (doodleCanvas) {
      ctx.drawImage(doodleCanvas, 0, 0, canvas.width, canvas.height)
    }

    return canvas.toDataURL('image/png')
  }

  // Standard multi-theme canvas renderer
  const cellW = 640
  const cellH = 480
  const pad = 32
  const headerH = 100
  const footerH = 68
  const gap = 20
  const captionH = 44

  const cols = layout === 'grid' ? 2 : 1
  const rows = Math.ceil(photos.length / cols)

  const canvas = document.createElement('canvas')
  canvas.width = cols * cellW + (cols - 1) * gap + pad * 2
  canvas.height = headerH + rows * (cellH + captionH) + (rows - 1) * gap + footerH + pad * 2
  const ctx = canvas.getContext('2d')

  // Frame background
  ctx.fillStyle = selectedTheme ? selectedTheme.bg : frameColor || '#1A1025'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Halftone pattern for retro comic effect
  if (selectedTheme.id === 'vintage') {
    drawHalftoneDots(ctx, canvas.width, canvas.height, 'rgba(185, 28, 28, 0.08)')
  } else if (selectedTheme.id === 'miles') {
    drawHalftoneDots(ctx, canvas.width, canvas.height, 'rgba(0, 229, 255, 0.05)')
  }

  // Theme accent border
  ctx.strokeStyle = selectedTheme?.borderColor || '#E63946'
  ctx.lineWidth = 10
  ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10)

  // Inner border line
  ctx.strokeStyle = selectedTheme?.accentColor || '#FFC857'
  ctx.lineWidth = 2
  ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28)

  // Header Title with Comic style
  ctx.fillStyle = selectedTheme?.textColor || '#F5F3EE'
  ctx.font = '700 46px Bangers, cursive'
  ctx.textAlign = 'center'
  ctx.fillText(
    `${selectedTheme?.badge || '🕷️'} ${title} ${selectedTheme?.badge || '🕷️'}`,
    canvas.width / 2,
    pad + 58
  )

  for (let i = 0; i < photos.length; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = pad + col * (cellW + gap)
    const y = headerH + pad + row * (cellH + captionH + gap)

    const img = await loadImage(photos[i])

    // Draw photo with adjustments
    drawPhotoWithAdjustments(ctx, img, x, y, cellW, cellH, adjustments[i])

    // Cell border
    ctx.strokeStyle = selectedTheme?.accentColor || '#FFC857'
    ctx.lineWidth = 4
    ctx.strokeRect(x, y, cellW, cellH)

    const stickersForCell = placements[i] || []
    for (const p of stickersForCell) {
      const stImg = await loadImage(p.src)
      const size = p.size
      ctx.save()
      const cx = x + p.x * cellW
      const cy = y + p.y * cellH
      ctx.translate(cx, cy)
      ctx.rotate(((p.rotation || 0) * Math.PI) / 180)
      ctx.drawImage(stImg, -size / 2, -size / 2, size, size)
      ctx.restore()
    }

    const caption = captions[i]
    if (caption) {
      ctx.fillStyle = selectedTheme?.textColor || '#F5F3EE'
      ctx.font = '600 24px Bangers, cursive'
      ctx.textAlign = 'center'
      ctx.fillText(caption, x + cellW / 2, y + cellH + captionH / 2 + 10)
    }
  }

  // Footer date & universe stamp
  ctx.fillStyle = selectedTheme?.textColor || '#F5F3EE'
  ctx.font = '700 16px Manrope, sans-serif'
  ctx.textAlign = 'center'
  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  ctx.fillText(`MULTIVERSE PHOTOSTRIP // ${dateStr} // SPIDER-SOCIETY HQ`, canvas.width / 2, canvas.height - pad - 14)

  // Draw Doodle Layer on top if present
  if (doodleCanvas) {
    ctx.drawImage(doodleCanvas, 0, 0, canvas.width, canvas.height)
  }

  return canvas.toDataURL('image/png')
}

// Generate Spider-Hero Multiverse License / ID Card
export async function renderHeroCard({
  photo,
  heroName = 'THE ARACHNID',
  universe = 'EARTH-616',
  rank = 'WEB WARRIOR',
  powerLevel = '98.5%',
  specialty = 'DIMENSIONAL GLITCH',
}) {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 500
  const ctx = canvas.getContext('2d')

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 800, 500)
  grad.addColorStop(0, '#0F172A')
  grad.addColorStop(0.5, '#1E1B4B')
  grad.addColorStop(1, '#31103F')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 800, 500)

  // Cyber / Halftone grid
  drawHalftoneDots(ctx, 800, 500, 'rgba(0, 229, 255, 0.06)')

  // Holographic border
  ctx.strokeStyle = '#00E5FF'
  ctx.lineWidth = 6
  ctx.strokeRect(10, 10, 780, 480)

  ctx.strokeStyle = '#FF0055'
  ctx.lineWidth = 2
  ctx.strokeRect(18, 18, 764, 464)

  // Header Banner
  ctx.fillStyle = '#E63946'
  ctx.fillRect(20, 20, 760, 60)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '900 32px Bangers, cursive'
  ctx.textAlign = 'left'
  ctx.fillText('🕷️ SPIDER-SOCIETY MULTIVERSE IDENTIFICATION', 40, 62)

  ctx.font = '800 18px Manrope, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(universe, 760, 60)

  // Photo Frame
  const photoX = 45
  const photoY = 110
  const photoW = 280
  const photoH = 280

  ctx.fillStyle = '#000000'
  ctx.fillRect(photoX - 4, photoY - 4, photoW + 8, photoH + 8)

  if (photo) {
    const img = await loadImage(photo)
    ctx.drawImage(img, photoX, photoY, photoW, photoH)
  }

  ctx.strokeStyle = '#FF0055'
  ctx.lineWidth = 4
  ctx.strokeRect(photoX, photoY, photoW, photoH)

  // Hero Details text block
  const textX = 360
  ctx.textAlign = 'left'

  // Hero Alias
  ctx.fillStyle = '#38BDF8'
  ctx.font = '700 14px Manrope, sans-serif'
  ctx.fillText('CODENAME / ALIAS:', textX, 130)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = '900 36px Bangers, cursive'
  ctx.fillText(heroName.toUpperCase(), textX, 168)

  // Rank & Status
  ctx.fillStyle = '#38BDF8'
  ctx.font = '700 14px Manrope, sans-serif'
  ctx.fillText('SECURITY CLEARANCE & RANK:', textX, 210)

  ctx.fillStyle = '#FEF08A'
  ctx.font = '800 22px Bangers, cursive'
  ctx.fillText(rank.toUpperCase(), textX, 238)

  // Spider Power Level & Speciality
  ctx.fillStyle = '#38BDF8'
  ctx.font = '700 14px Manrope, sans-serif'
  ctx.fillText('SPIDER POWER RATING:', textX, 280)

  ctx.fillStyle = '#00F5D4'
  ctx.font = '800 24px Bangers, cursive'
  ctx.fillText(powerLevel, textX, 308)

  ctx.fillStyle = '#38BDF8'
  ctx.font = '700 14px Manrope, sans-serif'
  ctx.fillText('SIGNATURE TRAIT:', textX, 348)

  ctx.fillStyle = '#F472B6'
  ctx.font = '700 20px Bangers, cursive'
  ctx.fillText(specialty.toUpperCase(), textX, 374)

  // Barcode / Hologram at bottom
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.fillRect(45, 410, 710, 60)

  // Fake Barcode lines
  ctx.fillStyle = '#FFFFFF'
  for (let x = 60; x < 280; x += 6) {
    const w = (x % 12 === 0) ? 4 : 2
    ctx.fillRect(x, 420, w, 40)
  }

  ctx.fillStyle = '#00E5FF'
  ctx.font = '600 14px "Press Start 2P", monospace'
  ctx.fillText('VALIDATED BY MIGUEL O\'HARA // SECTOR-001', 320, 445)

  return canvas.toDataURL('image/png')
}
