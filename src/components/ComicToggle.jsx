export default function ComicToggle({ mode, onChange }) {
  return (
    <div className="webshooter">
      <span className="webshooter__label">MODE STIKER</span>
      <div className="webshooter__track" role="group" aria-label="Pilih gaya sticker">
        <button
          className={`webshooter__btn ${mode === 'pixel' ? 'is-active' : ''}`}
          onClick={() => onChange('pixel')}
          aria-pressed={mode === 'pixel'}
        >
          PIXEL
        </button>
        <button
          className={`webshooter__btn ${mode === 'anime' ? 'is-active' : ''}`}
          onClick={() => onChange('anime')}
          aria-pressed={mode === 'anime'}
        >
          ANIME
        </button>
      </div>
    </div>
  )
}
