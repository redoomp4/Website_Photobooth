import { playComicPop, playGlitch, playSpiderSense, playThwip } from '../utils/sound'

export default function SoundBoard({ muted, onToggleMute }) {
  return (
    <div className="soundBoard">
      <div className="soundBoard__label">SOUND BOARD SPIDEY</div>
      <div className="soundBoard__buttons">
        <button className="soundBtn soundBtn--thwip" onClick={() => !muted && playThwip()} title="Suara Jepretan Jaring">
          🕸️ THWIP!
        </button>
        <button className="soundBtn soundBtn--sense" onClick={() => !muted && playSpiderSense()} title="Suara Spider-Sense Tingling">
          ✨ SENSE
        </button>
        <button className="soundBtn soundBtn--glitch" onClick={() => !muted && playGlitch()} title="Suara Miles Glitch">
          ⚡ GLITCH
        </button>
        <button className="soundBtn soundBtn--pop" onClick={() => !muted && playComicPop()} title="Suara Comic Burst">
          💥 BAM!
        </button>
        <button className="soundBtn soundBtn--mute" onClick={onToggleMute}>
          {muted ? '🔇 MUTE' : '🔊 SUARA ON'}
        </button>
      </div>
    </div>
  )
}
