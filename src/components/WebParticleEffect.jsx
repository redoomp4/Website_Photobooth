import { useEffect, useRef } from 'react'

const DIM_COLORS = {
  earth616: { node: 'rgba(230, 57, 70, 0.5)', strand: 'rgba(255, 230, 0, 0.25)', mouse: 'rgba(0, 229, 255, 0.45)' },
  earth1610: { node: 'rgba(0, 229, 255, 0.6)', strand: 'rgba(255, 0, 85, 0.3)', mouse: 'rgba(0, 229, 255, 0.6)' },
  earth65: { node: 'rgba(255, 0, 127, 0.55)', strand: 'rgba(0, 245, 212, 0.3)', mouse: 'rgba(255, 0, 127, 0.6)' },
  earth90214: { node: 'rgba(161, 161, 170, 0.4)', strand: 'rgba(244, 244, 245, 0.2)', mouse: 'rgba(212, 212, 216, 0.4)' },
  earth138: { node: 'rgba(255, 230, 0, 0.6)', strand: 'rgba(244, 63, 94, 0.35)', mouse: 'rgba(255, 230, 0, 0.6)' },
}

export default function WebParticleEffect({ dimension = 'earth616' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const mouse = { x: null, y: null, maxDist: 150 }
    const webBursts = [] // on click web burst ripples

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    const handleClick = (e) => {
      webBursts.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 70,
        opacity: 0.8,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('click', handleClick)

    const colors = DIM_COLORS[dimension] || DIM_COLORS.earth616

    // Node particles
    const particleCount = Math.min(38, Math.floor((width * height) / 26000))
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        radius: Math.random() * 2 + 1.5,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw Click Web-Bursts
      for (let b = webBursts.length - 1; b >= 0; b--) {
        const burst = webBursts[b]
        burst.radius += 2.8
        burst.opacity -= 0.035

        if (burst.opacity <= 0 || burst.radius >= burst.maxRadius) {
          webBursts.splice(b, 1)
          continue
        }

        ctx.save()
        ctx.beginPath()
        ctx.arc(burst.x, burst.y, burst.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 229, 255, ${burst.opacity})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        // 8 radiating web strands
        for (let a = 0; a < 8; a++) {
          const angle = (a * Math.PI) / 4
          ctx.beginPath()
          ctx.moveTo(burst.x, burst.y)
          ctx.lineTo(
            burst.x + Math.cos(angle) * burst.radius,
            burst.y + Math.sin(angle) * burst.radius
          )
          ctx.strokeStyle = `rgba(255, 230, 0, ${burst.opacity * 0.8})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
        ctx.restore()
      }

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // Draw node
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = colors.node
        ctx.fill()

        // Connect particles with web strands
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(248, 249, 250, ${0.16 * (1 - dist / 120)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }

        // Connect to mouse cursor with elastic spider thread
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < mouse.maxDist) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = colors.mouse
            ctx.lineWidth = 1.2
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('click', handleClick)
      cancelAnimationFrame(animationFrameId)
    }
  }, [dimension])

  return (
    <canvas
      ref={canvasRef}
      className="web-particle-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
