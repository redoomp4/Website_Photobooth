import { FILTERS } from '../utils/compositor'

export default function FilterRail({ activeId, onSelect }) {
  return (
    <div className="filterrail">
      <span className="filterrail__label">FILTER</span>
      <div className="filterrail__list">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`filterrail__chip ${activeId === f.id ? 'is-active' : ''}`}
            style={{ filter: f.css }}
            onClick={() => onSelect(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
