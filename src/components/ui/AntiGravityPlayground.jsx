import { useState, useEffect, useRef } from 'react'

export default function AntiGravityPlayground({ elements, onRestoreComplete }) {
  const [bodies, setBodies] = useState([])
  const [isRecovering, setIsRecovering] = useState(false)
  
  const bodiesRef = useRef([])
  const requestRef = useRef(null)
  const prevTimeRef = useRef(null)
  
  // Dragging interaction state
  const dragBodyIdRef = useRef(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const mousePosRef = useRef({ x: 0, y: 0 })
  const lastMousePosRef = useRef({ x: 0, y: 0 })
  const mouseVelRef = useRef({ x: 0, y: 0 })
  
  // 1. INITIALIZE PHYSICS BODIES ON MOUNT
  useEffect(() => {
    const initializedBodies = elements.map((el) => {
      const w = el.rect.width || 250
      const h = el.rect.height || 150
      const x = el.rect.left + w / 2
      const y = el.rect.top + h / 2
      
      // Calculate a reasonable mass proportional to the item's screen area
      const area = w * h
      const mass = Math.max(0.5, area / 25000)
      
      return {
        id: el.id,
        x: x,
        y: y,
        originalX: x,
        originalY: y,
        width: w,
        height: h,
        vx: (Math.random() - 0.5) * 6,     // Dynamic initial drift velocity
        vy: (Math.random() - 0.5) * 6 - 2, // Slight upward boost on launch
        angle: (Math.random() - 0.5) * 0.2, // Initial tilt (radians)
        va: (Math.random() - 0.5) * 0.03,  // Angular rotation speed
        mass: mass,
        render: el.render
      }
    })
    
    bodiesRef.current = initializedBodies
    setBodies(initializedBodies)
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [elements])
  
  // 2. THE HIGH-FREQUENCY PHYSICS INTEGRATION LOOP
  useEffect(() => {
    const updatePhysics = (timestamp) => {
      if (!prevTimeRef.current) {
        prevTimeRef.current = timestamp
      }
      
      const dt = Math.min(1.5, (timestamp - prevTimeRef.current) / 16.66) // Normalize timestep
      prevTimeRef.current = timestamp
      
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const timeSec = timestamp / 1000
      
      const currentBodies = [...bodiesRef.current]
      
      // Calculate mouse flinging velocity
      mouseVelRef.current = {
        x: mousePosRef.current.x - lastMousePosRef.current.x,
        y: mousePosRef.current.y - lastMousePosRef.current.y
      }
      lastMousePosRef.current = { ...mousePosRef.current }
      
      if (isRecovering) {
        // --- RECOVERY MODE: Lerp elements smoothly back to earth ---
        let allSettled = true
        
        currentBodies.forEach((body) => {
          const dx = body.originalX - body.x
          const dy = body.originalY - body.y
          const dAngle = 0 - body.angle
          
          body.x += dx * 0.15 * dt
          body.y += dy * 0.15 * dt
          body.angle += dAngle * 0.15 * dt
          
          // Clear velocities
          body.vx = 0
          body.vy = 0
          body.va = 0
          
          if (Math.abs(dx) > 1 || Math.abs(dy) > 1 || Math.abs(body.angle) > 0.01) {
            allSettled = false
          }
        })
        
        if (allSettled) {
          onRestoreComplete()
          return
        }
      } else {
        // --- NORMAL ZERO-G INTERACTION MODE ---
        
        // A. Apply motion physics and dragging states
        currentBodies.forEach((body) => {
          if (dragBodyIdRef.current && body.id === dragBodyIdRef.current) {
            // Under user drag control
            const targetX = mousePosRef.current.x - dragOffsetRef.current.x
            const targetY = mousePosRef.current.y - dragOffsetRef.current.y
            
            body.vx = (targetX - body.x) * 0.4
            body.vy = (targetY - body.y) * 0.4
            
            body.x = targetX
            body.y = targetY
            
            // Spinning under drag inertia
            body.va = body.vx * 0.015
            body.angle += body.va * dt
          } else {
            // Free Float Zero-Gravity physics
            
            // 1. Ambient Zero-G drift waves (buoyancy)
            body.vx += Math.sin(timeSec + body.originalX) * 0.05 * dt
            body.vy += Math.cos(timeSec * 0.8 + body.originalY) * 0.05 * dt
            
            // 2. Dampening (Air Friction)
            body.vx *= Math.pow(0.988, dt)
            body.vy *= Math.pow(0.988, dt)
            body.va *= Math.pow(0.975, dt)
            
            // 3. Update coordinates
            body.x += body.vx * dt
            body.y += body.vy * dt
            body.angle += body.va * dt
          }
          
          // B. Screen boundary bouncing (Elastic)
          const elasticity = 0.72
          const wHalf = body.width / 2
          const hHalf = body.height / 2
          
          // Bounce Left Wall
          if (body.x - wHalf < 0) {
            body.x = wHalf
            body.vx = -body.vx * elasticity
            body.va += body.vy * 0.008 // Bounce spins the body
          }
          // Bounce Right Wall
          if (body.x + wHalf > windowWidth) {
            body.x = windowWidth - wHalf
            body.vx = -body.vx * elasticity
            body.va -= body.vy * 0.008
          }
          // Bounce Top Ceiling
          if (body.y - hHalf < 0) {
            body.y = hHalf
            body.vy = -body.vy * elasticity
            body.va -= body.vx * 0.008
          }
          // Bounce Bottom Floor
          if (body.y + hHalf > windowHeight) {
            body.y = windowHeight - hHalf
            body.vy = -body.vy * elasticity
            body.va += body.vx * 0.008
          }
        })
        
        // C. Elastic Body-to-Body Collisions
        // We use circular overlaps for high-fidelity interactive performance
        for (let i = 0; i < currentBodies.length; i++) {
          for (let j = i + 1; j < currentBodies.length; j++) {
            const bodyA = currentBodies[i]
            const bodyB = currentBodies[j]
            
            const dx = bodyB.x - bodyA.x
            const dy = bodyB.y - bodyA.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            
            // Circular radii approximation based on rectangular dimensions
            const radiusA = (bodyA.width + bodyA.height) / 4.4
            const radiusB = (bodyB.width + bodyB.height) / 4.4
            const minDist = radiusA + radiusB
            
            if (dist < minDist) {
              const nx = dx / (dist || 1)
              const ny = dy / (dist || 1)
              const overlap = minDist - dist
              
              // 1. Resolve overlap penetration (push apart relative to mass)
              const totalMass = bodyA.mass + bodyB.mass
              if (!dragBodyIdRef.current || (bodyA.id !== dragBodyIdRef.current && bodyB.id !== dragBodyIdRef.current)) {
                bodyA.x -= nx * overlap * (bodyB.mass / totalMass)
                bodyA.y -= ny * overlap * (bodyB.mass / totalMass)
                bodyB.x += nx * overlap * (bodyA.mass / totalMass)
                bodyB.y += ny * overlap * (bodyA.mass / totalMass)
              } else if (bodyA.id === dragBodyIdRef.current) {
                // Dragged object pushes the static object out of the way
                bodyB.x += nx * overlap
                bodyB.y += ny * overlap
              } else {
                bodyA.x -= nx * overlap
                bodyA.y -= ny * overlap
              }
              
              // 2. Elastic speed exchange (1D Impulse along the collision normal)
              const rvx = bodyB.vx - bodyA.vx
              const rvy = bodyB.vy - bodyA.vy
              const speedAlongNormal = rvx * nx + rvy * ny
              
              if (speedAlongNormal < 0) {
                const bounceRestitution = 0.65
                let impulseMagnitude = -(1 + bounceRestitution) * speedAlongNormal
                impulseMagnitude /= (1 / bodyA.mass + 1 / bodyB.mass)
                
                const impulseX = impulseMagnitude * nx
                const impulseY = impulseMagnitude * ny
                
                if (bodyA.id !== dragBodyIdRef.current) {
                  bodyA.vx -= impulseX / bodyA.mass
                  bodyA.vy -= impulseY / bodyA.mass
                  bodyA.va += (impulseY * 0.003)
                }
                if (bodyB.id !== dragBodyIdRef.current) {
                  bodyB.vx += impulseX / bodyB.mass
                  bodyB.vy += impulseY / bodyB.mass
                  bodyB.va -= (impulseY * 0.003)
                }
              }
            }
          }
        }
      }
      
      bodiesRef.current = currentBodies
      setBodies([...currentBodies])
      
      requestRef.current = requestAnimationFrame(updatePhysics)
    }
    
    requestRef.current = requestAnimationFrame(updatePhysics)
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isRecovering, onRestoreComplete])
  
  // 3. MOUSE & TOUCH EVENT HANDLERS FOR PHYSICS INTERACTION
  const handleMouseDown = (e, body) => {
    // Left clicks only
    if (e.button !== 0 && e.type === 'mousedown') return
    
    dragBodyIdRef.current = body.id
    
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
    
    dragOffsetRef.current = {
      x: clientX - body.x,
      y: clientY - body.y
    }
    
    mousePosRef.current = { x: clientX, y: clientY }
    lastMousePosRef.current = { x: clientX, y: clientY }
  }
  
  const handleMouseMove = (e) => {
    if (!dragBodyIdRef.current) return
    
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY
    
    mousePosRef.current = { x: clientX, y: clientY }
  }
  
  const handleMouseUp = () => {
    if (!dragBodyIdRef.current) return
    
    // Apply flinging velocity impulse from mouse speed upon release
    const activeBody = bodiesRef.current.find((b) => b.id === dragBodyIdRef.current)
    if (activeBody) {
      activeBody.vx = mouseVelRef.current.x * 0.8
      activeBody.vy = mouseVelRef.current.y * 0.8
      activeBody.va = activeBody.vx * 0.02
    }
    
    dragBodyIdRef.current = null
  }
  
  const triggerRestore = () => {
    setIsRecovering(true)
  }
  
  return (
    <div 
      className="position-fixed top-0 left-0 w-100 h-100 overflow-hidden"
      style={{
        zIndex: 9999,
        background: 'radial-gradient(circle at center, rgba(4, 7, 18, 0.96) 0%, rgba(2, 4, 10, 0.99) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        pointerEvents: 'auto',
        userSelect: 'none'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Dynamic scanlines for cyber physics lab look */}
      <div 
        className="position-absolute w-100 h-100 top-0 left-0"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 243, 255, 0.03) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.01), rgba(0, 255, 0, 0.005), rgba(0, 0, 255, 0.01))',
          backgroundSize: '100% 4px, 6px 100%',
          pointerEvents: 'none'
        }}
      ></div>
      
      {/* Floating control dashboard at the top center */}
      <div className="position-absolute top-0 start-50 translate-middle-x mt-4 z-3 text-center">
        <div className="d-flex flex-column align-items-center gap-2">
          <span className="text-uppercase tracking-wider small fw-black text-white-50 d-block" style={{ letterSpacing: '2px' }}>
            🌌 Defying gravity in orbital sandbox 🌌
          </span>
          <button 
            onClick={triggerRestore}
            className="btn btn-glow px-4 py-3 d-flex align-items-center gap-2 fw-bold text-uppercase"
            style={{ 
              borderRadius: '50px',
              fontSize: '0.85rem',
              background: 'linear-gradient(135deg, #a820ff, #00f3ff)',
              boxShadow: '0 0 25px rgba(0, 243, 255, 0.4)'
            }}
          >
            🌍 RESTORE GRAVITY
          </button>
        </div>
      </div>
      
      {/* RENDER FLOATING PHYSICAL BODIES */}
      {bodies.map((body) => (
        <div
          key={body.id}
          className="position-absolute cursor-grab active-cursor-grabbing"
          style={{
            left: body.x,
            top: body.y,
            width: body.width,
            height: body.height,
            transform: `translate(-50%, -50%) rotate(${body.angle}rad)`,
            transformOrigin: 'center center',
            zIndex: dragBodyIdRef.current === body.id ? 1000 : 50,
            transition: isRecovering ? 'transform 0.1s linear' : 'none',
            touchAction: 'none'
          }}
          onMouseDown={(e) => handleMouseDown(e, body)}
          onTouchStart={(e) => handleMouseDown(e, body)}
        >
          {/* We wrap the component clone so the children elements can be hovered/interacted with normally */}
          <div 
            style={{ 
              width: '100%', 
              height: '100%', 
              pointerEvents: 'auto',
              // Add simple visual glow indicator to dragged boxes
              boxShadow: dragBodyIdRef.current === body.id ? '0 0 35px var(--bb-accent-glow)' : 'none',
              borderRadius: '16px',
              transition: 'box-shadow 0.2s ease'
            }}
          >
            {body.render()}
          </div>
        </div>
      ))}
      
    </div>
  )
}
