import { useState, useEffect, useRef } from 'react'

const TRACKS = [
  { id: '2099', name: 'Nueva York 2099', style: 'Cyber Synthwave' },
  { id: 'brooklyn', name: 'Brooklyn Rooftops', style: 'Lo-Fi Chill Hop' },
  { id: 'gwen', name: 'Gwen’s Drum Beat', style: 'Upbeat Rock' },
]

export default function AudioPlayerWidget({ muted }) {
  const [playing, setPlaying] = useState(false)
  const [trackIdx, setTrackIdx] = useState(0)
  const audioCtxRef = useRef(null)
  const timerRef = useRef(null)

  const currentTrack = TRACKS[trackIdx]

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (AC) audioCtxRef.current = new AC()
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  const playNote = (freq, duration, type = 'sine', gainVal = 0.08) => {
    const ctx = getAudioCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(gainVal, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration + 0.05)
  }

  useEffect(() => {
    if (!playing || muted) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    const chords2099 = [
      [220, 329.63, 392.0], // A minor 7
      [174.61, 261.63, 329.63], // F major 7
      [261.63, 329.63, 392.0], // C major
      [196.0, 293.66, 392.0], // G major
    ]

    const chordsBrooklyn = [
      [130.81, 164.81, 196.0], // C
      [146.83, 174.61, 220.0], // Dm
      [164.81, 196.0, 246.94], // Em
      [174.61, 220.0, 261.63], // F
    ]

    const chordsGwen = [
      [220, 277.18, 329.63],
      [196, 246.94, 293.66],
      [246.94, 311.13, 369.99],
      [220, 277.18, 329.63],
    ]

    const trackPool = trackIdx === 0 ? chords2099 : trackIdx === 1 ? chordsBrooklyn : chordsGwen
    const tempo = trackIdx === 2 ? 400 : trackIdx === 1 ? 800 : 550
    let step = 0

    timerRef.current = setInterval(() => {
      const chord = trackPool[step % trackPool.length]
      step++
      const oscType = trackIdx === 0 ? 'sawtooth' : trackIdx === 1 ? 'triangle' : 'square'
      chord.forEach((freq, i) => {
        setTimeout(() => {
          playNote(freq, (tempo / 1000) * 0.9, oscType, 0.05)
        }, i * 35)
      })
    }, tempo)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [playing, trackIdx, muted])

  const togglePlay = () => {
    setPlaying((p) => !p)
  }

  const nextTrack = () => {
    setTrackIdx((prev) => (prev + 1) % TRACKS.length)
  }

  return (
    <div className="radio-widget">
      <div className="radio-widget__left">
        <button
          className={`btn-radio-play ${playing ? 'is-playing' : ''}`}
          onClick={togglePlay}
          title={playing ? 'Jeda Musik' : 'Putar Musik Spider-Verse'}
        >
          {playing ? '⏸️' : '▶️'}
        </button>
        <div className="radio-widget__info">
          <span className="radio-track-title">📻 {currentTrack.name}</span>
          <span className="radio-track-style">{currentTrack.style}</span>
        </div>
      </div>

      <div className="radio-widget__right">
        {playing && (
          <div className="radio-equalizer">
            <span className="eq-bar bar-1" />
            <span className="eq-bar bar-2" />
            <span className="eq-bar bar-3" />
            <span className="eq-bar bar-4" />
          </div>
        )}
        <button className="btn-radio-next" onClick={nextTrack} title="Ganti Lagu">
          ⏭️
        </button>
      </div>
    </div>
  )
}
