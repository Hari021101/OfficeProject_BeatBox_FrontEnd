import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Mouse object to track cursor
    let mouse = {
      x: null,
      y: null,
      radius: 150 // The radius of the "clear" area around the mouse
    };

    // Track mouse globally so pointer-events: none on canvas doesn't break it
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseout', handleMouseLeave);
    window.addEventListener('touchend', handleMouseLeave);

    // Set canvas to full width/height of parent
    const setSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Use window inner dimensions as a fallback if the parent is temporarily hidden (0 width)
        canvas.width = parent.offsetWidth || window.innerWidth;
        canvas.height = parent.offsetHeight || window.innerHeight;
      }
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Extremely dense, tiny, electric floating dust
    const particles = [];
    const numParticles = 600; // Massive increase for a dense stardust field
    // Removed white, kept only pure high-opacity electric neon colors
    const colors = ['rgba(0, 243, 255, 0.9)', 'rgba(168, 32, 255, 0.8)'];

    class Particle {
      constructor() {
        // Spawn randomly across the entire fallback space so they never clump in the corner
        let w = canvas.width > 0 ? canvas.width : window.innerWidth;
        let h = canvas.height > 0 ? canvas.height : window.innerHeight;
        
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 1.0 + 0.2; // Extremely tiny dots
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Base velocity for default gentle flow
        this.baseVx = (Math.random() - 0.5) * 0.4;
        this.baseVy = (Math.random() - 0.5) * 0.4;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        
        // Weight determines how easily it is pushed
        this.weight = (Math.random() * 2) + 0.1; 
      }

      update() {
        // Slowly return to base gentle velocity if it was pushed
        this.vx += (this.baseVx - this.vx) * 0.05;
        this.vy += (this.baseVy - this.vy) * 0.05;

        // Apply movement
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen seamlessly
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Interaction: Cursor repels particles to create a "clear" area
        if (mouse.x != null && mouse.y != null) {
          let dx = this.x - mouse.x;
          let dy = this.y - mouse.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            // Pushing force based on how close it is to the mouse
            let force = (mouse.radius - distance) / mouse.radius;
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            
            // Apply a sudden push velocity
            this.vx += forceDirectionX * force * this.weight * 1.5;
            this.vy += forceDirectionY * force * this.weight * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        // Add a slight neon glow to each tiny dot
        ctx.shadowBlur = 4;
        ctx.shadowColor = this.color;
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for performance
      }
    }

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      // Completely clear canvas (no trailing effect, keeps it crisp and light)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('touchend', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Prevents blocking text selection
        zIndex: 1
      }} 
    />
  );
}
