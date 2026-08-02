import { STICKERS, svgToDataUri } from '../stickers/stickerData'

export default function StickerBelt({ mode, armedId, onArm }) {
  return (
    <div className="belt">
      <div className="belt__label">SABUK STIKER — pilih, lalu ketuk foto untuk menempel</div>
      <div className="belt__row">
        {STICKERS.map((s) => {
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
              <span>{s.name}</span>
              <small>{s.category}</small>
            </button>
          )
        })}
      </div>
    </div>
  )
}
