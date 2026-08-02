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
