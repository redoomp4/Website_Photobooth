import { useState } from 'react'
import { STICKERS, STICKER_CATEGORIES, svgToDataUri } from '../stickers/stickerData'

export default function StickerBelt({ mode, armedId, onArm, onOpenBubbleModal, customBubbles = [] }) {
  const [selectedCat, setSelectedCat] = useState('Semua')

  const filteredStickers =
    selectedCat === 'Semua'
      ? STICKERS
      : STICKERS.filter((s) => s.category === selectedCat)

  return (
    <div className="belt">
      <div className="belt__top">
        <div className="belt__label">
          <span className="belt__icon">🏷️</span> SABUK STIKER &amp; PROPS
        </div>
        <div className="belt__categories">
          {STICKER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`btn-tag btn-tag--sm ${selectedCat === cat ? 'is-active' : ''}`}
              onClick={() => setSelectedCat(cat)}
            >
              {cat}
            </button>
          ))}
          <button
            className="btn-tag btn-tag--sm btn-tag--highlight"
            onClick={onOpenBubbleModal}
          >
            💬 + Balon Komik
          </button>
        </div>
      </div>

      <div className="belt__row">
        {filteredStickers.map((s) => {
          const src = svgToDataUri(s[mode])
          const isArmed = armedId === s.id
          return (
            <button
              key={s.id}
              className={`belt__item ${isArmed ? 'is-armed' : ''}`}
              onClick={() => onArm(isArmed ? null : s.id)}
              title={s.name}
            >
              <img src={src} alt={s.name} draggable={false} />
              <span className="belt__item-name">{s.name}</span>
            </button>
          )
        })}

        {/* Custom Created Speech Bubbles */}
        {customBubbles.map((b) => {
          const isArmed = armedId === b.id
          return (
            <button
              key={b.id}
              className={`belt__item belt__item--bubble ${isArmed ? 'is-armed' : ''}`}
              onClick={() => onArm(isArmed ? null : b.id)}
              title={b.name}
            >
              <img src={b.dataUri} alt={b.name} draggable={false} />
              <span className="belt__item-name">{b.text}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
