let ctx = null

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function playBeep(freq = 880, dur = 0.12, type = 'sine', gainVal = 0.15) {
  const c = getCtx()
  if (!c) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.value = gainVal
  osc.connect(gain).connect(c.destination)
  osc.start()
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur)
  osc.stop(c.currentTime + dur + 0.03)
}

export function playShutter() {
  const c = getCtx()
  if (!c) return
  const bufferSize = Math.floor(c.sampleRate * 0.06)
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }
  const noise = c.createBufferSource()
  noise.buffer = buffer
  const gain = c.createGain()
  gain.gain.value = 0.35
  noise.connect(gain).connect(c.destination)
  noise.start()
  // add a quick high blip on top for a "click"
  playBeep(1800, 0.04, 'square', 0.08)
}

export function playThwip() {
  const c = getCtx()
  if (!c) return

  // Pitch sweep oscillator (high pitch dropping rapidly to low frequency)
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(2400, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(180, c.currentTime + 0.12)

  gain.gain.setValueAtTime(0.35, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12)

  osc.connect(gain).connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + 0.13)

  // White noise whip snap
  const bufferSize = Math.floor(c.sampleRate * 0.08)
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2))
  }
  const noise = c.createBufferSource()
  noise.buffer = buffer

  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 3200
  filter.Q.value = 3

  const noiseGain = c.createGain()
  noiseGain.gain.setValueAtTime(0.4, c.currentTime)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08)

  noise.connect(filter).connect(noiseGain).connect(c.destination)
  noise.start()
}

export function playSpiderSense() {
  const c = getCtx()
  if (!c) return

  const notes = [1046.5, 1318.5, 1567.98, 2093]
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playBeep(freq, 0.15, 'sine', 0.2)
    }, idx * 45)
  })
}

export function playGlitch() {
  const c = getCtx()
  if (!c) return

  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(150, c.currentTime)
  osc.frequency.setValueAtTime(800, c.currentTime + 0.03)
  osc.frequency.setValueAtTime(300, c.currentTime + 0.06)
  osc.frequency.setValueAtTime(1200, c.currentTime + 0.09)

  gain.gain.setValueAtTime(0.25, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.14)

  osc.connect(gain).connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + 0.15)
}

export function playComicPop() {
  const c = getCtx()
  if (!c) return

  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(120, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.08)

  gain.gain.setValueAtTime(0.4, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1)

  osc.connect(gain).connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + 0.11)
}

let ambientTimer = null
export function startAmbient(muted) {
  stopAmbient()
  if (muted) return
  const notes = [220, 277.18, 329.63, 392, 329.63, 277.18]
  let i = 0
  ambientTimer = setInterval(() => {
    playBeep(notes[i % notes.length], 0.35, 'triangle', 0.045)
    i++
  }, 420)
}
export function stopAmbient() {
  if (ambientTimer) clearInterval(ambientTimer)
  ambientTimer = null
}

