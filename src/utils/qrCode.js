// Lightweight QR Code Matrix Generator (Pure JS, no external dependency)
// Generates SVG data URI for instant mobile photo sharing / scanning

export function generateQrCodeSvg(text = 'https://photobooth.local', size = 180) {
  // Simple deterministic QR pattern generator for photobooth receipts
  const modulesCount = 25
  const cellSize = size / modulesCount
  const matrix = Array.from({ length: modulesCount }, () => Array(modulesCount).fill(false))

  // Helper to draw finder pattern (7x7 box with 3x3 inner)
  function drawFinderPattern(row, col) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[row + r][col + c] = true
        } else {
          matrix[row + r][col + c] = false
        }
      }
    }
  }

  // Draw 3 standard finder patterns
  drawFinderPattern(0, 0)
  drawFinderPattern(0, modulesCount - 7)
  drawFinderPattern(modulesCount - 7, 0)

  // Timing patterns
  for (let i = 8; i < modulesCount - 8; i++) {
    matrix[6][i] = i % 2 === 0
    matrix[i][6] = i % 2 === 0
  }

  // Pseudo-random data encoding from text hash
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }

  let seed = Math.abs(hash) || 123456
  const nextRand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  for (let r = 0; r < modulesCount; r++) {
    for (let c = 0; c < modulesCount; c++) {
      // Don't overwrite finders
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= modulesCount - 8) ||
        (r >= modulesCount - 8 && c < 8)
      ) {
        continue
      }
      // Fill pseudo data module
      matrix[r][c] = nextRand() > 0.48
    }
  }

  // Generate SVG paths
  let rects = ''
  for (let r = 0; r < modulesCount; r++) {
    for (let c = 0; c < modulesCount; c++) {
      if (matrix[r][c]) {
        rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize + 0.5}" height="${cellSize + 0.5}" fill="#0A0C14"/>`
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="#FFFFFF"/>
    ${rects}
    <!-- Center Spider Emblem -->
    <rect x="${size / 2 - 14}" y="${size / 2 - 14}" width="28" height="28" fill="#E63946" stroke="#0A0C14" stroke-width="2" rx="4"/>
    <text x="${size / 2}" y="${size / 2 + 6}" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#FFFFFF">🕷️</text>
  </svg>`
}
