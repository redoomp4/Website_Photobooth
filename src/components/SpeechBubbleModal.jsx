import { useState } from 'react'
import { svgToDataUri } from '../stickers/stickerData'

const BUBBLE_STYLES = [
  { id: 'shout', label: '💥 Shout / Boom' },
  { id: 'oval', label: '💬 Comic Speech' },
  { id: 'thought', label: '💭 Thought Cloud' },
  { id: 'box', label: '📦 Comic Caption Box' },
]

const COLOR_THEMES = [
  { id: 'yellow', bg: '#FFE600', text: '#11081A', border: '#11081A', name: 'Kuning Komik' },
  { id: 'white', bg: '#FFFFFF', text: '#11081A', border: '#11081A', name: 'Putih Klasik' },
  { id: 'red', bg: '#E63946', text: '#FFFFFF', border: '#11081A', name: 'Merah Spidey' },
  { id: 'cyan', bg: '#00E5FF', text: '#0A0E1A', border: '#FF0055', name: 'Neon Glitch' },
  { id: 'black', bg: '#18181B', text: '#F4F4F5', border: '#F4F4F5', name: 'Noir Hitam' },
]

export default function SpeechBubbleModal({ isOpen, onClose, onAddBubble }) {
  const [text, setText] = useState('DENGAN KEKUATAN BESAR!')
  const [style, setStyle] = useState('shout')
  const [themeId, setThemeId] = useState('yellow')
  const [tail, setTail] = useState('bottom-left') // 'bottom-left' | 'bottom-right' | 'none'

  if (!isOpen) return null

  const activeTheme = COLOR_THEMES.find((c) => c.id === themeId) || COLOR_THEMES[0]

  // Generate SVG markup based on chosen style & text
  const generateBubbleSvg = () => {
    const cleanText = text.trim() || 'POW!'
    const textLen = cleanText.length
    const boxW = Math.max(140, Math.min(280, textLen * 14 + 40))
    const boxH = 70

    let pathD = ''
    if (style === 'shout') {
      pathD = `M10 10 L${boxW - 10} 5 L${boxW} ${boxH - 15} L${boxW * 0.6} ${boxH - 5} L${boxW * 0.4} ${boxH + 18} L${boxW * 0.35} ${boxH - 5} L5 ${boxH - 10} Z`
    } else if (style === 'oval') {
      pathD = `M20 5 Q${boxW - 20} 5 ${boxW - 10} 20 Q${boxW} ${boxH - 20} ${boxW - 20} ${boxH - 10} L${boxW * 0.35} ${boxH - 10} L${boxW * 0.2} ${boxH + 15} L${boxW * 0.25} ${boxH - 10} Q5 ${boxH - 10} 5 25 Q5 5 20 5 Z`
    } else if (style === 'thought') {
      pathD = `M20 10 Q${boxW / 2} -2 ${boxW - 20} 10 Q${boxW + 8} ${boxH / 2} ${boxW - 20} ${boxH - 10} Q${boxW / 2} ${boxH + 4} 20 ${boxH - 10} Q-8 ${boxH / 2} 20 10 Z`
    } else {
      // box
      pathD = `M4 4 L${boxW - 4} 4 L${boxW - 4} ${boxH - 4} L4 ${boxH - 4} Z`
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${boxW} ${boxH + 20}">
      <path d="${pathD}" fill="${activeTheme.bg}" stroke="${activeTheme.border}" stroke-width="4" stroke-linejoin="round"/>
      <text x="${boxW / 2}" y="${boxH / 2 + 5}" font-family="Bangers, Impact, sans-serif" font-size="22" font-weight="900" text-anchor="middle" fill="${activeTheme.text}" stroke="${style === 'shout' && activeTheme.id === 'red' ? '#000' : 'none'}" stroke-width="1">${cleanText}</text>
    </svg>`
  }

  const handleApply = () => {
    const svgStr = generateBubbleSvg()
    const dataUri = svgToDataUri(svgStr)
    onAddBubble({
      dataUri,
      text: text.trim() || 'POW!',
      name: `Bubble: ${text.slice(0, 10)}...`,
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--bubble" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>💬 Buat Balon Kata Komik Custom</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <div className="form-group">
            <label>Teks Balon Kata:</label>
            <input
              type="text"
              className="input-text"
              value={text}
              maxLength={35}
              placeholder="Contoh: THWIP! Awas ada penjahat!"
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Model Balon:</label>
            <div className="bubble-picker-grid">
              {BUBBLE_STYLES.map((b) => (
                <button
                  key={b.id}
                  className={`btn-tag ${style === b.id ? 'is-active' : ''}`}
                  onClick={() => setStyle(b.id)}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Warna Balon Komik:</label>
            <div className="color-theme-list">
              {COLOR_THEMES.map((c) => (
                <button
                  key={c.id}
                  className={`color-pill ${themeId === c.id ? 'is-selected' : ''}`}
                  style={{ background: c.bg, color: c.text, borderColor: c.border }}
                  onClick={() => setThemeId(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bubble-live-preview">
            <span className="preview-label">Live Preview:</span>
            <div
              className="preview-box"
              dangerouslySetInnerHTML={{ __html: generateBubbleSvg() }}
            />
          </div>
        </div>

        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onClose}>Batal</button>
          <button className="btn btn--primary" onClick={handleApply}>
            + Tempel ke Foto
          </button>
        </div>
      </div>
    </div>
  )
}
