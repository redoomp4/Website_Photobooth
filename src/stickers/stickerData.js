// Semua karakter di bawah ini adalah desain ORISINAL bertema "hero laba-laba"
// buatan sendiri untuk COBWEB BOOTH — bukan Spider-Man/karakter Marvel.
// Setiap sticker punya 2 gaya: "pixel" (blok retro) dan "anime" (garis tebal, cel-shaded).

const svg = (inner, vb = '0 0 100 100') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${inner}</svg>`

// ---------- NIGHTWEB — hero utama (crimson & emas, lensa oval tunggal asimetris) ----------
const nightwebPixel = svg(`
  <g shape-rendering="crispEdges">
    <rect x="30" y="10" width="40" height="10" fill="#E63946"/>
    <rect x="20" y="20" width="60" height="15" fill="#E63946"/>
    <rect x="15" y="35" width="70" height="20" fill="#8C1220"/>
    <rect x="35" y="38" width="18" height="12" fill="#FFC857"/>
    <rect x="55" y="40" width="10" height="8" fill="#FFC857"/>
    <rect x="15" y="55" width="70" height="10" fill="#E63946"/>
    <rect x="25" y="65" width="20" height="20" fill="#2B2140"/>
    <rect x="55" y="65" width="20" height="20" fill="#2B2140"/>
    <rect x="10" y="45" width="8" height="3" fill="#FFC857"/>
    <rect x="82" y="45" width="8" height="3" fill="#FFC857"/>
  </g>`)

const nightwebAnime = svg(`
  <g>
    <path d="M50 8 C25 8 15 28 18 48 C20 66 34 84 50 90 C66 84 80 66 82 48 C85 28 75 8 50 8 Z"
      fill="#E63946" stroke="#1A1025" stroke-width="3"/>
    <path d="M28 42 C28 34 40 30 48 34 C54 37 54 46 46 50 C38 54 28 50 28 42 Z" fill="#FFC857" stroke="#1A1025" stroke-width="2.5"/>
    <path d="M58 46 C58 41 66 39 70 43 C73 46 71 51 65 52 C60 53 58 50 58 46 Z" fill="#FFC857" stroke="#1A1025" stroke-width="2.5"/>
    <path d="M50 8 C40 8 32 14 27 22" stroke="#FFC857" stroke-width="2" fill="none" opacity="0.8"/>
    <path d="M50 8 C60 8 68 14 73 22" stroke="#FFC857" stroke-width="2" fill="none" opacity="0.8"/>
    <path d="M15 55 L8 60 M15 60 L6 68 M85 55 L92 60 M85 60 L94 68" stroke="#1A1025" stroke-width="2.5" stroke-linecap="round"/>
  </g>`)

// ---------- GLITCHBACK — musuh (ungu-hitam, motif glitch retak) ----------
const glitchbackPixel = svg(`
  <g shape-rendering="crispEdges">
    <rect x="25" y="12" width="50" height="14" fill="#3B0764"/>
    <rect x="15" y="26" width="70" height="18" fill="#5B21B6"/>
    <rect x="34" y="30" width="14" height="10" fill="#22D3EE"/>
    <rect x="52" y="30" width="14" height="10" fill="#22D3EE"/>
    <rect x="15" y="44" width="70" height="8" fill="#1E1130"/>
    <rect x="20" y="52" width="60" height="14" fill="#5B21B6"/>
    <rect x="8" y="66" width="14" height="6" fill="#3B0764"/>
    <rect x="78" y="66" width="14" height="6" fill="#3B0764"/>
    <rect x="8" y="76" width="14" height="6" fill="#3B0764"/>
    <rect x="78" y="76" width="14" height="6" fill="#3B0764"/>
    <rect x="44" y="66" width="12" height="20" fill="#1E1130"/>
  </g>`)

const glitchbackAnime = svg(`
  <g>
    <path d="M50 10 L74 24 L80 50 L68 62 L50 68 L32 62 L20 50 L26 24 Z" fill="#5B21B6" stroke="#12081F" stroke-width="3"/>
    <path d="M36 34 L48 32 L44 44 L34 44 Z" fill="#22D3EE" stroke="#12081F" stroke-width="2"/>
    <path d="M56 32 L68 34 L66 44 L58 44 Z" fill="#22D3EE" stroke="#12081F" stroke-width="2"/>
    <path d="M22 52 L10 58 L14 64 M78 52 L90 58 L86 64 M28 64 L14 74 L20 80 M72 64 L86 74 L80 80"
      stroke="#12081F" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M40 46 L44 40 L48 46 L52 40 L56 46" stroke="#22D3EE" stroke-width="2" fill="none"/>
  </g>`)

// ---------- LANTERN-FLY — sahabat (teal-emas, kacamata bulat kembar + lentera) ----------
const lanternflyPixel = svg(`
  <g shape-rendering="crispEdges">
    <rect x="32" y="14" width="36" height="10" fill="#0F766E"/>
    <rect x="22" y="24" width="56" height="16" fill="#14B8A6"/>
    <rect x="30" y="28" width="14" height="10" fill="#FFC857"/>
    <rect x="56" y="28" width="14" height="10" fill="#FFC857"/>
    <rect x="22" y="40" width="56" height="10" fill="#0F766E"/>
    <rect x="46" y="6" width="8" height="8" fill="#14B8A6"/>
    <rect x="46" y="0" width="8" height="8" fill="#FFE9A8"/>
    <rect x="30" y="50" width="40" height="16" fill="#14B8A6"/>
    <rect x="42" y="66" width="16" height="18" fill="#0F766E"/>
  </g>`)

const lanternflyAnime = svg(`
  <g>
    <line x1="50" y1="6" x2="50" y2="16" stroke="#0F766E" stroke-width="2.5"/>
    <circle cx="50" cy="6" r="5" fill="#FFE9A8" stroke="#12312B" stroke-width="2"/>
    <path d="M50 14 C28 14 20 30 22 44 C24 58 36 72 50 76 C64 72 76 58 78 44 C80 30 72 14 50 14 Z"
      fill="#14B8A6" stroke="#12312B" stroke-width="3"/>
    <circle cx="38" cy="40" r="9" fill="#FFC857" stroke="#12312B" stroke-width="2.5"/>
    <circle cx="62" cy="40" r="9" fill="#FFC857" stroke="#12312B" stroke-width="2.5"/>
    <circle cx="38" cy="40" r="3" fill="#12312B"/>
    <circle cx="62" cy="40" r="3" fill="#12312B"/>
    <path d="M40 78 C40 86 60 86 60 78" stroke="#12312B" stroke-width="2.5" fill="none"/>
  </g>`)

// ---------- FX / aksesori orisinal ----------
const thwipPixel = svg(`
  <g shape-rendering="crispEdges">
    <rect x="10" y="30" width="80" height="34" fill="#F5F3EE" stroke="#1A1025" stroke-width="3"/>
    <rect x="14" y="34" width="72" height="26" fill="#FFC857"/>
    <text x="50" y="55" font-family="'Press Start 2P', monospace" font-size="14" text-anchor="middle" fill="#1A1025">ZIP!</text>
  </g>`)
const thwipAnime = svg(`
  <g>
    <path d="M10 20 L90 15 L86 55 L60 50 L52 70 L44 52 L10 58 Z" fill="#FFC857" stroke="#1A1025" stroke-width="3" stroke-linejoin="round"/>
    <text x="50" y="42" font-family="Bangers, cursive" font-size="24" text-anchor="middle" fill="#E63946" stroke="#1A1025" stroke-width="1">ZIP!</text>
  </g>`)

const emblemPixel = svg(`
  <g shape-rendering="crispEdges">
    <rect x="20" y="20" width="60" height="60" fill="#1A1025"/>
    <rect x="30" y="30" width="40" height="40" fill="#E63946"/>
    <rect x="42" y="18" width="4" height="14" fill="#1A1025"/>
    <rect x="54" y="18" width="4" height="14" fill="#1A1025"/>
    <rect x="42" y="68" width="4" height="14" fill="#1A1025"/>
    <rect x="54" y="68" width="4" height="14" fill="#1A1025"/>
    <rect x="18" y="42" width="14" height="4" fill="#1A1025"/>
    <rect x="18" y="54" width="14" height="4" fill="#1A1025"/>
    <rect x="68" y="42" width="14" height="4" fill="#1A1025"/>
    <rect x="68" y="54" width="14" height="4" fill="#1A1025"/>
  </g>`)
const emblemAnime = svg(`
  <g>
    <circle cx="50" cy="50" r="26" fill="#E63946" stroke="#1A1025" stroke-width="3"/>
    <path d="M50 24 L50 8 M50 76 L50 92 M24 50 L8 50 M76 50 L92 50
             M32 32 L20 20 M68 32 L80 20 M32 68 L20 80 M68 68 L80 80"
      stroke="#1A1025" stroke-width="4" stroke-linecap="round"/>
    <circle cx="50" cy="50" r="10" fill="#1A1025"/>
  </g>`)

const webcornerPixel = svg(`
  <g shape-rendering="crispEdges" stroke="#F5F3EE" stroke-width="4" fill="none">
    <path d="M4 4 L96 4 M4 4 L4 96"/>
    <path d="M4 24 L60 24 M24 4 L24 60"/>
    <path d="M4 4 L50 50 M4 4 L20 70 M4 4 L70 20"/>
  </g>`)
const webcornerAnime = svg(`
  <g stroke="#F5F3EE" stroke-width="2.5" fill="none">
    <path d="M2 2 Q40 6 45 45 Q6 40 2 2 Z" fill="rgba(245,243,238,0.08)"/>
    <path d="M2 2 L45 45 M2 18 Q26 22 30 46 M18 2 Q22 26 46 30"/>
  </g>`)

export const STICKERS = [
  { id: 'nightweb', name: 'Nightweb', category: 'Hero', pixel: nightwebPixel, anime: nightwebAnime },
  { id: 'glitchback', name: 'Glitchback', category: 'Musuh', pixel: glitchbackPixel, anime: glitchbackAnime },
  { id: 'lanternfly', name: 'Lantern-Fly', category: 'Sahabat', pixel: lanternflyPixel, anime: lanternflyAnime },
  { id: 'thwip', name: 'Zip!', category: 'FX', pixel: thwipPixel, anime: thwipAnime },
  { id: 'emblem', name: 'Lambang', category: 'FX', pixel: emblemPixel, anime: emblemAnime },
  { id: 'webcorner', name: 'Jaring', category: 'FX', pixel: webcornerPixel, anime: webcornerAnime },
]

export const svgToDataUri = (svgString) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`
