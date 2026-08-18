// Web Audio API Synthesizer untuk Cobweb Spider-Verse Photobooth
// Menggunakan sintesis audio murni tanpa ketergantungan file eksternal

let ctx = null
let ambientOsc1 = null
let ambientOsc2 = null
let ambientGain = null
let ambientInterval = null

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

export function playBeep(freq = 880, dur = 0.12, type = 'sine', gainVal = 0.15) {
  const c = getCtx()
  if (!c) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, c.currentTime)
  gain.gain.setValueAtTime(gainVal, c.currentTime)
  osc.connect(gain).connect(c.destination)
  osc.start()
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur)
  osc.stop(c.currentTime + dur + 0.03)
}

export function playShutter() {
  const c = getCtx()
  if (!c) return
  const bufferSize = Math.floor(c.sampleRate * 0.08)
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }
  const noise = c.createBufferSource()
  noise.buffer = buffer
  const gain = c.createGain()
  gain.gain.value = 0.4
  noise.connect(gain).connect(c.destination)
  noise.start()

  // mechanical shutter click
  playBeep(2200, 0.03, 'square', 0.1)
  setTimeout(() => {
    playBeep(1200, 0.04, 'square', 0.08)
  }, 40)
}

export function playThwip() {
  const c = getCtx()
  if (!c) return

  // Pitch sweep oscillator (high pitch dropping rapidly to low frequency)
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(2600, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(140, c.currentTime + 0.14)

  gain.gain.setValueAtTime(0.4, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.14)

  osc.connect(gain).connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + 0.15)

  // White noise whip snap
  const bufferSize = Math.floor(c.sampleRate * 0.1)
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25))
  }
  const noise = c.createBufferSource()
  noise.buffer = buffer

  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 3500
  filter.Q.value = 2.5

  const noiseGain = c.createGain()
  noiseGain.gain.setValueAtTime(0.45, c.currentTime)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.09)

  noise.connect(filter).connect(noiseGain).connect(c.destination)
  noise.start()
}

export function playSpiderSense() {
  const c = getCtx()
  if (!c) return

  const notes = [1046.5, 1318.5, 1567.98, 2093, 2637]
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playBeep(freq, 0.18, 'sawtooth', 0.12)
    }, idx * 40)
  })
}

export function playBoom() {
  const c = getCtx()
  if (!c) return

  // Low punch sub bass
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(160, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(30, c.currentTime + 0.35)

  gain.gain.setValueAtTime(0.6, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35)
  osc.connect(gain).connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + 0.36)

  // Crash noise
  const bufferSize = Math.floor(c.sampleRate * 0.25)
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2))
  }
  const noise = c.createBufferSource()
  noise.buffer = buffer

  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1800

  const noiseGain = c.createGain()
  noiseGain.gain.setValueAtTime(0.5, c.currentTime)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25)

  noise.connect(filter).connect(noiseGain).connect(c.destination)
  noise.start()
}

export function playGlitch() {
  const c = getCtx()
  if (!c) return

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const freq = 300 + Math.random() * 2400
      playBeep(freq, 0.04, 'square', 0.12)
    }, i * 35)
  }
}

export function playPowerUp() {
  const c = getCtx()
  if (!c) return

  const chord = [523.25, 659.25, 783.99, 1046.5]
  chord.forEach((freq, idx) => {
    setTimeout(() => {
      playBeep(freq, 0.2, 'sine', 0.15)
    }, idx * 60)
  })
}

// Background superhero synth pulse
export function startAmbient() {
  const c = getCtx()
  if (!c || ambientInterval) return

  const chords = [
    [130.81, 196.0, 246.94], // C major / A minor feel
    [116.54, 174.61, 233.08], // Bb
    [98.0, 146.83, 196.0],   // G
    [110.0, 164.81, 220.0],  // A
  ]
  let step = 0

  ambientInterval = setInterval(() => {
    const current = chords[step % chords.length]
    step++
    current.forEach((freq) => {
      playBeep(freq, 0.45, 'triangle', 0.04)
    })
  }, 600)
}

export function stopAmbient() {
  if (ambientInterval) {
    clearInterval(ambientInterval)
    ambientInterval = null
  }
}
