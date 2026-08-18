// Koleksi Stiker Orisinal Spider-Verse untuk COBWEB BOOTH
// Dibuat khusus dengan format SVG vektor tajam & skalabel

const svg = (inner, vb = '0 0 100 100') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${inner}</svg>`

// ==================== 1. MASKS & FACES ====================

const classicMaskPixel = svg(`
  <g shape-rendering="crispEdges">
    <rect x="25" y="10" width="50" height="15" fill="#E63946"/>
    <rect x="18" y="25" width="64" height="40" fill="#E63946"/>
    <rect x="25" y="65" width="50" height="20" fill="#E63946"/>
    <rect x="32" y="85" width="36" height="8" fill="#B91C1C"/>
    <!-- Web Lines -->
    <line x1="50" y1="10" x2="50" y2="90" stroke="#1E112A" stroke-width="2"/>
    <line x1="18" y1="45" x2="82" y2="45" stroke="#1E112A" stroke-width="2"/>
    <!-- Eyes -->
    <polygon points="26,36 44,38 42,52 24,44" fill="#FFFFFF" stroke="#1E112A" stroke-width="3"/>
    <polygon points="74,36 56,38 58,52 76,44" fill="#FFFFFF" stroke="#1E112A" stroke-width="3"/>
  </g>`)

const classicMaskAnime = svg(`
  <g>
    <!-- Head Outline -->
    <path d="M50 8 C26 8 16 28 18 52 C20 72 35 90 50 94 C65 90 80 72 82 52 C84 28 74 8 50 8 Z" fill="#E63946" stroke="#11081A" stroke-width="3.5"/>
    <!-- Web Pattern -->
    <path d="M50 8 L50 94 M18 52 Q50 48 82 52 M22 34 Q50 30 78 34 M25 70 Q50 66 75 70 M28 20 L72 80 M72 20 L28 80" stroke="#8C1220" stroke-width="1.8" fill="none" opacity="0.65"/>
    <!-- Big Expressive Comic Eyes -->
    <path d="M22 36 Q38 34 46 48 Q36 60 22 46 Z" fill="#FFFFFF" stroke="#11081A" stroke-width="4" stroke-linejoin="round"/>
    <path d="M78 36 Q62 34 54 48 Q64 60 78 46 Z" fill="#FFFFFF" stroke="#11081A" stroke-width="4" stroke-linejoin="round"/>
    <!-- Eye Inner Shadow -->
    <path d="M26 39 Q38 38 44 47" stroke="#38BDF8" stroke-width="1.5" fill="none" opacity="0.8"/>
    <path d="M74 39 Q62 38 56 47" stroke="#38BDF8" stroke-width="1.5" fill="none" opacity="0.8"/>
  </g>`)

const gwenHoodPixel = svg(`
  <g shape-rendering="crispEdges">
    <!-- Hood -->
    <polygon points="50,5 15,35 22,88 78,88 85,35" fill="#F8FAFC" stroke="#0F172A" stroke-width="3"/>
    <polygon points="50,15 26,40 32,80 68,80 74,40" fill="#831843"/>
    <!-- Mask -->
    <ellipse cx="50" cy="52" rx="20" ry="24" fill="#FFFFFF"/>
    <!-- Pink / Cyan Eyes -->
    <polygon points="34,45 46,47 44,58 32,53" fill="#EC4899" stroke="#0F172A" stroke-width="2"/>
    <polygon points="66,45 54,47 56,58 68,53" fill="#06B6D4" stroke="#0F172A" stroke-width="2"/>
  </g>`)

const gwenHoodAnime = svg(`
  <g>
    <!-- Outer White Hood -->
    <path d="M50 5 C22 10 12 36 16 80 C24 88 76 88 84 80 C88 36 78 10 50 5 Z" fill="#F8FAFC" stroke="#0F172A" stroke-width="3.5"/>
    <!-- Inner Purple/Pink Hood Lining -->
    <path d="M50 14 C30 18 24 38 26 74 C34 78 66 78 74 74 C76 38 70 18 50 14 Z" fill="#831843" stroke="#DB2777" stroke-width="2"/>
    <!-- Web pattern inside hood -->
    <path d="M50 14 L30 74 M50 14 L70 74 M26 42 Q50 38 74 42 M26 58 Q50 54 74 58" stroke="#DB2777" stroke-width="1.5" fill="none" opacity="0.6"/>
    <!-- Gwen Mask Face -->
    <path d="M50 26 C36 26 30 40 32 58 C34 72 42 80 50 82 C58 80 66 72 68 58 C70 40 64 26 50 26 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5"/>
    <!-- Gwen Cyan & Magenta Eyes -->
    <path d="M34 46 Q44 42 48 54 Q40 62 33 53 Z" fill="#06B6D4" stroke="#0F172A" stroke-width="3"/>
    <path d="M66 46 Q56 42 52 54 Q60 62 67 53 Z" fill="#EC4899" stroke="#0F172A" stroke-width="3"/>
  </g>`)

const milesGlitchPixel = svg(`
  <g shape-rendering="crispEdges">
    <rect x="22" y="12" width="56" height="74" fill="#0A0E1A" stroke="#FF0055" stroke-width="3"/>
    <rect x="18" y="30" width="8" height="20" fill="#00E5FF"/>
    <rect x="74" y="45" width="8" height="20" fill="#FF0055"/>
    <polygon points="28,38 46,40 43,54 26,46" fill="#FF0055"/>
    <polygon points="72,38 54,40 57,54 74,46" fill="#00E5FF"/>
    <rect x="40" y="70" width="20" height="4" fill="#00E5FF"/>
  </g>`)

const milesGlitchAnime = svg(`
  <g>
    <!-- Glitch background shift -->
    <path d="M48 6 C24 6 14 26 16 50 C18 70 33 88 48 92 C63 88 78 70 80 50 C82 26 72 6 48 6 Z" fill="none" stroke="#00E5FF" stroke-width="2" opacity="0.75" transform="translate(-2, 1)"/>
    <path d="M52 10 C28 10 18 30 20 54 C22 74 37 92 52 96 C67 92 82 74 84 54 C86 30 76 10 52 10 Z" fill="none" stroke="#FF0055" stroke-width="2" opacity="0.75" transform="translate(2, -1)"/>
    <!-- Main Black Mask -->
    <path d="M50 8 C26 8 16 28 18 52 C20 72 35 90 50 94 C65 90 80 72 82 52 C84 28 74 8 50 8 Z" fill="#0F172A" stroke="#FF0055" stroke-width="3.5"/>
    <!-- Red Webbing / Spray marks -->
    <path d="M50 8 L50 94 M18 52 Q50 48 82 52 M22 34 Q50 30 78 34" stroke="#DC2626" stroke-width="2" fill="none"/>
    <!-- Eyes -->
    <path d="M22 38 Q38 36 46 50 Q36 62 22 48 Z" fill="#FFFFFF" stroke="#00E5FF" stroke-width="3"/>
    <path d="M78 38 Q62 36 54 50 Q64 62 78 48 Z" fill="#FFFFFF" stroke="#FF0055" stroke-width="3"/>
  </g>`)

const noirHatPixel = svg(`
  <g shape-rendering="crispEdges">
    <!-- Fedora Hat -->
    <rect x="15" y="24" width="70" height="10" fill="#18181B"/>
    <rect x="28" y="8" width="44" height="20" fill="#27272A"/>
    <rect x="28" y="20" width="44" height="6" fill="#FFFFFF"/>
    <!-- Mask Face -->
    <rect x="25" y="34" width="50" height="50" fill="#3F3F46"/>
    <!-- Round Goggles -->
    <circle cx="38" cy="50" r="10" fill="#F4F4F5" stroke="#09090B" stroke-width="2"/>
    <circle cx="62" cy="50" r="10" fill="#F4F4F5" stroke="#09090B" stroke-width="2"/>
    <rect x="46" y="48" width="8" height="4" fill="#09090B"/>
  </g>`)

const noirHatAnime = svg(`
  <g>
    <!-- Fedora Hat -->
    <path d="M10 32 Q50 22 90 32 Q50 36 10 32 Z" fill="#18181B" stroke="#09090B" stroke-width="2"/>
    <path d="M26 30 C26 12 36 8 50 8 C64 8 74 12 74 30 Z" fill="#27272A" stroke="#09090B" stroke-width="2"/>
    <path d="M26 26 Q50 24 74 26 L74 30 Q50 28 26 30 Z" fill="#E4E4E7"/>
    <!-- Noir Mask -->
    <path d="M50 32 C30 32 24 45 26 68 C28 84 38 92 50 94 C62 92 72 84 74 68 C76 45 70 32 50 32 Z" fill="#3F3F46" stroke="#09090B" stroke-width="3"/>
    <!-- Goggles -->
    <circle cx="38" cy="54" r="11" fill="#F4F4F5" stroke="#09090B" stroke-width="3.5"/>
    <circle cx="62" cy="54" r="11" fill="#F4F4F5" stroke="#09090B" stroke-width="3.5"/>
    <path d="M48 54 L52 54" stroke="#09090B" stroke-width="4"/>
    <line x1="32" y1="48" x2="44" y2="60" stroke="#A1A1AA" stroke-width="2"/>
    <line x1="56" y1="48" x2="68" y2="60" stroke="#A1A1AA" stroke-width="2"/>
  </g>`)

// ==================== 2. COMIC ACTION WORDS & ONOMATOPOEIA ====================

const thwipComicPixel = svg(`
  <g shape-rendering="crispEdges">
    <polygon points="5,15 95,8 85,75 55,65 45,92 35,68 5,75" fill="#FFE600" stroke="#11081A" stroke-width="3"/>
    <text x="50" y="52" font-family="'Press Start 2P', monospace" font-size="14" font-weight="900" text-anchor="middle" fill="#E63946">THWIP!</text>
  </g>`)

const thwipComicAnime = svg(`
  <g>
    <!-- Action Burst -->
    <polygon points="50,2 62,24 88,8 78,32 98,42 76,56 92,80 64,74 52,98 40,74 12,82 24,56 2,42 22,32 12,8 38,24" fill="#FFE600" stroke="#11081A" stroke-width="3.5" stroke-linejoin="round"/>
    <polygon points="50,8 60,26 82,14 74,34 90,42 72,54 84,74 62,70 52,90 42,70 18,76 28,54 10,42 26,34 18,14 38,26" fill="#F59E0B"/>
    <!-- Comic Text -->
    <text x="50" y="56" font-family="Bangers, Impact, sans-serif" font-size="34" font-weight="900" letter-spacing="1" text-anchor="middle" fill="#E63946" stroke="#11081A" stroke-width="2.5" stroke-linejoin="round" transform="rotate(-6 50 50)">THWIP!</text>
    <text x="50" y="56" font-family="Bangers, Impact, sans-serif" font-size="34" font-weight="900" letter-spacing="1" text-anchor="middle" fill="#FFFFFF" transform="rotate(-6 50 50)">THWIP!</text>
  </g>`)

const boomComicPixel = svg(`
  <g shape-rendering="crispEdges">
    <polygon points="10,10 90,12 80,85 50,70 40,95 20,80" fill="#EF4444" stroke="#000000" stroke-width="3"/>
    <text x="50" y="54" font-family="'Press Start 2P', monospace" font-size="14" font-weight="900" text-anchor="middle" fill="#FDE047">BOOM!</text>
  </g>`)

const boomComicAnime = svg(`
  <g>
    <polygon points="50,0 66,22 96,12 84,36 100,56 78,68 88,96 60,84 46,100 34,80 6,90 18,64 0,48 24,36 10,14 36,22" fill="#DC2626" stroke="#11081A" stroke-width="3.5" stroke-linejoin="round"/>
    <polygon points="50,8 62,26 86,18 76,38 90,54 72,64 80,86 58,76 46,90 36,74 14,82 24,60 10,48 28,38 18,20 38,26" fill="#FBBF24"/>
    <text x="50" y="58" font-family="Bangers, Impact, sans-serif" font-size="36" font-weight="900" text-anchor="middle" fill="#FFFFFF" stroke="#11081A" stroke-width="3" stroke-linejoin="round" transform="rotate(4 50 50)">BOOM!</text>
  </g>`)

const spiderSensePixel = svg(`
  <g shape-rendering="crispEdges">
    <path d="M20 20 L30 10 M35 25 L45 8 M50 28 L50 6 M65 25 L55 8 M80 20 L70 10" stroke="#EF4444" stroke-width="4"/>
    <rect x="25" y="45" width="50" height="30" fill="#FEF08A" stroke="#1E1B4B" stroke-width="2"/>
    <text x="50" y="66" font-family="'Press Start 2P', monospace" font-size="8" text-anchor="middle" fill="#DC2626">SENSE!</text>
  </g>`)

const spiderSenseAnime = svg(`
  <g>
    <!-- Lightning / Tingles radiating outward -->
    <path d="M50 48 L48 26 L56 22 L50 4 M36 50 L26 30 L34 26 L20 12 M64 50 L74 30 L66 26 L80 12 M24 62 L10 50 L18 46 L2 36 M76 62 L90 50 L82 46 L98 36" stroke="#EF4444" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M50 48 L48 26 L56 22 L50 4 M36 50 L26 30 L34 26 L20 12 M64 50 L74 30 L66 26 L80 12" stroke="#FDE047" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <!-- Yellow warning badge -->
    <polygon points="50,44 72,56 64,80 36,80 28,56" fill="#FACC15" stroke="#11081A" stroke-width="3"/>
    <text x="50" y="70" font-family="Bangers, Impact, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#DC2626" stroke="#11081A" stroke-width="0.8">TINGLE!</text>
  </g>`)

const powComicPixel = svg(`
  <g shape-rendering="crispEdges">
    <polygon points="15,20 85,15 92,75 50,90 10,70" fill="#3B82F6" stroke="#000000" stroke-width="3"/>
    <text x="50" y="58" font-family="'Press Start 2P', monospace" font-size="14" text-anchor="middle" fill="#FFFFFF">POW!</text>
  </g>`)

const powComicAnime = svg(`
  <g>
    <polygon points="50,2 65,20 92,10 82,34 98,54 76,66 84,94 58,82 46,98 34,78 8,88 20,62 2,46 24,34 12,12 36,20" fill="#2563EB" stroke="#11081A" stroke-width="3.5" stroke-linejoin="round"/>
    <polygon points="50,10 62,24 84,16 76,36 88,52 70,62 76,84 56,74 46,86 36,70 16,78 26,58 12,46 28,36 18,18 36,24" fill="#60A5FA"/>
    <text x="50" y="58" font-family="Bangers, Impact, sans-serif" font-size="34" font-weight="900" text-anchor="middle" fill="#FEF08A" stroke="#11081A" stroke-width="2.5" stroke-linejoin="round" transform="rotate(-5 50 50)">POW!</text>
  </g>`)

// ==================== 3. SPIDER EMBLEMS & WEBBING ====================

const classicEmblemPixel = svg(`
  <g shape-rendering="crispEdges">
    <rect x="36" y="32" width="28" height="36" fill="#11081A"/>
    <!-- 8 legs -->
    <rect x="20" y="24" width="16" height="6" fill="#11081A"/>
    <rect x="14" y="30" width="6" height="18" fill="#11081A"/>
    <rect x="64" y="24" width="16" height="6" fill="#11081A"/>
    <rect x="80" y="30" width="6" height="18" fill="#11081A"/>
    <rect x="20" y="68" width="16" height="6" fill="#11081A"/>
    <rect x="14" y="52" width="6" height="18" fill="#11081A"/>
    <rect x="64" y="68" width="16" height="6" fill="#11081A"/>
    <rect x="80" y="52" width="6" height="18" fill="#11081A"/>
  </g>`)

const classicEmblemAnime = svg(`
  <g>
    <!-- Spider Body -->
    <ellipse cx="50" cy="42" rx="9" ry="12" fill="#E63946" stroke="#11081A" stroke-width="2"/>
    <ellipse cx="50" cy="62" rx="13" ry="16" fill="#E63946" stroke="#11081A" stroke-width="2"/>
    <!-- Legs -->
    <path d="M44 38 Q24 20 18 10 M42 44 Q16 34 10 32 M42 58 Q14 62 10 74 M44 64 Q22 80 18 90" stroke="#11081A" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <path d="M56 38 Q76 20 82 10 M58 44 Q84 34 90 32 M58 58 Q86 62 90 74 M56 64 Q78 80 82 90" stroke="#11081A" stroke-width="4.5" stroke-linecap="round" fill="none"/>
  </g>`)

const webCornerPixel = svg(`
  <g shape-rendering="crispEdges" stroke="#FFFFFF" stroke-width="4" fill="none">
    <path d="M2 2 L98 2 M2 2 L2 98"/>
    <path d="M2 24 L76 24 M24 2 L24 76"/>
    <path d="M2 48 L52 48 M48 2 L48 52"/>
    <path d="M2 2 L90 90"/>
    <path d="M2 2 L35 85 M2 2 L85 35"/>
  </g>`)

const webCornerAnime = svg(`
  <g stroke="#FFFFFF" stroke-width="2.5" fill="none" opacity="0.95">
    <path d="M2 2 Q55 8 60 60 Q8 55 2 2 Z" fill="rgba(255,255,255,0.06)"/>
    <path d="M2 2 Q80 12 90 90 Q12 80 2 2 Z" fill="rgba(255,255,255,0.03)"/>
    <line x1="2" y1="2" x2="94" y2="94"/>
    <line x1="2" y1="2" x2="35" y2="96"/>
    <line x1="2" y1="2" x2="96" y2="35"/>
    <path d="M2 25 Q32 30 38 65"/>
    <path d="M2 50 Q52 56 62 96"/>
    <path d="M25 2 Q30 32 65 38"/>
    <path d="M50 2 Q56 52 96 62"/>
  </g>`)

const punkSpikesPixel = svg(`
  <g shape-rendering="crispEdges">
    <polygon points="50,10 40,40 60,40" fill="#EC4899"/>
    <polygon points="25,25 25,50 45,50" fill="#06B6D4"/>
    <polygon points="75,25 55,50 75,50" fill="#EAB308"/>
    <rect x="20" y="55" width="60" height="25" fill="#18181B"/>
    <text x="50" y="73" font-family="'Press Start 2P', monospace" font-size="8" text-anchor="middle" fill="#FFFFFF">PUNK!</text>
  </g>`)

const punkSpikesAnime = svg(`
  <g>
    <!-- Mohawk Spikes -->
    <polygon points="50,4 42,34 58,34" fill="#EC4899" stroke="#000000" stroke-width="3"/>
    <polygon points="30,16 28,42 44,40" fill="#06B6D4" stroke="#000000" stroke-width="3"/>
    <polygon points="70,16 56,40 72,42" fill="#EAB308" stroke="#000000" stroke-width="3"/>
    <polygon points="14,32 18,52 32,48" fill="#10B981" stroke="#000000" stroke-width="3"/>
    <polygon points="86,32 68,48 82,52" fill="#F97316" stroke="#000000" stroke-width="3"/>
    <!-- Safety Pin badge -->
    <ellipse cx="50" cy="68" rx="28" ry="14" fill="#09090B" stroke="#FFFFFF" stroke-width="2"/>
    <text x="50" y="73" font-family="Bangers, sans-serif" font-size="16" text-anchor="middle" fill="#F43F5E">ANARCHY</text>
  </g>`)

// ==================== 4. PROPS & ACCESSORIES ====================

const pizzaPixel = svg(`
  <g shape-rendering="crispEdges">
    <polygon points="50,15 15,80 85,80" fill="#F59E0B" stroke="#78350F" stroke-width="3"/>
    <rect x="35" y="45" width="8" height="8" fill="#DC2626"/>
    <rect x="55" y="55" width="8" height="8" fill="#DC2626"/>
    <rect x="45" y="65" width="8" height="8" fill="#DC2626"/>
  </g>`)

const pizzaAnime = svg(`
  <g>
    <!-- Pizza Slice -->
    <polygon points="50,10 12,82 88,82" fill="#FBBF24" stroke="#11081A" stroke-width="3" stroke-linejoin="round"/>
    <path d="M12 82 Q50 94 88 82 L88 88 Q50 100 12 88 Z" fill="#D97706" stroke="#11081A" stroke-width="3"/>
    <!-- Melted Cheese & Pepperoni -->
    <circle cx="45" cy="45" r="7" fill="#EF4444" stroke="#11081A" stroke-width="2"/>
    <circle cx="62" cy="62" r="8" fill="#EF4444" stroke="#11081A" stroke-width="2"/>
    <circle cx="35" cy="68" r="6" fill="#EF4444" stroke="#11081A" stroke-width="2"/>
    <path d="M38 35 Q45 50 52 35" stroke="#FEF08A" stroke-width="3" fill="none"/>
  </g>`)

export const STICKERS = [
  // Heroes & Masks
  { id: 'classic_mask', name: 'Topeng Classic', category: 'Topeng', pixel: classicMaskPixel, anime: classicMaskAnime },
  { id: 'gwen_hood', name: 'Gwen Hood', category: 'Topeng', pixel: gwenHoodPixel, anime: gwenHoodAnime },
  { id: 'miles_glitch', name: 'Miles 2099', category: 'Topeng', pixel: milesGlitchPixel, anime: milesGlitchAnime },
  { id: 'noir_hat', name: 'Noir Fedora', category: 'Topeng', pixel: noirHatPixel, anime: noirHatAnime },
  { id: 'punk_spikes', name: 'Spider-Punk', category: 'Topeng', pixel: punkSpikesPixel, anime: punkSpikesAnime },

  // Comic FX & Sound Words
  { id: 'thwip', name: 'THWIP!', category: 'Komik FX', pixel: thwipComicPixel, anime: thwipComicAnime },
  { id: 'boom', name: 'BOOM!', category: 'Komik FX', pixel: boomComicPixel, anime: boomComicAnime },
  { id: 'spider_sense', name: 'SPIDER-SENSE', category: 'Komik FX', pixel: spiderSensePixel, anime: spiderSenseAnime },
  { id: 'pow', name: 'POW!', category: 'Komik FX', pixel: powComicPixel, anime: powComicAnime },

  // Emblems & Props
  { id: 'emblem', name: 'Lambang Laba-Laba', category: 'Aksesoris', pixel: classicEmblemPixel, anime: classicEmblemAnime },
  { id: 'webcorner', name: 'Jaring Sudut', category: 'Aksesoris', pixel: webCornerPixel, anime: webCornerAnime },
  { id: 'pizza', name: 'Spidey Pizza', category: 'Aksesoris', pixel: pizzaPixel, anime: pizzaAnime },
]

export const STICKER_CATEGORIES = ['Semua', 'Topeng', 'Komik FX', 'Aksesoris']

export const svgToDataUri = (svgString) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`
