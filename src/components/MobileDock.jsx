export default function MobileDock({
  stage,
  onSetStage,
  onOpenIdCard,
  onOpenComicCover,
  onOpenCanonEvent,
  onToggleDoodle,
  doodleEnabled,
  onDownload,
}) {
  return (
    <nav className="mobile-dock">
      <button
        className={`mobile-dock__btn ${stage === 'setup' || stage === 'capture' ? 'is-active' : ''}`}
        onClick={() => onSetStage(stage === 'capture' ? 'setup' : 'capture')}
      >
        <span className="dock-icon">📸</span>
        <span className="dock-label">Kamera</span>
      </button>

      {stage === 'edit' && (
        <>
          <button
            className={`mobile-dock__btn ${doodleEnabled ? 'is-active' : ''}`}
            onClick={onToggleDoodle}
          >
            <span className="dock-icon">🎨</span>
            <span className="dock-label">Doodle</span>
          </button>

          <button className="mobile-dock__btn" onClick={onOpenIdCard}>
            <span className="dock-icon">🪪</span>
            <span className="dock-label">ID Card</span>
          </button>

          <button className="mobile-dock__btn" onClick={onOpenComicCover}>
            <span className="dock-icon">📖</span>
            <span className="dock-label">Cover</span>
          </button>

          <button className="mobile-dock__btn" onClick={onOpenCanonEvent}>
            <span className="dock-icon">⚡</span>
            <span className="dock-label">Canon</span>
          </button>

          <button className="mobile-dock__btn mobile-dock__btn--highlight" onClick={onDownload}>
            <span className="dock-icon">📥</span>
            <span className="dock-label">Unduh</span>
          </button>
        </>
      )}
    </nav>
  )
}
