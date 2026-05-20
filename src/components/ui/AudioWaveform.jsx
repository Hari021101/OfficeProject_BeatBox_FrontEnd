import { useEffect, useRef } from 'react';

export default function AudioWaveform() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Track mouse positioning to make waveform interactive
    let mouse = { x: null, y: null, active: false };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
      mouse.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const setSize = () => {
      canvas.width = canvas.parentElement.offsetWidth || 500;
      canvas.height = canvas.parentElement.offsetHeight || 500;
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Audio Wave specifications
    let waveSettings = {
      speed: 0.05,
      noise: 0,
      phase: 0
    };

    const drawWave = (yCenter, amplitude, frequency, color, lineWidth, phaseShift) => {
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;

      // Add a soft glow to the active wave lines
      ctx.shadowBlur = lineWidth > 1 ? 8 : 2;
      ctx.shadowColor = color;

      for (let x = 0; x < canvas.width; x++) {
        // Create an organic wave shape that tapers down at the edges (bell curve envelope)
        const envelope = Math.sin((x / canvas.width) * Math.PI);
        
        // Sine wave calculations + dynamic interaction
        // If mouse is active near the X coordinate, add extra ripple amplitude
        let mouseRipple = 0;
        if (mouse.active && mouse.x !== null) {
          const distToMouse = Math.abs(x - mouse.x);
          if (distToMouse < 150) {
            // Taper force based on distance to mouse
            const force = (150 - distToMouse) / 150;
            mouseRipple = Math.sin(x * 0.08 + waveSettings.phase * 3) * 20 * force;
          }
        }

        const y = yCenter + 
          Math.sin(x * frequency + waveSettings.phase + phaseShift) * amplitude * envelope + 
          mouseRipple * envelope;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset glow
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dynamically accelerate or calm the waves depending on mouse interaction
      const targetSpeed = mouse.active ? 0.12 : 0.04;
      waveSettings.speed += (targetSpeed - waveSettings.speed) * 0.08;
      waveSettings.phase += waveSettings.speed;

      const yCenter = canvas.height / 2;

      // Draw 4 overlapping sine waves with different electric colors and phases
      // Deep Purple Background Glow Wave
      drawWave(
        yCenter, 
        mouse.active ? 70 : 50, 
        0.005, 
        'rgba(168, 32, 255, 0.25)', 
        1, 
        0
      );

      // Electric Cyan Middle Wave
      drawWave(
        yCenter, 
        mouse.active ? 90 : 65, 
        0.008, 
        'rgba(0, 243, 255, 0.45)', 
        2, 
        Math.PI * 0.4
      );

      // Cyber Pink Twinkling Foreground Wave
      drawWave(
        yCenter, 
        mouse.active ? 110 : 80, 
        0.012, 
        'rgba(255, 0, 240, 0.6)', 
        2.5, 
        Math.PI * 0.8
      );

      // Thin Neon Cyan sharp core line
      drawWave(
        yCenter, 
        mouse.active ? 40 : 30, 
        0.018, 
        '#00f3ff', 
        1.5, 
        Math.PI * 1.2
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'transparent',
        cursor: 'ns-resize'
      }} 
    />
  );
}
