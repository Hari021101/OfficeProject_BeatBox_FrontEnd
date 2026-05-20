import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animFrameId
    let width, height
    const PARTICLE_COUNT = 80
    const CONNECTION_DISTANCE = 130
    const particles = []

    const resize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    class Particle {
      constructor() {
        this.reset()
      }
      reset() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.6
        this.vy = (Math.random() - 0.5) * 0.6
        this.radius = Math.random() * 2 + 1.5
        // Alternate between cyan and purple tones
        const colors = [
          `rgba(0, 243, 255`,    // Electric Cyan
          `rgba(168, 32, 255`,   // Neon Purple
          `rgba(120, 180, 255`,  // Ice Blue
        ]
        this.baseColor = colors[Math.floor(Math.random() * colors.length)]
        this.opacity = Math.random() * 0.5 + 0.4
        this.pulseSpeed = Math.random() * 0.03 + 0.01
        this.pulseOffset = Math.random() * Math.PI * 2
      }
      update(t) {
        this.x += this.vx
        this.y += this.vy
        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1
        // Gentle pulse in opacity
        this.currentOpacity = this.opacity + Math.sin(t * this.pulseSpeed + this.pulseOffset) * 0.2
      }
      draw() {
        // Glow effect: large soft halo
        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4)
        glow.addColorStop(0, `${this.baseColor}, ${this.currentOpacity})`)
        glow.addColorStop(0.4, `${this.baseColor}, ${this.currentOpacity * 0.4})`)
        glow.addColorStop(1, `${this.baseColor}, 0)`)
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Solid core dot
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${this.baseColor}, ${Math.min(1, this.currentOpacity + 0.3)})`
        ctx.fill()
      }
    }

    const init = () => {
      resize()
      particles.length = 0
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle())
      }
    }

    let tick = 0
    const animate = () => {
      tick++
      ctx.clearRect(0, 0, width, height)

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.35
            // Gradient line between two particle colors
            const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y)
            grad.addColorStop(0, `rgba(0, 243, 255, ${alpha})`)
            grad.addColorStop(1, `rgba(168, 32, 255, ${alpha})`)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = grad
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // Update and draw each particle
      for (const p of particles) {
        p.update(tick)
        p.draw()
      }

      animFrameId = requestAnimationFrame(animate)
    }

    init()
    animate()

    const handleResize = () => {
      resize()
      // Reposition particles within new bounds
      for (const p of particles) {
        if (p.x > width) p.x = Math.random() * width
        if (p.y > height) p.y = Math.random() * height
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
